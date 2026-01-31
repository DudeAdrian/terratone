# SOFIE Ecosystem Architecture Roadmap

**Date:** December 9, 2025  
**Status:** Phase 1 - Map Service Migration

---

## THE TRUNK & BRANCHES MODEL

```
                    🌳 TERRACARE LEDGER
                    │  (The Trunk - Immutable Truth)
                    │  Port: Ethereum PoA Network
                    │  Purpose: Blockchain verification, no currency
                    │
        ┌───────────┴───────────────┬─────────────┐
        │                           │             │
    sofie-backend           sofie-map-system   Heartware
   (Data Branch)          (Visualization)    (Healthcare)
   Port: 3001             Port: 3002         Port: 3001
        │                           │             │
        └───────────┬───────────────┴─────────────┘
                    │
            ┌───────┴────────┐
            │                │
    sofie-systems-ui    heartware-ui
    (Sustainability)    (Healthcare)
    Port: 3000          Port: 3003
```

---

## CURRENT STATE ASSESSMENT

### ✅ What's Working
- **sofie-backend**: 6 models, 15+ endpoints, 64 communities seeded
- **sofie-systems-ui**: Full dashboard system, components built
- **Heartware**: 32 pages, healthcare models ready
- **Terracare-Ledger**: PoA contracts deployed (commit ca9a625)

### ❌ What's Broken
- **sofie-map-system**: Just demo HTML, no API layer
- **Blockchain integration**: ledgerHash fields exist but unused
- **Service boundaries**: UIs directly query sofie-backend (tight coupling)
- **Map logic**: Embedded in sofie-systems-ui, should be service

---

## MIGRATION PLAN

### **PHASE 1: Build Map Service** ⚡ (CURRENT)
**Goal:** Extract map logic into independent microservice

**Steps:**
1. ✅ Create sofie-map-system Express API
2. ✅ Add endpoints: `/api/regions`, `/api/regions/:id/communities`
3. ✅ Query sofie-backend for community data
4. ✅ Return regional map data as JSON
5. ✅ Update GlobalMapPage to consume map service
6. ✅ Remove embedded map components from sofie-systems-ui

**Success Criteria:**
- Map service runs on port 3002
- sofie-systems-ui queries map service API
- Regional maps display correctly
- No direct map rendering in UI

**Time Estimate:** 3-4 hours

---

### **PHASE 2: Terracare Integration**
**Goal:** Make sofie-backend write to blockchain trunk

**Steps:**
1. Add Web3.js/Ethers.js to sofie-backend
2. Create blockchain middleware (runs on POST/PUT/DELETE)
3. Write transaction to Terracare, store returned hash
4. Update all ledgerHash fields with blockchain hashes
5. Add event listener to sync Terracare → Postgres
6. Add verification endpoints (GET /api/verify/:hash)

**Success Criteria:**
- Every state change recorded on Terracare
- ledgerHash populated for all records
- UIs display "✅ Verified on Terracare" badges
- Audit trail queryable

**Time Estimate:** 4-6 hours

---

### **PHASE 3: Heartware Integration**
**Goal:** Apply same pattern to healthcare domain

**Steps:**
1. Replicate Terracare middleware for healthcare endpoints
2. Patient consent → blockchain record
3. Prescriptions → hashed on-chain
4. Health records → verified via Terracare
5. HIPAA audit log = blockchain event stream

**Success Criteria:**
- Healthcare data blockchain-verified
- Same verification badges in Heartware UI
- Cross-domain audit trail

**Time Estimate:** 2-3 hours

---

### **PHASE 4: UI Cleanup**
**Goal:** Lightweight frontends consuming services

**Steps:**
1. Remove InteractiveMap, MapProjection, GeoDataService from sofie-systems-ui
2. Replace with fetch() calls to map service
3. Add blockchain verification display
4. Show transaction hashes in dashboards
5. Replicate for Heartware UI

**Success Criteria:**
- UIs are pure view layers
- All data fetched from services
- No business logic in frontend

**Time Estimate:** 2-3 hours

---

## REPOSITORY STRUCTURE (TARGET)

### **Terracare-Ledger** (The Trunk)
```
contracts/
├── CommunityRegistry.sol
├── MetricsRecorder.sol
├── ResourceTransaction.sol
└── GovernanceRegistry.sol
```

### **sofie-backend** (Data Branch)
```
src/
├── middleware/
│   └── blockchain.js (writes to Terracare)
├── services/
│   ├── terracare.js (Web3 integration)
│   └── sync.js (listens to blockchain events)
├── routes/ (existing)
└── prisma/ (existing with ledgerHash fields)
```

### **sofie-map-system** (Visualization Branch)
```
src/
├── server.js (Express on port 3002)
├── routes/
│   ├── regions.js
│   └── communities.js
├── services/
│   ├── mapRenderer.js (canvas logic)
│   └── dataFetcher.js (queries sofie-backend)
└── utils/
    └── projection.js (coordinate transforms)
```

### **sofie-systems-ui** (Sustainability Interface)
```
src/
├── services/
│   ├── mapService.js (calls sofie-map-system)
│   └── blockchainService.js (verification display)
└── pages/
    └── GlobalMapPage.js (consumes map service)
```

### **Heartware** (Healthcare Interface)
```
src/
├── services/
│   ├── mapService.js (same as sofie-systems-ui)
│   └── blockchainService.js
└── pages/
    └── FacilityMap.js (uses map service for hospitals)
```

---

## SERVICE CONTRACTS

### Map Service API (`sofie-map-system`)

**Base URL:** `http://localhost:3002/api`

#### `GET /regions`
Returns all regions with community counts
```json
{
  "regions": [
    {
      "id": "europe-uk",
      "name": "Europe & UK",
      "communityCount": 15,
      "averageHealth": 87
    }
  ]
}
```

#### `GET /regions/:id/map`
Returns regional map rendering data
```json
{
  "regionId": "europe-uk",
  "bounds": { "latMin": 35, "latMax": 60, "lngMin": -10, "lngMax": 30 },
  "communities": [
    {
      "slug": "london-hub",
      "lat": 51.5074,
      "lng": -0.1278,
      "health": 85,
      "energy": 88,
      "alerts": 2
    }
  ]
}
```

#### `GET /regions/:id/communities`
Returns detailed community list for region
```json
{
  "communities": [
    {
      "id": "uuid",
      "slug": "london-hub",
      "name": "London Hub",
      "tier": "hub",
      "metrics": { "health": 85, "energy": 88, ... },
      "ledgerHash": "0x123abc...",
      "verifiedOnChain": true
    }
  ]
}
```

### Blockchain Service API (`sofie-backend` additions)

#### `GET /api/verify/:hash`
Verifies data against Terracare blockchain
```json
{
  "hash": "0x123abc...",
  "verified": true,
  "blockNumber": 12345,
  "timestamp": "2025-12-09T10:30:00Z",
  "dataType": "CommunityMetrics"
}
```

---

## NEXT STEPS (Immediate Actions)

1. **Create sofie-map-system repository structure**
   - Initialize Node.js project
   - Add Express, CORS
   - Create API endpoints

2. **Extract map logic from sofie-systems-ui**
   - Move InteractiveMap.js → sofie-map-system/src/services/mapRenderer.js
   - Move MapProjection.js → sofie-map-system/src/utils/projection.js
   - Move GeoDataService.js → sofie-map-system/src/services/geoData.js

3. **Update sofie-systems-ui to consume map service**
   - Create src/services/mapService.js
   - Update GlobalMapPage.js to fetch from API
   - Remove local map rendering

4. **Test end-to-end**
   - Start sofie-backend (port 3001)
   - Start sofie-map-system (port 3002)
   - Start sofie-systems-ui (port 3000)
   - Verify map displays regional data

---

## SUCCESS METRICS

### Phase 1 Complete When:
- ✅ Map service responds on port 3002
- ✅ `/api/regions` returns region list
- ✅ `/api/regions/:id/communities` returns community data
- ✅ sofie-systems-ui displays map from service
- ✅ No map rendering code in UI repository

### Phase 2 Complete When:
- ✅ Every POST/PUT/DELETE writes to Terracare
- ✅ ledgerHash populated for all new records
- ✅ Verification badges show in UI
- ✅ Blockchain sync service running

### Phase 3 Complete When:
- ✅ Healthcare endpoints blockchain-verified
- ✅ Patient consent on-chain
- ✅ HIPAA audit = blockchain events

### Phase 4 Complete When:
- ✅ Zero business logic in UIs
- ✅ All data from services
- ✅ UIs are pure React views

---

## CURRENT PRIORITY

**Build sofie-map-system as first proper branch service.**

This establishes the pattern for all future branches and proves the trunk-and-branches architecture works.

**Estimated completion:** 3-4 hours  
**Next review:** After map service running and integrated

---

*Architecture by: GitHub Copilot with Claude Sonnet 4.5*  
*Last updated: December 9, 2025*
