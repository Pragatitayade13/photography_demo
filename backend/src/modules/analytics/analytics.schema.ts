import { z } from "zod";

export const trackPublicEventSchema = z.object({
  event_name: z.enum([
    "page_view",
    "project_view",
    "gallery_image_view",
    "cta_click",
    "contact_form_start",
    "contact_form_submit",
    "social_share",
  ]),
  page_path: z.string().min(1).max(255),
  project_id: z.string().max(100).optional().nullable().or(z.literal("")),
  session_hash: z.string().max(64).optional().nullable().or(z.literal("")),
  metadata: z.record(z.any()).optional().default({}),
});

export const updateAnalyticsSettingsSchema = z.object({
  provider: z.enum(["self_hosted", "google_analytics", "plausible", "matomo"]).default("self_hosted"),
  tracking_id: z.string().max(100).optional().default(""),
  is_enabled: z.boolean().default(true),
  track_page_views: z.boolean().default(true),
  track_project_views: z.boolean().default(true),
  track_cta_clicks: z.boolean().default(true),
  track_contact_submissions: z.boolean().default(true),
  respect_do_not_track: z.boolean().default(true),
});
