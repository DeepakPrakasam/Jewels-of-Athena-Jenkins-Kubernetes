const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../db/mongoClient");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, mobile, password, adminKey } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = adminKey === process.env.ADMIN_SECRET ? "admin" : "user";

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const newUser = {
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken: token,
    };

    await users.insertOne(newUser);

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"Dhandapani Jewellery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link to verify your email: <a href="${verifyLink}">${verifyLink}</a></p>`,
    });
    res
      .status(200)
      .json({ message: "Signup successful! Please verify your email." });
  } catch (emailErr) {
    console.error("Email sending error:", emailErr);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }
});

// Verify email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email: decoded.email });
    if (!user) return res.status(400).send("Invalid verification link.");

    if (user.isVerified) return res.status(200).send("Email already verified.");

    await users.updateOne(
      { email: decoded.email },
      { $set: { isVerified: true }, $unset: { verificationToken: "" } }
    );

    res.status(200).send("Email verified successfully!");
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid or expired token.");
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "No user found with that email" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await users.updateOne(
      { _id: user._id },
      {
        $set: { resetToken: token, resetTokenExpires: expiresAt },
      }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"Dhandapani Jewellery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({ email, resetToken: token });

    if (!user || new Date(user.resetTokenExpires) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await users.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" },
      }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { emailOrMobile } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 min

    await users.updateOne(
      { _id: user._id },
      {
        $set: { otp, otpExpiresAt: expiresAt },
      }
    );

    await transporter.sendMail({
      from: `"Dhandapani Jewellery" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { emailOrMobile, otp } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid — clear it
    await users.updateOne(
      { _id: user._id },
      { $unset: { otp: "", otpExpiresAt: "" } }
    );

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

module.exports = router;
