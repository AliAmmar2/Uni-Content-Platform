const express = require("express");
const router = express.Router();

const anyAuth = require("../middleware/any-auth.middleware");
const adminAuth = require("../middleware/admin-auth.middleware");
const studentAuth = require("../middleware/student-auth.middleware");
const {allowStudentOrAdminRole} = require("../middleware/allow-by-role-middleware-auth");

const controller = require("../controllers/course.controller");

// Create course only admins
router.post(
    "/",
    adminAuth, controller.createCourse);

//get all courses for the student registered inside major
router.get(
    "/my-major",
    studentAuth,
    controller.getMyMajorCourses
);
// Get all courses (filtered)
router.get("/", adminAuth, controller.getAllCoursesFiltered);

// Get all courses
router.get("/all", adminAuth, controller.getAllCourses);

//get all courses by major ID
router.get(
    "/by-major/:majorId",
    anyAuth,
    controller.getCoursesByMajor
);
// Get single course
router.get("/:id", anyAuth, controller.getCourseById);

// Get course materials (student access check inside controller)
router.get("/:id/materials", anyAuth, controller.getCourseMaterials);

router.delete("/:id", adminAuth, controller.deleteCourse);

router.put(
    "/:id",
    adminAuth,
    controller.updateCourse
);
module.exports = router;