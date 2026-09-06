import { Router } from "express";
import { notificationController } from "./notifications.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// All notification management routes are protected by authMiddleware
router.use(authMiddleware);

// Stats
router.get("/stats", (req, res) => notificationController.getStats(req, res));

// Settings
router.get("/settings", (req, res) => notificationController.getSettings(req, res));
router.put("/settings", (req, res) => notificationController.updateSettings(req, res));

// Templates
router.get("/templates", (req, res) => notificationController.getTemplates(req, res));
router.get("/templates/:templateKey", (req, res) => notificationController.getTemplateByKey(req, res));
router.put("/templates/:templateKey", (req, res) => notificationController.updateTemplate(req, res));
router.post("/templates/preview", (req, res) => notificationController.previewTemplate(req, res));

// Delivery Logs
router.get("/logs", (req, res) => notificationController.getLogs(req, res));
router.post("/logs/:id/retry", (req, res) => notificationController.retryLog(req, res));

// In-App Notifications
router.get("/in-app", (req, res) => notificationController.getInAppNotifications(req, res));
router.post("/in-app/read", (req, res) => notificationController.markInAppRead(req, res));
router.delete("/in-app/read", (req, res) => notificationController.clearReadInApp(req, res));

// Diagnostic Test Email
router.post("/test-email", (req, res) => notificationController.sendTestEmail(req, res));

export default router;
