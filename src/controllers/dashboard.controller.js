const Student = require("../models/Users");
const Course = require("../models/Course");

exports.getDashboard = async (req, res) => {
  try {
    // req.user comes from your auth middleware (the JWT payload)
    const studentId = req.user.id;

    // 1. Fetch the student with faculty and major populated
    const student = await Student.findById(studentId)
      .populate("faculty", "name code")
      .populate("major", "name code")
      .select("-passwordHash -loginAttempts -lockUntil");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.major) {
  return res.status(400).json({ message: "Student has no major assigned" });
}

    // 2. Determine which calendarYear to show
    //    Default: their current calendarYear
    //    Optional: frontend can pass ?calendarYear=2024 to filter
const requestedCalendarYear = Number.isInteger(parseInt(req.query.calendarYear))
  ? parseInt(req.query.calendarYear)
  : student.calendarYear;

    // 3. Fetch courses matching their major + academic year + requested calendar year
    const courses = await Course.find({
      major: student.major._id,
      academicYear: student.academicYear,
      calendarYear: requestedCalendarYear
    }).select("name code credits semester description");

    // 4. Fetch all available calendar years for their major + academic year
    //    So the frontend knows what years to show in the filter dropdown
    const availableCalendarYears = await Course.distinct("calendarYear", {
      major: student.major._id,
      academicYear: student.academicYear
    });

    res.json({
      student: {
        name: student.name,
        universityId: student.universityId,
        academicYear: student.academicYear,
        calendarYear: student.calendarYear,
        faculty: student.faculty,
        major: student.major,
        roles: student.roles
      },
      courses: {
        displayedCalendarYear: requestedCalendarYear,
        availableCalendarYears: availableCalendarYears.sort((a, b) => a - b),
        list: courses
      }
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};