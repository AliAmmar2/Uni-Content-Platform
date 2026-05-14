const mongoose = require("mongoose");
const OfficialStudent = require("../src/models/OfficialStudent");

const data = require("../data/officialStudents");

const seed = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/UniContentPlatform");

    await OfficialStudent.deleteMany();

    await OfficialStudent.insertMany(data);

    console.log("Official students seeded successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();