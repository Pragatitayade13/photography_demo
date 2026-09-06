import crypto from "crypto";
import { PhotoRepository } from "./photo.repository.js";
import {
  CreatePhotoDTO,
  PhotoEntity,
  PhotoFilterOptions,
  PhotoWithCategory,
  UpdatePhotoDTO,
} from "./photo.types.js";
import { DashboardService } from "../dashboard/dashboard.service.js";

export class PhotoService {
  private photoRepository: PhotoRepository;
  private dashboardService: DashboardService;

  constructor() {
    this.photoRepository = new PhotoRepository();
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

  async getAllPhotos(
    options?: PhotoFilterOptions
  ): Promise<{ photos: PhotoWithCategory[]; total: number }> {
    return this.photoRepository.findAll(options);
  }

  async getPhotoById(id: string): Promise<PhotoWithCategory> {
    const photo = await this.photoRepository.findById(id);
    if (!photo) {
      const error: any = new Error("Photograph not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return photo;
  }

  async createPhoto(dto: CreatePhotoDTO, adminId?: string): Promise<PhotoEntity> {
    const normalizedTitle = dto.title.trim();
    let baseSlug = dto.slug ? this.slugify(dto.slug) : this.slugify(normalizedTitle);

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await this.photoRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPhoto: PhotoEntity = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      slug,
      description: dto.description || null,
      image_url: dto.image_url,
      thumbnail_url: dto.thumbnail_url || dto.image_url,
      alt_text: dto.alt_text.trim(),
      location: dto.location || null,
      photo_date: dto.photo_date || null,
      category_id: dto.category_id || null,
      is_published: dto.is_published !== undefined ? dto.is_published : true,
      is_featured: dto.is_featured !== undefined ? dto.is_featured : false,
      is_visible: dto.is_visible !== undefined ? dto.is_visible : true,
      sort_order: dto.sort_order || 0,
      width: dto.width || null,
      height: dto.height || null,
      file_size: dto.file_size || null,
      mime_type: dto.mime_type || null,
      metadata: dto.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const created = await this.photoRepository.create(newPhoto);

    // Log activity
    await this.dashboardService.recordActivity(
      "CREATE",
      "PHOTO",
      `Added photograph: "${created.title}"`,
      adminId,
      created.id
    );

    return created;
  }

  async updatePhoto(id: string, dto: UpdatePhotoDTO, adminId?: string): Promise<PhotoEntity> {
    const existing = await this.getPhotoById(id);
    const updates: Partial<PhotoEntity> = {};

    if (dto.title !== undefined) {
      updates.title = dto.title.trim();
      if (!dto.slug) {
        let baseSlug = this.slugify(updates.title);
        let slug = baseSlug;
        let counter = 1;
        while (await this.photoRepository.findBySlug(slug, id)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        updates.slug = slug;
      }
    }

    if (dto.slug !== undefined) {
      const slug = this.slugify(dto.slug);
      const duplicateSlug = await this.photoRepository.findBySlug(slug, id);
      if (duplicateSlug) {
        const error: any = new Error("A photo with this URL slug already exists");
        error.statusCode = 409;
        error.code = "CONFLICT";
        throw error;
      }
      updates.slug = slug;
    }

    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.image_url !== undefined) updates.image_url = dto.image_url;
    if (dto.thumbnail_url !== undefined) updates.thumbnail_url = dto.thumbnail_url;
    if (dto.alt_text !== undefined) updates.alt_text = dto.alt_text.trim();
    if (dto.location !== undefined) updates.location = dto.location;
    if (dto.photo_date !== undefined) updates.photo_date = dto.photo_date;
    if (dto.category_id !== undefined) updates.category_id = dto.category_id;
    if (dto.is_published !== undefined) updates.is_published = dto.is_published;
    if (dto.is_featured !== undefined) updates.is_featured = dto.is_featured;
    if (dto.is_visible !== undefined) updates.is_visible = dto.is_visible;
    if (dto.sort_order !== undefined) updates.sort_order = dto.sort_order;
    if (dto.width !== undefined) updates.width = dto.width;
    if (dto.height !== undefined) updates.height = dto.height;
    if (dto.file_size !== undefined) updates.file_size = dto.file_size;
    if (dto.mime_type !== undefined) updates.mime_type = dto.mime_type;
    if (dto.metadata !== undefined) updates.metadata = dto.metadata;

    const updated = await this.photoRepository.update(id, updates);
    if (!updated) {
      const error: any = new Error("Photo update failed");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "UPDATE",
      "PHOTO",
      `Updated photograph: "${updated.title}"`,
      adminId,
      id
    );

    return updated;
  }

  async toggleStatus(
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean },
    adminId?: string
  ): Promise<PhotoEntity> {
    const existing = await this.getPhotoById(id);
    const updated = await this.photoRepository.update(id, status);

    const actionDesc =
      status.is_published !== undefined
        ? status.is_published
          ? `Published photo "${existing.title}"`
          : `Unpublished photo "${existing.title}"`
        : status.is_featured !== undefined
        ? status.is_featured
          ? `Featured photo "${existing.title}"`
          : `Unfeatured photo "${existing.title}"`
        : `Updated visibility for photo "${existing.title}"`;

    await this.dashboardService.recordActivity("UPDATE", "PHOTO", actionDesc, adminId, id);
    return updated!;
  }

  async deletePhoto(id: string, adminId?: string): Promise<void> {
    const existing = await this.getPhotoById(id);
    const deleted = await this.photoRepository.delete(id);
    if (!deleted) {
      const error: any = new Error("Photo could not be deleted");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "DELETE",
      "PHOTO",
      `Deleted photograph: "${existing.title}"`,
      adminId,
      id
    );
  }

  async reorderPhotos(items: { id: string; sort_order: number }[], adminId?: string): Promise<void> {
    await this.photoRepository.reorder(items);
    await this.dashboardService.recordActivity(
      "UPDATE",
      "PHOTO",
      `Reordered ${items.length} photographs`,
      adminId
    );
  }
}
