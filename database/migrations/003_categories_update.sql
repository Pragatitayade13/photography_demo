-- =================================================================
-- Migration 003: Category Management Enhancements (VS-04)
-- =================================================================

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true NOT NULL;

-- Ensure unique name and slug index
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name ON categories(LOWER(name));
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order ASC);
