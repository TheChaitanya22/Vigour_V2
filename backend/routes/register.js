require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../config/db");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../config/validation");

const validate = require("../middleware/validate");

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

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

    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
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

module.exports = {
  authRouter: router,
};
