const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 👇 find by username (NOT email anymore)
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, admin.passwordHash);

        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};