import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";
import { sendSuccess } from "../../utils/response.js";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.dashboardService.getStats();
      sendSuccess(res, stats, "Dashboard statistics retrieved");
    } catch (error) {
      next(error);
    }
  };

  getActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const activity = await this.dashboardService.getRecentActivity(limit);
      sendSuccess(res, activity, "Recent activity logs retrieved");
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.dashboardService.getSummary();
      sendSuccess(res, summary, "Dashboard overview summary retrieved");
    } catch (error) {
      next(error);
    }
  };

  globalSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = (req.query.q as string) || "";
      const results = await this.dashboardService.globalSearch(q);
      sendSuccess(res, results, "Global search results retrieved");
    } catch (error) {
      next(error);
    }
  };
}
