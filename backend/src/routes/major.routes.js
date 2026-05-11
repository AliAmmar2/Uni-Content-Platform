const express = require("express");
const router = express.Router();

const majorController = require("../controllers/major.controller");
const anyAuth = require("../middleware/any-auth.middleware");
const adminAuth = require("../middleware/admin-auth.middleware");

//only admin can access this
router.post("/", adminAuth, majorController.createMajor);
router.get("/", adminAuth, majorController.getAllMajors);
router.put("/:id", adminAuth, majorController.updateMajor);
router.delete("/:id", adminAuth, majorController.deleteMajor);
router.get("/faculty/:facultyId", adminAuth, majorController.getMajorsByFaculty);
//any auth can access this
router.get("/:id", anyAuth, majorController.getMajorById);


module.exports = router;