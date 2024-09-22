import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const LearnScreen = ({ navigation }) => {
  // Make sure to include navigation prop here
  const skills = [
    {
      name: "Lane Changing",
      description:
        "Lane changing requires proper judgment and awareness of your surroundings. Always check your mirrors and blind spots before changing lanes. Signaling well in advance alerts other drivers of your intention to switch lanes, which reduces the risk of accidents. Avoid sudden lane changes or weaving through traffic, especially at high speeds.\n\n" +
        "In heavy traffic or on highways, keep a safe distance between your vehicle and others. This gives you more space to maneuver safely. Being patient and making calculated moves during lane changes will keep you and other drivers safe on the road.",
      image: require("../../../assets/learn/lane_changing.jpg"),
    },
    {
      name: "Highway Merging",
      description:
        "Merging onto highways can be stressful, especially when traffic is moving quickly. The key to successful merging is timing. Start by increasing your speed on the entrance ramp so that you match the speed of the highway traffic. Always use your signal to inform other drivers of your intention to merge. Look for a gap in traffic where you can safely fit your vehicle and smoothly transition into the lane.\n\n" +
        "Avoid stopping at the end of an acceleration lane, as this can cause a dangerous situation for both you and other drivers. If the highway is congested, you may need to wait for a safe gap, but try to maintain your speed while keeping an eye on both the traffic ahead and the side mirrors for merging vehicles.",
      image: require("../../../assets/learn/highway_merging.jpg"),
    },
    {
      name: "Night Driving",
      description:
        "Driving at night can be challenging due to reduced visibility and the glare from headlights of oncoming vehicles. To enhance your safety, ensure your headlights are clean and properly aligned. Dim your dashboard lights to reduce reflection and keep your eyes focused on the road ahead. If the headlights of oncoming cars are too bright, avoid looking directly at them. Instead, focus on the white line on the side of the road to maintain your lane.\n\n" +
        "Night driving requires more caution, as fatigue and drowsiness can affect your concentration. Take regular breaks on long journeys and avoid driving late at night if you're feeling tired. Stay alert and always watch for pedestrians, cyclists, or animals that may not be as visible in low-light conditions.",
      image: require("../../../assets/learn/night_driving.jpg"),
    },
    {
      name: "Parallel Parking",
      description:
        "Parallel parking is an essential skill that helps you navigate tight spaces in urban areas. Start by pulling up next to the vehicle in front of the parking spot and aligning your car’s rear bumper with theirs. Put your vehicle in reverse and slowly back into the space, turning the wheel sharply to angle your car into the spot. Straighten the wheel once you’re halfway in, and adjust as necessary to position your car evenly between the vehicles in front and behind you.\n\n" +
        "Patience and precision are key to mastering parallel parking. Always check your surroundings and use your mirrors to avoid hitting other cars or curbs. Practice in less busy areas before attempting parallel parking on crowded streets to build your confidence.",
      image: require("../../../assets/learn/parallel_parking.jpg"),
    },
    {
      name: "Driving in Fog",
      description:
        "Driving in fog requires extra caution due to significantly reduced visibility. Use your low-beam headlights, as high beams can reflect off the fog and reduce your visibility even further. Slow down and maintain a greater following distance to give yourself more time to react to sudden stops or obstacles.\n\n" +
        "Stay focused on the road by avoiding distractions and keeping your eyes on the lane markings. If the fog becomes too thick and visibility drops to dangerous levels, it’s safer to pull off the road and wait until conditions improve.",
      image: require("../../../assets/learn/driving_in_fog.jpeg"),
    },
    {
      name: "Using Cruise Control",
      description:
        "Cruise control is a useful feature for maintaining a steady speed on highways, but it should only be used in certain conditions. Avoid using cruise control in heavy traffic, during bad weather, or on roads with sharp curves, as you need full control over your vehicle in these situations. When cruise control is engaged, keep your feet close to the pedals in case you need to quickly brake or accelerate.\n\n" +
        "Using cruise control can help reduce fatigue on long trips, as it minimizes the need to constantly adjust your speed. However, always remain alert and ready to disengage it if traffic or road conditions change.",
      image: require("../../../assets/learn/cruise_control.jpg"),
    },
  ];

  const selectSkill = (skill) => {
    // Navigate to SkillDetailScreen, passing the selected skill as a parameter
    navigation.navigate("SkillDetail", { skill });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.skillsListContainer}>
        <FlatList
          data={skills}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.skillBox}
              onPress={() => selectSkill(item)} // This uses the navigation prop to navigate
            >
              <Text style={styles.skillText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skillsListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  skillBox: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  skillText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LearnScreen;
