import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";
import { AuthService } from "../modules/auth/auth.service.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

const authService = new AuthService();

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.auth_token) {
      // 2. Fallback to HTTP-only auth_token cookie
      token = req.cookies.auth_token;
    }

    if (!token) {
      sendError(res, "UNAUTHORIZED", "Authentication required", 401);
      return;
    }

    const payload = authService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    sendError(res, "UNAUTHORIZED", "Invalid or expired session. Please sign in again.", 401);
  }
};

export const authenticate = authMiddleware;

