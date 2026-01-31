# S.O.F.I.E. Backend API - Implementation Guide

## Overview

This is the complete backend API implementation for the S.O.F.I.E. (Sustainable Open-source Framework for Integrated Ecosystems) system. It provides REST endpoints for all 6 core domains: Water, Energy, Climate, Food, Heartware, and System.

## Project Structure

```
sofie-backend/
├── src/
│   ├── backend/
│   │   ├── database/
│   │   │   ├── connection.js       # Database connection manager
│   │   │   └── schema.prisma       # Prisma data models
│   │   ├── routes/
│   │   │   ├── water.js            # Water domain routes
│   │   │   ├── energy.js           # Energy domain routes
│   │   │   ├── climate.js          # Climate domain routes
│   │   │   ├── food.js             # Food domain routes
│   │   │   ├── heartware.js        # Heartware domain routes
│   │   │   └── system.js           # System domain routes
│   │   ├── controllers/
│   │   │   ├── WaterController.js
│   │   │   ├── EnergyController.js
│   │   │   ├── ClimateController.js
│   │   │   ├── FoodController.js
│   │   │   ├── HeartwareController.js
│   │   │   └── SystemController.js
│   │   └── middleware/
│   │       ├── auth.js             # JWT authentication
│   │       ├── validation.js       # Request validation
│   │       └── errorHandler.js     # Error handling
│   └── server.js                   # Main Express server
├── prisma/
│   └── schema.prisma              # Complete database schema
├── tests/                          # Test files (Jest)
├── .env.example                    # Environment template
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Quick Start

### 1. Prerequisites

- Node.js 16+
- PostgreSQL 12+ (or MongoDB)
- npm 8+

### 2. Installation

```bash
# Copy files to sofie-backend directory
cd sofie-backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup

```bash
# Initialize Prisma
npx prisma init

# Create and seed database
npm run db:init
npm run db:seed

# Run migrations
npm run db:migrate
```

### 4. Start Development Server

```bash
# Run with auto-reload
npm run dev

# Or run in production
npm start
```

Server will start at: `http://localhost:3001`

API Documentation: `http://localhost:3001/api/docs`

## API Endpoints Overview

### Water Domain (`/api/water`)

#### Recycling System
- `GET /recycling` - Get recycling system status
- `PATCH /recycling/:id` - Update system parameters
- `POST /recycling/maintenance` - Log maintenance event

#### Water Quality
- `GET /quality` - Get latest quality test
- `POST /quality` - Record new quality test
- `GET /quality/history` - Get test history (last 30 days)

#### Water Usage
- `GET /usage` - Get current usage metrics
- `GET /usage/statistics` - Get usage statistics
- `POST /usage/record` - Record usage data

#### Leak Detection
- `GET /leaks` - Get detected leaks
- `POST /leaks/detect` - Log detected leak
- `PATCH /leaks/:id/repair` - Mark leak as repaired

#### Irrigation
- `GET /irrigation` - Get all irrigation zones
- `POST /irrigation/zones` - Create new zone
- `PATCH /irrigation/zones/:id` - Update zone
- `POST /irrigation/schedule` - Schedule watering

### Energy Domain (`/api/energy`)

#### Solar Generation
- `GET /solar` - Get current solar output
- `GET /solar/history` - Get solar generation history
- `PATCH /solar/:id` - Update panel data

#### Grid Connection
- `GET /grid` - Get grid status
- `POST /grid/disconnect` - Disconnect from grid
- `POST /grid/reconnect` - Reconnect to grid

#### Battery Management
- `GET /battery` - Get battery status
- `GET /battery/health` - Get battery health metrics
- `PATCH /battery/limits` - Set charge limits

#### Load Management
- `GET /load` - Get current load
- `GET /load/devices` - List all load devices
- `POST /load/shed` - Shed non-critical loads
- `POST /load/restore` - Restore loads

#### Forecasting
- `GET /forecast` - Get energy forecast
- `GET /forecast/24h` - Get 24-hour forecast
- `GET /forecast/pricing` - Get electricity pricing

### Climate Domain (`/api/climate`)

#### Indoor Climate
- `GET /indoor` - Get indoor climate data
- `GET /indoor/zones` - Get all climate zones
- `PATCH /indoor/zones/:id` - Update zone targets
- `POST /indoor/climate` - Record climate data

#### Weather
- `GET /forecast` - Get weather forecast
- `GET /forecast/extended` - Get 7-day forecast

#### Humidity Control
- `GET /humidity` - Get humidity status
- `PATCH /humidity/target` - Set target humidity
- `POST /humidity/dehumidify` - Start dehumidifier
- `POST /humidity/humidify` - Start humidifier

#### Air Quality
- `GET /air` - Get current air quality
- `GET /air/history` - Get air quality history
- `POST /air/alert` - Check for air quality alerts

#### Ventilation
- `GET /ventilation` - Get ventilation status
- `POST /ventilation/speed` - Set fan speed
- `POST /ventilation/filter` - Log filter replacement
- `GET /ventilation/filter` - Get filter status

### Food Domain (`/api/food`)

#### Production
- `GET /production` - Get overall production metrics
- `GET /production/gardens` - List all gardens
- `POST /production/gardens` - Create new garden
- `PATCH /production/gardens/:id` - Update garden
- `DELETE /production/gardens/:id` - Remove garden

#### Crops
- `GET /production/crops` - List all crops
- `POST /production/crops` - Plant new crop
- `PATCH /production/crops/:id` - Update crop
- `POST /production/crops/:id/harvest` - Record harvest

#### Nutrition
- `GET /nutrition` - Get nutrition metrics
- `GET /nutrition/weekly` - Get weekly averages
- `POST /nutrition/record` - Record nutrition data

#### Storage
- `GET /storage` - Get storage summary
- `GET /storage/locations` - List storage locations
- `POST /storage/items` - Add storage item
- `PATCH /storage/items/:id` - Update item
- `DELETE /storage/items/:id` - Remove item

#### Planning
- `GET /planning` - Get crop planning
- `POST /planning/crops` - Plan crop planting
- `GET /planning/calendar` - Get planting calendar

#### Safety
- `GET /safety` - Get safety test records
- `POST /safety/test` - Record safety test
- `GET /safety/compliance` - Get compliance status

### Heartware Domain (`/api/heartware`)

#### Community
- `GET /community` - Get community info
- `POST /community` - Create community
- `PATCH /community/:id` - Update community
- `GET /community/members` - List members
- `POST /community/members` - Add member
- `PATCH /community/members/:id` - Update member role
- `DELETE /community/members/:id` - Remove member

#### Resources
- `GET /resources` - List shared resources
- `POST /resources` - Add resource
- `PATCH /resources/:id` - Update resource
- `DELETE /resources/:id` - Remove resource
- `POST /resources/:id/borrow` - Borrow resource
- `POST /resources/:id/return` - Return resource

#### Governance
- `GET /governance/proposals` - List proposals
- `POST /governance/proposals` - Create proposal
- `POST /governance/vote` - Vote on proposal
- `GET /governance/votes/:proposalId` - Get votes

#### Events
- `GET /events` - List community events
- `POST /events` - Create event
- `PATCH /events/:id` - Update event
- `POST /events/:id/attend` - Attend event
- `DELETE /events/:id` - Cancel event

#### Skills
- `GET /skills` - List available skills
- `POST /skills` - Offer skill
- `POST /skills/:id/request` - Request skill

### System Domain (`/api/system`)

#### Expansion
- `GET /expansion` - Get expansion plan
- `POST /expansion` - Create expansion plan
- `PATCH /expansion/:id` - Update expansion
- `POST /expansion/:id/complete` - Complete phase

#### Inventory
- `GET /inventory` - Get inventory summary
- `GET /inventory/categories` - Get by category
- `POST /inventory/items` - Add item
- `PATCH /inventory/items/:id` - Update quantity
- `DELETE /inventory/items/:id` - Remove item
- `POST /inventory/items/:id/restock` - Log restock

#### IoT Devices
- `GET /iot/devices` - List all devices
- `GET /iot/devices/:id` - Get device details
- `POST /iot/devices` - Register device
- `PATCH /iot/devices/:id` - Update device
- `DELETE /iot/devices/:id` - Remove device
- `POST /iot/devices/:id/status` - Update status
- `GET /iot/status` - Get overall IoT status

#### Plugins
- `GET /plugins` - List installed plugins
- `POST /plugins` - Install plugin
- `PATCH /plugins/:id` - Update plugin
- `DELETE /plugins/:id` - Uninstall plugin
- `POST /plugins/:id/enable` - Enable plugin
- `POST /plugins/:id/disable` - Disable plugin

#### System Health
- `GET /health` - Get system health
- `GET /metrics` - Get system metrics
- `GET /metrics/history` - Get metrics history
- `POST /audit/log` - Log action

## Database Schema

The Prisma schema includes models for all domains:

### Water Models
- `WaterRecyclingSystem` - Recycling system status
- `WaterQuality` - Water quality tests
- `WaterUsage` - Usage metrics
- `WaterLeak` - Leak detection records
- `IrrigationZone` - Irrigation zones

### Energy Models
- `SolarPanel` - Solar panel data
- `Battery` - Battery system
- `GridConnection` - Grid connection status
- `EnergyLoad` - Load tracking

### Climate Models
- `IndoorClimate` - Indoor climate readings
- `ClimateZone` - Climate zones
- `WeatherForecast` - Weather forecasts
- `AirQuality` - Air quality readings

### Food Models
- `Garden` - Garden definitions
- `Crop` - Crop tracking
- `NutritionMetric` - Nutrition data
- `FoodStorage` - Storage inventory
- `FoodSafetyTest` - Safety test records

### Heartware Models
- `Community` - Community info
- `CommunityMember` - Member records
- `SharedResource` - Resource sharing

### System Models
- `SystemExpansion` - Expansion planning
- `Inventory` - General inventory
- `IoTDevice` - IoT device registry
- `Plugin` - Plugin management
- `AuditLog` - Action logging
- `SystemMetric` - Performance metrics

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3001
HOST=localhost

# Frontend Connection
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sofie_backend
DB_USER=sofie_user
DB_PASSWORD=your_password
DATABASE_URL=postgresql://user:password@localhost:5432/sofie_backend

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# External Services
WEATHER_API_KEY=your_key
WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# Blockchain (optional)
BLOCKCHAIN_NODE_URL=http://localhost:7545
BLOCKCHAIN_CONTRACT_ADDRESS=0x...

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/server.log
```

## Testing

```bash
# Run all tests
npm test

# Run specific domain tests
npm run test:unit
npm run test:integration

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Frontend Integration

The backend is designed to work with the `sofie-systems-ui` React frontend. Integration points:

1. **API Base URL**: Frontend should use `http://localhost:3001/api`
2. **CORS**: Configured for `http://localhost:3000`
3. **Query Parameters**: All endpoints support `?regionId=default`
4. **Response Format**: Standard JSON with error handling

Example frontend service:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const FoodService = {
  getProduction: async (regionId = 'default') => {
    const res = await fetch(`${API_BASE}/food/production?regionId=${regionId}`);
    return res.json();
  },
  
  createGarden: async (gardenData) => {
    const res = await fetch(`${API_BASE}/food/production/gardens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gardenData)
    });
    return res.json();
  }
};
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```bash
docker build -t sofie-backend .
docker run -p 3001:3001 --env-file .env sofie-backend
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb sofie_backend`

### Port Already in Use
```bash
# Change PORT in .env or use:
PORT=3002 npm run dev
```

### CORS Errors
- Verify `FRONTEND_URL` in `.env`
- Frontend must match the configured origin

### Missing Dependencies
```bash
npm install
npx prisma generate
```

## Development Roadmap

- [ ] JWT Authentication middleware
- [ ] Input validation schemas
- [ ] Rate limiting
- [ ] API caching
- [ ] WebSocket support for real-time updates
- [ ] Blockchain integration (Terracare-Ledger)
- [ ] Map system integration
- [ ] Advanced analytics endpoints
- [ ] Batch operations support

## Contributing

1. Create feature branch: `git checkout -b feature/domain-name`
2. Implement domain logic in controllers
3. Add tests for new endpoints
4. Update API documentation
5. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review test files for usage examples

---

**S.O.F.I.E. Backend API v1.0.0**
Last Updated: December 2025
