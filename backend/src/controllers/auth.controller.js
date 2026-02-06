const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UniStudent = require("../models/UniStudents");

exports.login = async (req, res) => {
  try {
    const { name, universityEmail, universityId, password } = req.body;

    if (!universityEmail || !universityId || !password) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    let user = await User.findOne({ universityEmail,universityId });

    if (!user) {
      const uniRecord = await UniStudent.findOne({ universityEmail, universityId });
      if (!uniRecord) {
        return res.status(403).json({ message: "University credentials not found" });
      }

      // then create the user
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({ name, universityEmail, universityId, passwordHash, role: "STUDENT", status: "ACTIVE" });
    }

    // PASSWORD CHECK
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: (user.role || "").toString().toUpperCase()
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, universityEmail, universityId, password, role } = req.body;

    if (!name || !universityEmail || !universityId || !password) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ universityEmail }, { universityId }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const uniRecord = await UniStudent.findOne({ universityEmail, universityId });
    if (!uniRecord) {
      return res.status(403).json({ message: "University credentials not found" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      universityEmail,
      universityId,
      passwordHash,
      role: (role ? role.toString().toUpperCase() : "STUDENT"),
      status: "ACTIVE"
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
