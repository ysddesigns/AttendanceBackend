const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true, // Ensure fullName is always provided
    },
    role: {
      type: String,
      required: true, // Ensure role is always provided
    },
    checkInTime: Date,
    checkOutTime: Date,
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
    isCheckedOut: {
      type: Boolean,
      default: false,
    },
    runningTime: Number, // Duration in minutes or seconds
    isAutoCheckout: {
      type: Boolean,
      default: false,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    alreadyCheckedIn: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["departed", "ontime", "late", "off", "absent", "present"],
      default: "absent",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
