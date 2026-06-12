require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");

const Faculty = require("../src/models/Faculty");
const Major = require("../src/models/Major");
const UniStudent = require("../src/models/Student");

async function resetDatabase() {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB:", mongoose.connection.name);

    // Delete students
    await UniStudent.deleteMany({});
    console.log("✓ Students deleted");

    // Delete majors
    await Major.deleteMany({});
    console.log("✓ Majors deleted");

    // Delete faculties
    await Faculty.deleteMany({});
    console.log("✓ Faculties deleted");

    console.log("✓ Admins preserved");

    await mongoose.disconnect();

    console.log("✓ Database reset complete");

    process.exit(0);
}

resetDatabase().catch((err) => {
    console.error("Reset failed:", err);
    process.exit(1);
});