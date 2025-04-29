const Application = require("../model/Application");
exports.submitApplication = async (req, res) => {
  try {
    const { fullname, institution, state, department, period, startDate } =
      req.body;

    const application = new Application({
      user: req.user.userId,
      fullname,
      institution,
      state,
      department,
      periodOfStay: period,
      expectedStartDate: startDate,
      applicationStatus: "submit",
    });

    await application.save();

    res
      .status(201)
      .json({ message: "Application submitted successfully ✅", application });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

exports.getApplicationData = async (req, res) => {
  try {
    // Fetch applications for the authenticated user
    const applications = await Application.find({ user: req.user.userId });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the application by ID
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application status
    application.applicationStatus = status;
    await application.save();

    res.status(200).json({
      message: `Application ${status} successfully ✅`,
      application,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    // Fetch all applications
    const applications = await Application.find();

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
