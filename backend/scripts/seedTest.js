require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");

// adjust paths to match your structure
const UniStudent = require("../src/models/UniStudents");
const Faculty    = require("../src/models/Faculty");
const Major      = require("../src/models/Major");

console.log("Mongo URI:", process.env.MONGO_URI);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB:", mongoose.connection.name);

  await UniStudent.deleteMany({});
  await Faculty.deleteMany({});
  await Major.deleteMany({});
  console.log("Cleared collections");

  // Create faculties
  const [engineering, science, business, arts] = await Faculty.create([
    { name: "Engineering",  code: "ENG" },
    { name: "Science",      code: "SCI" },
    { name: "Business",     code: "BUS" },
    { name: "Arts",         code: "ART" },
  ]);

  // Create majors
  const majors = await Major.create([
    { name: "Computer Engineering",    code: "CE",  faculty: engineering._id },
    { name: "Computer Science",        code: "CS",  faculty: engineering._id },
    { name: "Electrical Engineering",  code: "EE",  faculty: engineering._id },
    { name: "Mechanical Engineering",  code: "ME",  faculty: engineering._id },
    { name: "Mathematics",             code: "MTH", faculty: science._id },
    { name: "Physics",                 code: "PHY", faculty: science._id },
    { name: "Chemistry",               code: "CHM", faculty: science._id },
    { name: "Finance",                 code: "FIN", faculty: business._id },
    { name: "Marketing",               code: "MKT", faculty: business._id },
    { name: "Graphic Design",          code: "GD",  faculty: arts._id },
  ]);

  // Map for easy lookup
  const majorMap = Object.fromEntries(majors.map(m => [m.code, m]));
  const facMap   = { Engineering: engineering, Science: science, Business: business, Arts: arts };

  const passwordHash = await bcrypt.hash("Test123456", 10);

  const students = [
    { universityId: "210001", universityEmail: "rana.haddad@ul.edu.lb",    name: "Rana Haddad",   faculty: facMap.Engineering._id, major: majorMap.CE._id,  academicYear: 3, calendarYear: 2024, roles: ["STUDENT"],              status: "ACTIVE" },
    { universityId: "210002", universityEmail: "karim.nasser@ul.edu.lb",   name: "Karim Nasser",  faculty: facMap.Engineering._id, major: majorMap.CS._id,  academicYear: 4, calendarYear: 2024, roles: ["STUDENT", "MODERATOR"], status: "ACTIVE" },
    { universityId: "210003", universityEmail: "maya.khoury@ul.edu.lb",    name: "Maya Khoury",   faculty: facMap.Science._id,     major: majorMap.MTH._id, academicYear: 2, calendarYear: 2024, roles: ["ADMIN"],                status: "ACTIVE" },
    { universityId: "210004", universityEmail: "jad.mansour@ul.edu.lb",    name: "Jad Mansour",   faculty: facMap.Science._id,     major: majorMap.PHY._id, academicYear: 1, calendarYear: 2024, roles: ["STUDENT"],              status: "SUSPENDED" },
    { universityId: "210005", universityEmail: "lina.abbas@ul.edu.lb",     name: "Lina Abbas",    faculty: facMap.Business._id,    major: majorMap.FIN._id, academicYear: 3, calendarYear: 2024, roles: ["STUDENT"],              status: "ACTIVE" },
    { universityId: "210006", universityEmail: "hassan.darwish@ul.edu.lb", name: "Hassan Darwish",faculty: facMap.Business._id,    major: majorMap.MKT._id, academicYear: 2, calendarYear: 2024, roles: ["STUDENT"],              status: "ACTIVE" },
    { universityId: "210007", universityEmail: "nour.saleh@ul.edu.lb",     name: "Nour Saleh",    faculty: facMap.Arts._id,        major: majorMap.GD._id,  academicYear: 4, calendarYear: 2024, roles: ["STUDENT", "MODERATOR"], status: "ACTIVE" },
    { universityId: "210008", universityEmail: "omar.hassan@ul.edu.lb",    name: "Omar Hassan",   faculty: facMap.Engineering._id, major: majorMap.EE._id,  academicYear: 5, calendarYear: 2024, roles: ["STUDENT"],              status: "ACTIVE" },
    { universityId: "210009", universityEmail: "sara.touma@ul.edu.lb",     name: "Sara Touma",    faculty: facMap.Science._id,     major: majorMap.CHM._id, academicYear: 1, calendarYear: 2024, roles: ["STUDENT"],              status: "ACTIVE" },
    { universityId: "210010", universityEmail: "ali.farhat@ul.edu.lb",     name: "Ali Farhat",    faculty: facMap.Engineering._id, major: majorMap.ME._id,  academicYear: 2, calendarYear: 2024, roles: ["STUDENT"],              status: "SUSPENDED" },
  ];

  await UniStudent.create(students.map(s => ({ ...s, passwordHash })));

  console.log("✓ Seeded", students.length, "students");
  console.log("Password for all users: Test123456");
  
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});