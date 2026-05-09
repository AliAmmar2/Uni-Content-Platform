const jwt = require("jsonwebtoken");

const UniStudent = require("../models/Student");
const Admin = require("../models/Admin");

const anyAuth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userId = decoded.id;

        // STUDENT
        const student = await UniStudent.findById(userId);

        if (student) {
            req.user = {
                id: student._id,
                userType: "STUDENT",
                role: student.role,
                data: student
            };
            return next();
        }

        // ADMIN
        const admin = await Admin.findById(userId);

        if (admin) {
            req.user = {
                id: admin._id,
                userType: "ADMIN",
                role: admin.role,
                data: admin
            };
            return next();
        }

        return res.status(401).json({
            message: "User not found"
        });

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = anyAuth;