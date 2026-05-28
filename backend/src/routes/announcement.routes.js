const express = require("express");

const router = express.Router();

const auth =
  require("../middleware/auth.middleware");

const {
  requireRole
} = require("../middleware/role.middleware");

const controller =
  require("../controllers/announcement.controller");

router.get(
  "/image-upload-signature",
  auth,
  requireRole(["MODERATOR"]),
  controller.getImageUploadSignature
);

router.post(
  "/",
  auth,
  requireRole(["MODERATOR"]),
  controller.createAnnouncement
);

router.get(
  "/course/:courseId",
  auth,
  requireRole([
    "STUDENT",
    "MODERATOR"
  ]),
  controller.getCourseAnnouncements
);

router.put(
  "/:id",
  auth,
  requireRole(["MODERATOR"]),
  controller.updateAnnouncement
);

router.delete(
  "/:id",
  auth,
  requireRole(["MODERATOR"]),
  controller.deleteAnnouncement
);

module.exports = router;