const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UniStudent = require("../models/UniStudents");
const Faculty = require('../models/Faculty');
const Major = require("../models/Major");
const { validateUniversityEmail, validateUniversityId } = require("../utils/validation");
const { sendMagicLinkEmail } = require("../utils/email");

// password login
exports.login = async (req, res) => {
  try {
    const { universityEmail, universityId, password } = req.body;
    if (!universityEmail || !universityId || !password) {
      return res.status(400).json({ 
        message: "Missing required fields",
        errors: {
          universityEmail: !universityEmail ? "University email is required" : null,
          universityId: !universityId ? "University ID is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    if (!validateUniversityEmail(universityEmail)) {
      return res.status(400).json({ 
        message: "Invalid university email format" 
      });
    }

    if (!validateUniversityId(universityId)) {
      return res.status(400).json({ 
        message: "Invalid university ID format" 
      });
    }

    const user = await UniStudent.findOne({ universityId })
      .populate('faculty', 'name')
      .populate('major', 'name');

    if (!user || user.universityEmail.toLowerCase() !== universityEmail.toLowerCase()) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({ 
        message: `Account is temporarily locked. Please try again in ${lockTimeRemaining} minutes.` 
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ 
        message: "Account is suspended. Please contact administration." 
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      await user.incLoginAttempts();
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // reset login attempts on successful login
    await user.resetLoginAttempts();

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is not defined");
      return res.status(500).json({ 
        message: "Server configuration error" 
      });
    }

    // generate tokens
    const accessToken = jwt.sign(
      { 
        id: user._id.toString(),
        universityId: user.universityId,
        roles: user.roles 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { 
        id: user._id.toString(),
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        universityEmail: user.universityEmail,
        universityId: user.universityId,
        faculty: user.faculty,
        major: user.major,
        academicYear: user.academicYear,
        calendarYear: user.calendarYear,
        roles: user.roles
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ 
      message: "An error occurred during login. Please try again." 
    });
  }
};

// Request magic link (if passwordless)
exports.requestMagicLink = async (req, res) => {
  try {
    const { universityEmail, universityId } = req.body;

    if (!universityEmail || !universityId) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    if (!validateUniversityEmail(universityEmail)) {
      return res.status(400).json({ 
        message: "Invalid university email format" 
      });
    }

    if (!validateUniversityId(universityId)) {
      return res.status(400).json({ 
        message: "Invalid university ID format" 
      });
    }

    const user = await UniStudent.findOne({ universityId });

    // always return success to prevent account enumeration
    if (!user || user.universityEmail.toLowerCase() !== universityEmail.toLowerCase()) {
      return res.json({ 
        message: "If the credentials are valid, a login link has been sent to your email." 
      });
    }

    if (user.status !== "ACTIVE") {
      return res.json({ 
        message: "If the credentials are valid, a login link has been sent to your email." 
      });
    }

    // Generate magic link token
    const magicToken = jwt.sign(
      { 
        id: user._id.toString(),
        universityId: user.universityId,
        type: 'magic-link',
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${magicToken}`;

    // Send email
    await sendMagicLinkEmail(user.universityEmail, magicLink);

    res.json({ 
      message: "If the credentials are valid, a login link has been sent to your email.",
      // In dev mode, include the token for testing
      ...(process.env.NODE_ENV === 'development' && { devToken: magicToken })
    });

  } catch (error) {
    console.error("MAGIC LINK ERROR:", error);
    res.status(500).json({ 
      message: "An error occurred. Please try again." 
    });
  }
};

// Verify magic link token
exports.verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: "Token is required" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'magic-link') {
      return res.status(403).json({ 
        message: "Invalid token type" 
      });
    }

    const user = await UniStudent.findById(decoded.id)
      .populate('faculty', 'name code')
      .populate('major', 'name code');

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ 
        message: "Account is not active" 
      });
    }

    // update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate new access and refresh tokens
    const accessToken = jwt.sign(
      { 
        id: user._id.toString(),
        universityId: user.universityId,
        roles: user.roles 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { 
        id: user._id.toString(),
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        universityEmail: user.universityEmail,
        universityId: user.universityId,
        faculty: user.faculty,
        major: user.major,
        academicYear: user.academicYear,
        calendarYear: user.calendarYear,
        roles: user.roles
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Magic link has expired. Please request a new one." 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: "Invalid magic link" 
      });
    }

    console.error("VERIFY MAGIC LINK ERROR:", error);
    res.status(500).json({ 
      message: "An error occurred. Please try again." 
    });
  }
};

// refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        message: "Refresh token is required" 
      });
    }

    // verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== 'refresh') {
      return res.status(403).json({ 
        message: "Invalid token type" 
      });
    }

    const user = await UniStudent.findById(decoded.id);

    if (!user || user.status !== "ACTIVE") {
      return res.status(403).json({ 
        message: "Invalid refresh token" 
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        id: user._id.toString(),
        universityId: user.universityId,
        roles: user.roles 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Refresh token expired. Please login again." 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: "Invalid refresh token" 
      });
    }

    console.error("REFRESH TOKEN ERROR:", error);
    res.status(500).json({ 
      message: "An error occurred. Please try again." 
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await UniStudent.findById(req.user.id)
      .select('-passwordHash -loginAttempts -lockUntil')
      .populate('faculty', 'name code')
      .populate('major', 'name code');

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.json({ user });

  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ 
      message: "An error occurred. Please try again." 
    });
  }
};