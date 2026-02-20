const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const Material = require("../models/Material");
const UniStudent = require("../models/UniStudents");
const Course = require("../models/Course");

// ==========================
// Upload Material (Student or Moderator)
// ==========================
router.post("/upload", auth, requireRole(["STUDENT", "MODERATOR"]), async (req, res) => {
  try {
    const { title, description, fileUrl, courseId } = req.body;

    if (!title || !fileUrl || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await UniStudent.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Students can only upload materials for courses in their major/year
    if (
      req.user.roles.includes("STUDENT") &&
      (
        course.major.toString() !== student.major.toString() ||
        course.academicYear !== student.academicYear ||
        course.calendarYear !== student.calendarYear
      )
    ) {
      return res.status(403).json({ message: "Cannot upload material for this course" });
    }

    const approvalStatus = req.user.roles.includes("MODERATOR") ? "APPROVED" : "PENDING";

    const material = await Material.create({
      title,
      description,
      fileUrl,
      course: courseId,
      uploadedBy: req.user.id,
      major: student.major,
      academicYear: student.academicYear,
      calendarYear: student.calendarYear,
      approvalStatus
    });

    res.status(201).json({ message: "Material uploaded", material });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================
// Get Approved Materials for a Course (Student)
// ==========================
router.get("/course/:courseId", auth, requireRole(["STUDENT"]), async (req, res) => {
  try {
    const student = await UniStudent.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only allow access to courses in the student's major/year
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
    console.error("FETCH MATERIALS ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================
// Moderator Approves / Rejects Material
// ==========================
router.put("/:id/approve", auth, requireRole(["MODERATOR"]), async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;
    if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    // Optional: prevent moderator from approving their own upload
    if (material.uploadedBy.toString() === req.user.id) {
      return res.status(403).json({ message: "Cannot approve your own material" });
    }

    material.approvalStatus = approvalStatus;
    if (approvalStatus === "REJECTED") material.rejectionReason = rejectionReason || "No reason provided";

    await material.save();

    res.json({ message: `Material ${approvalStatus.toLowerCase()}`, material });

  } catch (error) {
    console.error("APPROVAL ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================
// Optional: Delete Material (Moderator Only)
// ==========================
router.delete("/:id", auth, requireRole(["MODERATOR"]), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    await material.deleteOne();

    res.json({ message: "Material deleted successfully" });

  } catch (error) {
    console.error("DELETE MATERIAL ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
