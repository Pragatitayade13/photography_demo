import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const query = async <T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT 1 AS alive");
    return result.rows.length > 0;
  } catch (error) {
    console.warn("Database connection check failed (expected during offline initial setup):", (error as Error).message);
    return false;
  }
};
