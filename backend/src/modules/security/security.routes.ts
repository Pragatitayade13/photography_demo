import { Router } from "express";
import { SecurityController } from "./security.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new SecurityController();

// Public telemetry ingestion
router.post("/public/metrics", controller.recordMetric);

// Protected Admin diagnostics & audit
router.get("/admin/security/logs", authenticate, controller.getSecurityLogs);
router.get("/admin/system/health", authenticate, controller.getSystemHealth);
router.patch("/admin/system/errors/:id/resolve", authenticate, controller.resolveError);
router.post("/admin/system/demo-reset", authenticate, controller.resetDemo);

export default router;
