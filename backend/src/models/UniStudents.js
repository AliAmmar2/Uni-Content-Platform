
const mongoose = require("mongoose");

const UniStudentSchema = new mongoose.Schema({
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
    required: true,
    index: true
  },
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
    max: 5
  },
  calendarYear: { 
    type: Number, 
    required: true,
    min: 2020,
    max: 2100
  },
  roles: {
    type: [String],
    enum: ["STUDENT", "MODERATOR", "ADMIN"],
    default: ["STUDENT"]
  },
  status: { 
    type: String, 
    enum: ["ACTIVE", "SUSPENDED", "GRADUATED"], 
    default: "ACTIVE",
    index: true
  },
  passwordHash: { 
    type: String 
    // C=consider removing if passwordless auth
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, { 
  timestamps: true 
});

UniStudentSchema.index({ major: 1, academicYear: 1, calendarYear: 1 });
UniStudentSchema.index({ status: 1, major: 1 });

// Virtual for account lock status
UniStudentSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to increment login attempts
UniStudentSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  
  const maxAttempts = 10;
  const lockTime = 2 * 60 * 1000; 
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

UniStudentSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 }
  });
};

module.exports = mongoose.model("UniStudents", UniStudentSchema);
