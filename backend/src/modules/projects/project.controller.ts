import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service.js";
import { sendSuccess } from "../../utils/response.js";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        category_id,
        category_slug,
        is_published,
        is_featured,
        is_visible,
        search,
        public: publicParam,
      } = req.query;

      const projects = await this.projectService.getAllProjects({
        category_id: category_id as string,
        category_slug: category_slug as string,
        is_published: is_published !== undefined ? is_published === "true" : undefined,
        is_featured: is_featured !== undefined ? is_featured === "true" : undefined,
        is_visible: is_visible !== undefined ? is_visible === "true" : undefined,
        search: search as string,
        publicOnly: publicParam === "true",
      });

      sendSuccess(res, projects, "Projects retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // --- VS-14: ADVANCED PUBLIC SEARCH & FILTERS ---
  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        search,
        category,
        tag,
        location,
        year,
        featured,
        page = "1",
        limit = "12",
        sort,
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
      const offset = (pageNum - 1) * limitNum;

      const result = await this.projectService.searchProjects({
        search: search as string,
        category_slug: category as string,
        tag: tag as string,
        location: location as string,
        year: year as string,
        is_featured: featured === "true" ? true : undefined,
        limit: limitNum,
        offset,
        sort: sort as string,
        publicOnly: true,
      });

      sendSuccess(res, result, "Projects searched successfully");
    } catch (error) {
      next(error);
    }
  };

  // --- VS-14: FEATURED PROJECTS ---
  getFeatured = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const featured = await this.projectService.getFeaturedProjects();
      sendSuccess(res, featured, "Featured projects retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  updateFeaturedOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.projectService.updateFeaturedOrder(req.body.items, req.user?.id);
      sendSuccess(res, { success: true }, "Featured projects order updated");
    } catch (error) {
      next(error);
    }
  };

  // --- VS-14: RELATED PROJECTS ---
  getRelated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
      const related = await this.projectService.getRelatedProjects(req.params.id, limit);
      sendSuccess(res, related, "Related projects retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  setRelated = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.projectService.setRelatedProjects(
        req.params.id,
        req.body.related_project_ids,
        req.user?.id
      );
      sendSuccess(res, { success: true }, "Related projects updated successfully");
    } catch (error) {
      next(error);
    }
  };

  // --- VS-14: BEFORE/AFTER COMPARISONS ---
  getComparisons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicOnly = req.query.admin !== "true";
      const comparisons = await this.projectService.getComparisons(req.params.id, publicOnly);
      sendSuccess(res, comparisons, "Project comparisons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  createComparison = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const created = await this.projectService.createComparison(req.body, req.user?.id);
      sendSuccess(res, created, "Project comparison created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  updateComparison = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.projectService.updateComparison(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Project comparison updated successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteComparison = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.projectService.deleteComparison(req.params.id, req.user?.id);
      sendSuccess(res, { id: req.params.id }, "Project comparison deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectService.getProjectById(req.params.id);
      sendSuccess(res, project, "Project retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectService.getProjectBySlug(req.params.slug);
      sendSuccess(res, project, "Project story retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.projectService.createProject(req.body, req.user?.id);
      sendSuccess(res, created, "Project created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.projectService.updateProject(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Project updated successfully");
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
      const updated = await this.projectService.toggleStatus(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Project status updated");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.projectService.deleteProject(req.params.id, req.user?.id);
      sendSuccess(res, { id: req.params.id }, "Project deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  addPhotos = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.projectService.addPhotosToProject(
        req.params.id,
        req.body.photo_ids,
        req.user?.id
      );
      sendSuccess(res, null, "Photos added to project successfully");
    } catch (error) {
      next(error);
    }
  };

  removePhoto = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.projectService.removePhotoFromProject(
        req.params.id,
        req.params.photoId,
        req.user?.id
      );
      sendSuccess(res, null, "Photo removed from project");
    } catch (error) {
      next(error);
    }
  };

  reorderPhotos = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.projectService.reorderProjectPhotos(
        req.params.id,
        req.body.items,
        req.user?.id
      );
      sendSuccess(res, null, "Project photos reordered successfully");
    } catch (error) {
      next(error);
    }
  };
}
