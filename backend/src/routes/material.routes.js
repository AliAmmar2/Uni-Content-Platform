const express = require("express");
const router = express.Router();

const anyAuth = require("../middleware/any-auth.middleware");
const upload = require("../middleware/upload.middleware");

const {allowStudentOrAdminRole} = require("../middleware/allow-by-role-middleware-auth");

const controller = require("../controllers/material.controller");

// Upload
router.post("/upload", anyAuth, upload.single("file"), controller.uploadMaterial
);

// View approved materials
router.get("/course/:courseId", anyAuth, controller.getApprovedMaterialsByCourse
);
router.get("/course/:courseId/pending", anyAuth,
    allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]),
    controller.getPendingMaterialsByCourse
);

// Approve / Reject
router.put("/:id/approve", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.reviewMaterial);

// Delete
router.delete("/:id", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.deleteMaterial);


module.exports = router;