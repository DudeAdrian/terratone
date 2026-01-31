# S.O.F.I.E. Backend API Setup Guide

## Overview
This guide sets up the complete REST API backend for the S.O.F.I.E. Systems platform, serving all 6 domains with real data persistence.

## Backend Repository Structure

```
sofie-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection & models
│   │   └── environment.js       # Environment variables
│   ├── routes/
│   │   ├── water.js             # Water domain endpoints
│   │   ├── energy.js            # Energy domain endpoints
│   │   ├── climate.js           # Climate domain endpoints
│   │   ├── food.js              # Food domain endpoints
│   │   ├── heartware.js         # Heartware domain endpoints
│   │   ├── system.js            # System domain endpoints
│   │   └── index.js             # Route aggregation
│   ├── controllers/
│   │   ├── waterController.js   # Water business logic
│   │   ├── energyController.js  # Energy business logic
│   │   ├── climateController.js # Climate business logic
│   │   ├── foodController.js    # Food business logic
│   │   ├── heartwareController.js
│   │   └── systemController.js
│   ├── models/
│   │   ├── Water.js             # Water data model
│   │   ├── Energy.js            # Energy data model
│   │   ├── Climate.js           # Climate data model
│   │   ├── Food.js              # Food data model
│   │   ├── Heartware.js         # Heartware data model
│   │   └── System.js            # System data model
│   ├── middleware/
│   │   ├── auth.js              # Authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── utils/
│   │   ├── logger.js            # Logging utility
│   │   └── helpers.js           # Helper functions
│   └── server.js                # Express app setup
├── tests/
│   └── api.test.js              # API endpoint tests
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints Overview

### Water Domain
- `GET /api/water/recycling` - Recycling loop status
- `GET /api/water/quality` - Potable quality metrics
- `GET /api/water/usage` - Usage analytics
- `GET /api/water/leaks` - Leak detection data
- `GET /api/water/irrigation` - Irrigation planning
- `POST /api/water/*` - Create/update data

### Energy Domain
- `GET /api/energy/solar` - Solar array data
- `GET /api/energy/grid` - Grid import/export status
- `GET /api/energy/battery` - Battery state
- `GET /api/energy/load` - Load shedding info
- `GET /api/energy/forecast` - Forecast & pricing
- `POST /api/energy/*` - Create/update data

### Climate Domain
- `GET /api/climate/indoor` - Indoor climate data
- `GET /api/climate/forecast` - Outdoor forecast
- `GET /api/climate/humidity` - Humidity balance
- `GET /api/climate/air` - Air quality metrics
- `GET /api/climate/ventilation` - Ventilation status
- `POST /api/climate/*` - Create/update data

### Food Domain
- `GET /api/food/production` - Production data
- `GET /api/food/nutrition` - Nutrition metrics
- `GET /api/food/storage` - Cold storage inventory
- `GET /api/food/planning` - Supply planning
- `GET /api/food/safety` - Safety records
- `POST /api/food/*` - Create/update data

### Heartware Domain
- `GET /api/heartware/community` - Community data
- `GET /api/heartware/connections` - Network connections
- `GET /api/heartware/resources` - Shared resources
- `GET /api/heartware/activities` - Community activities
- `POST /api/heartware/*` - Create/update data

### System Domain
- `GET /api/system/expansion` - Expansion status
- `GET /api/system/inventory` - System inventory
- `GET /api/system/iot` - IoT device status
- `GET /api/system/plugins` - Installed plugins
- `GET /api/system/resilience` - Resilience metrics
- `POST /api/system/*` - Create/update data

## Technology Stack

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "PostgreSQL (recommended) or MongoDB",
  "authentication": "JWT tokens",
  "validation": "Joi or Zod",
  "testing": "Jest + Supertest",
  "logging": "Winston or Pino",
  "environment": "dotenv"
}
```

## Setup Instructions

### 1. Clone & Install
```bash
cd c:\Users\squat
git clone https://github.com/DudeAdrian/sofie-backend.git
cd sofie-backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials and settings
```

### 3. Database Setup
```bash
npm run db:init        # Initialize database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed initial data
```

### 4. Start Development Server
```bash
npm run dev            # Starts on http://localhost:3001
```

### 5. Frontend Connection
Update `src/core/SofieCore.js` API endpoint:
```javascript
const API_BASE_URL = "http://localhost:3001/api";
```

## Data Models Examples

### Water Service
```javascript
{
  regionId: "default",
  recyclingLoop: {
    capacity: 1000,      // liters
    current: 750,
    status: "operational",
    lastMaintenance: "2025-12-01"
  },
  potableQuality: {
    ph: 7.2,
    turbidity: 0.5,
    bacteria: "safe",
    minerals: { ... }
  },
  usageMetrics: {
    daily: 450,          // liters
    weekly: 3150,
    monthly: 13500
  }
}
```

### Energy Service
```javascript
{
  regionId: "default",
  solarArray: {
    capacity: 5000,      // watts
    current: 3200,
    efficiency: 0.92,
    generatedToday: 42   // kWh
  },
  gridStatus: {
    importing: false,
    exporting: true,
    exportedToday: 8     // kWh
  },
  battery: {
    capacity: 10000,     // Wh
    current: 7500,
    health: 0.98
  }
}
```

### Food Service
```javascript
{
  regionId: "default",
  production: {
    gardens: [
      {
        gardenId: "Raised-Beds-1",
        areaSqm: 12,
        crops: ["tomatoes", "peppers"],
        monthlyYield: 15.5,
        productivity: 94
      }
    ],
    monthlyYield: 42.5,
    yearlyProjection: 510
  },
  nutrition: {
    vegetables: 380,     // grams
    fruits: 165,
    proteins: 62
  },
  storage: {
    rootCellar: 35,      // kg
    pantry: 24,
    freezer: 62
  }
}
```

## Testing the API

### Using cURL
```bash
curl http://localhost:3001/api/water/usage
curl http://localhost:3001/api/energy/solar
curl http://localhost:3001/api/food/production
```

### Using Postman
Import the provided collection: `sofie-backend/postman.json`

### Running Tests
```bash
npm test
npm run test:coverage
```

## Next Steps

1. **Database Setup**: Choose PostgreSQL or MongoDB
2. **Authentication**: Implement JWT token system
3. **Validation**: Add input validation schemas
4. **Error Handling**: Standardize error responses
5. **Documentation**: Generate API docs with Swagger
6. **Testing**: Write comprehensive unit & integration tests
7. **Deployment**: Deploy to production server

## Frontend Integration

The frontend is already configured to connect to this backend:
- `src/services/FoodService.js` calls `http://localhost:3001/api/food`
- `src/services/EnergyService.js` calls `http://localhost:3001/api/energy`
- And so on for each domain

## Troubleshooting

- **Port 3001 already in use**: Change PORT in .env
- **Database connection fails**: Verify credentials in .env
- **CORS errors**: Check CORS configuration in server.js
- **API timeouts**: Check database query performance

---

**Backend Ready for Development!**
