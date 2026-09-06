import { Router } from "express";
import { SeoController } from "./seo.controller.js";
import {
  updateGlobalSeoSchema,
  updatePageSeoSchema,
  updateProjectSeoSchema,
} from "./seo.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new SeoController();

// Global SEO
router.get("/global", controller.getGlobalSeo);
router.patch("/global", authMiddleware, validate(updateGlobalSeoSchema), controller.updateGlobalSeo);

// Page SEO
router.get("/pages", controller.getAllPageSeo);
router.get("/pages/:pageKey", controller.getPageSeo);
router.patch("/pages/:pageKey", authMiddleware, validate(updatePageSeoSchema), controller.updatePageSeo);

// Project SEO
router.get("/projects/:projectId", controller.getProjectSeo);
router.patch("/projects/:projectId", authMiddleware, validate(updateProjectSeoSchema), controller.updateProjectSeo);

export default router;
