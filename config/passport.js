const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../model/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://startupkanoattendance.onrender.com/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value,
      });

      if (existingUser) return done(null, existingUser);
      try {
        const newUser = new User({
          fullname: profile.displayName,
          email: profile.emails[0].value,
          password: "", // OAuth users won’t need password
          role: "user",
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://startupkanoattendance.onrender.com/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("Email not found"));

      const existingUser = await User.findOne({ email });
      if (existingUser) return done(null, existingUser);

      const newUser = new User({
        fullname: profile.displayName || profile.username,
        email,
        password: "",
        role: "user",
      });

      await newUser.save();
      done(null, newUser);
    }
  )
);

module.exports = passport;
