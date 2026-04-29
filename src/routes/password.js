const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const passwordRouter = express.Router();

// ==============================
// API 1: FORGOT PASSWORD
// ==============================
passwordRouter.post("/forgot-password", async (req, res) => {
  try {
    const { emailId } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    // save token in DB
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    // create reset link
    const resetLink = `http://localhost:7777/reset-password/${token}`;

    console.log("Reset Link:", resetLink);

    res.send("Reset link generated (check console)");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ==============================
// API 2: RESET PASSWORD
// ==============================
passwordRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token expired or invalid");
    }

    // hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    user.password = passwordHash;

    // clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.send("Password reset successful");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = passwordRouter;
