const mongoose = require("mongoose");

const UniversityStudentSchema = new mongoose.Schema({
  universityId: String,
  universityEmail: String,
  name: String,
  faculty: String,
  major: String,
  status: String
});

module.exports = mongoose.model("UniversityStudent", UniversityStudentSchema);
