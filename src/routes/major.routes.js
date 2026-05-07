const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/major.controller");

// Get all majors
router.get("/", auth, controller.getAllMajors);

// Get single major
router.get("/:id", auth, controller.getMajorById);

module.exports = router;