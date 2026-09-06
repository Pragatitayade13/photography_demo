import { Request, Response, NextFunction } from "express";

/**
 * Basic HTML & Script tag stripper to prevent stored/reflected XSS
 */
function sanitizeString(str: string): string {
  if (typeof str !== "string") return str;

  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // strip <script> blocks
    .replace(/javascript:/gi, "") // strip javascript: pseudo-protocol
    .replace(/on\w+\s*=/gi, "") // strip inline event handlers (e.g. onload=, onerror=)
    .trim();
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      cleaned[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Middleware to sanitize body, query, and params against script injection
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }
  next();
};
