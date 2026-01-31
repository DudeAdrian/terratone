# SOFIE Global Operating System - Complete Integration Guide

## System Architecture Overview

```
                    SOFIE GLOBAL OPERATING SYSTEM
                    
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│                   (sofie-systems-ui)                             │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   Community      │  │  Global Admin    │  │   Manager    │  │
│  │   Dashboard      │  │   Dashboard      │  │  Data Sheet  │  │
│  │ /community/:slug │  │  /global-admin   │  │ /community/  │  │
│  │                  │  │                  │  │ :slug/report │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
│           │                      │                    │          │
│           └──────────────────────┼────────────────────┘          │
│                                  │                               │
│                         React Router                             │
└──────────────────────────────────┼───────────────────────────────┘
                                   │ HTTP REST API
                                   │
┌──────────────────────────────────┼───────────────────────────────┐
│                        API LAYER                                 │
│                    (sofie-backend)                               │
│                                  │                               │
│  ┌──────────────────────────────┴───────────────┐                │
│  │         Express.js Routes                    │                │
│  │  /api/communities                           │                │
│  │  /api/communities/:slug                     │                │
│  │  /api/communities/:slug/metrics             │                │
│  │  /api/communities/:slug/alerts              │                │
│  │  /api/communities/:slug/reports             │                │
│  │  /api/transactions                          │                │
│  │  /api/resources                             │                │
│  └────────────┬─────────────────────────────────┘                │
│               │                                                  │
│  ┌────────────▼──────────────────────────────────────┐           │
│  │         Business Logic Layer                     │           │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │           │
│  │  │ AlertEngine  │  │ Community    │  │ Global │ │           │
│  │  │ Service      │  │ Service      │  │ Map    │ │           │
│  │  └──────────────┘  └──────────────┘  └────────┘ │           │
│  └────────────┬──────────────────────────────────────┘           │
│               │                                                  │
│  ┌────────────▼──────────────────────────────────────┐           │
│  │       Prisma ORM Layer                           │           │
│  │  6 Data Models:                                 │           │
│  │  • Community (64 global locations)              │           │
│  │  • CommunityMetrics (6 pillars, time-series)   │           │
│  │  • ResourceAlert (6 types, severity)           │           │
│  │  • ResourceTransaction (workflow)              │           │
│  │  • GovernanceDecision (voting system)          │           │
│  │  • CommunityReport (human + SOFIE data)        │           │
│  └────────────┬──────────────────────────────────────┘           │
│               │                                                  │
└───────────────┼──────────────────────────────────────────────────┘
                │ SQL Queries
┌───────────────▼──────────────────────────────────────────────────┐
│                        DATABASE LAYER                            │
│                     (PostgreSQL)                                 │
│                                                                  │
│  64 Communities × 6 Pillars = 384 Metric Records                │
│  Dynamic Alerts triggered by thresholds                         │
│  Resource Transactions tracked with workflow                    │
│  Governance decisions with multi-signature support              │
│  Reports with blockchain hash placeholders                      │
└──────────────────────────────────────────────────────────────────┘
                                │
                    (Optional Phase 4)
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BLOCKCHAIN LAYER                               │
│                  (Terracare Ledger)                              │
│                                                                  │
│  Smart Contracts:                                                │
│  • PoA Authentication                                            │
│  • Record Hashing                                                │
│  • Resource Transaction Verification                            │
│  • Governance Decision Audit Trail                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### 1. Frontend Setup (5 minutes)

```bash
# Navigate to frontend
cd c:\Users\squat\sofie-systems-ui

# Install dependencies (already done)
npm install --legacy-peer-deps

# Configure backend URL (.env)
echo "REACT_APP_BACKEND_URL=http://localhost:3001/api" > .env

# Start development server
npm start
# Server runs on http://localhost:3000
```

### 2. Backend Setup (10 minutes)

```bash
# Navigate to backend
cd c:\Users\squat\sofie-backend

# Install dependencies
npm install

# Setup environment (.env)
cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/sofie_db"
NODE_ENV="development"
JWT_SECRET="your-secret-key-here"
PORT=3001
EOF

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name initial_migration

# Seed database with 64 communities
node prisma/seed.js
node prisma/healthcare-seed.js
node prisma/herbal-seed.js

# Start backend server
npm run dev
# Server runs on http://localhost:3001/api
```

### 3. Database Setup (15 minutes)

```bash
# Install PostgreSQL (if not already installed)
# Download from: https://www.postgresql.org/download/

# Create database
psql -U postgres -c "CREATE DATABASE sofie_db;"

# Verify connection
psql -U postgres -d sofie_db -c "SELECT version();"
```

---

## Routes Reference

### Community Dashboard Routes

#### View Community Dashboard
```
GET http://localhost:3000/community/:slug
GET http://localhost:3000/community/nairobi-hub
GET http://localhost:3000/community/shanghai-metro
GET http://localhost:3000/community/são-paulo-megacity
```

#### Submit Community Report
```
POST http://localhost:3000/community/:slug/report
POST http://localhost:3000/community/nairobi-hub/report
```

### Global Admin Routes

#### View Global System
```
GET http://localhost:3000/global-admin
```

---

## API Endpoints Reference

### Community Operations

#### List All Communities
```
GET /api/communities
Query params:
  - continent (optional): Filter by continent
  - status (optional): Filter by status (active, inactive, setup)
  - search (optional): Search by name
  - limit (optional): Results per page (default: 20)
  - offset (optional): Pagination offset (default: 0)

Response:
{
  "communities": [
    {
      "id": "uuid",
      "slug": "nairobi-hub",
      "name": "Nairobi Hub",
      "country": "Kenya",
      "continent": "Africa",
      "population": 5000000,
      "status": "active",
      "metrics": [...],
      "alerts": [...],
      "reports": [...],
      "transactions": [...]
    }
  ],
  "total": 64
}
```

#### Get Specific Community
```
GET /api/communities/:slug
GET /api/communities/nairobi-hub

Response:
{
  "id": "uuid",
  "slug": "nairobi-hub",
  "name": "Nairobi Hub",
  "country": "Kenya",
  "continent": "Africa",
  "population": 5000000,
  "coordinates": { "lat": -1.286389, "lng": 36.817223 },
  "manager": {
    "name": "James Okonkwo",
    "email": "james@nairobi-hub.org",
    "role": "Community Manager"
  },
  "status": "active",
  "metrics": [
    {
      "healthScore": 75,
      "energyScore": 68,
      "foodScore": 82,
      "waterScore": 71,
      "tradeScore": 65,
      "governanceScore": 78,
      "recordedAt": "2025-12-09T10:30:00Z"
    }
  ],
  "alerts": [
    {
      "id": "alert-uuid",
      "type": "ENERGY_DEFICIT",
      "title": "Energy Production Shortfall",
      "severity": "WARNING",
      "deficit": 45,
      "status": "active",
      "createdAt": "2025-12-09T10:15:00Z"
    }
  ],
  "reports": [...],
  "transactions": [...]
}
```

### Metrics Management

#### Submit New Metrics
```
POST /api/communities/:slug/metrics

Request Body:
{
  "healthScore": 75,
  "energyScore": 68,
  "foodScore": 82,
  "waterScore": 71,
  "tradeScore": 65,
  "governanceScore": 78,
  "recordedAt": "2025-12-09T10:30:00Z"
}

Response:
{
  "id": "metric-uuid",
  "communityId": "community-uuid",
  "healthScore": 75,
  "energyScore": 68,
  "foodScore": 82,
  "waterScore": 71,
  "tradeScore": 65,
  "governanceScore": 78,
  "recordedAt": "2025-12-09T10:30:00Z"
}
```

#### Get Metrics History
```
GET /api/communities/:slug/metrics/history
Query params:
  - days (optional): Number of days to retrieve (default: 30)

Response:
{
  "metrics": [
    { "healthScore": 75, "recordedAt": "2025-12-09T10:30:00Z" },
    { "healthScore": 73, "recordedAt": "2025-12-08T10:30:00Z" }
  ],
  "trend": 2 // percentage change
}
```

### Alert Management

#### Get Active Alerts
```
GET /api/communities/:slug/alerts/active

Response:
{
  "alerts": [
    {
      "id": "alert-uuid",
      "type": "ENERGY_DEFICIT",
      "title": "Energy Production Shortfall",
      "severity": "WARNING",
      "deficit": 45,
      "status": "active",
      "createdAt": "2025-12-09T10:15:00Z"
    }
  ]
}
```

#### Acknowledge Alert
```
PUT /api/communities/:slug/alerts/:alertId

Request Body:
{
  "status": "acknowledged"
}

Response:
{
  "id": "alert-uuid",
  "status": "acknowledged",
  "acknowledgedAt": "2025-12-09T10:45:00Z"
}
```

### Resource Transactions

#### Propose Resource Transfer
```
POST /api/transactions/propose

Request Body:
{
  "fromCommunitySlug": "nairobi-hub",
  "toCommunitySlug": "kampala-center",
  "resourceType": "ENERGY",
  "quantity": 500,
  "estimatedDelivery": "2025-12-12"
}

Response:
{
  "id": "transaction-uuid",
  "fromCommunity": { ... },
  "toCommunity": { ... },
  "resourceType": "ENERGY",
  "quantity": 500,
  "status": "proposed",
  "createdAt": "2025-12-09T10:30:00Z"
}
```

#### Get Available Resources
```
GET /api/resources/available
Query params:
  - resourceType (optional): Filter by type
  - continent (optional): Filter by continent

Response:
{
  "available": [
    {
      "community": "nairobi-hub",
      "resourceType": "ENERGY",
      "availableQuantity": 1500,
      "score": 95
    }
  ]
}
```

### Reporting

#### Submit Report
```
POST /api/communities/:slug/reports

Request Body:
{
  "title": "Community Status Report",
  "summary": "Population: 5M, Energy: 68%, Status: Stable",
  "reportType": "human", // or "sofie"
  "reportPeriod": "daily", // or "monthly"
  "reportedBy": "James Okonkwo",
  "data": { ... } // Custom report data
}

Response:
{
  "id": "report-uuid",
  "communityId": "community-uuid",
  "title": "Community Status Report",
  "reportType": "human",
  "createdAt": "2025-12-09T10:30:00Z"
}
```

#### Get Report History
```
GET /api/communities/:slug/reports

Response:
{
  "reports": [
    {
      "id": "report-uuid",
      "title": "Community Status Report",
      "reportType": "human",
      "createdAt": "2025-12-09T10:30:00Z"
    }
  ]
}
```

---

## Testing the System

### Test 1: View Community Dashboard
```
1. Open http://localhost:3000/community/nairobi-hub
2. Verify dashboard loads
3. Check metrics display correctly
4. Verify auto-refresh (check timestamp changes every 30 seconds)
5. Test tab switching (Overview, Metrics, Alerts, Resources, Reports)
```

### Test 2: View Global Admin Dashboard
```
1. Open http://localhost:3000/global-admin
2. Verify global KPIs display
3. Check continental breakdown
4. Switch between view modes (Global, Continental, Alerts, Resources)
5. Verify drill-down to specific communities
```

### Test 3: Submit Community Report
```
1. Open http://localhost:3000/community/nairobi-hub/report
2. Fill in form with test data
3. Submit form
4. Verify success message appears
5. Check data appears in GET /api/communities/:slug/reports
```

### Test 4: API Integration
```bash
# Test backend is running
curl http://localhost:3001/api/communities

# Test specific community
curl http://localhost:3001/api/communities/nairobi-hub

# Test metrics
curl -X POST http://localhost:3001/api/communities/nairobi-hub/metrics \
  -H "Content-Type: application/json" \
  -d '{"healthScore":75,"energyScore":68,"foodScore":82,"waterScore":71,"tradeScore":65,"governanceScore":78}'
```

---

## Troubleshooting

### Frontend Issues

**Issue**: Routes not working, dashboard shows 404
**Solution**: Ensure backend is running at `http://localhost:3001/api`
```bash
cd sofie-backend
npm run dev
```

**Issue**: Styles not loading (components look unstyled)
**Solution**: Verify CSS files imported in components
```javascript
import '../styles/CommunityDashboard.css';
```

**Issue**: Data not updating
**Solution**: Check browser console for API errors
- Open DevTools → Console
- Look for network errors
- Verify `REACT_APP_BACKEND_URL` in .env

### Backend Issues

**Issue**: Database connection error
**Solution**: Verify PostgreSQL is running
```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it (Windows)
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

**Issue**: Seed data not loading
**Solution**: Ensure migrations are run first
```bash
npx prisma migrate dev
node prisma/seed.js
```

**Issue**: Port 3001 already in use
**Solution**: Kill process using port or change PORT in .env
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## Performance Optimization

### Frontend Optimization
- Components lazy-load data on mount
- Auto-refresh every 30 seconds (global-admin every 60s)
- Graceful error handling with fallbacks
- CSS optimized with media queries

### Backend Optimization
- Database indexes on frequently queried fields
- Pagination for large community lists
- Efficient metric queries with date ranges
- Smart alert detection prevents duplicate entries

### Recommended Improvements (Phase 3+)
- Implement caching with Redis
- Add WebSocket for real-time updates
- Database query optimization with explain plans
- Frontend code splitting and lazy loading

---

## Deployment Checklist

### Development
- [x] Frontend compiles without errors
- [x] Backend API running on localhost:3001
- [x] Database migrations executed
- [x] Seed data loaded (64 communities)
- [x] Dashboard routes accessible
- [ ] All API endpoints tested
- [ ] Performance validated

### Pre-Production
- [ ] HTTPS configured
- [ ] CORS properly configured
- [ ] Environment variables set securely
- [ ] Database backups automated
- [ ] Error logging configured
- [ ] Security headers added
- [ ] Load testing completed

### Production
- [ ] SSL certificates obtained
- [ ] Database replicated
- [ ] CDN configured for assets
- [ ] Monitoring alerts set up
- [ ] Disaster recovery plan tested
- [ ] Documentation updated
- [ ] Team trained on system

---

## Support & Documentation

### Key Files
- `src/PHASE_2_FRONTEND_COMPLETE.md` - Component documentation
- `sofie-backend/SOFIE_GLOBAL_OS_IMPLEMENTATION.md` - API documentation
- `sofie-backend/FRONTEND_DASHBOARD_GUIDE.md` - Component architecture

### Getting Help
1. Check error messages in browser console
2. Review API response status codes
3. Verify environment variables are set
4. Check that all servers are running

---

## Next Steps

### Phase 3: Advanced Features (Optional)
- WebSocket real-time updates
- Predictive analytics dashboards
- Multi-language support
- Advanced filtering and search
- Export reports to PDF/CSV

### Phase 4: Blockchain Integration
- Deploy Terracare Ledger contracts
- Implement record hashing
- Add governance audit trail
- Enable immutable transactions

### Phase 5: Production Hardening
- Security audits
- Performance optimization
- Compliance certifications (HIPAA, GDPR)
- Enterprise SSO integration

---

*Last Updated: December 9, 2025*
*Status: Production Ready for Backend Integration*
