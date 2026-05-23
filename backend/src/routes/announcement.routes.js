const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const controller = require("../controllers/announcement.controller");


// Create announcement
router.post(
  "/",
  auth,
  requireRole(["MODERATOR"]),
  controller.createAnnouncement
);


// Get announcements for a course
router.get(
  "/course/:courseId",
  auth,
  requireRole(["STUDENT", "MODERATOR"]),
  controller.getCourseAnnouncements
);


// Update announcement (moderator only)
router.put(
  "/:id",
  auth,
  requireRole(["MODERATOR"]),
  controller.updateAnnouncement
);


// Delete announcement (moderator only)
router.delete(
  "/:id",
  auth,
  requireRole(["MODERATOR"]),
  controller.deleteAnnouncement
);

module.exports = router;