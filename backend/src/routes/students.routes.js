const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../middleware/admin-auth.middleware");
const studentController = require("../controllers/students.controller");
const {allowStudentOrAdminRole} = require("../middleware/allow-by-role-middleware-auth");
const adminController = require("../controllers/admin.controller");
const studentAuth = require("../middleware/student-auth.middleware");

router.put(
    "/me/password",
    studentAuth,
    studentController.changeOwnPassword
);

router.get("/me", studentAuth, studentController.getMe);

router.use(adminAuthMiddleware);

router.put(
    "/:id/password-by-super-admin",
    allowStudentOrAdminRole([], ["super_admin"]),
    studentController.updatePasswordBySuperAdmin
);
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;