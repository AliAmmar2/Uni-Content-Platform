require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");

const Faculty = require("../src/models/Faculty");

console.log("Mongo URI:", process.env.MONGO_URI);

async function seedFaculties() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DB:", mongoose.connection.name);

        // Clear faculties
        await Faculty.deleteMany({});

        console.log("Cleared Faculty collection");

        // Faculties data
        const faculties = [
            {
                name: "Faculty of Sciences",
                code: "FS",
                description: "Faculty of Sciences and Research"
            },
            {
                name: "Faculty of Engineering",
                code: "FE",
                description: "Faculty of Engineering and Technology"
            },
            {
                name: "Faculty of Business",
                code: "FB",
                description: "Faculty of Business Administration"
            },
            {
                name: "Faculty of Arts",
                code: "FA",
                description: "Faculty of Arts and Humanities"
            },
            {
                name: "Faculty of Medicine",
                code: "FM",
                description: "Faculty of Medicine and Health Sciences"
            }
        ];

        await Faculty.create(faculties);

        console.log("✓ Seeded", faculties.length, "faculties");

        await mongoose.disconnect();

        process.exit(0);

    } catch (err) {

        console.error("Seed failed:", err);

        process.exit(1);
    }
}

seedFaculties();