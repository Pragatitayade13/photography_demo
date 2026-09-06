export type NotificationChannel = "EMAIL" | "IN_APP" | "SMS";
export type NotificationLogStatus = "SENT" | "FAILED" | "PENDING";
export type InAppNotificationType = "ENQUIRY_NEW" | "ENQUIRY_STATUS" | "SYSTEM_ALERT";
export type InAppNotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface NotificationSettings {
  id: string;
  admin_notification_email: string;
  enable_email_notifications: boolean;
  enable_inquiry_confirmation: boolean;
  enable_in_app_notifications: boolean;
  enable_status_change_notifications: boolean;
  sender_name: string;
  sender_email: string;
  reply_to_email: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_secure: boolean;
  smtp_configured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  description?: string;
  subject: string;
  headline?: string;
  body_html: string;
  body_text?: string;
  cta_text?: string;
  cta_url?: string;
  footer_text?: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  recipient_email: string;
  recipient_name?: string;
  notification_type: string;
  template_key?: string;
  subject: string;
  body_preview: string;
  channel: NotificationChannel;
  status: NotificationLogStatus;
  enquiry_id?: string;
  enquiry_reference?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: InAppNotificationType;
  priority: InAppNotificationPriority;
  reference_id?: string;
  link_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationStats {
  total_logs: number;
  sent_logs: number;
  failed_logs: number;
  pending_logs: number;
  unread_in_app: number;
  total_in_app: number;
  active_templates: number;
}

export interface UpdateNotificationSettingsDTO {
  admin_notification_email?: string;
  enable_email_notifications?: boolean;
  enable_inquiry_confirmation?: boolean;
  enable_in_app_notifications?: boolean;
  enable_status_change_notifications?: boolean;
  sender_name?: string;
  sender_email?: string;
  reply_to_email?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_secure?: boolean;
}

export interface UpdateEmailTemplateDTO {
  name?: string;
  description?: string;
  subject?: string;
  headline?: string;
  body_html?: string;
  body_text?: string;
  cta_text?: string;
  cta_url?: string;
  footer_text?: string;
  is_active?: boolean;
}

export interface SendTestEmailDTO {
  recipient_email: string;
  template_key?: string;
  custom_subject?: string;
  custom_body?: string;
}

export interface TemplatePreviewResponse {
  template_key: string;
  subject: string;
  html_preview: string;
  text_preview: string;
  substituted_variables: Record<string, string>;
}
