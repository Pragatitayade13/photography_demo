-- =================================================================
-- Migration 009: Notifications & Email Automation Schema (VS-13)
-- =================================================================

-- 1. Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_recipient_email VARCHAR(255) DEFAULT 'studio@alexmercer.com' NOT NULL,
    sender_name VARCHAR(100) DEFAULT 'Alex Mercer Studio Atelier' NOT NULL,
    sender_email VARCHAR(255) DEFAULT 'notifications@alexmercer.com' NOT NULL,
    reply_to_email VARCHAR(255) DEFAULT 'studio@alexmercer.com' NOT NULL,
    notify_new_enquiry BOOLEAN DEFAULT true NOT NULL,
    send_visitor_confirmation BOOLEAN DEFAULT true NOT NULL,
    notify_status_change BOOLEAN DEFAULT true NOT NULL,
    notify_assignment BOOLEAN DEFAULT false NOT NULL,
    notify_email_failure BOOLEAN DEFAULT true NOT NULL,
    send_weekly_summary BOOLEAN DEFAULT false NOT NULL,
    in_app_notifications BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key VARCHAR(50) UNIQUE NOT NULL, -- NEW_ENQUIRY, VISITOR_CONFIRMATION, ENQUIRY_STATUS_CHANGED, etc.
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_customized BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Notification Delivery Logs Table
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) DEFAULT 'enquiry',
    entity_id VARCHAR(100),
    status VARCHAR(30) DEFAULT 'SENT' NOT NULL, -- PENDING, PROCESSING, SENT, FAILED, CANCELLED
    provider_message_id VARCHAR(100),
    error_message TEXT,
    attempt_count INTEGER DEFAULT 1 NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. In-App Notifications Table
CREATE TABLE IF NOT EXISTS in_app_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_admin_id UUID,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50) DEFAULT 'enquiry',
    entity_id VARCHAR(100),
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for rapid lookups and badge counts
CREATE INDEX IF NOT EXISTS idx_in_app_read ON in_app_notifications(is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_entity ON notification_logs(entity_id);
