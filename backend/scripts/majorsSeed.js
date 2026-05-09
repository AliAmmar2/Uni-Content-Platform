require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const Major = require("../src/models/Major");

console.log("Mongo URI:", process.env.MONGO_URI);

async function seedMajors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DB:", mongoose.connection.name);

        // Clear majors
        await Major.deleteMany({});
        console.log("Cleared Major collection");

        // Faculties IDs you provided
        const SCIENCE_FACULTY_ID = "69feeef748256634c3cd44ae";
        const ENGINEERING_FACULTY_ID = "69feeef748256634c3cd44b1";

        const majors = [
            // Science Faculty
            {
                name: "Computer Science",
                code: "CS",
                faculty: SCIENCE_FACULTY_ID,
                description: "Study of computation, algorithms, and software systems"
            },
            {
                name: "Mathematics",
                code: "MATH",
                faculty: SCIENCE_FACULTY_ID,
                description: "Pure and applied mathematical sciences"
            },
            {
                name: "Physics",
                code: "PHYS",
                faculty: SCIENCE_FACULTY_ID,
                description: "Study of matter, energy, and physical laws"
            },

            // Engineering Faculty
            {
                name: "Software Engineering",
                code: "SWE",
                faculty: ENGINEERING_FACULTY_ID,
                description: "Engineering principles applied to software systems"
            },
            {
                name: "Electrical Engineering",
                code: "EE",
                faculty: ENGINEERING_FACULTY_ID,
                description: "Study of electrical systems and electronics"
            },
            {
                name: "Mechanical Engineering",
                code: "ME",
                faculty: ENGINEERING_FACULTY_ID,
                description: "Design and manufacturing of mechanical systems"
            }
        ];

        await Major.create(majors);

        console.log("✓ Seeded", majors.length, "majors");

        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    }
}

seedMajors();