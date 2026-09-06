import { z } from "zod";

export const updateNotificationSettingsSchema = z.object({
  admin_notification_email: z.string().email("Invalid admin email address").optional(),
  enable_email_notifications: z.boolean().optional(),
  enable_inquiry_confirmation: z.boolean().optional(),
  enable_in_app_notifications: z.boolean().optional(),
  enable_status_change_notifications: z.boolean().optional(),
  sender_name: z.string().min(1, "Sender name cannot be empty").max(100).optional(),
  sender_email: z.string().email("Invalid sender email address").optional(),
  reply_to_email: z.string().email("Invalid reply-to email address").optional(),
  smtp_host: z.string().max(255).optional(),
  smtp_port: z.number().int().min(1).max(65535).optional(),
  smtp_user: z.string().max(255).optional(),
  smtp_pass: z.string().max(255).optional(),
  smtp_secure: z.boolean().optional(),
});

export const updateEmailTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(150).optional(),
  description: z.string().max(500).optional(),
  subject: z.string().min(1, "Email subject is required").max(255).optional(),
  headline: z.string().max(255).optional(),
  body_html: z.string().min(1, "HTML body cannot be empty").optional(),
  body_text: z.string().optional(),
  cta_text: z.string().max(100).optional(),
  cta_url: z.string().max(500).optional(),
  footer_text: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
});

export const sendTestEmailSchema = z.object({
  recipient_email: z.string().email("Valid recipient email is required"),
  template_key: z.string().optional(),
  custom_subject: z.string().max(255).optional(),
  custom_body: z.string().max(5000).optional(),
});

export const templatePreviewSchema = z.object({
  template_key: z.string().min(1, "Template key is required"),
  sample_variables: z.record(z.string()).optional(),
});

export const markNotificationsReadSchema = z.object({
  notification_ids: z.array(z.string()).optional(),
  mark_all: z.boolean().optional(),
});
