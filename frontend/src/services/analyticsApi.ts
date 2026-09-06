import { apiClient } from "./apiClient";
import { AnalyticsSettings, AnalyticsEvent, AnalyticsSummary, TopProjectMetric } from "../types/analytics";

export const analyticsApi = {
  // Public
  trackEvent: async (
    event_name: AnalyticsEvent["event_name"],
    page_path: string,
    project_id?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    try {
      let sessionHash = localStorage.getItem("alex_studio_sess");
      if (!sessionHash) {
        sessionHash = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("alex_studio_sess", sessionHash);
      }

      const res = await apiClient.post<{ success: boolean; data: { recorded: boolean } }>(
        "/public/analytics/events",
        {
          event_name,
          page_path,
          project_id,
          session_hash: sessionHash,
          metadata: metadata || {},
        }
      );
      return res.data.data.recorded;
    } catch {
      return false;
    }
  },

  // Admin
  getSummary: async (days = 7): Promise<AnalyticsSummary> => {
    const res = await apiClient.get<{ success: boolean; data: AnalyticsSummary }>(
      `/analytics/summary?days=${days}`
    );
    return res.data.data;
  },

  getEvents: async (limit = 50): Promise<AnalyticsEvent[]> => {
    const res = await apiClient.get<{ success: boolean; data: AnalyticsEvent[] }>(
      `/analytics/events-list?limit=${limit}`
    );
    return res.data.data;
  },

  getTopProjects: async (): Promise<TopProjectMetric[]> => {
    const res = await apiClient.get<{ success: boolean; data: TopProjectMetric[] }>(
      "/analytics/top-projects"
    );
    return res.data.data;
  },

  getSettings: async (): Promise<AnalyticsSettings> => {
    const res = await apiClient.get<{ success: boolean; data: AnalyticsSettings }>(
      "/analytics/settings"
    );
    return res.data.data;
  },

  updateSettings: async (payload: Partial<AnalyticsSettings>): Promise<AnalyticsSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: AnalyticsSettings }>(
      "/analytics/settings",
      payload
    );
    return res.data.data;
  },
};
