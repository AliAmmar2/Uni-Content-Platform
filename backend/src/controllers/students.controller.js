const UniStudent = require("../models/Student");
const bcrypt = require("bcrypt");
// GET ALL
exports.getStudents = async (req, res) => {
    try {
        const students = await UniStudent.find()
            .populate("faculty")
            .populate("major");

        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET BY ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await UniStudent.findOne({
            universityId: req.params.id
        })
            .populate("faculty")
            .populate("major");

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE


exports.createStudent = async (req, res) => {
    try {
        const {
            universityId,
            universityEmail,
            name,
            faculty,
            major,
            academicYear,
            calendarYear,
            role,
            status,
            password
        } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newStudent = new UniStudent({
            universityId,
            universityEmail,
            name,
            faculty,
            major,
            academicYear,
            calendarYear,
            role,
            status,
            passwordHash
        });

        const saved = await newStudent.save();

        const studentResponse = saved.toObject();
        delete studentResponse.passwordHash;

        res.status(201).json(studentResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.updateStudent = async (req, res) => {
    try {
        const updated = await UniStudent.findOneAndUpdate(
            { universityId: req.params.id },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.deleteStudent = async (req, res) => {
    try {
        const deleted = await UniStudent.findOneAndDelete({
            universityId: req.params.id
        });

        if (!deleted) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};