const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `${req.body.universityId || 'unknown'}_${req.ip}`;
  }
});

const magicLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 magic links per hour
  message: {
    message: "Too many magic link requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `${req.body.universityEmail || 'unknown'}_${req.ip}`;
  }
});

router.post("/login", loginLimiter, controller.login);
router.post("/magic-link", magicLinkLimiter, controller.requestMagicLink);
router.post("/magic-link/verify", controller.verifyMagicLink);
router.post("/refresh", controller.refreshToken);
router.get("/me", authMiddleware, controller.me);

module.exports = router;