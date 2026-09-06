import { z } from "zod";

export const updateSectionSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  is_visible: z.boolean().optional(),
  configuration: z.record(z.any()).optional(),
});

export const reorderSectionsSchema = z.object({
  items: z.array(
    z.object({
      section_key: z.string().min(1),
      sort_order: z.number().int(),
    })
  ),
});

export const sectionVisibilitySchema = z.object({
  is_visible: z.boolean(),
});

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;
export type SectionVisibilityInput = z.infer<typeof sectionVisibilitySchema>;
