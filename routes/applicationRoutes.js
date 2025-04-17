// const express = require("express");
// const router = express.Router();
// const protect = require("../middleware/auth");
// const upload = require("../middleware/upload");
// const { submitApplication } = require("../controllers/applicationController");

// // POST /api/application
// router.post("/", protect, upload.single("letter"), submitApplication);

// module.exports = router;

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { submitApplication } = require("../controllers/applicationController");

// POST /api/application
router.post("/", protect, submitApplication); // No multer

module.exports = router;
