import { z } from "zod";

export const createEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(50).optional().or(z.literal("")),
  enquiry_type: z.string().min(1, "Please select a service or commission type"),
  event_date: z.string().optional().or(z.literal("")),
  location: z.string().max(150).optional().or(z.literal("")),
  budget_range: z.string().max(100).optional().or(z.literal("")),
  message: z.string().min(10, "Please share a brief note about your celebration or project"),
  source: z.string().max(50).optional(),
  source_project_id: z.string().max(100).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Consent to be contacted is required",
  }),
  honeypot: z.string().max(0, "Bot submission detected").optional().or(z.literal("")),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "CONTACTED",
    "IN_DISCUSSION",
    "CONFIRMED",
    "COMPLETED",
    "DECLINED",
  ]),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
});

export const addNoteSchema = z.object({
  notes: z.string().max(5000),
});
