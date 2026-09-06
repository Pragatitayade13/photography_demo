import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";
import { env } from "../../config/env.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await this.authService.login(req.body);

      // Set secure HTTP-only cookie
      res.cookie("auth_token", session.token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, session, "Signed in successfully");
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        sendError(res, "UNAUTHORIZED", "Authentication required", 401);
        return;
      }

      const admin = await this.authService.getMe(req.user.id);
      sendSuccess(res, { admin }, "Current admin session retrieved");
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    sendSuccess(res, null, "Logged out successfully");
  };
}
