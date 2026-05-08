const express = require("express");
const router = express.Router();

const anyAuthMiddleware = require("../middleware/any-auth.middleware");
const authAdmin = require("../middleware/admin-auth.middleware");

const controller = require("../controllers/faculty.controller");

// Get all faculties (any logged-in user)
router.get("/", anyAuthMiddleware, controller.getAllFaculties);

// Create faculty (ADMIN only)
router.post("/", authAdmin, controller.createFaculty);

// Update faculty (ADMIN only)
router.put("/:id", authAdmin, controller.updateFaculty);

// Delete faculty (ADMIN only)
router.delete("/:id", authAdmin, controller.deleteFaculty);

module.exports = router;