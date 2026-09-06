import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { sendError } from "../utils/response.js";
import { SecurityRepository } from "../modules/security/security.repository.js";

const securityRepo = new SecurityRepository();

const createLimiter = (
  windowMs: number,
  max: number,
  message: string,
  eventType: string
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      // Log rate limit event
      securityRepo.logSecurityEvent({
        event_type: eventType,
        severity: "WARNING",
        user_id: (req as any).user?.id || null,
        ip_address: ip,
        user_agent: req.headers["user-agent"] || null,
        request_path: req.originalUrl,
        metadata: { limit: max, windowMs, method: req.method },
      });

      return sendError(
        res,
        "RATE_LIMIT_EXCEEDED",
        message,
        429
      );
    },
  });
};

// 120 requests per minute per IP for general browsing
export const publicApiLimiter = createLimiter(
  60 * 1000,
  120,
  "Too many requests from this IP. Please wait a moment.",
  "PUBLIC_API_RATE_LIMIT"
);

// 5 enquiry submissions per hour per IP
export const enquiryLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Enquiry rate limit reached. Please wait before submitting another message.",
  "ENQUIRY_RATE_LIMIT"
);

// 10 login attempts per 15 minutes per IP
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many failed login attempts. Account temporarily locked for 15 minutes.",
  "AUTH_RATE_LIMIT"
);

// 60 telemetry / metrics events per minute per IP
export const metricsLimiter = createLimiter(
  60 * 1000,
  60,
  "Metrics rate limit exceeded.",
  "METRICS_RATE_LIMIT"
);
