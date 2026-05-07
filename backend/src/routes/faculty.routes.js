const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const controller = require("../controllers/faculty.controller");

// Get all faculties (any logged-in user)
router.get("/", auth, controller.getAllFaculties);

// Create faculty (ADMIN only)
router.post("/", auth, requireRole(["ADMIN"]), controller.createFaculty);

// Update faculty (ADMIN only)
router.put("/:id", auth, requireRole(["ADMIN"]), controller.updateFaculty);

// Delete faculty (ADMIN only)
router.delete("/:id", auth, requireRole(["ADMIN"]), controller.deleteFaculty);

router.get("/", auth, controller.getAllFaculties);

module.exports = router;