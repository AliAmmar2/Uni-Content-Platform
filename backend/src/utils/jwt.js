const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      type: "refresh"
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

exports.generateEmailVerificationToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      type: "email-verification"
    },
    process.env.JWT_EMAIL_SECRET,
    { expiresIn: "15m" }
  );
};