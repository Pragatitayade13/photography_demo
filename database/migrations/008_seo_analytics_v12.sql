-- =================================================================
-- Migration 008: SEO, Analytics & Social Sharing Schema (VS-12)
-- =================================================================

-- 1. Page Specific SEO Table
CREATE TABLE IF NOT EXISTS page_seo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key VARCHAR(50) UNIQUE NOT NULL, -- home, portfolio, about, contact, services
    seo_title VARCHAR(255) NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    canonical_url TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url TEXT,
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    robots_index BOOLEAN DEFAULT true NOT NULL,
    robots_follow BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Project Specific SEO Table
CREATE TABLE IF NOT EXISTS project_seo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    seo_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    canonical_url TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url TEXT,
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    robots_index BOOLEAN DEFAULT true NOT NULL,
    robots_follow BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Analytics Settings Table
CREATE TABLE IF NOT EXISTS analytics_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) DEFAULT 'self_hosted' NOT NULL, -- self_hosted, google_analytics, plausible, matomo
    tracking_id VARCHAR(100) DEFAULT '',
    is_enabled BOOLEAN DEFAULT true NOT NULL,
    track_page_views BOOLEAN DEFAULT true NOT NULL,
    track_project_views BOOLEAN DEFAULT true NOT NULL,
    track_cta_clicks BOOLEAN DEFAULT true NOT NULL,
    track_contact_submissions BOOLEAN DEFAULT true NOT NULL,
    respect_do_not_track BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(50) NOT NULL, -- page_view, project_view, gallery_image_view, cta_click, contact_form_submit, social_share
    page_path VARCHAR(255) NOT NULL,
    project_id VARCHAR(100),
    session_hash VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance & analytics rollups
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_project ON analytics_events(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_seo_key ON page_seo(page_key);
