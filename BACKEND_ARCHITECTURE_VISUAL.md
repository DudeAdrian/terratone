# S.O.F.I.E. Backend Architecture Overview

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│                   (sofie-systems-ui - React)                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Pages & Components                                           │  │
│  │  - PanelCarousel (Orbital rings with 6 domains)             │  │
│  │  - Domain-specific pages (Water, Energy, Climate, etc)      │  │
│  │  - Dashboard views                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓ (HTTP/REST)                         │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND API LAYER                            │
│                    (sofie-backend - Express.js)                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Express.js Server (localhost:3001)              │  │
│  │                                                               │  │
│  │  MIDDLEWARE STACK                                            │  │
│  │  ├─ CORS Handler (allow frontend origin)                    │  │
│  │  ├─ Body Parser (JSON/form data)                            │  │
│  │  ├─ Request Logger                                          │  │
│  │  └─ Error Handler                                           │  │
│  │                                                               │  │
│  │  ROUTES & CONTROLLERS (76+ REST Endpoints)                  │  │
│  │  │                                                           │  │
│  │  ├─ /api/water          → WaterController                  │  │
│  │  │  ├─ /recycling       (GET, PATCH, POST)                 │  │
│  │  │  ├─ /quality         (GET, POST)                        │  │
│  │  │  ├─ /usage           (GET, POST)                        │  │
│  │  │  ├─ /leaks           (GET, POST, PATCH)                 │  │
│  │  │  └─ /irrigation      (GET, POST, PATCH)                 │  │
│  │  │                                                           │  │
│  │  ├─ /api/energy         → EnergyController                 │  │
│  │  │  ├─ /solar           (GET, PATCH)                       │  │
│  │  │  ├─ /grid            (GET, POST)                        │  │
│  │  │  ├─ /battery         (GET, PATCH)                       │  │
│  │  │  ├─ /load            (GET, POST)                        │  │
│  │  │  └─ /forecast        (GET)                              │  │
│  │  │                                                           │  │
│  │  ├─ /api/climate        → ClimateController                │  │
│  │  │  ├─ /indoor          (GET, PATCH, POST)                 │  │
│  │  │  ├─ /forecast        (GET)                              │  │
│  │  │  ├─ /humidity        (GET, PATCH, POST)                 │  │
│  │  │  ├─ /air             (GET, POST)                        │  │
│  │  │  └─ /ventilation     (GET, POST)                        │  │
│  │  │                                                           │  │
│  │  ├─ /api/food           → FoodController                   │  │
│  │  │  ├─ /production      (GET, POST, PATCH, DELETE)         │  │
│  │  │  ├─ /crops           (GET, POST, PATCH)                 │  │
│  │  │  ├─ /nutrition       (GET, POST)                        │  │
│  │  │  ├─ /storage         (GET, POST, PATCH, DELETE)         │  │
│  │  │  ├─ /planning        (GET, POST)                        │  │
│  │  │  └─ /safety          (GET, POST)                        │  │
│  │  │                                                           │  │
│  │  ├─ /api/heartware      → HeartwareController              │  │
│  │  │  ├─ /community       (GET, POST, PATCH)                 │  │
│  │  │  ├─ /resources       (GET, POST, PATCH, DELETE)         │  │
│  │  │  ├─ /governance      (GET, POST)                        │  │
│  │  │  ├─ /events          (GET, POST, PATCH, DELETE)         │  │
│  │  │  └─ /skills          (GET, POST)                        │  │
│  │  │                                                           │  │
│  │  └─ /api/system         → SystemController                 │  │
│  │     ├─ /expansion       (GET, POST, PATCH)                 │  │
│  │     ├─ /inventory       (GET, POST, PATCH, DELETE)         │  │
│  │     ├─ /iot             (GET, POST, PATCH, DELETE)         │  │
│  │     ├─ /plugins         (GET, POST, PATCH, DELETE)         │  │
│  │     ├─ /health          (GET)                              │  │
│  │     └─ /metrics         (GET)                              │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓ (Queries)                           │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           Prisma ORM (Database Abstraction)                  │  │
│  │                                                               │  │
│  │  • Type-safe database queries                               │  │
│  │  • Automatic migrations                                     │  │
│  │  • Connection pooling                                       │  │
│  │  • Query logging (development)                              │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database (Primary)                   │  │
│  │  OR MongoDB (Alternative)                                   │  │
│  │                                                               │  │
│  │  TABLES (25+ Models)                                        │  │
│  │  ├─ Water Domain          (5 models)                        │  │
│  │  ├─ Energy Domain         (4 models)                        │  │
│  │  ├─ Climate Domain        (4 models)                        │  │
│  │  ├─ Food Domain           (5 models)                        │  │
│  │  ├─ Heartware Domain      (3 models)                        │  │
│  │  ├─ System Domain         (5 models)                        │  │
│  │  ├─ Audit Logs            (1 model)                         │  │
│  │  └─ System Metrics        (1 model)                         │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: Getting Food Production Data

```
User Action (Frontend)
    ↓
GET http://localhost:3001/api/food/production?regionId=default
    ↓
Express Router matches /api/food
    ↓
Routes/food.js routes to FoodController.getProduction()
    ↓
FoodController
    ├─ Extract regionId from query params
    ├─ Call db.getInstance().garden.findMany()
    ├─ Calculate aggregates (total yield, biodiversity)
    └─ Return structured response
    ↓
Prisma ORM
    ├─ Build SQL query: SELECT * FROM "Garden" WHERE regionId = ?
    ├─ Execute against database
    └─ Return typed results
    ↓
PostgreSQL Database
    ├─ Query gardens table
    └─ Return rows
    ↓
Response to Frontend (JSON)
{
  "gardens": [...],
  "monthlyYield": 42.5,
  "yearlyProjection": 510,
  "biodiversity": 24
}
    ↓
React Component receives data
    ↓
Display in UI
```

---

## 📊 Data Model Relationships

### Water Domain Models
```
WaterRecyclingSystem
    └─ [1-to-many] WaterQuality
    └─ [1-to-many] WaterUsage
    └─ [1-to-many] WaterLeak
    └─ [1-to-many] IrrigationZone
```

### Food Domain Models
```
Garden
    └─ [1-to-many] Crop
FoodStorage
    └─ [1-to-many] FoodSafetyTest
NutritionMetric
```

### Heartware Domain Models
```
Community
    └─ [1-to-many] CommunityMember
    └─ [1-to-many] SharedResource
```

### System Domain Models
```
SystemExpansion
Inventory
IoTDevice
    └─ [1-to-1] DeviceStatus
Plugin
    └─ [1-to-1] PluginConfig
```

---

## 🗄️ Complete Data Model List

### Water (5 models)
- WaterRecyclingSystem
- WaterQuality
- WaterUsage
- WaterLeak
- IrrigationZone

### Energy (4 models)
- SolarPanel
- Battery
- GridConnection
- EnergyLoad

### Climate (4 models)
- IndoorClimate
- ClimateZone
- WeatherForecast
- AirQuality

### Food (5 models)
- Garden
- Crop
- NutritionMetric
- FoodStorage
- FoodSafetyTest

### Heartware (3 models)
- Community
- CommunityMember
- SharedResource

### System (5 models)
- SystemExpansion
- Inventory
- IoTDevice
- Plugin
- [+ AuditLog, SystemMetric]

---

## 🔐 Security & Scalability Features (Ready for Implementation)

### Authentication Layer (Phase 2)
```
Client Request
    ↓
Extract JWT from Authorization header
    ↓
Verify token with JWT_SECRET
    ↓
Decode user info (id, role, permissions)
    ↓
Attach to req.user
    ↓
Controller checks role permissions
    ↓
Grant/Deny access
```

### Input Validation (Phase 2)
```
Request Body
    ↓
Joi schema validation
    ↓
Type checking
    ↓
Range validation
    ↓
Pass/Fail
```

### Rate Limiting (Phase 3)
```
Request received
    ↓
Check IP rate limit (redis)
    ↓
If exceeded: return 429 Too Many Requests
    ↓
Otherwise: process request
```

---

## 🚀 Deployment Architecture

### Development
```
npm run dev
    ↓
Nodemon watches files
    ↓
Auto-restart on changes
    ↓
Logging to console
    ↓
Access via localhost:3001
```

### Production
```
npm start
    ↓
Production-grade node process
    ↓
Environment variables from .env
    ↓
Error logging to file
    ↓
Running on specified PORT
    ↓
Behind reverse proxy (nginx/apache)
    ↓
Database in secure network
```

### Docker Deployment
```
Dockerfile
    ├─ FROM node:16-alpine
    ├─ COPY package*.json
    ├─ RUN npm install
    ├─ COPY src/backend
    ├─ EXPOSE 3001
    └─ CMD ["npm", "start"]
    
    ↓
    
docker build -t sofie-backend .
docker run -p 3001:3001 --env-file .env sofie-backend
```

---

## 📈 API Response Patterns

### Success Response (200, 201)
```json
{
  "id": "cuid-123",
  "regionId": "default",
  "data": { ... },
  "createdAt": "2025-12-11T10:30:00Z",
  "updatedAt": "2025-12-11T10:30:00Z"
}
```

### List Response
```json
[
  { "id": "1", ... },
  { "id": "2", ... }
]
```

### Error Response (4xx, 5xx)
```json
{
  "error": "Not Found",
  "message": "Garden with ID 123 not found",
  "timestamp": "2025-12-11T10:30:00Z",
  "path": "/api/food/production/gardens/123"
}
```

---

## 🔄 Domain Isolation & Multi-Region Support

Every endpoint supports regionId for data isolation:

```
/api/food/production?regionId=house-1
    ↓
SELECT * FROM "Garden" WHERE regionId = 'house-1'
    ↓
Returns gardens only for house-1
    ↓
Other regions' data is protected
```

This allows:
- Multiple independent S.O.F.I.E. installations
- Data privacy between regions
- Scalable multi-tenant architecture

---

## 🎯 Development Roadmap & Architecture

```
COMPLETED (✅)
├─ Express server setup
├─ Route definitions (76+ endpoints)
├─ Controllers with business logic
├─ Database schema (Prisma)
├─ CORS configuration
└─ API documentation

PHASE 2 (🔄)
├─ JWT authentication middleware
├─ Input validation (Joi schemas)
├─ Error handling middleware
├─ Request logging
└─ Database seeding

PHASE 3 (⏳)
├─ Rate limiting
├─ Caching layer (Redis)
├─ WebSocket support
├─ Advanced filtering
└─ Batch operations

PHASE 4 (⏳)
├─ Blockchain integration (Terracare-Ledger)
├─ Map system integration (sofie-map-system)
├─ Analytics endpoints
├─ Reporting system
└─ Advanced security (OAuth, SAML)
```

---

## 📦 Technology Stack

```
Application Layer
├─ Node.js 16+          (Runtime)
├─ Express.js 4.18      (HTTP framework)
└─ TypeScript (optional, future)

Data Layer
├─ Prisma 4.0+         (ORM)
├─ PostgreSQL 12+       (Primary DB)
└─ MongoDB (optional)

Development
├─ npm                  (Package manager)
├─ Jest                 (Testing)
├─ ESLint               (Linting)
├─ Nodemon              (Auto-reload)
└─ Postman (tools)      (API testing)

Deployment
├─ Docker               (Containerization)
├─ Docker Compose       (Orchestration)
├─ Nginx/Apache         (Reverse proxy)
└─ Environment vars     (Configuration)
```

---

## ✨ Key Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| **REST API** | ✅ Complete | 76+ endpoints |
| **CRUD Operations** | ✅ Complete | Full coverage all domains |
| **Database** | ✅ Ready | 25+ Prisma models |
| **Multi-region** | ✅ Built-in | regionId isolation |
| **Error Handling** | ✅ Complete | Global error handler |
| **CORS** | ✅ Configured | Frontend integration ready |
| **Logging** | ✅ Request logs | Morgan middleware |
| **Documentation** | ✅ Complete | /api/docs endpoint |
| **Authentication** | ⏳ Phase 2 | JWT ready |
| **Validation** | ⏳ Phase 2 | Joi schemas ready |
| **Rate Limiting** | ⏳ Phase 3 | Architecture designed |
| **WebSockets** | ⏳ Phase 3 | Socket.io ready |

---

## 🚦 Health Check Endpoint

```bash
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2025-12-11T10:30:00Z",
  "uptime": 3600,
  "environment": "development"
}
```

---

## 📚 Documentation Endpoints

```
/api/health              ← Server health
/api/docs                ← Complete API documentation
/api/water               ← Water endpoints
/api/energy              ← Energy endpoints
/api/climate             ← Climate endpoints
/api/food                ← Food endpoints
/api/heartware           ← Heartware endpoints
/api/system              ← System endpoints
```

---

**S.O.F.I.E. Backend Architecture v1.0.0**

Complete, documented, and ready for deployment! 🚀
