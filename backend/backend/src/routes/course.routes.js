// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth.middleware");
// const { requireRole } = require("../middleware/role.middleware");
// const Course = require("../models/Course");
// const Material = require("../models/Material");


// // ==========================
// // Create Course (Moderator/Admin)
// // ==========================
// router.post(
//   "/",
//   auth,
//   requireRole(["MODERATOR"]),
//   async (req, res) => {
//     try {
//       const { name, major, calendarYear, academicYear } = req.body;

//       if (!name || !major || !calendarYear || !academicYear) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       const course = await Course.create({
//         name,
//         major,
//         calendarYear,
//         academicYear
//       });

//       res.status(201).json({ message: "Course created", course });

//     } catch (error) {
//       console.error("CREATE COURSE ERROR:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );


// // ==========================
// // Get all courses (filtered)
// // ==========================
// router.get("/", auth, async (req, res) => {
//   try {
//     const { major, calendarYear, academicYear } = req.query;

//     const filter = {};
//     if (major) filter.major = major;
//     if (calendarYear) filter.calendarYear = calendarYear;
//     if (academicYear) filter.academicYear = academicYear;

//     const courses = await Course.find(filter).populate("major", "name");

//     res.json(courses);

//   } catch (error) {
//     console.error("FETCH COURSES ERROR:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// // ==========================
// // Get single course by ID
// // ==========================
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id)
//       .populate("major", "name");

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.json(course);

//   } catch (error) {
//     console.error("FETCH COURSE ERROR:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// // ==========================
// // Get approved materials for a course
// // ==========================
// router.get("/:id/materials", auth, async (req, res) => {
//   try {
//     const materials = await Material.find({
//       course: req.params.id,
//       approvalStatus: "APPROVED"
//     })
//       .populate("uploadedBy", "name universityEmail")
//       .sort({ createdAt: -1 });

//     res.json(materials);

//   } catch (error) {
//     console.error("FETCH COURSE MATERIALS ERROR:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// module.exports = router;


const Material = require("../models/Material");
const UniStudent = require("../models/UniStudent");

// GET /courses/:id/materials
router.get("/:id/materials", auth, requireRole(["STUDENT"]), async (req, res) => {
  try {
    const student = await UniStudent.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Ensure student can only access courses in their major and year
    if (
      course.major.toString() !== student.major.toString() ||
      course.academicYear !== student.academicYear ||
      course.calendarYear !== student.calendarYear
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const materials = await Material.find({
      course: course._id,
      approvalStatus: "APPROVED"
    })
      .populate("uploadedBy", "name universityEmail")
      .sort({ createdAt: -1 });

    res.json(materials);

  } catch (error) {
    console.error("FETCH COURSE MATERIALS ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
