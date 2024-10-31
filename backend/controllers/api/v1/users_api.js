require("dotenv").config();
const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const Food = require("../../../models/food");
const History = require("../../../models/history");
const Job = require("../../../models/job");
const Application = require("../../../models/application");
const AuthOtp = require("../../../models/authOtp");
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const nodemailer = require("nodemailer");

const jwtSecret = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
      process.env.SENDGRID_API_KEY,
    }
  })
);

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    res.set("Access-Control-Allow-Origin", "*");
    console.log(bcrypt.compare(req.body.password, user.password));
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }
    res.set("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      message: "Sign In Successful, here is your token, please keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "wolfjobs", { expiresIn: "100000" }),
        user,
      },
      success: true,
    });
  } catch (err) {
    console.log("*******", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.forgotPassword = async function (req, res) {
  console.log(req);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Create a reset token
    const token = jwt.sign({ id: user._id }, jwtSecret);

    // Create the reset link with the correct URL
    const resetLink = `http://127.0.0.1:5173/reset-password?token=${token}`; // Updated with your frontend URL

    // Send email with nodemailer
    await transporter.sendMail({
      from: 'smarred@ncsu.edu',
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`,
    });

    return res.status(200).json({
      message: "Password reset link has been sent to your email",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Method to reset password
module.exports.resetPassword = async function (req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword; // Replace with hashed password
    await user.save();

    return res.status(200).send({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


module.exports.createHistory = async function (req, res) {
  try {
    let history = await History.create({
      date: req.body.date,
      caloriesgain: req.body.total,
      caloriesburn: req.body.burnout,
      user: req.body.id,
    });

    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "History Created Successfully",

      data: {
        history: history,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.signUp = async function (req, res) {
  try {
    if (req.body.password !== req.body.confirm_password) {
      return res.status(422).json({
        message: "Passwords do not match",
      });
    }

    // Check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).json({
        message: "Sign Up Successful, here is your token, please keep it safe",
        data: {
          token: jwt.sign(user.toJSON(), "wolfjobs", {
            expiresIn: "100000",
          }),
          user,
        },
        success: true,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    user = await User.create({
      ...req.body,
      password: hashedPassword, // Save the hashed password
    });

    res.set("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      message: "Sign Up Successful, here is your token, please keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "wolfjobs", {
          expiresIn: "100000",
        }),
        user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.getProfile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "The User info is",

      data: {
        //user.JSON() part gets encrypted

        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        user: user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.editProfile = async function (req, res) {
  // if (req.body.password == req.body.confirm_password) {
  try {
    let user = await User.findById(req.body.id);

    user.name = req.body.name;
    user.password = req.body.password;
    user.role = req.body.role;
    user.address = req.body.address;
    user.phonenumber = req.body.phonenumber;
    user.hours = req.body.hours;
    user.availability = req.body.availability;
    user.gender = req.body.gender;
    // user.dob = req.body.dob;
    check = req.body.skills;
    user.skills = check;
    user.save();
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "User is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
  // } else {
  //   return res.json(400, {
  //     message: "Bad Request",
  //   });
  // }
};
module.exports.searchUser = async function (req, res) {
  try {
    var regex = new RegExp(req.params.name, "i");

    let users = await Job.find({ name: regex });
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "The list of Searched Users",

      data: {
        //user.JSON() part gets encrypted

        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        users: users,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.getHistory = async function (req, res) {
  try {
    let history = await History.findOne({
      user: req.query.id,
      date: req.query.date,
    });
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "The User Profile",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        history: history,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.createJob = async function (req, res) {
  let user = await User.findOne({ _id: req.body.id });
  check = req.body.skills;
  try {
    let job = await Job.create({
      name: req.body.name,
      managerid: user._id,
      managerAffilication: user.affiliation,
      type: req.body.type,
      location: req.body.location,
      description: req.body.description,
      pay: req.body.pay,
      requiredSkills: req.body.requiredSkills,
      question1: req.body.question1,
      question2: req.body.question2,
      question3: req.body.question3,
      question4: req.body.question4,
    });
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      data: {
        job: job,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Job Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.index = async function (req, res) {
  let jobs = await Job.find({}).sort("-createdAt");

  //Whenever we want to send back JSON data
  res.set("Access-Control-Allow-Origin", "*");
  return res.json(200, {
    message: "List of jobs",

    jobs: jobs,
  });
};

module.exports.fetchApplication = async function (req, res) {
  let application = await Application.find({}).sort("-createdAt");

  //Whenever we want to send back JSON data
  res.set("Access-Control-Allow-Origin", "*");
  return res.json(200, {
    message: "List of Applications",

    application: application,
  });
};

module.exports.createApplication = async function (req, res) {
  // let user = await User.findOne({ _id: req.body.id });
  // check = req.body.skills;

  try {
    const existingApplication = await Application.findOne({
      applicantid: req.body.applicantId,
      jobid: req.body.jobId,
    });

    if (existingApplication) {
      res.set("Access-Control-Allow-Origin", "*");
      return res.json(400, {
        message: "You have already applied for the job",
        error: true,
      });
    }

    let application = await Application.create({
      // applicantemail: req.body.applicantemail,
      applicantid: req.body.applicantid,
      applicantname: req.body.applicantname,
      applicantemail: req.body.applicantemail,
      applicantskills: req.body.applicantSkills,
      skills: req.body.skills,
      address: req.body.address,
      phonenumber: req.body.phonenumber,
      hours: req.body.hours,
      dob: req.body.dob,
      gender: req.body.gender,
      jobname: req.body.jobname,
      jobid: req.body.jobid,
      managerid: req.body.managerid,
    });
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      data: {
        application: application,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Job Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.modifyApplication = async function (req, res) {
  try {
    let application = await Application.findById(req.body.applicationId);

    application.status = req.body.status;

    //change answer only from screening to grading
    if (req.body.status === "grading") {
      application.answer1 = req.body.answer1;
      application.answer2 = req.body.answer2;
      application.answer3 = req.body.answer3;
      application.answer4 = req.body.answer4;
    }

    if (req.body.status === "rating") {
      application.rating = req.body.rating;
    }
    application.save();
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "Application is updated Successfully",
      data: {
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.acceptApplication = async function (req, res) {
  try {
    let application = await Application.findById(req.body.applicationId);

    application.status = "1";

    application.save();
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "Application is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.rejectApplication = async function (req, res) {
  try {
    let application = await Application.findById(req.body.applicationId);

    application.status = "2";

    application.save();
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "Application is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.closeJob = async function (req, res) {
  try {
    let job = await Job.findById(req.body.jobid);

    job.status = "closed";

    job.save();
    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      message: "Job is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        job,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

function getTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
}

// Generate OTP ans send email to user
module.exports.generateOtp = async function (req, res) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    let authOtp = await AuthOtp.create({
      userId: req.body.userId,
      otp: otp,
    });

    const { email } = await User.findById(req.body.userId);
    // Send mail to user
    const mailOptions = {
      from: '"Job Portal" <' + process.env.EMAIL + ">", // sender address
      to: email, // list of receivers
      subject: "OTP", // Subject line
      html: `<p>Your OTP is ${otp}</p>`, // plain text body
    };

    await getTransport().sendMail(mailOptions);

    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      success: true,
      message: "OTP is generated Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.verifyOtp = async function (req, res) {
  try {
    const authOtp = await AuthOtp.findOne({
      userId: req.body.userId,
      otp: req.body.otp,
    });

    if (!authOtp) {
      return res.json(422, {
        error: true,
        message: "OTP is not correct",
      });
    }

    authOtp.remove();

    await User.updateOne(
      { _id: req.body.userId },
      { $set: { isVerified: true } }
    );

    res.set("Access-Control-Allow-Origin", "*");
    return res.json(200, {
      success: true,
      message: "OTP is verified Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

const natural = require('natural');

// Comprehensive list of known skills (technical, non-technical, and data-oriented)
const knownSkills = [
  // Technical Skills
  "JavaScript", "Python", "Java", "SQL", "React", "Node.js",
  "HTML", "CSS", "C#", "C++", "Go", "PHP", "Ruby", "Django",
  "Flask", "Kubernetes", "Docker", "AWS", "Azure", "Git",
  "Machine Learning", "Data Science", "DevOps", "Cybersecurity",
  "Mobile Development", "Software Engineering", "API Development",
  "GraphQL", "TypeScript", "Swift", "Objective-C",

  // Data-Oriented Skills
  "Microsoft Excel", "Microsoft Word", "Microsoft PowerPoint", "Tableau",
  "Apache Spark", "Hadoop", "Data Visualization", "Data Analysis",
  "Google Analytics", "SQL Server", "Oracle", "Power BI", "Looker",

  // Non-Technical Skills
  "Communication", "Teamwork", "Problem Solving", "Leadership",
  "Project Management", "Time Management", "Critical Thinking",
  "Creativity", "Adaptability", "Interpersonal Skills", "Conflict Resolution",
  "Negotiation", "Customer Service", "Analytical Skills", "Presentation Skills",
  "Research", "Collaboration", "Emotional Intelligence"
];

// Common English stop words to exclude from skill extraction
const stopWords = ["the", "is", "and", "in", "for", "to", "with", "a", "an", "of", "on", "by", "that", "this", "are", "be", "should"];

// Helper function to convert to camel case
const toCamelCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

module.exports.extractSkills = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.length === 0) {
      return res.status(400).send({ message: "Invalid text!!" });
    }

    // Tokenize the description
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(description.toLowerCase());

    // Filter out common stop words and create a unique set of tokens
    const uniqueTerms = Array.from(new Set(tokens.filter(token => !stopWords.includes(token))));

    // Initialize an array to hold found skills
    const foundSkills = [];

    // Check for known skills in the description
    knownSkills.forEach(skill => {
      const lowerCaseSkill = skill.toLowerCase();

      // Check for exact matches in the tokenized description
      if (uniqueTerms.includes(lowerCaseSkill)) {
        foundSkills.push(toCamelCase(skill)); // Convert to camel case
      }
      // Also check if the skill is present as a phrase
      else if (description.toLowerCase().includes(lowerCaseSkill)) {
        foundSkills.push(toCamelCase(skill)); // Convert to camel case
      }
    });

    // Format and send response
    const formattedSkills = foundSkills.join(", ");
    res.status(200).send({ skills: formattedSkills });
  } catch (error) {
    console.error("Error extracting skills:", error);
    res.status(500).send({ message: "Internal server error!!" });
  }
};