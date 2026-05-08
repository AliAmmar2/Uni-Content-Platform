const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/admin-auth.middleware");
const {requireSuperAdmin} = require("../middleware/super-admin-roles.middleware");
const controller = require("../controllers/admin-auth.controller");

// MUST be logged in first
router.use(auth);

// ONLY SUPER ADMIN can manage admins
router.post("/", requireSuperAdmin, adminController.createAdmin);
router.get("/", requireSuperAdmin, adminController.getAllAdmins);
router.get("/:id", requireSuperAdmin, adminController.getAdminById);
router.put("/:id", requireSuperAdmin, adminController.updateAdmin);
router.delete("/:id", requireSuperAdmin, adminController.deleteAdmin);

module.exports = router;