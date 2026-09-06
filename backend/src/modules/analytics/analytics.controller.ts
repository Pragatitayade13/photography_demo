import { Request, Response, NextFunction } from "express";
import { AnalyticsRepository } from "./analytics.repository.js";
import { sendSuccess } from "../../utils/response.js";

const repository = new AnalyticsRepository();

export class AnalyticsController {
  // --- PUBLIC EVENT INGESTION ---
  async trackEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dntHeader = req.get("DNT") === "1" || req.get("Sec-GPC") === "1";
      const success = await repository.recordEvent(req.body, dntHeader);
      sendSuccess(res, { recorded: success }, "Event processed successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- ADMIN ANALYTICS ---
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const summary = await repository.getSummary(isNaN(days) ? 7 : days);
      sendSuccess(res, summary, "Analytics summary retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const events = await repository.getEvents(isNaN(limit) ? 50 : limit);
      sendSuccess(res, events, "Recent analytics events retrieved");
    } catch (err) {
      next(err);
    }
  }

  async getTopProjects(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const topProjects = await repository.getTopProjects();
      sendSuccess(res, topProjects, "Top projects analytics retrieved");
    } catch (err) {
      next(err);
    }
  }

  async getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await repository.getSettings();
      sendSuccess(res, settings, "Analytics settings retrieved");
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateSettings(req.body);
      sendSuccess(res, updated, "Analytics settings updated successfully");
    } catch (err) {
      next(err);
    }
  }
}
