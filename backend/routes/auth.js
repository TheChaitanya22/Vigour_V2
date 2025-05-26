require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../config/db");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../config/validation");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("../config/passport");

const validate = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const app = express();
app.use(passport.initialize());
router.post("/register", validate(registerSchema), async function (req, res) {
  const { email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Validate role
    if (role !== "user" && role !== "coach") {
      return res.status(400).json({ msg: "Role must be either user or coach" });
    }

    // Create user instance
    user = new User({
      email,
      password,
      role,
    });

    await user.save();

    // Return jsonwebtoken
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      {
        payload,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "User successfully creatred",
      token: token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validate(loginSchema), async function (req, res) {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if user has a password (wasn't created with Google OAuth)
    if (!user.password) {
      return res.status(400).json({
        msg: "This account was created with Google. Please use Google Sign-In.",
      });
    }

    // Verify password
    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Return jsonwebtoken
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      {
        payload,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({
      message: "Login Successful",
      token: token,
      role: user.role,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Generate JWT after successful authentication
    const payload = {
      email: req.user.email,
      role: req.user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  }
);

router.get("/me", auth, async function (req, res) {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = {
  authRouter: router,
};
