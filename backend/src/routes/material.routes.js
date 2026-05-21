const express = require("express");
const router = express.Router();

const auth = require("../middleware/student-auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const controller = require("../controllers/material.controller");


router.get(
  "/pending",
  auth,
  requireRole(["MODERATOR"]),
  controller.getPendingMaterials
);

router.get(
  "/upload-signature",
  auth,
  requireRole(["STUDENT", "MODERATOR"]),
  controller.getUploadSignature
);

router.post(
  "/",
  auth,
  requireRole(["STUDENT", "MODERATOR"]),
  controller.uploadMaterial
);

router.get(
  "/:id/access",
  auth,
  requireRole(["STUDENT", "MODERATOR"]),
  controller.getMaterialAccessUrl
);

router.get(
  "/course/:courseId",
  auth,
  requireRole(["STUDENT", "MODERATOR"]),
  controller.getApprovedMaterialsByCourse
);

router.put(
  "/:id/review",
  auth,
  requireRole(["MODERATOR"]),
  controller.reviewMaterial
);

router.delete(
  "/:id",
  auth,
  requireRole(["MODERATOR"]),
  controller.deleteMaterial
);

module.exports = router;