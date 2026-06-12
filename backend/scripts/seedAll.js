require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

        /* ================= FACULTIES ================= */
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

        const facultyMap = {};
        faculties.forEach(f => {
            facultyMap[f.name.trim()] = f._id;
        });

        console.log("Faculties seeded");

        /* ================= MAJORS ================= */
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

        const majorMap = {};
        majors.forEach(m => {
            majorMap[m.name.trim()] = m._id;
        });

        console.log("Majors seeded");

        /* ================= COURSES ================= */
        await Course.insertMany([
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

        /* ================= OFFICIAL STUDENTS ================= */
        const formattedStudents = studentsData.map(student => ({
            universityId: student.universityId,
            universityEmail: student.universityEmail.toLowerCase().trim(),
            name: student.name.trim(),
            faculty: facultyMap[student.faculty?.trim()],
            major: majorMap[student.major?.trim()],
            academicYear: student.academicYear,
            calendarYear: student.calendarYear
        }));

        await OfficialStudent.insertMany(formattedStudents);

        console.log("Official students seeded");

        /* ================= CS 4TH YEAR STUDENTS ================= */

        const passwordHash = await bcrypt.hash("Student123456", 10);

        const cs4Students = [];

        for (let i = 1; i <= 10; i++) {
            cs4Students.push({
                universityId: `CS4${100 + i}`,
                universityEmail: `cs4student${i}@university.com`,
                name: `CS4 Student ${i}`,
                faculty: facultyMap["Science"],
                major: majorMap["Computer Science"],
                academicYear: 4,
                calendarYear: 2025,
                role: i <= 2 ? "MODERATOR" : "STUDENT",
                status: "ACTIVE",
                emailVerified: true,
                passwordHash
            });
        }

        await Student.insertMany(cs4Students);

        console.log("CS 4th year students seeded (10 total, 2 moderators)");

        console.log("ALL DATA SEEDED SUCCESSFULLY");

        process.exit(0);

    } catch (err) {
        console.error("SEED ERROR:", err);
        process.exit(1);
    }
};

seed();