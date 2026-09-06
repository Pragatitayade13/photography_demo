# Client Handover & Administrator Guide

**Product:** Alex Mercer Studio — Luxury Photography Showcase & CMS Platform  
**Target Audience:** Photographers, Studio Managers, Editorial Curators, and Content Editors  
**Version:** 1.0.0 (Production Ready)

---

## 1. Quick Start & Logging In

1. **Accessing the CMS Portal**: Navigate to `/admin/login` (or click **CMS** in the main website header/footer).
2. **Default Showroom Credentials**:
   - **Email**: `admin@alexmercer.com`
   - **Password**: `admin123`
3. **Session Security**: Sessions are secured via HTTP-only JWT cookies. Always click **Sign Out** from the bottom sidebar when using shared workstations.

---

## 2. Managing Your Website & Personal Brand

### 2.1 Updating Studio Information (`/admin/settings`)
- **Photographer & Brand Name**: Changing this updates all website headings, metadata titles, and email templates automatically.
- **Tagline & Bio Hook**: Editorial sub-headline displayed below the studio logo mark.
- **Contact Details**: Primary studio email, telephone, WhatsApp VIP direct line, and studio locations (e.g. *Paris · Lake Como · New York*).
- **Social Media Links**: Instagram, YouTube, Behance, and WhatsApp direct links for the navigation and footer.

### 2.2 Appearance & Color Palette (`/admin/appearance`)
- Choose between curated luxury editorial dark modes (*Obsidian Minimal, Warm Champagne, Editorial Ivory*).
- Accent colors dynamically tint primary action buttons, gallery highlights, and shortlist badges.

---

## 3. Managing Projects & Photography Stories

### 3.1 Creating a New Story (`/admin/projects`)
1. Click **+ New Project Story**.
2. Provide a **Title**, **Category**, **Location**, and **Shoot Date**.
3. **Cover Image**: Paste a high-resolution CDN link or pick directly from your Media Library.
4. **Editorial Story Hook**: Write a 1-2 sentence compelling summary for portfolio cards.
5. **Publishing State**:
   - **Draft**: Accessible only to you inside the CMS for review.
   - **Published**: Live across `/portfolio` and eligible for search engine indexing.
   - **Featured**: Promoted directly on the homepage showcase reel.

### 3.2 Fullscreen Lightbox & Before/After Retouching
- **Before / After Sliders**: Enable the toggle to reveal raw digital capture vs master color grade comparisons.
- **Fullscreen Zoom**: High-resolution zoom inspection up to 200% with thumbnail filmstrip navigation.

---

## 4. Media Asset Library & Uploads (`/admin/media`)

- **Supported Formats**: JPEG, PNG, WebP, AVIF (up to 25MB per file).
- **Automated Responsive Variants**: When you upload an image, the system automatically creates multi-tier responsive sizes (`thumbnail` 320w, `small` 640w, `medium` 1024w, `large` 1600w, `xlarge` 2400w).
- **Visibility States**:
  - `PUBLIC`: Accessible on portfolio pages and galleries.
  - `PRIVATE`: Protected for client proofing or private archival use.
  - `DRAFT`: Staged for editorial review.

---

## 5. Client Enquiries & Booking Management (`/admin/messages`)

- **New Inquiries Alert**: The red notification bell in the CMS header will alert you instantly when a prospective client submits a commission form.
- **Contextual Leads**: If a visitor submits an inquiry from a project page or their curated **Shortlist**, the message will automatically link the referenced projects.
- **Status Workflow**:
  - `NEW` ➔ `CONTACTED` ➔ `PROPOSAL_SENT` ➔ `CONFIRMED` ➔ `COMPLETED` / `ARCHIVED`.
- **Internal Private Notes**: Add confidential notes regarding budget agreements, venue logistics, or shoot schedules.

---

## 6. SEO & Social Sharing (`/admin/seo`)

- **Global SEO**: Edit site title template, meta descriptions, and default Open Graph sharing image.
- **Automated Sitemap & Robots**: Dynamically generated at `/sitemap.xml` and `/robots.txt` for Google, Bing, and social scrapers.

---

## 7. System Diagnostics & Support (`/admin/system/health`)

- Monitor API response times, database connection pool, storage usage, and active system alerts.
- Use **Spotlight Search (`Ctrl + K` / `Cmd + K`)** from anywhere inside the CMS to jump instantly to any project, category, photo, or inquiry.
