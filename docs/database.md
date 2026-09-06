# Database Conventions & Schema Strategy

## Schema Philosophy
- **Naming Conventions**: `snake_case` for table and column names.
- **Primary Keys**: UUID identifiers generated with `gen_random_uuid()`.
- **Standard Audit Timestamps**: `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`, `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`.
- **Publication & Ordering**:
  - `is_published BOOLEAN DEFAULT false`
  - `is_featured BOOLEAN DEFAULT false`
  - `sort_order INTEGER DEFAULT 0`

## Core Entities
1. `admins`: System administrators and photographers.
2. `categories`: Dynamic photo & project categorizations (e.g., Wedding, Editorial, Fashion, Travel).
3. `photos`: Individual photographic works with metadata and responsive image assets.
4. `projects`: Complete photo stories / assignments containing multiple gallery photos.
5. `project_photos`: Association table mapping photos to projects with ordering.
6. `homepage_sections`: Dynamic homepage content configuration.
7. `about`: Photographer biography, portrait, awards, and specialties.
8. `contact_messages`: Inbound customer inquiries with status tracking (`NEW`, `READ`, `CONTACTED`, `CLOSED`).
9. `social_links`: Social platform links (Instagram, Behance, YouTube, etc.).
10. `site_settings` & `theme_settings`: Dynamic white-label branding, typography, and palette presets.
