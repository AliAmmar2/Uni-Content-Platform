const auth = require("../middleware/auth.middleware");
const adminAuth = require("../middleware/admin-auth.middleware");

const allowAnyAuth = (req, res, next) => {
    let called = false;

    // try student auth
    auth(req, res, () => {
        if (req.user) {
            called = true;
            return next();
        }

        // try admin auth
        adminAuth(req, res, () => {
            if (req.user) {
                called = true;
                return next();
            }

            if (!called) {
                return res.status(401).json({
                    message: "Unauthorized: not admin or student",
                });
            }
        });
    });
};

module.exports = allowAnyAuth;