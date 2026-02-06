const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  universityEmail: { type: String, unique: true },
  universityId: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: "STUDENT" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
