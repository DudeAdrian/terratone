# 🚀 Sofie Systems - Deployment & Production Readiness Guide

## 📋 Overview

This guide covers deploying Sofie Systems (sofie-systems-ui + sofie-backend + heartware-ui) to production environments including cloud platforms (AWS, Heroku, Azure), on-premises servers, and containerized deployments.

---

## 🎯 Pre-Deployment Checklist

### Code Quality
- [ ] All npm builds pass: `npm run build`
- [ ] No console errors or warnings
- [ ] No unhandled promise rejections
- [ ] Error boundaries implemented on pages
- [ ] API error responses handled gracefully

### Testing
- [ ] All critical user flows tested manually
- [ ] API endpoints tested with curl/Postman
- [ ] Database queries optimized (no N+1 problems)
- [ ] Response times acceptable (< 500ms typical)
- [ ] Mobile/tablet/desktop layouts responsive

### Security
- [ ] Environment variables in .env (not hardcoded)
- [ ] CORS properly configured for production domain
- [ ] HTTPS certificates ready (for cloud deployment)
- [ ] Database credentials strong (> 12 chars, mixed case)
- [ ] Sensitive data not logged or exposed
- [ ] SQL injection prevented (ORM queries only)

### Documentation
- [ ] Architecture documented (SYSTEM_ARCHITECTURE.md ✓)
- [ ] Deployment steps documented (this guide)
- [ ] Environment variables documented (.env.example ✓)
- [ ] Troubleshooting guide available (STARTUP_GUIDE.md ✓)
- [ ] API documentation complete (BACKEND_INTEGRATION_GUIDE.md ✓)

### Database
- [ ] Schema complete and migrated
- [ ] Indexes on frequently queried columns
- [ ] Seed data loaded
- [ ] Backup strategy planned
- [ ] Connection pooling configured (Prisma)

---

## 📦 Build Artifacts

### Frontend Build (sofie-systems-ui)

**Generate production bundle:**
```bash
cd sofie-systems-ui
npm run build

# Output: build/ directory
# Size: ~500KB gzipped
# Files: HTML, CSS, JS, assets
```

**Contents:**
```
build/
├── index.html              # Entry point
├── static/
│   ├── js/
│   │   ├── main.<hash>.js  # App bundle
│   │   └── *.chunk.js      # Code split chunks
│   └── css/
│       └── main.<hash>.css # Compiled styles
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
└── asset-manifest.json     # File mappings
```

### Backend Build (sofie-backend)

**Prepare for deployment:**
```bash
cd sofie-backend

# Create .env for production
cat > .env << EOF
DATABASE_URL=postgresql://user:pass@prod-db:5432/sofie
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
ENABLE_CORS=true
CORS_ORIGINS=https://yourdomain.com
EOF

# Install production dependencies only
npm install --production

# Verify build
npm run build  # if applicable
```

**No build step needed** (Node.js runs JavaScript directly)

---

## 🐳 Docker Deployment (Recommended)

### Build Docker Images

**Backend Image:**
```bash
cd sofie-backend
docker build -t sofie-backend:latest -t sofie-backend:1.0 .
```

**Frontend Image:**
```bash
cd sofie-systems-ui
docker build -t sofie-ui:latest -t sofie-ui:1.0 .
```

**docker-compose.yml (Production):**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: sofie
      POSTGRES_PASSWORD: ${DB_PASSWORD}  # From environment
      POSTGRES_DB: sofie
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sofie"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: sofie-backend:1.0
    environment:
      DATABASE_URL: postgresql://sofie:${DB_PASSWORD}@postgres:5432/sofie
      PORT: 3001
      NODE_ENV: production
      ENABLE_CORS: "true"
      CORS_ORIGINS: "https://yourdomain.com"
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/regions"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: sofie-ui:1.0
    environment:
      REACT_APP_BACKEND_URL: https://api.yourdomain.com
      REACT_APP_API_BASE_URL: https://api.yourdomain.com
    ports:
      - "80:3000"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
    driver: local
```

**Deploy:**
```bash
# Pull images from registry
docker pull your-registry/sofie-backend:1.0
docker pull your-registry/sofie-ui:1.0

# Start stack
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

---

## ☁️ AWS Deployment

### Option 1: ECS + RDS (Recommended)

**Architecture:**
```
Elastic Load Balancer (ALB)
    ↓
ECS Cluster
├── Backend Service (auto-scaling)
└── Frontend Service

RDS PostgreSQL (Multi-AZ)
└── Automated backups
```

**Steps:**

1. **Create RDS Database:**
   ```bash
   # AWS Console → RDS → Create Database
   # Engine: PostgreSQL 15
   # DB Instance Class: db.t3.micro (free tier) or higher
   # Storage: 20 GB
   # Enable automatic backups (7 days)
   # Enable Multi-AZ for production
   ```

2. **Create ECR Repositories:**
   ```bash
   # AWS Console → ECR → Create Repository
   # Create: sofie-backend
   # Create: sofie-ui
   ```

3. **Push Docker Images:**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Tag and push backend
   docker tag sofie-backend:1.0 <account-id>.dkr.ecr.us-east-1.amazonaws.com/sofie-backend:1.0
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sofie-backend:1.0

   # Tag and push frontend
   docker tag sofie-ui:1.0 <account-id>.dkr.ecr.us-east-1.amazonaws.com/sofie-ui:1.0
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sofie-ui:1.0
   ```

4. **Create ECS Task Definitions:**
   - Backend Task: 512 CPU, 1024 Memory
   - Frontend Task: 256 CPU, 512 Memory

5. **Create ECS Services:**
   - Backend Service: Port 3001, Target Group
   - Frontend Service: Port 80, Target Group

6. **Configure Load Balancer:**
   - ALB Health Checks
   - SSL/TLS certificates (ACM)
   - Route53 DNS

7. **Set Environment Variables:**
   - `DATABASE_URL` → RDS endpoint
   - `REACT_APP_BACKEND_URL` → ALB endpoint
   - `CORS_ORIGINS` → Frontend domain

**Estimated Cost:** $30-50/month (development), $200+/month (production)

---

### Option 2: Lightsail (Simplest)

**Architecture:**
```
Lightsail Container Service
├── Backend container
├── Frontend container
└── PostgreSQL in container or RDS

DNS (Route 53 or Lightsail DNS)
```

**Steps:**

```bash
# Install AWS CLI
# aws configure

# Push images to ECR (same as above)

# Create Lightsail Container Service
aws lightsail create-container-service \
  --service-name sofie-systems \
  --power micro \
  --scale 1

# Create deployment JSON
cat > deployment.json << EOF
{
  "containers": {
    "backend": {
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/sofie-backend:1.0",
      "ports": {
        "3001": "HTTP"
      },
      "environment": {
        "DATABASE_URL": "postgresql://...",
        "NODE_ENV": "production"
      }
    },
    "frontend": {
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/sofie-ui:1.0",
      "ports": {
        "3000": "HTTP"
      },
      "environment": {
        "REACT_APP_BACKEND_URL": "https://sofie-systems.com"
      }
    }
  },
  "publicEndpoint": {
    "containerName": "frontend",
    "containerPort": 3000,
    "healthCheckPath": "/"
  }
}
EOF

# Deploy
aws lightsail create-container-service-deployment \
  --service-name sofie-systems \
  --cli-input-json file://deployment.json
```

**Estimated Cost:** $5-10/month (Lightsail) + Database

---

## 🚀 Heroku Deployment

**Simple 1-click deployment:**

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku
# or download from heroku.com/downloads

# Login
heroku login

# Create Heroku app
heroku create sofie-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0 --app sofie-backend

# Deploy backend
cd sofie-backend
git push heroku main

# Check logs
heroku logs --tail --app sofie-backend

# Deploy frontend to Netlify
npm run build
netlify deploy --prod --dir build
```

**Set environment variables:**
```bash
heroku config:set \
  ENABLE_CORS=true \
  CORS_ORIGINS=https://your-netlify-domain.com \
  --app sofie-backend
```

**Estimated Cost:** $7-50/month (depending on add-ons)

---

## 🐧 On-Premises (Self-Hosted)

### Linux Server Setup

**Prerequisites:**
- Ubuntu 20.04+ or RHEL 8+
- 2+ CPU cores
- 4+ GB RAM
- 20+ GB storage
- Static IP address
- Domain name (optional but recommended)

**Installation:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Create database
sudo -u postgres createdb sofie
sudo -u postgres createuser sofie
sudo -u postgres psql -c "ALTER USER sofie WITH PASSWORD 'strong-password';"

# Create application directory
sudo mkdir -p /var/www/sofie
sudo chown $USER:$USER /var/www/sofie
cd /var/www/sofie

# Clone repositories
git clone https://github.com/DudeAdrian/sofie-backend.git
git clone https://github.com/DudeAdrian/sofie-systems-ui.git
git clone https://github.com/DudeAdrian/heartware-ui.git

# Setup backend
cd sofie-backend
npm install
npx prisma migrate deploy
node prisma/seed.js

# Setup frontend
cd ../sofie-systems-ui
npm install --legacy-peer-deps
npm run build

# Install Nginx
sudo apt-get install -y nginx

# Setup Nginx (reverse proxy)
sudo tee /etc/nginx/sites-available/sofie << EOF
upstream backend {
  server 127.0.0.1:3001;
}

server {
  listen 80;
  server_name your-domain.com;

  # Frontend
  location / {
    root /var/www/sofie/sofie-systems-ui/build;
    try_files \$uri \$uri/ /index.html;
  }

  # Backend
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/sofie /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Start backend with PM2
cd /var/www/sofie/sofie-backend
pm2 start npm --name sofie-backend -- run start
pm2 save
pm2 startup

# Install SSL certificate (Let's Encrypt)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

**Maintenance:**

```bash
# Check status
pm2 status
pm2 logs sofie-backend

# Restart
pm2 restart sofie-backend

# Update application
cd /var/www/sofie/sofie-backend
git pull origin main
npm install
npx prisma migrate deploy
pm2 restart sofie-backend

# Backup database
pg_dump sofie > backup-$(date +%Y%m%d).sql

# Check system resources
top
df -h
```

**Estimated Cost:** $5-20/month (VPS hosting)

---

## 🔒 Security Hardening

### Database Security
```bash
# Use strong passwords (minimum 16 characters)
ALTER USER sofie WITH PASSWORD 'SuperStr0ng!Password@2024';

# Restrict database access to app only
# In postgresql.conf:
listen_addresses = 'localhost'
# or whitelist specific IPs

# Enable SSL
ssl = on
ssl_cert_file = '/etc/ssl/certs/cert.pem'
ssl_key_file = '/etc/ssl/private/key.pem'
```

### Application Security
```bash
# Set secure environment variables
export NODE_ENV=production
export LOG_LEVEL=warn  # Don't log sensitive data

# Use environment variables (not hardcoded)
# DATABASE_URL, CORS_ORIGINS, API_KEYS, etc.

# Update dependencies regularly
npm audit
npm audit fix
```

### Network Security
```bash
# Use HTTPS (required)
# - AWS: ALB with SSL termination
# - Heroku: Automatic
# - Self-hosted: Let's Encrypt

# Configure CORS strictly
CORS_ORIGINS=https://yourdomain.com  # NOT *

# Use security headers in Nginx
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Data Protection
```bash
# Encrypt database backups
pg_dump sofie | gzip | gpg -c > backup.sql.gz.gpg

# Regular backups (daily minimum)
# AWS: RDS automated backups (7+ days)
# Self-hosted: Cron job: pg_dump daily

# HIPAA compliance (healthcare data)
# - Encrypt at rest: EBS encryption, database encryption
# - Encrypt in transit: HTTPS/TLS
# - Audit logging: All data access
# - Access controls: RBAC, row-level security
```

---

## 📊 Monitoring & Logging

### Application Monitoring

**PM2 Plus (Self-hosted):**
```bash
pm2 install pm2-auto-pull
pm2 monit
pm2 web  # Web dashboard on port 9615
```

**CloudWatch (AWS):**
```bash
# Logs automatically collected from ECS/ALB
# Create CloudWatch alarms for:
# - API error rate > 1%
# - Response time > 1 second
# - CPU > 80%
# - Memory > 80%
```

### Logging Strategy

**Log Levels:**
- `error` → Errors only (production)
- `warn` → Warnings + errors
- `info` → Info + warnings + errors (development)
- `debug` → Everything (development only)

**Log Aggregation:**
```bash
# Ship logs to central location
# Self-hosted: ELK Stack, Splunk
# Cloud: CloudWatch, DataDog, New Relic

# Configure in backend:
LOG_LEVEL=info
LOG_DESTINATION=cloudwatch  # or similar
```

**Database Monitoring:**
```sql
-- Check slow queries
SELECT query, calls, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size DESC;

-- Check active connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

---

## 🚀 Continuous Deployment (CI/CD)

### GitHub Actions Example

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - run: npm test  # When tests are ready

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    steps:
      - uses: actions/checkout@v3
      - run: |
          docker build -t sofie-backend:${{ github.sha }} .
          docker push ${{ secrets.REGISTRY }}/sofie-backend:${{ github.sha }}
      - run: |
          aws ecs update-service \
            --cluster sofie \
            --service sofie-backend \
            --force-new-deployment
```

---

## 📈 Performance Optimization

### Frontend Optimization
```bash
# Code splitting (automatic with Create React App)
# Bundle size: npm run build --analyze

# Image optimization
# - Use WebP format
# - Compress with imagemin
# - Lazy load images

# Caching strategy
# Static assets: 1 year
# HTML: no-cache
# API responses: session-based
```

### Backend Optimization
```javascript
// Prisma query optimization
// ❌ Bad: N+1 queries
const communities = await prisma.community.findMany();
for (const community of communities) {
  const energy = await prisma.energy.findFirst({
    where: { community_id: community.id }
  });
}

// ✅ Good: Join queries
const communities = await prisma.community.findMany({
  include: { energy: true }
});

// Indexes
// Add indexes on foreign keys and frequently filtered columns
```

### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_communities_region_id ON communities(region_id);
CREATE INDEX idx_energy_community_id ON energy(community_id);
CREATE INDEX idx_patients_community_id ON healthcare_patients(community_id);

-- Analyze query plans
EXPLAIN ANALYZE SELECT * FROM communities WHERE region_id = '...';

-- Vacuum to optimize storage
VACUUM ANALYZE;
```

---

## ✅ Post-Deployment Checklist

- [ ] Application loads in browser
- [ ] All pages accessible
- [ ] API endpoints respond
- [ ] Database queries work
- [ ] Images/assets load
- [ ] No 404 or 500 errors
- [ ] HTTPS certificate valid
- [ ] CORS headers correct
- [ ] Logs being collected
- [ ] Backups scheduled
- [ ] Monitoring alerts configured
- [ ] Performance baseline established
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on deployment

---

## 📞 Support & Rollback

### Monitoring Checklist
```bash
# Daily
- [ ] Check error logs
- [ ] Monitor database size
- [ ] Review performance metrics

# Weekly
- [ ] Analyze slow queries
- [ ] Review security logs
- [ ] Check backup status

# Monthly
- [ ] Full security audit
- [ ] Capacity planning
- [ ] Update dependencies
```

### Rollback Procedure

**If deployment fails:**
```bash
# Docker
docker-compose down
docker-compose up -d  # Restarts previous version

# Heroku
heroku releases
heroku rollback v<N>

# AWS ECS
aws ecs describe-services --cluster sofie --services sofie-backend
# Revert to previous task definition

# Self-hosted with git
cd /var/www/sofie/sofie-backend
git revert HEAD
pm2 restart sofie-backend
```

---

## 🎯 Summary

| Deployment | Setup Time | Cost | Scaling | Best For |
|-----------|-----------|------|---------|----------|
| **Docker Local** | 2 min | $0 | Manual | Development |
| **Heroku** | 5 min | $7-50 | Automatic | Small projects |
| **Lightsail** | 15 min | $5-50 | Manual | Learning |
| **AWS ECS** | 30 min | $30-200 | Automatic | Production |
| **On-Premises** | 1-2 hrs | $5-20/mo | Manual | Enterprise |

---

**Last Updated:** December 9, 2025  
**Version:** 1.0 Production Guide  
**Status:** Ready for Deployment ✅
