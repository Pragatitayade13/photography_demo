import { notificationRepository } from "./notifications.repository.js";
import { SettingsRepository } from "../settings/settings.repository.js";
import {
  NotificationLog,
  SendTestEmailDTO,
  TemplatePreviewResponse,
} from "./notifications.types.js";
import { EnquiryItem } from "../contact/contact.types.js";

const settingsRepo = new SettingsRepository();

// HTML Entity escaper for safe variable interpolation
function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class NotificationService {
  /**
   * Helper to substitute {{variableKey}} in strings
   */
  interpolate(text: string, vars: Record<string, string>, escapeValues = true): string {
    if (!text) return "";
    return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
      const val = vars[key] !== undefined ? vars[key] : "";
      return escapeValues ? escapeHtml(val) : val;
    });
  }

  /**
   * Extract global branding placeholders
   */
  async getGlobalVariables(): Promise<Record<string, string>> {
    const publicConfig = await settingsRepo.getPublicSiteConfig();
    const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const adminUrl = `${siteUrl}/admin`;

    return {
      siteName: publicConfig.site?.name || "Alex Mercer Photography",
      photographerName: publicConfig.site?.photographerName || "Alex Mercer",
      publicEmail: publicConfig.contact?.email || "studio@alexmercer.com",
      publicPhone: publicConfig.contact?.phone || "+1 (555) 019-2834",
      siteUrl: siteUrl,
      adminUrl: adminUrl,
    };
  }

  /**
   * Render a template with inquiry and global variables
   */
  async renderTemplate(
    templateKey: string,
    customVars: Record<string, string> = {}
  ): Promise<{
    subject: string;
    bodyHtml: string;
    bodyText: string;
    substitutedVars: Record<string, string>;
  } | null> {
    const template = await notificationRepository.getTemplateByKey(templateKey);
    if (!template) return null;

    const globals = await this.getGlobalVariables();
    const mergedVars: Record<string, string> = {
      ...globals,
      ...customVars,
    };

    const subject = this.interpolate(template.subject, mergedVars, false);
    const bodyHtml = this.interpolate(template.body_html, mergedVars, false);
    const bodyText = this.interpolate(template.body_text || "", mergedVars, false);

    return {
      subject,
      bodyHtml,
      bodyText,
      substitutedVars: mergedVars,
    };
  }

  /**
   * Dispatches email via configured transport / simulation worker
   */
  async dispatchEmail(params: {
    recipientEmail: string;
    recipientName?: string;
    notificationType: string;
    templateKey?: string;
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    enquiryId?: string;
    enquiryReference?: string;
  }): Promise<NotificationLog> {
    const settings = await notificationRepository.getSettings();

    // Create pending log first
    const log = await notificationRepository.createLog({
      recipient_email: params.recipientEmail,
      recipient_name: params.recipientName,
      notification_type: params.notificationType,
      template_key: params.templateKey,
      subject: params.subject,
      body_preview: (params.bodyText || params.bodyHtml)
        .replace(/<[^>]*>?/gm, "")
        .slice(0, 140),
      channel: "EMAIL",
      status: "PENDING",
      enquiry_id: params.enquiryId,
      enquiry_reference: params.enquiryReference,
      retry_count: 0,
      max_retries: 3,
    });

    try {
      // Simulate real delivery or SMTP dispatch
      // In production / SMTP configuration:
      // Can connect to nodemailer / Resend / SendGrid / Postmark
      console.log(`[NOTIFICATIONS] 📧 Dispatching Email to: ${params.recipientEmail}`);
      console.log(`[NOTIFICATIONS] 📧 Subject: "${params.subject}"`);
      console.log(`[NOTIFICATIONS] 📧 Sender: "${settings.sender_name} <${settings.sender_email}>"`);

      // Mock transport simulation (Success rate 100% unless marked as invalid)
      if (params.recipientEmail.includes("fail_test")) {
        throw new Error("Simulated delivery failure: Mailbox unreachable or rate limit exceeded.");
      }

      // Mark log as SENT
      await notificationRepository.updateLogStatus(log.id, "SENT");
      log.status = "SENT";
      log.sent_at = new Date().toISOString();
      return log;
    } catch (err: any) {
      console.error(`[NOTIFICATIONS] ❌ Email dispatch failed for ${log.id}:`, err?.message);
      await notificationRepository.updateLogStatus(
        log.id,
        "FAILED",
        err?.message || "Delivery failed"
      );
      log.status = "FAILED";
      log.error_message = err?.message || "Delivery failed";
      return log;
    }
  }

  /**
   * Handle Background Processing when a new inquiry is submitted
   */
  async handleNewEnquiry(enquiry: EnquiryItem): Promise<void> {
    try {
      const settings = await notificationRepository.getSettings();

      // 1. In-App Notification (Admin Alert)
      if (settings.enable_in_app_notifications) {
        await notificationRepository.createInAppNotification({
          title: "New Commission Inquiry",
          message: `${enquiry.name} submitted a ${enquiry.enquiry_type} inquiry (${enquiry.reference_number})`,
          type: "ENQUIRY_NEW",
          priority: enquiry.priority || "HIGH",
          reference_id: enquiry.id,
          link_url: `/admin/messages?ref=${enquiry.reference_number}`,
        });
      }

      const enquiryVars: Record<string, string> = {
        referenceNumber: enquiry.reference_number,
        visitorName: enquiry.name,
        visitorEmail: enquiry.email,
        visitorPhone: enquiry.phone || "Not specified",
        enquiryType: enquiry.enquiry_type || "General Inquiry",
        eventDate: enquiry.event_date || "To be determined",
        location: enquiry.location || "Worldwide / Undisclosed",
        budgetRange: enquiry.budget_range || "Flexible / Not specified",
        message: enquiry.message || "(No message provided)",
        enquiryStatus: enquiry.status,
      };

      // 2. Email to Photographer/Admin
      if (settings.enable_email_notifications && settings.admin_notification_email) {
        const rendered = await this.renderTemplate("admin_enquiry_alert", enquiryVars);
        if (rendered) {
          await this.dispatchEmail({
            recipientEmail: settings.admin_notification_email,
            recipientName: settings.sender_name || "Alex Mercer Studio",
            notificationType: "ADMIN_ALERT",
            templateKey: "admin_enquiry_alert",
            subject: rendered.subject,
            bodyHtml: rendered.bodyHtml,
            bodyText: rendered.bodyText,
            enquiryId: enquiry.id,
            enquiryReference: enquiry.reference_number,
          });
        }
      }

      // 3. Visitor Confirmation Email
      if (settings.enable_inquiry_confirmation && enquiry.email) {
        const rendered = await this.renderTemplate("visitor_enquiry_confirmation", enquiryVars);
        if (rendered) {
          await this.dispatchEmail({
            recipientEmail: enquiry.email,
            recipientName: enquiry.name,
            notificationType: "VISITOR_CONFIRMATION",
            templateKey: "visitor_enquiry_confirmation",
            subject: rendered.subject,
            bodyHtml: rendered.bodyHtml,
            bodyText: rendered.bodyText,
            enquiryId: enquiry.id,
            enquiryReference: enquiry.reference_number,
          });
        }
      }
    } catch (error) {
      console.error("[NOTIFICATIONS] Error in handleNewEnquiry background worker:", error);
    }
  }

  /**
   * Handle Background Processing when an inquiry status changes
   */
  async handleEnquiryStatusChanged(
    enquiry: EnquiryItem,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    try {
      const settings = await notificationRepository.getSettings();

      // In-App Notification
      if (settings.enable_in_app_notifications) {
        await notificationRepository.createInAppNotification({
          title: "Inquiry Status Updated",
          message: `Inquiry ${enquiry.reference_number} (${enquiry.name}) changed from ${oldStatus} to ${newStatus}`,
          type: "ENQUIRY_STATUS",
          priority: "NORMAL",
          reference_id: enquiry.id,
          link_url: `/admin/messages?ref=${enquiry.reference_number}`,
        });
      }

      // Visitor Notification on Status Change
      if (settings.enable_status_change_notifications && enquiry.email) {
        const enquiryVars: Record<string, string> = {
          referenceNumber: enquiry.reference_number,
          visitorName: enquiry.name,
          enquiryType: enquiry.enquiry_type,
          enquiryStatus: newStatus,
          location: enquiry.location || "Studio Commission",
        };

        const rendered = await this.renderTemplate("enquiry_status_updated", enquiryVars);
        if (rendered) {
          await this.dispatchEmail({
            recipientEmail: enquiry.email,
            recipientName: enquiry.name,
            notificationType: "STATUS_UPDATE",
            templateKey: "enquiry_status_updated",
            subject: rendered.subject,
            bodyHtml: rendered.bodyHtml,
            bodyText: rendered.bodyText,
            enquiryId: enquiry.id,
            enquiryReference: enquiry.reference_number,
          });
        }
      }
    } catch (error) {
      console.error("[NOTIFICATIONS] Error in handleEnquiryStatusChanged:", error);
    }
  }

  /**
   * Test Email sender
   */
  async sendTestEmail(dto: SendTestEmailDTO): Promise<NotificationLog> {
    const templateKey = dto.template_key || "test_notification";
    const rendered = await this.renderTemplate(templateKey, {
      siteName: "Alex Mercer Studio",
      adminUrl: (process.env.CLIENT_URL || "http://localhost:5173") + "/admin",
    });

    const subject = dto.custom_subject || rendered?.subject || "System Test Notification";
    const bodyHtml = dto.custom_body
      ? `<div style="font-family: sans-serif; padding: 20px;">${escapeHtml(dto.custom_body)}</div>`
      : rendered?.bodyHtml || `<p>System Test</p>`;

    return this.dispatchEmail({
      recipientEmail: dto.recipient_email,
      recipientName: "Test Recipient",
      notificationType: "TEST_DISPATCH",
      templateKey: templateKey,
      subject: subject,
      bodyHtml: bodyHtml,
      bodyText: dto.custom_body || rendered?.bodyText || subject,
    });
  }

  /**
   * Retry failed log
   */
  async retryLog(logId: string): Promise<NotificationLog> {
    const log = await notificationRepository.getLogById(logId);
    if (!log) {
      throw new Error("Notification log not found");
    }

    // Attempt retry
    try {
      if (log.recipient_email.includes("fail_test")) {
        throw new Error("Delivery destination permanently unreachable.");
      }

      await notificationRepository.updateLogStatus(logId, "SENT", undefined, true);
      log.status = "SENT";
      log.sent_at = new Date().toISOString();
      log.retry_count += 1;
      return log;
    } catch (err: any) {
      await notificationRepository.updateLogStatus(logId, "FAILED", err?.message, true);
      log.status = "FAILED";
      log.error_message = err?.message;
      log.retry_count += 1;
      return log;
    }
  }

  /**
   * Template preview with custom sample variables
   */
  async previewTemplate(
    templateKey: string,
    sampleVars: Record<string, string> = {}
  ): Promise<TemplatePreviewResponse> {
    const defaultSampleVars: Record<string, string> = {
      referenceNumber: "AM-20260905-SAMPLE",
      visitorName: "Elena Rostova",
      visitorEmail: "elena.rostova@example.com",
      visitorPhone: "+1 (555) 987-6543",
      enquiryType: "Editorial & Monograph",
      eventDate: "October 14, 2026",
      location: "Villa d'Este, Lake Como, Italy",
      budgetRange: "₹2,50,000 - ₹5,00,000",
      message:
        "We are looking for a fine-art editorial photographer for a multi-day visual campaign.",
      enquiryStatus: "IN_DISCUSSION",
      ...sampleVars,
    };

    const rendered = await this.renderTemplate(templateKey, defaultSampleVars);
    if (!rendered) {
      throw new Error(`Template '${templateKey}' not found`);
    }

    return {
      template_key: templateKey,
      subject: rendered.subject,
      html_preview: rendered.bodyHtml,
      text_preview: rendered.bodyText,
      substituted_variables: rendered.substitutedVars,
    };
  }
}

export const notificationService = new NotificationService();
