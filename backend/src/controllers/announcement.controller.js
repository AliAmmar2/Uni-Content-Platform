const Announcement = require('../models/Announcement');
const Student = require("../models/Student");
const Course = require("../models/Course");

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;

    // Validate required fields
    if (!title?.trim() || !content?.trim() || !courseId)  {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Get logged-in user
    const moderator = await Student.findById(req.user.id);

    if (!moderator) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check role
    if (moderator.role !== "MODERATOR") {
      return res.status(403).json({
        message: "Only moderators can create announcements"
      });
    }

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    // Moderator can only post inside their own major/year
    if (
      course.major.toString() !== moderator.major.toString() ||
      course.academicYear !== moderator.academicYear ||
      course.calendarYear !== moderator.calendarYear
    ) {
      return res.status(403).json({
        message: "Cannot post announcement for this course"
      });
    }

    // Create announcement
    const announcement = await Announcement.create({
      title,
      content,
      course: course._id,
      postedBy: moderator._id
    });

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
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    // only users from same major/year can access
    if (
      course.major.toString() !== student.major.toString() ||
      course.academicYear !== student.academicYear ||
      course.calendarYear !== student.calendarYear
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const announcements = await Announcement.find({
      course: course._id
    })
      .populate("postedBy", "name universityEmail")
      .sort({ createdAt: -1 });

    return res.json(announcements);

  } catch (error) {
    console.error("FETCH ANNOUNCEMENTS ERROR:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
 }

exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const moderator = await Student.findById(req.user.id);

    if (!moderator) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (moderator.role !== "MODERATOR") {
      return res.status(403).json({
        message: "Only moderators can update announcements"
      });
    }

    const announcement = await Announcement.findById(id)
      .populate("course");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    const course = announcement.course;

    // Must belong to same cohort
    if (
      course.major.toString() !== moderator.major.toString() ||
      course.academicYear !== moderator.academicYear ||
      course.calendarYear !== moderator.calendarYear
    ) {
      return res.status(403).json({
        message: "You cannot edit announcements for this course"
      });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;

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
    const moderator = await Student.findById(req.user.id);

    if (!moderator) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (moderator.role !== "MODERATOR") {
      return res.status(403).json({
        message: "Only moderators can delete announcements"
      });
    }

    const announcement = await Announcement.findById(req.params.id)
      .populate("course");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    const course = announcement.course;

    // Must belong to same cohort
    if (
      course.major.toString() !== moderator.major.toString() ||
      course.academicYear !== moderator.academicYear ||
      course.calendarYear !== moderator.calendarYear
    ) {
      return res.status(403).json({
        message: "You cannot delete announcements for this course"
      });
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




