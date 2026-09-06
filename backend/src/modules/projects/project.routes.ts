import { Router } from "express";
import { ProjectController } from "./project.controller.js";
import {
  addPhotosSchema,
  createProjectSchema,
  projectStatusToggleSchema,
  reorderProjectPhotosSchema,
  updateProjectSchema,
  createComparisonSchema,
  updateComparisonSchema,
  setRelatedProjectsSchema,
  updateFeaturedOrderSchema,
} from "./project.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new ProjectController();

// Public Read & Search Endpoints
router.get("/", controller.getAll);
router.get("/public/search", controller.search);
router.get("/public/featured", controller.getFeatured);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id/related", controller.getRelated);
router.get("/:id/comparisons", controller.getComparisons);
router.get("/:id", controller.getById);

// Protected Admin Mutation Endpoints
router.post("/", authMiddleware, validate(createProjectSchema), controller.create);
router.put("/:id", authMiddleware, validate(updateProjectSchema), controller.update);
router.patch("/:id/status", authMiddleware, validate(projectStatusToggleSchema), controller.toggleStatus);
router.patch("/featured/reorder", authMiddleware, validate(updateFeaturedOrderSchema), controller.updateFeaturedOrder);
router.delete("/:id", authMiddleware, controller.delete);

// Related Projects Admin Sub-routes
router.put("/:id/related", authMiddleware, validate(setRelatedProjectsSchema), controller.setRelated);

// Comparisons Admin Sub-routes
router.post("/:id/comparisons", authMiddleware, validate(createComparisonSchema), controller.createComparison);
router.patch("/comparisons/:id", authMiddleware, validate(updateComparisonSchema), controller.updateComparison);
router.delete("/comparisons/:id", authMiddleware, controller.deleteComparison);

// Project Gallery Sub-routes
router.post("/:id/photos", authMiddleware, validate(addPhotosSchema), controller.addPhotos);
router.delete("/:id/photos/:photoId", authMiddleware, controller.removePhoto);
router.patch("/:id/photos/reorder", authMiddleware, validate(reorderProjectPhotosSchema), controller.reorderPhotos);

export default router;
