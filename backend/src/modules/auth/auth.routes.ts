import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { AuthController } from "./auth.controller.js";
import { loginSchema } from "./auth.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new AuthController();

// Rate limiting for login: 10 attempts per 15 minutes window
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many login attempts. Please try again later.",
    },
  },
});

router.post("/login", loginLimiter, validate(loginSchema), controller.login);
router.get("/me", authMiddleware, controller.getMe);
router.post("/logout", controller.logout);

export default router;
