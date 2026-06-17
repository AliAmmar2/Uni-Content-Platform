const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  universityEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
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
  },

  role: {
    type: String,
    enum: ["STUDENT", "MODERATOR"],
    default: "STUDENT"
  },

  status: {
    type: String,
    enum: ["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"],
    default: "PENDING_VERIFICATION"
  },

  emailVerified: {
    type: Boolean,
    default: false
  },

  passwordHash: {
    type: String,
    required: true
  },

  resetPasswordToken: String,

  resetPasswordExpires: Date,

  lastLogin: Date,

  loginAttempts: {
    type: Number,
    default: 0
  },

  lockUntil: Date
}, { timestamps: true });

StudentSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports =
  mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);