# terratone

> **Sustainability Platform Layer of the Seven Pillar Architecture**

Full-stack sustainability platform for Harmonic Habitats — energy, food, water, climate, and governance dashboards with S.O.F.I.E. integration.

[![Seven Pillars](https://img.shields.io/badge/Seven%20Pillars-v1.0.0-blue)](./SEVEN_PILLARS.md)
[![S.O.F.I.E.](https://img.shields.io/badge/S.O.F.I.E.-Full%20Stack-orange)](./SEVEN_PILLARS.md)

---

## Seven Pillar Mapping

| Pillar | Domain | Backend Route | Frontend Page | Function |
|--------|--------|---------------|---------------|----------|
| **P1** | Underground Knowledge | `/api/system` | `SystemService.js` | Core platform knowledge |
| **P1** | Water | `/api/water` | `WaterService.js` | Water resource management |
| **P1** | Energy | `/api/energy` | `EnergyService.js` | Energy systems |
| **P1** | Food | `/api/food` | `FoodService.js` | Food production |
| **P2** | Mental Models | `/api/wellness` | `WellnessService.js` | Wellness frameworks |
| **P3** | Reverse Engineering | `/api/climate` | `ClimateService.js` | Climate pattern analysis |
| **P4** | Strategic Dominance | `/api/admin` | `AdminDashboard.js` | Governance & strategy |
| **P4** | Governance | `/api/governance` | `Governance.js` | Mesh governance |
| **P5** | Black Market Tactics | `/api/marketplace` | `MarketplaceService.js` | Trade & exchange |
| **P5** | Automation | `/api/automation` | `AutopilotService.js` | Shadow automation |
| **P6** | Forbidden Frameworks | `/api/integration` | `Integration` | System transformation |
| **P7** | Billionaire Mindset | `/api/community` | `CommunityService.js` | Abundance networks |
| **P8** | Integration | `/api/herbal` | `HerbalLibraryService.js` | Knowledge integration |

---

## Architecture

```
terratone/
├── backend/                    # Express API Server
│   ├── routes/
│   │   ├── water.js            # P1: Water domain
│   │   ├── energy.js           # P1: Energy domain
│   │   ├── food.js             # P1: Food domain
│   │   ├── climate.js          # P3: Climate analysis
│   │   ├── wellness.js         # P2: Wellness
│   │   ├── admin.js            # P4: Governance
│   │   ├── governance.js       # P4: Strategy
│   │   ├── marketplace.js      # P5: Exchange
│   │   ├── automation.js       # P5: Automation
│   │   ├── community.js        # P7: Networks
│   │   └── herbal.js           # P8: Integration
│   └── server.js
├── src/                        # React Frontend
│   ├── services/               # API clients
│   │   ├── WaterService.js     # P1
│   │   ├── EnergyService.js    # P1
│   │   ├── FoodService.js      # P1
│   │   ├── ClimateService.js   # P3
│   │   ├── WellnessService.js  # P2
│   │   ├── GovernanceService.js# P4
│   │   ├── MarketplaceService.js# P5
│   │   └── CommunityService.js # P7
│   └── pages/                  # UI routes
│       ├── AdminDashboard.js   # P4
│       ├── GlobalMap.js        # P3/P4
│       └── CommunityNetwork.js # P7
└── bridge/                     # Cross-repo integration
    ├── terracare-client.js
    ├── sofie-backend-client.js
    └── sofie-map-client.js
```

---

## Quick Start

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd ..
npm install
npm start
```

---

## API Structure

### Seven Pillar Convention

```
# Pillar 1: Knowledge (Water, Energy, Food)
GET  /api/water/:regionId
GET  /api/energy/:regionId
GET  /api/food/:regionId

# Pillar 2: Mental Models
GET  /api/wellness/intake
POST /api/wellness/checkin

# Pillar 3: Reverse Engineering
GET  /api/climate/zones
POST /api/climate/analyze

# Pillar 4: Strategic Dominance
GET  /api/admin/metrics
GET  /api/governance/proposals

# Pillar 5: Shadow/Tactics
GET  /api/marketplace/listings
POST /api/automation/trigger

# Pillar 6: Transformation
POST /api/integration/forward

# Pillar 7: Abundance
GET  /api/community/capacity
GET  /api/community/impact

# Pillar 8: Integration
GET  /api/herbal/traditions
```

---

## Map Integration

Terratone integrates with **sofie-map-system** for spatial features:

```javascript
// Global Map Service
GlobalMapService.initialize();
GlobalMapService.getCommunitiesByContinent('Europe');

// Geo Data Service
GeoDataService.loadFeatures(geoJson);
```

---

## S.O.F.I.E. Integration

Terratone provides the **UI layer** for all S.O.F.I.E. operators:

```
S.O.F.I.E. Operators:
├── Source (S) → UI Identity
├── Origin (O) → Blockchain Status
├── Force (F) → Validator Dashboard
├── Intelligence (I) → Wellness Insights
└── Eternal (E) → User History
```

---

## Environment Variables

```
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/terratone
JWT_SECRET=your-secret

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TERRACARE_RPC=http://localhost:8545

# Integrations
SOFIE_BACKEND_URL=http://localhost:8000
SOFIE_MAP_URL=http://localhost:8002
SANDIRONRATIO_URL=http://localhost:3000
```

---

## Related Repositories

| Repo | Layer | Role |
|------|-------|------|
| [Terracare-Ledger](../) | Layer 1 | Blockchain foundation |
| [sofie-systems](../sofie-systems) | Layer 2 | S.O.F.I.E. core engine |
| [sofie-backend](../sofie-llama-backend) | API Layer | Wellness engine |
| [sofie-map-system](../sofie-map-system) | Spatial | Geographic intelligence |
| [sandironratio-node](../sandironratio-node) | Layer 3 | 9 Chambers Academy |

---

> *"Harmonic Habitats. Living systems architecture."*  
> — S.O.F.I.E.
