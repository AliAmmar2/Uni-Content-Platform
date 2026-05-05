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

    if (!token) {
      return res.status(401).json({ 
        message: "Invalid token format" 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is not defined");
      return res.status(500).json({ 
        message: "Server configuration error" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded token structure
    if (!decoded.id || !decoded.roles || !Array.isArray(decoded.roles)) {
      return res.status(403).json({ 
        message: "Invalid token payload" 
      });
    }

    req.user = {
      id: decoded.id,
      universityId: decoded.universityId,
      roles: decoded.roles
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

    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(500).json({ 
      message: "Authentication error" 
    });
  }
};