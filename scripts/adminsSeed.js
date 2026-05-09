require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// adjust path if needed
const Admin = require("../src/models/Admin");

console.log("Mongo URI:", process.env.MONGO_URI);

async function seedAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB:", mongoose.connection.name);

        // Clear admins
        await Admin.deleteMany({});
        console.log("Cleared Admin collection");

        // Hash password
        const passwordHash = await bcrypt.hash("Admin123456", 10);

        // Create admins
        const admins = [
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
                fullName: "First Admin",
                role: "admin",
                passwordHash
            },
            {
                username: "admin2",
                email: "admin2@university.com",
                fullName: "Second Admin",
                role: "admin",
                passwordHash
            }
        ];

        await Admin.create(admins);

        console.log("✓ Seeded", admins.length, "admins");
        console.log("Password for all admins: Admin123456");

        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    }
}

seedAdmins();