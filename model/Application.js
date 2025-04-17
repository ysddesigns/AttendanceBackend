const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    periodOfStay: {
      type: String,
      enum: ["3 month", "6 month"],
      required: true,
    },
    expectedStartDate: {
      type: String,
      required: true,
    },
    applicationStatus: {
      type: String,
      enum: ["submit", "pending", "rejected", "accepted", "default"],
      default: "submit",
    },
    letter: {
      type: String, // URL or path to the uploaded PDF
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
