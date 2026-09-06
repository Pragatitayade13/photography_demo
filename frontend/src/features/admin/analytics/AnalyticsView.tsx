import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Eye,
  FolderKanban,
  Mail,
  TrendingUp,
  RefreshCw,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Share2,
} from "lucide-react";
import { analyticsApi } from "../../../services/analyticsApi";
import { AnalyticsSummary, AnalyticsSettings, AnalyticsEvent } from "../../../types/analytics";

export const AnalyticsView: React.FC = () => {
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [settings, setSettings] = useState<AnalyticsSettings | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadAnalytics = async () => {
    try {
      setRefreshing(true);
      const [sumData, evtsData, settData] = await Promise.all([
        analyticsApi.getSummary(days),
        analyticsApi.getEvents(30),
        analyticsApi.getSettings(),
      ]);
      setSummary(sumData);
      setEvents(evtsData);
      setSettings(settData);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to load analytics telemetry.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSavingSettings(true);
      const updated = await analyticsApi.updateSettings(settings);
      setSettings(updated);
      setShowSettingsModal(false);
      showToast("success", "Analytics & telemetry privacy preferences updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to save analytics settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-secondary font-mono">
          Aggregating Studio Telemetry & Conversion Metrics...
        </p>
      </div>
    );
  }

  // Calculate SVG Trend points
  const timeline = summary.timeline || [];
  const maxVal = Math.max(...timeline.map((t) => Math.max(t.page_views, t.visitors, 10)), 20);
  const chartHeight = 160;
  const chartWidth = 700;

  const points = timeline.map((t, idx) => {
    const x = (idx / Math.max(timeline.length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (t.page_views / maxVal) * (chartHeight - 30) - 15;
    return { x, y, ...t };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `M ${points[0].x},${chartHeight} L ${polylineStr} L ${points[points.length - 1].x},${chartHeight} Z`
      : "";

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs uppercase tracking-[0.25em] font-mono">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>VS-12 Visitor Intelligence & Discovery</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-primary mt-1">
            Studio Analytics & Conversions
          </h1>
          <p className="text-xs text-secondary mt-1">
            Track anonymous visitor engagement, top viewed portfolio monographs, and lead conversion rates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Days Filter */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>

          <button
            onClick={loadAnalytics}
            disabled={refreshing}
            className="p-2 rounded-lg bg-surface border border-surface-border text-secondary hover:text-primary transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-accent text-background text-xs uppercase tracking-wider font-semibold hover:bg-accent-hover transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tracking Config</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-3 text-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
              Unique Visitors
            </span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <p className="font-sans text-3xl font-semibold text-primary">
            {summary.total_visitors.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 font-medium">Anonymous Sessions</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
              Total Page Views
            </span>
            <Eye className="w-4 h-4 text-accent" />
          </div>
          <p className="font-sans text-3xl font-semibold text-primary">
            {summary.total_page_views.toLocaleString()}
          </p>
          <p className="text-[10px] text-secondary font-medium">Portfolio & Curated Pages</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
              Inquiries & Leads
            </span>
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <p className="font-sans text-3xl font-semibold text-primary">
            {summary.total_inquiries.toLocaleString()}
          </p>
          <p className="text-[10px] text-accent font-medium">High-Intent Leads</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
              Conversion Rate
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-sans text-3xl font-semibold text-primary">
            {summary.conversion_rate}%
          </p>
          <p className="text-[10px] text-secondary font-medium">Visitor → Booking Inquiry</p>
        </div>
      </div>

      {/* Trend Line & Area Chart */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-base text-primary">Visitor Traffic & Engagement Trajectory</h3>
          </div>
          <div className="flex items-center space-x-4 text-[10px] font-mono uppercase text-secondary">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
              <span>Page Views</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Unique Visitors</span>
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-48 sm:h-56 overflow-visible"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.33, 0.66, 1].map((ratio) => {
              const y = chartHeight - ratio * (chartHeight - 30) - 15;
              return (
                <line
                  key={ratio}
                  x1={20}
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area fill */}
            {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

            {/* Polyline */}
            {polylineStr && (
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />
            )}

            {/* Points & Labels */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill="#08080a"
                  stroke="#d4af37"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />
                <text
                  x={p.x}
                  y={chartHeight + 16}
                  fill="#71717a"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Two Column Grid: Top Projects & Real-time Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Viewed Stories Leaderboard */}
        <div className="lg:col-span-6 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-accent" />
              <h3 className="font-serif text-base text-primary">Top Viewed Stories</h3>
            </div>
            <span className="text-[10px] font-mono text-secondary">Ranked by Views</span>
          </div>

          <div className="divide-y divide-surface-border">
            {summary.top_projects.length > 0 ? (
              summary.top_projects.map((proj, idx) => (
                <div key={proj.project_id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-5 text-xs font-mono text-accent font-bold">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-medium text-primary">{proj.project_title}</h4>
                      <p className="text-[10px] text-secondary font-mono">/{proj.project_slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono text-secondary">
                    <span className="flex items-center space-x-1 text-primary">
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>{proj.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Share2 className="w-3.5 h-3.5 text-secondary" />
                      <span>{proj.shares}</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-secondary py-6 text-center">
                No story views recorded yet. Public story views will rank here.
              </p>
            )}
          </div>
        </div>

        {/* Recent Telemetry Event Stream */}
        <div className="lg:col-span-6 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h3 className="font-serif text-base text-primary">Live Telemetry Feed</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">● Active</span>
          </div>

          <div className="divide-y divide-surface-border max-h-[340px] overflow-y-auto pr-1">
            {events.slice(0, 10).map((evt) => (
              <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${
                      evt.event_name === "contact_form_submit"
                        ? "bg-accent/20 text-accent font-bold"
                        : evt.event_name === "project_view"
                        ? "bg-emerald-950/40 text-emerald-300"
                        : "bg-surface-raised text-secondary"
                    }`}
                  >
                    {evt.event_name}
                  </span>
                  <span className="text-primary font-mono text-[11px] truncate max-w-[180px]">
                    {evt.page_path}
                  </span>
                </div>
                <span className="text-[10px] text-secondary font-mono">
                  {new Date(evt.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Provider Settings Modal */}
      {showSettingsModal && settings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveSettings}
            className="w-full max-w-lg bg-[#0e0e13] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-4 h-4 text-accent" />
                <h3 className="font-serif text-lg font-light text-primary">
                  Analytics & Privacy Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-secondary hover:text-primary text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-secondary mb-1.5">
                  Analytics Provider
                </label>
                <select
                  value={settings.provider}
                  onChange={(e: any) =>
                    setSettings({ ...settings, provider: e.target.value })
                  }
                  className="w-full bg-background border border-surface-border rounded-lg px-3.5 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                >
                  <option value="self_hosted">Self-Hosted Studio Telemetry (Default)</option>
                  <option value="google_analytics">Google Analytics 4 (GA4)</option>
                  <option value="plausible">Plausible Analytics</option>
                  <option value="matomo">Matomo Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-secondary mb-1.5">
                  Measurement / Tracking ID
                </label>
                <input
                  type="text"
                  value={settings.tracking_id}
                  onChange={(e) =>
                    setSettings({ ...settings, tracking_id: e.target.value })
                  }
                  placeholder="e.g. G-XXXXXXXXXX or custom ID"
                  className="w-full bg-background border border-surface-border rounded-lg px-3.5 py-2 text-xs text-primary focus:border-accent focus:outline-none font-mono"
                />
              </div>

              <div className="border-t border-surface-border pt-3 space-y-3">
                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.is_enabled}
                    onChange={(e) =>
                      setSettings({ ...settings, is_enabled: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Enable Visitor Telemetry Collection</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.respect_do_not_track}
                    onChange={(e) =>
                      setSettings({ ...settings, respect_do_not_track: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Respect "Do Not Track" (DNT) Browser Signals</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.track_project_views}
                    onChange={(e) =>
                      setSettings({ ...settings, track_project_views: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Track Individual Visual Story Views</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.track_contact_submissions}
                    onChange={(e) =>
                      setSettings({ ...settings, track_contact_submissions: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Track Contact Form Conversions (Anonymized)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-lg border border-surface-border text-xs text-secondary hover:text-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-accent text-background text-xs font-semibold uppercase tracking-wider hover:bg-accent-hover transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? "Saving..." : "Save Preferences"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
