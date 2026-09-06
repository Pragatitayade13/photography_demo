import { Request, Response, NextFunction } from "express";
import { MediaService } from "./media.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import {
  mediaQuerySchema,
  updateMediaMetadataSchema,
  updateMediaVisibilitySchema,
  batchPublicMediaSchema,
} from "./media.schema.js";

export class MediaController {
  private mediaService: MediaService;

  constructor() {
    this.mediaService = new MediaService();
  }

  // Public: Get optimized single media
  getPublicMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const media = await this.mediaService.getPublicMedia(id);
      if (!media) {
        return sendError(res, "NOT_FOUND", "Media not found or not publicly available", 404);
      }
      return sendSuccess(res, media, "Optimized media retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Public: Batch get optimized media
  getBatchPublicMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = batchPublicMediaSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "VALIDATION_ERROR", "Invalid media IDs list", 400, parsed.error.format());
      }
      const mediaList = await this.mediaService.getBatchPublicMedia(parsed.data.ids);
      return sendSuccess(res, mediaList, "Batch public media retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Get paginated media list
  getAdminMediaList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = mediaQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return sendError(res, "VALIDATION_ERROR", "Invalid query parameters", 400, parsed.error.format());
      }
      const response = await this.mediaService.getAdminMediaList(parsed.data as any);
      return sendSuccess(res, response, "Media library retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Get single media details
  getAdminMediaDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const media = await this.mediaService.getAdminMediaDetails(id);
      if (!media) {
        return sendError(res, "NOT_FOUND", "Media asset not found", 404);
      }
      return sendSuccess(res, media, "Media details retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Upload new media asset
  uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return sendError(res, "VALIDATION_ERROR", "No image file provided for upload", 400);
      }

      const user = (req as any).user;
      const uploadedBy = user?.id || "system";
      const { alt_text, caption, visibility } = req.body;

      const mediaAsset = await this.mediaService.processUploadedFile(
        req.file,
        uploadedBy,
        { alt_text, caption, visibility }
      );

      return sendSuccess(res, mediaAsset, "Media uploaded and processed successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  // Admin: Update metadata
  updateMediaMetadata = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parsed = updateMediaMetadataSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "VALIDATION_ERROR", "Invalid metadata values", 400, parsed.error.format());
      }

      const updated = await this.mediaService.updateMetadata(id, parsed.data);
      if (!updated) {
        return sendError(res, "NOT_FOUND", "Media asset not found", 404);
      }
      return sendSuccess(res, updated, "Media metadata updated successfully");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Update visibility
  updateMediaVisibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parsed = updateMediaVisibilitySchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "VALIDATION_ERROR", "Invalid visibility state", 400, parsed.error.format());
      }

      const updated = await this.mediaService.updateVisibility(id, parsed.data.visibility);
      if (!updated) {
        return sendError(res, "NOT_FOUND", "Media asset not found", 404);
      }
      return sendSuccess(res, updated, "Media visibility updated successfully");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Retry failed processing
  retryProcessing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const retried = await this.mediaService.retryProcessing(id);
      if (!retried) {
        return sendError(res, "NOT_FOUND", "Media asset not found", 404);
      }
      return sendSuccess(res, retried, "Media processing scheduled for retry");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Regenerate variants
  regenerateVariants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const regenerated = await this.mediaService.regenerateVariants(id);
      if (!regenerated) {
        return sendError(res, "NOT_FOUND", "Media asset not found", 404);
      }
      return sendSuccess(res, regenerated, "Media variants regenerated successfully");
    } catch (error) {
      next(error);
    }
  };

  // Admin: Delete media
  deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.mediaService.deleteMedia(id);
      if (!deleted) {
        return sendError(res, "NOT_FOUND", "Media asset not found", 404);
      }
      return sendSuccess(res, { id, deleted: true }, "Media asset deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
