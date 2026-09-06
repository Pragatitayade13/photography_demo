import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new DashboardController();

// Protected dashboard routes
router.use(authMiddleware);

router.get("/stats", controller.getStats);
router.get("/activity", controller.getActivity);
router.get("/summary", controller.getSummary);
router.get("/global-search", controller.globalSearch);

export default router;
