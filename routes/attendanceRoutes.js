const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { checkIn, checkOut } = require("../controllers/attendanceController");

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);

module.exports = router;
