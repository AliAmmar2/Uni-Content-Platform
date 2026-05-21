const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

/**
 * CREATE ADMIN / SUPER ADMIN
 */
exports.createAdmin = async (req, res) => {
    try {
        const {username, email, fullName, password, role} = req.body;

        const existing = await Admin.findOne({
            $or: [{email}, {username}]
        });

        if (existing) {
            return res.status(400).json({message: "Admin already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            username,
            email,
            fullName,
            passwordHash,
            role: role || "admin"
        });

        const safeAdmin = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
            lastLogin: admin.lastLogin,
            lastPasswordUpdate: admin.lastPasswordUpdate,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        };

        return res.status(201).json({
            message: "Admin created successfully",
            admin: safeAdmin
        });

    } catch (err) {
        res.status(500).json({message: err.message});
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
        res.status(500).json({message: err.message});
    }
};


/**
 * GET CURRENT LOGGED IN ADMIN (/me)
 */
exports.getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id)
            .select("-passwordHash");

        if (!admin) {
            return res.status(404).json({message: "Admin not found"});
        }

        res.json(admin);

    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

/**
 * GET ADMIN BY ID
 */
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-passwordHash");

        if (!admin) {
            return res.status(404).json({message: "Admin not found"});
        }

        res.json(admin);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


/**
 * UPDATE ADMIN
 */exports.updateAdmin = async (req, res) => {
    try {

        const {
            username,
            email,
            fullName,
            role
        } = req.body;

        const targetAdminId = req.params.id;

        const requester = req.user;

        const isSelf = requester.id === targetAdminId;

        const isSuperAdmin = requester.role === "super_admin";

        /**
         * Normal admin can update only himself
         * Super admin can update everyone
         */
        if (!isSelf && !isSuperAdmin) {
            return res.status(403).json({
                message: "You are not allowed to update this admin"
            });
        }

        const adminToUpdate = await Admin.findById(targetAdminId);

        if (!adminToUpdate) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        /**
         * Role protection
         */
        if (role !== undefined) {

            /**
             * Only super admin can change roles
             */
            if (!isSuperAdmin) {
                return res.status(403).json({
                    message: "Only super admin can change roles"
                });
            }

            /**
             * Super admin cannot change his own role
             */
            if (
                isSelf &&
                adminToUpdate.role !== role
            ) {
                return res.status(403).json({
                    message: "You cannot change your own role"
                });
            }
        }

        const updateData = {};

        if (username !== undefined) {
            updateData.username = username;
        }

        if (email !== undefined) {
            updateData.email = email;
        }

        if (fullName !== undefined) {
            updateData.fullName = fullName;
        }

        if (role !== undefined) {
            updateData.role = role;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            targetAdminId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-passwordHash");

        return res.status(200).json({
            message: "Admin updated successfully",
            admin: updatedAdmin
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });
    }
};
/**
 * DELETE ADMIN
 */
exports.deleteAdmin = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const adminIdToDelete = req.params.id;
        const currentAdminId = req.user.id;

        const admin = await Admin.findById(adminIdToDelete);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        if (admin._id.toString() === currentAdminId) {
            return res.status(403).json({
                message: "You cannot delete yourself"
            });
        }

        await Admin.findByIdAndDelete(adminIdToDelete);

        return res.status(200).json({
            message: "Admin deleted successfully"
        });

    } catch (err) {
        console.error("DELETE ADMIN ERROR:", err);

        return res.status(500).json({
            message: err.message
        });
    }
};