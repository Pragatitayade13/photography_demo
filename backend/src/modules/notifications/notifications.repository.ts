import { query } from "../../database/db.js";
import {
  NotificationSettings,
  EmailTemplate,
  NotificationLog,
  InAppNotification,
  NotificationStats,
  UpdateNotificationSettingsDTO,
  UpdateEmailTemplateDTO,
} from "./notifications.types.js";

// In-Memory Data Store (Default state & Fallback)
let inMemorySettings: NotificationSettings = {
  id: "global-notifications-1",
  admin_notification_email: "studio@alexmercer.com",
  enable_email_notifications: true,
  enable_inquiry_confirmation: true,
  enable_in_app_notifications: true,
  enable_status_change_notifications: true,
  sender_name: "Alex Mercer Photography",
  sender_email: "notifications@alexmercer.com",
  reply_to_email: "studio@alexmercer.com",
  smtp_host: "smtp.mailtrap.io",
  smtp_port: 587,
  smtp_user: "mock_smtp_user",
  smtp_pass: "mock_smtp_pass",
  smtp_secure: false,
  smtp_configured: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let inMemoryTemplates: EmailTemplate[] = [
  {
    id: "tpl-1",
    template_key: "admin_enquiry_alert",
    name: "New Inquiry Alert (Photographer)",
    description: "Sent to the photographer/studio email when a visitor submits an inquiry.",
    subject: "⚡ New Commission Inquiry: {{visitorName}} ({{enquiryType}}) [{{referenceNumber}}]",
    headline: "New Commission Request Received",
    body_html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background: #0f172a; padding: 24px 32px; text-align: center;">
    <h1 style="color: #f8fafc; font-size: 20px; font-weight: 600; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">{{siteName}}</h1>
    <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Studio Commission Management</p>
  </div>
  <div style="padding: 32px;">
    <div style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px;">
      Ref: {{referenceNumber}}
    </div>
    <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 16px 0;">You have received a new inquiry from {{visitorName}}</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 130px; border-bottom: 1px solid #f1f5f9;"><strong>Visitor Name:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;">{{visitorName}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><strong>Email Address:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:{{visitorEmail}}" style="color: #2563eb; text-decoration: none;">{{visitorEmail}}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><strong>Phone Number:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;">{{visitorPhone}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><strong>Inquiry Type:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;">{{enquiryType}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><strong>Target Event Date:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;">{{eventDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><strong>Location:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;">{{location}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><strong>Estimated Budget:</strong></td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #f1f5f9;">{{budgetRange}}</td>
      </tr>
    </table>
    <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 24px; border-radius: 0 4px 4px 0;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase;">Inquiry Message</p>
      <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{{message}}</p>
    </div>
    <div style="text-align: center; margin-top: 32px;">
      <a href="{{adminUrl}}" style="background: #0f172a; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; display: inline-block;">Open in Admin Console</a>
    </div>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center; color: #94a3b8; font-size: 12px;">
    {{siteName}} Automated Notification Dispatcher · Ref: {{referenceNumber}}
  </div>
</div>`.trim(),
    body_text: "New inquiry from {{visitorName}} ({{visitorEmail}}). Reference: {{referenceNumber}}. Type: {{enquiryType}}. Message: {{message}}. Manage in Admin: {{adminUrl}}",
    cta_text: "Review Inquiry",
    cta_url: "{{adminUrl}}",
    footer_text: "Automated alert from {{siteName}}.",
    variables: [
      "referenceNumber",
      "visitorName",
      "visitorEmail",
      "visitorPhone",
      "enquiryType",
      "eventDate",
      "location",
      "budgetRange",
      "message",
      "siteName",
      "photographerName",
      "adminUrl",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tpl-2",
    template_key: "visitor_enquiry_confirmation",
    name: "Inquiry Confirmation (Visitor Auto-Responder)",
    description: "Sent immediately to the visitor to confirm receipt of their inquiry and provide their tracking reference number.",
    subject: "✨ Thank you for inquiring with {{siteName}} [{{referenceNumber}}]",
    headline: "We have received your commission inquiry",
    body_html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background: #0f172a; padding: 32px; text-align: center;">
    <h1 style="color: #f8fafc; font-size: 22px; font-weight: 600; margin: 0; letter-spacing: 0.08em; text-transform: uppercase;">{{siteName}}</h1>
    <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">{{photographerName}} Atelier & Archives</p>
  </div>
  <div style="padding: 36px 32px;">
    <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-top: 0;">Dear {{visitorName}},</p>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Thank you for reaching out regarding a <strong>{{enquiryType}}</strong> commission. Your inquiry has been safely logged in our studio queue under reference code:
    </p>
    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 14px; text-align: center; margin: 20px 0;">
      <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Inquiry Reference Code</span>
      <span style="font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 0.1em; font-family: monospace;">{{referenceNumber}}</span>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      {{photographerName}} personally reviews every project request. Our studio typically responds within <strong>24 business hours</strong> with date availability, preliminary notes, and an invitation for a design consultation.
    </p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #475569;">Summary of your submission:</h4>
      <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;"><strong>Type:</strong> {{enquiryType}}<br/><strong>Location:</strong> {{location}}<br/><strong>Target Date:</strong> {{eventDate}}</p>
    </div>
    <div style="text-align: center; margin-top: 32px;">
      <a href="{{siteUrl}}/portfolio" style="background: #0f172a; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; display: inline-block;">Explore Monograph Portfolio</a>
    </div>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; color: #64748b; font-size: 12px;">
    <p style="margin: 0 0 4px 0;">Questions? Reply directly to this email or reach us at <a href="mailto:{{publicEmail}}" style="color: #2563eb;">{{publicEmail}}</a></p>
    <p style="margin: 0; color: #94a3b8;">{{photographerName}} Photography · {{siteUrl}}</p>
  </div>
</div>`.trim(),
    body_text: "Dear {{visitorName}}, thank you for inquiring with {{siteName}}. Your reference is {{referenceNumber}}. We will review your {{enquiryType}} request and respond within 24 hours.",
    cta_text: "View Portfolio",
    cta_url: "{{siteUrl}}/portfolio",
    footer_text: "Thank you for contacting {{siteName}}.",
    variables: [
      "referenceNumber",
      "visitorName",
      "enquiryType",
      "eventDate",
      "location",
      "siteName",
      "photographerName",
      "publicEmail",
      "publicPhone",
      "siteUrl",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tpl-3",
    template_key: "enquiry_status_updated",
    name: "Inquiry Status Update (Visitor)",
    description: "Sent when an administrator updates the inquiry status (e.g. In Discussion, Confirmed, Completed).",
    subject: "Update on your inquiry [{{referenceNumber}}] — {{enquiryStatus}}",
    headline: "Status Update: {{enquiryStatus}}",
    body_html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background: #0f172a; padding: 28px 32px; text-align: center;">
    <h1 style="color: #f8fafc; font-size: 20px; font-weight: 600; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">{{siteName}}</h1>
    <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Studio Status Notice</p>
  </div>
  <div style="padding: 32px;">
    <p style="font-size: 15px; color: #334155; margin-top: 0;">Hello {{visitorName}},</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.6;">
      The status of your photography commission inquiry (<strong>Ref: {{referenceNumber}}</strong>) has been updated:
    </p>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0;">
      <span style="font-size: 12px; color: #166534; text-transform: uppercase; font-weight: 600; display: block; margin-bottom: 2px;">New Status</span>
      <span style="font-size: 18px; font-weight: 700; color: #15803d; letter-spacing: 0.05em;">{{enquiryStatus}}</span>
    </div>
    <p style="font-size: 14px; color: #475569; line-height: 1.6;">
      If you have any questions or require additional details regarding your booking, please feel free to reach out to our studio at <a href="mailto:{{publicEmail}}" style="color: #2563eb;">{{publicEmail}}</a>.
    </p>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center; color: #94a3b8; font-size: 12px;">
    {{siteName}} · Ref: {{referenceNumber}}
  </div>
</div>`.trim(),
    body_text: "Hello {{visitorName}}, the status of your inquiry {{referenceNumber}} has changed to: {{enquiryStatus}}.",
    cta_text: "Contact Studio",
    cta_url: "{{siteUrl}}/contact",
    footer_text: "Studio update from {{siteName}}.",
    variables: [
      "referenceNumber",
      "visitorName",
      "enquiryStatus",
      "siteName",
      "publicEmail",
      "siteUrl",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tpl-4",
    template_key: "test_notification",
    name: "System Diagnostic & Test Dispatch",
    description: "Used to test SMTP connectivity and HTML template rendering from the admin console.",
    subject: "🧪 Test Notification from {{siteName}}",
    headline: "System Test Dispatch",
    body_html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background: #0f172a; padding: 24px 32px; text-align: center;">
    <h1 style="color: #f8fafc; font-size: 20px; font-weight: 600; margin: 0;">{{siteName}} System Test</h1>
  </div>
  <div style="padding: 32px; text-align: center;">
    <div style="display: inline-block; background: #dcfce7; color: #15803d; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 16px;">
      ✓ SMTP Dispatch Pipeline Operational
    </div>
    <p style="font-size: 15px; color: #334155; line-height: 1.6;">
      This is a verified test email sent from the <strong>{{siteName}} Notifications Engine (VS-13)</strong>. All variable substitution, HTML escaping, and transport channels are functional.
    </p>
  </div>
  <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center; color: #94a3b8; font-size: 12px;">
    Sent at ${new Date().toISOString()} · {{siteName}}
  </div>
</div>`.trim(),
    body_text: "System Test Notification from {{siteName}}. The notifications pipeline is functional.",
    cta_text: "Go to Dashboard",
    cta_url: "{{adminUrl}}",
    footer_text: "Test notification dispatch.",
    variables: ["siteName", "adminUrl"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let inMemoryLogs: NotificationLog[] = [
  {
    id: "log-101",
    recipient_email: "studio@alexmercer.com",
    recipient_name: "Alex Mercer Studio",
    notification_type: "ADMIN_ALERT",
    template_key: "admin_enquiry_alert",
    subject: "⚡ New Commission Inquiry: Maison Saint-Honoré (editorial) [ENQ-2026-000102]",
    body_preview: "New inquiry from Maison Saint-Honoré (press@sainthonore-paris.fr). Reference: ENQ-2026-000102...",
    channel: "EMAIL",
    status: "SENT",
    enquiry_id: "enq-002",
    enquiry_reference: "ENQ-2026-000102",
    retry_count: 0,
    max_retries: 3,
    sent_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "log-102",
    recipient_email: "press@sainthonore-paris.fr",
    recipient_name: "Maison Saint-Honoré",
    notification_type: "VISITOR_CONFIRMATION",
    template_key: "visitor_enquiry_confirmation",
    subject: "✨ Thank you for inquiring with Alex Mercer Photography [ENQ-2026-000102]",
    body_preview: "Dear Maison Saint-Honoré, thank you for reaching out regarding an editorial commission...",
    channel: "EMAIL",
    status: "SENT",
    enquiry_id: "enq-002",
    enquiry_reference: "ENQ-2026-000102",
    retry_count: 0,
    max_retries: 3,
    sent_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "log-103",
    recipient_email: "eleanor.vance@atelier-vance.com",
    recipient_name: "Eleanor & Christian Vance",
    notification_type: "VISITOR_CONFIRMATION",
    template_key: "visitor_enquiry_confirmation",
    subject: "✨ Thank you for inquiring with Alex Mercer Photography [ENQ-2026-000101]",
    body_preview: "Dear Eleanor & Christian Vance, thank you for reaching out regarding a wedding commission...",
    channel: "EMAIL",
    status: "SENT",
    enquiry_id: "enq-001",
    enquiry_reference: "ENQ-2026-000101",
    retry_count: 0,
    max_retries: 3,
    sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let inMemoryInAppNotifications: InAppNotification[] = [
  {
    id: "inapp-101",
    title: "New Commission Inquiry",
    message: "Maison Saint-Honoré submitted an editorial inquiry (ENQ-2026-000102)",
    type: "ENQUIRY_NEW",
    priority: "URGENT",
    reference_id: "enq-002",
    link_url: "/admin/messages?ref=ENQ-2026-000102",
    is_read: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "inapp-102",
    title: "Inquiry In Discussion",
    message: "Eleanor & Christian Vance (ENQ-2026-000101) status updated to IN_DISCUSSION",
    type: "ENQUIRY_STATUS",
    priority: "HIGH",
    reference_id: "enq-001",
    link_url: "/admin/messages?ref=ENQ-2026-000101",
    is_read: true,
    read_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "inapp-103",
    title: "Booking Confirmed",
    message: "Commission ENQ-2026-000103 for Julian & Hiroshi Sterling confirmed",
    type: "ENQUIRY_STATUS",
    priority: "NORMAL",
    reference_id: "enq-003",
    link_url: "/admin/messages?ref=ENQ-2026-000103",
    is_read: true,
    read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class NotificationRepository {
  // Settings
  async getSettings(): Promise<NotificationSettings> {
    try {
      const res = await query<NotificationSettings>(
        `SELECT * FROM notification_settings ORDER BY id ASC LIMIT 1;`
      );
      if (res.rows.length > 0) {
        return res.rows[0];
      }
    } catch (e) {
      // Fallback
    }
    return inMemorySettings;
  }

  async updateSettings(dto: UpdateNotificationSettingsDTO): Promise<NotificationSettings> {
    const updated: NotificationSettings = {
      ...inMemorySettings,
      ...dto,
      smtp_configured: Boolean(dto.smtp_host || inMemorySettings.smtp_host),
      updated_at: new Date().toISOString(),
    };
    inMemorySettings = updated;

    try {
      await query(
        `INSERT INTO notification_settings (
          id, admin_notification_email, enable_email_notifications,
          enable_inquiry_confirmation, enable_in_app_notifications,
          enable_status_change_notifications, sender_name, sender_email,
          reply_to_email, smtp_host, smtp_port, smtp_user, smtp_pass,
          smtp_secure, smtp_configured, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) ON CONFLICT (id) DO UPDATE SET
          admin_notification_email = EXCLUDED.admin_notification_email,
          enable_email_notifications = EXCLUDED.enable_email_notifications,
          enable_inquiry_confirmation = EXCLUDED.enable_inquiry_confirmation,
          enable_in_app_notifications = EXCLUDED.enable_in_app_notifications,
          enable_status_change_notifications = EXCLUDED.enable_status_change_notifications,
          sender_name = EXCLUDED.sender_name,
          sender_email = EXCLUDED.sender_email,
          reply_to_email = EXCLUDED.reply_to_email,
          smtp_host = EXCLUDED.smtp_host,
          smtp_port = EXCLUDED.smtp_port,
          smtp_user = EXCLUDED.smtp_user,
          smtp_pass = EXCLUDED.smtp_pass,
          smtp_secure = EXCLUDED.smtp_secure,
          smtp_configured = EXCLUDED.smtp_configured,
          updated_at = EXCLUDED.updated_at;`,
        [
          updated.id,
          updated.admin_notification_email,
          updated.enable_email_notifications,
          updated.enable_inquiry_confirmation,
          updated.enable_in_app_notifications,
          updated.enable_status_change_notifications,
          updated.sender_name,
          updated.sender_email,
          updated.reply_to_email,
          updated.smtp_host || null,
          updated.smtp_port || null,
          updated.smtp_user || null,
          updated.smtp_pass || null,
          updated.smtp_secure,
          updated.smtp_configured,
          updated.updated_at,
        ]
      );
    } catch (e) {
      // Postgres fallback
    }

    return inMemorySettings;
  }

  // Templates
  async getAllTemplates(): Promise<EmailTemplate[]> {
    try {
      const res = await query<EmailTemplate>(
        `SELECT * FROM email_templates ORDER BY created_at ASC;`
      );
      if (res.rows.length > 0) {
        return res.rows;
      }
    } catch (e) {
      // Fallback
    }
    return inMemoryTemplates;
  }

  async getTemplateByKey(key: string): Promise<EmailTemplate | null> {
    try {
      const res = await query<EmailTemplate>(
        `SELECT * FROM email_templates WHERE template_key = $1 LIMIT 1;`,
        [key]
      );
      if (res.rows.length > 0) {
        return res.rows[0];
      }
    } catch (e) {
      // Fallback
    }
    return inMemoryTemplates.find((t) => t.template_key === key) || null;
  }

  async updateTemplate(
    templateKey: string,
    dto: UpdateEmailTemplateDTO
  ): Promise<EmailTemplate | null> {
    const idx = inMemoryTemplates.findIndex((t) => t.template_key === templateKey);
    if (idx === -1) return null;

    inMemoryTemplates[idx] = {
      ...inMemoryTemplates[idx],
      ...dto,
      updated_at: new Date().toISOString(),
    };

    try {
      await query(
        `UPDATE email_templates SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          subject = COALESCE($3, subject),
          headline = COALESCE($4, headline),
          body_html = COALESCE($5, body_html),
          body_text = COALESCE($6, body_text),
          cta_text = COALESCE($7, cta_text),
          cta_url = COALESCE($8, cta_url),
          footer_text = COALESCE($9, footer_text),
          is_active = COALESCE($10, is_active),
          updated_at = NOW()
        WHERE template_key = $11;`,
        [
          dto.name || null,
          dto.description || null,
          dto.subject || null,
          dto.headline || null,
          dto.body_html || null,
          dto.body_text || null,
          dto.cta_text || null,
          dto.cta_url || null,
          dto.footer_text || null,
          dto.is_active !== undefined ? dto.is_active : null,
          templateKey,
        ]
      );
    } catch (e) {
      // Fallback
    }

    return inMemoryTemplates[idx];
  }

  // Delivery Logs
  async getLogs(filters?: {
    status?: string;
    channel?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: NotificationLog[]; total: number }> {
    let result = [...inMemoryLogs];

    if (filters?.status) {
      result = result.filter((l) => l.status.toUpperCase() === filters.status?.toUpperCase());
    }
    if (filters?.channel) {
      result = result.filter((l) => l.channel.toUpperCase() === filters.channel?.toUpperCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.recipient_email.toLowerCase().includes(q) ||
          (l.recipient_name && l.recipient_name.toLowerCase().includes(q)) ||
          l.subject.toLowerCase().includes(q) ||
          (l.enquiry_reference && l.enquiry_reference.toLowerCase().includes(q))
      );
    }

    // Sort descending by created_at
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = result.length;
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    const logs = result.slice(offset, offset + limit);

    return { logs, total };
  }

  async getLogById(id: string): Promise<NotificationLog | null> {
    return inMemoryLogs.find((l) => l.id === id) || null;
  }

  async createLog(
    logData: Omit<NotificationLog, "id" | "created_at" | "updated_at">
  ): Promise<NotificationLog> {
    const newLog: NotificationLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryLogs.unshift(newLog);

    try {
      await query(
        `INSERT INTO notification_logs (
          id, recipient_email, recipient_name, notification_type, template_key,
          subject, body_preview, channel, status, enquiry_id, enquiry_reference,
          error_message, retry_count, max_retries, sent_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);`,
        [
          newLog.id,
          newLog.recipient_email,
          newLog.recipient_name || null,
          newLog.notification_type,
          newLog.template_key || null,
          newLog.subject,
          newLog.body_preview,
          newLog.channel,
          newLog.status,
          newLog.enquiry_id || null,
          newLog.enquiry_reference || null,
          newLog.error_message || null,
          newLog.retry_count,
          newLog.max_retries,
          newLog.sent_at || null,
          newLog.created_at,
          newLog.updated_at,
        ]
      );
    } catch (e) {
      // Fallback
    }

    return newLog;
  }

  async updateLogStatus(
    id: string,
    status: "SENT" | "FAILED" | "PENDING",
    error_message?: string,
    retryIncrement = false
  ): Promise<NotificationLog | null> {
    const log = inMemoryLogs.find((l) => l.id === id);
    if (!log) return null;

    log.status = status;
    if (error_message !== undefined) log.error_message = error_message;
    if (status === "SENT") log.sent_at = new Date().toISOString();
    if (retryIncrement) log.retry_count += 1;
    log.updated_at = new Date().toISOString();

    try {
      await query(
        `UPDATE notification_logs SET
          status = $1,
          error_message = $2,
          sent_at = CASE WHEN $1 = 'SENT' THEN NOW() ELSE sent_at END,
          retry_count = CASE WHEN $3 = true THEN retry_count + 1 ELSE retry_count END,
          updated_at = NOW()
        WHERE id = $4;`,
        [status, error_message || null, retryIncrement, id]
      );
    } catch (e) {
      // Fallback
    }

    return log;
  }

  // In-App Notifications
  async getInAppNotifications(limit = 20): Promise<{ items: InAppNotification[]; unreadCount: number }> {
    const sorted = [...inMemoryInAppNotifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const unreadCount = inMemoryInAppNotifications.filter((n) => !n.is_read).length;
    return {
      items: sorted.slice(0, limit),
      unreadCount,
    };
  }

  async createInAppNotification(
    data: Omit<InAppNotification, "id" | "is_read" | "read_at" | "created_at">
  ): Promise<InAppNotification> {
    const item: InAppNotification = {
      ...data,
      id: `inapp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    inMemoryInAppNotifications.unshift(item);

    try {
      await query(
        `INSERT INTO in_app_notifications (
          id, title, message, type, priority, reference_id, link_url, is_read, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8);`,
        [
          item.id,
          item.title,
          item.message,
          item.type,
          item.priority,
          item.reference_id || null,
          item.link_url || null,
          item.created_at,
        ]
      );
    } catch (e) {
      // Fallback
    }

    return item;
  }

  async markInAppAsRead(ids?: string[], markAll = false): Promise<number> {
    let count = 0;
    const now = new Date().toISOString();
    inMemoryInAppNotifications.forEach((n) => {
      if (markAll || (ids && ids.includes(n.id))) {
        if (!n.is_read) {
          n.is_read = true;
          n.read_at = now;
          count++;
        }
      }
    });

    try {
      if (markAll) {
        await query(`UPDATE in_app_notifications SET is_read = true, read_at = NOW() WHERE is_read = false;`);
      } else if (ids && ids.length > 0) {
        await query(
          `UPDATE in_app_notifications SET is_read = true, read_at = NOW() WHERE id = ANY($1::text[]);`,
          [ids]
        );
      }
    } catch (e) {
      // Fallback
    }

    return count;
  }

  async clearReadInApp(): Promise<number> {
    const beforeCount = inMemoryInAppNotifications.length;
    inMemoryInAppNotifications = inMemoryInAppNotifications.filter((n) => !n.is_read);
    const deleted = beforeCount - inMemoryInAppNotifications.length;

    try {
      await query(`DELETE FROM in_app_notifications WHERE is_read = true;`);
    } catch (e) {
      // Fallback
    }

    return deleted;
  }

  async getStats(): Promise<NotificationStats> {
    const total_logs = inMemoryLogs.length;
    const sent_logs = inMemoryLogs.filter((l) => l.status === "SENT").length;
    const failed_logs = inMemoryLogs.filter((l) => l.status === "FAILED").length;
    const pending_logs = inMemoryLogs.filter((l) => l.status === "PENDING").length;
    const unread_in_app = inMemoryInAppNotifications.filter((n) => !n.is_read).length;
    const total_in_app = inMemoryInAppNotifications.length;
    const active_templates = inMemoryTemplates.filter((t) => t.is_active).length;

    return {
      total_logs,
      sent_logs,
      failed_logs,
      pending_logs,
      unread_in_app,
      total_in_app,
      active_templates,
    };
  }
}

export const notificationRepository = new NotificationRepository();
