const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // file storage reference (Supabase path)
    storagePath: { type: String, required: true },

    originalFilename: String,
    mimeType: String,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    rejectionReason: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);