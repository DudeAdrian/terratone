# Service Dependency Documentation

This document maps all service-to-service dependencies in the Sofie Systems UI to establish a "true tree structure" with independent, sustainable branches.

## Dependency Graph Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      SofieCore (Registry)                   │
│   - Manages service lifecycle & initialization order        │
│   - Provides sofieCore.getService(name) lookup              │
│   - Stores sofieCore.services[name] registry                │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
    ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐
    │ Foundation  │   │ Domain       │   │ Cross-Domain     │
    │ Services    │   │ Services     │   │ Services         │
    └─────────────┘   └──────────────┘   └──────────────────┘
         │                   │                    │
         │ (storage,         │ (food,water,      │ (autopilot,
         │  logger,          │  energy,housing,  │  governance,
         │  auth)            │  aquatic life)    │  marketplace)
```

## Foundation Services (No Dependencies)

Services that require NO other services and form the base layer.

### 1. **LoggerService** (`src/services/LoggerService.js`)
- **Role**: Central logging across all services
- **Requires**: Nothing
- **Provides**: `log()`, `warn()`, `error()`, `info()`
- **Usage**: All other services call `sofieCore.getService("logger")`
- **Data Contract**: All methods accept `(message: string, data?: any)`
- **Sustainability**: ✅ Standalone; no circular dependencies

### 2. **StorageService** (`src/services/StorageService.js`)
- **Role**: Persistent data storage (localStorage wrapper)
- **Requires**: Nothing
- **Provides**: `get()`, `set()`, `remove()`, `clear()`, `getAllKeys()`
- **Usage**: Many services persist state
- **Data Contract**: Stores JSON-serializable objects
- **Sustainability**: ✅ Standalone; no circular dependencies

### 3. **AuthService** (`src/services/AuthService.js`)
- **Role**: User authentication & session management
- **Requires**: StorageService (for token persistence)
- **Provides**: `login()`, `logout()`, `getCurrentUser()`, `isAuthenticated()`
- **Usage**: Pages/components check authentication state
- **Data Contract**: User shape: `{ id, email, role, permissions[] }`
- **Sustainability**: ✅ Minimal dependency on storage only

---

## Domain Services (Primary Business Logic)

Services encapsulating specific domains; can depend on Foundation + other Domain services.

### 4. **GlobalGrowingScheduleService** (`src/services/GlobalGrowingScheduleService.js`)
- **Role**: Global crop scheduling across all zones
- **Requires**: 
  - ✅ StorageService (persist schedules)
  - ✅ LoggerService (logging)
- **Provides**: `getScheduleForMonth()`, `getCropsByZone()`, `updateSchedule()`
- **Consumed By**: 
  - HarvestForecastService
  - PestManagementService
  - WaterRecyclingService
  - NutritionOptimization (page)
  - ClimateZoneManager (component)
- **Data Contract**: Returns `{ cropsByZone: { [zone]: Crop[] }, season, month }`
- **Sustainability**: ⚠️ Bottleneck - many services depend on this; consider event-driven updates

### 5. **FoodService** (`src/services/FoodService.js`)
- **Role**: Food production & nutrition tracking
- **Requires**: 
  - ✅ GlobalGrowingScheduleService (crop schedules)
  - ✅ StorageService (persist inventory)
  - ✅ LoggerService
- **Provides**: `getProduction()`, `getNutritionProfile()`, `updateInventory()`
- **Consumed By**:
  - AutopilotService
  - SystemDashboard (page)
  - NutritionOptimization (page)
- **Data Contract**: Returns `{ production: kg, nutrition: { calories, protein, fiber }, inventory: [] }`
- **Sustainability**: ✅ Depends only on foundation + GlobalGrowingScheduleService

### 6. **WaterService** (`src/services/WaterService.js`)
- **Role**: Water consumption & reserves
- **Requires**:
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `getReserves()`, `getConsumption()`, `updateLevels()`
- **Consumed By**:
  - PredictiveAnalyticsService
  - AutopilotService
  - SystemDashboard (page)
- **Data Contract**: Returns `{ reserves: liters, consumption: liters/day, recycled: liters }`
- **Sustainability**: ✅ Independent domain service

### 7. **WaterRecyclingService** (`src/services/WaterRecyclingService.js`)
- **Role**: Water recycling systems & maintenance
- **Requires**:
  - ✅ GlobalGrowingScheduleService (water demand forecasting)
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `getRecycledWater()`, `getSystemStatus()`, `scheduleM aintenance()`
- **Consumed By**:
  - AutopilotService
  - SystemDashboard (page)
- **Data Contract**: Returns `{ recycledWater: liters, systemHealth: 0-100, maintenance: Task[] }`
- **Sustainability**: ✅ Depends on schedule + storage

### 8. **EnergyService** (`src/services/EnergyService.js`)
- **Role**: Energy production & consumption
- **Requires**:
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `getProduction()`, `getConsumption()`, `getReserves()`
- **Consumed By**:
  - GlobalNetworkService (trade matching)
  - AutopilotService
  - PredictiveAnalyticsService
  - SystemDashboard (page)
- **Data Contract**: Returns `{ production: kWh, consumption: kWh, reserves: kWh, balance: kWh }`
- **Sustainability**: ✅ Independent; other services pull data on-demand

### 9. **HousingService** (`src/services/HousingService.js`)
- **Role**: Housing capacity & occupancy
- **Requires**:
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `getCapacity()`, `getOccupancy()`, `updateHousing()`
- **Consumed By**:
  - AutopilotService
- **Data Contract**: Returns `{ capacity: persons, occupancy: persons, units: [] }`
- **Sustainability**: ✅ Independent domain service

### 10. **PestManagementService** (`src/services/PestManagementService.js`)
- **Role**: Pest detection, treatment, & prevention
- **Requires**:
  - ✅ GlobalGrowingScheduleService (crop exposure by season)
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `detectPest()`, `createAlert()`, `recordTreatment()`
- **Consumed By**:
  - AutopilotService
  - PredictiveAnalyticsService
  - SystemDashboard (page)
  - GlobalSearch (component)
- **Data Contract**: Returns `{ activeAlerts: Alert[], treatments: Treatment[], history: History[] }`
- **Sustainability**: ⚠️ Depends on GlobalGrowingScheduleService; consider caching schedule data

### 11. **HarvestForecastService** (`src/services/HarvestForecastService.js`)
- **Role**: Predict harvests & yields
- **Requires**:
  - ✅ GlobalGrowingScheduleService (crop timeline)
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `getForecast()`, `getYieldPrediction()`, `updateTargets()`
- **Consumed By**:
  - PredictiveAnalyticsService
  - SystemDashboard (page)
- **Data Contract**: Returns `{ monthlyForecast: { month, crop, expectedYield }, nutrition: {} }`
- **Sustainability**: ✅ Depends only on schedule + storage

### 12. **AquaticLifeService** (`src/services/AquaticLifeService.js`)
- **Role**: Aquaponics system & aquatic species management
- **Requires**:
  - ✅ StorageService
  - ✅ LoggerService
- **Provides**: `getPopulation()`, `getHealth()`, `recordObservation()`
- **Consumed By**:
  - PredictiveAnalyticsService
  - ClimateZoneManager (component)
  - GlobalSearch (component)
- **Data Contract**: Returns `{ species: { name, population, health, tank }, observations: [] }`
- **Sustainability**: ✅ Independent; no hard dependencies on other domains

### 13. **GlobalNetworkService** (`src/services/GlobalNetworkService.js`)
- **Role**: Inter-community resource trading & collaboration
- **Requires**:
  - ✅ StorageService (persist trades, ledger)
  - ✅ LoggerService
  - ❌ **NOTE**: Does NOT directly call other services; pulls data on-demand
- **Provides**: `getSelfSufficiencyLeaderboard()`, `getKnowledgeExchanges()`, `executeTrade()`, `getTradeHistory()`
- **Consumed By**:
  - GlobalNetwork (page)
- **Data Contract**: 
  - Leaderboard: `{ energy: [{community, location, percentage}], food: [], water: [] }`
  - Trades: `{ fromCommunity, toCommunity, resource, quantity, date }`
- **Sustainability**: ✅ Standalone; should remain independent of other domain services

---

## Cross-Domain Services (Orchestration & Aggregation)

Services that coordinate multiple domain services.

### 14. **AutopilotService** (`src/services/AutopilotService.js`)
- **Role**: Automated decision-making across domains
- **Requires**:
  - ✅ WaterRecyclingService
  - ✅ FoodService
  - ✅ PestManagementService
  - ✅ EnergyService
  - ✅ HousingService
  - ✅ LoggerService
- **Provides**: `execute()`, `setMode()`, `getDecisions()`, `recordExecution()`
- **Consumed By**:
  - SystemDashboard (page)
  - AutopilotMode (page)
  - SetupWizard (page)
- **Data Contract**: Returns `{ execution: { decisions: Decision[], alerts: Alert[], timestamp } }`
- **Sustainability**: ✅ Aggregator pattern; pulls data from domain services on-demand

### 15. **PredictiveAnalyticsService** (`src/services/PredictiveAnalyticsService.js`)
- **Role**: Forecasting & trend analysis across domains
- **Requires**:
  - ✅ HarvestForecastService
  - ✅ GlobalGrowingScheduleService
  - ✅ PestManagementService
  - ✅ WaterService
  - ✅ EnergyService
  - ✅ LoggerService
- **Provides**: `predictHarvest()`, `analyzeTrends()`, `forecastWater()`, `forecastEnergy()`
- **Consumed By**:
  - Predictions (page)
- **Data Contract**: Returns `{ forecast: Prediction[], confidence: 0-1, timeframe: string }`
- **Sustainability**: ⚠️ Many dependencies; consider breaking into smaller predictors

### 16. **ImpactTrackingService** (`src/services/ImpactTrackingService.js`)
- **Role**: Aggregate impact metrics across all domains
- **Requires** (via `this.sofieCore.services.[name]`):
  - ✅ CommunityService
  - ✅ EnergyService
  - ✅ WaterService
  - ✅ WaterRecyclingService
  - ✅ FoodService
  - ✅ HarvestForecastService
  - ✅ GlobalNetworkService
  - ✅ AquaticLifeService
  - ✅ PestManagementService
  - ✅ CompostingService
  - ✅ LoggerService
- **Provides**: `trackMetric()`, `calculateImpact()`, `exportReport()`, `getImpactScore()`
- **Consumed By**:
  - ImpactTracking (page)
  - ImpactBenchmarks (page)
- **Data Contract**: Returns `{ carbonSaved: kg, waterRecycled: liters, energyGenerated: kWh, foodProduced: kg }`
- **Sustainability**: ✅ Read-only aggregator; doesn't modify other services

---

## Current Issues & Recommendations

### Issue 1: GlobalGrowingScheduleService Bottleneck
**Current State**: 4+ services depend on this service
- HarvestForecastService
- PestManagementService
- WaterRecyclingService
- NutritionOptimization (page)

**Risk**: If schedule updates fail, cascading failures across dependent services

**Recommendation**:
```javascript
// Option A: Event-based notifications (loosely coupled)
// When schedule updates, emit event
sofieCore.emit('schedule:updated', { month, crops })
// Subscribers listen for updates
sofieCore.on('schedule:updated', (data) => { /* update state */ })

// Option B: Caching layer
// Services cache schedule data locally; refresh on demand
getSchedule(force = false) {
  if (this.cachedSchedule && !force) return this.cachedSchedule;
  this.cachedSchedule = sofieCore.getService("globalGrowingSchedule").get();
  return this.cachedSchedule;
}
```

### Issue 2: Direct Service Access in init() Methods
**Current State**: Some services access `sofieCore.services[name]` directly
- ImpactTrackingService uses `this.sofieCore.services.energy`
- GovernanceService uses `this.sofieCore.services[action.service]`

**Risk**: Services coupled to internal implementation details; refactoring breaks all dependents

**Recommendation**: Standardize to `sofieCore.getService(name)` method call
```javascript
// ❌ Avoid: Direct property access
const energy = this.sofieCore.services.energy;

// ✅ Prefer: Method access (allows mocking, validation)
const energy = this.sofieCore.getService("energy");
```

### Issue 3: Missing Error Handling in Inter-Service Calls
**Current State**: Services assume other services exist and succeed
```javascript
// Risky: No fallback if service fails
const result = sofieCore.getService("harvest").getForecast();
```

**Recommendation**: Defensive null checks + fallbacks
```javascript
const harvestService = sofieCore.getService("harvestForecast");
const forecast = harvestService?.getForecast?.() || { monthlyForecast: [] };
```

### Issue 4: Undefined Data Propagation (Root Cause of GlobalNetwork Error)
**Current State**: Services return undefined instead of empty structures
```javascript
// If community isn't initialized:
community.selfSufficiency // undefined → error when accessing .energy
```

**Recommendation**: All service getters should return proper default shapes
```javascript
// ✅ Always return expected shape
getSelfSufficiencyLeaderboard() {
  return {
    energy: [],      // Never undefined
    food: [],        // Empty array if no data
    water: []        // Consistent structure
  };
}
```

---

## Initialization Order (Dependency Tree)

Services must initialize in dependency order:

```
1. LoggerService         (no deps)
2. StorageService        (no deps)
3. AuthService           (uses storage)
4. GlobalGrowingScheduleService (uses storage + logger)
5. FoodService           (uses schedule + storage + logger)
6. WaterService          (uses storage + logger)
7. WaterRecyclingService (uses schedule + storage + logger)
8. EnergyService         (uses storage + logger)
9. HousingService        (uses storage + logger)
10. PestManagementService (uses schedule + storage + logger)
11. HarvestForecastService (uses schedule + storage + logger)
12. AquaticLifeService   (uses storage + logger)
13. GlobalNetworkService (uses storage + logger)
14. CommunityService     (uses storage + logger)
15. CompostingService    (uses storage + logger)
16. GovernanceService    (uses storage + logger)
17. AutopilotService     (uses 5+ domain services)
18. PredictiveAnalyticsService (uses 6+ domain services)
19. ImpactTrackingService (uses 11+ domain services)
20. PluginRegistry       (final; may use all services)
```

**Implemented In**: `src/core/SofieCore.js` - `init()` method

---

## Data Validation & Return Shapes

Every service method should:

1. **Validate inputs** before processing
2. **Return consistent shapes** regardless of data state
3. **Never return `undefined`** for collection fields (use `[]` instead)
4. **Include defensive null checks** before accessing nested properties

### Example: Proper Service Method
```javascript
getSelfSufficiencyLeaderboard() {
  // Input validation (already validated in constructor)
  const comms = this.communities || [];
  
  // Guard against empty state
  if (comms.length === 0) {
    return { energy: [], food: [], water: [] }; // ✅ Correct shape
  }
  
  // Compute and return
  return {
    energy: comms
      .filter(c => c.energySelfSufficiency !== undefined)  // ✅ Defensive filter
      .sort((a, b) => b.energySelfSufficiency - a.energySelfSufficiency)
      .slice(0, 5)
      .map(c => ({
        community: c.name || "Unknown",      // ✅ Fallback for missing name
        location: c.location || "TBD",       // ✅ Fallback for missing location
        percentage: c.energySelfSufficiency || 0  // ✅ Fallback for zero/undefined
      })),
    food: [...],  // Same pattern
    water: [...]  // Same pattern
  };
}
```

---

## Event-Driven Architecture (Recommended Future State)

Instead of direct service-to-service calls, use publish/subscribe:

```javascript
// Service publishes event when data changes
class GlobalGrowingScheduleService {
  updateSchedule(newSchedule) {
    this.schedule = newSchedule;
    sofieCore.emit('schedule:updated', { month, crops: newSchedule });
  }
}

// Other services subscribe to events
class PestManagementService {
  constructor() {
    sofieCore.on('schedule:updated', (data) => {
      this.updateSeasonalThreats(data.crops);
    });
  }
}
```

**Benefits**:
- ✅ Loose coupling - services don't know about each other
- ✅ Easy to add/remove subscribers
- ✅ No circular dependencies
- ✅ Testable - mock events instead of services

---

## Testing & Verification

### Per-Service Tests
Each service should have unit tests verifying:
1. Can be instantiated standalone
2. Returns expected shapes even with no data
3. Handles missing dependencies gracefully

### Integration Tests
Verify initialization order and inter-service data flow:
```javascript
// ✅ Should succeed without errors
const core = new SofieCore();
core.init();
const autopilot = core.getService("autopilot");
const decisions = autopilot.execute(); // Should not crash
```

### Data Contract Tests
Verify all return shapes match documentation:
```javascript
const leaderboard = service.getSelfSufficiencyLeaderboard();
assert(Array.isArray(leaderboard.energy), "energy should be array");
assert(Array.isArray(leaderboard.food), "food should be array");
assert(Array.isArray(leaderboard.water), "water should be array");
```

---

## Checklist for "True Tree Structure"

- [ ] All services documented in this file
- [ ] Dependency arrows flow downward only (no cycles)
- [ ] Each service returns proper default shapes
- [ ] All `.map()` and `.filter()` have safe fallbacks (`|| []`)
- [ ] All nested property access uses safe chaining (`?.`)
- [ ] Initialization order respected in SofieCore.init()
- [ ] Error handling added for all inter-service calls
- [ ] Unit tests pass for all services in isolation
- [ ] Integration test confirms full initialization without errors
- [ ] GlobalNetwork page loads all tabs without console errors

---

**Last Updated**: 2025-12-10
**Status**: Foundation complete; Event-driven refactoring pending
