import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";
import { SecurityRepository } from "../modules/security/security.repository.js";
import crypto from "crypto";

const securityRepo = new SecurityRepository();

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = `req_${crypto.randomBytes(6).toString("hex")}`;
  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  // Safe user-facing message
  let message = err.message || "An unexpected internal server error occurred.";
  let errorCode = err.code || "INTERNAL_SERVER_ERROR";

  // Clean up specific common errors
  if (err.name === "ZodError" || err.type === "validation") {
    errorCode = "VALIDATION_ERROR";
    message = "Request validation failed.";
  } else if (err.message && err.message.includes("UNSUPPORTED_FILE_TYPE")) {
    errorCode = "FILE_UPLOAD_ERROR";
    message = err.message;
  } else if (err.code === "LIMIT_FILE_SIZE") {
    errorCode = "FILE_TOO_LARGE";
    message = "Uploaded file exceeds maximum allowed size (25MB).";
  }

  // Log error internally to database / repository
  securityRepo.logSystemError({
    error_code: errorCode,
    message: err.message || "Unknown error",
    stack_trace: err.stack || null,
    request_path: req.originalUrl || req.path,
    request_method: req.method,
    user_id: (req as any).user?.id || null,
    severity: statusCode >= 500 ? "ERROR" : "WARNING",
  });

  // Never expose raw stack traces or internal secrets in responses
  const details = isProd ? undefined : { stack: err.stack, requestId };

  return sendError(res, errorCode, message, statusCode, details);
};
