# Sofie Systems Backend Integration Guide

## Overview
This document maps all Sofie Systems UI pages and services to their corresponding backend API endpoints. It provides the complete connectivity blueprint for aligning the frontend UI with the sofie-backend database layer.

---

## Environment Configuration

### Frontend (.env.local or .env)
```env
# Backend API Gateway
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
```

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sofie
# or: postgresql://user:password@db-host:5432/sofie-prod

# Server
PORT=3001
NODE_ENV=development

# (Optional) Future auth
JWT_SECRET=your-secret-key
```

---

## Backend Startup Checklist

1. **Install Dependencies**
   ```bash
   cd c:\Users\squat\sofie-backend
   npm install
   ```

2. **Configure Database**
   - Create `.env` with `DATABASE_URL` pointing to your PostgreSQL instance
   - Example: `postgresql://postgres:password@localhost:5432/sofie`

3. **Run Migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Seed Initial Data**
   ```bash
   node prisma/seed.js              # Regions, communities, base data
   node prisma/healthcare-seed.js   # (Optional) Healthcare: patients, providers, etc.
   ```

5. **Start Server**
   ```bash
   npm run dev
   ```
   - API will listen on `http://localhost:3001/api`

---

## Page-to-Endpoint Mapping

### 🏠 Home Page
**File:** `src/pages/Home.js`
- **Purpose:** Dashboard overview of Sofie Systems
- **Backend Calls:**
  - `GET /sustainability` – Overall sustainability score
  - `GET /autopilot/status` – Autopilot mode status
  - `GET /alerts` – Active system alerts

---

### 🗺️ Map Page
**File:** `src/pages/Map.js`
- **Purpose:** Global/regional map with interactive data visualization
- **Backend Calls:**
  - `GET /regions` – List all regions with metadata
  - `GET /regions/:regionId` – Region details, bounds, metrics
  - `GET /communities` – Community locations & status
  - `GET /regions/:regionId/metrics` – Regional KPIs (energy, water, food, housing)

---

### 🌍 Services Hub
**File:** `src/pages/Services.js`
- **Purpose:** Entry point to all major service domains
- **Backend Calls:**
  - `GET /services` – List available services (Energy, Water, Food, Housing, Healthcare, etc.)
  - (Each service domain has its own sub-pages below)

---

### ⚡ Energy Service
**File:** `src/pages/Energy.js`
- **Purpose:** Energy production, consumption, storage management
- **Backend Calls:**
  - `GET /energy/production` – Current & historical energy production
  - `GET /energy/consumption` – Usage metrics by category
  - `GET /energy/storage` – Battery/grid storage levels
  - `POST /energy/production` – Log new production readings
  - `GET /energy/forecast` – Renewable energy forecasts
  - `GET /energy/assets` – Solar panels, wind turbines, generators

---

### 💧 Water Service
**File:** `src/pages/Water.js`
- **Purpose:** Water quality, storage, distribution
- **Backend Calls:**
  - `GET /water/storage` – Rainwater tank, well levels
  - `GET /water/quality` – pH, turbidity, contamination metrics
  - `GET /water/usage` – Consumption by category (agriculture, household, industrial)
  - `POST /water/quality-test` – Log water test results
  - `GET /water/sources` – Available water sources & distribution points

---

### 🌾 Food & Agriculture
**File:** `src/pages/Food.js`
- **Purpose:** Crop management, harvest tracking, nutrition
- **Backend Calls:**
  - `GET /crops` – Active crops with growth status
  - `GET /crops/:cropId` – Crop details, yield predictions
  - `POST /crops` – Plant new crop
  - `PATCH /crops/:cropId` – Update crop status
  - `GET /harvests` – Historical harvest data
  - `POST /harvests` – Log harvest event
  - `GET /nutrition` – Crop nutrition profiles

---

### 🏠 Housing Service
**File:** `src/pages/Housing.js`
- **Purpose:** Shelter management, construction, maintenance
- **Backend Calls:**
  - `GET /housing/facilities` – List structures (greenhouses, residences, storage)
  - `GET /housing/facilities/:facilityId` – Facility details, capacity, condition
  - `POST /housing/facilities` – Register new structure
  - `GET /housing/materials` – Available building materials inventory
  - `GET /housing/maintenance` – Scheduled & overdue maintenance tasks

---

### 🌱 Seed Bank
**File:** `src/pages/SeedBank.js` (via SeedBankService)
- **Purpose:** Community seed library management, preservation, exchange
- **Backend Calls:**
  - `GET /seed-bank` – All available seeds inventory
  - `GET /seed-bank/:seedId` – Seed details (variety, viability, origin)
  - `POST /seed-bank` – Add new seed to collection
  - `PATCH /seed-bank/:seedId` – Update seed info (viability tests, quantities)
  - `GET /seed-bank/checkouts` – Active seed loans/borrowing
  - `POST /seed-bank/checkouts` – Borrow seeds from library
  - `PATCH /seed-bank/checkouts/:checkoutId` – Return seeds, log germination results
  - `GET /seed-bank/exchange-network` – Partner communities & exchange history
  - `POST /seed-bank/exchange` – Log seed exchange with partner

---

### 📦 Inventory Service
**File:** `src/pages/Inventory.js` (via InventoryService)
- **Purpose:** Track shared community resources
- **Backend Calls:**
  - `GET /inventory` – All inventory items by category
  - `GET /inventory/:category` – Items in specific category
  - `GET /inventory/:category/items` – Individual items with quantities
  - `POST /inventory/:category/items` – Add new item
  - `PATCH /inventory/:category/items/:itemId` – Update quantity
  - `DELETE /inventory/:category/items/:itemId` – Remove item
  - `GET /inventory/history` – Inventory transactions log

---

### 🤖 Autopilot Mode
**File:** `src/pages/AutopilotMode.js`
- **Purpose:** Automated system management and decision-making
- **Backend Calls:**
  - `GET /autopilot/status` – Current autopilot mode (manual/assisted/auto)
  - `POST /autopilot/mode` – Switch autopilot mode
  - `GET /autopilot/playbooks` – Available automation playbooks
  - `PATCH /autopilot/playbooks/:playbookId` – Enable/disable playbook
  - `POST /autopilot/execute` – Trigger autopilot execution
  - `GET /autopilot/decisions` – Recent decisions made
  - `GET /autopilot/history` – Execution history with results
  - `GET /autopilot/interventions` – Manual intervention alerts

---

### 🌡️ Climate Settings
**File:** `src/pages/ClimateSettings.js`
- **Purpose:** Configure regional climate zone for recommendations
- **Backend Calls:**
  - `GET /climate/zone` – Current configured climate zone
  - `POST /climate/zone` – Update climate zone
  - `GET /climate/zones` – Available climate zone definitions
  - `GET /climate/history` – Zone change history (on-chain verified)
  - `GET /climate/benchmarks/:zone` – Zone-specific crop/resource data

---

### 🏛️ Governance
**File:** `src/pages/Governance.js`
- **Purpose:** Democratic decision-making, proposals, voting
- **Backend Calls:**
  - `GET /governance/members` – Community members & voting status
  - `GET /governance/proposals` – All proposals with vote counts
  - `POST /governance/proposals` – Submit new proposal
  - `POST /governance/votes` – Cast vote on proposal
  - `GET /governance/stats` – Governance metrics (members, proposals, votes)
  - `GET /governance/history` – Historical decisions & outcomes

---

### 👥 Community Service
**File:** `src/pages/Community.js` (via CommunityService)
- **Purpose:** Community profiles, networks, resource sharing
- **Backend Calls:**
  - `GET /communities` – List all communities
  - `GET /communities/:communityId` – Community profile, capabilities, needs
  - `PATCH /communities/:communityId` – Update community info
  - `GET /communities/:communityId/members` – Community members
  - `GET /communities/:communityId/resources` – Available resources for sharing
  - `POST /communities/:communityId/resources` – Offer resource to network
  - `GET /communities/:communityId/partnerships` – Inter-community partnerships

---

### 🏥 Healthcare Integration (Heartware Alignment)
**File:** `src/pages/AdminDashboard.js`, healthcare pages
- **Purpose:** Patient care, provider networks, medical records
- **Backend Calls:**
  - `GET /patients` – Patient list
  - `GET /patients/:patientId` – Patient details, health history
  - `POST /patients` – Register new patient
  - `GET /providers` – Healthcare provider directory
  - `GET /appointments` – Appointment schedule
  - `POST /appointments` – Schedule new appointment
  - `GET /prescriptions` – Active prescriptions
  - `POST /prescriptions` – Issue new prescription
  - `GET /lab-results` – Lab test results
  - `POST /lab-results` – Log lab results
  - `GET /facilities` – Healthcare facility directory

---

### 🌿 Herbal Library
**File:** `src/pages/HerbalLibrary.js` (via HerbalLibraryService)
- **Purpose:** Community herbal knowledge base
- **Backend Calls:**
  - `GET /herbal-library` – All herbs in library
  - `GET /herbal-library/:herbId` – Herb details, uses, traditions
  - `GET /herbal-library/traditions/:tradition` – Herbs by tradition (Ayurveda, TCM, etc.)
  - `GET /herbal-journal` – User's personal herbal journal entries
  - `POST /herbal-journal` – Add journal entry
  - `PATCH /herbal-journal/:entryId` – Update journal entry

---

### 📊 Self-Sufficiency Dashboard
**File:** `src/pages/SelfSufficiency.js`
- **Purpose:** Community self-sufficiency metrics and analysis
- **Backend Calls:**
  - `GET /self-sufficiency/score` – Overall self-sufficiency index
  - `GET /self-sufficiency/breakdown` – Score by domain (energy, food, water, etc.)
  - `GET /self-sufficiency/trends` – Historical trends
  - `GET /self-sufficiency/goals` – Community goals & progress

---

### 🌍 Global Admin Dashboard
**File:** `src/components/GlobalAdminDashboard.js`
- **Purpose:** System-wide monitoring and administration
- **Backend Calls:**
  - `GET /admin/stats` – System-wide KPIs
  - `GET /admin/regions` – All regions summary
  - `GET /admin/alerts` – Critical system alerts
  - `GET /admin/users` – Admin user management
  - `GET /admin/audit-log` – Activity log

---

### 🌐 Regional Service
**File:** `src/services/RegionService.js`
- **Purpose:** Centralized regional data access
- **Backend Calls:**
  - `GET /regions` – All regions
  - `GET /regions/:regionId` – Region details
  - `GET /regions/:regionId/metrics` – Regional KPIs
  - `GET /regions/:regionId/benchmarks` – Performance benchmarks
  - `GET /user-region` – User's assigned region
  - `GET /users/:email` – User profile & preferences

---

### 🎯 Wellness Intake Service
**File:** `src/services/WellnessIntakeService.js`
- **Purpose:** Onboarding & preference collection
- **Backend Calls:**
  - `POST /wellness/intake` – Submit wellness intake form
  - `GET /wellness/intake/:userId` – Retrieve user's wellness profile
  - `PATCH /wellness/intake/:userId` – Update wellness preferences

---

## Service Architecture Summary

| Service | In-Memory | Backend-Ready | Status |
|---------|-----------|---------------|--------|
| RegionService | ❌ | ✅ `/regions` | Ready |
| CommunityService | ⚠️ Partial | ✅ `/communities` | Ready |
| EnergyService | ⚠️ Partial | ✅ `/energy/*` | Ready |
| WaterService | ⚠️ Partial | ✅ `/water/*` | Ready |
| FoodService | ⚠️ Partial | ✅ `/crops`, `/harvests` | Ready |
| HousingService | ⚠️ Partial | ✅ `/housing/*` | Ready |
| SeedBankService | ✅ In-Memory | ✅ `/seed-bank/*` | **Needs Wiring** |
| InventoryService | ✅ In-Memory | ✅ `/inventory/*` | **Needs Wiring** |
| AutopilotService | ✅ In-Memory | ✅ `/autopilot/*` | **Needs Wiring** |
| GovernanceService | ✅ In-Memory | ✅ `/governance/*` | **Needs Wiring** |
| HerbalLibraryService | ⚠️ Partial | ✅ `/herbal-library/*` | Ready |
| SustainabilityService | ⚠️ Partial | ✅ `/sustainability/*` | Ready |
| WellnessIntakeService | ⚠️ Partial | ✅ `/wellness/*` | Ready |

**Status Key:**
- ✅ **In-Memory** = Data stored locally in service; lost on refresh
- ✅ **Backend-Ready** = Routes defined in sofie-backend
- **Needs Wiring** = Services still local; routes exist but not yet called from UI

---

## Smoke Test Checklist

Once backend is running at `http://localhost:3001/api`, verify:

### Quick Curl Tests
```bash
# Regions (foundational)
curl http://localhost:3001/api/regions

# Communities
curl http://localhost:3001/api/communities

# Energy
curl http://localhost:3001/api/energy/production

# Water
curl http://localhost:3001/api/water/storage

# Crops
curl http://localhost:3001/api/crops

# Seed Bank (if implemented)
curl http://localhost:3001/api/seed-bank

# Autopilot (if implemented)
curl http://localhost:3001/api/autopilot/status

# Governance (if implemented)
curl http://localhost:3001/api/governance/members
```

### UI Page Tests
1. Start UI: `npm start` (with `.env` set)
2. Navigate to each page and check Network tab (F12) for:
   - No 404 errors
   - No CORS errors
   - Data populating from backend

Pages to test in order:
- Home → should fetch `/sustainability`, `/autopilot/status`, `/alerts`
- Map → should fetch `/regions`, `/communities`
- Services (then each service) → should fetch domain-specific data
- Community Dashboard → should fetch `/communities`
- Global Admin → should fetch `/admin/stats`

---

## Next Steps

### Immediate
1. Set `DATABASE_URL` in sofie-backend `.env`
2. Run `npx prisma migrate dev` & `node prisma/seed.js`
3. Start backend: `npm run dev`
4. Set `REACT_APP_BACKEND_URL` in UI `.env.local`
5. Restart UI: `npm start`
6. Run smoke tests above

### Short-Term
1. Wire SeedBankService to `/seed-bank/*` endpoints
2. Wire InventoryService to `/inventory/*` endpoints
3. Wire AutopilotService history/decisions to `/autopilot/*` endpoints
4. Wire GovernanceService to `/governance/*` endpoints
5. Verify all pages load data without in-memory fallback

### Medium-Term
1. Add error handling & retry logic to all fetch calls
2. Implement authentication/JWT tokens
3. Add field encryption for sensitive data
4. Deploy blockchain integration (Terracare contracts)
5. Add HIPAA audit logging middleware

---

## API Response Format (Expected)

All endpoints should return:
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "timestamp": "2025-12-09T12:00:00Z",
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
```

Errors:
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "timestamp": "2025-12-09T12:00:00Z"
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `CORS error` | Check backend `corsOptions` in index.js; ensure UI origin is allowed |
| `DATABASE_URL not set` | Backend won't start; verify `.env` exists with correct DB connection string |
| `404 on endpoint` | Route may not be implemented yet; check sofie-backend `src/routes/` |
| `Seed data missing` | Run `node prisma/seed.js` in sofie-backend |
| `UI shows in-memory data` | Service not yet wired to backend; update service fetch calls to use `REACT_APP_BACKEND_URL` |

---

## Contact & Support

- **Frontend Repo:** https://github.com/DudeAdrian/sofie-systems-ui
- **Backend Repo:** https://github.com/DudeAdrian/sofie-backend
- **Blockchain:** https://github.com/DudeAdrian/Terracare-Ledger
- **Healthcare Fork:** https://github.com/DudeAdrian/Heartware

---

**Last Updated:** December 9, 2025  
**Version:** 1.0
