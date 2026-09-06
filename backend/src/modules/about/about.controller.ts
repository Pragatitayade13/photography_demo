import { Request, Response, NextFunction } from "express";
import { AboutRepository } from "./about.repository.js";
import { sendSuccess, sendError } from "../../utils/response.js";

const repository = new AboutRepository();

export class AboutController {
  async getPublicAbout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await repository.getPublicAbout();
      sendSuccess(res, data, "Public about data retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async getAdminAbout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await repository.getAdminAbout();
      sendSuccess(res, data, "Admin about settings retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateProfile(req.body);
      sendSuccess(res, updated, "Photographer profile updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sectionKey } = req.params;
      const { configuration, title, is_visible } = req.body;
      const updated = await repository.updateSection(sectionKey, configuration, title, is_visible);
      sendSuccess(res, updated, `About section '${sectionKey}' updated successfully`);
    } catch (err) {
      next(err);
    }
  }

  async toggleVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sectionKey } = req.params;
      const { is_visible } = req.body;
      const updated = await repository.toggleVisibility(sectionKey, is_visible);
      sendSuccess(res, updated, `Section visibility updated to ${is_visible}`);
    } catch (err) {
      next(err);
    }
  }

  async reorderSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ordered_keys } = req.body;
      const sections = await repository.reorderSections(ordered_keys);
      sendSuccess(res, sections, "Sections reordered successfully");
    } catch (err) {
      next(err);
    }
  }

  async resetAbout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await repository.resetToDefault();
      const freshData = await repository.getAdminAbout();
      sendSuccess(res, freshData, "About page reset to default configuration");
    } catch (err) {
      next(err);
    }
  }
}
