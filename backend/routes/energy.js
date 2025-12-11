// backend/routes/energy.js - Energy Domain API Routes
// Matches frontend useEnergyData hook + api.js energy methods

const express = require('express');
const router = express.Router();

const mockEnergyData = {
  regionId: 'default',
  solarProduction: 2850,
  gridBalance: 1200,
  batteryLevel: 78,
  batteryCapacity: 5000,
  consumption: 1650,
  efficiency: 92,
  carbonOffset: 450,
  sources: [
    { type: 'solar', production: 2850, percentage: 68 },
    { type: 'wind', production: 850, percentage: 20 },
    { type: 'hydro', production: 500, percentage: 12 },
  ],
  forecast24h: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    production: Math.floor(Math.random() * 500) + 2000,
    consumption: Math.floor(Math.random() * 300) + 1400,
  })),
};

// GET /api/energy/:regionId - Get energy data
router.get('/:regionId', (req, res) => {
  res.json({
    ...mockEnergyData,
    regionId: req.params.regionId,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/energy/:regionId/production - Get production metrics
router.get('/:regionId/production', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    current: mockEnergyData.solarProduction,
    daily: 48500,
    weekly: 325000,
    sources: mockEnergyData.sources,
    peakTime: '14:30',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/energy/:regionId/storage - Get battery/storage info
router.get('/:regionId/storage', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    batteryLevel: mockEnergyData.batteryLevel,
    capacity: mockEnergyData.batteryCapacity,
    chargeRate: 250,
    dischargeRate: 180,
    cycleCount: 324,
    health: 95,
    estimatedTimeToFull: 2.5,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/energy/:regionId/consumption - Get consumption data
router.get('/:regionId/consumption', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    current: mockEnergyData.consumption,
    daily: 38200,
    weekly: 265000,
    breakdown: [
      { category: 'Climate Control', usage: 620, percentage: 38 },
      { category: 'Water Pumps', usage: 410, percentage: 25 },
      { category: 'Lighting', usage: 380, percentage: 23 },
      { category: 'IoT Devices', usage: 240, percentage: 14 },
    ],
    timestamp: new Date().toISOString(),
  });
});

// POST /api/energy/:regionId/optimize - Trigger energy optimization
router.post('/:regionId/optimize', (req, res) => {
  const { mode } = req.body; // e.g., 'peak-shaving', 'cost-reduction', 'sustainability'
  
  res.json({
    regionId: req.params.regionId,
    mode: mode || 'balanced',
    optimizations: [
      'Shifted high-load tasks to off-peak hours',
      'Increased battery charge rate during solar peak',
      'Reduced HVAC load by 12%',
    ],
    estimatedSavings: {
      energy: 450, // kWh/week
      cost: 67.50, // USD/week
      carbon: 320, // kg CO2/week
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/energy/:regionId/forecast - Get energy forecast
router.get('/:regionId/forecast', (req, res) => {
  const { hours = 24 } = req.query;
  
  res.json({
    regionId: req.params.regionId,
    forecast: mockEnergyData.forecast24h.slice(0, parseInt(hours)),
    confidence: 0.87,
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/energy/:regionId/settings - Update energy settings
router.put('/:regionId/settings', (req, res) => {
  const settings = req.body;
  
  res.json({
    regionId: req.params.regionId,
    settings,
    message: 'Energy settings updated successfully',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
