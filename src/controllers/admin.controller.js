const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

/**
 * CREATE ADMIN / SUPER ADMIN
 */
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, fullName, password, role } = req.body;

        const existing = await Admin.findOne({
            $or: [{ email }, { username }]
        });

        if (existing) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            username,
            email,
            fullName,
            passwordHash,
            role: role || "admin"
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * GET ALL ADMINS
 */
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-passwordHash");

        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * GET ADMIN BY ID
 */
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-passwordHash");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * UPDATE ADMIN
 */
exports.updateAdmin = async (req, res) => {
    try {
        const { username, email, fullName, role } = req.body;

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { username, email, fullName, role },
            { new: true }
        ).select("-passwordHash");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            message: "Admin updated successfully",
            admin
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * DELETE ADMIN
 */
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin._id.toString() === req.user.id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        await Admin.findByIdAndDelete(req.params.id);

        res.json({ message: "Admin deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};