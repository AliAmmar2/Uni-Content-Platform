const {v4: uuidv4} = require("uuid");

const Announcement = require("../models/CourseAnnouncement");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Course = require("../models/Course");

const supabase = require("../config/supabase.config");

const BUCKET =
    process.env.SUPABASE_BUCKET || "course-material";

function isCourseInScope(course, user) {
    return (
        course.major.toString() === user.major.toString() &&
        course.academicYear === user.academicYear &&
        course.calendarYear === user.calendarYear
    );
}

exports.getImageUploadSignature = async (req, res) => {
    try {
        const {filename, mimeType} = req.query;

        if (!filename || !mimeType) {
            return res.status(400).json({
                message: "filename and mimeType are required"
            });
        }

        const ext = filename.split(".").pop();

        const storagePath =
            `announcement-images/${uuidv4()}.${ext}`;

        const {data, error} = await supabase.storage
            .from(BUCKET)
            .createSignedUploadUrl(storagePath);

        if (error) {
            return res.status(500).json({
                message: "Failed to generate upload URL"
            });
        }

        return res.json({
            signedUrl: data.signedUrl,
            imagePath: storagePath,
            storagePath,
            token: data.token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const {
            title,
            content,
            courseId,
            imagePath,
            imageMimeType,
            imageOriginalFilename
        } = req.body;

        if (!title?.trim() || !content?.trim() || !courseId) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (!req.user || !req.user.userType) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        let postedBy;
        let postedByModel;
        let postedByName;

        if (req.user.userType === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!isCourseInScope(course, student)) {
                return res.status(403).json({
                    message: "Cannot post announcement for this course"
                });
            }

            postedBy = student._id;
            postedByModel = "Student";
            postedByName = student.name;
        }

        if (req.user.userType === "ADMIN") {
            const admin = await Admin.findById(req.user.id);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            postedBy = admin._id;
            postedByModel = "Admin";
            postedByName = admin.fullName;
        }

        if (!postedBy || !postedByModel || !postedByName) {
            return res.status(400).json({
                message: "Invalid user type"
            });
        }

        const announcementData = {
            title: title.trim(),
            content: content.trim(),
            course: course._id,
            postedBy,
            postedByModel,
            postedByName
        };

        if (imagePath) {
            announcementData.imagePath = imagePath;
        }

        if (imageMimeType) {
            announcementData.imageMimeType = imageMimeType;
        }

        if (imageOriginalFilename) {
            announcementData.imageOriginalFilename = imageOriginalFilename;
        }

        const announcement = await Announcement.create(announcementData);

        return res.status(201).json({
            message: "Announcement created successfully",
            announcement
        });
    } catch (error) {
        console.error("CREATE ANNOUNCEMENT ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getCourseAnnouncements = async (req, res) => {
    try {
        if (!req.user || !req.user.userType) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const course = await Course.findById(req.params.courseId);

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

            if (!isCourseInScope(course, student)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else if (req.user.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Invalid user type"
            });
        }

        const announcements = await Announcement.find({
            course: course._id
        })
            .populate(
                "postedBy",
                "name fullName universityEmail email role"
            )
            .sort({createdAt: -1});

        const formattedAnnouncements = await Promise.all(
            announcements.map(async (announcement) => {
                let imageUrl = null;

                if (announcement.imagePath) {
                    const {data} = await supabase.storage
                        .from(BUCKET)
                        .createSignedUrl(
                            announcement.imagePath,
                            60 * 60
                        );

                    imageUrl = data?.signedUrl || null;
                }

                return {
                    ...announcement.toObject(),
                    imageUrl
                };
            })
        );

        return res.json(formattedAnnouncements);
    } catch (error) {
        console.error("GET COURSE ANNOUNCEMENTS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const {
            title,
            content,
            imagePath,
            imageMimeType,
            imageOriginalFilename
        } = req.body;

        if (!req.user || !req.user.userType) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const announcement = await Announcement.findById(
            req.params.id
        ).populate("course");

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        if (req.user.userType === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!isCourseInScope(announcement.course, student)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else if (req.user.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Invalid user type"
            });
        }

        if (title?.trim()) {
            announcement.title = title.trim();
        }

        if (content?.trim()) {
            announcement.content = content.trim();
        }

        if (imagePath !== undefined) {
            announcement.imagePath = imagePath || undefined;
            announcement.imageMimeType = imageMimeType || undefined;
            announcement.imageOriginalFilename =
                imageOriginalFilename || undefined;
        }

        await announcement.save();

        return res.json({
            message: "Announcement updated successfully",
            announcement
        });
    } catch (error) {
        console.error("UPDATE ANNOUNCEMENT ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.deleteAnnouncement = async (req, res) => {
    try {
        if (!req.user || !req.user.userType) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const announcement = await Announcement.findById(
            req.params.id
        ).populate("course");

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        if (req.user.userType === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!isCourseInScope(announcement.course, student)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else if (req.user.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Invalid user type"
            });
        }

        if (announcement.imagePath) {
            await supabase.storage
                .from(BUCKET)
                .remove([announcement.imagePath]);
        }

        await announcement.deleteOne();

        return res.json({
            message: "Announcement deleted successfully"
        });
    } catch (error) {
        console.error("DELETE ANNOUNCEMENT ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.getAnnouncementById = async (req, res) => {
    try {
        if (!req.user || !req.user.userType) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const announcement = await Announcement.findById(
            req.params.id
        ).populate("course");

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        if (req.user.userType === "STUDENT") {
            const student = await Student.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            if (!isCourseInScope(announcement.course, student)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else if (req.user.userType !== "ADMIN") {
            return res.status(403).json({
                message: "Invalid user type"
            });
        }

        let imageUrl = null;

        if (announcement.imagePath) {
            const { data, error } = await supabase.storage
                .from(BUCKET)
                .createSignedUrl(
                    announcement.imagePath,
                    60 * 60
                );

            if (error) {
                console.error("GET ANNOUNCEMENT IMAGE ERROR:", error);
            }

            imageUrl = data?.signedUrl || null;
        }

        return res.json({
            ...announcement.toObject(),
            imageUrl
        });
    } catch (error) {
        console.error("GET ANNOUNCEMENT BY ID ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};