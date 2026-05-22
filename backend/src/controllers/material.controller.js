// // Upload material
// exports.uploadMaterial = async (req, res) => {
//   try {
//     const { title, description, fileUrl, courseId } = req.body;
//
//     if (!title || !fileUrl || !courseId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//
//     const student = await Student.findById(req.user.id);
//     if (!student) return res.status(404).json({ message: "User not found" });
//
//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found" });
//
//     if (
//       req.user.role.includes("STUDENT") &&
//       (
//         course.major.toString() !== student.major.toString() ||
//         course.academicYear !== student.academicYear ||
//         course.calendarYear !== student.calendarYear
//       )
//     ) {
//       return res.status(403).json({ message: "Cannot upload material for this course" });
//     }
//
//     const approvalStatus = req.user.role.includes("MODERATOR") ? "APPROVED" : "PENDING";
//
//     const material = await Material.create({
//       title,
//       description,
//       fileUrl,
//       course: courseId,
//       uploadedBy: req.user.id,
//       approvalStatus
//     });
//
//     res.status(201).json({ message: "Material uploaded", material });
//
//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
//

const Material = require("../models/Material");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const path = require("path");
const supabase = require("../config/supabase");

exports.uploadMaterial = async (req, res) => {
    try {
        const {
            title,
            description,
            courseId
        } = req.body;

        if (!title || !courseId || !req.file) {
            return res.status(400).json({
                message: "Title, courseId and file are required"
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        let user = null;
        let uploadedByModel = null;
        let uploadedByName = "";
        let approvalStatus = "PENDING";

        if (req.user.userType === "ADMIN") {

            user = await Admin.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            uploadedByModel = "Admin";
            uploadedByName = user.fullName;
            approvalStatus = "APPROVED";
        }

        if (req.user.userType === "STUDENT") {

            user = await Student.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            uploadedByModel = "Student";
            uploadedByName = user.name;

            if (user.role === "MODERATOR") {
                approvalStatus = "APPROVED";
            }

            const isEnrolled =
                course.major.toString() === user.major.toString() &&
                course.academicYear === user.academicYear &&
                course.calendarYear === user.calendarYear;

            if (!isEnrolled) {
                return res.status(403).json({
                    message: "Cannot upload material for this course"
                });
            }
        }

        if (!user || !uploadedByModel || !uploadedByName) {
            return res.status(403).json({
                message: "Invalid uploader type"
            });
        }

        const extension = path.extname(req.file.originalname);

        const fileName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

        const filePath =
            `materials/${courseId}/${fileName}`;

        const {error: uploadError} =
            await supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(
                    filePath,
                    req.file.buffer,
                    {
                        contentType: req.file.mimetype,
                        upsert: false
                    }
                );

        if (uploadError) {

            console.error("SUPABASE ERROR:", uploadError);

            return res.status(500).json({
                message: "Failed to upload file",
                error: uploadError.message
            });
        }

        const {data} =
            supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .getPublicUrl(filePath);

        if (!data?.publicUrl) {
            return res.status(500).json({
                message: "Failed to generate public URL"
            });
        }

        const material = await Material.create({
            title,
            description,
            fileUrl: data.publicUrl,
            uploadedBy: req.user.id,
            uploadedByModel,
            uploadedByName,
            course: courseId,
            approvalStatus
        });

        return res.status(201).json({
            message: "Material uploaded successfully",
            material
        });

    } catch (error) {

        console.error("UPLOAD MATERIAL ERROR:", error);

        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
};
exports.getApprovedMaterialsByCourse = async (req, res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
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
                course.major.toString() === student.major.toString() &&
                course.academicYear === student.academicYear &&
                course.calendarYear === student.calendarYear;

            if (!isEnrolled) {
                return res.status(403).json({
                    message: "Access denied. You are not enrolled in this course."
                });
            }
        } else if (req.user.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Invalid user type"
            });
        }

        const materials = await Material.find({
            course: course._id,
            approvalStatus: "APPROVED"
        })
            .populate("uploadedBy", "name fullName universityEmail email role")
            .populate("course", "name code academicYear calendarYear semester")
            .sort({createdAt: -1});

        return res.status(200).json(materials);

    } catch (error) {
        console.error("FETCH APPROVED MATERIALS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
// Get approved materials
exports.getApprovedMaterialsByCourse = async (req, res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
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
                course.major.toString() === student.major.toString() &&
                course.academicYear === student.academicYear &&
                course.calendarYear === student.calendarYear;

            if (!isEnrolled) {
                return res.status(403).json({
                    message: "Access denied. You are not enrolled in this course."
                });
            }
        } else if (req.user.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Invalid user type"
            });
        }

        const materials = await Material.find({
            course: course._id,
            approvalStatus: "APPROVED"
        })
            .populate("uploadedBy", "name username universityEmail email role")
            .populate("course", "name code academicYear calendarYear semester")
            .sort({createdAt: -1});

        return res.status(200).json(materials);

    } catch (error) {
        console.error("FETCH APPROVED MATERIALS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getPendingMaterialsByCourse = async (req, res) => {
    try {

        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (req.user.userType === "STUDENT") {

            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (student.role !== "MODERATOR") {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            const isEnrolled =
                course.major.toString() === student.major.toString() &&
                course.academicYear === student.academicYear &&
                course.calendarYear === student.calendarYear;

            if (!isEnrolled) {
                return res.status(403).json({
                    message: "You are not allowed to moderate this course"
                });
            }
        }

        if (req.user.userType === "ADMIN") {

            if (
                !["admin", "super_admin"].includes(req.user.role)
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

        console.error(
            "GET PENDING MATERIALS BY COURSE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.reviewMaterial = async (req, res) => {
    try {
        const {
            approvalStatus,
            rejectionReason
        } = req.body;

        if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
            return res.status(400).json({
                message: "Invalid approval status"
            });
        }

        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).json({
                message: "Material not found"
            });
        }

        if (
            material.approvalStatus === "APPROVED" ||
            material.approvalStatus === "REJECTED"
        ) {
            return res.status(400).json({
                message: "Material already reviewed"
            });
        }

        material.approvalStatus = approvalStatus;

        if (approvalStatus === "REJECTED") {
            material.rejectionReason =
                rejectionReason?.trim() || "No reason provided";
        } else {
            material.rejectionReason = null;
        }

        await material.save();

        return res.status(200).json({
            message: `Material ${approvalStatus.toLowerCase()} successfully`,
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
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({message: "Material not found"});

        await material.deleteOne();

        res.json({message: "Material deleted successfully"});

    } catch (error) {
        console.error("DELETE MATERIAL ERROR:", error);
        res.status(500).json({message: "Internal server error"});
    }
};