const express = require("express");
const router = express.Router();
const { register, login, userInfo } = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");

router.post("/signup", register);
router.post("/login", login);

router.post("/userInfo", authMiddleware, userInfo);

module.exports = router;
