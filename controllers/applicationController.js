const Application = require("../model/Application");

// exports.submitApplication = async (req, res) => {
//   try {
//     const { fullname, institution, state, department, period, startDate } =
//       req.body;

//     const pdfPath = req.file ? req.file.path : null;

//     if (!pdfPath) {
//       return res.status(400).json({ message: "PDF letter is required" });
//     }

//     const application = new Application({
//       user: req.user.userId,
//       fullname,
//       institution,
//       state,
//       department,
//       period,
//       expectedStartDate: startDate,
//       letter: pdfPath,
//       applicationStatus: "submitted",
//     });

//     await application.save();

//     res
//       .status(201)
//       .json({ message: "Application submitted successfully ✅", application });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", err });
//   }
// };

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
      period,
      expectedStartDate: startDate,
      applicationStatus: "submitted",
    });

    await application.save();

    res
      .status(201)
      .json({ message: "Application submitted successfully ✅", application });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
