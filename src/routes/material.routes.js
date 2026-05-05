const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const controller = require("../controllers/material.controller");

// Upload
router.post("/upload", auth, requireRole(["STUDENT", "MODERATOR"]), controller.uploadMaterial);

// Student view approved
router.get("/course/:courseId", auth, requireRole(["STUDENT"]), controller.getApprovedMaterialsByCourse);

// Approve / Reject
router.put("/:id/approve", auth, requireRole(["MODERATOR"]), controller.reviewMaterial);

// Delete
router.delete("/:id", auth, requireRole(["MODERATOR"]), controller.deleteMaterial);

module.exports = router;