const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/student-auth.middleware");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many registration attempts. Please try again later." }
});

router.post("/register", registerLimiter, controller.register);
router.post("/verify-email", controller.verifyEmail);
router.post("/login", loginLimiter, controller.login);
router.post("/forgot-password",controller.forgotPassword);
router.post( "/reset-password", controller.resetPassword);

module.exports = router;