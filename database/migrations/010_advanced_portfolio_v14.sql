-- Migration: 010_advanced_portfolio_v14.sql
-- Description: Advanced Portfolio Features, Relations, Comparisons & Client Experience (VS-14)

-- 1. Extend projects table with advanced portfolio & featured flags
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured_start_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS featured_end_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS show_in_search BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_related_projects BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS enable_gallery BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS enable_before_after BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_enquiry_cta BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_sharing BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Project relations table for curated project recommendations
CREATE TABLE IF NOT EXISTS project_relations (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  related_project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_project_relation UNIQUE (project_id, related_project_id),
  CONSTRAINT no_self_relation CHECK (project_id != related_project_id)
);

CREATE INDEX IF NOT EXISTS idx_project_relations_project_id ON project_relations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_relations_related_project_id ON project_relations(related_project_id);

-- 3. Project before/after image comparisons table
CREATE TABLE IF NOT EXISTS project_comparisons (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  before_label VARCHAR(100) DEFAULT 'Before',
  after_label VARCHAR(100) DEFAULT 'After',
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_comparisons_project_id ON project_comparisons(project_id);
