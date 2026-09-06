# Premium Photography Showcase & CMS Platform

A luxury, editorial-grade photography showcase website and content management platform built with React, TypeScript, Tailwind CSS, Node.js, Express, and PostgreSQL.

## System Architecture

```text
photography-platform/
├── frontend/          # React (Vite) + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript + PostgreSQL
├── database/          # SQL Migrations and seed scripts
└── docs/              # System documentation and guides
```

## Quick Start

### 1. Prerequisites
- Node.js 18+ / npm 9+
- PostgreSQL database (or Supabase instance)

### 2. Environment Setup
Copy the example environment files:
```bash
# In backend/
cp .env.example .env

# In frontend/
cp .env.example .env
```

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run Development Servers
```bash
# Start backend API (http://localhost:5000)
cd backend && npm run dev

# Start frontend application (http://localhost:5173)
cd frontend && npm run dev
```

## API Health Check
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "Photography Platform API is running",
  "timestamp": "2026-09-01T20:00:00.000Z"
}
```

## Documentation
- [System Architecture](docs/architecture.md)
- [Development Setup](docs/development-setup.md)
- [Database Schema](docs/database.md)
- [API Conventions](docs/api-conventions.md)
- [Deployment Guide](docs/deployment.md)
