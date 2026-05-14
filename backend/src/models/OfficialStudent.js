const mongoose = require("mongoose");

const officialStudentSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true
  },

  universityEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  name: {
    type: String,
    required: true
  },

  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },

  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true
  },

  academicYear: {
    type: Number,
    required: true
  },

  calendarYear: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model(
  "OfficialStudent",
  officialStudentSchema
);