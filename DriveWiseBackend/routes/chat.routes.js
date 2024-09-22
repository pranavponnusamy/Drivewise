const express = require("express");
const router = express.Router();

const { askQuestion } = require("../controllers/chat.controller");

router.post("/ask", askQuestion);

module.exports = router;
