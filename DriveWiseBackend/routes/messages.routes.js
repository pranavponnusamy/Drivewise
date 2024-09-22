const express = require("express");
const router = express.Router();

const {
  textEndpoint,
  yashChat,
} = require("../controllers/messages.controller");

router.post("/", textEndpoint);
router.post("/yash", yashChat);

module.exports = router;
