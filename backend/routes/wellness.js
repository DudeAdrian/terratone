// backend/routes/wellness.js - Wellness & Impact Tracking Routes

const express = require('express');
const router = express.Router();
const ClimateMetric = require('../models/ClimateMetric');
const WaterMetric = require('../models/WaterMetric');
const EnergyMetric = require('../models/EnergyMetric');
const Crop = require('../models/Crop');
const { dbFind, dbFindOne } = require('../utils/dbHelper');

// GET /api/wellness/:regionId - Get wellness metrics
router.get('/:regionId', async (req, res) => {
  const { regionId } = req.params;
  try {
  const water = await dbFindOne(WaterMetric, { regionId }, null);
  const energy = await dbFindOne(EnergyMetric, { regionId }, null);
  const climate = await dbFindOne(ClimateMetric, { regionId }, null);
  const crops = await dbFind(Crop, { regionId }, []);
  res.json({
    regionId: req.params.regionId,
    overallScore: 85,
    metrics: {
      nutrition: crops?.length ? 88 : 85,
      waterQuality: water ? 92 : 90,
      airQuality: climate ? 95 : 92,
      sustainability: 82,
      communityHealth: 78,
    },
    carbonOffset: 1250,
    waterSaved: 18500,
    energyProduced: energy?.production?.total || 9200,
    foodProduced: crops?.length || 3450,
    timestamp: new Date().toISOString(),
  });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wellness metrics' });
  }
});

// GET /api/wellness/:regionId/impact - Get environmental impact
router.get('/:regionId/impact', async (req, res) => {
  const { regionId } = req.params;
  try {
  const energy = await dbFindOne(EnergyMetric, { regionId }, null);
  res.json({
    regionId: req.params.regionId,
    carbon: {
      offset: 1250,
      goal: 1500,
      progress: 83,
    },
    water: {
      saved: 18500,
      goal: 20000,
      progress: 92,
    },
    energy: {
      produced: energy?.production?.total || 9200,
      consumed: energy?.consumption?.total || 7800,
      netPositive: (energy?.production?.total || 9200) - (energy?.consumption?.total || 7800),
    },
    food: {
      produced: 3450,
      goal: 4000,
      progress: 86,
    },
    timestamp: new Date().toISOString(),
  });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch impact data' });
  }
});

// GET /api/wellness/:regionId/benchmarks - Get impact benchmarks
router.get('/:regionId/benchmarks', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    comparison: {
      regional: {
        rank: 3,
        totalRegions: 12,
        percentile: 92,
      },
      global: {
        rank: 45,
        totalRegions: 250,
        percentile: 82,
      },
    },
    categories: {
      sustainability: { score: 85, rank: 2 },
      efficiency: { score: 88, rank: 1 },
      communityEngagement: { score: 78, rank: 5 },
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
