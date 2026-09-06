import { query } from "../../database/db.js";
import { GlobalSeoConfig, PageSeoEntity, ProjectSeoEntity, SitemapItem } from "./seo.types.js";
import { ProjectRepository } from "../projects/project.repository.js";

const projectRepo = new ProjectRepository();

// In-Memory Global SEO store & fallback
let inMemoryGlobalSeo: GlobalSeoConfig = {
  site_title: "Alex Mercer — Luxury Editorial & Destination Wedding Photography",
  meta_description:
    "Bespoke fine art, architectural monograph, and high-fashion wedding photography based in Paris and Lake Como. Available for worldwide commissions.",
  meta_keywords:
    "luxury photography, editorial wedding, lake como photographer, architectural photography, alex mercer",
  canonical_url: "https://alexmercer.photography",
  default_og_title: "Alex Mercer Studio Atelier — Fine Art Photography",
  default_og_description:
    "Award-winning medium format visual stories, architectural forms, and editorial wedding documentation.",
  default_og_image_url:
    "/uploads/wedding_arch.jpg",
  twitter_card_type: "summary_large_image",
  robots_index: true,
  robots_follow: true,
  google_verification_code: "google-site-verification=alex-mercer-studio-2026",
  bing_verification_code: "msvalidate.01=alexmercer90123",
};

// In-Memory Page SEO store
let inMemoryPageSeo: Record<string, PageSeoEntity> = {
  home: {
    id: "page-seo-1",
    page_key: "home",
    page_name: "Homepage",
    seo_title: "Alex Mercer — Fine Art & Editorial Photography Atelier",
    meta_description:
      "Explore curated visual narratives, medium-format destination weddings, and editorial monographs by Alex Mercer.",
    meta_keywords: "editorial photographer, destination wedding, lake como, fine art",
    canonical_url: "https://alexmercer.photography/",
    og_title: "Alex Mercer Studio Atelier — Visual Narratives",
    og_description: "Fine art & editorial photography across Europe, Asia, and worldwide.",
    og_image_url: "/uploads/wedding_arch.jpg",
    twitter_title: "Alex Mercer Photography",
    twitter_description: "Visual stories and fine art monographs.",
    robots_index: true,
    robots_follow: true,
    updated_at: new Date().toISOString(),
  },
  portfolio: {
    id: "page-seo-2",
    page_key: "portfolio",
    page_name: "Curated Portfolio",
    seo_title: "Curated Portfolio & Visual Monograph — Alex Mercer",
    meta_description:
      "A curated archive of architectural monographs, couture fashion stories, and European destination weddings.",
    meta_keywords: "portfolio, wedding stories, fashion editorial, lake como archive",
    canonical_url: "https://alexmercer.photography/portfolio",
    og_title: "Curated Portfolio — Alex Mercer Studio Atelier",
    og_description: "Selected monograph works and stories from Paris, Lake Como, and Tokyo.",
    og_image_url: "/uploads/mountain_sunset.jpg",
    twitter_title: "Portfolio — Alex Mercer",
    twitter_description: "Curated visual monograph collection.",
    robots_index: true,
    robots_follow: true,
    updated_at: new Date().toISOString(),
  },
  about: {
    id: "page-seo-3",
    page_key: "about",
    page_name: "Photographer Monograph & Press",
    seo_title: "About Alex Mercer — Artist Biography & Studio Philosophy",
    meta_description:
      "Discover Alex Mercer's medium format philosophy, analog darkroom heritage, published press accolades, and worldwide studio commissions.",
    meta_keywords: "about alex mercer, photographer bio, artist philosophy, awards",
    canonical_url: "https://alexmercer.photography/about",
    og_title: "Artist Monograph & Studio Philosophy — Alex Mercer",
    og_description: "Capturing monumental form and emotional chiaroscuro across the globe.",
    og_image_url: "/uploads/portrait_woman.jpg",
    twitter_title: "About Alex Mercer",
    twitter_description: "Photographer monograph and creative philosophy.",
    robots_index: true,
    robots_follow: true,
    updated_at: new Date().toISOString(),
  },
  contact: {
    id: "page-seo-4",
    page_key: "contact",
    page_name: "Studio Inquiries & Booking",
    seo_title: "Inquire Commission — Studio Representation | Alex Mercer",
    meta_description:
      "Initiate a conversation for destination wedding coverage, bespoke private commissions, and commercial licensing dates.",
    meta_keywords: "contact alex mercer, photography booking, wedding inquiry, commission",
    canonical_url: "https://alexmercer.photography/contact",
    og_title: "Initiate a Conversation — Alex Mercer Studio Atelier",
    og_description: "Reserve your date for worldwide destination commissions and fine art storytelling.",
    og_image_url: "/uploads/family_golden_hour.jpg",
    twitter_title: "Contact & Booking — Alex Mercer",
    twitter_description: "Private commission inquiries.",
    robots_index: true,
    robots_follow: true,
    updated_at: new Date().toISOString(),
  },
};

// In-Memory Project SEO store
let inMemoryProjectSeo: Record<string, ProjectSeoEntity> = {};

export class SeoRepository {
  // --- GLOBAL SEO ---
  async getGlobalSeo(): Promise<GlobalSeoConfig> {
    try {
      const res = await query("SELECT * FROM seo_settings LIMIT 1");
      if (res.rows.length > 0) {
        const r = res.rows[0];
        inMemoryGlobalSeo = {
          site_title: r.site_title || inMemoryGlobalSeo.site_title,
          meta_description: r.meta_description || inMemoryGlobalSeo.meta_description,
          meta_keywords: r.meta_keywords || inMemoryGlobalSeo.meta_keywords,
          canonical_url: r.canonical_url || inMemoryGlobalSeo.canonical_url,
          default_og_title: r.og_title || inMemoryGlobalSeo.default_og_title,
          default_og_description: r.og_description || inMemoryGlobalSeo.default_og_description,
          default_og_image_url: r.og_image_url || inMemoryGlobalSeo.default_og_image_url,
          twitter_card_type: "summary_large_image",
          robots_index: r.robots_index ?? true,
          robots_follow: r.robots_follow ?? true,
        };
      }
    } catch {
      // Handled in-memory
    }
    return inMemoryGlobalSeo;
  }

  async updateGlobalSeo(data: Partial<GlobalSeoConfig>): Promise<GlobalSeoConfig> {
    inMemoryGlobalSeo = { ...inMemoryGlobalSeo, ...data };
    try {
      await query(
        `UPDATE seo_settings SET 
          site_title = COALESCE($1, site_title),
          meta_description = COALESCE($2, meta_description),
          meta_keywords = COALESCE($3, meta_keywords),
          canonical_url = COALESCE($4, canonical_url),
          og_title = COALESCE($5, og_title),
          og_description = COALESCE($6, og_description),
          og_image_url = COALESCE($7, og_image_url),
          robots_index = COALESCE($8, robots_index),
          robots_follow = COALESCE($9, robots_follow),
          updated_at = NOW()`,
        [
          data.site_title,
          data.meta_description,
          data.meta_keywords,
          data.canonical_url,
          data.default_og_title,
          data.default_og_description,
          data.default_og_image_url,
          data.robots_index,
          data.robots_follow,
        ]
      );
    } catch {
      // Handled
    }
    return inMemoryGlobalSeo;
  }

  // --- PAGE SEO ---
  async getAllPageSeo(): Promise<PageSeoEntity[]> {
    try {
      const res = await query("SELECT * FROM page_seo");
      if (res.rows.length > 0) {
        for (const row of res.rows) {
          inMemoryPageSeo[row.page_key] = {
            id: row.id,
            page_key: row.page_key,
            page_name: inMemoryPageSeo[row.page_key]?.page_name || row.page_key,
            seo_title: row.seo_title,
            meta_description: row.meta_description,
            meta_keywords: row.meta_keywords,
            canonical_url: row.canonical_url,
            og_title: row.og_title,
            og_description: row.og_description,
            og_image_url: row.og_image_url,
            twitter_title: row.twitter_title,
            twitter_description: row.twitter_description,
            robots_index: row.robots_index,
            robots_follow: row.robots_follow,
            updated_at: row.updated_at,
          };
        }
      }
    } catch {
      // Fallback
    }
    return Object.values(inMemoryPageSeo);
  }

  async getPageSeo(pageKey: string): Promise<PageSeoEntity | null> {
    const all = await this.getAllPageSeo();
    return all.find((p) => p.page_key.toLowerCase() === pageKey.toLowerCase()) || inMemoryPageSeo[pageKey] || null;
  }

  async updatePageSeo(pageKey: string, data: Partial<PageSeoEntity>): Promise<PageSeoEntity> {
    const existing = inMemoryPageSeo[pageKey] || {
      id: `page-seo-${Date.now()}`,
      page_key: pageKey,
      page_name: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
      seo_title: data.seo_title || inMemoryGlobalSeo.site_title,
      meta_description: data.meta_description || inMemoryGlobalSeo.meta_description,
      robots_index: true,
      robots_follow: true,
      updated_at: new Date().toISOString(),
    };

    inMemoryPageSeo[pageKey] = {
      ...existing,
      ...data,
      page_key: pageKey,
      updated_at: new Date().toISOString(),
    };

    try {
      await query(
        `INSERT INTO page_seo (page_key, seo_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image_url, twitter_title, twitter_description, robots_index, robots_follow, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
         ON CONFLICT (page_key) DO UPDATE SET 
          seo_title = EXCLUDED.seo_title,
          meta_description = EXCLUDED.meta_description,
          meta_keywords = EXCLUDED.meta_keywords,
          canonical_url = EXCLUDED.canonical_url,
          og_title = EXCLUDED.og_title,
          og_description = EXCLUDED.og_description,
          og_image_url = EXCLUDED.og_image_url,
          twitter_title = EXCLUDED.twitter_title,
          twitter_description = EXCLUDED.twitter_description,
          robots_index = EXCLUDED.robots_index,
          robots_follow = EXCLUDED.robots_follow,
          updated_at = NOW()`,
        [
          pageKey,
          inMemoryPageSeo[pageKey].seo_title,
          inMemoryPageSeo[pageKey].meta_description,
          inMemoryPageSeo[pageKey].meta_keywords || "",
          inMemoryPageSeo[pageKey].canonical_url || "",
          inMemoryPageSeo[pageKey].og_title || "",
          inMemoryPageSeo[pageKey].og_description || "",
          inMemoryPageSeo[pageKey].og_image_url || "",
          inMemoryPageSeo[pageKey].twitter_title || "",
          inMemoryPageSeo[pageKey].twitter_description || "",
          inMemoryPageSeo[pageKey].robots_index,
          inMemoryPageSeo[pageKey].robots_follow,
        ]
      );
    } catch {
      // Handled
    }

    return inMemoryPageSeo[pageKey];
  }

  // --- PROJECT SEO ---
  async getProjectSeo(projectId: string): Promise<ProjectSeoEntity | null> {
    try {
      const res = await query("SELECT * FROM project_seo WHERE project_id = $1", [projectId]);
      if (res.rows.length > 0) {
        const r = res.rows[0];
        inMemoryProjectSeo[projectId] = {
          id: r.id,
          project_id: r.project_id,
          seo_title: r.seo_title,
          meta_description: r.meta_description,
          meta_keywords: r.meta_keywords,
          canonical_url: r.canonical_url,
          og_title: r.og_title,
          og_description: r.og_description,
          og_image_url: r.og_image_url,
          twitter_title: r.twitter_title,
          twitter_description: r.twitter_description,
          robots_index: r.robots_index,
          robots_follow: r.robots_follow,
          updated_at: r.updated_at,
        };
      }
    } catch {
      // Handled
    }

    if (inMemoryProjectSeo[projectId]) {
      return inMemoryProjectSeo[projectId];
    }

    // Try finding the project and synthesizing default SEO
    const project = await projectRepo.findById(projectId);
    if (!project) return null;

    return {
      id: `proj-seo-${projectId}`,
      project_id: projectId,
      project_title: project.title,
      project_slug: project.slug,
      seo_title: `${project.title} — Visual Story | Alex Mercer`,
      meta_description:
        project.short_description ||
        project.description ||
        `Visual story and medium-format monograph of ${project.title} by Alex Mercer.`,
      canonical_url: `https://alexmercer.photography/portfolio/${project.slug}`,
      og_title: `${project.title} — Alex Mercer Atelier`,
      og_description: project.short_description || project.description || undefined,
      og_image_url: project.cover_image_url || inMemoryGlobalSeo.default_og_image_url,
      robots_index: project.is_published && project.is_visible,
      robots_follow: true,
      updated_at: new Date().toISOString(),
    };
  }

  async updateProjectSeo(projectId: string, data: Partial<ProjectSeoEntity>): Promise<ProjectSeoEntity> {
    const existing = await this.getProjectSeo(projectId);
    const updated: ProjectSeoEntity = {
      ...(existing || {
        id: `proj-seo-${projectId}`,
        project_id: projectId,
        robots_index: true,
        robots_follow: true,
        updated_at: new Date().toISOString(),
      }),
      ...data,
      project_id: projectId,
      updated_at: new Date().toISOString(),
    };

    inMemoryProjectSeo[projectId] = updated;

    try {
      await query(
        `INSERT INTO project_seo (project_id, seo_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image_url, twitter_title, twitter_description, robots_index, robots_follow, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
         ON CONFLICT (project_id) DO UPDATE SET 
          seo_title = EXCLUDED.seo_title,
          meta_description = EXCLUDED.meta_description,
          meta_keywords = EXCLUDED.meta_keywords,
          canonical_url = EXCLUDED.canonical_url,
          og_title = EXCLUDED.og_title,
          og_description = EXCLUDED.og_description,
          og_image_url = EXCLUDED.og_image_url,
          twitter_title = EXCLUDED.twitter_title,
          twitter_description = EXCLUDED.twitter_description,
          robots_index = EXCLUDED.robots_index,
          robots_follow = EXCLUDED.robots_follow,
          updated_at = NOW()`,
        [
          projectId,
          updated.seo_title || "",
          updated.meta_description || "",
          updated.meta_keywords || "",
          updated.canonical_url || "",
          updated.og_title || "",
          updated.og_description || "",
          updated.og_image_url || "",
          updated.twitter_title || "",
          updated.twitter_description || "",
          updated.robots_index,
          updated.robots_follow,
        ]
      );
    } catch {
      // Handled
    }

    return updated;
  }

  // --- DYNAMIC SITEMAP XML GENERATOR ---
  async generateSitemapXml(baseUrl = "https://alexmercer.photography"): Promise<string> {
    const staticPages: SitemapItem[] = [
      { loc: `${baseUrl}/`, lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: 1.0 },
      { loc: `${baseUrl}/portfolio`, lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: 0.9 },
      { loc: `${baseUrl}/about`, lastmod: new Date().toISOString().split("T")[0], changefreq: "monthly", priority: 0.8 },
      { loc: `${baseUrl}/contact`, lastmod: new Date().toISOString().split("T")[0], changefreq: "monthly", priority: 0.8 },
    ];

    // Fetch published and visible projects
    let projects: any[] = [];
    try {
      projects = await projectRepo.findAll({ publicOnly: true, is_published: true, is_visible: true });
    } catch {
      // Handled
    }

    const projectItems: SitemapItem[] = projects.map((p) => ({
      loc: `${baseUrl}/portfolio/${p.slug}`,
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: p.is_featured ? 0.9 : 0.7,
    }));

    const allItems = [...staticPages, ...projectItems];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allItems
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
  }

  // --- DYNAMIC ROBOTS.TXT GENERATOR ---
  generateRobotsTxt(baseUrl = "https://alexmercer.photography"): string {
    const globalSeo = inMemoryGlobalSeo;
    if (!globalSeo.robots_index) {
      return `User-agent: *
Disallow: /
`;
    }

    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  }
}
