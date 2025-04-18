const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  submitApplication,
  getApplicationData,
} = require("../controllers/applicationController");

// POST /api/application
router.post("/", protect, submitApplication); // No multer
router.get("/", protect, getApplicationData);

module.exports = router;
