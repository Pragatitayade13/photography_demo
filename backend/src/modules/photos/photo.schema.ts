import { z } from "zod";

export const createPhotoSchema = z.object({
  title: z
    .string({ required_error: "Photo title is required" })
    .trim()
    .min(1, "Photo title cannot be empty")
    .max(255, "Title cannot exceed 255 characters"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(280)
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .nullable(),
  image_url: z
    .string({ required_error: "Image asset is required" })
    .trim()
    .min(1, "Image URL/path is required"),
  thumbnail_url: z.string().trim().optional().nullable(),
  alt_text: z
    .string({ required_error: "Alt text is required for accessibility and SEO" })
    .trim()
    .min(1, "Alt text is required")
    .max(255, "Alt text cannot exceed 255 characters"),
  location: z.string().trim().max(255).optional().nullable(),
  photo_date: z.string().optional().nullable(),
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  file_size: z.number().int().optional().nullable(),
  mime_type: z.string().optional().nullable(),
  metadata: z.record(z.any()).optional().default({}),
});

export const updatePhotoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Photo title cannot be empty")
    .max(255, "Title cannot exceed 255 characters")
    .optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(280)
    .optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  image_url: z.string().trim().min(1).optional(),
  thumbnail_url: z.string().trim().optional().nullable(),
  alt_text: z.string().trim().min(1).max(255).optional(),
  location: z.string().trim().max(255).optional().nullable(),
  photo_date: z.string().optional().nullable(),
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  file_size: z.number().int().optional().nullable(),
  mime_type: z.string().optional().nullable(),
  metadata: z.record(z.any()).optional(),
});

export const reorderPhotosSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid("Invalid photo ID"),
      sort_order: z.number().int(),
    })
  ),
});

export const photoStatusToggleSchema = z.object({
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_visible: z.boolean().optional(),
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
export type ReorderPhotosInput = z.infer<typeof reorderPhotosSchema>;
export type PhotoStatusToggleInput = z.infer<typeof photoStatusToggleSchema>;
