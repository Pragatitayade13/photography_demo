import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardSummary } from "../types/dashboard.types";

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    stats: summary?.stats,
    recentActivity: summary?.recentActivity || [],
    systemStatus: summary?.systemStatus,
    isLoading,
    error,
    refresh: fetchSummary,
  };
};
