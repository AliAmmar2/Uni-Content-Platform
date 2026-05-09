  const Major = require("../models/Major");
  const UniStudent = require("../models/Student");
  const Course = require("../models/Course");

  exports.getMajorById = async (req, res) => {
    try {
      const major = await Major.findById(req.params.id)
          .populate("faculty", "name code");

      if (!major) {
        return res.status(404).json({ message: "Major not found" });
      }

      const courses = await Course.find({ major: major._id });

      // 👑 ADMIN OR SUPER ADMIN
      if (req.admin) {
        return res.json({
          ...major.toObject(),
          courses
        });
      }

      // 🎓 STUDENT
      if (req.user) {
        const student = await UniStudent.findById(req.user.id);

        if (!student) {
          return res.status(404).json({ message: "Student not found" });
        }

        if (student.major.toString() !== major._id.toString()) {
          return res.status(403).json({ message: "Forbidden" });
        }

        return res.json({
          ...major.toObject(),
          courses
        });
      }

      return res.status(403).json({ message: "Forbidden" });

    } catch (error) {
      console.error("GET MAJOR ERROR:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  // =======================
  // GET ALL MAJORS
  // =======================
  exports.getAllMajors = async (req, res) => {
    try {
      const majors = await Major.find()
          .populate("faculty", "name code")
          .sort({ name: 1 });

      return res.json(majors);

    } catch (error) {
      console.error("GET MAJORS ERROR:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // =======================
  // CREATE MAJOR
  // =======================
  exports.createMajor = async (req, res) => {
    try {
      const { name, code, faculty, description } = req.body;

      if (!name || !code || !faculty) {
        return res.status(400).json({
          message: "name, code, faculty are required"
        });
      }

      const exists = await Major.findOne({
        $or: [{ name }, { code }]
      });

      if (exists) {
        return res.status(409).json({
          message: "Major already exists"
        });
      }

      const major = await Major.create({
        name,
        code,
        faculty,
        description
      });

      const populated = await Major.findById(major._id)
          .populate("faculty", "name code");

      return res.status(201).json(populated);

    } catch (error) {
      console.error("CREATE MAJOR ERROR:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // =======================
  // UPDATE MAJOR
  // =======================
  exports.updateMajor = async (req, res) => {
    try {
      const { id } = req.params;

      const major = await Major.findByIdAndUpdate(
          id,
          req.body,
          { new: true, runValidators: true }
      ).populate("faculty", "name code");

      if (!major) {
        return res.status(404).json({ message: "Major not found" });
      }

      return res.json(major);

    } catch (error) {
      console.error("UPDATE MAJOR ERROR:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // =======================
  // DELETE MAJOR
  // =======================
  exports.deleteMajor = async (req, res) => {
    try {
      const { id } = req.params;

      const major = await Major.findById(id);

      if (!major) {
        return res.status(404).json({ message: "Major not found" });
      }

      const studentsCount = await UniStudent.countDocuments({
        major: id
      });

      if (studentsCount > 0) {
        return res.status(400).json({
          message: "Cannot delete major with assigned students"
        });
      }

      await Major.findByIdAndDelete(id);

      return res.json({ message: "Major deleted successfully" });

    } catch (error) {
      console.error("DELETE MAJOR ERROR:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };