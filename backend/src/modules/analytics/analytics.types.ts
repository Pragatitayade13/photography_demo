export type AnalyticsProvider = "self_hosted" | "google_analytics" | "plausible" | "matomo";

export interface AnalyticsSettings {
  id?: string;
  provider: AnalyticsProvider;
  tracking_id: string;
  is_enabled: boolean;
  track_page_views: boolean;
  track_project_views: boolean;
  track_cta_clicks: boolean;
  track_contact_submissions: boolean;
  respect_do_not_track: boolean;
  updated_at?: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name:
    | "page_view"
    | "project_view"
    | "gallery_image_view"
    | "cta_click"
    | "contact_form_start"
    | "contact_form_submit"
    | "social_share";
  page_path: string;
  project_id?: string;
  session_hash?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  visitors: number;
  page_views: number;
  project_views: number;
  inquiries: number;
}

export interface TopProjectMetric {
  project_id: string;
  project_title: string;
  project_slug: string;
  cover_image_url?: string;
  views: number;
  shares: number;
}

export interface AnalyticsSummary {
  total_visitors: number;
  total_page_views: number;
  total_project_views: number;
  total_inquiries: number;
  conversion_rate: number; // percentage
  top_project: TopProjectMetric | null;
  timeline: TrendPoint[];
  top_projects: TopProjectMetric[];
  event_distribution: Record<string, number>;
}
