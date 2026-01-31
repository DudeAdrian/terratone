# SOFIE Map System - Implementation Guide

## Quick Setup (5 minutes)

### 1. Initialize Project
```bash
cd C:\Users\squat\sofie-map-system
npm init -y
npm install express cors dotenv node-fetch
npm install --save-dev nodemon
```

### 2. Create Directory Structure
```bash
mkdir src
mkdir src\routes
mkdir src\services
mkdir src\utils
```

### 3. Create Core Files

**File: `src/server.js`**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const regionsRouter = require('./routes/regions');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/regions', regionsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sofie-map-system', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🗺️  Map Service running on http://localhost:${PORT}`);
});
```

**File: `src/routes/regions.js`**
```javascript
const express = require('express');
const router = express.Router();
const { getRegions, getRegionCommunities, getRegionMap } = require('../services/dataFetcher');

// GET /api/regions - List all regions
router.get('/', async (req, res) => {
  try {
    const regions = await getRegions();
    res.json({ regions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/regions/:id/communities - Get communities in region
router.get('/:id/communities', async (req, res) => {
  try {
    const communities = await getRegionCommunities(req.params.id);
    res.json({ communities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/regions/:id/map - Get map rendering data
router.get('/:id/map', async (req, res) => {
  try {
    const mapData = await getRegionMap(req.params.id);
    res.json(mapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**File: `src/services/dataFetcher.js`**
```javascript
const fetch = require('node-fetch');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

// Region definitions (hardcoded for now, can move to database later)
const REGIONS = {
  'europe-uk': {
    id: 'europe-uk',
    name: 'Europe & UK',
    bounds: { latMin: 35, latMax: 72, lngMin: -10, lngMax: 40 }
  },
  'usa': {
    id: 'usa',
    name: 'USA',
    bounds: { latMin: 25, latMax: 50, lngMin: -125, lngMax: -65 }
  },
  'india': {
    id: 'india',
    name: 'India',
    bounds: { latMin: 8, latMax: 35, lngMin: 68, lngMax: 97 }
  },
  'australia': {
    id: 'australia',
    name: 'Australia',
    bounds: { latMin: -44, latMax: -10, lngMin: 113, lngMax: 154 }
  }
};

async function getAllCommunities() {
  const response = await fetch(`${BACKEND_URL}/communities`);
  if (!response.ok) {
    throw new Error('Failed to fetch communities from backend');
  }
  return await response.json();
}

async function getRegions() {
  const communities = await getAllCommunities();
  
  return Object.values(REGIONS).map(region => {
    const regionCommunities = communities.filter(c => 
      isInRegion(c.latitude, c.longitude, region.bounds)
    );
    
    const avgHealth = regionCommunities.length > 0
      ? Math.round(regionCommunities.reduce((sum, c) => sum + (c.healthScore || 50), 0) / regionCommunities.length)
      : 0;
    
    return {
      id: region.id,
      name: region.name,
      communityCount: regionCommunities.length,
      averageHealth: avgHealth
    };
  });
}

async function getRegionCommunities(regionId) {
  const region = REGIONS[regionId];
  if (!region) {
    throw new Error(`Region ${regionId} not found`);
  }
  
  const communities = await getAllCommunities();
  
  return communities.filter(c => 
    isInRegion(c.latitude, c.longitude, region.bounds)
  ).map(c => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tier: c.tier || 'community',
    lat: c.latitude,
    lng: c.longitude,
    metrics: {
      health: c.healthScore || 50,
      energy: c.energyScore || 50,
      food: c.foodScore || 50,
      water: c.waterScore || 50,
      trade: c.tradeScore || 50,
      governance: c.governanceScore || 50
    },
    ledgerHash: c.ledgerHash,
    verifiedOnChain: !!c.ledgerHash
  }));
}

async function getRegionMap(regionId) {
  const region = REGIONS[regionId];
  if (!region) {
    throw new Error(`Region ${regionId} not found`);
  }
  
  const communities = await getRegionCommunities(regionId);
  
  return {
    regionId: region.id,
    regionName: region.name,
    bounds: region.bounds,
    communities,
    totalCommunities: communities.length,
    verifiedCommunities: communities.filter(c => c.verifiedOnChain).length
  };
}

function isInRegion(lat, lng, bounds) {
  return lat >= bounds.latMin && 
         lat <= bounds.latMax && 
         lng >= bounds.lngMin && 
         lng <= bounds.lngMax;
}

module.exports = {
  getRegions,
  getRegionCommunities,
  getRegionMap
};
```

**File: `.env`**
```
PORT=3002
BACKEND_URL=http://localhost:3001/api
```

**File: `package.json` (update scripts)**
```json
{
  "name": "sofie-map-system",
  "version": "1.0.0",
  "description": "Geographic visualization service for SOFIE ecosystem",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": ["sofie", "map", "visualization", "microservice"],
  "author": "",
  "license": "MIT"
}
```

---

## Test the Service

### 1. Start the map service
```bash
cd C:\Users\squat\sofie-map-system
npm run dev
```

### 2. Test endpoints
```bash
# Health check
curl http://localhost:3002/health

# Get all regions
curl http://localhost:3002/api/regions

# Get Europe communities
curl http://localhost:3002/api/regions/europe-uk/communities

# Get Europe map data
curl http://localhost:3002/api/regions/europe-uk/map
```

---

## Next: Update sofie-systems-ui

Once the map service is running, update GlobalMapPage.js to fetch from the API instead of rendering locally.

**File: `sofie-systems-ui/src/services/mapService.js` (create new)**
```javascript
const MAP_SERVICE_URL = process.env.REACT_APP_MAP_SERVICE_URL || 'http://localhost:3002/api';

export const mapService = {
  async getRegions() {
    const response = await fetch(`${MAP_SERVICE_URL}/regions`);
    if (!response.ok) throw new Error('Failed to fetch regions');
    return await response.json();
  },

  async getRegionCommunities(regionId) {
    const response = await fetch(`${MAP_SERVICE_URL}/regions/${regionId}/communities`);
    if (!response.ok) throw new Error(`Failed to fetch communities for ${regionId}`);
    return await response.json();
  },

  async getRegionMap(regionId) {
    const response = await fetch(`${MAP_SERVICE_URL}/regions/${regionId}/map`);
    if (!response.ok) throw new Error(`Failed to fetch map for ${regionId}`);
    return await response.json();
  }
};
```

---

## Success Checklist

- [ ] Map service starts on port 3002
- [ ] Health check returns 200
- [ ] `/api/regions` returns region list
- [ ] `/api/regions/europe-uk/communities` returns community data
- [ ] `/api/regions/europe-uk/map` returns full map data
- [ ] Data includes ledgerHash fields (even if null for now)
- [ ] sofie-systems-ui can fetch from map service
- [ ] Map displays correctly in UI

---

**Time to complete:** ~1 hour  
**Next step:** Update GlobalMapPage.js to use mapService instead of local rendering
