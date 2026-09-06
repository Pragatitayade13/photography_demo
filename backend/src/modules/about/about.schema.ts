import { z } from "zod";

export const updateProfileSchema = z.object({
  display_name: z.string().min(1, "Display name is required").max(100),
  professional_title: z.string().min(1, "Professional title is required").max(150),
  short_bio: z.string().min(1, "Short bio is required").max(500),
  location: z.string().max(150).optional(),
  years_experience: z.number().int().min(0).max(100).optional(),
  profile_image_url: z.string().url("Must be a valid URL"),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

export const updateSectionSchema = z.object({
  title: z.string().optional(),
  is_visible: z.boolean().optional(),
  configuration: z.record(z.any()),
});

export const sectionVisibilitySchema = z.object({
  is_visible: z.boolean(),
});

export const reorderSectionsSchema = z.object({
  ordered_keys: z.array(z.string()).min(1, "At least one section key is required"),
});
