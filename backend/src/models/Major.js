const mongoose = require("mongoose");

const MajorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Major", MajorSchema);