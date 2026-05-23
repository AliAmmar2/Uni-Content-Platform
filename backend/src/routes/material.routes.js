const express = require("express");
const router = express.Router();

const anyAuth = require("../middleware/any-auth.middleware");

const {allowStudentOrAdminRole} = require("../middleware/allow-by-role-middleware-auth");

const controller = require("../controllers/material.controller");

router.get(
    "/upload-signature",
    anyAuth,
    controller.getUploadSignature
);

router.post(
    "/",
    anyAuth,
    controller.uploadMaterial
);

router.get(
    "/:id/access",
    anyAuth,
    controller.getMaterialAccessUrl
);

// View approved materials
router.get("/course/:courseId", anyAuth, controller.getApprovedMaterialsByCourse
);
router.get("/course/:courseId/pending", anyAuth,
    allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]),
    controller.getPendingMaterialsByCourseId
);

// Approve / Reject
router.put("/:id/review", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.reviewMaterial);

// Delete
router.delete("/:id", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.deleteMaterial);


module.exports = router;