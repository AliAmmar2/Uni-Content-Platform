const { v4: uuidv4 } = require("uuid");

const Announcement = require("../models/Announcement");
const Student = require("../models/Student");
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
    const { filename, mimeType } = req.query;

    if (!filename || !mimeType) {
      return res.status(400).json({
        message: "filename and mimeType are required"
      });
    }

    const ext = filename.split(".").pop();

    const storagePath =
      `announcement-images/${uuidv4()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      return res.status(500).json({
        message: "Failed to generate upload URL"
      });
    }

    return res.json({
      signedUrl: data.signedUrl,
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

    if (
      !title?.trim() ||
      !content?.trim() ||
      !courseId
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const moderator = await Student.findById(
      req.user.id
    );

    if (!moderator) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (!isCourseInScope(course, moderator)) {
      return res.status(403).json({
        message:
          "Cannot post announcement for this course"
      });
    }

    const announcement =
      await Announcement.create({
        title,
        content,
        course: course._id,
        postedBy: moderator._id,
        imagePath,
        imageMimeType,
        imageOriginalFilename
      });

    return res.status(201).json({
      message:
        "Announcement created successfully",
      announcement
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.getCourseAnnouncements = async (
  req,
  res
) => {
  try {
    const student = await Student.findById(
      req.user.id
    );

    if (!student) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const course = await Course.findById(
      req.params.courseId
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (!isCourseInScope(course, student)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const announcements =
      await Announcement.find({
        course: course._id
      })
        .populate(
          "postedBy",
          "name universityEmail"
        )
        .sort({ createdAt: -1 });

    const formattedAnnouncements =
      await Promise.all(
        announcements.map(async (announcement) => {
          let imageUrl = null;

          if (announcement.imagePath) {
            const { data } =
              await supabase.storage
                .from(BUCKET)
                .createSignedUrl(
                  announcement.imagePath,
                  60 * 60
                );

            imageUrl =
              data?.signedUrl || null;
          }

          return {
            ...announcement.toObject(),
            imageUrl
          };
        })
      );

    return res.json(formattedAnnouncements);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.updateAnnouncement = async (
  req,
  res
) => {
  try {
    const {
      title,
      content,
      imagePath,
      imageMimeType,
      imageOriginalFilename
    } = req.body;

    const moderator = await Student.findById(
      req.user.id
    );

    if (!moderator) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const announcement =
      await Announcement.findById(
        req.params.id
      ).populate("course");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    if (
      !isCourseInScope(
        announcement.course,
        moderator
      )
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    if (title) {
      announcement.title = title;
    }

    if (content) {
      announcement.content = content;
    }

    if (imagePath !== undefined) {
      announcement.imagePath = imagePath;
      announcement.imageMimeType =
        imageMimeType;
      announcement.imageOriginalFilename =
        imageOriginalFilename;
    }

    await announcement.save();

    return res.json({
      message:
        "Announcement updated successfully",
      announcement
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.deleteAnnouncement = async (
  req,
  res
) => {
  try {
    const moderator = await Student.findById(
      req.user.id
    );

    if (!moderator) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const announcement =
      await Announcement.findById(
        req.params.id
      ).populate("course");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    if (
      !isCourseInScope(
        announcement.course,
        moderator
      )
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    if (announcement.imagePath) {
      await supabase.storage
        .from(BUCKET)
        .remove([
          announcement.imagePath
        ]);
    }

    await announcement.deleteOne();

    return res.json({
      message:
        "Announcement deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};