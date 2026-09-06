import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";
import {
  trackPublicEventSchema,
  updateAnalyticsSettingsSchema,
} from "./analytics.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new AnalyticsController();

// Public event intake
router.post("/public/events", validate(trackPublicEventSchema), controller.trackEvent);
router.post("/events", validate(trackPublicEventSchema), controller.trackEvent);

// Admin analytics endpoints
router.get("/summary", authMiddleware, controller.getSummary);
router.get("/events-list", authMiddleware, controller.getEvents);
router.get("/top-projects", authMiddleware, controller.getTopProjects);
router.get("/settings", authMiddleware, controller.getSettings);
router.patch("/settings", authMiddleware, validate(updateAnalyticsSettingsSchema), controller.updateSettings);

export default router;
