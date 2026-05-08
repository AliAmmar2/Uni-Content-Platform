const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../middleware/admin-auth.middleware");
const studentController = require("../controllers/students.controller");

router.use(adminAuthMiddleware);

// CRUD
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;