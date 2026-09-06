import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .trim()
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(120, "Slug cannot exceed 120 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
  cover_image_url: z
    .string()
    .trim()
    .optional()
    .nullable(),
  is_active: z.boolean().default(true),
  is_visible: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters")
    .optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(120, "Slug cannot exceed 120 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
  cover_image_url: z
    .string()
    .trim()
    .optional()
    .nullable(),
  is_active: z.boolean().optional(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export const reorderCategoriesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid("Invalid category ID"),
      sort_order: z.number().int(),
    })
  ),
});

export const statusToggleSchema = z.object({
  is_active: z.boolean().optional(),
  is_visible: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;
export type StatusToggleInput = z.infer<typeof statusToggleSchema>;
