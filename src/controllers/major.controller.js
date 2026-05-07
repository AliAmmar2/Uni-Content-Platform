const Major = require("../models/Major");

// Get all majors
exports.getAllMajors = async (req, res) => {
  try {
    const majors = await Major.find()
      .populate("faculty", "name code") // optional but useful
      .sort({ name: 1 });

    res.json(majors);
  } catch (error) {
    console.error("FETCH MAJORS ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get one major
exports.getMajorById = async (req, res) => {
  try {
    const major = await Major.findById(req.params.id)
      .populate("faculty", "name code");

    if (!major) {
      return res.status(404).json({ message: "Major not found" });
    }

    res.json(major);
  } catch (error) {
    console.error("FETCH MAJOR ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};