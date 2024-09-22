import axios from "axios";
const route = "https://drivewisebackend-7b2ac3916433.herokuapp.com";

// const route = "http://localhost:5001";

export const createUser = async (userId) => {
  try {
    console.log("run", userId);
    const res = await axios.post(`${route}/user/createUser`, {
      userId: userId,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (userId) => {
  try {
    const res = await axios.get(`${route}/user/get/${userId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewTrip = async (trip, userId) => {
  try {
    const res = await axios.post(`${route}/user/addTrip`, {
      trip,
      userId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addSkillReq = async (skill, userId) => {
  try {
    const res = await axios.post(`${route}/user/addSkill`, {
      skill,
      userId,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDrivingLevelReq = async (drivingLevel, userId) => {
  try {
    const res = await axios.post(`${route}/user/updateDrivingLevel`, {
      drivingLevel,
      userId,
    });
  } catch (error) {
    console.log(error);
  }
};
