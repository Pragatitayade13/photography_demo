-- =================================================================
-- Migration 004: Photos Management Enhancements (VS-05)
-- =================================================================

ALTER TABLE photos
ADD COLUMN IF NOT EXISTS slug VARCHAR(280),
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS width INTEGER,
ADD COLUMN IF NOT EXISTS height INTEGER,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(50);

-- Indices for performance and filtering
CREATE INDEX IF NOT EXISTS idx_photos_slug ON photos(LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_photos_category_published ON photos(category_id, is_published, is_visible);
CREATE INDEX IF NOT EXISTS idx_photos_featured_published ON photos(is_featured, is_published, is_visible);
CREATE INDEX IF NOT EXISTS idx_photos_sort_order ON photos(sort_order ASC);
