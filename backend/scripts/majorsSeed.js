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

        const SCIENCE_FACULTY_ID = "69feeef748256634c3cd44ae";
        const ENGINEERING_FACULTY_ID = "69feeef748256634c3cd44b1";

        const majors = [

            // SCIENCE
            {
                name: "Computer Science",
                code: "CS",
                faculty: SCIENCE_FACULTY_ID,
                description: "Study of computation, algorithms, and software systems",
                totalCredits: 180,
                duration: "3 Years"
            },
            {
                name: "Mathematics",
                code: "MATH",
                faculty: SCIENCE_FACULTY_ID,
                description: "Pure and applied mathematical sciences",
                totalCredits: 180,
                duration: "3 Years"
            },
            {
                name: "Physics",
                code: "PHYS",
                faculty: SCIENCE_FACULTY_ID,
                description: "Study of matter, energy, and physical laws",
                totalCredits: 180,
                duration: "3 Years"
            },

            // ENGINEERING
            {
                name: "Software Engineering",
                code: "SWE",
                faculty: ENGINEERING_FACULTY_ID,
                description: "Engineering principles applied to software systems",
                totalCredits: 180,
                duration: "3 Years"
            },
            {
                name: "Electrical Engineering",
                code: "EE",
                faculty: ENGINEERING_FACULTY_ID,
                description: "Study of electrical systems and electronics",
                totalCredits: 180,
                duration: "4 Years"
            },
            {
                name: "Mechanical Engineering",
                code: "ME",
                faculty: ENGINEERING_FACULTY_ID,
                description: "Design and manufacturing of mechanical systems",
                totalCredits: 180,
                duration: "4 Years"
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