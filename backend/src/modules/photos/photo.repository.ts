import { query } from "../../database/db.js";
import { PhotoEntity, PhotoFilterOptions, PhotoWithCategory } from "./photo.types.js";

const DEMO_PHOTOS: PhotoWithCategory[] = [
  {
    id: "p0000000-0000-0000-0000-000000000001",
    title: "Royal Heritage Mandap & Zardozi Grandeur",
    slug: "royal-heritage-mandap-zardozi-grandeur",
    description: "Bespoke bridal portrait under grand floral arches highlighting hand-embroidered heritage lehenga with authentic kundan jewelry and regal sherwani.",
    image_url: "/uploads/wedding_royal_red_lehenga.jpg",
    thumbnail_url: "/uploads/thumb_wedding_royal_red_lehenga.jpg",
    alt_text: "Regal Indian wedding couple in grand floral archway, bride in intricate red and gold zardozi lehenga and groom in cream sherwani with safa",
    location: "The Leela Palace, Jaipur, Rajasthan",
    photo_date: "2026-07-15",
    category_id: "c0000000-0000-0000-0000-000000000003", // Weddings
    category_name: "Weddings",
    category_slug: "weddings",
    is_published: true,
    is_featured: true,
    is_visible: true,
    sort_order: 1,
    width: 2400,
    height: 2800,
    file_size: 3200000,
    mime_type: "image/jpeg",
    metadata: { camera: "Sony A1", lens: "FE 85mm f/1.4 GM II", iso: 100, aperture: "f/1.8", shutter: "1/1000s" },
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000000-0000-0000-0000-000000000002",
    title: "Ivory Varmala & Cascading Rose Petal Shower",
    slug: "ivory-varmala-cascading-rose-shower",
    description: "Sacred Jaimala garland exchange ceremony amidst an ethereal cascade of red rose petals with couple in exquisite ivory couture.",
    image_url: "/uploads/wedding_varmala_rose_shower.jpg",
    thumbnail_url: "/uploads/thumb_wedding_varmala_rose_shower.jpg",
    alt_text: "Bride and groom exchanging varmala garlands under falling red rose petals shower in elegant ivory bridal attire",
    location: "Taj Lake Palace, Udaipur, Rajasthan",
    photo_date: "2026-06-20",
    category_id: "c0000000-0000-0000-0000-000000000003", // Weddings
    category_name: "Weddings",
    category_slug: "weddings",
    is_published: true,
    is_featured: true,
    is_visible: true,
    sort_order: 2,
    width: 2400,
    height: 1600,
    file_size: 2900000,
    mime_type: "image/jpeg",
    metadata: { camera: "Hasselblad H6D-100c", lens: "HC 100mm f/2.2", iso: 64, aperture: "f/2.2", shutter: "1/1600s" },
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000000-0000-0000-0000-000000000003",
    title: "Sacred Talambralu & Golden Turmeric Blessing",
    slug: "sacred-talambralu-golden-turmeric-blessing",
    description: "Joyous showering of sacred turmeric-infused rice and pearls during auspicious traditional Vedic marriage rituals.",
    image_url: "/uploads/wedding_sacred_talambralu.jpg",
    thumbnail_url: "/uploads/thumb_wedding_sacred_talambralu.jpg",
    alt_text: "Radiant Indian bride and groom laughing together during holy Talambralu turmeric rice ceremony with warm golden lighting",
    location: "Temple Grand Pavilion, Hyderabad, Telangana",
    photo_date: "2026-07-02",
    category_id: "c0000000-0000-0000-0000-000000000003", // Weddings
    category_name: "Weddings",
    category_slug: "weddings",
    is_published: true,
    is_featured: true,
    is_visible: true,
    sort_order: 3,
    width: 2400,
    height: 3500,
    file_size: 3450000,
    mime_type: "image/jpeg",
    metadata: { camera: "Leica M11-P", lens: "Noctilux-M 50mm f/0.95", iso: 200, aperture: "f/1.2", shutter: "1/1200s" },
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000000-0000-0000-0000-000000000004",
    title: "The Serene Oonjal Swing & Kanchipuram Silk",
    slug: "serene-oonjal-swing-kanchipuram-silk",
    description: "A timeless South Indian Oonjal ceremony under ancient banyan canopies, featuring bride in pure gold zari Kanchipuram silk saree and groom in traditional pattu veshti.",
    image_url: "/uploads/wedding_traditional_oonjal.jpg",
    thumbnail_url: "/uploads/thumb_wedding_traditional_oonjal.jpg",
    alt_text: "Newlywed couple seated on traditional floral swing decorated with yellow blossoms in golden silk attire",
    location: "Heritage Coconut Grove, Chennai, Tamil Nadu",
    photo_date: "2026-07-18",
    category_id: "c0000000-0000-0000-0000-000000000003", // Weddings
    category_name: "Weddings",
    category_slug: "weddings",
    is_published: true,
    is_featured: true,
    is_visible: true,
    sort_order: 4,
    width: 2400,
    height: 3400,
    file_size: 3600000,
    mime_type: "image/jpeg",
    metadata: { camera: "Sony A7R V", lens: "FE 50mm f/1.2 GM", iso: 100, aperture: "f/1.6", shutter: "1/800s" },
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000000-0000-0000-0000-000000000005",
    title: "The Sacred Vows in Crimson & Velvet",
    slug: "sacred-vows-crimson-velvet",
    description: "Deep emotional connection during the garland exchange, enveloped in richly embroidered velvet crimson hues and blooming florals.",
    image_url: "/uploads/wedding_crimson_jaimala.jpg",
    thumbnail_url: "/uploads/thumb_wedding_crimson_jaimala.jpg",
    alt_text: "Bride in deep crimson lehenga placing floral garland on groom in embroidered burgundy sherwani amid flower shower",
    location: "Taj Umaid Bhawan Palace, Jodhpur, Rajasthan",
    photo_date: "2026-08-01",
    category_id: "c0000000-0000-0000-0000-000000000003", // Weddings
    category_name: "Weddings",
    category_slug: "weddings",
    is_published: true,
    is_featured: true,
    is_visible: true,
    sort_order: 5,
    width: 2400,
    height: 2750,
    file_size: 3100000,
    mime_type: "image/jpeg",
    metadata: { camera: "Hasselblad X2D 100C", lens: "XCD 55mm f/2.5 V", iso: 100, aperture: "f/2.5", shutter: "1/1000s" },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p0000000-0000-0000-0000-000000000006",
    title: "Dolomites Alpine Sunset & Monograph",
    slug: "dolomites-alpine-sunset-monograph",
    description: "Breathtaking mountain peaks, ridge light, and solitude captured at golden sunset in the Italian Alps.",
    image_url: "/uploads/mountain_sunset.jpg",
    thumbnail_url: "/uploads/thumb_mountain_sunset.jpg",
    alt_text: "Golden hour sunset over jagged mountain peaks with a solitary hiker on the ridge",
    location: "Tre Cime di Lavaredo, Dolomites, Italy",
    photo_date: "2026-08-10",
    category_id: "c0000000-0000-0000-0000-000000000004", // Architecture / Landscape
    category_name: "Architecture",
    category_slug: "architecture",
    is_published: true,
    is_featured: false,
    is_visible: true,
    sort_order: 6,
    width: 2400,
    height: 1960,
    file_size: 3420000,
    mime_type: "image/jpeg",
    metadata: { camera: "Leica SL2", lens: "Vario-Elmarit 24-90mm f/2.8", iso: 50, aperture: "f/8.0", shutter: "1/320s" },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class PhotoRepository {
  async findAll(options?: PhotoFilterOptions): Promise<{ photos: PhotoWithCategory[]; total: number }> {
    try {
      let sql = `
        SELECT 
          p.*,
          c.name AS category_name,
          c.slug AS category_slug
        FROM photos p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (options?.publicOnly) {
        sql += ` AND p.is_published = true AND p.is_visible = true`;
      } else {
        if (options?.is_published !== undefined) {
          params.push(options.is_published);
          sql += ` AND p.is_published = $${params.length}`;
        }
        if (options?.is_visible !== undefined) {
          params.push(options.is_visible);
          sql += ` AND p.is_visible = $${params.length}`;
        }
      }

      if (options?.is_featured !== undefined) {
        params.push(options.is_featured);
        sql += ` AND p.is_featured = $${params.length}`;
      }

      if (options?.category_id) {
        params.push(options.category_id);
        sql += ` AND p.category_id = $${params.length}`;
      }

      if (options?.category_slug) {
        params.push(options.category_slug.toLowerCase());
        sql += ` AND LOWER(c.slug) = $${params.length}`;
      }

      if (options?.search) {
        params.push(`%${options.search}%`);
        sql += ` AND (p.title ILIKE $${params.length} OR p.alt_text ILIKE $${params.length} OR p.description ILIKE $${params.length} OR p.location ILIKE $${params.length})`;
      }

      sql += ` ORDER BY p.sort_order ASC, p.created_at DESC`;

      const result = await query<PhotoWithCategory>(sql, params);
      return {
        photos: result.rows,
        total: result.rows.length,
      };
    } catch (err) {
      console.warn("Database query for photos failed, using in-memory list:", (err as Error).message);
      let list = [...DEMO_PHOTOS];

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
        list = list.filter((p) => p.category_slug?.toLowerCase() === options.category_slug?.toLowerCase());
      }

      if (options?.search) {
        const q = options.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.alt_text.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.location && p.location.toLowerCase().includes(q))
        );
      }

      return {
        photos: list.sort((a, b) => a.sort_order - b.sort_order),
        total: list.length,
      };
    }
  }

  async findById(id: string): Promise<PhotoWithCategory | null> {
    try {
      const result = await query<PhotoWithCategory>(
        `SELECT 
           p.*,
           c.name AS category_name,
           c.slug AS category_slug
         FROM photos p
         LEFT JOIN categories c ON c.id = p.category_id
         WHERE p.id = $1`,
        [id]
      );
      if (result.rows.length > 0) return result.rows[0];
    } catch (err) {
      console.warn("Database findById for photo failed, checking in-memory:", (err as Error).message);
    }
    return DEMO_PHOTOS.find((p) => p.id === id) || null;
  }

  async findBySlug(slug: string, excludeId?: string): Promise<PhotoEntity | null> {
    try {
      let sql = "SELECT * FROM photos WHERE LOWER(slug) = LOWER($1)";
      const params: any[] = [slug];
      if (excludeId) {
        sql += " AND id != $2";
        params.push(excludeId);
      }
      const result = await query<PhotoEntity>(sql, params);
      if (result.rows.length > 0) return result.rows[0];
    } catch (err) {
      console.warn("Database findBySlug for photo failed:", (err as Error).message);
    }
    return (
      DEMO_PHOTOS.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase() && (!excludeId || p.id !== excludeId)
      ) || null
    );
  }

  async create(photo: PhotoEntity): Promise<PhotoEntity> {
    try {
      const result = await query<PhotoEntity>(
        `INSERT INTO photos (
           id, title, slug, description, image_url, thumbnail_url, alt_text, 
           location, photo_date, category_id, is_published, is_featured, 
           is_visible, sort_order, width, height, file_size, mime_type, 
           metadata, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         RETURNING *`,
        [
          photo.id,
          photo.title,
          photo.slug,
          photo.description || null,
          photo.image_url,
          photo.thumbnail_url || null,
          photo.alt_text,
          photo.location || null,
          photo.photo_date || null,
          photo.category_id || null,
          photo.is_published,
          photo.is_featured,
          photo.is_visible,
          photo.sort_order,
          photo.width || null,
          photo.height || null,
          photo.file_size || null,
          photo.mime_type || null,
          JSON.stringify(photo.metadata || {}),
          photo.created_at,
          photo.updated_at,
        ]
      );
      return result.rows[0];
    } catch (err) {
      console.warn("DB create photo failed, saving to in-memory store:", (err as Error).message);
      DEMO_PHOTOS.unshift({ ...photo });
      return photo;
    }
  }

  async update(id: string, updates: Partial<PhotoEntity>): Promise<PhotoEntity | null> {
    try {
      const existing = await this.findById(id);
      if (!existing) return null;

      const updated = {
        title: updates.title ?? existing.title,
        slug: updates.slug ?? existing.slug,
        description: updates.description !== undefined ? updates.description : existing.description,
        image_url: updates.image_url ?? existing.image_url,
        thumbnail_url: updates.thumbnail_url !== undefined ? updates.thumbnail_url : existing.thumbnail_url,
        alt_text: updates.alt_text ?? existing.alt_text,
        location: updates.location !== undefined ? updates.location : existing.location,
        photo_date: updates.photo_date !== undefined ? updates.photo_date : existing.photo_date,
        category_id: updates.category_id !== undefined ? updates.category_id : existing.category_id,
        is_published: updates.is_published ?? existing.is_published,
        is_featured: updates.is_featured ?? existing.is_featured,
        is_visible: updates.is_visible ?? existing.is_visible,
        sort_order: updates.sort_order ?? existing.sort_order,
        width: updates.width !== undefined ? updates.width : existing.width,
        height: updates.height !== undefined ? updates.height : existing.height,
        file_size: updates.file_size !== undefined ? updates.file_size : existing.file_size,
        mime_type: updates.mime_type !== undefined ? updates.mime_type : existing.mime_type,
        metadata: updates.metadata !== undefined ? updates.metadata : existing.metadata,
      };

      const result = await query<PhotoEntity>(
        `UPDATE photos SET
           title = $1, slug = $2, description = $3, image_url = $4, thumbnail_url = $5,
           alt_text = $6, location = $7, photo_date = $8, category_id = $9,
           is_published = $10, is_featured = $11, is_visible = $12, sort_order = $13,
           width = $14, height = $15, file_size = $16, mime_type = $17, metadata = $18,
           updated_at = NOW()
         WHERE id = $19
         RETURNING *`,
        [
          updated.title,
          updated.slug,
          updated.description,
          updated.image_url,
          updated.thumbnail_url,
          updated.alt_text,
          updated.location,
          updated.photo_date,
          updated.category_id,
          updated.is_published,
          updated.is_featured,
          updated.is_visible,
          updated.sort_order,
          updated.width,
          updated.height,
          updated.file_size,
          updated.mime_type,
          JSON.stringify(updated.metadata || {}),
          id,
        ]
      );
      return result.rows[0];
    } catch (err) {
      console.warn("DB update photo failed, updating in-memory store:", (err as Error).message);
      const idx = DEMO_PHOTOS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        DEMO_PHOTOS[idx] = {
          ...DEMO_PHOTOS[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return DEMO_PHOTOS[idx];
      }
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await query("DELETE FROM photos WHERE id = $1 RETURNING id", [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      console.warn("DB delete photo failed, removing from in-memory store:", (err as Error).message);
      const idx = DEMO_PHOTOS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        DEMO_PHOTOS.splice(idx, 1);
        return true;
      }
      return false;
    }
  }

  async reorder(items: { id: string; sort_order: number }[]): Promise<void> {
    try {
      for (const item of items) {
        await query("UPDATE photos SET sort_order = $1, updated_at = NOW() WHERE id = $2", [
          item.sort_order,
          item.id,
        ]);
      }
    } catch (err) {
      console.warn("DB reorder photos failed, updating in-memory store:", (err as Error).message);
      for (const item of items) {
        const photo = DEMO_PHOTOS.find((p) => p.id === item.id);
        if (photo) photo.sort_order = item.sort_order;
      }
    }
  }
}
