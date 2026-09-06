import { z } from "zod";

export const mediaVisibilitySchema = z.enum(["PUBLIC", "PRIVATE", "DRAFT", "ARCHIVED"]);
export const mediaProcessingStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "READY",
  "FAILED",
  "RETRY_REQUIRED",
]);

export const updateMediaMetadataSchema = z.object({
  alt_text: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
  visibility: mediaVisibilitySchema.optional(),
});

export const updateMediaVisibilitySchema = z.object({
  visibility: mediaVisibilitySchema,
});

export const batchPublicMediaSchema = z.object({
  ids: z.array(z.string().uuid("Invalid Media UUID")).min(1).max(50),
});

export const mediaQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  visibility: mediaVisibilitySchema.optional(),
  processing_status: mediaProcessingStatusSchema.optional(),
  mime_type: z.string().optional(),
  sort_by: z.enum(["created_at", "file_size", "original_filename"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});
