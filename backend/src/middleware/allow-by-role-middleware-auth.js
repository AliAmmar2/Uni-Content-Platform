const allowStudentOrAdminRole = (studentRoles = [], adminRoles = []) => {
    return (req, res, next) => {

        //  STUDENT SYSTEM
        if (req.user?.userType === "STUDENT") {
            if (studentRoles.includes(req.user.role)) {
                return next();
            }
        }

        //  ADMIN SYSTEM
        if (req.admin?.userType === "ADMIN") {
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