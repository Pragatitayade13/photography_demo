import { Request, Response } from "express";
import { notificationRepository } from "./notifications.repository.js";
import { notificationService } from "./notifications.service.js";
import {
  updateNotificationSettingsSchema,
  updateEmailTemplateSchema,
  sendTestEmailSchema,
  templatePreviewSchema,
  markNotificationsReadSchema,
} from "./notifications.schema.js";

export class NotificationController {
  // Settings
  async getSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await notificationRepository.getSettings();
      // Mask password for security
      const safeSettings = {
        ...settings,
        smtp_pass: settings.smtp_pass ? "••••••••" : "",
      };
      res.status(200).json({ success: true, data: safeSettings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to fetch settings" });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const validation = updateNotificationSettingsSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.format(),
        });
        return;
      }

      const updated = await notificationRepository.updateSettings(validation.data);
      const safeSettings = {
        ...updated,
        smtp_pass: updated.smtp_pass ? "••••••••" : "",
      };
      res.status(200).json({
        success: true,
        message: "Notification settings updated successfully",
        data: safeSettings,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to update settings" });
    }
  }

  // Templates
  async getTemplates(_req: Request, res: Response): Promise<void> {
    try {
      const templates = await notificationRepository.getAllTemplates();
      res.status(200).json({ success: true, data: templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to fetch templates" });
    }
  }

  async getTemplateByKey(req: Request, res: Response): Promise<void> {
    try {
      const { templateKey } = req.params;
      const template = await notificationRepository.getTemplateByKey(templateKey);
      if (!template) {
        res.status(404).json({ success: false, message: "Template not found" });
        return;
      }
      res.status(200).json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to fetch template" });
    }
  }

  async updateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { templateKey } = req.params;
      const validation = updateEmailTemplateSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.format(),
        });
        return;
      }

      const updated = await notificationRepository.updateTemplate(templateKey, validation.data);
      if (!updated) {
        res.status(404).json({ success: false, message: "Template not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Email template updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to update template" });
    }
  }

  async previewTemplate(req: Request, res: Response): Promise<void> {
    try {
      const validation = templatePreviewSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.format(),
        });
        return;
      }

      const preview = await notificationService.previewTemplate(
        validation.data.template_key,
        validation.data.sample_variables
      );
      res.status(200).json({ success: true, data: preview });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error?.message || "Preview rendering failed" });
    }
  }

  // Delivery Logs
  async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const { status, channel, search, limit, offset } = req.query;
      const result = await notificationRepository.getLogs({
        status: status as string,
        channel: channel as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: {
          total: result.total,
          limit: limit ? parseInt(limit as string, 10) : 50,
          offset: offset ? parseInt(offset as string, 10) : 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to fetch logs" });
    }
  }

  async retryLog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const retried = await notificationService.retryLog(id);
      res.status(200).json({
        success: true,
        message: "Notification retry dispatched",
        data: retried,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error?.message || "Retry dispatch failed" });
    }
  }

  // In-App Notifications
  async getInAppNotifications(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const data = await notificationRepository.getInAppNotifications(limit);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || "Failed to fetch in-app notifications",
      });
    }
  }

  async markInAppRead(req: Request, res: Response): Promise<void> {
    try {
      const validation = markNotificationsReadSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.format(),
        });
        return;
      }

      const count = await notificationRepository.markInAppAsRead(
        validation.data.notification_ids,
        validation.data.mark_all
      );
      res.status(200).json({
        success: true,
        message: `${count} notification(s) marked as read`,
        data: { updatedCount: count },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || "Failed to mark notifications as read",
      });
    }
  }

  async clearReadInApp(_req: Request, res: Response): Promise<void> {
    try {
      const deleted = await notificationRepository.clearReadInApp();
      res.status(200).json({
        success: true,
        message: `${deleted} read notification(s) cleared`,
        data: { clearedCount: deleted },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message || "Failed to clear notifications",
      });
    }
  }

  // Test Email
  async sendTestEmail(req: Request, res: Response): Promise<void> {
    try {
      const validation = sendTestEmailSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.format(),
        });
        return;
      }

      const log = await notificationService.sendTestEmail(validation.data);
      res.status(200).json({
        success: true,
        message: `Test email dispatched to ${validation.data.recipient_email}`,
        data: log,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error?.message || "Failed to send test email" });
    }
  }

  // Stats
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await notificationRepository.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || "Failed to fetch stats" });
    }
  }
}

export const notificationController = new NotificationController();
