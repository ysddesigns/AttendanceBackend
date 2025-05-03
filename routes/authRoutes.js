const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../model/user");
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

router.get("/userInfo", authMiddleware, userInfo);
router.post("/set-role", setRole);

router.get("/google", (req, res, next) => {
  const state = req.query.state; // Pass the state (which includes redirectUri) here
  passport.authenticate("google", {
    scope: ["profile", "email"],
    passReqToCallback: true, // This is important to pass the request to your callback
    state, // Pass the state here
  })(req, res, next); // This line starts the authentication flow
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Proceed with Google auth
  async (req, res) => {
    let redirectUri = null;
    try {
      console.log("State received:", req.query.state);
      // Parse the state (which contains the redirectUri from your frontend)
      const parsedState = JSON.parse(req.query.state);
      redirectUri = parsedState.redirectUri;
      console.log("Parsed redirectUri:", redirectUri);
    } catch (error) {
      console.warn("Invalid state format", error); // Fix the typo here
    }

    // Check if the user exists in the database
    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      user = new User({
        fullname: req.user.fullname,
        email: req.user.email,
        role: "", // Role is empty initially
      });
      await user.save();
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        fullname: user.fullname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if (!redirectUri) {
      return res.status(400).send("Redirect URI is missing or invalid.");
    }
    // If the redirectUri exists, go back to that page with the token

    // Log the redirect URL
    const redirectUrl = `${decodeURIComponent(redirectUri)}?token=${token}`;
    console.log("Redirecting to:", redirectUrl);
    // Perform the redirection
    return res.redirect(redirectUrl);
  }
);
module.exports = router;

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   async (req, res) => {
//     const state = req.query.state;

//     // const redirectUri = req.query.redirect_uri;
//     let redirectUri = null;
//     try {
//       const parsedState = JSON.parse(state);
//       redirectUri = parsedState.redirectUri;
//     } catch (error) {
//       console.warn("Invalid state format", err);
//     }
//     // Check if the user already exists in the database
//     let user = await User.findOne({ email: req.user.email });

//     if (!user) {
//       // Create new user with no role initially
//       user = new User({
//         fullname: req.user.fullname,
//         email: req.user.email,
//         role: "", // Role is empty for now
//       });
//       await user.save();
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { userId: user._id, role: user.role, fullname: user.fullname },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     if (redirectUri) {
//       const redirectUrl = `${decodeURIComponent(redirectUri)}?token=${token}`;
//       return res.redirect(redirectUrl);
//     }
//     res.send("Login successful. Please return to the app.");
//   }
// );

// // GitHub OAuth
// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { session: false }),
//   (req, res) => {
//     const token = jwt.sign(
//       {
//         userId: req.user._id,
//         role: req.user.role,
//         fullname: req.user.fullname,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//     res.redirect(`http://localhost:5001/oauth-success?token=${token}`);
//   }
// );
