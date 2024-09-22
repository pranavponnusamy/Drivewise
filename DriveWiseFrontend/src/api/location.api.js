import axios from "axios";
import { createToast } from "../components/Toast.component";

const API_KEY = "4ETKUW0L7hQbCL0cHaNPBgJKSbM9UhVd";
const route = "https://drivewisebackend-7b2ac3916433.herokuapp.com";

export const getSpeedLimitData = async (lat, long) => {
  try {
    const res = await axios.post(
      `https://www.mapquestapi.com/geocoding/v1/reverse?key=${API_KEY}`,
      {
        location: {
          latLng: {
            lat: lat,
            lng: long,
          },
        },
        includeRoadMetadata: "true",
      }
    );
    return res.data.results[0].locations[0].roadMetadata.speedLimit;
  } catch (error) {
    return null;
  }
};

export const addAccident = async (lat, long) => {
  try {
    const res = await axios.post(`${route}/location/save`, {
      lat,
      long,
    });

    await axios.post(
      "https://4b87-2600-1700-1a33-3190-ba85-84ff-feb2-f84a.ngrok-free.app/accident",
      {
        lat,
        long,
      }
    );
    createToast("success", "Accident reported successfully");
    return res.data;
  } catch (error) {
    console.log("Did not work");
    return null;
  }
};

export const getAccidents = async () => {
  try {
    const res = await axios.get(`${route}/location`);
    return res.data;
  } catch (error) {
    return null;
  }
};
