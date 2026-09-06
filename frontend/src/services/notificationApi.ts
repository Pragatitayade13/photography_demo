import { apiClient } from "./apiClient";
import {
  NotificationSettings,
  EmailTemplate,
  NotificationLog,
  InAppNotification,
  NotificationStats,
  UpdateNotificationSettingsDTO,
  UpdateEmailTemplateDTO,
  SendTestEmailDTO,
  TemplatePreviewResponse,
} from "../types/notifications";

export const notificationApi = {
  // Stats
  async getStats(): Promise<NotificationStats> {
    const res = await apiClient.get("/notifications/stats");
    return res.data.data;
  },

  // Settings
  async getSettings(): Promise<NotificationSettings> {
    const res = await apiClient.get("/notifications/settings");
    return res.data.data;
  },

  async updateSettings(dto: UpdateNotificationSettingsDTO): Promise<NotificationSettings> {
    const res = await apiClient.put("/notifications/settings", dto);
    return res.data.data;
  },

  // Templates
  async getTemplates(): Promise<EmailTemplate[]> {
    const res = await apiClient.get("/notifications/templates");
    return res.data.data;
  },

  async getTemplateByKey(templateKey: string): Promise<EmailTemplate> {
    const res = await apiClient.get(`/notifications/templates/${templateKey}`);
    return res.data.data;
  },

  async updateTemplate(
    templateKey: string,
    dto: UpdateEmailTemplateDTO
  ): Promise<EmailTemplate> {
    const res = await apiClient.put(`/notifications/templates/${templateKey}`, dto);
    return res.data.data;
  },

  async previewTemplate(
    templateKey: string,
    sampleVariables?: Record<string, string>
  ): Promise<TemplatePreviewResponse> {
    const res = await apiClient.post("/notifications/templates/preview", {
      template_key: templateKey,
      sample_variables: sampleVariables,
    });
    return res.data.data;
  },

  // Logs
  async getLogs(params?: {
    status?: string;
    channel?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: NotificationLog[]; total: number }> {
    const res = await apiClient.get("/notifications/logs", { params });
    return {
      logs: res.data.data,
      total: res.data.pagination?.total || res.data.data.length,
    };
  },

  async retryLog(logId: string): Promise<NotificationLog> {
    const res = await apiClient.post(`/notifications/logs/${logId}/retry`);
    return res.data.data;
  },

  // In-App Notifications
  async getInAppNotifications(limit = 20): Promise<{ items: InAppNotification[]; unreadCount: number }> {
    const res = await apiClient.get("/notifications/in-app", { params: { limit } });
    return res.data.data;
  },

  async markInAppRead(notificationIds?: string[], markAll = false): Promise<{ updatedCount: number }> {
    const res = await apiClient.post("/notifications/in-app/read", {
      notification_ids: notificationIds,
      mark_all: markAll,
    });
    return res.data.data;
  },

  async clearReadInApp(): Promise<{ clearedCount: number }> {
    const res = await apiClient.delete("/notifications/in-app/read");
    return res.data.data;
  },

  // Test Email
  async sendTestEmail(dto: SendTestEmailDTO): Promise<NotificationLog> {
    const res = await apiClient.post("/notifications/test-email", dto);
    return res.data.data;
  },
};
