-- =================================================================
-- Migration 007: Site Settings, Branding & Global CMS (VS-11)
-- =================================================================

-- 1. Ensure/Update Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name VARCHAR(255) DEFAULT 'Alex Mercer Photography' NOT NULL,
    photographer_name VARCHAR(255) DEFAULT 'Alex Mercer' NOT NULL,
    tagline VARCHAR(255) DEFAULT 'Visual Narratives & Editorial Chiaroscuro',
    description TEXT DEFAULT 'Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination celebrations across Europe and Asia.',
    website_status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL, -- ACTIVE, MAINTENANCE, PRIVATE
    default_cta_text VARCHAR(100) DEFAULT 'Inquire Commission',
    default_cta_url VARCHAR(255) DEFAULT '/contact',
    location VARCHAR(255) DEFAULT 'Paris · Lake Como · Milan · Tokyo · New York',
    timezone VARCHAR(100) DEFAULT 'Europe/Paris',
    
    -- Branding Assets
    logo_url TEXT DEFAULT '',
    logo_dark_url TEXT DEFAULT '',
    logo_light_url TEXT DEFAULT '',
    favicon_url TEXT DEFAULT '',
    og_image_url TEXT DEFAULT '',
    brand_name VARCHAR(255) DEFAULT 'Alex Mercer Studio Atelier',
    brand_tagline VARCHAR(255) DEFAULT 'Studio Atelier & Monograph Archive',
    
    -- Contact Details
    public_email VARCHAR(255) DEFAULT 'studio@alexmercer.com',
    public_phone VARCHAR(100) DEFAULT '+1 (555) 019-2834',
    whatsapp_number VARCHAR(100) DEFAULT '+1 (555) 019-2834',
    availability_text VARCHAR(255) DEFAULT 'Accepting 2026/2027 Commissions Worldwide',
    response_time_text VARCHAR(255) DEFAULT 'Inquiries responded within 24 business hours',
    business_hours VARCHAR(255) DEFAULT 'Mon - Fri: 09:00 - 18:00 CET',
    
    -- Advanced / Integrations
    maintenance_message TEXT DEFAULT 'The studio atelier is currently undergoing curation. For urgent commissions, please contact studio@alexmercer.com.',
    analytics_id VARCHAR(100) DEFAULT '',
    enable_public_enquiries BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Navigation Items Table
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'INTERNAL' NOT NULL, -- INTERNAL, EXTERNAL, ANCHOR
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    open_new_tab BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Social Links Table
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'globe',
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Footer Settings Table
CREATE TABLE IF NOT EXISTS footer_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT DEFAULT 'Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination weddings across Europe and Asia.',
    copyright_text VARCHAR(255) DEFAULT 'Alex Mercer Studio Atelier. All rights reserved. Photographs protected by international copyright law.',
    show_social_links BOOLEAN DEFAULT true NOT NULL,
    show_contact BOOLEAN DEFAULT true NOT NULL,
    show_navigation BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_title VARCHAR(255) DEFAULT 'Alex Mercer — Luxury Editorial & Destination Wedding Photography',
    meta_description TEXT DEFAULT 'Bespoke fine art, architectural monograph, and high-fashion wedding photography based in Paris and Lake Como. Available for worldwide commissions.',
    meta_keywords TEXT DEFAULT 'luxury photography, editorial wedding, lake como photographer, architectural photography, alex mercer',
    canonical_url VARCHAR(255) DEFAULT 'https://alexmercer.photography',
    og_title VARCHAR(255) DEFAULT 'Alex Mercer Studio Atelier — Fine Art Photography',
    og_description TEXT DEFAULT 'Award-winning medium format visual stories, architectural forms, and editorial wedding documentation.',
    og_image_url TEXT DEFAULT '',
    twitter_title VARCHAR(255) DEFAULT 'Alex Mercer Photography',
    twitter_description TEXT DEFAULT 'Visual stories and fine art monographs by Alex Mercer.',
    robots_index BOOLEAN DEFAULT true NOT NULL,
    robots_follow BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nav_items_sort ON navigation_items(sort_order ASC, is_visible);
CREATE INDEX IF NOT EXISTS idx_social_links_sort ON social_links(sort_order ASC, is_visible);
