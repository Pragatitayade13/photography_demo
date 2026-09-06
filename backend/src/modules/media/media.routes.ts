import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { MediaController } from "./media.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = Router();
const mediaController = new MediaController();

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage with randomized safe filenames
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

// File filter: accept only safe image types
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("UNSUPPORTED_FILE_TYPE: Only JPEG, PNG, WebP, and AVIF images are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
});

// --- Public Media Routes ---
router.get("/public/media/:id", mediaController.getPublicMedia);
router.post("/public/media/batch", mediaController.getBatchPublicMedia);

// --- Admin Protected Media Routes ---
router.get("/admin/media", authenticate, mediaController.getAdminMediaList);
router.get("/admin/media/:id", authenticate, mediaController.getAdminMediaDetails);
router.post(
  "/admin/media",
  authenticate,
  upload.single("file"),
  mediaController.uploadMedia
);
router.patch("/admin/media/:id", authenticate, mediaController.updateMediaMetadata);
router.patch(
  "/admin/media/:id/visibility",
  authenticate,
  mediaController.updateMediaVisibility
);
router.post(
  "/admin/media/:id/retry-processing",
  authenticate,
  mediaController.retryProcessing
);
router.post(
  "/admin/media/:id/regenerate",
  authenticate,
  mediaController.regenerateVariants
);
router.delete("/admin/media/:id", authenticate, mediaController.deleteMedia);

export default router;
