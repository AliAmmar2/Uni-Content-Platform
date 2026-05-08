const Course = require("../models/Course");
const Material = require("../models/Material");
const UniStudent = require("../models/Student");

// CREATE COURSE
exports.createCourse = async (req, res) => {
    try {
        const {name, code, major, academicYear, calendarYear, credits, semester} = req.body;

        if (!name || !code || !major || !academicYear || !calendarYear || !credits || !semester) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const course = await Course.create({
            name,
            code,
            major,
            academicYear,
            calendarYear,
            credits,
            semester
        });

        res.status(201).json({message: "Course created", course});

    } catch (error) {
        console.error("CREATE COURSE ERROR:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

// GET ALL COURSES (FILTERED)
exports.getAllCourses = async (req, res) => {
    try {
        const {major, calendarYear, academicYear} = req.query;

        const filter = {};
        if (major) filter.major = major;
        if (calendarYear) filter.calendarYear = calendarYear;
        if (academicYear) filter.academicYear = academicYear;

        const courses = await Course.find(filter).populate("major", "name");

        res.json(courses);

    } catch (error) {
        console.error("FETCH COURSES ERROR:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

// GET COURSE BY ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("major", "name");

        if (!course) {
            return res.status(404).json({message: "Course not found"});
        }

        res.json(course);

    } catch (error) {
        console.error("FETCH COURSE ERROR:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

// GET COURSE MATERIALS (student restricted)
exports.getCourseMaterials = async (req, res) => {
    try {
        const student = await UniStudent.findById(req.user.id);
        if (!student) return res.status(404).json({message: "Student not found"});

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({message: "Course not found"});

        if (
            course.major.toString() !== student.major.toString() ||
            course.academicYear !== student.academicYear ||
            course.calendarYear !== student.calendarYear
        ) {
            return res.status(403).json({message: "Access denied"});
        }

        const materials = await Material.find({
            course: course._id,
            approvalStatus: "APPROVED"
        })
            .populate("uploadedBy", "name universityEmail")
            .sort({createdAt: -1});

        res.json(materials);

    } catch (error) {
        console.error("FETCH COURSE MATERIALS ERROR:", error);
        res.status(500).json({message: "Internal server error"});
    }
};