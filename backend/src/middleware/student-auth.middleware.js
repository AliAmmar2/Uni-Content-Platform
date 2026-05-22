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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return res.status(403).json({
        message: "Invalid token payload"
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
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