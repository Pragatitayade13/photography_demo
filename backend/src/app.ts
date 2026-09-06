import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeInput } from "./middleware/sanitize.js";
import {
  publicApiLimiter,
  authLimiter,
  enquiryLimiter,
} from "./middleware/rateLimiter.js";
import { sendError } from "./utils/response.js";
import apiRouter from "./routes/index.js";
import { SeoController } from "./modules/seo/seo.controller.js";

const app: Express = express();
const seoController = new SeoController();

// Enhanced Security Headers (VS-15)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https:", "http:"],
      },
    },
    xContentTypeOptions: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(requestLogger);
app.use(sanitizeInput);

// Specific Endpoint Rate Limiting
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/contact/enquiries", enquiryLimiter);
app.use("/api/v1/public/enquiries", enquiryLimiter);
app.use("/api/v1", publicApiLimiter);

// Serve static uploads
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Top-level Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Dynamic Sitemap & Robots for Search Engine Discovery (VS-12)
app.get("/sitemap.xml", (req, res, next) => seoController.getSitemapXml(req, res, next));
app.get("/robots.txt", (req, res, next) => seoController.getRobotsTxt(req, res, next));

// Mount API v1
app.use("/api/v1", apiRouter);

// 404 Handler for undefined API routes
app.use((_req: Request, res: Response) => {
  sendError(res, "NOT_FOUND", "The requested API endpoint was not found", 404);
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
