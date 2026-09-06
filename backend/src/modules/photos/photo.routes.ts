import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PhotoController } from "./photo.controller.js";
import {
  createPhotoSchema,
  photoStatusToggleSchema,
  reorderPhotosSchema,
  updatePhotoSchema,
} from "./photo.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new PhotoController();

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), "uploads/photos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max per file
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."));
    }
  },
});

// Public read endpoints
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Protected Admin Mutation Endpoints
router.post("/upload", authMiddleware, upload.single("image"), controller.uploadImage);
router.post("/", authMiddleware, validate(createPhotoSchema), controller.create);
router.put("/:id", authMiddleware, validate(updatePhotoSchema), controller.update);
router.patch("/:id/status", authMiddleware, validate(photoStatusToggleSchema), controller.toggleStatus);
router.patch("/reorder", authMiddleware, validate(reorderPhotosSchema), controller.reorder);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
