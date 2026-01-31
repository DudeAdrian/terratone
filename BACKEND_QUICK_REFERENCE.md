# Backend API Quick Reference Guide

## 🚀 Getting Started - 5 Minute Setup

### 1. Copy Backend Files
```bash
cp -r src/backend/* /path/to/sofie-backend/
cp BACKEND_*.* /path/to/sofie-backend/
```

### 2. Install & Configure
```bash
cd sofie-backend
npm install
cp BACKEND_ENV_TEMPLATE.txt .env
# Edit .env with your database info
```

### 3. Start Server
```bash
npm run dev
# Server runs at http://localhost:3001
```

### 4. Test API
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/docs
```

---

## 📡 API Base URLs

```
Production: http://your-domain:3001/api
Development: http://localhost:3001/api
Health Check: http://localhost:3001/api/health
Documentation: http://localhost:3001/api/docs
```

---

## 🌊 Water Domain

```javascript
// Get recycling system
GET /api/water/recycling?regionId=default

// Get water quality
GET /api/water/quality

// Record quality test
POST /api/water/quality
{ ph: 7.2, turbidity: 0.5, bacteria: "safe" }

// Get water usage
GET /api/water/usage

// Get irrigation zones
GET /api/water/irrigation

// Create irrigation zone
POST /api/water/irrigation/zones
{ name: "garden-a", targetMoisture: 65 }
```

---

## ⚡ Energy Domain

```javascript
// Get solar data
GET /api/energy/solar

// Get battery status
GET /api/energy/battery

// Get current load
GET /api/energy/load

// Get grid status
GET /api/energy/grid

// Get 24h forecast
GET /api/energy/forecast/24h

// Get electricity pricing
GET /api/energy/forecast/pricing
```

---

## 🌡️ Climate Domain

```javascript
// Get indoor climate
GET /api/climate/indoor

// Get climate zones
GET /api/climate/indoor/zones

// Record climate data
POST /api/climate/indoor/climate
{ temperature: 21.5, humidity: 45, co2: 420 }

// Get humidity status
GET /api/climate/humidity

// Get air quality
GET /api/climate/air

// Get ventilation status
GET /api/climate/ventilation
```

---

## 🌱 Food Domain

```javascript
// Get production summary
GET /api/food/production

// Get all gardens
GET /api/food/production/gardens

// Create new garden
POST /api/food/production/gardens
{
  gardenId: "Raised-Beds-1",
  location: "South yard",
  areaSqm: 12,
  type: "raised beds",
  crops: ["tomatoes", "peppers"]
}

// Get crops
GET /api/food/production/crops

// Plant crop
POST /api/food/production/crops
{
  gardenId: "Raised-Beds-1",
  name: "tomatoes",
  type: "vegetable",
  plantDate: "2025-01-15",
  harvestDate: "2025-06-15"
}

// Get food storage
GET /api/food/storage

// Add storage item
POST /api/food/storage/items
{
  location: "Root Cellar",
  itemName: "carrots",
  quantity: 25,
  unit: "kg"
}

// Get nutrition metrics
GET /api/food/nutrition

// Record nutrition
POST /api/food/nutrition/record
{
  category: "Vegetables",
  daily: 380,
  target: 400
}

// Get food safety records
GET /api/food/safety

// Record safety test
POST /api/food/safety/test
{
  testedItem: "soil-sample",
  bacteria: "safe",
  toxins: "none",
  mold: "none"
}
```

---

## ❤️ Heartware Domain

```javascript
// Get community info
GET /api/heartware/community

// Create community
POST /api/heartware/community
{
  name: "Garden Community",
  description: "Local gardening collective"
}

// Get community members
GET /api/heartware/community/members

// Add member
POST /api/heartware/community/members
{
  userId: "user-001",
  role: "member"
}

// Get shared resources
GET /api/heartware/resources

// Add shared resource
POST /api/heartware/resources
{
  type: "tools",
  name: "Hand Tiller",
  available: 1,
  borrowable: true,
  owner: "user-001"
}

// Borrow resource
POST /api/heartware/resources/:id/borrow
{ userId: "user-002", returnDate: "2025-01-20" }

// Get proposals
GET /api/heartware/governance/proposals

// Vote on proposal
POST /api/heartware/governance/vote
{
  proposalId: "prop-001",
  userId: "user-001",
  vote: "yes"
}

// Get events
GET /api/heartware/events

// Create event
POST /api/heartware/events
{
  name: "Community Garden Day",
  date: "2025-01-20T10:00:00Z",
  description: "Monthly maintenance day"
}
```

---

## 🔧 System Domain

```javascript
// Get expansion plan
GET /api/system/expansion

// Get inventory
GET /api/system/inventory

// Get inventory by category
GET /api/system/inventory/categories?category=solar

// Add inventory item
POST /api/system/inventory/items
{
  category: "solar",
  itemName: "Panel 400W",
  quantity: 4,
  unit: "pieces",
  location: "Roof"
}

// Get IoT devices
GET /api/system/iot/devices

// Register device
POST /api/system/iot/devices
{
  deviceId: "sensor-001",
  type: "temperature",
  name: "Bedroom Temp",
  location: "Bedroom"
}

// Get IoT status
GET /api/system/iot/status

// Get installed plugins
GET /api/system/plugins

// Install plugin
POST /api/system/plugins
{
  name: "Weather Integration",
  version: "1.0.0"
}

// Get system health
GET /api/system/health

// Get system metrics
GET /api/system/metrics
```

---

## 📊 Common Query Parameters

All endpoints support:

```
?regionId=default    # Region isolation (default: 'default')
?days=7             # Historical data period (e.g., /api/water/quality/history?days=7)
?category=solar     # Filter by category
?type=tools         # Filter by type
?status=active      # Filter by status
```

---

## 🔄 Request/Response Pattern

### Standard Success Response
```json
{
  "id": "uuid-string",
  "regionId": "default",
  "data": "...",
  "createdAt": "2025-12-11T10:30:00Z",
  "updatedAt": "2025-12-11T10:30:00Z"
}
```

### Standard Error Response
```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "2025-12-11T10:30:00Z",
  "path": "/api/water/quality/invalid-id"
}
```

### List Response
```json
[
  { "id": "1", "name": "Item 1", ... },
  { "id": "2", "name": "Item 2", ... }
]
```

---

## 🔐 Authentication (Ready to Implement)

```javascript
// Will be added to routes
Authorization: Bearer <JWT_TOKEN>

// Will be created in middleware/auth.js
app.use('/api', authenticateToken);

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify JWT...
  next();
}
```

---

## 📱 Frontend Integration Example

```javascript
// React Hook
export const useFoodProduction = (regionId = 'default') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/food/production?regionId=${regionId}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [regionId]);

  return { data, loading };
};

// Usage
const Production = () => {
  const { data, loading } = useFoodProduction();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Monthly Yield: {data.monthlyYield} kg</h2>
      <h3>Gardens: {data.gardens.length}</h3>
    </div>
  );
};
```

---

## 🗄️ Database Models Summary

| Domain | Models | Purpose |
|--------|--------|---------|
| Water | 5 | Recycling, quality, usage, leaks, irrigation |
| Energy | 4 | Solar, battery, grid, load |
| Climate | 4 | Indoor, zones, weather, air quality |
| Food | 5 | Gardens, crops, nutrition, storage, safety |
| Heartware | 3 | Community, members, resources |
| System | 5 | Expansion, inventory, IoT, plugins, audit |

---

## 🚦 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success - GET, PATCH |
| 201 | Created - POST |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## 📈 Performance Tips

1. **Use regionId filtering** to isolate data
2. **Filter by date ranges** for historical data
3. **Request only needed fields** (implement in phase 2)
4. **Batch operations** coming in phase 2
5. **Use caching** for frequently accessed endpoints

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port is in use
netstat -ano | findstr :3001

# Use different port
PORT=3002 npm run dev
```

### Database connection error
```bash
# Verify PostgreSQL is running
psql -U postgres

# Check .env file
cat .env

# Reset database
dropdb sofie_backend
createdb sofie_backend
npm run db:init
```

### CORS errors from frontend
```bash
# Verify FRONTEND_URL in .env
FRONTEND_URL=http://localhost:3000

# Restart server
npm run dev
```

### No data returned
```bash
# Make sure regionId query param is included
curl "http://localhost:3001/api/food/production?regionId=default"

# Or use default parameter (it's automatic)
curl "http://localhost:3001/api/food/production"
```

---

## 📚 Documentation Files

- **BACKEND_SETUP.md** - Original setup guide
- **src/backend/README.md** - Complete API documentation
- **BACKEND_IMPLEMENTATION_SUMMARY.md** - What was built
- **/api/docs** - Auto-generated API reference

---

## 🎯 Next Steps

1. ✅ Copy files to sofie-backend
2. ✅ Install dependencies
3. ✅ Configure database
4. ✅ Start development server
5. 🔄 **Coming Next**: Authentication middleware
6. 🔄 **Then**: Input validation
7. 🔄 **Then**: Frontend integration testing

---

## 💡 Quick Development Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm test                # Run tests
npm run lint            # Check code quality

# Database
npm run db:init         # Initialize database
npm run db:seed         # Seed sample data
npm run db:migrate      # Run migrations

# Documentation
npm run generate:docs   # Generate API docs
npm run generate:openapi # Generate OpenAPI spec
```

---

**S.O.F.I.E. Backend API v1.0.0**
All 6 domains ready for integration! 🚀
