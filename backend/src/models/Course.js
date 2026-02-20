const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  code:        { type: String, required: true, unique: true },
  description: { type: String },
  credits:     { type: Number, required: true },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true,
    index: true
  },
  academicYear: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  calendarYear: {
    type: Number,
    required: true,
    index: true
  },
  semester: {
    type: String,
    enum: ["SEM1", "SEM2"],   
    required: true
  }
}, { timestamps: true });

CourseSchema.index({ major: 1, academicYear: 1, calendarYear: 1 });

module.exports = mongoose.model("Course", CourseSchema);