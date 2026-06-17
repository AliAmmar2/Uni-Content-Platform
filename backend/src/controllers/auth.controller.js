const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const OfficialStudent = require("../models/OfficialStudent");

const {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken
} = require("../utils/jwt");

const { sendVerificationEmail } = require("../utils/email");

const {
  validateUniversityEmail,
  validateUniversityId
} = require("../utils/validation");

exports.register = async (req, res) => {
  try {
    const {
      universityEmail,
      universityId,
      password,
      confirmPassword
    } = req.body;

    if (!universityEmail || !universityId || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const email = universityEmail.toLowerCase().trim();
    const id = universityId.trim();

    if (!validateUniversityEmail(email)) {
      return res.status(400).json({
        message: "Invalid university email"
      });
    }

    if (!validateUniversityId(id)) {
      return res.status(400).json({
        message: "Invalid university ID"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const existingUser = await Student.findOne({
      $or: [
        { universityEmail: email },
        { universityId: id }
      ]
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        return res.status(200).json({
          message: "Account exists but not verified. Please check your email."
        });
      }

      return res.status(409).json({
        message: "Account already exists"
      });
    }

    const officialStudent = await OfficialStudent.findOne({
      universityEmail: email,
      universityId: id
    });

    if (!officialStudent) {
      return res.status(403).json({
        message: "Registration not allowed"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let user;

    try {
      user = await Student.create({
        universityId: officialStudent.universityId,
        universityEmail: officialStudent.universityEmail,
        name: officialStudent.name,
        faculty: officialStudent.faculty,
        major: officialStudent.major,
        academicYear: officialStudent.academicYear,
        calendarYear: officialStudent.calendarYear,
        role: "STUDENT",
        passwordHash
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Account already exists"
        });
      }

      throw err;
    }

    const verificationToken = generateEmailVerificationToken(user);

    const verificationLink =
        `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    console.log("VERIFY LINK:", verificationLink);

    await sendVerificationEmail(user.universityEmail, verificationLink);

    return res.status(201).json({
      message: "Registration successful. Please verify your email."
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    if (decoded.type !== "email-verification") {
      return res.status(403).json({
        message: "Invalid token type"
      });
    }

    const user = await Student.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.emailVerified = true;
    user.status = "ACTIVE";

    await user.save();

    return res.json({
      message: "Email verified successfully"
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Verification link expired"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        message: "Invalid verification token"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const {
      universityEmail,
      universityId,
      password
    } = req.body;

    if (!universityEmail || !universityId || !password) {
      return res.status(400).json({
        message: "Missing credentials"
      });
    }

    const email = universityEmail.toLowerCase().trim();
    const id = universityId.trim();

    const user = await Student.findOne({
      universityEmail: email
    })
        .populate("faculty", "name")
        .populate("major", "name");

    if (!user) {
      return res.status(404).json({
        message: "Email not registered. Please sign up."
      });
    }

    if (String(user.universityId).trim() !== id) {
      return res.status(401).json({
        message: "University ID is wrong"
      });
    }

    if (user.isLocked) {
      return res.status(423).json({
        message: "Account locked. Please try again later."
      });
    }

    const validPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!validPassword) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }

      await user.save();

      return res.status(401).json({
        message: "Password is wrong"
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email"
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Account inactive"
      });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      accessToken,
      refreshToken,
      user
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { universityEmail } = req.body;

    if (!universityEmail) {
      return res.status(400).json({
        message: "University email is required"
      });
    }

    const user = await Student.findOne({
      universityEmail: universityEmail
        .toLowerCase()
        .trim()
    });

    if (!user) {
      return res.status(200).json({
        message:
          "If the account exists, a password reset email has been sent"
      });
    }

    const resetToken =
      generatePasswordResetToken(user);

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(
      user.universityEmail,
      resetLink
    );

    return res.status(200).json({
      message:
        "If the account exists, a password reset email has been sent"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_EMAIL_SECRET
    );

    if (decoded.type !== "password-reset") {
      return res.status(400).json({
        message: "Invalid token"
      });
    }

    const user = await Student.findById(
      decoded.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.passwordHash = await bcrypt.hash(
      password,
      12
    );

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successfully"
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        message:
          "Reset link has expired"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        message:
          "Invalid reset token"
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};