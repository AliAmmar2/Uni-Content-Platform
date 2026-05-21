const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabase.config");

const Material = require("../models/Material");
const Student = require("../models/Student");
const Course = require("../models/Course");

const BUCKET = process.env.SUPABASE_BUCKET || "course-material";

// ----------------------------
// Helper
// ----------------------------
function isCourseInScope(course, user) {
  return (
    course.major.toString() === user.major.toString() &&
    course.academicYear === user.academicYear &&
    course.calendarYear === user.calendarYear
  );
}

// ----------------------------
// STEP 1: get signed upload URL
// ----------------------------
exports.getUploadSignature = async (req, res) => {
  try {
    const { filename, mimeType } = req.query;

    if (!filename || !mimeType) {
      return res.status(400).json({
        message: "filename and mimeType are required"
      });
    }

    // basic file validation (recommended)
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        message: "Unsupported file type"
      });
    }

    const ext = filename.split(".").pop();
    const storagePath = `uploads/${uuidv4()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to generate upload URL"
      });
    }

    res.json({
      signedUrl: data.signedUrl,
      storagePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// STEP 2: save material
// ----------------------------
exports.uploadMaterial = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      storagePath,
      originalFilename,
      mimeType
    } = req.body;

    if (!title || !courseId || !storagePath) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    if (!storagePath.startsWith("uploads/")) {
      return res.status(400).json({
        message: "Invalid storage path"
      });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!isCourseInScope(course, student)) {
      return res.status(403).json({
        message: "Not allowed for this course"
      });
    }

    const approvalStatus =
      student.role === "MODERATOR" ? "APPROVED" : "PENDING";

    const material = await Material.create({
      title,
      description,
      storagePath,
      originalFilename,
      mimeType,
      uploadedBy: student._id,
      course: courseId,
      approvalStatus
    });

    res.status(201).json({
      message: "Material uploaded",
      material
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// ACCESS MATERIAL
// ----------------------------
exports.getMaterialAccessUrl = async (req, res) => {
  try {
    const mode = req.query.mode === "download" ? "download" : "view";

    const material = await Material.findById(req.params.id).populate(
      "course"
    );

    if (!material) {
      return res.status(404).json({ message: "Not found" });
    }

    if (material.approvalStatus !== "APPROVED") {
      return res.status(403).json({
        message: "Not approved yet"
      });
    }

    const student = await Student.findById(req.user.id);

    if (!isCourseInScope(material.course, student)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        material.storagePath,
        60 * 60,
        mode === "download"
          ? { download: material.originalFilename || true }
          : {}
      );

    if (error) {
      return res.status(500).json({
        message: "Failed to generate URL"
      });
    }

    res.json({
      url: data.signedUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// APPROVED MATERIALS
// ----------------------------
exports.getApprovedMaterialsByCourse = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    const course = await Course.findById(req.params.courseId);

    if (!isCourseInScope(course, student)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const materials = await Material.find({
      course: course._id,
      approvalStatus: "APPROVED"
    })
      .populate("uploadedBy", "name universityEmail")
      .populate("course", "name code")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// PENDING (MODERATOR)
// ----------------------------
exports.getPendingMaterials = async (req, res) => {
  try {
    const moderator = await Student.findById(req.user.id);

    const courses = await Course.find({
      major: moderator.major,
      academicYear: moderator.academicYear,
      calendarYear: moderator.calendarYear
    });

    const courseIds = courses.map((c) => c._id);

    const materials = await Material.find({
      course: { $in: courseIds },
      approvalStatus: "PENDING"
    }).populate("uploadedBy course");

    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// REVIEW
// ----------------------------
exports.reviewMaterial = async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const material = await Material.findById(req.params.id).populate(
      "course"
    );

    const moderator = await Student.findById(req.user.id);

    if (!isCourseInScope(material.course, moderator)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    material.approvalStatus = approvalStatus;
    material.rejectionReason =
      approvalStatus === "REJECTED" ? rejectionReason : undefined;

    await material.save();

    res.json({ message: "Updated", material });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// DELETE
// ----------------------------
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate(
      "course"
    );

    const moderator = await Student.findById(req.user.id);

    if (!isCourseInScope(material.course, moderator)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await supabase.storage
      .from(BUCKET)
      .remove([material.storagePath]);

    await material.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};