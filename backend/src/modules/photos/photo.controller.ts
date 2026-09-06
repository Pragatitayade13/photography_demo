import { Request, Response, NextFunction } from "express";
import { PhotoService } from "./photo.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";

export class PhotoController {
  private photoService: PhotoService;

  constructor() {
    this.photoService = new PhotoService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        category_id,
        category_slug,
        is_published,
        is_featured,
        is_visible,
        search,
        public: publicParam,
      } = req.query;

      const result = await this.photoService.getAllPhotos({
        category_id: category_id as string,
        category_slug: category_slug as string,
        is_published: is_published !== undefined ? is_published === "true" : undefined,
        is_featured: is_featured !== undefined ? is_featured === "true" : undefined,
        is_visible: is_visible !== undefined ? is_visible === "true" : undefined,
        search: search as string,
        publicOnly: publicParam === "true",
      });

      sendSuccess(res, result, "Photographs retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const photo = await this.photoService.getPhotoById(req.params.id);
      sendSuccess(res, photo, "Photograph retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.photoService.createPhoto(req.body, req.user?.id);
      sendSuccess(res, created, "Photograph added successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.photoService.updatePhoto(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Photograph updated successfully");
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.photoService.toggleStatus(
        req.params.id,
        req.body,
        req.user?.id
      );
      sendSuccess(res, updated, "Photograph status updated");
    } catch (error) {
      next(error);
    }
  };

  reorder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.photoService.reorderPhotos(req.body.items, req.user?.id);
      sendSuccess(res, null, "Photographs reordered successfully");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.photoService.deletePhoto(req.params.id, req.user?.id);
      sendSuccess(res, null, "Photograph deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  uploadImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        sendError(res, "VALIDATION_ERROR", "No image file provided for upload", 400);
        return;
      }

      // Generate accessible static URL
      const imageUrl = `/uploads/photos/${file.filename}`;

      sendSuccess(
        res,
        {
          image_url: imageUrl,
          thumbnail_url: imageUrl,
          original_name: file.originalname,
          file_size: file.size,
          mime_type: file.mimetype,
          width: 2400, // Default baseline metadata
          height: 1800,
        },
        "Image file uploaded successfully"
      );
    } catch (error) {
      next(error);
    }
  };
}
