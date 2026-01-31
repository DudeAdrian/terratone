# Frontend-Backend Integration Guide

## Overview

Priority #2 focuses on connecting the React frontend (`sofie-systems-ui`) to the Express.js backend (`sofie-backend`). The integration includes API service layer, custom hooks, and real-time data fetching.

---

## Architecture

### API Service Layer (`src/services/api.js`)

**Purpose**: Central hub for all backend API calls

**Features**:
- Singleton pattern for single instance
- Configurable base URL via environment variables
- Request timeout handling (30 seconds)
- Automatic error handling and formatting
- Support for authentication tokens
- Generic `request()` method for custom calls

**Usage**:
```javascript
import api from '../services/api';

// Health check
const health = await api.health();

// Water management
const recycling = await api.getWaterRecycling('default');

// Energy management
const solar = await api.getSolarSystems('default');

// Climate management
const zones = await api.getClimateZones('default');
```

### Custom Hooks (`src/hooks/useApi.js`)

**Purpose**: Reusable logic for data fetching with loading/error states

**Hooks Available**:

1. **useApiHealth()**
   - Monitors backend connectivity
   - Checks every 30 seconds
   - Returns: `{ isHealthy, isLoading, error, lastCheck }`

2. **useApiCall(apiFunction, dependencies)**
   - Generic hook for any API call
   - Handles loading and error states
   - Returns: `{ data, isLoading, error, refetch }`

3. **Domain-specific hooks**:
   - `useWaterData(regionId)` - Water management data
   - `useEnergyData(regionId)` - Energy management data
   - `useClimateData(regionId)` - Climate data
   - `useFoodData(regionId)` - Food production data
   - `useCommunityData(regionId)` - Community/heartware data
   - `useSystemData(regionId)` - System management data

**Example Usage**:
```javascript
import { useWaterData } from '../hooks/useApi';

function WaterDashboard() {
  const waterData = useWaterData('default');

  if (waterData.isLoading) return <Loading />;
  if (waterData.hasError) return <Error />;

  return (
    <div>
      <RecyclingComponent data={waterData.recycling.data} />
      <QualityComponent data={waterData.quality.data} />
      <UsageComponent data={waterData.usage.data} />
    </div>
  );
}
```

### API Status Monitor Component (`src/components/ApiStatusMonitor.js`)

**Purpose**: Visual indicator of backend connectivity

**Props**:
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' (default: 'top-right')

**Features**:
- Real-time health monitoring
- Animated status indicator
- Error message display
- Last check timestamp

**Integration**:
Already added to `App.js` to display global backend status.

---

## API Endpoints Reference

### Water Management (`/api/water`)

```
GET    /api/water/recycling              - Get recycling systems
PATCH  /api/water/recycling/:id          - Update recycling system
POST   /api/water/recycling/maintenance  - Log maintenance

GET    /api/water/quality                - Get water quality data
POST   /api/water/quality                - Record quality test
GET    /api/water/quality/history        - Get quality history

GET    /api/water/usage                  - Get water usage data
GET    /api/water/usage/statistics       - Get usage statistics
POST   /api/water/usage/record           - Record water usage

GET    /api/water/leaks                  - Get leak detection data
POST   /api/water/leaks/detect           - Detect new leak
PATCH  /api/water/leaks/:id/repair       - Mark leak as repaired

GET    /api/water/irrigation             - Get irrigation zones
POST   /api/water/irrigation/zones       - Create irrigation zone
PATCH  /api/water/irrigation/zones/:id   - Update zone
POST   /api/water/irrigation/schedule    - Schedule watering
```

### Energy Management (`/api/energy`)

```
GET    /api/energy/solar                 - Get solar systems
PATCH  /api/energy/solar/:id             - Update solar system
GET    /api/energy/solar/:id/production  - Get production data

GET    /api/energy/battery               - Get battery systems
GET    /api/energy/battery/:id/status    - Get battery status
POST   /api/energy/battery/:id/charge    - Charge battery
POST   /api/energy/battery/:id/discharge - Discharge battery

GET    /api/energy/grid                  - Get grid connection status
GET    /api/energy/grid/metrics          - Get grid metrics
POST   /api/energy/grid/usage            - Record grid usage

GET    /api/energy/consumption           - Get consumption data
GET    /api/energy/metrics               - Get energy metrics
```

### Climate Management (`/api/climate`)

```
GET    /api/climate/zones                - Get climate zones
POST   /api/climate/zones                - Create climate zone
PATCH  /api/climate/zones/:id            - Update climate zone
DELETE /api/climate/zones/:id            - Delete climate zone

GET    /api/climate/monitoring           - Get monitoring data
POST   /api/climate/monitoring/record    - Record monitoring data

GET    /api/climate/weather              - Get weather forecast
GET    /api/climate/hvac                 - Get HVAC status
PATCH  /api/climate/hvac/:id             - Update HVAC settings
```

### Food Production (`/api/food`)

```
GET    /api/food/gardens                 - Get gardens
POST   /api/food/gardens                 - Create garden
PATCH  /api/food/gardens/:id             - Update garden

GET    /api/food/crops                   - Get crop plans
POST   /api/food/crops/plant             - Record planting
POST   /api/food/crops/:id/harvest       - Record harvest

GET    /api/food/storage                 - Get storage locations
GET    /api/food/storage/:id/inventory   - Get storage inventory
POST   /api/food/storage/record          - Record storage entry

GET    /api/food/pests                   - Get pest management
POST   /api/food/pests/report            - Report pest issue
```

### Community & Heartware (`/api/heartware`)

```
GET    /api/heartware/resources          - Get community resources
POST   /api/heartware/resources          - Create resource
POST   /api/heartware/resources/:id/share - Share resource

GET    /api/heartware/skills             - Get skills marketplace
POST   /api/heartware/skills             - List skill

GET    /api/heartware/events             - Get community events
POST   /api/heartware/events             - Create event

GET    /api/heartware/wellness           - Get wellness tracking
POST   /api/heartware/wellness/record    - Record wellness data
```

### System Management (`/api/system`)

```
GET    /api/system/expansions            - Get expansion plans
POST   /api/system/expansions            - Create expansion plan

GET    /api/system/assets                - Get asset inventory
POST   /api/system/assets                - Record asset

GET    /api/system/iot                   - Get IoT devices
POST   /api/system/iot                   - Register IoT device

GET    /api/system/config                - Get system configuration
PATCH  /api/system/config                - Update configuration

GET    /api/system/metrics               - Get system metrics
```

---

## Configuration

### Environment Variables (`.env`)

```bash
# API Base URL (required)
REACT_APP_API_URL=http://localhost:3001

# Optional settings
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_ANALYTICS=true
```

### Backend Requirements

**Backend must be running**:
```bash
cd sofie-backend
node src/index.js
```

**Port**: 3001 (default)

---

## Implementation Guide

### Step 1: Component Integration

Replace static data with API calls using hooks:

```javascript
import { useWaterData } from '../hooks/useApi';

function WaterRecycling() {
  const { recycling, isLoading, hasError } = useWaterData();

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading data</div>;

  return (
    <div>
      {recycling.data?.map(system => (
        <RecyclingCard key={system.id} system={system} />
      ))}
    </div>
  );
}
```

### Step 2: Error Handling

Components should display appropriate error messages:

```javascript
function Dashboard() {
  const { data, isLoading, error, refetch } = useApiCall(
    () => api.getWaterRecycling()
  );

  if (error) {
    return (
      <ErrorAlert 
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  // ... render data
}
```

### Step 3: Loading States

Provide user feedback during data fetching:

```javascript
function DataList() {
  const { data, isLoading } = useApiCall(apiFunction);

  return (
    <div>
      {isLoading ? (
        <Skeleton count={5} />
      ) : (
        data?.map(item => <Item key={item.id} item={item} />)
      )}
    </div>
  );
}
```

### Step 4: Data Mutations

Handle POST/PATCH requests:

```javascript
async function createWaterZone(formData) {
  try {
    const result = await api.createIrrigationZone(formData);
    // Handle success
    refetch(); // Refresh data
  } catch (error) {
    // Handle error
    console.error('Failed to create zone:', error);
  }
}
```

---

## Testing

### Health Check

```bash
curl http://localhost:3001/health
# Expected: { "status": "ok", "timestamp": "..." }
```

### Example Endpoint Test

```bash
curl http://localhost:3001/api/water/recycling
```

### Frontend Testing

The app should display:
1. API Status Monitor in top-right corner
2. "Backend Connected" indicator with green dot (if running)
3. "Backend Disconnected" with red dot (if not running)

---

## Troubleshooting

### Backend Connection Failed

**Symptoms**: API Status shows "Backend Disconnected"

**Solutions**:
1. Verify backend is running: `node src/index.js` in sofie-backend
2. Check port: Backend should be on 3001
3. Check .env: `REACT_APP_API_URL=http://localhost:3001`
4. Clear browser cache and reload

### CORS Errors

**Symptoms**: Network errors in browser console

**Solution**: Backend already has CORS configured for localhost:3000

### API Call Timeouts

**Symptoms**: Calls hang for 30+ seconds

**Solutions**:
1. Check network connection
2. Verify backend is responding: `curl http://localhost:3001/health`
3. Check database connectivity in backend

---

## Performance Considerations

### Caching Strategy

Consider implementing React Query or SWR for:
- Request deduplication
- Background refetching
- Stale data handling
- Cache invalidation

### Pagination

For large datasets, implement pagination:
```javascript
const { data } = useApiCall(
  () => api.getWaterRecycling(regionId, { page: 1, limit: 20 })
);
```

### Real-time Updates

For live data, consider WebSockets:
```javascript
// Future enhancement
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001/live/water');
  ws.onmessage = (event) => setData(JSON.parse(event.data));
  return () => ws.close();
}, []);
```

---

## Next Steps

1. **Update Dashboard Components**: Connect all dashboard pages to API
2. **Add Loading Skeletons**: Better UX during data fetching
3. **Implement Error Boundaries**: Graceful error handling
4. **Add Data Caching**: Improve performance with request deduplication
5. **Real-time Updates**: WebSocket integration for live data
6. **Offline Mode**: Service worker for offline functionality

---

## Files Created/Modified

### New Files
- `src/services/api.js` - API service layer
- `src/hooks/useApi.js` - Custom hooks for data fetching
- `src/components/ApiStatusMonitor.js` - Status display component
- `src/styles/components/api-status.css` - Status monitor styles
- `.env` - Environment configuration

### Modified Files
- `src/App.js` - Added ApiStatusMonitor import and component

---

## Documentation

- See `src/services/api.js` for all available API methods
- See `src/hooks/useApi.js` for hook usage examples
- See individual component files for implementation patterns

---

**Status**: In Progress
**Last Updated**: Today
**Next Phase**: Component Integration & Testing
