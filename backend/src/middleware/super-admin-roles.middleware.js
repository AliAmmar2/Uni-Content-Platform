exports.requireSuperAdmin = (req, res, next) => {

    if (!req.admin) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (req.admin.role !== "super_admin") {
        return res.status(403).json({
            message: "Super admin only"
        });
    }

    next();
};