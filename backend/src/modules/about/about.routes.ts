import { Router } from "express";
import { AboutController } from "./about.controller.js";
import {
  updateProfileSchema,
  updateSectionSchema,
  sectionVisibilitySchema,
  reorderSectionsSchema,
} from "./about.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new AboutController();

// Public Read Endpoint
router.get("/", controller.getPublicAbout);
router.get("/public", controller.getPublicAbout);

// Protected Admin Endpoints
router.get("/admin", authMiddleware, controller.getAdminAbout);
router.put("/profile", authMiddleware, validate(updateProfileSchema), controller.updateProfile);
router.put("/sections/:sectionKey", authMiddleware, validate(updateSectionSchema), controller.updateSection);
router.patch("/sections/:sectionKey/visibility", authMiddleware, validate(sectionVisibilitySchema), controller.toggleVisibility);
router.patch("/sections/reorder", authMiddleware, validate(reorderSectionsSchema), controller.reorderSections);
router.post("/reset", authMiddleware, controller.resetAbout);

export default router;
