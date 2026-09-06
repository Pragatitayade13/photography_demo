import { z } from "zod";

export const updateGeneralSettingsSchema = z.object({
  body: z.object({
    site_name: z.string().min(2, "Website name must be at least 2 characters").max(100),
    photographer_name: z.string().min(2, "Photographer name must be at least 2 characters").max(100),
    tagline: z.string().max(255).optional().default(""),
    description: z.string().max(1000).optional().default(""),
    website_status: z.enum(["ACTIVE", "MAINTENANCE", "PRIVATE"]).default("ACTIVE"),
    default_cta_text: z.string().max(100).optional().default("Inquire Commission"),
    default_cta_url: z.string().max(255).optional().default("/contact"),
    location: z.string().max(255).optional().default(""),
    timezone: z.string().max(100).optional().default("Europe/Paris"),
  }),
});

export const updateBrandingSettingsSchema = z.object({
  body: z.object({
    brand_name: z.string().min(1).max(255),
    brand_tagline: z.string().max(255).optional().default(""),
    logo_url: z.string().optional().default(""),
    logo_dark_url: z.string().optional().default(""),
    logo_light_url: z.string().optional().default(""),
    favicon_url: z.string().optional().default(""),
    og_image_url: z.string().optional().default(""),
  }),
});

export const updateContactSettingsSchema = z.object({
  body: z.object({
    public_email: z.string().email("Please provide a valid public email address"),
    public_phone: z.string().max(100).optional().default(""),
    whatsapp_number: z.string().max(100).optional().default(""),
    location: z.string().max(255).optional().default(""),
    availability_text: z.string().max(255).optional().default(""),
    response_time_text: z.string().max(255).optional().default(""),
    business_hours: z.string().max(255).optional().default(""),
  }),
});

export const updateAdvancedSettingsSchema = z.object({
  body: z.object({
    website_status: z.enum(["ACTIVE", "MAINTENANCE", "PRIVATE"]),
    maintenance_message: z.string().max(1000).optional().default(""),
    analytics_id: z.string().max(100).optional().default(""),
    enable_public_enquiries: z.boolean().default(true),
  }),
});

export const createNavigationItemSchema = z.object({
  body: z.object({
    label: z.string().min(1, "Menu label is required").max(50),
    url: z.string().min(1, "Menu URL or route is required").max(255),
    type: z.enum(["INTERNAL", "EXTERNAL", "ANCHOR"]).default("INTERNAL"),
    sort_order: z.number().int().nonnegative().optional().default(0),
    is_visible: z.boolean().optional().default(true),
    open_new_tab: z.boolean().optional().default(false),
  }),
});

export const updateNavigationItemSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    label: z.string().min(1).max(50).optional(),
    url: z.string().min(1).max(255).optional(),
    type: z.enum(["INTERNAL", "EXTERNAL", "ANCHOR"]).optional(),
    sort_order: z.number().int().nonnegative().optional(),
    is_visible: z.boolean().optional(),
    open_new_tab: z.boolean().optional(),
  }),
});

export const reorderNavigationSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        sort_order: z.number().int(),
      })
    ).min(1, "At least one item is required to reorder"),
  }),
});

export const createSocialLinkSchema = z.object({
  body: z.object({
    platform: z.string().min(1, "Platform name is required").max(50),
    label: z.string().min(1, "Label is required").max(100),
    url: z.string().url("Must provide a valid URL (https://...)"),
    icon: z.string().max(50).optional().default("globe"),
    sort_order: z.number().int().nonnegative().optional().default(0),
    is_visible: z.boolean().optional().default(true),
  }),
});

export const updateSocialLinkSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    platform: z.string().min(1).max(50).optional(),
    label: z.string().min(1).max(100).optional(),
    url: z.string().url("Must provide a valid URL (https://...)").optional(),
    icon: z.string().max(50).optional(),
    sort_order: z.number().int().nonnegative().optional(),
    is_visible: z.boolean().optional(),
  }),
});

export const reorderSocialLinksSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        sort_order: z.number().int(),
      })
    ).min(1),
  }),
});

export const updateFooterSchema = z.object({
  body: z.object({
    description: z.string().max(1000).optional().default(""),
    copyright_text: z.string().max(255).optional().default(""),
    show_social_links: z.boolean().default(true),
    show_contact: z.boolean().default(true),
    show_navigation: z.boolean().default(true),
  }),
});

export const updateSeoSchema = z.object({
  body: z.object({
    site_title: z.string().min(1, "Site title is required").max(255),
    meta_description: z.string().max(320, "Meta description should be concise").optional().default(""),
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
