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

router.post("/userInfo", authMiddleware, userInfo);
router.post("/set-role", setRole);

// STEP 1: User clicks login → we send them to Google with `state` (which includes redirectUri)
router.get("/google", (req, res, next) => {
  const redirectUri = req.query.redirect_uri; // frontend passes this
  const state = JSON.stringify({ redirectUri }); // pack it as JSON

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state, // send it through Google OAuth
    passReqToCallback: true,
  })(req, res, next);
});

// STEP 2: After login, Google sends them back here
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    // Unpack the redirectUri from the state we sent earlier
    let redirectUri;
    try {
      const parsedState = JSON.parse(req.query.state);
      redirectUri = parsedState.redirectUri;
    } catch (error) {
      console.warn("Invalid state format", error);
    }

    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      user = new User({
        fullname: req.user.fullname,
        email: req.user.email,
        role: "", // No role yet
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, fullname: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if (redirectUri) {
      const redirectUrl = `${decodeURIComponent(redirectUri)}?token=${token}`;
      return res.redirect(redirectUrl);
    }

    res.send("Login successful. Please return to the app.");
  }
);

// // Google OAuth
// // router.get(
// //   "/google",
// //   passport.authenticate("google", { scope: ["profile", "email"] })
// // );

// passport.authenticate("google", {
//   scope: ["profile", "email"],
//   passReqToCallback: true,
//   state: (req) => req.query.state, // optional if state is automatically passed
// });

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

// module.exports = router;
