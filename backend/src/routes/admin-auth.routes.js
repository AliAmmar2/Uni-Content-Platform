const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin-auth.controller");
const adminAuth = require("../middleware/admin-auth.middleware");
router.post("/login", controller.loginAdmin);
router.put(
    "/update-password",
    adminAuth,
    controller.updatePassword
);

module.exports = router;