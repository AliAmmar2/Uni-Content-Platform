const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const controller = require("../controllers/course.controller");

// Create course (MODERATOR only)
router.post("/", auth, requireRole(["MODERATOR"]), controller.createCourse);

// Get all courses (filtered)
router.get("/", auth, controller.getAllCourses);

// Get single course
router.get("/:id", auth, controller.getCourseById);

// Get course materials (student access check inside controller)
router.get("/:id/materials", auth, requireRole(["STUDENT"]), controller.getCourseMaterials);

module.exports = router;