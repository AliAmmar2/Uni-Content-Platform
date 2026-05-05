require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Course   = require("../src/models/Course");
const Major    = require("../src/models/Major");
const courses  = require("../data/courses.json");

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const majors   = await Major.find({});
    const majorMap = {};
    majors.forEach(m => { majorMap[m.code] = m._id; });
    console.log("Found majors:", Object.keys(majorMap));

    await Course.deleteMany({});
    console.log("🗑️  Cleared existing courses");

    const toInsert = courses.map(c => {
      const majorId = majorMap[c.majorCode];
      if (!majorId) throw new Error(`Major code "${c.majorCode}" not found in DB. Run your faculty/major seed first.`);
      const { majorCode, ...rest } = c;
      return { ...rest, major: majorId };
    });

    const inserted = await Course.insertMany(toInsert);
    console.log(`✅ Seeded ${inserted.length} courses`);

    // Print grouped summary
    const summary = {};
    inserted.forEach(c => {
      const key = `Year ${c.academicYear} | ${c.calendarYear} | ${c.semester}`;
      summary[key] = (summary[key] || 0) + 1;
    });
    console.table(summary);

  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

seedCourses();