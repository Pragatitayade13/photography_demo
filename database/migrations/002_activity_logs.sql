-- =================================================================
-- Migration 002: Activity Logs Table (VS-03)
-- =================================================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH, LOGIN, LOGOUT
    entity_type VARCHAR(50) NOT NULL, -- PHOTO, PROJECT, CATEGORY, HOMEPAGE, ABOUT, SETTINGS, MESSAGE, AUTH
    entity_id UUID,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for retrieving recent activities efficiently
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
