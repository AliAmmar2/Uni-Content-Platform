const mongoose = require("mongoose");

// Models
const Faculty = require("../src/models/Faculty");
const Major = require("../src/models/Major");
const Course = require("../src/models/Course");
const Student = require("../src/models/Student");
const OfficialStudent = require("../src/models/OfficialStudent");

const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/UniContentPlatform");
    console.log("Connected to MongoDB");

    // ----------------------------
    // CLEAR ALL
    // ----------------------------
    await Faculty.deleteMany();
    await Major.deleteMany();
    await Course.deleteMany();
    await Student.deleteMany();
    await OfficialStudent.deleteMany();

    console.log("Old data cleared");

    // ----------------------------
    // FACULTY
    // ----------------------------
    const faculty = await Faculty.create({
      name: "Engineering",
      code: "ENG",
      description: "Engineering Faculty"
    });

    // ----------------------------
    // MAJOR
    // ----------------------------
    const major = await Major.create({
      name: "Computer Science",
      code: "CS",
      faculty: faculty._id,
      description: "CS Major"
    });

    // ----------------------------
    // COURSES (IMPORTANT FOR TESTING)
    // ----------------------------
    const course1 = await Course.create({
      name: "Data Structures",
      code: "CS201",
      major: major._id,
      academicYear: 3,
      calendarYear: 2025
    });

    const course2 = await Course.create({
      name: "Algorithms",
      code: "CS202",
      major: major._id,
      academicYear: 3,
      calendarYear: 2025
    });

    console.log("Faculty, Major, Courses seeded");

    // ----------------------------
    // OFFICIAL STUDENTS (for registration validation)
    // ----------------------------
    await OfficialStudent.create([
      {
        universityId: "210001",
        universityEmail: "student@ul.edu.lb",
        name: "Test Student",
        faculty: faculty._id,
        major: major._id,
        academicYear: 3,
        calendarYear: 2025
      },
      {
        universityId: "210002",
        universityEmail: "moderator@ul.edu.lb",
        name: "Test Moderator",
        faculty: faculty._id,
        major: major._id,
        academicYear: 3,
        calendarYear: 2025
      }
    ]);

    console.log("Official students seeded");

    // ----------------------------
    // CREATE LOGIN USERS
    // ----------------------------
    const passwordHash = await bcrypt.hash("password123", 12);

    const student = await Student.create({
      universityId: "210001",
      universityEmail: "student@ul.edu.lb",
      name: "Test Student",
      faculty: faculty._id,
      major: major._id,
      academicYear: 3,
      calendarYear: 2025,
      role: "STUDENT",
      emailVerified: true,
      status: "ACTIVE",
      passwordHash
    });

    const moderator = await Student.create({
      universityId: "210002",
      universityEmail: "moderator@ul.edu.lb",
      name: "Test Moderator",
      faculty: faculty._id,
      major: major._id,
      academicYear: 3,
      calendarYear: 2025,
      role: "MODERATOR",
      emailVerified: true,
      status: "ACTIVE",
      passwordHash
    });

    console.log("Students + Moderator created");

    console.log("\n=== READY TO TEST ===");
    console.log("Student login: student@ul.edu.lb / password123");
    console.log("Moderator login: moderator@ul.edu.lb / password123");
    console.log("Course IDs:");
    console.log("CS201:", course1._id);
    console.log("CS202:", course2._id);

    process.exit();

  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
};

seed();