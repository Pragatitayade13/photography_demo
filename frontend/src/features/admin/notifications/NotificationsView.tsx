import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Send,
  CheckCircle,
  Clock,
  RotateCw,
  Eye,
  Edit3,
  Sliders,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  Sparkles,
} from "lucide-react";
import { notificationApi } from "../../../services/notificationApi";
import {
  NotificationSettings,
  EmailTemplate,
  NotificationLog,
  InAppNotification,
  NotificationStats,
  UpdateEmailTemplateDTO,
  UpdateNotificationSettingsDTO,
  TemplatePreviewResponse,
} from "../../../types/notifications";

type TabType = "overview" | "templates" | "logs" | "in_app" | "settings";

export const NotificationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [inAppItems, setInAppItems] = useState<InAppNotification[]>([]);

  // Logs filter state
  const [logStatusFilter, setLogStatusFilter] = useState("ALL");
  const [logSearchQuery, setLogSearchQuery] = useState("");

  // Template Editing State
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<UpdateEmailTemplateDTO>({});

  // Template Preview State
  const [previewData, setPreviewData] = useState<TemplatePreviewResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Test Email Modal State
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [testTemplateKey, setTestTemplateKey] = useState("test_notification");
  const [testSending, setTestSending] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<UpdateNotificationSettingsDTO>({});

  const showNotificationFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, settingsRes, templatesRes, logsRes, inAppRes] = await Promise.all([
        notificationApi.getStats(),
        notificationApi.getSettings(),
        notificationApi.getTemplates(),
        notificationApi.getLogs({
          status: logStatusFilter !== "ALL" ? logStatusFilter : undefined,
          search: logSearchQuery || undefined,
        }),
        notificationApi.getInAppNotifications(50),
      ]);

      setStats(statsRes);
      setSettings(settingsRes);
      setSettingsForm(settingsRes);
      setTemplates(templatesRes);
      setLogs(logsRes.logs);
      setLogsTotal(logsRes.total);
      setInAppItems(inAppRes.items);
    } catch (err: any) {
      console.error("Failed to load notifications data:", err);
      showNotificationFeedback("error", "Failed to load notification system data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [logStatusFilter]);

  const handleSearchLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const logsRes = await notificationApi.getLogs({
        status: logStatusFilter !== "ALL" ? logStatusFilter : undefined,
        search: logSearchQuery || undefined,
      });
      setLogs(logsRes.logs);
      setLogsTotal(logsRes.total);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleRetryLog = async (logId: string) => {
    try {
      const updated = await notificationApi.retryLog(logId);
      setLogs((prev) => prev.map((l) => (l.id === logId ? updated : l)));
      showNotificationFeedback(
        updated.status === "SENT" ? "success" : "error",
        updated.status === "SENT" ? "Notification re-dispatched successfully" : "Retry dispatch failed"
      );
    } catch (err: any) {
      showNotificationFeedback("error", err?.message || "Failed to retry dispatch");
    }
  };

  const handleOpenEditTemplate = (tpl: EmailTemplate) => {
    setEditingTemplate(tpl);
    setTemplateForm({
      name: tpl.name,
      description: tpl.description,
      subject: tpl.subject,
      headline: tpl.headline,
      body_html: tpl.body_html,
      body_text: tpl.body_text,
      cta_text: tpl.cta_text,
      cta_url: tpl.cta_url,
      footer_text: tpl.footer_text,
      is_active: tpl.is_active,
    });
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      setSaving(true);
      const updated = await notificationApi.updateTemplate(editingTemplate.template_key, templateForm);
      setTemplates((prev) =>
        prev.map((t) => (t.template_key === updated.template_key ? updated : t))
      );
      setEditingTemplate(null);
      showNotificationFeedback("success", `Template '${updated.name}' updated successfully`);
    } catch (err: any) {
      showNotificationFeedback("error", err?.message || "Failed to update email template");
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewTemplate = async (templateKey: string) => {
    try {
      setPreviewLoading(true);
      setPreviewModalOpen(true);
      const res = await notificationApi.previewTemplate(templateKey);
      setPreviewData(res);
    } catch (err: any) {
      showNotificationFeedback("error", err?.message || "Failed to render preview");
      setPreviewModalOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await notificationApi.updateSettings(settingsForm);
      setSettings(updated);
      showNotificationFeedback("success", "Notification & transport settings saved");
    } catch (err: any) {
      showNotificationFeedback("error", err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient) return;

    try {
      setTestSending(true);
      await notificationApi.sendTestEmail({
        recipient_email: testRecipient,
        template_key: testTemplateKey,
      });
      showNotificationFeedback("success", `Test email dispatched to ${testRecipient}`);
      setTestEmailModalOpen(false);
      // Refresh logs
      const logsRes = await notificationApi.getLogs();
      setLogs(logsRes.logs);
      setLogsTotal(logsRes.total);
    } catch (err: any) {
      showNotificationFeedback("error", err?.message || "Failed to send test email");
    } finally {
      setTestSending(false);
    }
  };

  const handleMarkAllInAppRead = async () => {
    try {
      await notificationApi.markInAppRead(undefined, true);
      setInAppItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (stats) setStats({ ...stats, unread_in_app: 0 });
      showNotificationFeedback("success", "All alerts marked as read");
    } catch (err) {
      showNotificationFeedback("error", "Failed to mark all as read");
    }
  };

  const handleClearReadInApp = async () => {
    try {
      const res = await notificationApi.clearReadInApp();
      setInAppItems((prev) => prev.filter((n) => !n.is_read));
      showNotificationFeedback("success", `${res.clearedCount} read alerts cleared`);
    } catch (err) {
      showNotificationFeedback("error", "Failed to clear read alerts");
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-4">
          <RotateCw className="w-8 h-8 text-accent animate-spin" />
          <p className="text-secondary text-sm">Loading notification & email automation engine...</p>
        </div>
      </div>
    );
  }

  const successRate = stats && stats.total_logs > 0
    ? Math.round((stats.sent_logs / stats.total_logs) * 100)
    : 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-xl backdrop-blur-md border ${
            feedback.type === "success"
              ? "bg-green-950/90 text-green-200 border-green-800"
              : "bg-red-950/90 text-red-200 border-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-xs font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-serif font-bold text-primary tracking-wide">
              Notifications & Email Automation
            </h1>
            <span className="bg-accent/15 text-accent text-xs px-2.5 py-0.5 rounded-full border border-accent/20 font-mono font-medium">
              VS-13 Engine
            </span>
          </div>
          <p className="text-secondary text-xs max-w-2xl leading-relaxed">
            Manage instant photographer alerts, visitor confirmation auto-responders, no-code email templates, and delivery logs.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setTestRecipient(settings?.admin_notification_email || "");
              setTestEmailModalOpen(true);
            }}
            className="flex items-center space-x-2 px-3.5 py-2 bg-surface-raised hover:bg-surface-border text-primary border border-surface-border rounded-lg text-xs font-medium transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-accent" />
            <span>Send Test Email</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 bg-surface hover:bg-surface-raised text-secondary hover:text-primary border border-surface-border rounded-lg transition-colors"
            title="Refresh engine state"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-surface-border">
        {[
          { id: "overview", label: "Overview & Analytics", icon: Sparkles },
          { id: "templates", label: "Email Templates CMS", icon: FileCode, badge: templates.length },
          { id: "logs", label: "Delivery Logs", icon: Mail, badge: logsTotal },
          { id: "in_app", label: "In-App Alerts", icon: Bell, badge: stats?.unread_in_app },
          { id: "settings", label: "SMTP & Automation Settings", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors relative ${
                isActive
                  ? "border-accent text-accent bg-surface-raised/40 font-semibold"
                  : "border-transparent text-secondary hover:text-primary hover:bg-surface-raised/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                    isActive
                      ? "bg-accent text-black font-bold"
                      : "bg-surface-raised text-secondary border border-surface-border"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-surface border border-surface-border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                  Delivery Rate
                </span>
                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-sans text-primary">{successRate}%</span>
                <span className="text-xs text-secondary">({stats?.sent_logs || 0} sent)</span>
              </div>
              <p className="text-[11px] text-secondary/70 mt-1">Healthy email transport dispatch</p>
            </div>

            <div className="p-5 bg-surface border border-surface-border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                  Total Dispatches
                </span>
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-sans text-primary">{stats?.total_logs || 0}</span>
                <span className="text-xs text-secondary">lifetime</span>
              </div>
              <p className="text-[11px] text-secondary/70 mt-1">
                {stats?.failed_logs || 0} failed / {stats?.pending_logs || 0} pending
              </p>
            </div>

            <div className="p-5 bg-surface border border-surface-border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                  Unread Alerts
                </span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-sans text-primary">{stats?.unread_in_app || 0}</span>
                <span className="text-xs text-secondary">in-app</span>
              </div>
              <p className="text-[11px] text-secondary/70 mt-1">
                {stats?.total_in_app || 0} total stored notifications
              </p>
            </div>

            <div className="p-5 bg-surface border border-surface-border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                  Email Templates
                </span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <FileCode className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-sans text-primary">
                  {stats?.active_templates || 0}
                </span>
                <span className="text-xs text-secondary">active / {templates.length} total</span>
              </div>
              <p className="text-[11px] text-secondary/70 mt-1">Branded responsive HTML templates</p>
            </div>
          </div>

          {/* Active Workflows Status */}
          <div className="bg-surface border border-surface-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Automated Notification Pipeline Status</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-surface-raised/40 border border-surface-border flex items-start space-x-3">
                <div className={`p-2 rounded-md ${settings?.enable_email_notifications ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-primary">Admin Enquiry Alert</h4>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {settings?.enable_email_notifications ? "Enabled (Instant email)" : "Disabled"}
                  </p>
                  <p className="text-[10px] text-secondary/60 mt-1 truncate">
                    To: {settings?.admin_notification_email || "Not set"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-raised/40 border border-surface-border flex items-start space-x-3">
                <div className={`p-2 rounded-md ${settings?.enable_inquiry_confirmation ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-primary">Visitor Auto-Responder</h4>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {settings?.enable_inquiry_confirmation ? "Enabled (Sends reference code)" : "Disabled"}
                  </p>
                  <p className="text-[10px] text-secondary/60 mt-1">Dispatches immediately on inquiry</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-raised/40 border border-surface-border flex items-start space-x-3">
                <div className={`p-2 rounded-md ${settings?.enable_in_app_notifications ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-primary">In-App Notification Center</h4>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {settings?.enable_in_app_notifications ? "Enabled (Header bell alert)" : "Disabled"}
                  </p>
                  <p className="text-[10px] text-secondary/60 mt-1">Real-time studio alerts</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-raised/40 border border-surface-border flex items-start space-x-3">
                <div className={`p-2 rounded-md ${settings?.enable_status_change_notifications ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-primary">Status Change Alert</h4>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {settings?.enable_status_change_notifications ? "Enabled (Informed clients)" : "Disabled"}
                  </p>
                  <p className="text-[10px] text-secondary/60 mt-1">Dispatches on status updates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logs Snippet */}
          <div className="bg-surface border border-surface-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Recent Email Dispatches
              </h3>
              <button
                onClick={() => setActiveTab("logs")}
                className="text-xs text-accent hover:underline flex items-center space-x-1"
              >
                <span>View Full Audit Log</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-secondary uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Recipient</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Sent Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {logs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-surface-raised/30 transition-colors">
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            log.status === "SENT"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : log.status === "FAILED"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-primary font-medium">
                        {log.recipient_email}
                      </td>
                      <td className="py-2.5 px-3 text-secondary">{log.notification_type}</td>
                      <td className="py-2.5 px-3 text-secondary truncate max-w-xs">
                        {log.subject}
                      </td>
                      <td className="py-2.5 px-3 text-secondary/70">
                        {log.sent_at ? new Date(log.sent_at).toLocaleTimeString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMAIL TEMPLATES CMS */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-6 bg-surface border border-surface-border rounded-xl flex flex-col justify-between hover:border-accent/40 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                      {tpl.template_key}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tpl.is_active
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-surface-raised text-secondary"
                      }`}
                    >
                      {tpl.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-primary mb-1">{tpl.name}</h3>
                  <p className="text-xs text-secondary leading-relaxed mb-4">{tpl.description}</p>

                  <div className="p-3 bg-surface-raised/50 rounded-lg border border-surface-border/80 mb-4">
                    <span className="text-[10px] uppercase font-semibold text-secondary/70 block mb-1">
                      Subject Format:
                    </span>
                    <p className="text-xs font-mono text-primary truncate">{tpl.subject}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-semibold text-secondary/70 block mb-1.5">
                      Available Variables:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.variables.map((v) => (
                        <span
                          key={v}
                          className="text-[10px] font-mono bg-surface-raised text-accent/90 px-1.5 py-0.5 rounded border border-surface-border"
                        >
                          {"{{"}
                          {v}
                          {"}}"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                  <button
                    onClick={() => handlePreviewTemplate(tpl.template_key)}
                    className="flex items-center space-x-1.5 text-xs text-secondary hover:text-accent transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditTemplate(tpl)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-accent hover:bg-accent/90 text-black text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERY LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 bg-surface border border-surface-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {["ALL", "SENT", "FAILED", "PENDING"].map((status) => (
                <button
                  key={status}
                  onClick={() => setLogStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    logStatusFilter === status
                      ? "bg-accent text-black font-semibold"
                      : "bg-surface-raised text-secondary hover:text-primary"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchLogs} className="flex items-center space-x-2">
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder="Search recipient, subject, reference..."
                className="px-3 py-1.5 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary placeholder:text-secondary/50 focus:outline-none focus:border-accent w-64"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-surface-raised hover:bg-surface-border text-primary border border-surface-border rounded-lg text-xs font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Logs Table */}
          <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-raised/40 text-secondary uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Type / Template</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Retries</th>
                    <th className="py-3 px-4">Sent At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-secondary">
                        No delivery logs matching the current filter.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-raised/30 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                              log.status === "SENT"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : log.status === "FAILED"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {log.status}
                          </span>
                          {log.error_message && (
                            <p className="text-[10px] text-red-400 mt-1 max-w-xs truncate" title={log.error_message}>
                              {log.error_message}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-primary">
                          {log.recipient_email}
                          {log.recipient_name && (
                            <span className="block text-[10px] text-secondary">
                              {log.recipient_name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-primary font-medium">{log.notification_type}</span>
                          {log.template_key && (
                            <span className="block text-[10px] text-secondary">
                              {log.template_key}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-secondary max-w-xs truncate" title={log.subject}>
                          {log.subject}
                        </td>
                        <td className="py-3 px-4 text-secondary">
                          {log.enquiry_reference || "-"}
                        </td>
                        <td className="py-3 px-4 text-secondary">
                          {log.retry_count}/{log.max_retries}
                        </td>
                        <td className="py-3 px-4 text-secondary whitespace-nowrap">
                          {log.sent_at ? new Date(log.sent_at).toLocaleString() : "-"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {log.status === "FAILED" ? (
                            <button
                              onClick={() => handleRetryLog(log.id)}
                              className="px-2.5 py-1 bg-accent hover:bg-accent/90 text-black font-semibold rounded text-[11px] transition-colors"
                            >
                              Retry
                            </button>
                          ) : (
                            <span className="text-secondary/50 text-[11px]">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IN-APP ALERTS MANAGER */}
      {activeTab === "in_app" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-surface border border-surface-border rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-primary">
                Stored In-App Alerts ({inAppItems.length})
              </span>
              {stats && stats.unread_in_app > 0 && (
                <span className="bg-accent/15 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full border border-accent/20">
                  {stats.unread_in_app} unread
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllInAppRead}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-surface-raised hover:bg-surface-border text-primary rounded-lg text-xs font-medium border border-surface-border transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-accent" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={handleClearReadInApp}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-surface-raised hover:bg-surface-border text-secondary hover:text-danger rounded-lg text-xs font-medium border border-surface-border transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Read</span>
              </button>
            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-xl divide-y divide-surface-border">
            {inAppItems.length === 0 ? (
              <div className="p-12 text-center text-secondary">
                <Bell className="w-8 h-8 mx-auto mb-2 text-secondary/40" />
                <p className="text-sm font-medium">No in-app alerts recorded</p>
                <p className="text-xs text-secondary/60 mt-1">
                  Inquiries and system dispatches will generate alerts here.
                </p>
              </div>
            ) : (
              inAppItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-start justify-between gap-4 hover:bg-surface-raised/30 transition-colors ${
                    !item.is_read ? "bg-accent/5" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        item.type === "ENQUIRY_NEW"
                          ? "bg-accent/15 text-accent"
                          : item.type === "ENQUIRY_STATUS"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-surface-raised text-secondary"
                      }`}
                    >
                      {item.type === "ENQUIRY_NEW" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : item.type === "ENQUIRY_STATUS" ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-xs font-semibold ${
                            !item.is_read ? "text-primary" : "text-secondary"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.is_read && (
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                        <span className="text-[10px] uppercase font-semibold text-secondary bg-surface-raised px-1.5 py-0.2 rounded border border-surface-border">
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-secondary mt-1">{item.message}</p>
                      <p className="text-[10px] text-secondary/60 mt-1.5 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {item.link_url && (
                    <a
                      href={item.link_url}
                      className="px-3 py-1.5 bg-surface-raised hover:bg-surface-border text-accent rounded-lg text-xs font-medium border border-surface-border flex items-center space-x-1 shrink-0"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
          {/* Notification Automations Toggles */}
          <div className="p-6 bg-surface border border-surface-border rounded-xl space-y-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Automation Triggers
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-surface-raised/40 border border-surface-border rounded-lg cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    Admin Inquiry Alert Email
                  </span>
                  <span className="text-[11px] text-secondary">
                    Send an instant email notification to the photographer when a new inquiry is submitted.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enable_email_notifications || false}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, enable_email_notifications: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-accent focus:ring-accent border-surface-border"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-surface-raised/40 border border-surface-border rounded-lg cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    Visitor Auto-Responder Confirmation Email
                  </span>
                  <span className="text-[11px] text-secondary">
                    Immediately email the visitor with receipt confirmation and their unique tracking reference code.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enable_inquiry_confirmation || false}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, enable_inquiry_confirmation: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-accent focus:ring-accent border-surface-border"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-surface-raised/40 border border-surface-border rounded-lg cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    In-App Notification Center
                  </span>
                  <span className="text-[11px] text-secondary">
                    Display badge count alerts and bell notifications inside the studio admin portal.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enable_in_app_notifications || false}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, enable_in_app_notifications: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-accent focus:ring-accent border-surface-border"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-surface-raised/40 border border-surface-border rounded-lg cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    Inquiry Status Change Notifications
                  </span>
                  <span className="text-[11px] text-secondary">
                    Notify clients by email whenever an administrator updates their inquiry progress status.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enable_status_change_notifications || false}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      enable_status_change_notifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-accent focus:ring-accent border-surface-border"
                />
              </label>
            </div>
          </div>

          {/* Sender Identity & Routing */}
          <div className="p-6 bg-surface border border-surface-border rounded-xl space-y-6">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Sender Identity & Admin Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Photographer Alert Destination Email *
                </label>
                <input
                  type="email"
                  value={settingsForm.admin_notification_email || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, admin_notification_email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                  required
                />
                <span className="text-[10px] text-secondary/60 mt-1 block">
                  New client inquiries will be routed to this mailbox.
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Sender Display Name *
                </label>
                <input
                  type="text"
                  value={settingsForm.sender_name || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, sender_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                  required
                />
                <span className="text-[10px] text-secondary/60 mt-1 block">
                  Name appearing in recipient email inbox.
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Sender Email Address *
                </label>
                <input
                  type="email"
                  value={settingsForm.sender_email || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, sender_email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Reply-To Email Address *
                </label>
                <input
                  type="email"
                  value={settingsForm.reply_to_email || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, reply_to_email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>
            </div>
          </div>

          {/* SMTP Gateway Settings */}
          <div className="p-6 bg-surface border border-surface-border rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  SMTP Transport Gateway
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Optional SMTP configuration for production delivery (supports Mailtrap, SendGrid, Resend, Amazon SES).
                </p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-raised text-accent font-mono border border-surface-border">
                {settings?.smtp_configured ? "Configured" : "Simulated/Dev Mode"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  SMTP Host Server
                </label>
                <input
                  type="text"
                  value={settingsForm.smtp_host || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, smtp_host: e.target.value })}
                  placeholder="smtp.mailtrap.io or smtp.resend.com"
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settingsForm.smtp_port || 587}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, smtp_port: parseInt(e.target.value, 10) })
                  }
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settingsForm.smtp_user || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, smtp_user: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settingsForm.smtp_pass || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, smtp_pass: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg text-xs transition-colors flex items-center space-x-2"
            >
              {saving && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Notification Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL: EDIT EMAIL TEMPLATE */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-raised/40">
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Edit Template: {editingTemplate.name}
                </h3>
                <p className="text-[11px] font-mono text-accent mt-0.5">
                  Key: {editingTemplate.template_key}
                </p>
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                className="text-secondary hover:text-primary text-sm p-1 rounded hover:bg-surface-raised"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveTemplate} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-secondary block mb-1">
                    Template Display Name *
                  </label>
                  <input
                    type="text"
                    value={templateForm.name || ""}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="template_active"
                    checked={templateForm.is_active !== undefined ? templateForm.is_active : true}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-accent focus:ring-accent border-surface-border"
                  />
                  <label htmlFor="template_active" className="text-xs font-medium text-primary">
                    Template Active for Automated Dispatches
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  value={templateForm.subject || ""}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent font-mono"
                  required
                />
              </div>

              {/* Variable Helper Chips */}
              <div className="p-3 bg-surface-raised/50 rounded-lg border border-surface-border">
                <span className="text-[10px] uppercase font-semibold text-secondary/80 block mb-1.5">
                  Available Dynamic Variables (Click to copy/insert):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {editingTemplate.variables.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        const token = `{{${v}}}`;
                        navigator.clipboard.writeText(token);
                        showNotificationFeedback("success", `Copied ${token} to clipboard`);
                      }}
                      className="text-[10px] font-mono bg-surface hover:bg-accent hover:text-black text-accent px-2 py-0.5 rounded border border-surface-border transition-colors"
                      title="Click to copy variable token"
                    >
                      {"{{"}
                      {v}
                      {"}}"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Email Body HTML *
                </label>
                <textarea
                  rows={10}
                  value={templateForm.body_html || ""}
                  onChange={(e) => setTemplateForm({ ...templateForm, body_html: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => handlePreviewTemplate(editingTemplate.template_key)}
                  className="flex items-center space-x-1.5 text-xs text-secondary hover:text-accent"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview with Current Changes</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 bg-surface-raised text-secondary hover:text-primary text-xs rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-accent hover:bg-accent/90 text-black font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
                  >
                    {saving && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Template Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE PREVIEW */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-raised/40">
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-accent" />
                  <span>Email Template Preview</span>
                </h3>
                {previewData && (
                  <p className="text-[11px] font-mono text-secondary mt-0.5">
                    Subject: {previewData.subject}
                  </p>
                )}
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-secondary hover:text-primary text-sm p-1 rounded hover:bg-surface-raised"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-neutral-900/50">
              {previewLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <RotateCw className="w-6 h-6 text-accent animate-spin" />
                </div>
              ) : previewData ? (
                <div
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: previewData.html_preview }}
                />
              ) : (
                <p className="text-center text-secondary py-12">No preview data</p>
              )}
            </div>

            <div className="px-6 py-3 border-t border-surface-border bg-surface-raised/40 flex justify-end">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-surface-raised hover:bg-surface-border text-primary text-xs font-semibold rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TEST EMAIL */}
      {testEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-raised/40">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center space-x-2">
                <Send className="w-4 h-4 text-accent" />
                <span>Send Diagnostic Test Email</span>
              </h3>
              <button
                onClick={() => setTestEmailModalOpen(false)}
                className="text-secondary hover:text-primary text-sm p-1 rounded hover:bg-surface-raised"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="photographer@studio.com"
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary block mb-1">
                  Select Template to Dispatch
                </label>
                <select
                  value={testTemplateKey}
                  onChange={(e) => setTestTemplateKey(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-xs text-primary focus:outline-none focus:border-accent"
                >
                  {templates.map((t) => (
                    <option key={t.template_key} value={t.template_key}>
                      {t.name} ({t.template_key})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setTestEmailModalOpen(false)}
                  className="px-4 py-2 bg-surface-raised text-secondary hover:text-primary text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testSending}
                  className="px-5 py-2 bg-accent hover:bg-accent/90 text-black font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  {testSending && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Dispatch Test</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
