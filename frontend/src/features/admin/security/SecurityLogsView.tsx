import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileCode,
  X,
  Terminal,
} from "lucide-react";
import { securityService } from "./services/securityService";
import { SecurityLog, SecuritySeverity } from "./types/security.types";

export const SecurityLogsView: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [activeJsonLog, setActiveJsonLog] = useState<SecurityLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await securityService.getSecurityLogs({
        page,
        limit: 20,
        search: searchQuery || undefined,
        severity: severityFilter !== "ALL" ? (severityFilter as SecuritySeverity) : undefined,
      });
      setLogs(res.items || []);
      setTotalCount(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error("Failed to load security logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, severityFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getSeverityBadge = (severity: SecuritySeverity) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>CRITICAL</span>
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>WARNING</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>INFO</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Access Control & Audit Trail
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light text-primary tracking-tight mt-1">
            Security & Access Logs
          </h2>
          <p className="text-xs text-secondary mt-1">
            Monitor authentication events, rate-limiting violations, session audits, and suspicious access attempts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2.5 bg-surface border border-surface-border text-secondary hover:text-accent rounded-md transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-accent" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event type, IP address, request path..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Severity Filter */}
        <div className="sm:col-span-4">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Info Logs</option>
            <option value="WARNING">Warnings (Rate Limits, Failed Checks)</option>
            <option value="CRITICAL">Critical Alerts (Auth Breaches)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto" />
          <p className="text-xs text-secondary uppercase tracking-widest">
            Loading Security Audit Stream...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-surface border border-surface-border rounded-xl">
          <ShieldAlert className="w-10 h-10 text-secondary/40 mx-auto" />
          <h3 className="text-sm font-medium text-primary">No Security Logs Recorded</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Security events and rate-limiting triggers will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised/50 border-b border-surface-border uppercase tracking-widest text-[10px] text-secondary font-semibold">
              <tr>
                <th className="p-3.5 pl-4">Timestamp</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Event Type</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Request Path</th>
                <th className="p-3.5 text-right pr-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-secondary">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 font-sans text-secondary/80 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{getSeverityBadge(log.severity)}</td>
                  <td className="p-3 font-mono font-semibold text-primary">{log.event_type}</td>
                  <td className="p-3 font-mono text-xs text-accent/80">{log.ip_address || "127.0.0.1"}</td>
                  <td className="p-3 font-mono text-secondary truncate max-w-[200px]" title={log.request_path || ""}>
                    {log.request_path || "/"}
                  </td>
                  <td className="p-3 text-right pr-4">
                    <button
                      onClick={() => setActiveJsonLog(log)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-primary transition-colors text-[11px]"
                    >
                      <FileCode className="w-3.5 h-3.5 text-accent" />
                      <span>Payload</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <p className="text-xs text-secondary">
            Page {page} of {totalPages} ({totalCount} recorded audit events)
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-surface-border text-xs text-secondary hover:text-primary disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded border border-surface-border text-xs text-secondary hover:text-primary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* JSON Payload Modal */}
      {activeJsonLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-surface border border-surface-border rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-accent" />
                <h3 className="font-serif text-lg text-primary">Security Event Metadata</h3>
              </div>
              <button
                onClick={() => setActiveJsonLog(null)}
                className="text-secondary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-surface-raised p-3 rounded">
                <div>
                  <span className="text-secondary block text-[10px] uppercase">Event Type</span>
                  <span className="text-primary font-mono font-bold">{activeJsonLog.event_type}</span>
                </div>
                <div>
                  <span className="text-secondary block text-[10px] uppercase">Severity</span>
                  <span>{getSeverityBadge(activeJsonLog.severity)}</span>
                </div>
              </div>

              {activeJsonLog.user_agent && (
                <div className="bg-surface-raised p-3 rounded space-y-1">
                  <span className="text-secondary block text-[10px] uppercase">User Agent</span>
                  <span className="text-primary font-mono text-[11px] break-all">{activeJsonLog.user_agent}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-secondary block text-[10px] uppercase">Structured Metadata Payload</span>
                <pre className="p-3 bg-black/60 border border-surface-border rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(activeJsonLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveJsonLog(null)}
                className="px-4 py-1.5 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
