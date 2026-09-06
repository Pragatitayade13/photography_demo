import { Request, Response } from "express";
import { HealthService } from "./health.service.js";
import { sendSuccess } from "../../utils/response.js";

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  getHealth = async (_req: Request, res: Response): Promise<Response> => {
    const healthData = await this.healthService.getHealthStatus();
    return sendSuccess(res, healthData, "Photography Platform API is running");
  };
}
