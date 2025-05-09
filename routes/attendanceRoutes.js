const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getTodayAttendanceHistory,
  getAllUserAttendanceHistory,
  getLastMonthAttendanceHistory,
} = require("../controllers/attendanceController");

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);

router.get("/today", protect, getTodayAttendance);
router.get("/history", protect, getAttendanceHistory);

// Admin routes
router.get("/admin/today-history", getTodayAttendanceHistory);
router.get("/admin/all-history", getAllUserAttendanceHistory);
router.get("/admin/last-month-history", getLastMonthAttendanceHistory);

module.exports = router;
