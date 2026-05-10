const Course = require("../models/Course");
const Material = require("../models/Material");
const UniStudent = require("../models/Student");

// CREATE COURSE
exports.createCourse = async (req, res) => {
    try {
        const {
            name,
            code,
            description,
            credits,
            major,
            academicYear,
            calendarYear,
            semester
        } = req.body;

        // 1. Validate required fields
        if (
            !name ||
            !code ||
            !major ||
            !academicYear ||
            !calendarYear ||
            !credits ||
            !semester
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // 2. Check if major exists
        const majorExists = await Major.findById(major);

        if (!majorExists) {
            return res.status(404).json({
                message: "Major not found"
            });
        }

        // 3. Prevent duplicate course code
        const existingCourse = await Course.findOne({code});

        if (existingCourse) {
            return res.status(409).json({
                message: "Course code already exists"
            });
        }

        // 4. Create course
        const course = await Course.create({
            name,
            code,
            description,
            credits,
            major,
            academicYear,
            calendarYear,
            semester
        });

        return res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("CREATE COURSE ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("major", "name code")
            .sort({createdAt: -1});

        return res.json(courses);

    } catch (error) {
        console.error("GET ALL COURSES ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// get all courses by major Id
exports.getCoursesByMajor = async (req, res) => {
    try {
        const {majorId} = req.params;
        const user = req.user;

        // ❌ If not admin or student → block
        if (!["ADMIN", "STUDENT"].includes(user.userType)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // 🎓 STUDENT → must match their own major
        if (user.userType === "STUDENT") {
            const studentMajor = user.data.major?.toString();

            if (studentMajor !== majorId) {
                return res.status(403).json({
                    message: "Access denied: not your major"
                });
            }
        }

        // 👑 ADMIN → no restriction

        const courses = await Course.find({major: majorId})
            .populate("major", "name code")
            .sort({academicYear: 1, semester: 1});

        return res.json(courses);

    } catch (error) {
        console.error("GET COURSES BY MAJOR ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//by filter
exports.getAllCoursesFiltered = async (req, res) => {
    try {
        const {major, calendarYear, academicYear} = req.query;

        const filter = {};

        if (major) filter.major = major;
        if (calendarYear) filter.calendarYear = Number(calendarYear);
        if (academicYear) filter.academicYear = Number(academicYear);

        const courses = await Course.find(filter)
            .populate("major", "name code")
            .sort({
                academicYear: 1,
                semester: 1,
                name: 1
            });

        return res.json(courses);

    } catch (error) {
        console.error("FETCH COURSES ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


exports.getMyMajorCourses = async (req, res) => {
    try {
        const student = req.user.data;

        const courses = await Course.find({
            major: student.major
        })
            .populate("major", "name code")
            .sort({
                academicYear: 1,
                semester: 1,
                name: 1
            });

        return res.json(courses);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {

        const course = await Course.findById(req.params.id)
            .populate("major", "name code");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // 👑 ADMIN → full access
        if (req.user.userType === "ADMIN") {
            return res.json(course);
        }

        // 🎓 STUDENT → only same major
        if (req.user.userType === "STUDENT") {

            const student = req.user.data;

            const isAllowed =
                course.major._id.toString() === student.major.toString();

            if (!isAllowed) {
                return res.status(403).json({
                    message: "Access denied: wrong major"
                });
            }

            return res.json(course);
        }

        return res.status(403).json({
            message: "Forbidden"
        });

    } catch (error) {
        console.error("FETCH COURSE ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//get course material all statuses shown for admins and moderators
//get course material only approved materials for students that are registed in the course

exports.getCourseMaterials = async (req, res) => {
    try {

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const user = req.user;

        // 🎓 STUDENT → must match major BEFORE anything else
        if (user.userType === "STUDENT") {

            const student = user.data;

            const isSameMajor =
                course.major.toString() === student.major.toString();

            if (!isSameMajor) {
                return res.status(403).json({
                    message: "Access denied: not your major"
                });
            }
        }

        // base filter
        let filter = {
            course: course._id
        };

        // 👑 ADMIN → all materials
        if (user.userType === "ADMIN") {
            // no filter
        }

        // 🎓 MODERATOR → all materials
        else if (user.userType === "STUDENT" && user.role === "MODERATOR") {
            // no filter
        }

        // 🎓 STUDENT → only approved
        else if (user.userType === "STUDENT" && user.role === "STUDENT") {
            filter.approvalStatus = "APPROVED";
        }

        // ❌ anything else
        else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const materials = await Material.find(filter)
            .populate("uploadedBy", "name universityEmail")
            .sort({createdAt: -1});

        return res.json(materials);

    } catch (error) {
        console.error("FETCH COURSE MATERIALS ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // CHECK IF COURSE HAS MATERIALS
        const hasMaterials = await Material.exists({
            course: courseId
        });

        if (hasMaterials) {
            return res.status(400).json({
                message: "Cannot delete course. It has associated materials."
            });
        }

        // // OPTIONAL: CHECK IF ANY STUDENT DEPENDS ON IT
        // const studentUsingCourse = await UniStudent.exists({
        //   major: course.major,
        //   academicYear: course.academicYear,
        //   calendarYear: course.calendarYear
        // });
        //
        // if (studentUsingCourse) {
        //   return res.status(400).json({
        //     message: "Cannot delete course. It is currently assigned to students."
        //   });
        // }

        await Course.findByIdAndDelete(courseId);

        return res.json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        console.error("DELETE COURSE ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const {
            name,
            code,
            description,
            credits,
            major,
            academicYear,
            calendarYear,
            semester
        } = req.body;

        // 1. Check course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // 2. Validate required fields (FULL UPDATE)
        if (
            !name ||
            !code ||
            !major ||
            !academicYear ||
            !calendarYear ||
            !credits ||
            !semester
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // 3. Validate major exists
        const majorExists = await Major.findById(major);

        if (!majorExists) {
            return res.status(404).json({
                message: "Major not found"
            });
        }

        // 4. Prevent duplicate course code (exclude self)
        const existingCourse = await Course.findOne({
            code,
            _id: { $ne: courseId }
        });

        if (existingCourse) {
            return res.status(409).json({
                message: "Course code already exists"
            });
        }

        // 5. Update course
        course.name = name;
        course.code = code;
        course.description = description;
        course.credits = credits;
        course.major = major;
        course.academicYear = academicYear;
        course.calendarYear = calendarYear;
        course.semester = semester;

        await course.save();

        return res.json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.error("UPDATE COURSE ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};