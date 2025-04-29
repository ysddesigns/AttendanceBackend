const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  submitApplication,
  getApplicationData,
  updateApplicationStatus,
  getAllApplications,
} = require("../controllers/applicationController");

const adminMiddleware = require("../middleware/adminMiddleware");

// POST /api/application
router.post("/", protect, submitApplication); // No multer
router.get("/", protect, getApplicationData);

// admin
router.post(
  "/update-status",
  protect,
  adminMiddleware,
  updateApplicationStatus
);

router.get("/all", protect, adminMiddleware, getAllApplications);

module.exports = router;
