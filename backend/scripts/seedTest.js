const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const Faculty = require("../src/models/Faculty");
const Major = require("../src/models/Major");
const Course = require("../src/models/Course");
const UniStudents = require("../src/models/Student");

async function seedUniversity() {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Faculty.deleteMany();
    await Major.deleteMany();
    await Course.deleteMany();
    await UniStudents.deleteMany();

    // 1. FACULTIES
    const faculties = await Faculty.insertMany([
      {
        name: "Faculty of Engineering",
        code: "ENG",
        description: "Engineering and technology programs"
      },
      {
        name: "Faculty of Business",
        code: "BUS",
        description: "Business, accounting, and management programs"
      },
      {
        name: "Faculty of Computer Science",
        code: "CS",
        description: "Computer science and software development programs"
      }
    ]);

    const engineering = faculties.find(f => f.code === "ENG");
    const business = faculties.find(f => f.code === "BUS");
    const computerScience = faculties.find(f => f.code === "CS");

    // 2. MAJORS CONNECTED TO FACULTIES
    const majors = await Major.insertMany([
      {
        name: "Civil Engineering",
        code: "CE",
        faculty: engineering._id,
        description: "Study of buildings, roads, and infrastructure",
        totalCredits: 180,
        duration: "3 Years (Bachelor)"
      },
      {
        name: "Mechanical Engineering",
        code: "ME",
        faculty: engineering._id,
        description: "Study of machines, mechanics, and energy systems",
        totalCredits: 180,
        duration: "3 Years (Bachelor)"
      },
      {
        name: "Business Administration",
        code: "BA",
        faculty: business._id,
        description: "Management, finance, marketing, and business strategy",
        totalCredits: 180,
        duration: "3 Years (Bachelor)"
      },
      {
        name: "Accounting",
        code: "ACC",
        faculty: business._id,
        description: "Accounting, auditing, and financial reporting",
        totalCredits: 180,
        duration: "3 Years (Bachelor)"
      },
      {
        name: "Computer Science",
        code: "CSCI",
        faculty: computerScience._id,
        description: "Programming, algorithms, databases, and software systems",
        totalCredits: 180,
        duration: "3 Years (Bachelor)"
      },
      {
        name: "Software Engineering",
        code: "SE",
        faculty: computerScience._id,
        description: "Software design, development, testing, and architecture",
        totalCredits: 180,
        duration: "3 Years (Bachelor)"
      }
    ]);

    const civil = majors.find(m => m.code === "CE");
    const mechanical = majors.find(m => m.code === "ME");
    const businessAdmin = majors.find(m => m.code === "BA");
    const accounting = majors.find(m => m.code === "ACC");
    const cs = majors.find(m => m.code === "CSCI");
    const software = majors.find(m => m.code === "SE");

    // 3. COURSES CONNECTED TO MAJORS
    await Course.insertMany([
      // Civil Engineering
      {
        name: "Engineering Mathematics",
        code: "CE101",
        description: "Basic mathematics for engineering students",
        credits: 6,
        major: civil._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Statics",
        code: "CE102",
        description: "Introduction to forces and equilibrium",
        credits: 6,
        major: civil._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM2"
      },

      // Mechanical Engineering
      {
        name: "Thermodynamics",
        code: "ME101",
        description: "Heat, energy, and thermodynamic systems",
        credits: 6,
        major: mechanical._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Engineering Drawing",
        code: "ME102",
        description: "Technical drawing and CAD basics",
        credits: 5,
        major: mechanical._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM2"
      },

      // Business Administration
      {
        name: "Introduction to Management",
        code: "BA101",
        description: "Basic concepts of management",
        credits: 5,
        major: businessAdmin._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Principles of Marketing",
        code: "BA102",
        description: "Marketing strategies and consumer behavior",
        credits: 5,
        major: businessAdmin._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM2"
      },

      // Accounting
      {
        name: "Financial Accounting I",
        code: "ACC101",
        description: "Introduction to financial accounting",
        credits: 6,
        major: accounting._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Cost Accounting",
        code: "ACC102",
        description: "Cost calculation and accounting systems",
        credits: 6,
        major: accounting._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM2"
      },

      // Computer Science
      {
        name: "Introduction to Programming",
        code: "CS101",
        description: "Programming basics using JavaScript",
        credits: 6,
        major: cs._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Data Structures",
        code: "CS102",
        description: "Arrays, linked lists, stacks, queues, and trees",
        credits: 6,
        major: cs._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM2"
      },

      // Software Engineering
      {
        name: "Software Requirements",
        code: "SE101",
        description: "Requirements analysis and documentation",
        credits: 5,
        major: software._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Software Testing",
        code: "SE102",
        description: "Testing methods and quality assurance",
        credits: 5,
        major: software._id,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM2"
      }
    ]);

    // 4. STUDENTS CONNECTED TO FACULTY AND MAJOR
    await UniStudents.insertMany([
      {
        universityId: "20260001",
        universityEmail: "rawan.cheaito@university.com",
        name: "Rawan Cheaito",
        faculty: computerScience._id,
        major: software._id,
        academicYear: 1,
        calendarYear: 2026,
        role: "STUDENT",
        status: "ACTIVE"
      },
      {
        universityId: "20260002",
        universityEmail: "ali.hassan@university.com",
        name: "Ali Hassan",
        faculty: engineering._id,
        major: civil._id,
        academicYear: 1,
        calendarYear: 2026,
        role: "STUDENT",
        status: "ACTIVE"
      },
      {
        universityId: "20260003",
        universityEmail: "sara.ahmad@university.com",
        name: "Sara Ahmad",
        faculty: business._id,
        major: businessAdmin._id,
        academicYear: 2,
        calendarYear: 2026,
        role: "STUDENT",
        status: "ACTIVE"
      },
      {
        universityId: "20260004",
        universityEmail: "mohammad.khaled@university.com",
        name: "Mohammad Khaled",
        faculty: computerScience._id,
        major: cs._id,
        academicYear: 1,
        calendarYear: 2026,
        role: "MODERATOR",
        status: "ACTIVE"
      },
      {
        universityId: "20260005",
        universityEmail: "nour.fares@university.com",
        name: "Nour Fares",
        faculty: engineering._id,
        major: mechanical._id,
        academicYear: 3,
        calendarYear: 2026,
        role: "STUDENT",
        status: "ACTIVE"
      },
      {
        universityId: "20260006",
        universityEmail: "maya.saad@university.com",
        name: "Maya Saad",
        faculty: business._id,
        major: accounting._id,
        academicYear: 2,
        calendarYear: 2026,
        role: "STUDENT",
        status: "ACTIVE"
      }
    ]);

    console.log("Seed completed successfully");
    process.exit();

  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedUniversity();