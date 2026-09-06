import bcrypt from "bcryptjs";
import { query } from "../../database/db.js";
import { AdminEntity } from "./auth.types.js";

// Fallback demo admin for development / offline environments
const DEMO_ADMIN: AdminEntity = {
  id: "a0000000-0000-0000-0000-000000000001",
  name: "Alex Mercer",
  email: "admin@example.com",
  password_hash: bcrypt.hashSync("admin12345", 10),
  is_active: true,
  last_login_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
};

export class AuthRepository {
  async findByEmail(email: string): Promise<AdminEntity | null> {
    try {
      const result = await query<AdminEntity>(
        "SELECT * FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [email]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.warn("Database query failed, checking in-memory fallback:", (err as Error).message);
    }

    if (email.toLowerCase() === DEMO_ADMIN.email.toLowerCase()) {
      return DEMO_ADMIN;
    }
    return null;
  }

  async findById(id: string): Promise<AdminEntity | null> {
    try {
      const result = await query<AdminEntity>(
        "SELECT * FROM admins WHERE id = $1 LIMIT 1",
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.warn("Database query failed, checking in-memory fallback:", (err as Error).message);
    }

    if (id === DEMO_ADMIN.id) {
      return DEMO_ADMIN;
    }
    return null;
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await query(
        "UPDATE admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1",
        [id]
      );
    } catch (err) {
      console.warn("Could not update last_login_at in database:", (err as Error).message);
      if (id === DEMO_ADMIN.id) {
        DEMO_ADMIN.last_login_at = new Date();
      }
    }
  }
}
