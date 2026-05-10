module.exports = (req, res, next) => {
    if (req.user?.userType !== "STUDENT") {
        return res.status(403).json({ message: "Students only" });
    }
    next();
};