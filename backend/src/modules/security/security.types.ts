export type SecuritySeverity = "INFO" | "WARNING" | "CRITICAL";
export type SystemErrorSeverity = "WARNING" | "ERROR" | "FATAL";

export interface SecurityLog {
  id: string;
  event_type: string;
  severity: SecuritySeverity;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  request_path: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface SystemErrorLog {
  id: string;
  error_code: string | null;
  message: string;
  stack_trace: string | null;
  request_path: string | null;
  request_method: string | null;
  user_id: string | null;
  severity: SystemErrorSeverity;
  resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface PerformanceMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  page_path: string | null;
  device_type: string | null;
  connection_type: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface SystemHealthSummary {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  uptimeSeconds: number;
  api: {
    status: "OPERATIONAL" | "DEGRADED" | "DOWN";
    averageLatencyMs: number;
    totalRequests24h: number;
  };
  database: {
    status: "CONNECTED" | "DISCONNECTED" | "DEGRADED";
    poolSize: number;
    activeConnections: number;
  };
  storage: {
    status: "OPERATIONAL" | "FULL" | "DEGRADED";
    totalMediaAssets: number;
    storageUsedBytes: number;
  };
  mediaProcessing: {
    status: "IDLE" | "PROCESSING" | "QUEUED" | "ERROR";
    pendingJobs: number;
    failedJobs: number;
  };
  security: {
    unresolvedErrorsCount: number;
    failedLoginsLast24h: number;
    rateLimitBlocksLast24h: number;
  };
  recentErrors: SystemErrorLog[];
}

export interface SecurityLogsFilter {
  page?: number;
  limit?: number;
  severity?: SecuritySeverity;
  event_type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}
