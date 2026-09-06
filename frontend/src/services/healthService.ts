import { apiClient } from "./apiClient";
import { ApiResponse, HealthData } from "../types";

export const healthService = {
  checkHealth: async (): Promise<ApiResponse<HealthData>> => {
    const response = await apiClient.get<ApiResponse<HealthData>>("/health");
    return response.data;
  },
};
