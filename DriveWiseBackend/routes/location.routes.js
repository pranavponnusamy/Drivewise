const express = require("express");
const router = express.Router();

const {
  saveAccident,
  getAccidents,
} = require("../controllers/location.controller");

router.get("/", getAccidents);
router.post("/save", saveAccident);

module.exports = router;
