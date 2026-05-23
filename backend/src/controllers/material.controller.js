const {v4: uuidv4} = require("uuid");
const supabase = require("../config/supabase.config");

const Material = require("../models/Material");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Admin = require("../models/Admin");
const BUCKET = process.env.SUPABASE_BUCKET || "course-material";

function isCourseInScope(course, user) {
    if (!course || !user) {
        return false;
    }

    return (
        course.major?.toString() === user.major?.toString() &&
        course.academicYear === user.academicYear &&
        course.calendarYear === user.calendarYear
    );
}

// ----------------------------
// STEP 1: get signed upload URL
// ----------------------------
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
//max file for free plan is 50 mb
exports.getUploadSignature = async (req, res) => {
    try {
        const {filename, mimeType, fileSize} = req.query;

        if (!filename || !mimeType || !fileSize) {
            return res.status(400).json({
                message: "filename, mimeType and fileSize are required"
            });
        }

        const numericFileSize = Number(fileSize);

        if (
            Number.isNaN(numericFileSize) ||
            numericFileSize <= 0
        ) {
            return res.status(400).json({
                message: "Invalid file size"
            });
        }

        if (numericFileSize > MAX_FILE_SIZE) {
            return res.status(400).json({
                message: "Maximum file size is 50MB"
            });
        }

        const allowedMimeTypes = [
            //pdf
            "application/pdf",

            //word
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            //excel
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",

            //powerpoint
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            //html
            "text/html",

            //images
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "image/bmp",
//videos
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime",
            "video/x-msvideo",

         //audio
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/ogg",
            "audio/webm",
            "audio/mp4",
            "audio/x-m4a"
        ];

        if (!allowedMimeTypes.includes(mimeType)) {
            return res.status(400).json({
                message: "Unsupported file type"
            });
        }

        const ext = filename.split(".").pop()?.toLowerCase();

        const storagePath = `uploads/${uuidv4()}.${ext}`;

        const {data, error} = await supabase.storage
            .from(BUCKET)
            .createSignedUploadUrl(storagePath);

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to generate upload URL"
            });
        }

        return res.json({
            signedUrl: data.signedUrl,
            storagePath
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
//STEP 2
// Upload material
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

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        let uploadedByModel;
        let uploadedByName;
        let approvalStatus = "PENDING";

        if (req.user.userType === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!isCourseInScope(course, student)) {
                return res.status(403).json({
                    message: "Not allowed for this course"
                });
            }

            uploadedByModel = "Student";
            uploadedByName = student.name;

            approvalStatus = student.role === "MODERATOR"
                ? "APPROVED"
                : "PENDING";
        }

        if (req.user.userType === "ADMIN") {
            const admin = await Admin.findById(req.user.id);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            uploadedByModel = "Admin";
            uploadedByName = admin.fullName;

            approvalStatus = "APPROVED";
        }

        if (!uploadedByModel || !uploadedByName) {
            return res.status(400).json({
                message: "Invalid user type"
            });
        }

        const material = await Material.create({
            title,
            description,
            storagePath,
            originalFilename,
            mimeType,
            uploadedBy: req.user.id,
            uploadedByModel,
            uploadedByName,
            course: courseId,
            approvalStatus
        });

        return res.status(201).json({
            message: "Material uploaded",
            material
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
// ----------------------------
// ACCESS MATERIAL
// ----------------------------
exports.getMaterialAccessUrl = async (req, res) => {
    try {
        const mode =
            req.query.mode === "download"
                ? "download"
                : "view";

        const material = await Material.findById(req.params.id)
            .populate("course");

        if (!material) {
            return res.status(404).json({
                message: "Material not found"
            });
        }

        const isAdmin =
            req.user.userType === "ADMIN" &&
            ["admin", "super_admin"].includes(req.user.role);

        const isModerator =
            req.user.userType === "STUDENT" &&
            req.user.role === "MODERATOR";

        const isNormalStudent =
            req.user.userType === "STUDENT" &&
            req.user.role === "STUDENT";

        if (isNormalStudent && material.approvalStatus !== "APPROVED") {
            return res.status(403).json({
                message: "Not approved yet"
            });
        }

        if (req.user.userType === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const isEnrolled =
                material.course.major.toString() === student.major.toString() &&
                material.course.academicYear === student.academicYear &&
                material.course.calendarYear === student.calendarYear;

            if (!isEnrolled) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else if (!isAdmin) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const {data, error} = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .createSignedUrl(
                material.storagePath,
                60 * 60,
                mode === "download"
                    ? {
                        download: material.originalFilename || true
                    }
                    : {}
            );

        if (error) {
            console.error("SIGNED URL ERROR:", error);

            return res.status(500).json({
                message: "Failed to generate URL"
            });
        }

        return res.json({
            url: data.signedUrl
        });

    } catch (error) {
        console.error("ACCESS URL ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
// Get approved materials
exports.getApprovedMaterialsByCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // only students should be scope-checked
        if (req.user.type === "STUDENT") {

            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!isCourseInScope(course, student)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        }

        const materials = await Material.find({
            course: course._id,
            approvalStatus: "APPROVED"
        })
            .populate(
                "uploadedBy",
                "name fullName universityEmail email role"
            )
            .populate(
                "course",
                "name code academicYear calendarYear semester"
            )
            .sort({createdAt: -1});

        return res.json(materials);

    } catch (error) {
        console.error("FETCH MATERIALS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
//GET PENDING MATERIALS
exports.getPendingMaterialsByCourseId = async (req, res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (req.user.type === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!req.user.role?.includes("MODERATOR")) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            if (!isCourseInScope(course, student)) {
                return res.status(403).json({
                    message: "You are not allowed to moderate this course"
                });
            }
        }

        if (req.user.type === "ADMIN") {
            const admin = await Admin.findById(req.user.id);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            if (
                !req.user.role?.includes("admin") &&
                !req.user.role?.includes("super_admin")
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        }

        const materials = await Material.find({
            course: courseId,
            approvalStatus: "PENDING"
        })
            .populate(
                "uploadedBy",
                "name fullName universityEmail email role"
            )
            .populate(
                "course",
                "name code academicYear calendarYear semester"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json(materials);

    } catch (error) {
        console.error("GET PENDING MATERIALS BY COURSE ID ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
// ----------------------------
// REVIEW
// ----------------------------
exports.reviewMaterial = async (req, res) => {
    try {
        const {approvalStatus, rejectionReason} = req.body;

        if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const material = await Material.findById(req.params.id)
            .populate("course");

        if (!material) {
            return res.status(404).json({
                message: "Material not found"
            });
        }

        if (req.user.userType === "STUDENT") {
            const moderator = await Student.findById(req.user.id);

            if (!moderator) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (req.user.role !== "MODERATOR") {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            if (!isCourseInScope(material.course, moderator)) {
                return res.status(403).json({
                    message: "Not allowed"
                });
            }
        } else if (req.user.userType === "ADMIN") {
            const admin = await Admin.findById(req.user.id);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            if (
                req.user.role !== "admin" &&
                req.user.role !== "super_admin"
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        material.approvalStatus = approvalStatus;
        material.rejectionReason =
            approvalStatus === "REJECTED"
                ? rejectionReason || "No reason provided"
                : undefined;

        await material.save();

        return res.json({
            message: "Updated",
            material
        });

    } catch (error) {
        console.error("REVIEW MATERIAL ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Delete
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id)
            .populate("course");

        if (!material) {
            return res.status(404).json({
                message: "Material not found"
            });
        }

        if (req.user.userType === "STUDENT") {
            const moderator = await Student.findById(req.user.id);

            if (!moderator) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!req.user.role?.includes("MODERATOR")) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            if (!isCourseInScope(material.course, moderator)) {
                return res.status(403).json({
                    message: "Not allowed"
                });
            }
        }

        if (req.user.userType === "ADMIN") {
            const admin = await Admin.findById(req.user.id);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            if (
                !req.user.role?.includes("admin") &&
                !req.user.role?.includes("super_admin")
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        }

        await supabase.storage
            .from(BUCKET)
            .remove([material.storagePath]);

        await material.deleteOne();

        return res.json({
            message: "Material deleted successfully"
        });

    } catch (error) {
        console.error("DELETE MATERIAL ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};