#!/usr/bin/env node
/**
 * S.O.F.I.E. Backend Server
 * Main entry point for the REST API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security & Logging Middleware
app.use(helmet()); // Secure HTTP headers
app.use(morgan('combined')); // HTTP request logger
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================
// API ROUTES
// ============================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Water Domain Routes
app.get('/api/water/recycling', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    capacity: 1000,
    current: 750,
    status: 'operational',
    lastMaintenance: '2025-12-01',
    efficiency: 0.95
  });
});

app.get('/api/water/quality', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    ph: 7.2,
    turbidity: 0.5,
    bacteria: 'safe',
    minerals: {
      calcium: 85,
      magnesium: 12,
      sodium: 15
    },
    lastTested: new Date().toISOString()
  });
});

app.get('/api/water/usage', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    daily: 450,
    weekly: 3150,
    monthly: 13500,
    yearly: 162000,
    trend: 'stable',
    lastUpdated: new Date().toISOString()
  });
});

app.get('/api/water/leaks', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    detected: false,
    leakCount: 0,
    totalLost: 0,
    sensors: [
      { location: 'main-line', status: 'ok' },
      { location: 'secondary-loop', status: 'ok' }
    ]
  });
});

app.get('/api/water/irrigation', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    schedule: 'automated',
    nextCycle: new Date(Date.now() + 86400000).toISOString(),
    zones: [
      { name: 'garden-a', moisture: 65, status: 'healthy' },
      { name: 'garden-b', moisture: 72, status: 'healthy' }
    ]
  });
});

// Energy Domain Routes
app.get('/api/energy/solar', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    capacity: 5000,
    current: 3200,
    efficiency: 0.92,
    generatedToday: 42,
    panelCount: 16,
    temperature: 28
  });
});

app.get('/api/energy/grid', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    importing: false,
    exporting: true,
    exportedToday: 8,
    voltage: 230,
    frequency: 50,
    status: 'connected'
  });
});

app.get('/api/energy/battery', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    capacity: 10000,
    current: 7500,
    health: 0.98,
    chargeRate: 2.5,
    dischargeRate: 1.8,
    cycles: 245
  });
});

app.get('/api/energy/load', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    currentLoad: 1200,
    maxCapacity: 5000,
    shedding: false,
    criticalDevices: ['pump', 'fridge', 'heating'],
    lastShedEvent: null
  });
});

app.get('/api/energy/forecast', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    forecast: [
      { hour: 8, generation: 500 },
      { hour: 12, generation: 3200 },
      { hour: 16, generation: 2100 },
      { hour: 20, generation: 300 }
    ],
    pricing: {
      current: 0.15,
      forecast: 0.12,
      currency: 'USD'
    }
  });
});

// Climate Domain Routes
app.get('/api/climate/indoor', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    temperature: 21.5,
    humidity: 45,
    co2: 420,
    comfort: 'optimal',
    zones: [
      { name: 'living-room', temp: 21, humidity: 45 },
      { name: 'bedroom', temp: 19, humidity: 50 }
    ]
  });
});

app.get('/api/climate/forecast', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    forecast: [
      { day: 'tomorrow', high: 18, low: 12, condition: 'cloudy', precipitation: 10 },
      { day: 'day-after', high: 20, low: 14, condition: 'partly-cloudy', precipitation: 5 }
    ],
    source: 'weather-api'
  });
});

app.get('/api/climate/humidity', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    current: 45,
    target: 50,
    optimal: true,
    dehumidifier: 'off',
    humidifier: 'off'
  });
});

app.get('/api/climate/air', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    pm25: 15,
    pm10: 22,
    no2: 25,
    o3: 35,
    quality: 'good',
    aqiIndex: 42
  });
});

app.get('/api/climate/ventilation', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    status: 'active',
    speed: 'medium',
    airExchangeRate: 0.8,
    filterLife: 75,
    lastFilter: '2025-06-01'
  });
});

// Food Domain Routes
app.get('/api/food/production', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    gardens: [
      {
        gardenId: 'Raised-Beds-1',
        location: 'South facing yard',
        areaSqm: 12,
        type: 'raised beds',
        crops: ['tomatoes', 'peppers', 'basil'],
        monthlyYield: 15.5,
        productivity: 94
      },
      {
        gardenId: 'Container-Garden',
        location: 'Patio',
        areaSqm: 8,
        type: 'containers',
        crops: ['lettuce', 'spinach'],
        monthlyYield: 12.3,
        productivity: 88
      }
    ],
    monthlyYield: 42.5,
    yearlyProjection: 510,
    biodiversity: 24
  });
});

app.get('/api/food/nutrition', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    metrics: [
      { category: 'Vegetables', daily: 380, target: 400 },
      { category: 'Fruits', daily: 165, target: 200 },
      { category: 'Proteins', daily: 62, target: 60 },
      { category: 'Carbohydrates', daily: 285, target: 325 }
    ],
    weeklyAverage: { vegetables: 2660, fruits: 1155 }
  });
});

app.get('/api/food/storage', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    locations: [
      {
        name: 'Root Cellar',
        capacity: 50,
        current: 35,
        temperature: 4,
        items: ['carrots', 'potatoes', 'onions']
      },
      {
        name: 'Freezer',
        capacity: 80,
        current: 62,
        temperature: -18,
        items: ['berries', 'herbs']
      }
    ],
    totalCapacity: 150,
    totalCurrent: 121
  });
});

app.get('/api/food/planning', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    nextPlanting: '2025-01-15',
    crops: [
      { name: 'spring-lettuce', plantDate: '2025-01-15', harvestDate: '2025-03-15' },
      { name: 'beans', plantDate: '2025-02-01', harvestDate: '2025-05-01' }
    ],
    supplies: {
      seeds: 'sufficient',
      fertilizer: 'low',
      tools: 'good'
    }
  });
});

app.get('/api/food/safety', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    records: [
      {
        recordId: 'test-001',
        date: new Date().toISOString(),
        result: 'passed',
        tested: 'soil-sample',
        bacteria: 'safe'
      }
    ],
    testingSchedule: 'monthly',
    lastTest: new Date().toISOString(),
    status: 'compliant'
  });
});

// Heartware Domain Routes
app.get('/api/heartware/community', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    name: 'Default Community',
    members: 1,
    connections: [],
    founded: '2025-01-01',
    status: 'active'
  });
});

app.get('/api/heartware/resources', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    shared: [
      { type: 'tools', available: 5, borrowable: true },
      { type: 'knowledge', available: 12, borrowable: true },
      { type: 'space', available: 3, borrowable: true }
    ]
  });
});

// System Domain Routes
app.get('/api/system/expansion', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    stage: 'Phase 1',
    completion: 75,
    nextPhase: '2025-06-01',
    planned: [
      { name: 'Battery expansion', budget: 5000 },
      { name: 'Garden area 2', budget: 2000 }
    ]
  });
});

app.get('/api/system/inventory', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    categories: {
      solar: 16,
      batteries: 1,
      sensors: 24,
      tools: 45,
      seeds: 120
    },
    lastUpdated: new Date().toISOString()
  });
});

app.get('/api/system/iot', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    devices: [
      { id: 'sensor-001', type: 'temperature', status: 'online', lastUpdate: new Date().toISOString() },
      { id: 'sensor-002', type: 'humidity', status: 'online', lastUpdate: new Date().toISOString() },
      { id: 'pump-001', type: 'water-pump', status: 'online', lastUpdate: new Date().toISOString() }
    ],
    onlineCount: 3,
    offlineCount: 0
  });
});

app.get('/api/system/plugins', (req, res) => {
  res.json({
    regionId: req.query.regionId || 'default',
    installed: [
      { name: 'Weather Integration', version: '1.0.0', status: 'active' },
      { name: 'Mobile App', version: '2.1.0', status: 'active' },
      { name: 'Community Network', version: '1.5.0', status: 'inactive' }
    ],
    available: 12
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║  S.O.F.I.E. Backend Server Running     ║
║  http://${HOST}:${PORT}
╚════════════════════════════════════════╝
  `);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
