require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");

// Models
const Faculty = require("../src/models/Faculty");
const Major = require("../src/models/Major");
const OfficialStudent = require("../src/models/OfficialStudent");

// Data
const studentsData = require("../data/officialStudents");

const seed = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        // =====================================
        // CLEAR COLLECTIONS
        // =====================================
        await OfficialStudent.deleteMany();
        await Major.deleteMany();
        await Faculty.deleteMany();

        console.log("Old data cleared");

        // =====================================
        // SEED FACULTIES
        // =====================================
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

        // Create faculty lookup map
        const facultyMap = {};

        faculties.forEach(faculty => {
            facultyMap[faculty.name.trim()] = faculty._id;
        });

        // =====================================
        // SEED MAJORS
        // =====================================
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

        // Create major lookup map
        const majorMap = {};

        majors.forEach(major => {
            majorMap[major.name.trim()] = major._id;
        });

        // =====================================
        // FORMAT OFFICIAL STUDENTS
        // =====================================
        const formattedStudents = studentsData.map(student => ({

            universityId: student.universityId,

            universityEmail:
                student.universityEmail.toLowerCase().trim(),

            name: student.name.trim(),

            faculty:
                facultyMap[student.faculty?.trim()],

            major:
                majorMap[student.major?.trim()],

            academicYear: student.academicYear,

            calendarYear: student.calendarYear
        }));

        // =====================================
        // DEBUG CHECKS
        // =====================================
        formattedStudents.forEach(student => {

            if (!student.faculty) {
                console.log("MISSING FACULTY:", student);
            }

            if (!student.major) {
                console.log("MISSING MAJOR:", student);
            }
        });

        // =====================================
        // INSERT OFFICIAL STUDENTS
        // =====================================
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