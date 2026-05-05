const Faculty = require("../models/Faculty");

// Create a new faculty (Admin only)
exports.createFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const existing = await Faculty.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return res.status(409).json({ message: "Faculty already exists" });
    }

    const faculty = await Faculty.create({ name, code });
    res.status(201).json(faculty);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all faculties (any authenticated user)
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update faculty (Admin)
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(id, { name }, { new: true });
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.json(faculty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete faculty (Admin)
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.json({ message: "Faculty deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
