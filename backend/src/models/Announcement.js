const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    }
  },
  { timestamps: true }
);

AnnouncementSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model("Announcement", AnnouncementSchema);