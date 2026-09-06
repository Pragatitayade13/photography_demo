import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import {
  createCategorySchema,
  reorderCategoriesSchema,
  statusToggleSchema,
  updateCategorySchema,
} from "./category.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new CategoryController();

// Publicly readable endpoints
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Protected Admin Mutation Endpoints
router.post("/", authMiddleware, validate(createCategorySchema), controller.create);
router.put("/:id", authMiddleware, validate(updateCategorySchema), controller.update);
router.patch("/:id/status", authMiddleware, validate(statusToggleSchema), controller.toggleStatus);
router.patch("/reorder", authMiddleware, validate(reorderCategoriesSchema), controller.reorder);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
