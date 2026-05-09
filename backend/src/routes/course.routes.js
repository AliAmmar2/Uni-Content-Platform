const express = require("express");
const router = express.Router();

const anyAuth = require("../middleware/any-auth.middleware");
const auth = require("../middleware/auth.middleware");
const {requireRole} = require("../middleware/role.middleware");
const {allowStudentOrAdminRole} = require("../middleware/allow-by-role-middleware-auth");

const controller = require("../controllers/course.controller");

// Create course (admins or moderators only)
router.post(
    "/",
    anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.createCourse
);
// Get all courses (filtered)
router.get("/", anyAuth, controller.getAllCourses);

// Get single course
router.get("/:id", anyAuth, controller.getCourseById);

// Get course materials (student access check inside controller)
router.get("/:id/materials", anyAuth, controller.getCourseMaterials);

module.exports = router;