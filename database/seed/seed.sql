-- =================================================================
-- Photography Showcase Platform - Seed Data (Development & Demo)
-- =================================================================

-- 1. Default Admin (Password: 'admin12345' hashed with bcrypt)
INSERT INTO admins (id, name, email, password_hash, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Alex Mercer',
    'admin@example.com',
    '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/voNx.oQoE8Y6vY6YfI79gL.e6',
    true
) ON CONFLICT (email) DO NOTHING;

-- 2. Default Categories
INSERT INTO categories (id, name, slug, description, is_active, sort_order)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'Editorial', 'editorial', 'High-fashion and magazine editorial shoots.', true, 1),
    ('c0000000-0000-0000-0000-000000000002', 'Portraits', 'portraits', 'Studio and environmental intimate character portraits.', true, 2),
    ('c0000000-0000-0000-0000-000000000003', 'Weddings', 'weddings', 'Cinematic and documentary style destination weddings.', true, 3),
    ('c0000000-0000-0000-0000-000000000004', 'Architecture', 'architecture', 'Contemporary spaces and geometric structures.', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- 3. Default Site Settings
INSERT INTO site_settings (
    id, brand_name, photographer_name, contact_email, contact_phone, whatsapp_number, whatsapp_default_message, theme_name
)
VALUES (
    's0000000-0000-0000-0000-000000000001',
    'Alex Mercer Studio',
    'Alex Mercer',
    'studio@alexmercer.com',
    '+1 (555) 019-2834',
    '+15550192834',
    'Hi Alex, I came across your photography portfolio and would love to discuss a project.',
    'editorial'
) ON CONFLICT DO NOTHING;

-- 4. Sample Activity Logs
INSERT INTO activity_logs (admin_id, action, entity_type, description, created_at)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'LOGIN', 'AUTH', 'Photographer logged into Studio CMS', NOW() - INTERVAL '15 minutes'),
    ('a0000000-0000-0000-0000-000000000001', 'PUBLISH', 'PROJECT', 'Published project story: "Aura & Monolith Series"', NOW() - INTERVAL '2 hours'),
    ('a0000000-0000-0000-0000-000000000001', 'CREATE', 'PHOTO', 'Uploaded 6 high-resolution editorial photographs', NOW() - INTERVAL '5 hours'),
    ('a0000000-0000-0000-0000-000000000001', 'UPDATE', 'HOMEPAGE', 'Updated Hero headline and portfolio cover imagery', NOW() - INTERVAL '1 day'),
    ('a0000000-0000-0000-0000-000000000001', 'CREATE', 'CATEGORY', 'Created new portfolio category: "Architecture"', NOW() - INTERVAL '2 days');
