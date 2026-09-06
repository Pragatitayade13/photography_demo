import { query } from "../../database/db.js";
import {
  AnalyticsSettings,
  AnalyticsEvent,
  AnalyticsSummary,
  TopProjectMetric,
  TrendPoint,
} from "./analytics.types.js";
import { ProjectRepository } from "../projects/project.repository.js";

const projectRepo = new ProjectRepository();

// In-Memory Settings Default
let inMemorySettings: AnalyticsSettings = {
  provider: "self_hosted",
  tracking_id: "G-STUDIO-2026",
  is_enabled: true,
  track_page_views: true,
  track_project_views: true,
  track_cta_clicks: true,
  track_contact_submissions: true,
  respect_do_not_track: true,
  updated_at: new Date().toISOString(),
};

// Seed realistic initial analytics events for the last 7 days
const generateSeedEvents = (): AnalyticsEvent[] => {
  const events: AnalyticsEvent[] = [];
  const now = Date.now();
  const sampleProjects = [
    { id: "lake-como-celebrations", title: "Lake Como Celebrations" },
    { id: "haute-couture-autumn", title: "Haute Couture Autumn Paris" },
    { id: "kyoto-architectural-monograph", title: "Kyoto Sanctuary Light" },
  ];

  for (let i = 6; i >= 0; i--) {
    const dayTimestamp = now - i * 24 * 60 * 60 * 1000;
    const dayIso = new Date(dayTimestamp).toISOString();

    // Generate page views
    for (let p = 0; p < 25 + Math.floor(Math.random() * 20); p++) {
      events.push({
        id: `evt-${dayTimestamp}-pv-${p}`,
        event_name: "page_view",
        page_path: p % 3 === 0 ? "/portfolio" : p % 3 === 1 ? "/about" : "/",
        session_hash: `sess-${dayTimestamp}-${Math.floor(p / 3)}`,
        created_at: new Date(dayTimestamp + p * 60000).toISOString(),
      });
    }

    // Generate project views
    for (let pv = 0; pv < 15 + Math.floor(Math.random() * 15); pv++) {
      const proj = sampleProjects[pv % sampleProjects.length];
      events.push({
        id: `evt-${dayTimestamp}-proj-${pv}`,
        event_name: "project_view",
        page_path: `/portfolio/${proj.id}`,
        project_id: proj.id,
        session_hash: `sess-${dayTimestamp}-${Math.floor(pv / 2)}`,
        created_at: new Date(dayTimestamp + pv * 80000).toISOString(),
      });
    }

    // Generate CTA clicks & inquiries
    events.push({
      id: `evt-${dayTimestamp}-cta`,
      event_name: "cta_click",
      page_path: "/portfolio",
      session_hash: `sess-${dayTimestamp}-1`,
      created_at: new Date(dayTimestamp + 120000).toISOString(),
    });

    if (i % 2 === 0) {
      events.push({
        id: `evt-${dayTimestamp}-inq`,
        event_name: "contact_form_submit",
        page_path: "/contact",
        session_hash: `sess-${dayTimestamp}-2`,
        created_at: new Date(dayTimestamp + 180000).toISOString(),
      });
    }
  }

  return events;
};

let inMemoryEvents: AnalyticsEvent[] = generateSeedEvents();

export class AnalyticsRepository {
  // --- SETTINGS ---
  async getSettings(): Promise<AnalyticsSettings> {
    try {
      const res = await query("SELECT * FROM analytics_settings LIMIT 1");
      if (res.rows.length > 0) {
        const r = res.rows[0];
        inMemorySettings = {
          id: r.id,
          provider: r.provider,
          tracking_id: r.tracking_id || "",
          is_enabled: r.is_enabled,
          track_page_views: r.track_page_views,
          track_project_views: r.track_project_views,
          track_cta_clicks: r.track_cta_clicks,
          track_contact_submissions: r.track_contact_submissions,
          respect_do_not_track: r.respect_do_not_track,
          updated_at: r.updated_at,
        };
      }
    } catch {
      // Handled in-memory
    }
    return inMemorySettings;
  }

  async updateSettings(data: Partial<AnalyticsSettings>): Promise<AnalyticsSettings> {
    inMemorySettings = {
      ...inMemorySettings,
      ...data,
      updated_at: new Date().toISOString(),
    };

    try {
      await query(
        `UPDATE analytics_settings SET 
          provider = COALESCE($1, provider),
          tracking_id = COALESCE($2, tracking_id),
          is_enabled = COALESCE($3, is_enabled),
          track_page_views = COALESCE($4, track_page_views),
          track_project_views = COALESCE($5, track_project_views),
          track_cta_clicks = COALESCE($6, track_cta_clicks),
          track_contact_submissions = COALESCE($7, track_contact_submissions),
          respect_do_not_track = COALESCE($8, respect_do_not_track),
          updated_at = NOW()`,
        [
          data.provider,
          data.tracking_id,
          data.is_enabled,
          data.track_page_views,
          data.track_project_views,
          data.track_cta_clicks,
          data.track_contact_submissions,
          data.respect_do_not_track,
        ]
      );
    } catch {
      // Handled
    }

    return inMemorySettings;
  }

  // --- RECORD EVENT ---
  async recordEvent(
    data: Omit<AnalyticsEvent, "id" | "created_at">,
    dntHeader = false
  ): Promise<boolean> {
    const settings = await this.getSettings();
    if (!settings.is_enabled) return false;
    if (settings.respect_do_not_track && dntHeader) return false;

    // Check specific event toggles
    if (data.event_name === "page_view" && !settings.track_page_views) return false;
    if (data.event_name === "project_view" && !settings.track_project_views) return false;
    if (data.event_name === "cta_click" && !settings.track_cta_clicks) return false;
    if (data.event_name === "contact_form_submit" && !settings.track_contact_submissions)
      return false;

    const newEvent: AnalyticsEvent = {
      ...data,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      created_at: new Date().toISOString(),
    };

    inMemoryEvents.push(newEvent);

    // Keep memory store bounded to 10,000 events
    if (inMemoryEvents.length > 10000) {
      inMemoryEvents = inMemoryEvents.slice(-8000);
    }

    try {
      await query(
        `INSERT INTO analytics_events (id, event_name, page_path, project_id, session_hash, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newEvent.id,
          newEvent.event_name,
          newEvent.page_path,
          newEvent.project_id || null,
          newEvent.session_hash || null,
          JSON.stringify(newEvent.metadata || {}),
          newEvent.created_at,
        ]
      );
    } catch {
      // Handled
    }

    return true;
  }

  // --- GET RECENT EVENTS ---
  async getEvents(limit = 50): Promise<AnalyticsEvent[]> {
    try {
      const res = await query(
        "SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT $1",
        [limit]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          event_name: r.event_name,
          page_path: r.page_path,
          project_id: r.project_id,
          session_hash: r.session_hash,
          metadata: r.metadata,
          created_at: r.created_at,
        }));
      }
    } catch {
      // Fallback
    }
    return [...inMemoryEvents].reverse().slice(0, limit);
  }

  // --- TOP PROJECTS RANKING ---
  async getTopProjects(): Promise<TopProjectMetric[]> {
    const projectViewsMap: Record<string, { views: number; shares: number }> = {};

    for (const evt of inMemoryEvents) {
      if (evt.project_id) {
        if (!projectViewsMap[evt.project_id]) {
          projectViewsMap[evt.project_id] = { views: 0, shares: 0 };
        }
        if (evt.event_name === "project_view") {
          projectViewsMap[evt.project_id].views += 1;
        } else if (evt.event_name === "social_share") {
          projectViewsMap[evt.project_id].shares += 1;
        }
      }
    }

    // Resolve real project details
    let allProjects: any[] = [];
    try {
      allProjects = await projectRepo.findAll({ is_published: true });
    } catch {
      // Handled
    }

    const metrics: TopProjectMetric[] = [];
    for (const [projId, stat] of Object.entries(projectViewsMap)) {
      const matched = allProjects.find((p) => p.id === projId || p.slug === projId);
      metrics.push({
        project_id: projId,
        project_title: matched ? matched.title : projId.replace(/-/g, " ").toUpperCase(),
        project_slug: matched ? matched.slug : projId,
        cover_image_url: matched ? matched.cover_image_url : undefined,
        views: stat.views,
        shares: stat.shares,
      });
    }

    metrics.sort((a, b) => b.views - a.views);
    return metrics;
  }

  // --- SUMMARY & TIMELINE ROLLUP ---
  async getSummary(days = 7): Promise<AnalyticsSummary> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const relevantEvents = inMemoryEvents.filter((e) => new Date(e.created_at) >= cutoffDate);

    const uniqueSessions = new Set<string>();
    let totalPageViews = 0;
    let totalProjectViews = 0;
    let totalInquiries = 0;
    const distribution: Record<string, number> = {};

    // Group by Date for Timeline
    const timelineMap: Record<string, TrendPoint> = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split("T")[0];
      timelineMap[dateKey] = {
        date: dateKey,
        visitors: 0,
        page_views: 0,
        project_views: 0,
        inquiries: 0,
      };
    }

    const daySessionsMap: Record<string, Set<string>> = {};

    for (const evt of relevantEvents) {
      const dateKey = evt.created_at.split("T")[0];
      distribution[evt.event_name] = (distribution[evt.event_name] || 0) + 1;

      if (evt.session_hash) {
        uniqueSessions.add(evt.session_hash);
        if (!daySessionsMap[dateKey]) daySessionsMap[dateKey] = new Set();
        daySessionsMap[dateKey].add(evt.session_hash);
      }

      if (timelineMap[dateKey]) {
        if (evt.event_name === "page_view") {
          totalPageViews += 1;
          timelineMap[dateKey].page_views += 1;
        } else if (evt.event_name === "project_view") {
          totalProjectViews += 1;
          timelineMap[dateKey].project_views += 1;
        } else if (evt.event_name === "contact_form_submit") {
          totalInquiries += 1;
          timelineMap[dateKey].inquiries += 1;
        }
      }
    }

    for (const [dateKey, sessionSet] of Object.entries(daySessionsMap)) {
      if (timelineMap[dateKey]) {
        timelineMap[dateKey].visitors = sessionSet.size;
      }
    }

    const totalVisitors = Math.max(uniqueSessions.size, 1);
    const conversionRate =
      totalVisitors > 0
        ? Number(((totalInquiries / totalVisitors) * 100).toFixed(2))
        : 0;

    const topProjects = await this.getTopProjects();
    const topProject = topProjects.length > 0 ? topProjects[0] : null;

    return {
      total_visitors: totalVisitors,
      total_page_views: totalPageViews,
      total_project_views: totalProjectViews,
      total_inquiries: totalInquiries,
      conversion_rate: conversionRate,
      top_project: topProject,
      timeline: Object.values(timelineMap),
      top_projects: topProjects.slice(0, 5),
      event_distribution: distribution,
    };
  }
}
