-- Migration 011: Performance, Image Optimization & Security (VS-15)

-- 1. Media Assets Table
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(20) NOT NULL,
    file_size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    aspect_ratio DECIMAL(10, 4),
    storage_path TEXT NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'PUBLIC', 'PRIVATE', 'DRAFT', 'ARCHIVED'
    processing_status VARCHAR(30) NOT NULL DEFAULT 'READY', -- 'PENDING', 'PROCESSING', 'READY', 'FAILED', 'RETRY_REQUIRED'
    processing_error TEXT,
    alt_text TEXT,
    caption TEXT,
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Media Variants Table
CREATE TABLE IF NOT EXISTS media_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    variant_name VARCHAR(50) NOT NULL, -- 'thumbnail', 'small', 'medium', 'large', 'xlarge', 'original'
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(media_id, variant_name)
);

-- 3. Security Logs Table
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- 'AUTH_SUCCESS', 'AUTH_FAILED', 'RATE_LIMIT_EXCEEDED', 'UNAUTHORIZED_ACCESS', 'SUSPICIOUS_UPLOAD', 'CSRF_BLOCKED'
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARNING', 'CRITICAL'
    user_id UUID,
    ip_address VARCHAR(100),
    user_agent TEXT,
    request_path TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. System Errors Table
CREATE TABLE IF NOT EXISTS system_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code VARCHAR(100),
    message TEXT NOT NULL,
    stack_trace TEXT,
    request_path TEXT,
    request_method VARCHAR(20),
    user_id UUID,
    severity VARCHAR(20) NOT NULL DEFAULT 'ERROR', -- 'WARNING', 'ERROR', 'FATAL'
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 5. Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL, -- 'FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'API_LATENCY'
    metric_value DECIMAL(12, 4) NOT NULL,
    page_path TEXT,
    device_type VARCHAR(30), -- 'desktop', 'mobile', 'tablet'
    connection_type VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance & Security Query Indexes
CREATE INDEX IF NOT EXISTS idx_media_visibility ON media_assets(visibility);
CREATE INDEX IF NOT EXISTS idx_media_processing_status ON media_assets(processing_status);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media_assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_event ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_system_errors_resolved ON system_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_system_errors_created_at ON system_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
