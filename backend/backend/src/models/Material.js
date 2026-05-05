const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true }, // stored in cloud (S3, Firebase, etc.)
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UniStudent", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  approvalStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model("Material", materialSchema);
