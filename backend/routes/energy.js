// backend/routes/energy.js - Energy Domain API Routes
// Matches frontend useEnergyData hook + api.js energy methods

const express = require('express');
const router = express.Router();
const EnergyMetric = require('../models/EnergyMetric');
const { dbFindOne, dbSave, dbFind, dbUpdate, useMockData } = require('../utils/dbHelper');


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
    { type: 'solar', production: 2850, percentage: 58 },
    { type: 'wind', production: 850, percentage: 17 },
    { type: 'hydro', production: 500, percentage: 10 },
    { type: 'geothermal', production: 700, percentage: 15, temperatureC: 120, status: 'active' },
  ],
  forecast24h: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    production: Math.floor(Math.random() * 500) + 2000,
    consumption: Math.floor(Math.random() * 300) + 1400,
    geothermal: 700 + Math.floor(Math.random() * 50),
  })),
};

// --- API EXTENSIONS FOR FRONTEND COMPATIBILITY ---
// GET /api/energy/grid?regionId=default
router.get('/grid', async (req, res) => {
  const regionId = req.query.regionId || 'default';
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    res.json({
      regionId,
      gridBalance: data.gridBalance || mockEnergyData.gridBalance,
      status: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grid data' });
  }
});

// GET /api/energy/solar?regionId=default
router.get('/solar', async (req, res) => {
  const regionId = req.query.regionId || 'default';
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    res.json({
      regionId,
      solarProduction: data.solarProduction || mockEnergyData.solarProduction,
      sources: (data.sources || mockEnergyData.sources).filter(s => s.type === 'solar'),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch solar data' });
  }
});

// GET /api/energy/battery?regionId=default
router.get('/battery', async (req, res) => {
  const regionId = req.query.regionId || 'default';
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    res.json({
      regionId,
      batteryLevel: data.batteryLevel || mockEnergyData.batteryLevel,
      batteryCapacity: data.batteryCapacity || mockEnergyData.batteryCapacity,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch battery data' });
  }
});

// GET /api/energy/load?regionId=default
router.get('/load', async (req, res) => {
  const regionId = req.query.regionId || 'default';
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    res.json({
      regionId,
      currentLoad: data.currentLoad || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch load data' });
  }
});

// GET /api/energy/forecast?regionId=default
router.get('/forecast', async (req, res) => {
  const regionId = req.query.regionId || 'default';
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    res.json({
      regionId,
      forecast: data.forecast24h || mockEnergyData.forecast24h,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// GET /api/energy/:regionId - Get energy data
router.get('/:regionId', async (req, res) => {
  const { regionId } = req.params;
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    res.json(data || { ...mockEnergyData, regionId, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch energy data' });
  }
});

// GET /api/energy/:regionId/production - Get production metrics
router.get('/:regionId/production', async (req, res) => {
  const { regionId } = req.params;
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    const energyData = data || { ...mockEnergyData, regionId };
    res.json({
      regionId,
      current: energyData.production?.total || mockEnergyData.solarProduction,
      daily: 48500,
      weekly: 325000,
      sources: energyData.production?.sources || mockEnergyData.sources,
      peakTime: '14:30',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch production data' });
  }
});

// GET /api/energy/:regionId/storage - Get battery/storage info
router.get('/:regionId/storage', async (req, res) => {
  const { regionId } = req.params;
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    const energyData = data || { ...mockEnergyData, regionId };
    const storage = energyData.storage || {};
    res.json({
      regionId,
      batteryLevel: storage.currentLevel || mockEnergyData.batteryLevel,
      capacity: storage.capacity || mockEnergyData.batteryCapacity,
      chargeRate: storage.chargeRate || 250,
      dischargeRate: storage.dischargeRate || 180,
      cycleCount: 324,
      health: storage.health || 95,
      estimatedTimeToFull: 2.5,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch storage data' });
  }
});

// GET /api/energy/:regionId/consumption - Get consumption data
router.get('/:regionId/consumption', async (req, res) => {
  const { regionId } = req.params;
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    const energyData = data || { ...mockEnergyData, regionId };
    const consumption = energyData.consumption || {};
    res.json({
      regionId,
      current: consumption.total || mockEnergyData.consumption,
      daily: 38200,
      weekly: 265000,
      breakdown: [
        { category: 'Climate Control', usage: consumption.climate || 620, percentage: 38 },
        { category: 'Water Pumps', usage: consumption.water || 410, percentage: 25 },
        { category: 'Lighting', usage: consumption.lighting || 380, percentage: 23 },
        { category: 'IoT Devices', usage: consumption.iot || 240, percentage: 14 },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch consumption data' });
  }
});

// POST /api/energy/:regionId/optimize - Trigger energy optimization
router.post('/:regionId/optimize', async (req, res) => {
  const { regionId } = req.params;
  const { mode } = req.body;
  
  try {
    const update = {
      lastOptimized: new Date(),
      optimizationMode: mode || 'balanced',
    };
    
    await dbUpdate(
      EnergyMetric,
      { regionId },
      update,
      mockEnergyData
    );
    
    res.json({
      regionId,
      mode: mode || 'balanced',
      optimizations: [
        'Shifted high-load tasks to off-peak hours',
        'Increased battery charge rate during solar peak',
        'Reduced HVAC load by 12%',
      ],
      estimatedSavings: {
        energy: 450,
        cost: 67.50,
        carbon: 320,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize energy' });
  }
});

// GET /api/energy/:regionId/forecast - Get energy forecast
router.get('/:regionId/forecast', async (req, res) => {
  const { regionId } = req.params;
  const { hours = 24 } = req.query;
  
  try {
    const data = await dbFindOne(
      EnergyMetric,
      { regionId },
      mockEnergyData
    );
    const energyData = data || mockEnergyData;
    res.json({
      regionId,
      forecast: energyData.forecast24h?.slice(0, parseInt(hours)) || mockEnergyData.forecast24h.slice(0, parseInt(hours)),
      confidence: 0.87,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// PUT /api/energy/:regionId/settings - Update energy settings
router.put('/:regionId/settings', async (req, res) => {
  const { regionId } = req.params;
  const settings = req.body;
  
  try {
    await dbUpdate(
      EnergyMetric,
      { regionId },
      { settings },
      mockEnergyData
    );
    
    res.json({
      regionId,
      settings,
      message: 'Energy settings updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update energy settings' });
  }
});

module.exports = router;
