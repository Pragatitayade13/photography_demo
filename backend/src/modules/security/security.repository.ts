import { query } from "../../database/db.js";
import {
  SecurityLog,
  SystemErrorLog,
  PerformanceMetric,
  SecurityLogsFilter,
} from "./security.types.js";
import crypto from "crypto";

// Fallback in-memory stores
const fallbackSecurityLogs: SecurityLog[] = [];
const fallbackSystemErrors: SystemErrorLog[] = [];
const fallbackMetrics: PerformanceMetric[] = [];

// Seed sample audit data
const seedSecurityData = () => {
  if (fallbackSecurityLogs.length > 0) return;

  fallbackSecurityLogs.push(
    {
      id: crypto.randomUUID(),
      event_type: "AUTH_SUCCESS",
      severity: "INFO",
      user_id: "admin-1",
      ip_address: "127.0.0.1",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      request_path: "/api/v1/auth/login",
      metadata: { email: "admin@alexmercer.com" },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      event_type: "SECURITY_HEADERS_APPLIED",
      severity: "INFO",
      user_id: null,
      ip_address: "127.0.0.1",
      user_agent: "System Daemon",
      request_path: "/api/v1/health",
      metadata: { csp: "active", hsts: "active", nosniff: "active" },
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      event_type: "RATE_LIMIT_CHECK",
      severity: "INFO",
      user_id: null,
      ip_address: "192.168.1.100",
      user_agent: "Chrome / macOS",
      request_path: "/api/v1/projects/public/search",
      metadata: { requests_in_window: 14, limit: 120 },
      created_at: new Date(Date.now() - 14400000).toISOString(),
    }
  );
};

seedSecurityData();

export class SecurityRepository {
  async logSecurityEvent(
    event: Omit<SecurityLog, "id" | "created_at">
  ): Promise<SecurityLog> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const log: SecurityLog = { ...event, id, created_at: now };

    try {
      await query(
        `INSERT INTO security_logs (id, event_type, severity, user_id, ip_address, user_agent, request_path, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          log.event_type,
          log.severity,
          log.user_id,
          log.ip_address,
          log.user_agent,
          log.request_path,
          JSON.stringify(log.metadata || {}),
          now,
        ]
      );
    } catch {
      // ignore
    }

    fallbackSecurityLogs.unshift(log);
    if (fallbackSecurityLogs.length > 500) fallbackSecurityLogs.pop();
    return log;
  }

  async logSystemError(
    error: Omit<SystemErrorLog, "id" | "created_at" | "resolved" | "resolved_at">
  ): Promise<SystemErrorLog> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const errorLog: SystemErrorLog = {
      ...error,
      id,
      resolved: false,
      resolved_at: null,
      created_at: now,
    };

    try {
      await query(
        `INSERT INTO system_errors (id, error_code, message, stack_trace, request_path, request_method, user_id, severity, resolved, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          id,
          errorLog.error_code,
          errorLog.message,
          errorLog.stack_trace,
          errorLog.request_path,
          errorLog.request_method,
          errorLog.user_id,
          errorLog.severity,
          false,
          now,
        ]
      );
    } catch {
      // ignore
    }

    fallbackSystemErrors.unshift(errorLog);
    if (fallbackSystemErrors.length > 200) fallbackSystemErrors.pop();
    return errorLog;
  }

  async logMetric(
    metric: Omit<PerformanceMetric, "id" | "created_at">
  ): Promise<PerformanceMetric> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const entry: PerformanceMetric = { ...metric, id, created_at: now };

    try {
      await query(
        `INSERT INTO performance_metrics (id, metric_name, metric_value, page_path, device_type, connection_type, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          entry.metric_name,
          entry.metric_value,
          entry.page_path,
          entry.device_type,
          entry.connection_type,
          JSON.stringify(entry.metadata || {}),
          now,
        ]
      );
    } catch {
      // ignore
    }

    fallbackMetrics.unshift(entry);
    if (fallbackMetrics.length > 1000) fallbackMetrics.pop();
    return entry;
  }

  async getSecurityLogs(filter: SecurityLogsFilter) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const offset = (page - 1) * limit;

    try {
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (filter.severity) {
        conditions.push(`severity = $${idx}`);
        values.push(filter.severity);
        idx++;
      }
      if (filter.event_type) {
        conditions.push(`event_type = $${idx}`);
        values.push(filter.event_type);
        idx++;
      }
      if (filter.search) {
        conditions.push(`(event_type ILIKE $${idx} OR ip_address ILIKE $${idx} OR request_path ILIKE $${idx})`);
        values.push(`%${filter.search}%`);
        idx++;
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const countRes = await query(`SELECT COUNT(*) as total FROM security_logs ${where}`, values);
      const total = parseInt(countRes.rows[0]?.total || "0", 10);

      values.push(limit, offset);
      const res = await query(
        `SELECT * FROM security_logs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        values
      );

      return {
        items: res.rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      };
    } catch {
      let items = [...fallbackSecurityLogs];
      if (filter.severity) items = items.filter((i) => i.severity === filter.severity);
      if (filter.event_type) items = items.filter((i) => i.event_type === filter.event_type);
      if (filter.search) {
        const q = filter.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.event_type.toLowerCase().includes(q) ||
            (i.ip_address && i.ip_address.includes(q)) ||
            (i.request_path && i.request_path.toLowerCase().includes(q))
        );
      }

      const total = items.length;
      return {
        items: items.slice(offset, offset + limit),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      };
    }
  }

  async getRecentErrors(limit: number = 10): Promise<SystemErrorLog[]> {
    try {
      const res = await query(
        `SELECT * FROM system_errors ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      if (res.rows.length > 0) return res.rows;
    } catch {
      // ignore
    }
    return fallbackSystemErrors.slice(0, limit);
  }

  async resolveSystemError(id: string): Promise<boolean> {
    try {
      await query(
        `UPDATE system_errors SET resolved = true, resolved_at = NOW() WHERE id = $1`,
        [id]
      );
    } catch {
      // ignore
    }
    const err = fallbackSystemErrors.find((e) => e.id === id);
    if (err) {
      err.resolved = true;
      err.resolved_at = new Date().toISOString();
      return true;
    }
    return true;
  }
}
