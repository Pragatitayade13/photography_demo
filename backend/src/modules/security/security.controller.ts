import { Request, Response, NextFunction } from "express";
import { SecurityService } from "./security.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { z } from "zod";

const metricSchema = z.object({
  metric_name: z.string().min(1).max(100),
  metric_value: z.number(),
  page_path: z.string().optional(),
  device_type: z.string().optional(),
  connection_type: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const securityLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  severity: z.enum(["INFO", "WARNING", "CRITICAL"]).optional(),
  event_type: z.string().optional(),
  search: z.string().optional(),
});

export class SecurityController {
  private service: SecurityService;

  constructor() {
    this.service = new SecurityService();
  }

  // Public: Ingest web vitals & performance metrics
  recordMetric = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = metricSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "VALIDATION_ERROR", "Invalid metric payload", 400);
      }
      const recorded = await this.service.recordMetric(parsed.data as any);
      return sendSuccess(res, recorded, "Metric recorded", 201);
    } catch (error) {
      next(error);
    }
  };

  // Admin: Get security event logs
  getSecurityLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = securityLogsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return sendError(res, "VALIDATION_ERROR", "Invalid query parameters", 400, parsed.error.format());
      }
      const logs = await this.service.getLogs(parsed.data as any);
      return sendSuccess(res, logs, "Security logs retrieved");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Get system health & telemetry
  getSystemHealth = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const health = await this.service.getSystemHealth();
      return sendSuccess(res, health, "System diagnostics retrieved");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Resolve a recorded system error
  resolveError = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const resolved = await this.service.resolveError(id);
      return sendSuccess(res, { id, resolved }, "System error marked as resolved");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Reset showroom demo data
  resetDemo = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.resetDemoData();
      return sendSuccess(res, result, "Demo state successfully reset");
    } catch (error) {
      next(error);
    }
  };
}
