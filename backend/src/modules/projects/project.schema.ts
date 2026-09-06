import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string({ required_error: "Project title is required" })
    .trim()
    .min(1, "Project title cannot be empty")
    .max(255, "Title cannot exceed 255 characters"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(280)
    .optional(),
  short_description: z.string().trim().max(300, "Short description cannot exceed 300 characters").optional().nullable(),
  description: z.string().trim().optional().nullable(),
  cover_image_url: z.string().trim().optional().nullable(),
  category_id: z.string().optional().nullable(),
  location: z.string().trim().max(255).optional().nullable(),
  project_date: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  featured_order: z.number().int().default(0),
  featured_start_date: z.string().optional().nullable(),
  featured_end_date: z.string().optional().nullable(),
  show_in_search: z.boolean().default(true),
  show_related_projects: z.boolean().default(true),
  enable_gallery: z.boolean().default(true),
  enable_before_after: z.boolean().default(false),
  show_enquiry_cta: z.boolean().default(true),
  allow_sharing: z.boolean().default(true),
  tags: z.array(z.string().trim()).optional().default([]),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  photo_ids: z.array(z.string()).optional().default([]),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(280).optional(),
  short_description: z.string().trim().max(300).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  cover_image_url: z.string().trim().optional().nullable(),
  category_id: z.string().optional().nullable(),
  location: z.string().trim().max(255).optional().nullable(),
  project_date: z.string().optional().nullable(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  featured_order: z.number().int().optional(),
  featured_start_date: z.string().optional().nullable(),
  featured_end_date: z.string().optional().nullable(),
  show_in_search: z.boolean().optional(),
  show_related_projects: z.boolean().optional(),
  enable_gallery: z.boolean().optional(),
  enable_before_after: z.boolean().optional(),
  show_enquiry_cta: z.boolean().optional(),
  allow_sharing: z.boolean().optional(),
  tags: z.array(z.string().trim()).optional(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export const addPhotosSchema = z.object({
  photo_ids: z.array(z.string()).min(1, "Provide at least one photo ID"),
});

export const reorderProjectPhotosSchema = z.object({
  items: z.array(
    z.object({
      photo_id: z.string(),
      sort_order: z.number().int(),
    })
  ),
});

export const projectStatusToggleSchema = z.object({
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  featured_order: z.number().int().optional(),
  is_visible: z.boolean().optional(),
});

export const createComparisonSchema = z.object({
  project_id: z.string({ required_error: "Project ID is required" }),
  before_image_url: z.string({ required_error: "Before image URL is required" }).url(),
  after_image_url: z.string({ required_error: "After image URL is required" }).url(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(1000).optional().nullable(),
  before_label: z.string().max(100).default("Before"),
  after_label: z.string().max(100).default("After"),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const updateComparisonSchema = z.object({
  before_image_url: z.string().url().optional(),
  after_image_url: z.string().url().optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  before_label: z.string().max(100).optional(),
  after_label: z.string().max(100).optional(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export const setRelatedProjectsSchema = z.object({
  related_project_ids: z.array(z.string()),
});

export const updateFeaturedOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      featured_order: z.number().int(),
      is_featured: z.boolean().optional(),
    })
  ),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddPhotosInput = z.infer<typeof addPhotosSchema>;
export type ReorderProjectPhotosInput = z.infer<typeof reorderProjectPhotosSchema>;
export type ProjectStatusToggleInput = z.infer<typeof projectStatusToggleSchema>;
export type CreateComparisonInput = z.infer<typeof createComparisonSchema>;
export type UpdateComparisonInput = z.infer<typeof updateComparisonSchema>;
export type SetRelatedProjectsInput = z.infer<typeof setRelatedProjectsSchema>;
export type UpdateFeaturedOrderInput = z.infer<typeof updateFeaturedOrderSchema>;
