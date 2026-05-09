const jwt = require("jsonwebtoken");
const UniStudent = require("../models/Student");
const Admin = require("../models/Admin");

const anyAuth = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({message: "No token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // IMPORTANT: must be Mongo _id
        const userId = decoded.id;

        // 1️⃣ Try student DB first
        const student = await UniStudent.findById(userId);
        if (student) {
            req.user = {
                id: student._id,
                type: "STUDENT",
                role: student.role, // STUDENT or MODERATOR
                data: student
            };
            return next();
        }

        // 2️⃣ Try admin DB
        const admin = await Admin.findById(userId);
        if (admin) {
            req.user = {
                id: admin._id,
                type: "ADMIN",
                role: admin.role, // admin or super_admin
                data: admin
            };
            return next();
        }

        return res.status(401).json({message: "User not found in any system"});

    } catch (err) {
        return res.status(401).json({message: "Invalid token"});
    }
};

module.exports = anyAuth;