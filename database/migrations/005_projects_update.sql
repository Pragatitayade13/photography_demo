-- =================================================================
-- Migration 005: Projects & Gallery Management (VS-06)
-- =================================================================

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS slug VARCHAR(280),
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS project_date DATE,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true NOT NULL;

-- Ensure indexes on projects
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_projects_category_published ON projects(category_id, is_published, is_visible);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured, is_published, is_visible);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order ASC);

-- Create project_photos junction table if not exists
CREATE TABLE IF NOT EXISTS project_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_project_photo UNIQUE(project_id, photo_id)
);

CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON project_photos(project_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_project_photos_photo_id ON project_photos(photo_id);
