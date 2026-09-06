import { Request, Response, NextFunction } from "express";
import { SettingsRepository } from "./settings.repository.js";
import { sendSuccess, sendError } from "../../utils/response.js";

const repository = new SettingsRepository();

export class SettingsController {
  // --- PUBLIC ENDPOINTS ---
  async getPublicSiteConfig(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await repository.getPublicSiteConfig();
      sendSuccess(res, config, "Public site configuration retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- ADMIN SETTINGS ---
  async getAllSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await repository.getAllAdminSettings();
      sendSuccess(res, data, "All admin settings retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateGeneralSettings(req.body);
      sendSuccess(res, updated, "General site settings updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateBrandingSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateBrandingSettings(req.body);
      sendSuccess(res, updated, "Branding assets & visual identity updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateContactSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateContactSettings(req.body);
      sendSuccess(res, updated, "Studio contact parameters updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateAdvancedSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateAdvancedSettings(req.body);
      sendSuccess(res, updated, "Advanced settings updated successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- NAVIGATION ---
  async getNavigationItems(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await repository.getNavigationItems();
      sendSuccess(res, items, "Navigation items retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async createNavigationItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = await repository.createNavigationItem(req.body);
      sendSuccess(res, newItem, "Navigation menu item created successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  async updateNavigationItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await repository.updateNavigationItem(id, req.body);
      if (!updated) {
        sendError(res, "NOT_FOUND", "Navigation item not found", 404);
        return;
      }
      sendSuccess(res, updated, "Navigation item updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async deleteNavigationItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await repository.deleteNavigationItem(id);
      if (!deleted) {
        sendError(res, "NOT_FOUND", "Navigation item not found", 404);
        return;
      }
      sendSuccess(res, { id, deleted: true }, "Navigation item deleted successfully");
    } catch (err) {
      next(err);
    }
  }

  async reorderNavigation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items } = req.body;
      const reordered = await repository.reorderNavigation(items);
      sendSuccess(res, reordered, "Navigation reordered successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- SOCIAL LINKS ---
  async getSocialLinks(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const links = await repository.getSocialLinks();
      sendSuccess(res, links, "Social links retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async createSocialLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newLink = await repository.createSocialLink(req.body);
      sendSuccess(res, newLink, "Social link created successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  async updateSocialLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await repository.updateSocialLink(id, req.body);
      if (!updated) {
        sendError(res, "NOT_FOUND", "Social link not found", 404);
        return;
      }
      sendSuccess(res, updated, "Social link updated successfully");
    } catch (err) {
      next(err);
    }
  }

  async deleteSocialLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await repository.deleteSocialLink(id);
      if (!deleted) {
        sendError(res, "NOT_FOUND", "Social link not found", 404);
        return;
      }
      sendSuccess(res, { id, deleted: true }, "Social link deleted successfully");
    } catch (err) {
      next(err);
    }
  }

  async reorderSocialLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items } = req.body;
      const reordered = await repository.reorderSocialLinks(items);
      sendSuccess(res, reordered, "Social links reordered successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- FOOTER ---
  async getFooterSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const footer = await repository.getFooterSettings();
      sendSuccess(res, footer, "Footer settings retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateFooterSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateFooterSettings(req.body);
      sendSuccess(res, updated, "Footer settings updated successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- SEO ---
  async getSeoSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const seo = await repository.getSeoSettings();
      sendSuccess(res, seo, "SEO settings retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateSeoSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateSeoSettings(req.body);
      sendSuccess(res, updated, "SEO settings updated successfully");
    } catch (err) {
      next(err);
    }
  }
}
