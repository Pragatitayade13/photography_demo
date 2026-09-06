import { z } from "zod";

export const updateGlobalSeoSchema = z.object({
  body: z.object({
    site_title: z.string().min(1, "Site title is required").max(255),
    meta_description: z.string().max(320).optional().default(""),
    meta_keywords: z.string().max(500).optional().default(""),
    canonical_url: z.string().url("Must be a valid URL").or(z.literal("")).optional().default(""),
    default_og_title: z.string().max(255).optional().default(""),
    default_og_description: z.string().max(500).optional().default(""),
    default_og_image_url: z.string().optional().default(""),
    twitter_card_type: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
    robots_index: z.boolean().default(true),
    robots_follow: z.boolean().default(true),
    google_verification_code: z.string().max(100).optional().default(""),
    bing_verification_code: z.string().max(100).optional().default(""),
  }),
});

export const updatePageSeoSchema = z.object({
  params: z.object({
    pageKey: z.string().min(1),
  }),
  body: z.object({
    seo_title: z.string().min(1, "Page title is required").max(255),
    meta_description: z.string().max(320).optional().default(""),
    meta_keywords: z.string().max(500).optional().default(""),
    canonical_url: z.string().url("Must be a valid URL").or(z.literal("")).optional().default(""),
    og_title: z.string().max(255).optional().default(""),
    og_description: z.string().max(500).optional().default(""),
    og_image_url: z.string().optional().default(""),
    twitter_title: z.string().max(255).optional().default(""),
    twitter_description: z.string().max(500).optional().default(""),
    robots_index: z.boolean().default(true),
    robots_follow: z.boolean().default(true),
  }),
});

export const updateProjectSeoSchema = z.object({
  params: z.object({
    projectId: z.string().min(1),
  }),
  body: z.object({
    seo_title: z.string().max(255).optional().default(""),
    meta_description: z.string().max(320).optional().default(""),
    meta_keywords: z.string().max(500).optional().default(""),
    canonical_url: z.string().url("Must be a valid URL").or(z.literal("")).optional().default(""),
    og_title: z.string().max(255).optional().default(""),
    og_description: z.string().max(500).optional().default(""),
    og_image_url: z.string().optional().default(""),
    twitter_title: z.string().max(255).optional().default(""),
    twitter_description: z.string().max(500).optional().default(""),
    robots_index: z.boolean().default(true),
    robots_follow: z.boolean().default(true),
  }),
});
