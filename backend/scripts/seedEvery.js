require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Models
const Admin = require("../src/models/Admin");
const Student = require("../src/models/Student");
const Faculty = require("../src/models/Faculty");
const Major = require("../src/models/Major");
const Course = require("../src/models/Course");
const OfficialStudent = require("../src/models/OfficialStudent");
const Material = require("../src/models/Material");

async function seedAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // CLEAN
        await Promise.all([
            Admin.deleteMany({}),
            Student.deleteMany({}),
            Faculty.deleteMany({}),
            Major.deleteMany({}),
            Course.deleteMany({}),
            OfficialStudent.deleteMany({}),
            Material.deleteMany({})
        ]);

        console.log("Collections cleared");

        /* ================= ADMIN ================= */
        const passwordHash = await bcrypt.hash("Admin123456", 10);

        await Admin.insertMany([
            {
                username: "superadmin",
                email: "superadmin@university.com",
                fullName: "System Super Admin",
                role: "super_admin",
                passwordHash
            },
            {
                username: "admin1",
                email: "admin1@university.com",
                fullName: "Admin One",
                role: "admin",
                passwordHash
            }
        ]);

        console.log("Admins seeded");

        /* ================= FACULTIES ================= */
        const faculties = await Faculty.insertMany([
            { name: "Engineering", code: "ENG", description: "Engineering Faculty" },
            { name: "Science", code: "SCI", description: "Science Faculty" },
            { name: "Business", code: "BUS", description: "Business Faculty" }
        ]);

        const facultyMap = {};
        faculties.forEach(f => facultyMap[f.name] = f._id);

        /* ================= MAJORS ================= */
        const majors = await Major.insertMany([
            {
                name: "Computer Science",
                code: "CS",
                faculty: facultyMap["Science"]
            }
        ]);

        const majorMap = {};
        majors.forEach(m => majorMap[m.name] = m._id);

        console.log("Faculties + Majors seeded");

        /* ================= COURSES ================= */
        const csMajor = majorMap["Computer Science"];

        const year3Courses = [
            { name: "Algorithms", code: "CS301", semester: "SEM1" },
            { name: "Operating Systems", code: "CS302", semester: "SEM1" },
            { name: "Database Systems", code: "CS303", semester: "SEM1" },
            { name: "Software Engineering", code: "CS304", semester: "SEM1" },
            { name: "Computer Networks", code: "CS305", semester: "SEM1" },
            { name: "Discrete Mathematics", code: "CS306", semester: "SEM1" },

            { name: "AI Fundamentals", code: "CS307", semester: "SEM2" },
            { name: "Machine Learning", code: "CS308", semester: "SEM2" },
            { name: "Web Development", code: "CS309", semester: "SEM2" },
            { name: "Mobile Development", code: "CS310", semester: "SEM2" },
            { name: "Cloud Computing", code: "CS311", semester: "SEM2" },
            { name: "Cybersecurity", code: "CS312", semester: "SEM2" }
        ];

        const year4Courses = [
            { name: "Advanced Algorithms", code: "CS401", semester: "SEM1" },
            { name: "Distributed Systems", code: "CS402", semester: "SEM1" },
            { name: "Advanced Databases", code: "CS403", semester: "SEM1" },
            { name: "Research Methods", code: "CS404", semester: "SEM1" },
            { name: "Compiler Design", code: "CS405", semester: "SEM1" },
            { name: "AI Advanced Topics", code: "CS406", semester: "SEM1" },

            { name: "Final Year Project I", code: "CS407", semester: "SEM2" },
            { name: "Final Year Project II", code: "CS408", semester: "SEM2" },
            { name: "Deep Learning", code: "CS409", semester: "SEM2" },
            { name: "Big Data Systems", code: "CS410", semester: "SEM2" },
            { name: "Blockchain Systems", code: "CS411", semester: "SEM2" },
            { name: "Advanced Networking", code: "CS412", semester: "SEM2" }
        ];

        await Course.insertMany([
            ...year3Courses.map(c => ({
                ...c,
                credits: 3,
                major: csMajor,
                academicYear: 3,
                calendarYear: 2025
            })),
            ...year4Courses.map(c => ({
                ...c,
                credits: 3,
                major: csMajor,
                academicYear: 4,
                calendarYear: 2025
            }))
        ]);

        console.log("Courses seeded");

        /* ================= OFFICIAL STUDENTS ================= */
        const students = [
            {
                universityId: "965801",
                universityEmail: "965801@university.com",
                name: "Student 965801",
                faculty: facultyMap["Science"],
                major: csMajor,
                academicYear: 4,
                calendarYear: 2025
            },
            {
                universityId: "965802",
                universityEmail: "alialiamam.ss@gmail.com",
                name: "Ali Aliamam",
                faculty: facultyMap["Science"],
                major: csMajor,
                academicYear: 3,
                calendarYear: 2025
            }
        ];

        await OfficialStudent.insertMany(students);

        console.log("Official students seeded");

        /* ================= CS 4TH YEAR STUDENTS ================= */

        const studentPassword = await bcrypt.hash("Student123456", 10);

        const cs4Students = [];

        for (let i = 1; i <= 10; i++) {
            cs4Students.push({
                universityId: `CS4${100 + i}`,
                universityEmail: `cs4student${i}@university.com`,
                name: `CS4 Student ${i}`,
                faculty: facultyMap["Science"],
                major: csMajor,
                academicYear: 4,
                calendarYear: 2025,
                role: i <= 2 ? "MODERATOR" : "STUDENT",
                status: "ACTIVE",
                emailVerified: true,
                passwordHash: studentPassword
            });
        }

        await Student.insertMany(cs4Students);

        console.log("CS 4th year students seeded (10 total, 2 moderators)");

        console.log("ALL DONE");

        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        console.error("SEED ERROR:", err);
        process.exit(1);
    }
}

seedAll();