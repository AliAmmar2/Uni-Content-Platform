require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");

// Models
const Student = require("../src/models/Student");
const Faculty = require("../src/models/Faculty");
const Major = require("../src/models/Major");
const Course = require("../src/models/Course");
const OfficialStudent = require("../src/models/OfficialStudent");
const Material = require("../src/models/Material");
// Data
const studentsData = require("../data/officialStudents");

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");
        await Student.deleteMany();
        await Material.deleteMany();
        await OfficialStudent.deleteMany();
        await Course.deleteMany();
        await Major.deleteMany();
        await Faculty.deleteMany();

        console.log("Old data cleared");

        const faculties = await Faculty.insertMany([
            {
                name: "Engineering",
                code: "ENG",
                description: "Engineering Faculty"
            },
            {
                name: "Science",
                code: "SCI",
                description: "Science Faculty"
            },
            {
                name: "Business",
                code: "BUS",
                description: "Business Faculty"
            }
        ]);

        console.log("Faculties seeded");

        const facultyMap = {};

        faculties.forEach(faculty => {
            facultyMap[faculty.name.trim()] = faculty._id;
        });

        const majors = await Major.insertMany([
            {
                name: "Computer Engineering",
                code: "CE",
                faculty: facultyMap["Engineering"]
            },
            {
                name: "Computer Science",
                code: "CS",
                faculty: facultyMap["Engineering"]
            },
            {
                name: "Mathematics",
                code: "MATH",
                faculty: facultyMap["Science"]
            },
            {
                name: "Physics",
                code: "PHY",
                faculty: facultyMap["Science"]
            },
            {
                name: "Finance",
                code: "FIN",
                faculty: facultyMap["Business"]
            }
        ]);

        console.log("Majors seeded");

        const majorMap = {};

        majors.forEach(major => {
            majorMap[major.name.trim()] = major._id;
        });

        const courses = await Course.insertMany([
            // Computer Engineering
            {
                name: "Circuit Analysis",
                code: "CE101",
                description: "Introduction to electrical circuits.",
                credits: 3,
                major: majorMap["Computer Engineering"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM1"
            },
            {
                name: "Digital Logic Design",
                code: "CE102",
                description: "Basics of digital systems and logic gates.",
                credits: 3,
                major: majorMap["Computer Engineering"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM2"
            },

            // Computer Science
            {
                name: "Introduction to Programming",
                code: "CS101",
                description: "Programming fundamentals.",
                credits: 3,
                major: majorMap["Computer Science"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM1"
            },
            {
                name: "Data Structures",
                code: "CS102",
                description: "Arrays, stacks, queues, trees, and graphs.",
                credits: 3,
                major: majorMap["Computer Science"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM2"
            },

            // Mathematics
            {
                name: "Calculus I",
                code: "MATH101",
                description: "Limits, derivatives, and integrals.",
                credits: 3,
                major: majorMap["Mathematics"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM1"
            },

            // Physics
            {
                name: "General Physics I",
                code: "PHY101",
                description: "Mechanics and motion.",
                credits: 3,
                major: majorMap["Physics"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM1"
            },

            // Finance
            {
                name: "Principles of Finance",
                code: "FIN101",
                description: "Introduction to financial principles.",
                credits: 3,
                major: majorMap["Finance"],
                academicYear: 1,
                calendarYear: 2025,
                semester: "SEM1"
            }
        ]);

        console.log("Courses seeded");

        const formattedStudents = studentsData.map(student => ({
            universityId: student.universityId,

            universityEmail: student.universityEmail.toLowerCase().trim(),

            name: student.name.trim(),

            faculty: facultyMap[student.faculty?.trim()],

            major: majorMap[student.major?.trim()],

            academicYear: student.academicYear,

            calendarYear: student.calendarYear
        }));

        formattedStudents.forEach(student => {
            if (!student.faculty) {
                console.log("MISSING FACULTY:", student);
            }

            if (!student.major) {
                console.log("MISSING MAJOR:", student);
            }
        });

        await OfficialStudent.insertMany(formattedStudents);

        console.log("Official students seeded");
        console.log("ALL DATA SEEDED SUCCESSFULLY");

        process.exit();
    } catch (err) {
        console.error("SEED ERROR:", err);
        process.exit(1);
    }
};

seed();