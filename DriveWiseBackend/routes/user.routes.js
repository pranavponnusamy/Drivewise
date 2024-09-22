const express = require("express");
const router = express.Router();

const {
  createUser,
  getUserData,
  addNewTrip,
  addNewSkill,
  updateUserDrivingLevel,
} = require("../controllers/user.controller");

router.get("/get/:userId", getUserData);
router.post("/createUser", createUser);
router.post("/addTrip", addNewTrip);
router.post("/addSkill", addNewSkill);
router.post("/updateDrivingLevel", updateUserDrivingLevel);

module.exports = router;
