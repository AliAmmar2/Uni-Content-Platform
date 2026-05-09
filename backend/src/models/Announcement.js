const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
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
    ref: "UniStudents",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);