# 🌟 Alex Mercer Atelier — Luxury Photography Platform & Headless CMS

> **An editorial-grade, fine-art photography showcase and full-suite studio CMS platform designed for luxury portraiture, architectural monographs, and royal destination weddings.**

---

## 📸 Visual Showcase & Screen Previews

### 1. Cinematic Homepage Hero & Asymmetrical Polaroids
![Cinematic Homepage Hero](docs/screenshots/01_homepage_hero.png)
*Cinematic hero banner with dynamic backdrop, smooth scroll animations, studio pill badge, and interactive floating polaroid compositions.*

---

### 2. Curated Portfolio & Discipline Filtering
![Portfolio & Category Gallery](docs/screenshots/02_portfolio_gallery.png)
*Curated disciplines (`Editorial`, `Portraits`, `Weddings`, `Architecture`) with instant category filtering, grid layout switches, and high-resolution lightbox preview.*

---

### 3. Deep Narrative Story Archive & Interactive Before/After Sliders
![Wedding Story & Retouch Comparison](docs/screenshots/03_wedding_story.png)
*Editorial story monograph featuring the Royal Heritage & Destination Wedding showcase, high-res full bleed gallery, and interactive before/after retouch color-grading slider.*

---

### 4. The Artist's Monograph & Statement
![About the Artist](docs/screenshots/04_about_artist.png)
*Editorial artist biography, behind-the-lens studio philosophy, philosophy highlights, and curated press citations.*

---

### 5. Commission Booking & Inquiry Flow
![Bespoke Commission Inquiry](docs/screenshots/05_contact_commission.png)
*Interactive commission inquiry interface with dynamic budget brackets (starting from ₹50,000 / $600 / €550), project scope selectors, date pickers, and direct WhatsApp / studio channels.*

---

### 6. Client Curation & Visual Shortlist Archive
![Client Shortlist Archive](docs/screenshots/06_client_shortlist.png)
*Client shortlist deck allowing clients and art directors to bookmark favorite photographs, curate custom collections, and export structured inquiry briefs.*

---

### 7. Studio Admin Dashboard & Real-Time Analytics
![Admin Control Center](docs/screenshots/07_admin_dashboard.png)
*Comprehensive administrative command center featuring live business metrics, inquiry conversion tracking, storage quotas, and recent activity logs.*

---

### 8. Visual Homepage CMS & Section Customizer
![Visual CMS Section Editor](docs/screenshots/08_admin_homepage_cms.png)
*Visual content management system allowing administrators to edit hero headlines, reorder homepage blocks, toggle live sections, and customize imagery in real time without redeployment.*

---

### 9. Client Inquiries CRM & Commission Pipeline
![Inquiries CRM Pipeline](docs/screenshots/09_admin_inquiries.png)
*Inquiries pipeline for managing incoming client bookings, status updates (`NEW`, `IN_REVIEW`, `ACCEPTED`, `ARCHIVED`), internal studio notes, and communication history.*

---

## 🏛️ System Architecture

```text
photography_demo/
├── frontend/                     # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── public/                   # Static assets, fallback uploads, and manifest
│   ├── src/
│   │   ├── components/           # Reusable UI widgets, Modals, Lightbox, SEO, Motion
│   │   ├── features/
│   │   │   ├── admin/            # CMS Dashboard, Section Editors, Inquiries, Media, SEO
│   │   │   ├── auth/             # JWT Authentication, Session context, Protected Routes
│   │   │   ├── homepage/         # Live Homepage CMS services & hooks
│   │   │   ├── photos/           # Photo management, EXIF metadata, Upload modals
│   │   │   ├── projects/         # Project & Story archives, Before/After sliders
│   │   │   ├── public/           # Public views (Home, Portfolio, Story, About, Contact)
│   │   ├── services/             # Axios API client, Interceptors, Analytics tracker
│   │   └── styles/               # Obsidian luxury design system & typography tokens
│
├── backend/                      # Node.js + Express + TypeScript + PostgreSQL
│   ├── src/
│   │   ├── config/               # Environment variables, CORS, and database pool
│   │   ├── database/             # PostgreSQL connection pool & resilient fallback engine
│   │   ├── middleware/           # Auth guards, Request validation, In-memory caching, Error handling
│   │   ├── modules/
│   │   │   ├── about/            # About page CMS data layer & controllers
│   │   │   ├── analytics/        # High-performance event ingestion & aggregated metrics
│   │   │   ├── auth/             # Admin authentication & bcrypt password hashing
│   │   │   ├── categories/       # Portfolio category management
│   │   │   ├── contact/          # Commission inquiries & notification triggers
│   │   │   ├── dashboard/        # Executive overview metrics & activity feeds
│   │   │   ├── homepage/         # Dynamic Section CMS repository & schema
│   │   │   ├── media/            # Media library & disk storage management
│   │   │   ├── notifications/    # Studio administrative alert system
│   │   │   ├── photos/           # Photo catalog with EXIF and tag management
│   │   │   ├── projects/         # Project stories, comparisons, and relations
│   │   │   ├── security/         # Audit logs, health probes, and login telemetry
│   │   │   ├── seo/              # OpenGraph, Twitter card, and sitemap generation
│   │   │   └── settings/         # Studio branding, currency, and contact configs
│   │   └── server.ts             # Express application bootstrapping
│   └── uploads/                  # High-resolution optimized image storage
│
├── database/                     # SQL DDL schemas, migrations, and seed scripts
└── docs/                         # Technical specs, architecture diagrams & screenshots
    └── screenshots/              # High-resolution PNG captures of all platform screens
```

---

## 🛠️ Technology Stack

### Frontend
- **Core Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Sub-second HMR & optimized chunking)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with bespoke luxury color palette (`#08080a` Obsidian, `#f5f2eb` Bone, `#c9a96e` Muted Gold)
- **Motion & Micro-interactions**: [Framer Motion](https://www.framer.com/motion/) (Smooth parallax, Text split reveal, Magnetic buttons)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **State Management**: Custom React Contexts with LocalStorage persistence

### Backend
- **Runtime & Server**: [Node.js](https://nodejs.org/) (v20+) with [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict type safety
- **Database Layer**: [PostgreSQL](https://www.postgresql.org/) with native `pg` connection pool + In-Memory Fallback Engine
- **Security & Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing, Helmet, Rate Limiting, and CORS policies
- **Image Processing**: High-quality Lanczos resampling, EXIF preservation, and multi-tier resolution outputs

---

## 💎 Key Features & Capabilities

### 1. Public Experience & Editorial Showcase
- **Cinematic Hero**: Full-bleed background media with dynamic floating polaroids showcasing landmark photographs.
- **Curated Disciplines**: Instant multi-category filtering (`Weddings`, `Portraits`, `Editorial`, `Architecture`).
- **Story Archive**: Deep-dive project monographs with narrative text, location tags, camera metadata, and full-screen lightbox.
- **Before / After Retouch Comparison**: Real-time split-handle interactive slider to showcase color grading and retouching craftsmanship.
- **Client Shortlist Deck**: Interactive client curation tool allowing art directors and couples to shortlist favorites and generate inquiry briefs.
- **Bespoke Commission Inquiry**: Multi-step inquiry form with dynamic budget selector (starting at ₹50,000), date selection, and instant reference ID generation.

### 2. Studio Admin CMS & Business Operations
- **Real-Time Section Editor**: Configure homepage banners, intro statements, featured projects, and category cards with zero code changes.
- **Inquiry Management CRM**: Review client inquiries, update booking statuses, log internal notes, and filter by budget.
- **Photo & Project Asset Manager**: Upload high-res photography, manage EXIF details (Focal length, Aperture, ISO, Shutter Speed), and reorder project galleries.
- **Media Asset Library**: Centralized asset repository with file size tracking and variant generation.
- **Security Logs & System Health**: Real-time diagnostic monitors, DB latency metrics, and login attempt auditing.
- **SEO & Social Graph Control**: Granular metadata, canonical tags, and OpenGraph social cards per page.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** (Optional — the backend includes an automated in-memory repository fallback for rapid offline development)

### 2. Installation

Clone the repository and install dependencies for both services:

```bash
# Clone the repository
git clone https://github.com/Pragatitayade13/photography_demo.git
cd photography_demo

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create `.env` files in both directories:

**Backend (`backend/.env`)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_key_alex_mercer_2026
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/photography_db
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Running the Development Servers

Open two terminal windows:

```bash
# Terminal 1: Start Backend API (runs on port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend App (runs on port 5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser to view the application.

---

## 🔑 Default Admin Credentials

To access the Studio Administration suite, navigate to `http://localhost:5173/admin/login`:

- **Email**: `admin@example.com`
- **Password**: `admin12345`

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | System health and database connectivity probe |
| `GET` | `/api/v1/public/homepage` | Public | Full homepage layout, sections, and metadata |
| `GET` | `/api/v1/public/photos` | Public | Catalog photos with category and search filters |
| `GET` | `/api/v1/public/projects` | Public | Public portfolio projects and featured works |
| `GET` | `/api/v1/public/projects/:slug` | Public | Detailed project story monograph and photo set |
| `POST` | `/api/v1/public/enquiries` | Public | Submit client commission inquiry |
| `POST` | `/api/v1/public/analytics/events` | Public | High-speed telemetry and click/view tracking |
| `POST` | `/api/v1/auth/login` | Public | Administrator login & JWT generation |
| `GET` | `/api/v1/auth/me` | Admin | Verify current authenticated admin session |
| `GET` | `/api/v1/admin/dashboard` | Admin | Aggregated metrics and studio summary |
| `PUT` | `/api/v1/admin/homepage/sections/:key` | Admin | Update homepage CMS section content & media |
| `POST` | `/api/v1/admin/photos` | Admin | Upload and register new photography asset |
| `GET` | `/api/v1/admin/inquiries` | Admin | Fetch and filter client commission inquiries |
| `PUT` | `/api/v1/admin/inquiries/:id` | Admin | Update inquiry status and internal studio notes |

---

## 🧪 Production Build & Verification

```bash
# Build Backend TypeScript
cd backend
npm run build

# Build Frontend Bundle
cd ../frontend
npm run build
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
All photographs and editorial imagery are protected by international copyright law.
