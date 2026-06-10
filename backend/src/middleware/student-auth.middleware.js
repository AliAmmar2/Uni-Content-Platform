const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.userType !== "STUDENT") {
      return res.status(403).json({
        message: "Student access only"
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      userType: "STUDENT"
    };

    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again."
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Invalid token"
      });
    }

    return res.status(500).json({
      message: "Authentication error"
    });
  }
};