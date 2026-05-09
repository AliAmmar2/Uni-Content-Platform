const allowStudentOrAdminRole = (studentRoles = [], adminRoles = []) => {
    return (req, res, next) => {

        if (req.user && req.user.role) {
            if (studentRoles.includes(req.user.role)) {
                return next();
            }
        }

        // 👑 ADMIN SYSTEM
        if (req.admin && req.admin.role) {
            if (adminRoles.includes(req.admin.role)) {
                return next();
            }
        }

        return res.status(403).json({
            message: "Forbidden: insufficient permissions"
        });
    };
};

module.exports = { allowStudentOrAdminRole };