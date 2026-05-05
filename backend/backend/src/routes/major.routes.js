const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Major = require("../models/Major");

// Get all majors
router.get("/", auth, async (req, res) => {
  try {
    const majors = await Major.find().sort({ name: 1 });
    res.json(majors);
  } catch (error) {
    console.error("FETCH MAJORS ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Optional: get a single major
router.get("/:id", auth, async (req, res) => {
  try {
    const major = await Major.findById(req.params.id);
    if (!major) return res.status(404).json({ message: "Major not found" });
    res.json(major);
  } catch (error) {
    console.error("FETCH MAJOR ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
