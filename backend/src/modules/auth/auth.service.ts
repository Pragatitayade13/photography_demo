import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository.js";
import { LoginInput } from "./auth.schema.js";
import { AuthSessionResponse, JwtAuthPayload, SafeAdmin } from "./auth.types.js";
import { env } from "../../config/env.js";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(input: LoginInput): Promise<AuthSessionResponse> {
    const admin = await this.authRepository.findByEmail(input.email);

    if (!admin || !admin.is_active) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }

    const isMatch = await bcrypt.compare(input.password, admin.password_hash);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }

    await this.authRepository.updateLastLogin(admin.id);

    const payload: JwtAuthPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const safeAdmin: SafeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      is_active: admin.is_active,
      last_login_at: admin.last_login_at,
    };

    return {
      admin: safeAdmin,
      token,
    };
  }

  async getMe(adminId: string): Promise<SafeAdmin> {
    const admin = await this.authRepository.findById(adminId);
    if (!admin || !admin.is_active) {
      const error: any = new Error("Admin not found or inactive");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      is_active: admin.is_active,
      last_login_at: admin.last_login_at,
    };
  }

  verifyToken(token: string): JwtAuthPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtAuthPayload;
    } catch {
      const error: any = new Error("Invalid or expired authentication token");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }
  }
}
