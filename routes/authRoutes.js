const express = require("express");
const router = express.Router();
const User = require("./user");
const passport = require("../config/passport");
const {
  register,
  login,
  userInfo,
  setRole,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");

router.post("/signup", register);
router.post("/login", login);

router.post("/userInfo", authMiddleware, userInfo);
router.post("/set-role", setRole);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const redirectUri = req.query.redirect_uri;
    // Check if the user already exists in the database
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
      // Create new user with no role initially
      user = new User({
        fullname: req.user.fullname,
        email: req.user.email,
        role: "", // Role is empty for now
      });
      await user.save();
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, fullname: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔄 Send token to frontend via redirect
    if (redirectUri) {
      const redirectUrl = `${decodeURIComponent(redirectUri)}?token=${token}`;
      return res.redirect(redirectUrl);
    }
    // fallback
    res.redirect(
      `https://startupkanoattendance.onrender.com/role-selection?token=${token}`
    );
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        userId: req.user._id,
        role: req.user.role,
        fullname: req.user.fullname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:5001/oauth-success?token=${token}`);
  }
);

module.exports = router;
