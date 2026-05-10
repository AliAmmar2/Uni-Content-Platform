require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const Course = require("../src/models/Course");

console.log("Mongo URI:", process.env.MONGO_URI);

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB:", mongoose.connection.name);

    // Clear courses
    await Course.deleteMany({});
    console.log("Cleared Course collection");

    // =========================
    // Major IDs
    // =========================
    const CS_MAJOR_ID   = "69ff5d26fb56e69ee8c378ba";
    const EE_MAJOR_ID   = "69ff5d26fb56e69ee8c378be";
    const MATH_MAJOR_ID = "69ff5d26fb56e69ee8c378bb";

    const courses = [

      // =========================
      // Computer Science
      // =========================
      {
        name: "Introduction to Programming",
        code: "CS101",
        description: "Basics of programming using JavaScript",
        credits: 3,
        major: CS_MAJOR_ID,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Data Structures",
        code: "CS201",
        description: "Study of arrays, linked lists, stacks, and queues",
        credits: 4,
        major: CS_MAJOR_ID,
        academicYear: 2,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Database Systems",
        code: "CS301",
        description: "Relational databases and MongoDB",
        credits: 3,
        major: CS_MAJOR_ID,
        academicYear: 3,
        calendarYear: 2026,
        semester: "SEM2"
      },
      {
        name: "Operating Systems",
        code: "CS302",
        description: "Processes, threads, and memory management",
        credits: 4,
        major: CS_MAJOR_ID,
        academicYear: 3,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Calculus I",
        code: "MATH101",
        description: "Limits, derivatives, and integrals",
        credits: 3,
        major: CS_MAJOR_ID,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Linear Algebra",
        code: "MATH201",
        description: "Matrices and vector spaces",
        credits: 3,
        major: CS_MAJOR_ID,
        academicYear: 2,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Probability and Statistics",
        code: "MATH301",
        description: "Probability theory and statistical methods",
        credits: 4,
        major: CS_MAJOR_ID,
        academicYear: 3,
        calendarYear: 2026,
        semester: "SEM2"
      },
      // =========================
      // Electrical Engineering
      // =========================
      {
        name: "Circuit Analysis",
        code: "EE101",
        description: "Basic electrical circuit concepts",
        credits: 3,
        major: EE_MAJOR_ID,
        academicYear: 1,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Digital Logic Design",
        code: "EE201",
        description: "Logic gates and digital systems",
        credits: 4,
        major: EE_MAJOR_ID,
        academicYear: 2,
        calendarYear: 2026,
        semester: "SEM2"
      },
      {
        name: "Signals and Systems",
        code: "EE301",
        description: "Signal processing fundamentals",
        credits: 3,
        major: EE_MAJOR_ID,
        academicYear: 3,
        calendarYear: 2026,
        semester: "SEM1"
      },
      {
        name: "Power Systems",
        code: "EE401",
        description: "Generation and distribution of electric power",
        credits: 4,
        major: EE_MAJOR_ID,
        academicYear: 4,
        calendarYear: 2026,
        semester: "SEM2"
      },

      // =========================
      // Mathematics
      // =========================
      {
        name: "Numerical Methods",
        code: "MATH302",
        description: "Numerical solutions for mathematical problems",
        credits: 3,
        major: MATH_MAJOR_ID,
        academicYear: 3,
        calendarYear: 2026,
        semester: "SEM1"
      }
    ];

    await Course.create(courses);

    console.log("✓ Seeded", courses.length, "courses");

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seedCourses();