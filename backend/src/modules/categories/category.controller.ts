import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service.js";
import { sendSuccess } from "../../utils/response.js";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const publicOnly = req.query.public === "true";

      const categories = await this.categoryService.getAllCategories({
        search,
        status,
        publicOnly,
      });

      sendSuccess(res, categories, "Categories retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      sendSuccess(res, category, "Category retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.categoryService.createCategory(req.body, req.user?.id);
      sendSuccess(res, created, "Category created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.categoryService.updateCategory(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Category updated successfully");
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.categoryService.toggleStatus(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Category status updated");
    } catch (error) {
      next(error);
    }
  };

  reorder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoryService.reorderCategories(req.body.items, req.user?.id);
      sendSuccess(res, null, "Categories reordered successfully");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoryService.deleteCategory(req.params.id, req.user?.id);
      sendSuccess(res, null, "Category deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
