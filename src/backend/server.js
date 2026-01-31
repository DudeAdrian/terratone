/**
 * S.O.F.I.E. Backend API Server
 * Complete REST API with all domain routes
 * 
 * Run: npm install && npm run dev
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// DOMAIN ROUTES
// ============================================

// Import route handlers
const waterRoutes = require('./routes/water');
const energyRoutes = require('./routes/energy');
const climateRoutes = require('./routes/climate');
const foodRoutes = require('./routes/food');
const heartwareRoutes = require('./routes/heartware');
const systemRoutes = require('./routes/system');

// Mount routes
app.use('/api/water', waterRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/heartware', heartwareRoutes);
app.use('/api/system', systemRoutes);

// ============================================
// API DOCUMENTATION ENDPOINT
// ============================================

app.get('/api/docs', (req, res) => {
  res.json({
    title: 'S.O.F.I.E. Backend API',
    version: '1.0.0',
    domains: {
      water: {
        endpoints: [
          'GET /api/water/recycling',
          'PATCH /api/water/recycling/:id',
          'POST /api/water/recycling/maintenance',
          'GET /api/water/quality',
          'POST /api/water/quality',
          'GET /api/water/quality/history',
          'GET /api/water/usage',
          'GET /api/water/usage/statistics',
          'POST /api/water/usage/record',
          'GET /api/water/leaks',
          'POST /api/water/leaks/detect',
          'PATCH /api/water/leaks/:id/repair',
          'GET /api/water/irrigation',
          'POST /api/water/irrigation/zones',
          'PATCH /api/water/irrigation/zones/:id',
          'POST /api/water/irrigation/schedule'
        ]
      },
      energy: {
        endpoints: [
          'GET /api/energy/solar',
          'GET /api/energy/solar/history',
          'PATCH /api/energy/solar/:id',
          'GET /api/energy/grid',
          'POST /api/energy/grid/disconnect',
          'POST /api/energy/grid/reconnect',
          'GET /api/energy/battery',
          'GET /api/energy/battery/health',
          'PATCH /api/energy/battery/limits',
          'GET /api/energy/load',
          'POST /api/energy/load/shed',
          'POST /api/energy/load/restore',
          'GET /api/energy/load/devices',
          'GET /api/energy/forecast',
          'GET /api/energy/forecast/24h',
          'GET /api/energy/forecast/pricing'
        ]
      },
      climate: {
        endpoints: [
          'GET /api/climate/indoor',
          'GET /api/climate/indoor/zones',
          'PATCH /api/climate/indoor/zones/:id',
          'POST /api/climate/indoor/climate',
          'GET /api/climate/forecast',
          'GET /api/climate/forecast/extended',
          'GET /api/climate/humidity',
          'PATCH /api/climate/humidity/target',
          'POST /api/climate/humidity/dehumidify',
          'POST /api/climate/humidity/humidify',
          'GET /api/climate/air',
          'GET /api/climate/air/history',
          'POST /api/climate/air/alert',
          'GET /api/climate/ventilation',
          'POST /api/climate/ventilation/speed',
          'POST /api/climate/ventilation/filter',
          'GET /api/climate/ventilation/filter'
        ]
      },
      food: {
        endpoints: [
          'GET /api/food/production',
          'GET /api/food/production/gardens',
          'POST /api/food/production/gardens',
          'PATCH /api/food/production/gardens/:id',
          'DELETE /api/food/production/gardens/:id',
          'GET /api/food/production/crops',
          'POST /api/food/production/crops',
          'PATCH /api/food/production/crops/:id',
          'POST /api/food/production/crops/:id/harvest',
          'GET /api/food/nutrition',
          'GET /api/food/nutrition/weekly',
          'POST /api/food/nutrition/record',
          'GET /api/food/storage',
          'GET /api/food/storage/locations',
          'POST /api/food/storage/items',
          'PATCH /api/food/storage/items/:id',
          'DELETE /api/food/storage/items/:id',
          'GET /api/food/storage/inventory',
          'GET /api/food/planning',
          'POST /api/food/planning/crops',
          'GET /api/food/planning/calendar',
          'GET /api/food/safety',
          'POST /api/food/safety/test',
          'GET /api/food/safety/compliance'
        ]
      },
      heartware: {
        endpoints: [
          'GET /api/heartware/community',
          'POST /api/heartware/community',
          'PATCH /api/heartware/community/:id',
          'GET /api/heartware/community/members',
          'POST /api/heartware/community/members',
          'PATCH /api/heartware/community/members/:id',
          'DELETE /api/heartware/community/members/:id',
          'GET /api/heartware/resources',
          'POST /api/heartware/resources',
          'PATCH /api/heartware/resources/:id',
          'DELETE /api/heartware/resources/:id',
          'POST /api/heartware/resources/:id/borrow',
          'POST /api/heartware/resources/:id/return',
          'GET /api/heartware/governance/proposals',
          'POST /api/heartware/governance/proposals',
          'POST /api/heartware/governance/vote',
          'GET /api/heartware/governance/votes/:proposalId',
          'GET /api/heartware/events',
          'POST /api/heartware/events',
          'PATCH /api/heartware/events/:id',
          'POST /api/heartware/events/:id/attend',
          'DELETE /api/heartware/events/:id',
          'GET /api/heartware/skills',
          'POST /api/heartware/skills',
          'POST /api/heartware/skills/:id/request'
        ]
      },
      system: {
        endpoints: [
          'GET /api/system/expansion',
          'POST /api/system/expansion',
          'PATCH /api/system/expansion/:id',
          'POST /api/system/expansion/:id/complete',
          'GET /api/system/inventory',
          'GET /api/system/inventory/categories',
          'POST /api/system/inventory/items',
          'PATCH /api/system/inventory/items/:id',
          'DELETE /api/system/inventory/items/:id',
          'POST /api/system/inventory/items/:id/restock',
          'GET /api/system/iot/devices',
          'GET /api/system/iot/devices/:id',
          'POST /api/system/iot/devices',
          'PATCH /api/system/iot/devices/:id',
          'DELETE /api/system/iot/devices/:id',
          'POST /api/system/iot/devices/:id/status',
          'GET /api/system/iot/status',
          'GET /api/system/plugins',
          'POST /api/system/plugins',
          'PATCH /api/system/plugins/:id',
          'DELETE /api/system/plugins/:id',
          'POST /api/system/plugins/:id/enable',
          'POST /api/system/plugins/:id/disable',
          'GET /api/system/health',
          'GET /api/system/metrics',
          'GET /api/system/metrics/history',
          'POST /api/system/audit/log'
        ]
      }
    }
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
    timestamp: new Date().toISOString(),
    availableEndpoints: '/api/docs'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
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
╔════════════════════════════════════════════╗
║  S.O.F.I.E. Backend API Server             ║
║  http://${HOST}:${PORT}
║  Documentation: http://${HOST}:${PORT}/api/docs
╚════════════════════════════════════════════╝
  `);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`
Available Domains:
  - /api/water       (Water management)
  - /api/energy      (Solar & battery)
  - /api/climate     (Climate control)
  - /api/food        (Food production)
  - /api/heartware   (Community)
  - /api/system      (Expansion & IoT)
  `);
});

module.exports = app;
