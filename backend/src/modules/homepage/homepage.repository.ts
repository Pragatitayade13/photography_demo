import { query } from "../../database/db.js";
import { HomepageSectionEntity } from "./homepage.types.js";

const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionEntity[] = [
  {
    id: "sec-00000000-0000-0000-0000-000000000001",
    section_key: "hero",
    title: "Hero Banner",
    is_visible: true,
    sort_order: 1,
    configuration: {
      headline: "Moments Sculpted in Light & Emotion",
      subheadline: "Fine-art destination weddings, international haute couture, and sculptural architecture documented on medium-format sensors.",
      media_type: "image",
      media_url: "/uploads/wedding_royal_red_lehenga.jpg",
      mobile_media_url: "/uploads/wedding_royal_red_lehenga.jpg",
      primary_btn_text: "Explore Curated Works",
      primary_btn_link: "/portfolio",
      secondary_btn_text: "Reserve Commission",
      secondary_btn_link: "/contact",
    },
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-00000000-0000-0000-0000-000000000002",
    section_key: "intro",
    title: "Introduction",
    is_visible: true,
    sort_order: 2,
    configuration: {
      eyebrow: "THE ARTISTIC ATELIER",
      heading: "Where documentary truth merges with high-fashion editorial poetry.",
      description: "Based in Europe & Tokyo, undertaking commissions across Lake Como, Paris, Kyoto, and New York. Alex Mercer captures the fleeting, poetic subtleties of human emotion and monolithic architectural forms with unmatched cinematic grace.",
      image_url: "/uploads/family_golden_hour.jpg",
      button_text: "Discover The Artist's Story",
      button_link: "/about",
    },
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-00000000-0000-0000-0000-000000000003",
    section_key: "featured_projects",
    title: "Featured Project Stories",
    is_visible: true,
    sort_order: 3,
    configuration: {
      heading: "Master Series & Stories",
      subheading: "Curated multi-series documenting luxury destination weddings, couture assignments, and brutalist monographs.",
      project_ids: [
        "pr000000-0000-0000-0000-000000000001",
        "pr000000-0000-0000-0000-000000000002",
        "pr000000-0000-0000-0000-000000000003",
      ],
      max_display: 3,
    },
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-00000000-0000-0000-0000-000000000004",
    section_key: "categories",
    title: "Portfolio Categories",
    is_visible: true,
    sort_order: 4,
    configuration: {
      heading: "Curated Disciplines",
      subheading: "Explore specialized visual archives spanning haute couture, destination celebrations, intimate portraits, and architectural form.",
      show_counts: true,
    },
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-00000000-0000-0000-0000-000000000005",
    section_key: "selected_work",
    title: "Selected Photography",
    is_visible: true,
    sort_order: 5,
    configuration: {
      heading: "Curated Gallery Highlights",
      subheading: "Individual masterworks captured on medium-format Hasselblad and Leica systems with vintage German optics.",
      photo_ids: [
        "p0000000-0000-0000-0000-000000000001",
        "p0000000-0000-0000-0000-000000000002",
        "p0000000-0000-0000-0000-000000000003",
        "p0000000-0000-0000-0000-000000000004",
      ],
      max_display: 4,
    },
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-00000000-0000-0000-0000-000000000006",
    section_key: "about_preview",
    title: "About The Photographer",
    is_visible: true,
    sort_order: 6,
    configuration: {
      eyebrow: "BIOGRAPHY & DISTINCTION",
      heading: "Alex Mercer — Principal Visual Artist",
      bio_paragraphs: [
        "With over a decade documenting the world's most intimate celebrations and prominent fashion monographs, Alex blends editorial precision with unfiltered human presence.",
        "Regularly featured across Vogue Weddings, Harper's Bazaar, Elle Decor, and Architectural Digest. Dedicated to capturing legacy imagery that transcends trends.",
      ],
      portrait_image_url: "/uploads/portrait_woman.jpg",
      accolades: [
        { label: "Years Experience", value: "14+" },
        { label: "Global Destinations", value: "32" },
        { label: "International Honours", value: "28" },
      ],
      cta_text: "View Biography & Press Archive",
      cta_link: "/about",
    },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-00000000-0000-0000-0000-000000000007",
    section_key: "cta",
    title: "Call to Action",
    is_visible: true,
    sort_order: 7,
    configuration: {
      heading: "Let Us Create Something Unforgettable",
      subheading: "Now accepting limited private commissions and destination wedding dates worldwide for the upcoming seasons.",
      button_text: "Begin The Dialogue",
      button_link: "/contact",
      bg_image_url: "/uploads/family_golden_hour.jpg",
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let IN_MEMORY_SECTIONS = [...DEFAULT_HOMEPAGE_SECTIONS];

export class HomepageRepository {
  async findAll(): Promise<HomepageSectionEntity[]> {
    try {
      const result = await query<HomepageSectionEntity>(
        "SELECT * FROM homepage_sections ORDER BY sort_order ASC, created_at ASC"
      );
      if (result.rows.length > 0) return result.rows;
    } catch (err) {
      console.warn("DB findAll homepage_sections failed, using in-memory:", (err as Error).message);
    }
    return [...IN_MEMORY_SECTIONS].sort((a, b) => a.sort_order - b.sort_order);
  }

  async findByKey(sectionKey: string): Promise<HomepageSectionEntity | null> {
    try {
      const result = await query<HomepageSectionEntity>(
        "SELECT * FROM homepage_sections WHERE section_key = $1",
        [sectionKey]
      );
      if (result.rows.length > 0) return result.rows[0];
    } catch (err) {
      console.warn("DB findByKey homepage_sections failed, checking in-memory:", (err as Error).message);
    }
    return IN_MEMORY_SECTIONS.find((s) => s.section_key === sectionKey) || null;
  }

  async update(
    sectionKey: string,
    updates: Partial<HomepageSectionEntity>
  ): Promise<HomepageSectionEntity | null> {
    try {
      const existing = await this.findByKey(sectionKey);
      if (!existing) return null;

      const title = updates.title ?? existing.title;
      const is_visible = updates.is_visible ?? existing.is_visible;
      const sort_order = updates.sort_order ?? existing.sort_order;
      const configuration = updates.configuration ?? existing.configuration;

      const result = await query<HomepageSectionEntity>(
        `INSERT INTO homepage_sections (id, section_key, title, is_visible, sort_order, configuration, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (section_key) DO UPDATE SET
           title = EXCLUDED.title,
           is_visible = EXCLUDED.is_visible,
           sort_order = EXCLUDED.sort_order,
           configuration = EXCLUDED.configuration,
           updated_at = NOW()
         RETURNING *`,
        [
          existing.id,
          sectionKey,
          title,
          is_visible,
          sort_order,
          JSON.stringify(configuration),
        ]
      );
      return result.rows[0];
    } catch (err) {
      console.warn("DB update homepage section failed, updating in-memory:", (err as Error).message);
      const idx = IN_MEMORY_SECTIONS.findIndex((s) => s.section_key === sectionKey);
      if (idx !== -1) {
        IN_MEMORY_SECTIONS[idx] = {
          ...IN_MEMORY_SECTIONS[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return IN_MEMORY_SECTIONS[idx];
      }
      return null;
    }
  }

  async reorder(items: { section_key: string; sort_order: number }[]): Promise<void> {
    try {
      for (const item of items) {
        await query(
          "UPDATE homepage_sections SET sort_order = $1, updated_at = NOW() WHERE section_key = $2",
          [item.sort_order, item.section_key]
        );
      }
    } catch (err) {
      console.warn("DB reorder homepage sections failed, updating in-memory:", (err as Error).message);
      for (const item of items) {
        const sec = IN_MEMORY_SECTIONS.find((s) => s.section_key === item.section_key);
        if (sec) sec.sort_order = item.sort_order;
      }
    }
  }

  async resetToDefault(): Promise<HomepageSectionEntity[]> {
    try {
      await query("DELETE FROM homepage_sections");
      for (const sec of DEFAULT_HOMEPAGE_SECTIONS) {
        await query(
          `INSERT INTO homepage_sections (id, section_key, title, is_visible, sort_order, configuration, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            sec.id,
            sec.section_key,
            sec.title,
            sec.is_visible,
            sec.sort_order,
            JSON.stringify(sec.configuration),
            sec.created_at,
            sec.updated_at,
          ]
        );
      }
    } catch (err) {
      console.warn("DB resetToDefault failed, resetting in-memory:", (err as Error).message);
    }
    IN_MEMORY_SECTIONS = [...DEFAULT_HOMEPAGE_SECTIONS];
    return IN_MEMORY_SECTIONS;
  }
}
