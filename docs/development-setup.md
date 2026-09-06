# Development Setup Guide

## Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14 (Local instance or Supabase PostgreSQL URI)

## Step-by-Step Setup

### 1. Clone & Navigate
```bash
git clone <repository_url>
cd photography-platform
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Update DATABASE_URL and JWT_SECRET in .env
npm install
```

### 3. Configure Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
```

### 4. Database Setup
Execute the initial SQL migration located in `database/migrations/001_initial_setup.sql` on your PostgreSQL database.
Execute seed script `database/seed/seed.sql` for sample data.

### 5. Running the Servers
- Backend:
  ```bash
  cd backend && npm run dev
  ```
- Frontend:
  ```bash
  cd frontend && npm run dev
  ```
