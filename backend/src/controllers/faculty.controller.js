const Faculty = require("../models/Faculty");

// Create a new faculty (Admin only)
exports.createFaculty = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    // Validation
    if (!name || !code) {
      return res.status(400).json({
        message: "Name and code are required"
      });
    }

    // Check duplicates
    const existing = await Faculty.findOne({
      $or: [{ name }, { code }]
    });

    if (existing) {
      return res.status(409).json({
        message: "Faculty already exists"
      });
    }

    // Create faculty (description is optional)
    const faculty = await Faculty.create({
      name,
      code,
      description: description || ""
    });

    return res.status(201).json(faculty);

  } catch (error) {
    console.error("CREATE FACULTY ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

// Get faculty by ID (details)
exports.getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found"
      });
    }

    return res.json(faculty);

  } catch (error) {
    console.error("GET FACULTY BY ID ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
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
    const { name, code, description } = req.body;

    // validation (required fields)
    if (!name || !code) {
      return res.status(400).json({
        message: "Name and code are required"
      });
    }

    const faculty = await Faculty.findByIdAndUpdate(
        id,
        {
          name,
          code,
          description: description || ""
        },
        { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    return res.json(faculty);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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
