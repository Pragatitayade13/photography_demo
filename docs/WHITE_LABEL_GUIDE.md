# White-Label Customization & Agency Rebranding Guide

**Purpose:** Complete guide for agencies, freelancers, and software providers on deploying and rebranding the photography platform for multiple client photographers.

---

## 1. Zero-Code Rebranding Capabilities

A new photographer or client can fully personalize their web presence without modifying a single line of application source code:

1. **Brand Identity**:
   - Studio Name & Logo mark (`/admin/settings`)
   - Favicon & Apple Touch Icons (`/admin/appearance`)
   - Photographer biography, awards, gear list, and timeline (`/admin/about`)
2. **Visual Aesthetics & Themes**:
   - Choose between luxury editorial themes (*Obsidian Black, Warm Cashmere, Minimal Ivory*)
   - Custom Accent color picker affecting CTAs, gallery badges, and active pills
3. **Contact & Commercial Details**:
   - Studio locations, primary email, VIP WhatsApp line, and operating currency
4. **Editorial Categorization**:
   - Add/remove genres (*Weddings, Fashion, Commercial, Architecture, High-End Portraiture*)
5. **SEO & Social Share Cards**:
   - Custom meta title templates, social graph previews, and canonical domains

---

## 2. Agency Deployment Checklist for a New Client

| Step | Action | CMS Location | Time Estimate |
| :--- | :--- | :--- | :--- |
| **1** | Run database migration scripts or initialize empty DB | Terminal | 2 mins |
| **2** | Create Admin account with client's email | `/admin/login` | 1 min |
| **3** | Upload client's Logo, Favicon, and Profile Portrait | `/admin/settings` | 3 mins |
| **4** | Setup custom categories (e.g. Destination Weddings, Editorial) | `/admin/categories` | 3 mins |
| **5** | Upload 6-12 featured project stories with high-res photos | `/admin/projects` | 15 mins |
| **6** | Configure client's inquiry notification destination email | `/admin/notifications` | 2 mins |
| **7** | Connect client's custom domain & SSL | Nginx / DNS | 5 mins |
| **Total** | **Full bespoke portfolio deployed & ready** | | **~30 mins** |

---

## 3. Architecture for Reselling

```
┌──────────────────────────────────────────────────────────┐
│                    Single Core Codebase                  │
│       (React 18 + Vite + Tailwind + Express + Postgres)  │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
    ┌────────▼────────┐           ┌────────▼────────┐
    │  Client Site A  │           │  Client Site B  │
    │  "Elena Vance"  │           │  "Marcus Thorne"│
    │  elena-wed.com  │           │  thorne-edit.com│
    │  [DB: tenant_a] │           │  [DB: tenant_b] │
    └─────────────────┘           └─────────────────┘
```
