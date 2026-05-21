const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (decoded.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Admin access only"
            });
        }

        req.user = {
            id: decoded.id,
            userType: "ADMIN",
            role: decoded.role
        };

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({message: "Token expired"});
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Invalid token"});
        }

        console.error("ADMIN AUTH ERROR:", error);

        return res.status(500).json({
            message: "Authentication error"
        });
    }
};