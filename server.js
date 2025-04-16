require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./config/db");
const PORT = process.env.PORT;
const app = express();

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("upload"));

// default routes
app.get("/", (req, res) => {
  res.send("Welcome to Yusuff Backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/application", applicationRoutes);

// app.use("", routes)

// Global error handlw middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ error: `Something went wrong!` });
});

app.listen(PORT, () => {
  console.log("Server listening to PORT", PORT);
});
