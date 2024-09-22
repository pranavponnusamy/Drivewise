from flask import Flask, request, jsonify
import numpy as np
import json
import os
import pandas as pd
import osmnx as ox
import networkx as nx
import numpy as np
from sklearn.neighbors import BallTree
import math
from heapq import heappush, heappop
from shapely.geometry import Point
from functools import partial

# Preprocessing
accident_file_path = 'lat_long.csv'
accidents_df = pd.read_csv(accident_file_path)
place_name = 'Philadelphia County, Pennsylvania, USA'
G = ox.graph_from_place(place_name, network_type='drive')
nodes, edges = ox.graph_to_gdfs(G)


def map_accidents_to_edges(G, accidents, buffer_dist=69):
    """
    Map accidents to the nearest edges using BallTree for efficient spatial queries.
    """
    # Ensure edges have an 'accident_count' attribute
    for u, v, key in G.edges(keys=True):
        G[u][v][key]['accident_count'] = 0

    # Create a list of edge midpoint coordinates for the BallTree
    edge_coords = []
    edge_keys = []
    for u, v, key in G.edges(keys=True):
        u_coord = np.array([G.nodes[u]['y'], G.nodes[u]['x']])  # [lat, lon]
        v_coord = np.array([G.nodes[v]['y'], G.nodes[v]['x']])
        midpoint = (u_coord + v_coord) / 2  # Midpoint of the edge
        edge_coords.append(midpoint)
        edge_keys.append((u, v, key))

    edge_coords = np.array(edge_coords)

    # Create BallTree with edge midpoints (in radians for haversine distance)
    edge_tree = BallTree(np.deg2rad(edge_coords), metric='haversine')

    # Convert accident points to radians for BallTree queries
    accident_coords = np.deg2rad(accidents[['XCOORD', 'YCOORD']].values)

    # Query BallTree to find nearest edges to each accident
    distances, indices = edge_tree.query(accident_coords, k=1)  # k=1 for the nearest edge

    # Convert distances to meters
    earth_radius = 6371000  # meters
    distances_in_meters = distances.flatten() * earth_radius

    # Update accident count for the nearest edges within buffer_dist
    for dist, idx in zip(distances_in_meters, indices.flatten()):
        if dist <= buffer_dist:
            u, v, key = edge_keys[idx]
            G[u][v][key]['accident_count'] += 1

    return G

def filter_accidents_within_graph(accidents_df, G):
    """
    Filters the accidents to those within the bounding box of the graph G.
    """
    # Get bounding box of the graph
    node_coords = np.array([[data['x'], data['y']] for node, data in G.nodes(data=True)])
    min_lon, min_lat = node_coords.min(axis=0)
    max_lon, max_lat = node_coords.max(axis=0)

    # Filter accidents within the bounding box
    accidents_df_filtered = accidents_df[
        (accidents_df['XCOORD'] >= min_lat) & (accidents_df['XCOORD'] <= max_lat) &
        (accidents_df['YCOORD'] >= min_lon) & (accidents_df['YCOORD'] <= max_lon)
    ]

    return accidents_df_filtered


accidents_df_filtered = filter_accidents_within_graph(accidents_df, G)
G = map_accidents_to_edges(G, accidents_df_filtered, buffer_dist=50)
non_zero_accident_edges = [(u, v, k) for u, v, k, data in G.edges(keys=True, data=True) if data['accident_count'] > 0]
print(f"Number of edges with non-zero accident counts: {len(non_zero_accident_edges)}")


def calculate_turn_angle(u, v, w, G):
    """
    Calculate the angle between the incoming edge (u -> v) and outgoing edge (v -> w).
    Returns the angle in degrees.
    """
    # Get coordinates
    u_coord = np.array([G.nodes[u]['x'], G.nodes[u]['y']])
    v_coord = np.array([G.nodes[v]['x'], G.nodes[v]['y']])
    w_coord = np.array([G.nodes[w]['x'], G.nodes[w]['y']])

    # Vectors
    vec1 = u_coord - v_coord
    vec2 = w_coord - v_coord

    # Calculate angle
    dot_prod = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)

    if norm1 == 0 or norm2 == 0:
        return 0  # No turn

    cos_angle = dot_prod / (norm1 * norm2)
    cos_angle = np.clip(cos_angle, -1, 1)
    angle = math.degrees(math.acos(cos_angle))

    return angle

def add_turn_penalties(G, angle_threshold=45, fixed_turn_penalty=50):
    """
    Modify edge weights to include turn penalties based on the angle of turn.
    """
    # Initialize turn penalties
    for u, v, key in G.edges(keys=True):
        G[u][v][key]['turn_penalty'] = 0  # Initialize with no penalty

    # Iterate over all nodes to assign turn penalties
    for node in G.nodes:
        in_edges = list(G.in_edges(node, keys=True))
        out_edges = list(G.out_edges(node, keys=True))

        for in_edge in in_edges:
            for out_edge in out_edges:
                u, v, key_in = in_edge
                v, w, key_out = out_edge
                if w == u:  # Avoid U-turns
                    continue
                angle = calculate_turn_angle(u, v, w, G)

                if angle > angle_threshold:
                    # Apply a fixed turn penalty to the outgoing edge
                    G[v][w][key_out]['turn_penalty'] += fixed_turn_penalty
    return G

# Apply turn penalties
G = add_turn_penalties(G, angle_threshold=45, fixed_turn_penalty=50)

def adjust_edge_weights(G, driver_skill=0.5, base_weight_factor=1.0, accident_weight=1000.0, turn_weight=10.0):
    """
    Adjust edge weights based on driver_skill, accident density, and turn penalties.
    """
    for u, v, key, data in G.edges(keys=True, data=True):
        # Base weight (distance in meters)
        base_weight = data.get('length', 1) * base_weight_factor

        # Safety weight based on accident density
        accident_count = data.get('accident_count', 0)
        safety_weight = accident_weight * accident_count  # Higher accidents -> higher weight

        # Turn penalty
        turn_penalty = data.get('turn_penalty', 0)

        # Composite weight
        composite_weight = base_weight + safety_weight * (1 - driver_skill) + turn_penalty * turn_weight * driver_skill

        # Assign the composite weight to the edge
        G[u][v][key]['weight'] = composite_weight
    return G

def find_route_with_driver_skill(G, origin_node, destination_node, driver_skill=0.5):
    """
    Find a route based on the driver's skill level.
    """
    # Adjust edge weights based on driver_skill
    G_adjusted = adjust_edge_weights(G, driver_skill=driver_skill, base_weight_factor=1.0, accident_weight=1000.0, turn_weight=10.0)

    # Define heuristic function for A*
    heuristic = lambda u, v: ox.distance.great_circle(
        G_adjusted.nodes[u]['y'], G_adjusted.nodes[u]['x'],
        G_adjusted.nodes[v]['y'], G_adjusted.nodes[v]['x']
    )

    try:
        route = nx.astar_path(G_adjusted, origin_node, destination_node, heuristic=heuristic, weight='weight')
    except nx.NetworkXNoPath:
        print("No path found between the origin and destination.")
        return None

    return route

def count_turns(route, G, angle_threshold=45):
    """
    Count the number of significant turns in a given route.
    """
    turns = 0
    for i in range(2, len(route)):
        u, v, w = route[i-2], route[i-1], route[i]
        angle = calculate_turn_angle(u, v, w, G)
        if angle > angle_threshold:
            turns += 1
    return turns


# New Functions for Metrics

def compute_danger_score(route, G):
    """
    Compute the danger score for a given route by summing the accident counts on all edges.
    """
    danger_score = 0
    for i in range(len(route) - 1):
        u = route[i]
        v = route[i + 1]
        # There might be multiple keys between u and v; choose the first one
        edge_data = G.get_edge_data(u, v)
        if edge_data is None:
            continue
        # If multiple parallel edges exist, sum their accident counts
        edge_accidents = sum([data.get('accident_count', 0) for key, data in edge_data.items()])
        danger_score += edge_accidents
    return danger_score


app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/routes", methods=['GET', 'POST'])
def get_route():
    if request.method == 'POST':
        data = request.get_json()

        # Parse input from the JSON request
        start_lat = data.get("start_lat")
        start_long = data.get("start_long")
        end_lat = data.get("end_lat")
        end_long = data.get("end_long")
        driver_skill = data.get("driver_skill")  # Use snake_case for consistency

        # Validate the input
        if not all([start_lat, start_long, end_lat, end_long]):
            return jsonify({"error": "Missing coordinates"}), 400

        # Compute the route
        result, status_code = computeRoute((start_lat, start_long), (end_lat, end_long), driver_skill)
        return result, status_code
    else:
        return "<p>Hello, World!</p>" 


@app.route("/accident", methods=['GET','POST'])
def add_accident():
    if request.method == 'POST':
        data = request.get_json()
        lat = data.get("lat")
        long = data.get("long")
        
        if not all([lat, long]):
            return jsonify({"error": "Missing coordinates"}), 400
        
        with open("lat_long.csv", 'a') as file:
            file.write(f"\n{lat}, {long}")
        return "<p>All good</p>"
    else:
        return "<p>Hello, World!</p>"
    

# def process_accel(data):
#     # Placeholder for actual acceleration processing logic
#     return {"message": "Acceleration data processed"}



# def processAccel():
#     return
    
        

def computeRoute(startCoordinates, endCoordinates, driverSkill):
    origin_lat, origin_lon = startCoordinates
    destination_lat, destination_lon = endCoordinates

    origin_node = ox.distance.  nearest_nodes(G, X=origin_lon, Y=origin_lat)
    destination_node = ox.distance.nearest_nodes(G, X=destination_lon, Y=destination_lat)

    route = find_route_with_driver_skill(G, origin_node, destination_node, driverSkill)
    turns = count_turns(route, G)

    route_nodes = [{"latitude": G.nodes[n]['y'], "longitude" :G.nodes[n]['x']} for n in route]

    json_data = {
        'waypoints': [

        ],
        
        "accidents":[
            
        ],
        
        "metrics":[
            
        ]
    }

    for route_node in route_nodes  :
        json_data["waypoints"].append(route_node)

    route = find_route_with_driver_skill(G, origin_node, destination_node, driverSkill)
    all_route_nodes = []
    if route:
        all_route_nodes.extend(route)

    if all_route_nodes:
        route_node_coords = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in all_route_nodes]
        min_lat = min(coord[0] for coord in route_node_coords)
        max_lat = max(coord[0] for coord in route_node_coords)
        min_lon = min(coord[1] for coord in route_node_coords)
        max_lon = max(coord[1] for coord in route_node_coords)

        # Filter accidents within bounding box
        filtered_accidents = accidents_df[
            (accidents_df['XCOORD'] >= min_lat) &
            (accidents_df['XCOORD'] <= max_lat) &
            (accidents_df['YCOORD'] >= min_lon) &
            (accidents_df['YCOORD'] <= max_lon)
        ]

        
    accident_nodes = [{"latitude": row['XCOORD'], "longitude": row['YCOORD']} for index, row in filtered_accidents.iterrows()]
        
    for acc in accident_nodes:    
        json_data["accidents"].append(acc)
    
    danger_score = compute_danger_score(route, G)
    
    
    json_data["metrics"].append({"danger_score": danger_score})
    json_data["metrics"].append({"turns ": turns})
    
        
    return json_data, 202

        

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host = "0.0.0.0", port = port)
