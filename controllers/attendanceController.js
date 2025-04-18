const Attendance = require("../model/Attendance");
const moment = require("moment");

// Define your company time rules here
const START_TIME = moment("09:00 AM", "hh:mm A");
const LATE_TIME = moment("09:15 AM", "hh:mm A");
const AUTO_CHECKOUT_TIME = moment("05:00 PM", "hh:mm A");

checkIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = moment().startOf("day").toDate();

    // Prevent multiple check-ins in one day
    const existing = await Attendance.findOne({
      user: userId,
      checkInDate: today,
    });
    if (existing)
      return res.status(400).json({ message: "Already checked in today" });

    const now = moment();
    let status = "ontime";

    if (now.isAfter(LATE_TIME)) status = "late";

    const attendance = new Attendance({
      user: userId,
      checkInTime: now.toDate(),
      isCheckedIn: true,
      alreadyCheckedIn: true,
      checkInDate: today,
      status,
    });

    await attendance.save();
    res.status(201).json({ message: "Checked in successfully ✅", attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

checkOut = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = moment().startOf("day").toDate();

    const attendance = await Attendance.findOne({
      user: userId,
      checkInDate: today,
      isCheckedIn: true,
      isCheckedOut: false,
    });

    if (!attendance)
      return res.status(400).json({ message: "You must check in first" });

    const now = moment();
    const duration = moment
      .duration(now.diff(attendance.checkInTime))
      .asMinutes();

    attendance.checkOutTime = now.toDate();
    attendance.runningTime = Math.round(duration);
    attendance.isCheckedOut = true;
    attendance.isCheckedIn = false;

    await attendance.save();
    res
      .status(200)
      .json({ message: "Checked out successfully ✅", attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = moment().startOf("day").toDate();

    const attendance = await Attendance.findOne({
      user: userId,
      checkInDate: today,
    });

    if (!attendance) {
      return res.status(200).json(null); // Or return default structure
    }

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const history = await Attendance.find({ user: userId }).sort({
      checkInDate: -1,
    });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = {
  checkOut,
  checkIn,
  getTodayAttendance,
  getAttendanceHistory,
};
