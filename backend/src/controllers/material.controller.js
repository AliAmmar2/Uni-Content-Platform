const Material = require("../models/Material");
const Student = require("../models/Student");
const Course = require("../models/Course");

// Upload material
exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, fileUrl, courseId } = req.body;

    if (!title || !fileUrl || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role.includes("STUDENT") &&
      (
        course.major.toString() !== student.major.toString() ||
        course.academicYear !== student.academicYear ||
        course.calendarYear !== student.calendarYear
      )
    ) {
      return res.status(403).json({ message: "Cannot upload material for this course" });
    }

    const approvalStatus = req.user.role.includes("MODERATOR") ? "APPROVED" : "PENDING";

    const material = await Material.create({
      title,
      description,
      fileUrl,
      course: courseId,
      uploadedBy: req.user.id,
      approvalStatus
    });

    res.status(201).json({ message: "Material uploaded", material });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get approved materials
exports.getApprovedMaterialsByCourse = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

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
};

// Approve / Reject
exports.reviewMaterial = async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    material.approvalStatus = approvalStatus;
    if (approvalStatus === "REJECTED") {
      material.rejectionReason = rejectionReason || "No reason provided";
    }

    await material.save();

    res.json({ message: `Material ${approvalStatus.toLowerCase()}`, material });

  } catch (error) {
    console.error("APPROVAL ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    await material.deleteOne();

    res.json({ message: "Material deleted successfully" });

  } catch (error) {
    console.error("DELETE MATERIAL ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};