# SOFIE Systems Backend API

Production-ready Node.js/Express backend for SOFIE Systems aquaponics management platform.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB or PostgreSQL (optional for full functionality)

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_secret_here
```

### Run Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### Run Production Server

```bash
npm start
```

## 📋 API Endpoints

### Health Check
- `GET /health` - Server health status

### Water Domain
- `GET /api/water/:regionId` - Get water data
- `GET /api/water/:regionId/quality` - Water quality metrics
- `GET /api/water/:regionId/consumption` - Consumption data
- `POST /api/water/:regionId/irrigation` - Schedule irrigation
- `GET /api/water/:regionId/alerts` - Water alerts
- `PUT /api/water/:regionId/settings` - Update settings
- `GET /api/water/:regionId/history` - Historical data

### Energy Domain
- `GET /api/energy/:regionId` - Get energy data
- `GET /api/energy/:regionId/production` - Production metrics
- `GET /api/energy/:regionId/storage` - Battery/storage info
- `GET /api/energy/:regionId/consumption` - Consumption data
- `POST /api/energy/:regionId/optimize` - Trigger optimization
- `GET /api/energy/:regionId/forecast` - Energy forecast
- `PUT /api/energy/:regionId/settings` - Update settings

### Food Domain
- `GET /api/food/:regionId` - Get food production data
- `GET /api/food/:regionId/crops` - All crops
- `GET /api/food/:regionId/harvest` - Harvest forecast
- `POST /api/food/:regionId/crops` - Add new crop
- `GET /api/food/:regionId/nutrition` - Nutrition analysis
- `GET /api/food/:regionId/safety` - Food safety metrics
- `GET /api/food/:regionId/pests` - Pest management
- `PUT /api/food/:regionId/crops/:cropId` - Update crop
- `DELETE /api/food/:regionId/crops/:cropId` - Remove crop

### Climate Domain
- `GET /api/climate/:regionId` - Get climate data
- `GET /api/climate/:regionId/indoor` - Indoor climate
- `GET /api/climate/:regionId/outdoor` - Outdoor conditions
- `GET /api/climate/:regionId/zones/:zoneId` - Zone details
- `PUT /api/climate/:regionId/zones/:zoneId` - Update zone
- `GET /api/climate/:regionId/airquality` - Air quality
- `GET /api/climate/:regionId/predictions` - Climate predictions
- `GET /api/climate/:regionId/weather` - Current weather

### Community Domain
- `GET /api/community/:regionId` - Community overview
- `GET /api/community/:regionId/members` - Members list
- `GET /api/community/:regionId/posts` - Community posts
- `POST /api/community/:regionId/posts` - Create post
- `GET /api/community/:regionId/trades` - Trade history
- `POST /api/community/:regionId/trades` - Create trade
- `GET /api/community/:regionId/governance` - Governance data
- `POST /api/community/:regionId/governance/vote` - Vote on proposal
- `GET /api/community/:regionId/events` - Community events

### Admin & System
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/logs` - System logs
- `GET /api/admin/services` - Service status
- `GET /api/admin/users` - User management
- `POST /api/admin/users/:userId/role` - Update user role
- `GET /api/admin/analytics` - System analytics
- `GET /api/system/settings/:userId` - User settings
- `PUT /api/system/settings/:userId` - Update settings
- `GET /api/system/alerts` - System alerts
- `POST /api/system/alerts/:alertId/acknowledge` - Acknowledge alert
- `GET /api/system/iot/devices` - IoT devices
- `GET /api/system/iot/devices/:deviceId` - Device details

### Wellness & Impact
- `GET /api/wellness/:regionId` - Wellness metrics
- `GET /api/wellness/:regionId/impact` - Environmental impact
- `GET /api/wellness/:regionId/benchmarks` - Impact benchmarks

### Automation
- `GET /api/automation/rules` - Automation rules
- `POST /api/automation/rules` - Create rule
- `PUT /api/automation/rules/:ruleId` - Update rule
- `DELETE /api/automation/rules/:ruleId` - Delete rule
- `GET /api/automation/history` - Execution history

### Herbal Library
- `GET /api/herbal/library` - Herbal library
- `GET /api/herbal/library/:herbId` - Herb details
- `GET /api/herbal/seedbank` - Seed bank inventory
- `POST /api/herbal/seedbank` - Add seeds

### Marketplace
- `GET /api/marketplace/listings` - Marketplace listings
- `POST /api/marketplace/listings` - Create listing
- `GET /api/marketplace/trades` - Trade history
- `POST /api/marketplace/trades` - Execute trade

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - DDoS protection
- **Input Validation** - Request validation
- **JWT** - Authentication (ready for implementation)

## 📊 Response Format

All endpoints return JSON with timestamp:

```json
{
  "data": { ... },
  "timestamp": "2025-12-12T10:30:00.000Z"
}
```

Error responses:
```json
{
  "error": "Error message",
  "timestamp": "2025-12-12T10:30:00.000Z"
}
```

## 🧪 Testing

```bash
npm test
```

## 📝 Code Style

```bash
npm run lint
npm run format
```

## 🗄️ Database Integration

Currently using mock data. To integrate database:

1. Install database client (MongoDB/PostgreSQL)
2. Create schema models in `models/` directory
3. Replace mock data in routes with database queries
4. Add connection logic in `server.js`

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Build & Run
```bash
docker build -t sofie-backend .
docker run -p 5000:5000 sofie-backend
```

## 📄 License

MIT License - See LICENSE file for details
