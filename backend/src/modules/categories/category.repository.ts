import { query } from "../../database/db.js";
import { CategoryEntity, CategoryWithStats, ReorderCategoryItem } from "./category.types.js";

const DEMO_CATEGORIES: CategoryWithStats[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    name: "Editorial",
    slug: "editorial",
    description: "High-fashion and magazine editorial photography.",
    cover_image_url: null,
    is_active: true,
    is_visible: true,
    sort_order: 1,
    photo_count: 18,
    project_count: 5,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    name: "Portraits",
    slug: "portraits",
    description: "Studio and intimate character portraits with atmospheric lighting.",
    cover_image_url: null,
    is_active: true,
    is_visible: true,
    sort_order: 2,
    photo_count: 14,
    project_count: 3,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    name: "Weddings",
    slug: "weddings",
    description: "Cinematic and documentary destination weddings.",
    cover_image_url: null,
    is_active: true,
    is_visible: true,
    sort_order: 3,
    photo_count: 12,
    project_count: 3,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    name: "Architecture",
    slug: "architecture",
    description: "Contemporary spaces, geometric structures, and interior designs.",
    cover_image_url: null,
    is_active: true,
    is_visible: true,
    sort_order: 4,
    photo_count: 4,
    project_count: 1,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class CategoryRepository {
  async findAll(options?: {
    search?: string;
    status?: string;
    publicOnly?: boolean;
  }): Promise<CategoryWithStats[]> {
    try {
      let sql = `
        SELECT 
          c.*,
          COUNT(DISTINCT p.id)::int AS photo_count,
          COUNT(DISTINCT pr.id)::int AS project_count
        FROM categories c
        LEFT JOIN photos p ON p.category_id = c.id
        LEFT JOIN projects pr ON pr.category_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (options?.publicOnly) {
        sql += ` AND c.is_active = true AND c.is_visible = true`;
      } else if (options?.status === "active") {
        sql += ` AND c.is_active = true`;
      } else if (options?.status === "inactive") {
        sql += ` AND c.is_active = false`;
      }

      if (options?.search) {
        params.push(`%${options.search}%`);
        sql += ` AND (c.name ILIKE $${params.length} OR c.slug ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
      }

      sql += ` GROUP BY c.id ORDER BY c.sort_order ASC, c.created_at ASC`;

      const result = await query<CategoryWithStats>(sql, params);
      return result.rows;
    } catch (err) {
      console.warn("Database query for categories failed, using in-memory list:", (err as Error).message);
      let list = [...DEMO_CATEGORIES];

      if (options?.publicOnly) {
        list = list.filter((c) => c.is_active && c.is_visible);
      } else if (options?.status === "active") {
        list = list.filter((c) => c.is_active);
      } else if (options?.status === "inactive") {
        list = list.filter((c) => !c.is_active);
      }

      if (options?.search) {
        const queryStr = options.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(queryStr) ||
            c.slug.toLowerCase().includes(queryStr) ||
            (c.description && c.description.toLowerCase().includes(queryStr))
        );
      }

      return list.sort((a, b) => a.sort_order - b.sort_order);
    }
  }

  async findById(id: string): Promise<CategoryWithStats | null> {
    try {
      const result = await query<CategoryWithStats>(
        `SELECT 
           c.*,
           COUNT(DISTINCT p.id)::int AS photo_count,
           COUNT(DISTINCT pr.id)::int AS project_count
         FROM categories c
         LEFT JOIN photos p ON p.category_id = c.id
         LEFT JOIN projects pr ON pr.category_id = c.id
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.warn("Database query for category by ID failed, checking in-memory:", (err as Error).message);
    }
    return DEMO_CATEGORIES.find((c) => c.id === id) || null;
  }

  async findByName(name: string, excludeId?: string): Promise<CategoryEntity | null> {
    try {
      let sql = "SELECT * FROM categories WHERE LOWER(name) = LOWER($1)";
      const params: any[] = [name];
      if (excludeId) {
        sql += " AND id != $2";
        params.push(excludeId);
      }
      const result = await query<CategoryEntity>(sql, params);
      if (result.rows.length > 0) return result.rows[0];
    } catch (err) {
      console.warn("DB findByName check failed:", (err as Error).message);
    }
    return (
      DEMO_CATEGORIES.find(
        (c) => c.name.toLowerCase() === name.toLowerCase() && (!excludeId || c.id !== excludeId)
      ) || null
    );
  }

  async findBySlug(slug: string, excludeId?: string): Promise<CategoryEntity | null> {
    try {
      let sql = "SELECT * FROM categories WHERE LOWER(slug) = LOWER($1)";
      const params: any[] = [slug];
      if (excludeId) {
        sql += " AND id != $2";
        params.push(excludeId);
      }
      const result = await query<CategoryEntity>(sql, params);
      if (result.rows.length > 0) return result.rows[0];
    } catch (err) {
      console.warn("DB findBySlug check failed:", (err as Error).message);
    }
    return (
      DEMO_CATEGORIES.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase() && (!excludeId || c.id !== excludeId)
      ) || null
    );
  }

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    try {
      const result = await query<CategoryEntity>(
        `INSERT INTO categories (id, name, slug, description, cover_image_url, is_active, is_visible, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          category.id,
          category.name,
          category.slug,
          category.description || null,
          category.cover_image_url || null,
          category.is_active,
          category.is_visible,
          category.sort_order,
          category.created_at,
          category.updated_at,
        ]
      );
      return result.rows[0];
    } catch (err) {
      console.warn("DB create category failed, saving to in-memory store:", (err as Error).message);
      DEMO_CATEGORIES.push({ ...category, photo_count: 0, project_count: 0 });
      return category;
    }
  }

  async update(id: string, updates: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
    try {
      const existing = await this.findById(id);
      if (!existing) return null;

      const updated = {
        name: updates.name ?? existing.name,
        slug: updates.slug ?? existing.slug,
        description: updates.description !== undefined ? updates.description : existing.description,
        cover_image_url:
          updates.cover_image_url !== undefined ? updates.cover_image_url : existing.cover_image_url,
        is_active: updates.is_active ?? existing.is_active,
        is_visible: updates.is_visible ?? existing.is_visible,
        sort_order: updates.sort_order ?? existing.sort_order,
      };

      const result = await query<CategoryEntity>(
        `UPDATE categories 
         SET name = $1, slug = $2, description = $3, cover_image_url = $4, is_active = $5, is_visible = $6, sort_order = $7, updated_at = NOW()
         WHERE id = $8
         RETURNING *`,
        [
          updated.name,
          updated.slug,
          updated.description,
          updated.cover_image_url,
          updated.is_active,
          updated.is_visible,
          updated.sort_order,
          id,
        ]
      );
      return result.rows[0];
    } catch (err) {
      console.warn("DB update category failed, updating in-memory store:", (err as Error).message);
      const idx = DEMO_CATEGORIES.findIndex((c) => c.id === id);
      if (idx !== -1) {
        DEMO_CATEGORIES[idx] = {
          ...DEMO_CATEGORIES[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return DEMO_CATEGORIES[idx];
      }
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await query("DELETE FROM categories WHERE id = $1 RETURNING id", [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      console.warn("DB delete category failed, deleting from in-memory store:", (err as Error).message);
      const idx = DEMO_CATEGORIES.findIndex((c) => c.id === id);
      if (idx !== -1) {
        DEMO_CATEGORIES.splice(idx, 1);
        return true;
      }
      return false;
    }
  }

  async reorder(items: ReorderCategoryItem[]): Promise<void> {
    try {
      for (const item of items) {
        await query("UPDATE categories SET sort_order = $1, updated_at = NOW() WHERE id = $2", [
          item.sort_order,
          item.id,
        ]);
      }
    } catch (err) {
      console.warn("DB reorder failed, updating in-memory store:", (err as Error).message);
      for (const item of items) {
        const cat = DEMO_CATEGORIES.find((c) => c.id === item.id);
        if (cat) cat.sort_order = item.sort_order;
      }
    }
  }
}
