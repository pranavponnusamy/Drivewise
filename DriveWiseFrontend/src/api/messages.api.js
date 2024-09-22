import axios from "axios";
const route = "https://drivewisebackend-7b2ac3916433.herokuapp.com";
// const route = "http://localhost:5001";

export const sendMessage = async (message, history) => {
  try {
    const res = await axios.post(`${route}/chat/ask`, {
      message,
      history,
    });
    return res.data.response;
  } catch (error) {
    console.log(error);
  }
};

export const sendYashMessage = async (message) => {
  try {
    console.log("Run");
    const res = await axios.post(`${route}/message/yash`, {
      message,
    });
    return res.data.response;
  } catch (error) {
    console.log(error);
  }
};
