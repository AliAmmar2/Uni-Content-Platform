const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.loginAdmin = async (req, res) => {
    try {
        const {username, password} = req.body;

        const admin = await Admin.findOne({username});

        if (!admin) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const match = await bcrypt.compare(
            password,
            admin.passwordHash
        );

        if (!match) {
            admin.loginAttempts += 1;
            await admin.save();

            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // successful login
        admin.lastLogin = new Date();
        admin.loginAttempts = 0;

        await admin.save();

        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role,
                userType: "ADMIN"
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.updatePassword = async (req, res) => {
    try {

        const adminId = req.user.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters"
            });
        }

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            admin.passwordHash
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }

        admin.passwordHash = await bcrypt.hash(newPassword, 10);

        // save password update time
        admin.lastPasswordUpdate = new Date();

        await admin.save();

        res.status(200).json({
            message: "Password updated successfully",
            lastPasswordUpdate: admin.lastPasswordUpdate
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });
    }
};