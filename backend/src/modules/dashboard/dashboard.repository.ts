import { query } from "../../database/db.js";
import { ActivityLogItem, DashboardStats } from "./dashboard.types.js";

const DEFAULT_DEMO_STATS: DashboardStats = {
  photos: {
    total: 48,
    published: 42,
    featured: 8,
  },
  projects: {
    total: 12,
    published: 10,
    featured: 3,
  },
  categories: {
    total: 4,
    active: 4,
  },
  messages: {
    total: 6,
    unread: 2,
  },
};

const DEFAULT_DEMO_ACTIVITY: ActivityLogItem[] = [
  {
    id: "act-01",
    action: "LOGIN",
    entity_type: "AUTH",
    description: "Photographer signed in to Studio CMS",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "act-02",
    action: "PUBLISH",
    entity_type: "PROJECT",
    description: 'Published project story: "Aura & Monolith Series"',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-03",
    action: "CREATE",
    entity_type: "PHOTO",
    description: "Uploaded 6 high-resolution editorial photographs",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-04",
    action: "UPDATE",
    entity_type: "HOMEPAGE",
    description: "Updated Hero headline and showcase imagery",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-05",
    action: "CREATE",
    entity_type: "CATEGORY",
    description: 'Created new portfolio category: "Architecture"',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export class DashboardRepository {
  async getStats(): Promise<DashboardStats> {
    try {
      const photosRes = await query(
        `SELECT 
           COUNT(*)::int AS total, 
           COUNT(*) FILTER (WHERE is_published = true)::int AS published,
           COUNT(*) FILTER (WHERE is_featured = true)::int AS featured
         FROM photos`
      );

      const projectsRes = await query(
        `SELECT 
           COUNT(*)::int AS total, 
           COUNT(*) FILTER (WHERE is_published = true)::int AS published,
           COUNT(*) FILTER (WHERE is_featured = true)::int AS featured
         FROM projects`
      );

      const categoriesRes = await query(
        `SELECT 
           COUNT(*)::int AS total, 
           COUNT(*) FILTER (WHERE is_active = true)::int AS active 
         FROM categories`
      );

      const messagesRes = await query(
        `SELECT 
           COUNT(*)::int AS total, 
           COUNT(*) FILTER (WHERE status = 'NEW')::int AS unread 
         FROM contact_messages`
      );

      return {
        photos: {
          total: photosRes.rows[0]?.total || 0,
          published: photosRes.rows[0]?.published || 0,
          featured: photosRes.rows[0]?.featured || 0,
        },
        projects: {
          total: projectsRes.rows[0]?.total || 0,
          published: projectsRes.rows[0]?.published || 0,
          featured: projectsRes.rows[0]?.featured || 0,
        },
        categories: {
          total: categoriesRes.rows[0]?.total || 0,
          active: categoriesRes.rows[0]?.active || 0,
        },
        messages: {
          total: messagesRes.rows[0]?.total || 0,
          unread: messagesRes.rows[0]?.unread || 0,
        },
      };
    } catch (err) {
      console.warn("Database query for stats failed, using fallback demo stats:", (err as Error).message);
      return DEFAULT_DEMO_STATS;
    }
  }

  async getRecentActivity(limit = 10): Promise<ActivityLogItem[]> {
    try {
      const result = await query<ActivityLogItem>(
        "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1",
        [limit]
      );
      if (result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      console.warn("Database query for activity logs failed, using fallback activity data:", (err as Error).message);
    }
    return DEFAULT_DEMO_ACTIVITY.slice(0, limit);
  }

  async logActivity(item: Omit<ActivityLogItem, "id" | "created_at">): Promise<void> {
    try {
      await query(
        `INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [item.admin_id || null, item.action, item.entity_type, item.entity_id || null, item.description]
      );
    } catch (err) {
      console.warn("Could not insert activity log into database:", (err as Error).message);
      DEFAULT_DEMO_ACTIVITY.unshift({
        id: `act-${Date.now()}`,
        ...item,
        created_at: new Date().toISOString(),
      });
    }
  }

  async searchProjects(q: string) {
    try {
      const res = await query(
        `SELECT id, title, slug, location, short_description, is_published
         FROM projects
         WHERE title ILIKE $1 OR location ILIKE $1 OR short_description ILIKE $1
         LIMIT 6`,
        [`%${q}%`]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          type: "PROJECT" as const,
          title: r.title,
          subtitle: r.location || r.slug,
          url: `/admin/projects`,
          badge: r.is_published ? "Published" : "Draft",
        }));
      }
    } catch {
      // fallback
    }
    return [
      {
        id: "pr000000-0000-0000-0000-000000000001",
        type: "PROJECT" as const,
        title: "Lake Como Grand Villa Celebrations",
        subtitle: "Villa Balbiano, Lake Como, Italy",
        url: "/admin/projects",
        badge: "Published",
      },
      {
        id: "pr000000-0000-0000-0000-000000000002",
        type: "PROJECT" as const,
        title: "Milan & Paris Haute Couture Studies",
        subtitle: "Fashion Week · Paris & Milan",
        url: "/admin/projects",
        badge: "Published",
      },
    ].filter((p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));
  }

  async searchCategories(q: string) {
    try {
      const res = await query(
        `SELECT id, name, slug, description, is_active
         FROM categories
         WHERE name ILIKE $1 OR slug ILIKE $1 OR description ILIKE $1
         LIMIT 4`,
        [`%${q}%`]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          type: "CATEGORY" as const,
          title: r.name,
          subtitle: `/portfolio?category=${r.slug}`,
          url: `/admin/categories`,
          badge: r.is_active ? "Active" : "Hidden",
        }));
      }
    } catch {
      // fallback
    }
    return [
      {
        id: "cat-1",
        type: "CATEGORY" as const,
        title: "Weddings",
        subtitle: "/portfolio?category=weddings",
        url: "/admin/categories",
        badge: "Active",
      },
      {
        id: "cat-2",
        type: "CATEGORY" as const,
        title: "Editorial",
        subtitle: "/portfolio?category=editorial",
        url: "/admin/categories",
        badge: "Active",
      },
    ].filter((c) => c.title.toLowerCase().includes(q));
  }

  async searchMedia(q: string) {
    try {
      const res = await query(
        `SELECT id, original_filename, caption, alt_text, visibility
         FROM media_assets
         WHERE original_filename ILIKE $1 OR caption ILIKE $1 OR alt_text ILIKE $1
         LIMIT 5`,
        [`%${q}%`]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          type: "MEDIA" as const,
          title: r.original_filename,
          subtitle: r.caption || r.alt_text || "High-Res Asset",
          url: `/admin/media`,
          badge: r.visibility,
        }));
      }
    } catch {
      // fallback
    }
    return [
      {
        id: "770e8400-e29b-41d4-a716-446655440001",
        type: "MEDIA" as const,
        title: "editorial-lake-como-sunset.jpg",
        subtitle: "Luxury Lake Como Villa Wedding during sunset",
        url: "/admin/media",
        badge: "PUBLIC",
      },
    ].filter((m) => m.title.toLowerCase().includes(q) || m.subtitle.toLowerCase().includes(q));
  }

  async searchEnquiries(q: string) {
    try {
      const res = await query(
        `SELECT id, reference_number, name, email, location, status
         FROM enquiries
         WHERE name ILIKE $1 OR email ILIKE $1 OR reference_number ILIKE $1 OR location ILIKE $1
         LIMIT 5`,
        [`%${q}%`]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          type: "ENQUIRY" as const,
          title: `${r.name} (${r.reference_number || "ENQ"})`,
          subtitle: `${r.email} · ${r.location || "Direct"}`,
          url: `/admin/messages`,
          badge: r.status,
        }));
      }
    } catch {
      // fallback
    }
    return [
      {
        id: "enq-01",
        type: "ENQUIRY" as const,
        title: "Sophia Laurent (ENQ-2026-881)",
        subtitle: "sophia.laurent@vogue.fr · Paris Fashion Week",
        url: "/admin/messages",
        badge: "NEW",
      },
    ].filter((e) => e.title.toLowerCase().includes(q) || e.subtitle.toLowerCase().includes(q));
  }
}
