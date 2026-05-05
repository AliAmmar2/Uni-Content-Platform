// After fetching student
if (!student) {
  return res.status(404).json({ message: "Student not found" });
}

if (!student.major) {
  return res.status(400).json({ message: "Student has no major assigned" });
}

// Safe calendar year parsing
const requestedCalendarYear = Number.isInteger(parseInt(req.query.calendarYear))
  ? parseInt(req.query.calendarYear)
  : student.calendarYear;

// Fetch courses
const courses = await Course.find({
  major: student.major._id,
  academicYear: student.academicYear,
  calendarYear: requestedCalendarYear
}).select("name code credits semester description");

// Fetch distinct years
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