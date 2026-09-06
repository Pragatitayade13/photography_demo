import { checkDatabaseHealth } from "../../database/db.js";

export class HealthService {
  async getHealthStatus() {
    const isDbConnected = await checkDatabaseHealth();
    return {
      status: "healthy",
      database: isDbConnected ? "connected" : "disconnected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
