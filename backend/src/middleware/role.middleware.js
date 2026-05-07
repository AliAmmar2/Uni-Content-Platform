exports.requireRole = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({message: "Not authenticated"});
        }

        if (!hasRole) {
            return res.status(403).json({message: "Forbidden"});
        }

        next();
    };
};