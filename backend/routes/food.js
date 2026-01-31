// backend/routes/food.js - Food Domain API Routes
// Matches frontend useFoodData hook + api.js food methods

const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { dbFindOne, dbFind, dbSave, dbUpdate, useMockData } = require('../utils/dbHelper');

const mockFoodData = {
  regionId: 'default',
  totalProduction: 1280,
  activeCrops: 12,
  harvestReady: 3,
  nutritionScore: 88,
  crops: [
    { id: 'crop-1', name: 'Tomatoes', stage: 'flowering', health: 95, daysToHarvest: 14 },
    { id: 'crop-2', name: 'Lettuce', stage: 'ready', health: 92, daysToHarvest: 0 },
    { id: 'crop-3', name: 'Basil', stage: 'vegetative', health: 89, daysToHarvest: 21 },
  ],
  nutrients: {
    nitrogen: 85,
    phosphorus: 78,
    potassium: 82,
    calcium: 90,
    magnesium: 75,
  },
};

// GET /api/food/:regionId - Get food production data
router.get('/:regionId', async (req, res) => {
  const { regionId } = req.params;
  try {
    const crops = await dbFind(
      Crop,
      { regionId },
      mockFoodData.crops
    );
    res.json({
      ...mockFoodData,
      regionId,
      activeCrops: crops?.length || mockFoodData.activeCrops,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch food data' });
  }
});

// GET /api/food/:regionId/crops - Get all crops
router.get('/:regionId/crops', async (req, res) => {
  const { regionId } = req.params;
  try {
    const crops = await dbFind(
      Crop,
      { regionId },
      mockFoodData.crops
    );
    res.json({
      regionId,
      crops: crops || mockFoodData.crops,
      totalCount: crops?.length || mockFoodData.activeCrops,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
});

// GET /api/food/:regionId/harvest - Get harvest forecast
router.get('/:regionId/harvest', async (req, res) => {
  const { regionId } = req.params;
  const { months = 3 } = req.query;
  
  try {
    const readyCrops = await dbFind(
      Crop,
      { regionId, stage: 'ready' },
      []
    );
    
    const forecast = Array.from({ length: parseInt(months) }, (_, i) => ({
      month: new Date(Date.now() + i * 30 * 86400000).toISOString().split('T')[0].slice(0, 7),
      estimatedYield: Math.floor(Math.random() * 500) + 1000,
      crops: ['Tomatoes', 'Lettuce', 'Peppers', 'Basil'],
      confidence: 0.85 - (i * 0.05),
    }));
    
    res.json({
      regionId,
      readyCount: readyCrops?.length || 0,
      forecast,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch harvest forecast' });
  }
});

// POST /api/food/:regionId/crops - Add new crop
router.post('/:regionId/crops', async (req, res) => {
  const { regionId } = req.params;
  const { name, type, quantity, zoneId } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({ error: 'Missing required fields: name, type' });
  }
  
  try {
    const newCrop = {
      regionId,
      name,
      type,
      quantity: quantity || 1,
      zone: zoneId,
      stage: 'seedling',
      health: 100,
      plantedAt: new Date(),
    };
    
    const saved = await dbSave(Crop, newCrop);
    res.status(201).json({
      ...saved.toObject(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create crop' });
  }
});

// GET /api/food/:regionId/nutrition - Get nutrition analysis
router.get('/:regionId/nutrition', async (req, res) => {
  const { regionId } = req.params;
  try {
    const crops = await dbFind(
      Crop,
      { regionId },
      []
    );
    
    res.json({
      regionId,
      score: mockFoodData.nutritionScore,
      nutrients: mockFoodData.nutrients,
      goals: {
        protein: 85,
        vitamins: 90,
        minerals: 82,
        fiber: 88,
      },
      recommendations: [
        'Increase leafy greens for iron',
        'Add legumes for protein diversity',
        'Consider citrus for vitamin C',
      ],
      activeCrops: crops?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition data' });
  }
});

// GET /api/food/:regionId/safety - Get food safety metrics
router.get('/:regionId/safety', async (req, res) => {
  const { regionId } = req.params;
  try {
    res.json({
      regionId,
      overallScore: 96,
      tests: [
        { type: 'Bacterial', status: 'pass', lastTest: new Date(Date.now() - 86400000).toISOString() },
        { type: 'Pesticide Residue', status: 'pass', lastTest: new Date(Date.now() - 172800000).toISOString() },
        { type: 'Heavy Metals', status: 'pass', lastTest: new Date(Date.now() - 604800000).toISOString() },
      ],
      certifications: ['Organic', 'Non-GMO', 'Aquaponic'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch safety metrics' });
  }
});

// GET /api/food/:regionId/pests - Get pest management data
router.get('/:regionId/pests', async (req, res) => {
  const { regionId } = req.params;
  try {
    res.json({
      regionId,
      alerts: [
        { id: 'pest-1', type: 'aphids', severity: 'low', zone: 'greenhouse-2', detectedAt: new Date(Date.now() - 3600000).toISOString() },
      ],
      treatments: [
        { pest: 'aphids', method: 'Neem oil spray', effectiveness: 92 },
        { pest: 'whiteflies', method: 'Yellow sticky traps', effectiveness: 88 },
      ],
      riskScore: 15,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pest data' });
  }
});

// PUT /api/food/:regionId/crops/:cropId - Update crop status
router.put('/:regionId/crops/:cropId', async (req, res) => {
  const { regionId, cropId } = req.params;
  const updates = req.body;
  
  try {
    await dbUpdate(
      Crop,
      { _id: cropId, regionId },
      updates,
      {}
    );
    
    res.json({
      cropId,
      regionId,
      updates,
      message: 'Crop updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update crop' });
  }
});

// DELETE /api/food/:regionId/crops/:cropId - Remove crop (harvest)
router.delete('/:regionId/crops/:cropId', async (req, res) => {
  const { regionId, cropId } = req.params;
  
  try {
    const crop = await Crop.findByIdAndDelete(cropId);
    
    res.json({
      cropId,
      regionId,
      message: 'Crop harvested successfully',
      yield: crop?.quantity || Math.floor(Math.random() * 50) + 20,
      harvestedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to harvest crop' });
  }
});

module.exports = router;
