import { query } from "../../database/db.js";
import {
  ProjectEntity,
  ProjectFilterOptions,
  ProjectWithDetails,
  ProjectRelation,
  ProjectComparison,
  CreateComparisonDTO,
  UpdateComparisonDTO,
  ProjectSearchResponse,
} from "./project.types.js";
import { PhotoWithCategory } from "../photos/photo.types.js";

const DEMO_PROJECTS: ProjectWithDetails[] = [
  {
    id: "pr000000-0000-0000-0000-000000000001",
    title: "Royal Heritage & Destination Wedding Celebrations",
    slug: "lake-como-grand-villa-celebrations",
    short_description: "An intimate, royal destination wedding capturing grand heritage mandaps, cascading rose petal showers, and sacred Vedic rituals.",
    description: "Commissioned multi-day destination wedding documentary capturing royal Indian heritage, sacred Vedic rites, and grand celebrations. Combining medium-format intimacy with majestic architectural mandaps, this series preserves authentic human emotion, joyous laughter, and timeless romance in radiant natural and ambient lighting.",
    cover_image_url: "/uploads/wedding_royal_red_lehenga.jpg",
    category_id: "c0000000-0000-0000-0000-000000000003", // Weddings
    category_name: "Weddings",
    category_slug: "weddings",
    location: "The Leela Palace, Jaipur & Udaipur",
    project_date: "2026-07-18",
    is_published: true,
    is_featured: true,
    featured_order: 1,
    show_in_search: true,
    show_related_projects: true,
    enable_gallery: true,
    enable_before_after: true,
    show_enquiry_cta: true,
    allow_sharing: true,
    tags: ["Destination Wedding", "Royal Heritage", "Varmala", "Talambralu", "Medium Format"],
    is_visible: true,
    sort_order: 1,
    photo_count: 5,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pr000000-0000-0000-0000-000000000002",
    title: "Tuscan Atelier Craftsmen & Heritage",
    slug: "tuscan-atelier-craftsmen-heritage",
    short_description: "An intimate artisanal monograph documenting master woodworking, studio light, and generational handcrafting.",
    description: "Published across European design journals, this project explores master artisans in their historic workshops, celebrating the tactile intersection of wood, chisel, and quiet focus.",
    cover_image_url: "/uploads/craftsman_workshop.jpg",
    category_id: "c0000000-0000-0000-0000-000000000001", // Editorial
    category_name: "Editorial",
    category_slug: "editorial",
    location: "Florence & Tuscany, Italy",
    project_date: "2026-06-28",
    is_published: true,
    is_featured: true,
    featured_order: 2,
    show_in_search: true,
    show_related_projects: true,
    enable_gallery: true,
    enable_before_after: true,
    show_enquiry_cta: true,
    allow_sharing: true,
    tags: ["Documentary", "Atelier", "Craftsmanship", "Tuscany", "Studio Light"],
    is_visible: true,
    sort_order: 2,
    photo_count: 3,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pr000000-0000-0000-0000-000000000003",
    title: "Alpine Horizons & Dolomites Monograph",
    slug: "alpine-horizons-dolomites-monograph",
    short_description: "Exploring jagged mountain ridges, solitary expeditions, and transcendent sunset atmospheres in the Dolomites.",
    description: "A continuous fine art monograph exploring alpine geology, natural golden light dynamics, and human scale amidst majestic mountain landscapes.",
    cover_image_url: "/uploads/mountain_sunset.jpg",
    category_id: "c0000000-0000-0000-0000-000000000004", // Architecture & Landscape
    category_name: "Architecture",
    category_slug: "architecture",
    location: "Tre Cime di Lavaredo, Dolomites, Italy",
    project_date: "2026-05-10",
    is_published: true,
    is_featured: true,
    featured_order: 3,
    show_in_search: true,
    show_related_projects: true,
    enable_gallery: true,
    enable_before_after: false,
    show_enquiry_cta: true,
    allow_sharing: true,
    tags: ["Landscape", "Dolomites", "Monograph", "Alpine", "Sunset"],
    is_visible: true,
    sort_order: 3,
    photo_count: 2,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// In-memory project photos junction map
const DEMO_PROJECT_PHOTOS: { id: string; project_id: string; photo_id: string; sort_order: number }[] = [
  { id: "1", project_id: "pr000000-0000-0000-0000-000000000001", photo_id: "p0000000-0000-0000-0000-000000000001", sort_order: 1 },
  { id: "2", project_id: "pr000000-0000-0000-0000-000000000001", photo_id: "p0000000-0000-0000-0000-000000000002", sort_order: 2 },
  { id: "3", project_id: "pr000000-0000-0000-0000-000000000001", photo_id: "p0000000-0000-0000-0000-000000000003", sort_order: 3 },
  { id: "4", project_id: "pr000000-0000-0000-0000-000000000001", photo_id: "p0000000-0000-0000-0000-000000000004", sort_order: 4 },
  { id: "5", project_id: "pr000000-0000-0000-0000-000000000001", photo_id: "p0000000-0000-0000-0000-000000000005", sort_order: 5 },
  { id: "6", project_id: "pr000000-0000-0000-0000-000000000002", photo_id: "p0000000-0000-0000-0000-000000000006", sort_order: 1 },
  { id: "7", project_id: "pr000000-0000-0000-0000-000000000003", photo_id: "p0000000-0000-0000-0000-000000000006", sort_order: 1 },
];

// In-memory project relations
const DEMO_PROJECT_RELATIONS: { id: string; project_id: string; related_project_id: string; sort_order: number }[] = [
  { id: "rel-1", project_id: "pr000000-0000-0000-0000-000000000001", related_project_id: "pr000000-0000-0000-0000-000000000002", sort_order: 1 },
  { id: "rel-2", project_id: "pr000000-0000-0000-0000-000000000002", related_project_id: "pr000000-0000-0000-0000-000000000001", sort_order: 1 },
  { id: "rel-3", project_id: "pr000000-0000-0000-0000-000000000003", related_project_id: "pr000000-0000-0000-0000-000000000002", sort_order: 1 },
];

// In-memory project comparisons
const DEMO_PROJECT_COMPARISONS: ProjectComparison[] = [
  {
    id: "cmp-1",
    project_id: "pr000000-0000-0000-0000-000000000001",
    before_image_url: "/uploads/thumb_wedding_royal_red_lehenga.jpg",
    after_image_url: "/uploads/wedding_royal_red_lehenga.jpg",
    title: "Royal Zardozi & Amber Mandap Color Grading",
    description: "Medium-format RAW sensor processing elevating rich crimson reds, metallic gold threads, and balanced skin luminescence.",
    before_label: "RAW Sensor Capture",
    after_label: "Master Heritage Grade",
    is_visible: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cmp-2",
    project_id: "pr000000-0000-0000-0000-000000000002",
    before_image_url: "/uploads/thumb_craftsman_workshop.jpg",
    after_image_url: "/uploads/craftsman_workshop.jpg",
    title: "Atelier Chiaroscuro & Micro-Contrast Retouching",
    description: "Precision micro-contrast refinement and timber textural preservation for international monograph publishing.",
    before_label: "Direct Capture",
    after_label: "Editorial Print Master",
    is_visible: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class ProjectRepository {
  async findAll(options?: ProjectFilterOptions): Promise<ProjectWithDetails[]> {
    try {
      let sql = `
        SELECT 
          pr.*,
          c.name AS category_name,
          c.slug AS category_slug,
          COUNT(DISTINCT pp.photo_id)::int AS photo_count
        FROM projects pr
        LEFT JOIN categories c ON c.id = pr.category_id
        LEFT JOIN project_photos pp ON pp.project_id = pr.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (options?.publicOnly) {
        sql += ` AND pr.is_published = true AND pr.is_visible = true`;
      } else {
        if (options?.is_published !== undefined) {
          params.push(options.is_published);
          sql += ` AND pr.is_published = $${params.length}`;
        }
        if (options?.is_visible !== undefined) {
          params.push(options.is_visible);
          sql += ` AND pr.is_visible = $${params.length}`;
        }
      }

      if (options?.is_featured !== undefined) {
        params.push(options.is_featured);
        sql += ` AND pr.is_featured = $${params.length}`;
      }

      if (options?.category_id) {
        params.push(options.category_id);
        sql += ` AND pr.category_id = $${params.length}`;
      }

      if (options?.category_slug) {
        params.push(options.category_slug);
        sql += ` AND c.slug = $${params.length}`;
      }

      if (options?.search) {
        params.push(`%${options.search}%`);
        sql += ` AND (pr.title ILIKE $${params.length} OR pr.description ILIKE $${params.length} OR pr.location ILIKE $${params.length})`;
      }

      sql += ` GROUP BY pr.id, c.name, c.slug`;

      if (options?.is_featured) {
        sql += ` ORDER BY pr.featured_order ASC, pr.sort_order ASC, pr.created_at DESC`;
      } else {
        sql += ` ORDER BY pr.sort_order ASC, pr.created_at DESC`;
      }

      if (options?.limit) {
        params.push(options.limit);
        sql += ` LIMIT $${params.length}`;
      }
      if (options?.offset) {
        params.push(options.offset);
        sql += ` OFFSET $${params.length}`;
      }

      const result = await query(sql, params);
      return result.rows;
    } catch (err) {
      console.warn("DB findAll projects failed, using in-memory store:", (err as Error).message);
      let list = [...DEMO_PROJECTS];

      if (options?.publicOnly) {
        list = list.filter((p) => p.is_published && p.is_visible);
      } else {
        if (options?.is_published !== undefined) {
          list = list.filter((p) => p.is_published === options.is_published);
        }
        if (options?.is_visible !== undefined) {
          list = list.filter((p) => p.is_visible === options.is_visible);
        }
      }

      if (options?.is_featured !== undefined) {
        list = list.filter((p) => p.is_featured === options.is_featured);
      }
      if (options?.category_id) {
        list = list.filter((p) => p.category_id === options.category_id);
      }
      if (options?.category_slug) {
        list = list.filter((p) => p.category_slug === options.category_slug);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.location && p.location.toLowerCase().includes(q)) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      if (options?.is_featured) {
        list.sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));
      } else {
        list.sort((a, b) => a.sort_order - b.sort_order);
      }

      return list;
    }
  }

  // --- VS-14: ADVANCED MULTI-FACET SEARCH & FILTERS ---
  async searchProjects(options: ProjectFilterOptions): Promise<ProjectSearchResponse> {
    const all = await this.findAll({ publicOnly: true });

    let filtered = all.filter((p) => p.show_in_search !== false);

    if (options.category_slug && options.category_slug !== "all") {
      filtered = filtered.filter(
        (p) => p.category_slug?.toLowerCase() === options.category_slug?.toLowerCase()
      );
    }

    if (options.tag && options.tag !== "all") {
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === options.tag?.toLowerCase())
      );
    }

    if (options.location && options.location !== "all") {
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(options.location!.toLowerCase())
      );
    }

    if (options.year && options.year !== "all") {
      filtered = filtered.filter((p) => {
        if (!p.project_date) return false;
        const y = new Date(p.project_date).getFullYear();
        return String(y) === String(options.year);
      });
    }

    if (options.is_featured) {
      filtered = filtered.filter((p) => p.is_featured);
    }

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.category_name && p.category_name.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Extract available facet filters from all published projects
    const catMap = new Map<string, { id: string; name: string; slug: string; count: number }>();
    const tagMap = new Map<string, number>();
    const yearSet = new Set<number>();
    const locSet = new Set<string>();

    all.forEach((p) => {
      if (p.category_id && p.category_name && p.category_slug) {
        const existing = catMap.get(p.category_slug) || {
          id: p.category_id,
          name: p.category_name,
          slug: p.category_slug,
          count: 0,
        };
        existing.count++;
        catMap.set(p.category_slug, existing);
      }

      if (p.tags) {
        p.tags.forEach((t) => {
          tagMap.set(t, (tagMap.get(t) || 0) + 1);
        });
      }

      if (p.project_date) {
        yearSet.add(new Date(p.project_date).getFullYear());
      }

      if (p.location) {
        locSet.add(p.location.split(",")[0].trim());
      }
    });

    const total = filtered.length;
    const limit = options.limit || 12;
    const page = Math.floor((options.offset || 0) / limit) + 1;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice(options.offset || 0, (options.offset || 0) + limit);

    return {
      items: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      filters: {
        categories: Array.from(catMap.values()),
        tags: Array.from(tagMap.entries()).map(([tag, count]) => ({ tag, count })),
        years: Array.from(yearSet).sort((a, b) => b - a),
        locations: Array.from(locSet),
      },
    };
  }

  // --- VS-14: FEATURED PROJECTS ---
  async findFeaturedProjects(): Promise<ProjectWithDetails[]> {
    return this.findAll({ publicOnly: true, is_featured: true });
  }

  async updateFeaturedOrder(
    items: Array<{ id: string; featured_order: number; is_featured?: boolean }>
  ): Promise<void> {
    try {
      for (const item of items) {
        await query(
          `UPDATE projects SET 
            featured_order = $1,
            is_featured = COALESCE($2, is_featured),
            updated_at = NOW()
           WHERE id = $3`,
          [item.featured_order, item.is_featured !== undefined ? item.is_featured : null, item.id]
        );
      }
    } catch (err) {
      console.warn("DB updateFeaturedOrder failed, updating in-memory:", (err as Error).message);
    }

    // In-memory update
    items.forEach((item) => {
      const p = DEMO_PROJECTS.find((dp) => dp.id === item.id);
      if (p) {
        p.featured_order = item.featured_order;
        if (item.is_featured !== undefined) p.is_featured = item.is_featured;
        p.updated_at = new Date().toISOString();
      }
    });
  }

  // --- VS-14: RELATED PROJECTS RECOMMENDATIONS ---
  async getRelatedProjects(projectId: string, limit = 3): Promise<ProjectEntity[]> {
    try {
      // 1. Check manual relations
      const relRes = await query<ProjectEntity>(
        `SELECT p.* FROM project_relations pr
         JOIN projects p ON p.id = pr.related_project_id
         WHERE pr.project_id = $1 AND p.is_published = true AND p.is_visible = true
         ORDER BY pr.sort_order ASC
         LIMIT $2`,
        [projectId, limit]
      );

      if (relRes.rows.length >= limit) {
        return relRes.rows;
      }

      const manual = relRes.rows;
      const manualIds = manual.map((m) => m.id);

      // 2. Supplement with same category/tags
      const current = await this.findById(projectId);
      if (!current) return manual;

      const autoRes = await query<ProjectEntity>(
        `SELECT p.* FROM projects p
         WHERE p.id != $1 AND p.is_published = true AND p.is_visible = true
           AND (p.category_id = $2 OR p.tags && $3)
           AND NOT (p.id = ANY($4::text[]))
         ORDER BY p.sort_order ASC, p.created_at DESC
         LIMIT $5`,
        [projectId, current.category_id || null, current.tags || [], manualIds, limit - manual.length]
      );

      return [...manual, ...autoRes.rows];
    } catch (err) {
      console.warn("DB getRelatedProjects failed, using in-memory store:", (err as Error).message);

      const manual = DEMO_PROJECT_RELATIONS.filter((r) => r.project_id === projectId)
        .map((r) => DEMO_PROJECTS.find((p) => p.id === r.related_project_id))
        .filter((p): p is ProjectWithDetails => Boolean(p && p.is_published && p.is_visible));

      if (manual.length >= limit) return manual.slice(0, limit);

      const current = DEMO_PROJECTS.find((p) => p.id === projectId);
      const manualIds = new Set(manual.map((m) => m.id));

      const fallback = DEMO_PROJECTS.filter(
        (p) =>
          p.id !== projectId &&
          p.is_published &&
          p.is_visible &&
          !manualIds.has(p.id) &&
          (p.category_id === current?.category_id ||
            p.tags?.some((t) => current?.tags?.includes(t)))
      );

      return [...manual, ...fallback].slice(0, limit);
    }
  }

  async setRelatedProjects(projectId: string, relatedProjectIds: string[]): Promise<void> {
    try {
      await query("DELETE FROM project_relations WHERE project_id = $1", [projectId]);
      for (let i = 0; i < relatedProjectIds.length; i++) {
        await query(
          `INSERT INTO project_relations (id, project_id, related_project_id, sort_order)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (project_id, related_project_id) DO UPDATE SET sort_order = EXCLUDED.sort_order`,
          [`rel-${Date.now()}-${i}`, projectId, relatedProjectIds[i], i + 1]
        );
      }
    } catch (err) {
      console.warn("DB setRelatedProjects failed, updating in-memory:", (err as Error).message);
    }

    // In-memory update
    const filtered = DEMO_PROJECT_RELATIONS.filter((r) => r.project_id !== projectId);
    relatedProjectIds.forEach((relId, idx) => {
      filtered.push({
        id: `rel-${Date.now()}-${idx}`,
        project_id: projectId,
        related_project_id: relId,
        sort_order: idx + 1,
      });
    });
  }

  // --- VS-14: BEFORE/AFTER COMPARISONS ---
  async getComparisonsByProjectId(
    projectId: string,
    publicOnly = true
  ): Promise<ProjectComparison[]> {
    try {
      let sql = `SELECT * FROM project_comparisons WHERE project_id = $1`;
      if (publicOnly) sql += ` AND is_visible = true`;
      sql += ` ORDER BY sort_order ASC, created_at ASC`;
      const res = await query<ProjectComparison>(sql, [projectId]);
      return res.rows;
    } catch (err) {
      let list = DEMO_PROJECT_COMPARISONS.filter((c) => c.project_id === projectId);
      if (publicOnly) list = list.filter((c) => c.is_visible);
      return list.sort((a, b) => a.sort_order - b.sort_order);
    }
  }

  async createComparison(dto: CreateComparisonDTO): Promise<ProjectComparison> {
    const item: ProjectComparison = {
      id: `cmp-${Date.now()}`,
      project_id: dto.project_id,
      before_image_url: dto.before_image_url,
      after_image_url: dto.after_image_url,
      title: dto.title,
      description: dto.description || null,
      before_label: dto.before_label || "Before",
      after_label: dto.after_label || "After",
      is_visible: dto.is_visible !== undefined ? dto.is_visible : true,
      sort_order: dto.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await query(
        `INSERT INTO project_comparisons (
          id, project_id, before_image_url, after_image_url, title, description,
          before_label, after_label, is_visible, sort_order, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          item.id,
          item.project_id,
          item.before_image_url,
          item.after_image_url,
          item.title,
          item.description,
          item.before_label,
          item.after_label,
          item.is_visible,
          item.sort_order,
          item.created_at,
          item.updated_at,
        ]
      );
    } catch (err) {
      console.warn("DB createComparison failed, updating in-memory:", (err as Error).message);
    }

    DEMO_PROJECT_COMPARISONS.push(item);
    return item;
  }

  async updateComparison(id: string, dto: UpdateComparisonDTO): Promise<ProjectComparison | null> {
    try {
      const res = await query<ProjectComparison>(
        `UPDATE project_comparisons SET
          before_image_url = COALESCE($1, before_image_url),
          after_image_url = COALESCE($2, after_image_url),
          title = COALESCE($3, title),
          description = COALESCE($4, description),
          before_label = COALESCE($5, before_label),
          after_label = COALESCE($6, after_label),
          is_visible = COALESCE($7, is_visible),
          sort_order = COALESCE($8, sort_order),
          updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [
          dto.before_image_url || null,
          dto.after_image_url || null,
          dto.title || null,
          dto.description || null,
          dto.before_label || null,
          dto.after_label || null,
          dto.is_visible !== undefined ? dto.is_visible : null,
          dto.sort_order !== undefined ? dto.sort_order : null,
          id,
        ]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.warn("DB updateComparison failed, updating in-memory:", (err as Error).message);
    }

    const idx = DEMO_PROJECT_COMPARISONS.findIndex((c) => c.id === id);
    if (idx !== -1) {
      DEMO_PROJECT_COMPARISONS[idx] = {
        ...DEMO_PROJECT_COMPARISONS[idx],
        ...dto,
        updated_at: new Date().toISOString(),
      };
      return DEMO_PROJECT_COMPARISONS[idx];
    }
    return null;
  }

  async deleteComparison(id: string): Promise<boolean> {
    try {
      const res = await query("DELETE FROM project_comparisons WHERE id = $1 RETURNING id", [id]);
      if ((res.rowCount ?? 0) > 0) return true;
    } catch (err) {
      console.warn("DB deleteComparison failed, updating in-memory:", (err as Error).message);
    }

    const idx = DEMO_PROJECT_COMPARISONS.findIndex((c) => c.id === id);
    if (idx !== -1) {
      DEMO_PROJECT_COMPARISONS.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- CORE BASE METHODS ---
  async findById(id: string): Promise<ProjectWithDetails | null> {
    try {
      const sql = `
        SELECT 
          pr.*,
          c.name AS category_name,
          c.slug AS category_slug,
          COUNT(DISTINCT pp.photo_id)::int AS photo_count
        FROM projects pr
        LEFT JOIN categories c ON c.id = pr.category_id
        LEFT JOIN project_photos pp ON pp.project_id = pr.id
        WHERE pr.id = $1
        GROUP BY pr.id, c.name, c.slug
      `;
      const result = await query(sql, [id]);
      if (result.rows.length === 0) return null;

      const project = result.rows[0];
      project.photos = await this.getProjectPhotos(id);
      project.comparisons = await this.getComparisonsByProjectId(id, false);
      project.related_projects = await this.getRelatedProjects(id);
      return project;
    } catch (err) {
      console.warn("DB findById project failed, using in-memory store:", (err as Error).message);
      const project = DEMO_PROJECTS.find((p) => p.id === id);
      if (!project) return null;

      const clone = { ...project };
      clone.photos = await this.getProjectPhotos(id);
      clone.comparisons = await this.getComparisonsByProjectId(id, false);
      clone.related_projects = await this.getRelatedProjects(id);
      return clone;
    }
  }

  async findBySlug(slug: string): Promise<ProjectWithDetails | null> {
    try {
      const sql = `
        SELECT 
          pr.*,
          c.name AS category_name,
          c.slug AS category_slug,
          COUNT(DISTINCT pp.photo_id)::int AS photo_count
        FROM projects pr
        LEFT JOIN categories c ON c.id = pr.category_id
        LEFT JOIN project_photos pp ON pp.project_id = pr.id
        WHERE pr.slug = $1
        GROUP BY pr.id, c.name, c.slug
      `;
      const result = await query(sql, [slug]);
      if (result.rows.length === 0) return null;

      const project = result.rows[0];
      project.photos = await this.getProjectPhotos(project.id);
      project.comparisons = await this.getComparisonsByProjectId(project.id, true);
      project.related_projects = await this.getRelatedProjects(project.id);
      return project;
    } catch (err) {
      console.warn("DB findBySlug project failed, using in-memory store:", (err as Error).message);
      const project = DEMO_PROJECTS.find((p) => p.slug === slug);
      if (!project) return null;

      const clone = { ...project };
      clone.photos = await this.getProjectPhotos(project.id);
      clone.comparisons = await this.getComparisonsByProjectId(project.id, true);
      clone.related_projects = await this.getRelatedProjects(project.id);
      return clone;
    }
  }

  async getProjectPhotos(projectId: string): Promise<PhotoWithCategory[]> {
    try {
      const sql = `
        SELECT 
          p.*,
          c.name AS category_name,
          c.slug AS category_slug,
          pp.sort_order AS project_sort_order
        FROM project_photos pp
        JOIN photos p ON p.id = pp.photo_id
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE pp.project_id = $1
        ORDER BY pp.sort_order ASC, p.created_at DESC
      `;
      const result = await query(sql, [projectId]);
      return result.rows;
    } catch (err) {
      console.warn("DB getProjectPhotos failed, returning fallback mock photos:", (err as Error).message);
      return [
        {
          id: "p0000000-0000-0000-0000-000000000001",
          title: "Monograph Frame I",
          slug: "monograph-frame-1",
          image_url: "/uploads/wedding_arch.jpg",
          alt_text: "Monograph Frame I",
          category_id: "c0000000-0000-0000-0000-000000000003",
          category_name: "Weddings",
          category_slug: "weddings",
          is_published: true,
          is_featured: true,
          is_visible: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "p0000000-0000-0000-0000-000000000002",
          title: "Monograph Frame II",
          slug: "monograph-frame-2",
          image_url: "/uploads/mountain_sunset.jpg",
          alt_text: "Monograph Frame II",
          category_id: "c0000000-0000-0000-0000-000000000004",
          category_name: "Architecture",
          category_slug: "architecture",
          is_published: true,
          is_featured: false,
          is_visible: true,
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
  }

  async create(project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    try {
      const sql = `
        INSERT INTO projects (
          title, slug, short_description, description, cover_image_url,
          category_id, location, project_date, is_published, is_featured,
          featured_order, featured_start_date, featured_end_date,
          show_in_search, show_related_projects, enable_gallery,
          enable_before_after, show_enquiry_cta, allow_sharing, tags,
          is_visible, sort_order
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22
        ) RETURNING *
      `;
      const params = [
        project.title,
        project.slug,
        project.short_description || null,
        project.description || null,
        project.cover_image_url || null,
        project.category_id || null,
        project.location || null,
        project.project_date || null,
        project.is_published ?? false,
        project.is_featured ?? false,
        project.featured_order ?? 0,
        project.featured_start_date || null,
        project.featured_end_date || null,
        project.show_in_search ?? true,
        project.show_related_projects ?? true,
        project.enable_gallery ?? true,
        project.enable_before_after ?? false,
        project.show_enquiry_cta ?? true,
        project.allow_sharing ?? true,
        project.tags || [],
        project.is_visible ?? true,
        project.sort_order ?? 0,
      ];
      const result = await query(sql, params);
      return result.rows[0];
    } catch (err) {
      console.warn("DB create project failed, inserting to in-memory store:", (err as Error).message);
      const newProj: ProjectWithDetails = {
        id: `pr-${Date.now()}`,
        title: project.title!,
        slug: project.slug!,
        short_description: project.short_description,
        description: project.description,
        cover_image_url: project.cover_image_url,
        category_id: project.category_id,
        location: project.location,
        project_date: project.project_date,
        is_published: project.is_published ?? false,
        is_featured: project.is_featured ?? false,
        featured_order: project.featured_order ?? 0,
        featured_start_date: project.featured_start_date,
        featured_end_date: project.featured_end_date,
        show_in_search: project.show_in_search ?? true,
        show_related_projects: project.show_related_projects ?? true,
        enable_gallery: project.enable_gallery ?? true,
        enable_before_after: project.enable_before_after ?? false,
        show_enquiry_cta: project.show_enquiry_cta ?? true,
        allow_sharing: project.allow_sharing ?? true,
        tags: project.tags || [],
        is_visible: project.is_visible ?? true,
        sort_order: project.sort_order ?? 0,
        photo_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DEMO_PROJECTS.unshift(newProj);
      return newProj;
    }
  }

  async update(id: string, updates: Partial<ProjectEntity>): Promise<ProjectEntity | null> {
    try {
      const keys = Object.keys(updates);
      if (keys.length === 0) return this.findById(id);

      const setClauses: string[] = [];
      const values: any[] = [];

      keys.forEach((key) => {
        values.push((updates as any)[key]);
        setClauses.push(`${key} = $${values.length}`);
      });

      values.push(id);
      const sql = `
        UPDATE projects 
        SET ${setClauses.join(", ")}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *
      `;
      const result = await query(sql, values);
      return result.rows[0] || null;
    } catch (err) {
      console.warn("DB update project failed, updating in-memory store:", (err as Error).message);
      const idx = DEMO_PROJECTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        DEMO_PROJECTS[idx] = {
          ...DEMO_PROJECTS[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return DEMO_PROJECTS[idx];
      }
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      console.warn("DB delete project failed, deleting from in-memory store:", (err as Error).message);
      const idx = DEMO_PROJECTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        DEMO_PROJECTS.splice(idx, 1);
        return true;
      }
      return false;
    }
  }

  async addPhoto(projectId: string, photoId: string, sortOrder: number = 0): Promise<void> {
    try {
      await query(
        `INSERT INTO project_photos (project_id, photo_id, sort_order)
         VALUES ($1, $2, $3)
         ON CONFLICT (project_id, photo_id) DO UPDATE SET sort_order = EXCLUDED.sort_order`,
        [projectId, photoId, sortOrder]
      );
    } catch (err) {
      console.warn("DB addPhoto to project failed, updating in-memory:", (err as Error).message);
      const exists = DEMO_PROJECT_PHOTOS.find(
        (pp) => pp.project_id === projectId && pp.photo_id === photoId
      );
      if (!exists) {
        DEMO_PROJECT_PHOTOS.push({
          id: Math.random().toString(),
          project_id: projectId,
          photo_id: photoId,
          sort_order: sortOrder,
        });
      }
    }
  }

  async removePhoto(projectId: string, photoId: string): Promise<void> {
    try {
      await query("DELETE FROM project_photos WHERE project_id = $1 AND photo_id = $2", [
        projectId,
        photoId,
      ]);
    } catch (err) {
      console.warn("DB removePhoto from project failed, updating in-memory:", (err as Error).message);
      const idx = DEMO_PROJECT_PHOTOS.findIndex(
        (pp) => pp.project_id === projectId && pp.photo_id === photoId
      );
      if (idx !== -1) {
        DEMO_PROJECT_PHOTOS.splice(idx, 1);
      }
    }
  }

  async reorderProjectPhotos(
    projectId: string,
    items: { photo_id: string; sort_order: number }[]
  ): Promise<void> {
    try {
      for (const item of items) {
        await query(
          "UPDATE project_photos SET sort_order = $1 WHERE project_id = $2 AND photo_id = $3",
          [item.sort_order, projectId, item.photo_id]
        );
      }
    } catch (err) {
      console.warn("DB reorder project_photos failed, updating in-memory:", (err as Error).message);
      for (const item of items) {
        const link = DEMO_PROJECT_PHOTOS.find(
          (pp) => pp.project_id === projectId && pp.photo_id === item.photo_id
        );
        if (link) link.sort_order = item.sort_order;
      }
    }
  }
}
