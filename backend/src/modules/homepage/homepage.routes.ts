import { Router } from "express";
import { HomepageController } from "./homepage.controller.js";
import {
  reorderSectionsSchema,
  sectionVisibilitySchema,
  updateSectionSchema,
} from "./homepage.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new HomepageController();

// Public Read Endpoint
router.get("/", controller.getPublicHomepage);

// Protected Admin Mutation Endpoints
router.get("/sections", authMiddleware, controller.getAllSections);
router.get("/sections/:sectionKey", authMiddleware, controller.getSectionByKey);
router.put("/sections/:sectionKey", authMiddleware, validate(updateSectionSchema), controller.updateSection);
router.patch("/sections/:sectionKey/visibility", authMiddleware, validate(sectionVisibilitySchema), controller.toggleVisibility);
router.patch("/sections/reorder", authMiddleware, validate(reorderSectionsSchema), controller.reorderSections);
router.post("/reset", authMiddleware, controller.resetSections);

export default router;
