import { MediaRepository } from "./media.repository.js";
import {
  MediaAsset,
  OptimizedPublicMedia,
  MediaFilterQuery,
  MediaListResponse,
  UpdateMediaMetadataDto,
  MediaVisibility,
} from "./media.types.js";
import crypto from "crypto";
import path from "path";

export class MediaService {
  private mediaRepo: MediaRepository;

  constructor() {
    this.mediaRepo = new MediaRepository();
  }

  async getPublicMedia(id: string): Promise<OptimizedPublicMedia | null> {
    const asset = await this.mediaRepo.findPublicById(id);
    if (!asset) return null;
    return this.transformToOptimizedPublic(asset);
  }

  async getBatchPublicMedia(ids: string[]): Promise<OptimizedPublicMedia[]> {
    const assets = await this.mediaRepo.findPublicByIds(ids);
    return assets.map((a) => this.transformToOptimizedPublic(a));
  }

  async getAdminMediaList(filter: MediaFilterQuery): Promise<MediaListResponse> {
    return this.mediaRepo.findAll(filter);
  }

  async getAdminMediaDetails(id: string): Promise<MediaAsset | null> {
    return this.mediaRepo.findById(id);
  }

  async processUploadedFile(
    file: {
      originalname: string;
      filename: string;
      mimetype: string;
      size: number;
      path?: string;
    },
    uploadedBy: string,
    metadata?: { alt_text?: string; caption?: string; visibility?: MediaVisibility }
  ): Promise<MediaAsset> {
    const ext = path.extname(file.originalname).replace(".", "").toLowerCase() || "jpg";
    const baseStorageUrl = file.filename ? `/uploads/${file.filename}` : `https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600`;

    const defaultWidth = 1600;
    const defaultHeight = 1067;
    const aspectRatio = parseFloat((defaultWidth / defaultHeight).toFixed(4));

    // Generate responsive variant dimensions
    const variants = [
      {
        id: crypto.randomUUID(),
        media_id: "",
        variant_name: "thumbnail" as const,
        width: 320,
        height: Math.round(320 / aspectRatio),
        mime_type: file.mimetype,
        file_size: Math.round(file.size * 0.1),
        storage_path: baseStorageUrl,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        media_id: "",
        variant_name: "small" as const,
        width: 640,
        height: Math.round(640 / aspectRatio),
        mime_type: file.mimetype,
        file_size: Math.round(file.size * 0.25),
        storage_path: baseStorageUrl,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        media_id: "",
        variant_name: "medium" as const,
        width: 1024,
        height: Math.round(1024 / aspectRatio),
        mime_type: file.mimetype,
        file_size: Math.round(file.size * 0.5),
        storage_path: baseStorageUrl,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        media_id: "",
        variant_name: "large" as const,
        width: 1600,
        height: Math.round(1600 / aspectRatio),
        mime_type: file.mimetype,
        file_size: file.size,
        storage_path: baseStorageUrl,
        created_at: new Date().toISOString(),
      },
    ];

    const newAsset = await this.mediaRepo.create({
      original_filename: file.originalname,
      stored_filename: file.filename,
      mime_type: file.mimetype,
      file_extension: ext,
      file_size: file.size,
      width: defaultWidth,
      height: defaultHeight,
      aspect_ratio: aspectRatio,
      storage_path: baseStorageUrl,
      visibility: metadata?.visibility || "PUBLIC",
      processing_status: "READY",
      processing_error: null,
      alt_text: metadata?.alt_text || file.originalname.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      caption: metadata?.caption || null,
      uploaded_by: uploadedBy,
      variants,
    });

    return newAsset;
  }

  async updateMetadata(id: string, dto: UpdateMediaMetadataDto): Promise<MediaAsset | null> {
    return this.mediaRepo.updateMetadata(id, dto);
  }

  async updateVisibility(id: string, visibility: MediaVisibility): Promise<MediaAsset | null> {
    const asset = await this.mediaRepo.findById(id);
    if (!asset) return null;

    if (visibility === "PUBLIC" && asset.processing_status !== "READY") {
      throw new Error("Cannot make unready or failed media public. Please retry processing first.");
    }

    return this.mediaRepo.updateVisibility(id, visibility);
  }

  async retryProcessing(id: string): Promise<MediaAsset | null> {
    const asset = await this.mediaRepo.findById(id);
    if (!asset) return null;

    // Simulate async optimization job
    return this.mediaRepo.updateProcessingStatus(id, "READY", null);
  }

  async regenerateVariants(id: string): Promise<MediaAsset | null> {
    const asset = await this.mediaRepo.findById(id);
    if (!asset) return null;

    return this.mediaRepo.updateProcessingStatus(id, "READY", null);
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.mediaRepo.delete(id);
  }

  private transformToOptimizedPublic(asset: MediaAsset): OptimizedPublicMedia {
    const variants = asset.variants || [];
    const srcSet = variants
      .sort((a, b) => a.width - b.width)
      .map((v) => ({
        width: v.width,
        url: v.storage_path,
      }));

    // Choose largest variant or main storage path
    const primarySrc =
      variants.find((v) => v.variant_name === "large")?.storage_path ||
      variants.find((v) => v.variant_name === "medium")?.storage_path ||
      asset.storage_path;

    return {
      id: asset.id,
      altText: asset.alt_text || asset.original_filename,
      caption: asset.caption || "",
      width: asset.width || 1600,
      height: asset.height || 1067,
      src: primarySrc,
      srcSet: srcSet.length > 0 ? srcSet : [{ width: asset.width || 1600, url: primarySrc }],
      aspectRatio: asset.aspect_ratio || 1.5,
    };
  }
}
