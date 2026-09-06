import { query } from "../../database/db.js";
import {
  MediaAsset,
  MediaVariant,
  MediaFilterQuery,
  MediaListResponse,
  UpdateMediaMetadataDto,
  MediaVisibility,
} from "./media.types.js";
import crypto from "crypto";

// Fallback in-memory media store for offline demonstration resilience
const fallbackMedia: Map<string, MediaAsset> = new Map();

// Seed initial mock media assets
const seedMockMedia = () => {
  if (fallbackMedia.size > 0) return;

  const mock1: MediaAsset = {
    id: "770e8400-e29b-41d4-a716-446655440001",
    original_filename: "editorial-lake-como-sunset.jpg",
    stored_filename: "media_770e8400_editorial-lake-como.webp",
    mime_type: "image/webp",
    file_extension: "webp",
    file_size: 1420800,
    width: 2400,
    height: 1600,
    aspect_ratio: 1.5,
    storage_path: "/uploads/wedding_arch.jpg",
    visibility: "PUBLIC",
    processing_status: "READY",
    processing_error: null,
    alt_text: "Luxury Destination Wedding under Floral Arch Ceremony",
    caption: "Editorial Couple Showcase · Lake Como",
    uploaded_by: "system",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    variants: [
      {
        id: "var-1",
        media_id: "770e8400-e29b-41d4-a716-446655440001",
        variant_name: "thumbnail",
        width: 320,
        height: 213,
        mime_type: "image/jpeg",
        file_size: 24000,
        storage_path: "/uploads/thumb_wedding_arch.jpg",
        created_at: new Date().toISOString(),
      },
      {
        id: "var-2",
        media_id: "770e8400-e29b-41d4-a716-446655440001",
        variant_name: "small",
        width: 640,
        height: 427,
        mime_type: "image/jpeg",
        file_size: 98000,
        storage_path: "/uploads/wedding_arch.jpg",
        created_at: new Date().toISOString(),
      },
      {
        id: "var-3",
        media_id: "770e8400-e29b-41d4-a716-446655440001",
        variant_name: "medium",
        width: 1024,
        height: 683,
        mime_type: "image/jpeg",
        file_size: 240000,
        storage_path: "/uploads/wedding_arch.jpg",
        created_at: new Date().toISOString(),
      },
      {
        id: "var-4",
        media_id: "770e8400-e29b-41d4-a716-446655440001",
        variant_name: "large",
        width: 1600,
        height: 1067,
        mime_type: "image/jpeg",
        file_size: 580000,
        storage_path: "/uploads/hd_wedding_arch.jpg",
        created_at: new Date().toISOString(),
      },
    ],
  };

  const mock2: MediaAsset = {
    id: "770e8400-e29b-41d4-a716-446655440002",
    original_filename: "editorial-portrait-woman.jpg",
    stored_filename: "portrait_woman.jpg",
    mime_type: "image/jpeg",
    file_extension: "jpg",
    file_size: 980200,
    width: 2000,
    height: 2500,
    aspect_ratio: 0.8,
    storage_path: "/uploads/portrait_woman.jpg",
    visibility: "PUBLIC",
    processing_status: "READY",
    processing_error: null,
    alt_text: "Natural Light Editorial Character Portrait in Paris Atelier",
    caption: "Haute Couture Editorial · Paris",
    uploaded_by: "system",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    variants: [
      {
        id: "var-5",
        media_id: "770e8400-e29b-41d4-a716-446655440002",
        variant_name: "thumbnail",
        width: 320,
        height: 400,
        mime_type: "image/jpeg",
        file_size: 28000,
        storage_path: "/uploads/thumb_portrait_woman.jpg",
        created_at: new Date().toISOString(),
      },
      {
        id: "var-6",
        media_id: "770e8400-e29b-41d4-a716-446655440002",
        variant_name: "medium",
        width: 1024,
        height: 1280,
        mime_type: "image/jpeg",
        file_size: 260000,
        storage_path: "/uploads/portrait_woman.jpg",
        created_at: new Date().toISOString(),
      },
    ],
  };

  fallbackMedia.set(mock1.id, mock1);
  fallbackMedia.set(mock2.id, mock2);
};

seedMockMedia();

export class MediaRepository {
  async findById(id: string): Promise<MediaAsset | null> {
    try {
      const res = await query(
        `SELECT m.*, 
                COALESCE(
                  json_agg(v.*) FILTER (WHERE v.id IS NOT NULL),
                  '[]'
                ) as variants
         FROM media_assets m
         LEFT JOIN media_variants v ON m.id = v.media_id
         WHERE m.id = $1
         GROUP BY m.id`,
        [id]
      );
      if (res.rows.length === 0) return fallbackMedia.get(id) || null;
      return res.rows[0];
    } catch {
      return fallbackMedia.get(id) || null;
    }
  }

  async findPublicById(id: string): Promise<MediaAsset | null> {
    const asset = await this.findById(id);
    if (!asset || asset.visibility !== "PUBLIC" || asset.processing_status !== "READY") {
      return null;
    }
    return asset;
  }

  async findPublicByIds(ids: string[]): Promise<MediaAsset[]> {
    try {
      const res = await query(
        `SELECT m.*, 
                COALESCE(
                  json_agg(v.*) FILTER (WHERE v.id IS NOT NULL),
                  '[]'
                ) as variants
         FROM media_assets m
         LEFT JOIN media_variants v ON m.id = v.media_id
         WHERE m.id = ANY($1) AND m.visibility = 'PUBLIC' AND m.processing_status = 'READY'
         GROUP BY m.id`,
        [ids]
      );
      if (res.rows.length > 0) return res.rows;
    } catch {
      // ignore
    }

    return ids
      .map((id) => fallbackMedia.get(id))
      .filter((m): m is MediaAsset => Boolean(m && m.visibility === "PUBLIC" && m.processing_status === "READY"));
  }

  async findAll(filter: MediaFilterQuery): Promise<MediaListResponse> {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const offset = (page - 1) * limit;

    try {
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (filter.search) {
        conditions.push(`(m.original_filename ILIKE $${idx} OR m.alt_text ILIKE $${idx} OR m.caption ILIKE $${idx})`);
        values.push(`%${filter.search}%`);
        idx++;
      }

      if (filter.visibility) {
        conditions.push(`m.visibility = $${idx}`);
        values.push(filter.visibility);
        idx++;
      }

      if (filter.processing_status) {
        conditions.push(`m.processing_status = $${idx}`);
        values.push(filter.processing_status);
        idx++;
      }

      if (filter.mime_type) {
        conditions.push(`m.mime_type = $${idx}`);
        values.push(filter.mime_type);
        idx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const sortField = filter.sort_by === "file_size" ? "m.file_size" : filter.sort_by === "original_filename" ? "m.original_filename" : "m.created_at";
      const sortOrder = filter.sort_order === "asc" ? "ASC" : "DESC";

      const countRes = await query(`SELECT COUNT(*) as total FROM media_assets m ${whereClause}`, values);
      const total = parseInt(countRes.rows[0]?.total || "0", 10);

      values.push(limit, offset);
      const dataRes = await query(
        `SELECT m.*, 
                COALESCE(
                  json_agg(v.*) FILTER (WHERE v.id IS NOT NULL),
                  '[]'
                ) as variants
         FROM media_assets m
         LEFT JOIN media_variants v ON m.id = v.media_id
         ${whereClause}
         GROUP BY m.id
         ORDER BY ${sortField} ${sortOrder}
         LIMIT $${idx} OFFSET $${idx + 1}`,
        values
      );

      return {
        items: dataRes.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch {
      // Fallback
      let items = Array.from(fallbackMedia.values());
      if (filter.search) {
        const q = filter.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.original_filename.toLowerCase().includes(q) ||
            (i.alt_text && i.alt_text.toLowerCase().includes(q)) ||
            (i.caption && i.caption.toLowerCase().includes(q))
        );
      }
      if (filter.visibility) {
        items = items.filter((i) => i.visibility === filter.visibility);
      }
      if (filter.processing_status) {
        items = items.filter((i) => i.processing_status === filter.processing_status);
      }
      if (filter.mime_type) {
        items = items.filter((i) => i.mime_type === filter.mime_type);
      }

      const total = items.length;
      const paginated = items.slice(offset, offset + limit);

      return {
        items: paginated,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }
  }

  async create(asset: Omit<MediaAsset, "id" | "created_at" | "updated_at">): Promise<MediaAsset> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newAsset: MediaAsset = {
      ...asset,
      id,
      created_at: now,
      updated_at: now,
      variants: asset.variants || [],
    };

    try {
      await query(
        `INSERT INTO media_assets (
          id, original_filename, stored_filename, mime_type, file_extension,
          file_size, width, height, aspect_ratio, storage_path, visibility,
          processing_status, processing_error, alt_text, caption, uploaded_by,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          id,
          newAsset.original_filename,
          newAsset.stored_filename,
          newAsset.mime_type,
          newAsset.file_extension,
          newAsset.file_size,
          newAsset.width,
          newAsset.height,
          newAsset.aspect_ratio,
          newAsset.storage_path,
          newAsset.visibility,
          newAsset.processing_status,
          newAsset.processing_error,
          newAsset.alt_text,
          newAsset.caption,
          newAsset.uploaded_by,
          now,
          now,
        ]
      );

      if (newAsset.variants && newAsset.variants.length > 0) {
        for (const v of newAsset.variants) {
          const varId = crypto.randomUUID();
          await query(
            `INSERT INTO media_variants (id, media_id, variant_name, width, height, mime_type, file_size, storage_path)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [varId, id, v.variant_name, v.width, v.height, v.mime_type, v.file_size, v.storage_path]
          );
        }
      }
    } catch {
      // in-memory fallback
    }

    fallbackMedia.set(id, newAsset);
    return newAsset;
  }

  async updateMetadata(id: string, dto: UpdateMediaMetadataDto): Promise<MediaAsset | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: MediaAsset = {
      ...existing,
      ...dto,
      updated_at: new Date().toISOString(),
    };

    try {
      await query(
        `UPDATE media_assets 
         SET alt_text = COALESCE($1, alt_text),
             caption = COALESCE($2, caption),
             visibility = COALESCE($3, visibility),
             updated_at = NOW()
         WHERE id = $4`,
        [dto.alt_text ?? null, dto.caption ?? null, dto.visibility ?? null, id]
      );
    } catch {
      // ignore
    }

    fallbackMedia.set(id, updated);
    return updated;
  }

  async updateVisibility(id: string, visibility: MediaVisibility): Promise<MediaAsset | null> {
    return this.updateMetadata(id, { visibility });
  }

  async updateProcessingStatus(
    id: string,
    status: MediaAsset["processing_status"],
    error: string | null = null,
    variants?: MediaVariant[]
  ): Promise<MediaAsset | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: MediaAsset = {
      ...existing,
      processing_status: status,
      processing_error: error,
      variants: variants ?? existing.variants,
      updated_at: new Date().toISOString(),
    };

    try {
      await query(
        `UPDATE media_assets 
         SET processing_status = $1,
             processing_error = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [status, error, id]
      );
    } catch {
      // ignore
    }

    fallbackMedia.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await query(`DELETE FROM media_assets WHERE id = $1`, [id]);
    } catch {
      // ignore
    }
    return fallbackMedia.delete(id);
  }
}
