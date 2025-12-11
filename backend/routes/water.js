// backend/routes/water.js - Water Domain API Routes
// Matches frontend usages: useWaterData hook + api.js water methods

const express = require('express');
const router = express.Router();

// Mock data (replace with database queries in production)
const mockWaterData = {
  regionId: 'default',
  totalCapacity: 5000,
  currentLevel: 3750,
  qualityScore: 92,
  phLevel: 7.2,
  temperature: 22.5,
  dissolvedOxygen: 8.5,
  turbidity: 2.1,
  zones: [
    { id: 'zone-1', name: 'Main Tank', level: 85, quality: 95 },
    { id: 'zone-2', name: 'Grow Beds', level: 78, quality: 88 },
    { id: 'zone-3', name: 'Fish Tank', level: 92, quality: 90 },
  ],
  usage24h: 450,
  forecast7d: [420, 430, 445, 460, 455, 470, 485],
};

// GET /api/water/:regionId - Get water data for region
router.get('/:regionId', (req, res) => {
  const { regionId } = req.params;
  
  res.json({
    ...mockWaterData,
    regionId,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/water/:regionId/quality - Get water quality metrics
router.get('/:regionId/quality', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    qualityScore: 92,
    phLevel: 7.2,
    temperature: 22.5,
    dissolvedOxygen: 8.5,
    turbidity: 2.1,
    ammonia: 0.02,
    nitrite: 0.01,
    nitrate: 15.5,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/water/:regionId/consumption - Get water consumption data
router.get('/:regionId/consumption', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    daily: 450,
    weekly: 3150,
    monthly: 13500,
    trend: 'stable',
    forecast: [420, 430, 445, 460, 455, 470, 485],
    timestamp: new Date().toISOString(),
  });
});

// POST /api/water/:regionId/irrigation - Schedule irrigation
router.post('/:regionId/irrigation', (req, res) => {
  const { regionId } = req.params;
  const { zoneId, duration, scheduledTime } = req.body;
  
  if (!zoneId || !duration) {
    return res.status(400).json({ error: 'Missing required fields: zoneId, duration' });
  }
  
  res.status(201).json({
    id: `irr-${Date.now()}`,
    regionId,
    zoneId,
    duration,
    scheduledTime: scheduledTime || new Date().toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  });
});

// GET /api/water/:regionId/alerts - Get water alerts
router.get('/:regionId/alerts', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    alerts: [
      { 
        id: 'alert-1', 
        type: 'warning', 
        message: 'pH level approaching lower threshold', 
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString() 
      },
      { 
        id: 'alert-2', 
        type: 'info', 
        message: 'Scheduled maintenance in 48 hours', 
        severity: 'low',
        timestamp: new Date(Date.now() - 7200000).toISOString() 
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/water/:regionId/settings - Update water system settings
router.put('/:regionId/settings', (req, res) => {
  const { regionId } = req.params;
  const settings = req.body;
  
  res.json({
    regionId,
    settings,
    message: 'Settings updated successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/water/:regionId/history - Get historical data
router.get('/:regionId/history', (req, res) => {
  const { days = 7 } = req.query;
  
  // Generate mock historical data
  const history = Array.from({ length: parseInt(days) }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    level: Math.floor(Math.random() * 20) + 70,
    quality: Math.floor(Math.random() * 15) + 85,
    consumption: Math.floor(Math.random() * 100) + 400,
  })).reverse();
  
  res.json({
    regionId: req.params.regionId,
    history,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
