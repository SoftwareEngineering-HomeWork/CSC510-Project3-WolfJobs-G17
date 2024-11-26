const User = require("../models/user");
const AuthOtp = require("../models/authOtp");
const nodemailer = require("nodemailer");
require('dotenv').config();
const { generateOTPEmailTemplate } = require('../utils/emailTemplates');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

module.exports.generateOTP = async function(req, res) {
  try {
    console.log(req.body)
    const { email, userId } = req.body;
    console.log("Received request to generate otp",email,userId);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP generated");
    // Save OTP to database
    await AuthOtp.create({
      userId,
      otp,
    });

    // Send email
    const firstName = email.split('@')[0]; // Simple way to get a name, adjust as needed
    const htmlContent = generateOTPEmailTemplate(firstName, otp);
    console.log("Email Created");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for WolfJobs Verification',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email Sent");

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