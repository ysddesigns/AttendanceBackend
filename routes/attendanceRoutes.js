const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
} = require("../controllers/attendanceController");

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);

router.get("/today", protect, getTodayAttendance);
router.get("/history", protect, getAttendanceHistory);

module.exports = router;
