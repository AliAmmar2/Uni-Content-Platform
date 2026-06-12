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
    try{
        const studentPasswordHash = await bcrypt.hash("Student123456", 9);
        const students = [
  {
    universityId: "965802",
    universityEmail: "moderator2.cs4@university.com",
    name: "Moderator Two",
    faculty: facultyMap["Science"],
    major: majorMap["Computer Science"],
    academicYear: 4,
    calendarYear: 2025,
    role: "MODERATOR",
    status: "ACTIVE",
    emailVerified: true,
    passwordHash: studentPasswordHash
  },

  // Regular students
  {
    universityId: "965803",
    universityEmail: "student1.cs4@university.com",
    name: "Student One",
    faculty: facultyMap["Science"],
    major: majorMap["Computer Science"],
    academicYear: 4,
    calendarYear: 2025,
    role: "STUDENT",
    status: "ACTIVE",
    emailVerified: true,
    passwordHash: studentPasswordHash
  },
  {
    universityId: "965804",
    universityEmail: "student2.cs4@university.com",
    name: "Student Two",
    faculty: facultyMap["Science"],
    major: majorMap["Computer Science"],
    academicYear: 4,
    calendarYear: 2025,
    role: "STUDENT",
    status: "ACTIVE",
    emailVerified: true,
    passwordHash: studentPasswordHash
  },
  {
    universityId: "965805",
    universityEmail: "student3.cs4@university.com",
    name: "Student Three",
    faculty: facultyMap["Science"],
    major: majorMap["Computer Science"],
    academicYear: 4,
    calendarYear: 2025,
    role: "STUDENT",
    status: "ACTIVE",
    emailVerified: true,
    passwordHash: studentPasswordHash
  }
];

// Add more students automatically
for (let i = 806; i <= 830; i++) {
  students.push({
    universityId: `965${i}`,
    universityEmail: `student${i}@university.com`,
    name: `CS Student ${i}`,
    faculty: facultyMap["Science"],
    major: majorMap["Computer Science"],
    academicYear: 4,
    calendarYear: 2025,
    role: "STUDENT",
    status: "ACTIVE",
    emailVerified: true,
    passwordHash: studentPasswordHash
  });
}
        await Student.insertMany(students);
        console.log('seeded')
    } catch (err) {
        console.error("SEED ERROR:", err);
        process.exit(1);
    }
}

