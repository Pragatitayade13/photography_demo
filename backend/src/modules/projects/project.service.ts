import crypto from "crypto";
import { ProjectRepository } from "./project.repository.js";
import {
  CreateProjectDTO,
  ProjectEntity,
  ProjectFilterOptions,
  ProjectWithDetails,
  UpdateProjectDTO,
  ProjectSearchResponse,
  ProjectComparison,
  CreateComparisonDTO,
  UpdateComparisonDTO,
} from "./project.types.js";
import { DashboardService } from "../dashboard/dashboard.service.js";

export class ProjectService {
  private projectRepository: ProjectRepository;
  private dashboardService: DashboardService;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.dashboardService = new DashboardService();
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  async getAllProjects(options?: ProjectFilterOptions): Promise<ProjectWithDetails[]> {
    return this.projectRepository.findAll(options);
  }

  async searchProjects(options: ProjectFilterOptions): Promise<ProjectSearchResponse> {
    return this.projectRepository.searchProjects(options);
  }

  async getFeaturedProjects(): Promise<ProjectWithDetails[]> {
    return this.projectRepository.findFeaturedProjects();
  }

  async updateFeaturedOrder(
    items: Array<{ id: string; featured_order: number; is_featured?: boolean }>,
    adminId?: string
  ): Promise<void> {
    await this.projectRepository.updateFeaturedOrder(items);
    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Re-ordered ${items.length} featured project(s)`,
      adminId
    );
  }

  async getRelatedProjects(projectId: string, limit = 3): Promise<ProjectEntity[]> {
    return this.projectRepository.getRelatedProjects(projectId, limit);
  }

  async setRelatedProjects(
    projectId: string,
    relatedProjectIds: string[],
    adminId?: string
  ): Promise<void> {
    await this.projectRepository.setRelatedProjects(projectId, relatedProjectIds);
    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Updated manual related projects for ${projectId}`,
      adminId,
      projectId
    );
  }

  async getComparisons(projectId: string, publicOnly = true): Promise<ProjectComparison[]> {
    return this.projectRepository.getComparisonsByProjectId(projectId, publicOnly);
  }

  async createComparison(dto: CreateComparisonDTO, adminId?: string): Promise<ProjectComparison> {
    const created = await this.projectRepository.createComparison(dto);
    await this.dashboardService.recordActivity(
      "CREATE",
      "PROJECT",
      `Added before/after comparison "${dto.title}" to project ${dto.project_id}`,
      adminId,
      dto.project_id
    );
    return created;
  }

  async updateComparison(
    id: string,
    dto: UpdateComparisonDTO,
    adminId?: string
  ): Promise<ProjectComparison> {
    const updated = await this.projectRepository.updateComparison(id, dto);
    if (!updated) {
      const error: any = new Error("Project comparison not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Updated before/after comparison ${id}`,
      adminId
    );
    return updated;
  }

  async deleteComparison(id: string, adminId?: string): Promise<boolean> {
    const deleted = await this.projectRepository.deleteComparison(id);
    if (deleted) {
      await this.dashboardService.recordActivity(
        "DELETE",
        "PROJECT",
        `Deleted before/after comparison ${id}`,
        adminId
      );
    }
    return deleted;
  }

  async getProjectById(id: string): Promise<ProjectWithDetails> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return project;
  }

  async getProjectBySlug(slug: string): Promise<ProjectWithDetails> {
    const project = await this.projectRepository.findBySlug(slug);
    if (!project) {
      const error: any = new Error(`Project story with slug '${slug}' was not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return project;
  }

  async createProject(dto: CreateProjectDTO, adminId?: string): Promise<ProjectEntity> {
    const normalizedTitle = dto.title.trim();
    let baseSlug = dto.slug ? this.slugify(dto.slug) : this.slugify(normalizedTitle);

    let slug = baseSlug;
    let counter = 1;
    while (await this.projectRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProject: ProjectEntity = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      slug,
      short_description: dto.short_description || null,
      description: dto.description || null,
      cover_image_url: dto.cover_image_url || null,
      category_id: dto.category_id || null,
      location: dto.location || null,
      project_date: dto.project_date || null,
      is_published: dto.is_published !== undefined ? dto.is_published : true,
      is_featured: dto.is_featured !== undefined ? dto.is_featured : false,
      featured_order: dto.featured_order || 0,
      featured_start_date: dto.featured_start_date || null,
      featured_end_date: dto.featured_end_date || null,
      show_in_search: dto.show_in_search !== undefined ? dto.show_in_search : true,
      show_related_projects: dto.show_related_projects !== undefined ? dto.show_related_projects : true,
      enable_gallery: dto.enable_gallery !== undefined ? dto.enable_gallery : true,
      enable_before_after: dto.enable_before_after !== undefined ? dto.enable_before_after : false,
      show_enquiry_cta: dto.show_enquiry_cta !== undefined ? dto.show_enquiry_cta : true,
      allow_sharing: dto.allow_sharing !== undefined ? dto.allow_sharing : true,
      tags: dto.tags || [],
      is_visible: dto.is_visible !== undefined ? dto.is_visible : true,
      sort_order: dto.sort_order || 0,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const created = await this.projectRepository.create(newProject);

    if (dto.photo_ids && dto.photo_ids.length > 0) {
      for (let i = 0; i < dto.photo_ids.length; i++) {
        await this.projectRepository.addPhoto(created.id, dto.photo_ids[i], i + 1);
      }
    }

    await this.dashboardService.recordActivity(
      "CREATE",
      "PROJECT",
      `Created project story: "${created.title}"`,
      adminId,
      created.id
    );

    return created;
  }

  async updateProject(id: string, dto: UpdateProjectDTO, adminId?: string): Promise<ProjectEntity> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      const targetSlug = this.slugify(dto.slug);
      const conflict = await this.projectRepository.findBySlug(targetSlug);
      if (conflict && conflict.id !== id) {
        const error: any = new Error(`Slug '${targetSlug}' is already in use by another project`);
        error.statusCode = 409;
        error.code = "SLUG_CONFLICT";
        throw error;
      }
      slug = targetSlug;
    }

    const updates: Partial<ProjectEntity> = {
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.slug !== undefined && { slug }),
      ...(dto.short_description !== undefined && { short_description: dto.short_description }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.cover_image_url !== undefined && { cover_image_url: dto.cover_image_url }),
      ...(dto.category_id !== undefined && { category_id: dto.category_id }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.project_date !== undefined && { project_date: dto.project_date }),
      ...(dto.is_published !== undefined && { is_published: dto.is_published }),
      ...(dto.is_featured !== undefined && { is_featured: dto.is_featured }),
      ...(dto.featured_order !== undefined && { featured_order: dto.featured_order }),
      ...(dto.featured_start_date !== undefined && { featured_start_date: dto.featured_start_date }),
      ...(dto.featured_end_date !== undefined && { featured_end_date: dto.featured_end_date }),
      ...(dto.show_in_search !== undefined && { show_in_search: dto.show_in_search }),
      ...(dto.show_related_projects !== undefined && { show_related_projects: dto.show_related_projects }),
      ...(dto.enable_gallery !== undefined && { enable_gallery: dto.enable_gallery }),
      ...(dto.enable_before_after !== undefined && { enable_before_after: dto.enable_before_after }),
      ...(dto.show_enquiry_cta !== undefined && { show_enquiry_cta: dto.show_enquiry_cta }),
      ...(dto.allow_sharing !== undefined && { allow_sharing: dto.allow_sharing }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
      ...(dto.is_visible !== undefined && { is_visible: dto.is_visible }),
      ...(dto.sort_order !== undefined && { sort_order: dto.sort_order }),
    };

    const updated = await this.projectRepository.update(id, updates);
    if (!updated) {
      const error: any = new Error("Failed to update project");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Updated project story: "${updated.title}"`,
      adminId,
      updated.id
    );

    return updated;
  }

  async toggleStatus(
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean; featured_order?: number },
    adminId?: string
  ): Promise<ProjectEntity> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const updated = await this.projectRepository.update(id, status);
    if (!updated) {
      const error: any = new Error("Failed to update status");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Toggled status for project "${updated.title}"`,
      adminId,
      updated.id
    );

    return updated;
  }

  async deleteProject(id: string, adminId?: string): Promise<void> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const deleted = await this.projectRepository.delete(id);
    if (!deleted) {
      const error: any = new Error("Failed to delete project");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "DELETE",
      "PROJECT",
      `Deleted project story: "${existing.title}"`,
      adminId,
      existing.id
    );
  }

  async addPhotosToProject(projectId: string, photoIds: string[], adminId?: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const existingPhotos = project.photos || [];
    let nextSort = existingPhotos.length > 0
      ? Math.max(...existingPhotos.map((p: any) => p.project_sort_order || 0)) + 1
      : 1;

    for (const photoId of photoIds) {
      await this.projectRepository.addPhoto(projectId, photoId, nextSort);
      nextSort++;
    }

    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Added ${photoIds.length} photo(s) to project "${project.title}"`,
      adminId,
      projectId
    );
  }

  async removePhotoFromProject(projectId: string, photoId: string, adminId?: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    await this.projectRepository.removePhoto(projectId, photoId);

    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Removed photo from project "${project.title}"`,
      adminId,
      projectId
    );
  }

  async reorderProjectPhotos(
    projectId: string,
    items: { photo_id: string; sort_order: number }[],
    adminId?: string
  ): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      const error: any = new Error("Project story not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    await this.projectRepository.reorderProjectPhotos(projectId, items);

    await this.dashboardService.recordActivity(
      "UPDATE",
      "PROJECT",
      `Reordered gallery photographs in project "${project.title}"`,
      adminId,
      projectId
    );
  }
}
