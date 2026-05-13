const express = require("express");
const router = express.Router();
const { generateSummary } = require("../controllers/aiController");

// Use POST for generation as it sends context in the body
router.post("/generate-summary", generateSummary);

module.exports = router;
