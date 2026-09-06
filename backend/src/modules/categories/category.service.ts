import crypto from "crypto";
import { CategoryRepository } from "./category.repository.js";
import {
  CategoryEntity,
  CategoryWithStats,
  CreateCategoryDTO,
  ReorderCategoryItem,
  UpdateCategoryDTO,
} from "./category.types.js";
import { DashboardService } from "../dashboard/dashboard.service.js";

export class CategoryService {
  private categoryRepository: CategoryRepository;
  private dashboardService: DashboardService;

  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.dashboardService = new DashboardService();
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  async getAllCategories(options?: {
    search?: string;
    status?: string;
    publicOnly?: boolean;
  }): Promise<CategoryWithStats[]> {
    return this.categoryRepository.findAll(options);
  }

  async getCategoryById(id: string): Promise<CategoryWithStats> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDTO, adminId?: string): Promise<CategoryEntity> {
    const normalizedName = dto.name.trim();
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(normalizedName);

    // 1. Check duplicate name
    const existingName = await this.categoryRepository.findByName(normalizedName);
    if (existingName) {
      const error: any = new Error("A category with this name already exists");
      error.statusCode = 409;
      error.code = "CONFLICT";
      throw error;
    }

    // 2. Check duplicate slug
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    if (existingSlug) {
      const error: any = new Error("A category with this URL slug already exists");
      error.statusCode = 409;
      error.code = "CONFLICT";
      throw error;
    }

    const newCategory: CategoryEntity = {
      id: crypto.randomUUID(),
      name: normalizedName,
      slug,
      description: dto.description || null,
      cover_image_url: dto.cover_image_url || null,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
      is_visible: dto.is_visible !== undefined ? dto.is_visible : true,
      sort_order: dto.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const created = await this.categoryRepository.create(newCategory);

    // Record audit activity
    await this.dashboardService.recordActivity(
      "CREATE",
      "CATEGORY",
      `Created category: "${created.name}"`,
      adminId,
      created.id
    );

    return created;
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDTO,
    adminId?: string
  ): Promise<CategoryEntity> {
    const existing = await this.getCategoryById(id);

    const updates: Partial<CategoryEntity> = {};

    if (dto.name !== undefined) {
      const normalizedName = dto.name.trim();
      const duplicateName = await this.categoryRepository.findByName(normalizedName, id);
      if (duplicateName) {
        const error: any = new Error("A category with this name already exists");
        error.statusCode = 409;
        error.code = "CONFLICT";
        throw error;
      }
      updates.name = normalizedName;

      // Auto-update slug if not explicitly provided
      if (!dto.slug) {
        const generatedSlug = this.slugify(normalizedName);
        const duplicateSlug = await this.categoryRepository.findBySlug(generatedSlug, id);
        if (!duplicateSlug) {
          updates.slug = generatedSlug;
        }
      }
    }

    if (dto.slug !== undefined) {
      const normalizedSlug = this.slugify(dto.slug);
      const duplicateSlug = await this.categoryRepository.findBySlug(normalizedSlug, id);
      if (duplicateSlug) {
        const error: any = new Error("A category with this URL slug already exists");
        error.statusCode = 409;
        error.code = "CONFLICT";
        throw error;
      }
      updates.slug = normalizedSlug;
    }

    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.cover_image_url !== undefined) updates.cover_image_url = dto.cover_image_url;
    if (dto.is_active !== undefined) updates.is_active = dto.is_active;
    if (dto.is_visible !== undefined) updates.is_visible = dto.is_visible;
    if (dto.sort_order !== undefined) updates.sort_order = dto.sort_order;

    const updated = await this.categoryRepository.update(id, updates);
    if (!updated) {
      const error: any = new Error("Category update failed");
      error.statusCode = 500;
      throw error;
    }

    // Record audit activity
    await this.dashboardService.recordActivity(
      "UPDATE",
      "CATEGORY",
      `Updated category: "${updated.name}"`,
      adminId,
      id
    );

    return updated;
  }

  async toggleStatus(
    id: string,
    statusUpdates: { is_active?: boolean; is_visible?: boolean },
    adminId?: string
  ): Promise<CategoryEntity> {
    const existing = await this.getCategoryById(id);
    const updated = await this.categoryRepository.update(id, statusUpdates);

    await this.dashboardService.recordActivity(
      "UPDATE",
      "CATEGORY",
      `Updated status for category: "${existing.name}"`,
      adminId,
      id
    );

    return updated!;
  }

  async deleteCategory(id: string, adminId?: string): Promise<void> {
    const existing = await this.getCategoryById(id);

    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      const error: any = new Error("Category could not be deleted");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "DELETE",
      "CATEGORY",
      `Deleted category: "${existing.name}"`,
      adminId,
      id
    );
  }

  async reorderCategories(items: ReorderCategoryItem[], adminId?: string): Promise<void> {
    await this.categoryRepository.reorder(items);
    await this.dashboardService.recordActivity(
      "UPDATE",
      "CATEGORY",
      `Reordered ${items.length} categories`,
      adminId
    );
  }
}
