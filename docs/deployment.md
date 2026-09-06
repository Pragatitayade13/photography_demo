# Deployment Guide

## Target Environment Architecture
- **Frontend**: Vercel / Netlify / Cloudflare Pages (Static SPA)
- **Backend API**: Render / Railway / AWS ECS / Google Cloud Run (Container / Node.js service)
- **Database**: Supabase PostgreSQL / AWS RDS / Neon
- **Media Storage**: Supabase Storage / AWS S3 / Cloudinary

## Production Checklist
1. `NODE_ENV=production`
2. Set secure, random `JWT_SECRET` (minimum 32 characters)
3. Set `CORS_ORIGIN` to the exact production frontend domain
4. Apply database migrations to the target database instance
5. Verify SSL/TLS certificates and security headers (Helmet enabled by default)
6. Ensure rate-limiting is enabled for public mutation endpoints
