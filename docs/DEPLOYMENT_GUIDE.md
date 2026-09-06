# Production Deployment & Operations Manual

**Product:** Alex Mercer Studio — Photography Showcase Platform  
**Target Architecture:** Node.js (Express API) + PostgreSQL + React SPA (Vite) + Nginx Reverse Proxy (SSL)

---

## 1. System Requirements

- **Server / VPS**: Linux (Ubuntu 22.04 LTS / Debian 12 / Alpine) or Cloud Container (Docker, AWS ECS, GCP Cloud Run, DigitalOcean App Platform).
- **Node.js**: v20.x LTS or higher.
- **PostgreSQL**: v14.x or higher with `pg_trgm` and `gen_random_uuid()` enabled.
- **Memory**: Minimum 1GB RAM (2GB recommended for high-res image manipulation).
- **Disk**: 20GB+ SSD storage (or S3/Cloud Storage object bucket).

---

## 2. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://studio.yourdomain.com

# Database
DATABASE_URL=postgresql://db_user:secure_password@localhost:5432/photography_db

# Security & Sessions
JWT_SECRET=generate-a-cryptographically-secure-random-key-minimum-64-chars
COOKIE_DOMAIN=.yourdomain.com
SECURE_COOKIE=true

# Email & Notifications (Optional SMTP / Resend / SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
NOTIFICATION_DESTINATION_EMAIL=studio@yourdomain.com
```

Create a `.env.production` file in the `frontend/` directory:

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 3. Database Initialization & Migrations

Execute the SQL migrations sequentially against your production PostgreSQL instance:

```bash
# Apply migrations
psql -U db_user -d photography_db -f database/migrations/001_initial_setup.sql
psql -U db_user -d photography_db -f database/migrations/002_activity_logs.sql
psql -U db_user -d photography_db -f database/migrations/003_categories_update.sql
psql -U db_user -d photography_db -f database/migrations/004_photos_update.sql
psql -U db_user -d photography_db -f database/migrations/005_projects_update.sql
psql -U db_user -d photography_db -f database/migrations/006_homepage_sections.sql
psql -U db_user -d photography_db -f database/migrations/007_site_settings_v11.sql
psql -U db_user -d photography_db -f database/migrations/008_seo_analytics_v12.sql
psql -U db_user -d photography_db -f database/migrations/009_notifications_v13.sql
psql -U db_user -d photography_db -f database/migrations/010_advanced_portfolio_v14.sql
psql -U db_user -d photography_db -f database/migrations/011_performance_security_v15.sql
```

---

## 4. Build & Process Management

### 4.1 Build Backend
```bash
cd backend
npm install --production=false
npm run build
```

### 4.2 Build Frontend
```bash
cd ../frontend
npm install
npm run build
# Generates optimized static assets in frontend/dist/
```

### 4.3 Process Management with PM2
```bash
cd ../backend
pm2 start dist/server.js --name "photography-api" -i max
pm2 save
pm2 startup
```

---

## 5. Nginx Reverse Proxy & SSL Configuration

```nginx
# /etc/nginx/sites-available/studio.yourdomain.com

# 1. API Reverse Proxy
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 30M;
    }
}

# 2. Frontend Single Page Application
server {
    server_name studio.yourdomain.com;
    root /var/www/photography_demo/frontend/dist;
    index index.html;

    # Static asset caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### SSL Certificate via Let's Encrypt:
```bash
certbot --nginx -d studio.yourdomain.com -d api.yourdomain.com
```

---

## 6. Automated Backup Strategy

Set up a daily cron job to backup the database:

```bash
# /etc/cron.daily/backup-photography-db
pg_dump -U db_user -d photography_db | gzip > /var/backups/db_$(date +\%Y\%m\%d).sql.gz
find /var/backups/ -type f -mtime +30 -delete
```
