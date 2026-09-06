import { DashboardRepository } from "./dashboard.repository.js";
import { ActivityLogItem, DashboardStats, DashboardSummary } from "./dashboard.types.js";
import { checkDatabaseHealth } from "../../database/db.js";
import { env } from "../../config/env.js";

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getStats(): Promise<DashboardStats> {
    return this.dashboardRepository.getStats();
  }

  async getRecentActivity(limit = 8): Promise<ActivityLogItem[]> {
    return this.dashboardRepository.getRecentActivity(limit);
  }

  async getSummary(): Promise<DashboardSummary> {
    const [stats, recentActivity, isDbConnected] = await Promise.all([
      this.dashboardRepository.getStats(),
      this.dashboardRepository.getRecentActivity(6),
      checkDatabaseHealth(),
    ]);

    const totalItems = stats.photos.total + stats.projects.total;
    const publishedItems = stats.photos.published + stats.projects.published;
    const publishedRatio = totalItems > 0 ? Math.round((publishedItems / totalItems) * 100) : 100;

    return {
      stats,
      recentActivity,
      systemStatus: {
        database: isDbConnected ? "connected" : "ready (dev fallback)",
        serverUptime: process.uptime(),
        environment: env.NODE_ENV,
        publishedRatio,
      },
    };
  }

  async recordActivity(
    action: string,
    entity_type: string,
    description: string,
    admin_id?: string,
    entity_id?: string
  ): Promise<void> {
    await this.dashboardRepository.logActivity({
      action,
      entity_type,
      description,
      admin_id,
      entity_id,
    });
  }

  async globalSearch(searchTerm: string) {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) {
      return {
        query: "",
        total: 0,
        results: { projects: [], categories: [], media: [], enquiries: [] },
      };
    }

    const [projectsRes, categoriesRes, mediaRes, enquiriesRes] = await Promise.all([
      this.dashboardRepository.searchProjects(q),
      this.dashboardRepository.searchCategories(q),
      this.dashboardRepository.searchMedia(q),
      this.dashboardRepository.searchEnquiries(q),
    ]);

    const total =
      projectsRes.length + categoriesRes.length + mediaRes.length + enquiriesRes.length;

    return {
      query: searchTerm,
      total,
      results: {
        projects: projectsRes,
        categories: categoriesRes,
        media: mediaRes,
        enquiries: enquiriesRes,
      },
    };
  }
}
