const express = require("express");

const router = express.Router();

const anyAuth = require("../middleware/any-auth.middleware");
const controller = require("../controllers/courseAnnouncement.controller");
const {allowStudentOrAdminRole} = require("../middleware/allow-by-role-middleware-auth");

router.get("/image-upload-signature", anyAuth, controller.getImageUploadSignature);

router.post("/", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.createAnnouncement);

router.get("/course/:courseId", anyAuth, controller.getCourseAnnouncements);

router.put("/:id", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.updateAnnouncement);

router.delete("/:id", anyAuth, allowStudentOrAdminRole(["MODERATOR"], ["admin", "super_admin"]), controller.deleteAnnouncement);
router.get(
    "/:id",
    anyAuth,
    controller.getAnnouncementById
);
module.exports = router;