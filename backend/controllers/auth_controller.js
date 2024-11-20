const User = require("../models/user");
const AuthOtp = require("../models/authOtp");
const nodemailer = require("nodemailer");
require('dotenv').config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.generateOTP = async function(req, res) {
  try {
    console.log(req.body)
    const { email, userId } = req.body;
    console.log("Received request to generate otp",email,userId);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to database
    await AuthOtp.create({
      userId,
      otp,
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login Verification Code",
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
    });
  }
};

module.exports.verifyOTP = async function(req, res) {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const authOtp = await AuthOtp.findOne({
      userId: user._id,
      otp,
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) }, // OTP valid for 10 minutes
    });

    if (!authOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Delete used OTP
    await AuthOtp.deleteOne({ _id: authOtp._id });

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
}; 