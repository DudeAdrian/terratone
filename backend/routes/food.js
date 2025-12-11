// backend/routes/food.js - Food Domain API Routes
// Matches frontend useFoodData hook + api.js food methods

const express = require('express');
const router = express.Router();

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
router.get('/:regionId', (req, res) => {
  res.json({
    ...mockFoodData,
    regionId: req.params.regionId,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/food/:regionId/crops - Get all crops
router.get('/:regionId/crops', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    crops: mockFoodData.crops,
    totalCount: mockFoodData.activeCrops,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/food/:regionId/harvest - Get harvest forecast
router.get('/:regionId/harvest', (req, res) => {
  const { months = 3 } = req.query;
  
  const forecast = Array.from({ length: parseInt(months) }, (_, i) => ({
    month: new Date(Date.now() + i * 30 * 86400000).toISOString().split('T')[0].slice(0, 7),
    estimatedYield: Math.floor(Math.random() * 500) + 1000,
    crops: ['Tomatoes', 'Lettuce', 'Peppers', 'Basil'],
    confidence: 0.85 - (i * 0.05),
  }));
  
  res.json({
    regionId: req.params.regionId,
    forecast,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/food/:regionId/crops - Add new crop
router.post('/:regionId/crops', (req, res) => {
  const { name, type, quantity, zoneId } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({ error: 'Missing required fields: name, type' });
  }
  
  res.status(201).json({
    id: `crop-${Date.now()}`,
    regionId: req.params.regionId,
    name,
    type,
    quantity: quantity || 1,
    zoneId,
    stage: 'seedling',
    health: 100,
    plantedAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
  });
});

// GET /api/food/:regionId/nutrition - Get nutrition analysis
router.get('/:regionId/nutrition', (req, res) => {
  res.json({
    regionId: req.params.regionId,
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
    timestamp: new Date().toISOString(),
  });
});

// GET /api/food/:regionId/safety - Get food safety metrics
router.get('/:regionId/safety', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    overallScore: 96,
    tests: [
      { type: 'Bacterial', status: 'pass', lastTest: new Date(Date.now() - 86400000).toISOString() },
      { type: 'Pesticide Residue', status: 'pass', lastTest: new Date(Date.now() - 172800000).toISOString() },
      { type: 'Heavy Metals', status: 'pass', lastTest: new Date(Date.now() - 604800000).toISOString() },
    ],
    certifications: ['Organic', 'Non-GMO', 'Aquaponic'],
    timestamp: new Date().toISOString(),
  });
});

// GET /api/food/:regionId/pests - Get pest management data
router.get('/:regionId/pests', (req, res) => {
  res.json({
    regionId: req.params.regionId,
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
});

// PUT /api/food/:regionId/crops/:cropId - Update crop status
router.put('/:regionId/crops/:cropId', (req, res) => {
  const { cropId } = req.params;
  const updates = req.body;
  
  res.json({
    cropId,
    regionId: req.params.regionId,
    updates,
    message: 'Crop updated successfully',
    timestamp: new Date().toISOString(),
  });
});

// DELETE /api/food/:regionId/crops/:cropId - Remove crop (harvest)
router.delete('/:regionId/crops/:cropId', (req, res) => {
  const { cropId } = req.params;
  
  res.json({
    cropId,
    regionId: req.params.regionId,
    message: 'Crop harvested successfully',
    yield: Math.floor(Math.random() * 50) + 20,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
