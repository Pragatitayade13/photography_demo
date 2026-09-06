import { apiClient } from "../../../../services/apiClient";
import {
  SecurityLogsResponse,
  SecurityLogsFilter,
  SystemHealthSummary,
} from "../types/security.types";

export const securityService = {
  async getSecurityLogs(params?: SecurityLogsFilter): Promise<SecurityLogsResponse> {
    const res = await apiClient.get<SecurityLogsResponse>("/admin/security/logs", { params });
    return res.data;
  },

  async getSystemHealth(): Promise<SystemHealthSummary> {
    const res = await apiClient.get<SystemHealthSummary>("/admin/system/health");
    return res.data;
  },

  async resolveError(id: string): Promise<{ id: string; resolved: boolean }> {
    const res = await apiClient.patch<{ id: string; resolved: boolean }>(
      `/admin/system/errors/${id}/resolve`
    );
    return res.data;
  },

  async recordMetric(metric: {
    metric_name: string;
    metric_value: number;
    page_path?: string;
    device_type?: string;
    connection_type?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await apiClient.post("/public/metrics", metric);
    } catch {
      // Non-blocking telemetry
    }
  },
};
