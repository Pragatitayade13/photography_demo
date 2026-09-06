import { apiClient } from "../../../services/apiClient";
import { ApiResponse } from "../../../types";
import { ActivityLogItem, DashboardStats, DashboardSummary } from "../types/dashboard.types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats");
    return response.data.data!;
  },

  getActivity: async (limit = 8): Promise<ActivityLogItem[]> => {
    const response = await apiClient.get<ApiResponse<ActivityLogItem[]>>(`/dashboard/activity?limit=${limit}`);
    return response.data.data!;
  },

  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
    return response.data.data!;
  },
};
