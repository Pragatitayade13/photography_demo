import { Request, Response, NextFunction } from "express";
import { HomepageService } from "./homepage.service.js";
import { sendSuccess } from "../../utils/response.js";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";

export class HomepageController {
  private homepageService: HomepageService;

  constructor() {
    this.homepageService = new HomepageService();
  }

  getPublicHomepage = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = await this.homepageService.getPublicHomepage();
      sendSuccess(res, payload, "Homepage data retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getAllSections = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sections = await this.homepageService.getAllSections();
      sendSuccess(res, sections, "Homepage sections retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getSectionByKey = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const section = await this.homepageService.getSectionByKey(req.params.sectionKey);
      sendSuccess(res, section, "Homepage section retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  updateSection = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.homepageService.updateSection(
        req.params.sectionKey,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Homepage section updated successfully");
    } catch (error) {
      next(error);
    }
  };

  toggleVisibility = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.homepageService.toggleVisibility(
        req.params.sectionKey,
        req.body.is_visible,
        req.user?.id
      );
      sendSuccess(res, updated, "Section visibility updated");
    } catch (error) {
      next(error);
    }
  };

  reorderSections = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.homepageService.reorderSections(req.body.items, req.user?.id);
      sendSuccess(res, null, "Homepage sections reordered successfully");
    } catch (error) {
      next(error);
    }
  };

  resetSections = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sections = await this.homepageService.resetSections(req.user?.id);
      sendSuccess(res, sections, "Homepage sections reset to default");
    } catch (error) {
      next(error);
    }
  };
}
