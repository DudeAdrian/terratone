# Sofie Systems Full-Stack Startup Guide

## 📋 Prerequisites
- Node.js 18+
- PostgreSQL 12+ (local or remote)
- Git

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Backend Setup
```bash
cd c:\Users\squat\sofie-backend

# Install dependencies
npm install

# Create .env with database connection
# Example for local PostgreSQL:
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/sofie" > .env
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed initial data
node prisma/seed.js
# (Optional) node prisma/healthcare-seed.js

# Start backend server
npm run dev
# ✅ Backend running on http://localhost:3001/api
```

### 2️⃣ Frontend Setup
```bash
cd c:\Users\squat\sofie-systems-ui

# Install dependencies (if not already done)
npm install --legacy-peer-deps

# Create .env.local with backend pointer
cat > .env.local << EOF
REACT_APP_BACKEND_URL=http://localhost:3001/api
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=5000
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_MODE=false
REACT_APP_WEATHER_API_KEY=demo
EOF

# Start frontend dev server
npm start
# ✅ UI running on http://localhost:3000
```

### 3️⃣ Verify Integration
```bash
# In a new terminal, test backend endpoints
curl http://localhost:3001/api/regions
curl http://localhost:3001/api/communities
curl http://localhost:3001/api/energy/production

# In browser, visit http://localhost:3000 and check:
# - Home page loads regional data
# - Map displays communities
# - Services pages show data from backend (not in-memory)
```

---

## 🔧 Detailed Setup Steps

### Backend Configuration

#### Step 1: Database Setup
**Option A: Local PostgreSQL**
```bash
# Create database
createdb sofie

# Update .env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/sofie
```

**Option B: Cloud (e.g., AWS RDS)**
```
DATABASE_URL=postgresql://user:pass@your-rds.amazonaws.com:5432/sofie
```

**Option C: Docker PostgreSQL**
```bash
docker run -d \
  --name sofie-postgres \
  -e POSTGRES_PASSWORD=sofie \
  -e POSTGRES_DB=sofie \
  -p 5432:5432 \
  postgres:15
```

#### Step 2: Prisma Migration
```bash
cd sofie-backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev

# (Optional) View schema in web UI
npx prisma studio
```

#### Step 3: Seed Data
```bash
# Seed regional/base data
node prisma/seed.js

# (Optional) Seed healthcare data (for Heartware alignment)
node prisma/healthcare-seed.js

# (Optional) Seed herbal library
node prisma/herbal-seed.js
```

#### Step 4: Start Backend
```bash
npm run dev
# or for production: npm start
```

**Expected Output:**
```
✅ Sofie Backend running on port 3001
📍 Regions: http://localhost:3001/api/regions
📍 Communities: http://localhost:3001/api/communities
📍 Energy: http://localhost:3001/api/energy
...
```

---

### Frontend Configuration

#### Step 1: Install Dependencies
```bash
cd sofie-systems-ui
npm install --legacy-peer-deps
```

#### Step 2: Create .env.local
```bash
cat > .env.local << EOF
# Backend API Configuration
REACT_APP_BACKEND_URL=http://localhost:3001/api
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=5000

# Logging & Features
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_MODE=false

# External Services
REACT_APP_WEATHER_API_KEY=demo
EOF
```

#### Step 3: Start Development Server
```bash
npm start
# UI opens on http://localhost:3000
```

#### Step 4: Build for Production (Optional)
```bash
npm run build
# Output: build/ directory ready for deployment
```

---

## ✅ Integration Verification Checklist

### 1. Backend Health
```bash
# Endpoint should return 200 with regions array
curl -i http://localhost:3001/api/regions

# Check response:
# - Status: 200 OK
# - Body: { "success": true, "data": [...] }
```

### 2. Frontend Connectivity
- Open DevTools (F12) → Network tab
- Navigate to each page:
  - **Home** → Should see `/api/sustainability`, `/api/autopilot/status` calls
  - **Map** → Should see `/api/regions`, `/api/communities` calls
  - **Services** → Should see domain-specific `/api/energy`, `/api/water`, etc.
  - **Community Dashboard** → Should see `/api/communities/:id` call
  - **Admin Dashboard** → Should see `/api/admin/stats` call

### 3. Data Verification
- Pages should display **live data from database**, not placeholder/mock data
- Refresh page → data persists (stored in DB, not in-memory)
- Multiple browser windows → see same data (centralized database)

### 4. Error Handling
- If backend is down, UI should show graceful error messages
- Services with fallback (e.g., SeedBankService) should use in-memory data as backup
- Check browser console for any CORS or fetch errors

---

## 🔗 Full System Architecture

```
┌───────────────────────────────────────────────────────────┐
│                  Sofie Systems (UI)                        │
│  React 19 + Quantum Dark Theme + 40+ Pages                │
│  http://localhost:3000                                     │
└───────────────┬───────────────────────────────────────────┘
                │ HTTP REST (REACT_APP_BACKEND_URL)
                │ Fetch API via APIService
                ↓
┌───────────────────────────────────────────────────────────┐
│              Sofie Backend (API Layer)                      │
│  Express.js + Prisma ORM + 48+ Endpoints                  │
│  http://localhost:3001/api                                │
└───────────────┬───────────────────────────────────────────┘
                │ SQL Queries via Prisma
                ↓
┌───────────────────────────────────────────────────────────┐
│            PostgreSQL Database                             │
│  Tables: regions, communities, energy, water,             │
│          crops, housing, healthcare, etc.                 │
│  Seed Data: 5 regions, 50+ communities, etc.              │
└───────────────────────────────────────────────────────────┘

Optional Add-ons:
┌─────────────────┐    ┌──────────────────┐
│ Terracare Chain │    │ Authentication   │
│ (Blockchain)    │    │ (JWT/OAuth)      │
└─────────────────┘    └──────────────────┘
```

---

## 📊 Service-to-Endpoint Mapping

| Service | Key Endpoints | Status |
|---------|---------------|--------|
| **Regions** | `GET /regions`, `GET /regions/:id` | ✅ Live |
| **Communities** | `GET /communities`, `POST /communities` | ✅ Live |
| **Energy** | `GET /energy/production`, `GET /energy/storage` | ✅ Live |
| **Water** | `GET /water/storage`, `GET /water/quality` | ✅ Live |
| **Food/Crops** | `GET /crops`, `POST /crops`, `GET /harvests` | ✅ Live |
| **Housing** | `GET /housing/facilities`, `POST /housing/facilities` | ✅ Live |
| **Seed Bank** | `GET /seed-bank`, `POST /seed-bank/checkouts` | ⏳ Ready |
| **Inventory** | `GET /inventory`, `POST /inventory/:category/items` | ⏳ Ready |
| **Autopilot** | `GET /autopilot/status`, `POST /autopilot/mode` | ⏳ Ready |
| **Governance** | `GET /governance/proposals`, `POST /governance/votes` | ⏳ Ready |
| **Healthcare** | `GET /patients`, `GET /providers`, `POST /appointments` | ✅ Live |
| **Herbal Library** | `GET /herbal-library`, `GET /herbal-journal` | ✅ Live |
| **Admin** | `GET /admin/stats`, `GET /admin/alerts` | ✅ Live |

✅ = Endpoints implemented & callable  
⏳ = Endpoints exist but UI services need wiring

---

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: Invalid DATABASE_URL
→ Solution: Check .env file has valid DATABASE_URL
  Example: postgresql://postgres:password@localhost:5432/sofie

Error: Port 3001 already in use
→ Solution: Kill existing process or use different port
  lsof -i :3001
  kill -9 <PID>
```

### Frontend Can't Connect to Backend
```
CORS Error: Access-Control-Allow-Origin
→ Solution: Check backend CORS config in index.js
→ Ensure UI origin (http://localhost:3000) is whitelisted

404 Not Found on API call
→ Solution: Check endpoint exists in sofie-backend/src/routes
→ Verify REACT_APP_BACKEND_URL is set correctly
```

### Database Errors
```
Error: password authentication failed
→ Solution: Check PostgreSQL password in DATABASE_URL

Error: relation "regions" does not exist
→ Solution: Run migrations: npx prisma migrate dev

Error: Missing seed data
→ Solution: Run seeds: node prisma/seed.js
```

### UI Shows Old/In-Memory Data
```
Issue: Pages display hardcoded mock data instead of DB data
→ Solution: Services need to call backend endpoints
→ Check src/services/SeedBankService.js, InventoryService.js
→ Update fetch() calls to use REACT_APP_BACKEND_URL

Issue: Data lost on page refresh
→ Solution: Service is using in-memory storage
→ Verify backend call is working in DevTools Network tab
```

---

## 🚢 Production Deployment

### Backend (e.g., Heroku, AWS Lambda, Docker)
```bash
# Build backend
npm install --production
npm run build  # if applicable

# Set environment variables in production
# DATABASE_URL (production DB)
# PORT (from environment)
# NODE_ENV=production

# Start
npm start
```

### Frontend (e.g., Vercel, Netlify, S3 + CloudFront)
```bash
# Build production bundle
npm run build

# Set environment variables in build/deployment
# REACT_APP_BACKEND_URL (production API base)

# Deploy build/ directory to CDN/static host
```

---

## 📚 Additional Resources

- **Backend Integration Guide:** `docs/BACKEND_INTEGRATION_GUIDE.md`
- **Frontend README:** `README.md`
- **Backend Repo:** https://github.com/DudeAdrian/sofie-backend
- **Frontend Repo:** https://github.com/DudeAdrian/sofie-systems-ui
- **Blockchain (Terracare):** https://github.com/DudeAdrian/Terracare-Ledger

---

## 🎯 Next Steps After Startup

1. **Verify all pages load without errors** (check DevTools Console)
2. **Test core workflows:**
   - View regions & communities on map
   - Create/edit items in seed bank or inventory
   - Switch autopilot modes
   - Submit governance proposals
3. **Run smoke tests from integration guide**
4. **Document any missing endpoints or data gaps**
5. **Add feature flags for incomplete services**
6. **Plan Phase 3: Components, Phase 4: Security, Phase 5: Blockchain**

---

**Status:** Ready to Deploy ✅  
**Last Updated:** December 9, 2025  
**Version:** 1.0-final
