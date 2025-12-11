// backend/routes/herbal.js - Herbal Library & Seed Bank Routes

const express = require('express');
const router = express.Router();

// GET /api/herbal/library - Get herbal library
router.get('/library', (req, res) => {
  const { category, search } = req.query;
  
  let herbs = [
    { id: 'herb-1', name: 'Basil', category: 'culinary', medicinal: true, growthTime: 60, difficulty: 'easy' },
    { id: 'herb-2', name: 'Mint', category: 'medicinal', medicinal: true, growthTime: 45, difficulty: 'easy' },
    { id: 'herb-3', name: 'Lavender', category: 'medicinal', medicinal: true, growthTime: 90, difficulty: 'medium' },
    { id: 'herb-4', name: 'Rosemary', category: 'culinary', medicinal: true, growthTime: 75, difficulty: 'medium' },
    { id: 'herb-5', name: 'Thyme', category: 'culinary', medicinal: true, growthTime: 70, difficulty: 'easy' },
  ];
  
  if (category) {
    herbs = herbs.filter(h => h.category === category);
  }
  
  if (search) {
    herbs = herbs.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));
  }
  
  res.json({
    herbs,
    totalCount: herbs.length,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/herbal/library/:herbId - Get herb details
router.get('/library/:herbId', (req, res) => {
  res.json({
    id: req.params.herbId,
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    category: 'culinary',
    medicinal: true,
    properties: ['Antibacterial', 'Anti-inflammatory', 'Antioxidant'],
    growthTime: 60,
    difficulty: 'easy',
    optimalConditions: {
      temperature: '20-30°C',
      humidity: '60-70%',
      light: 'Full sun',
      pH: '6.0-7.5',
    },
    uses: ['Culinary seasoning', 'Essential oils', 'Traditional medicine'],
    timestamp: new Date().toISOString(),
  });
});

// GET /api/herbal/seedbank - Get seed bank inventory
router.get('/seedbank', (req, res) => {
  res.json({
    seeds: [
      { id: 'seed-1', name: 'Basil Seeds', variety: 'Sweet Basil', quantity: 500, viability: 95, storedDate: '2025-06-01' },
      { id: 'seed-2', name: 'Tomato Seeds', variety: 'Cherry', quantity: 350, viability: 92, storedDate: '2025-07-15' },
      { id: 'seed-3', name: 'Lettuce Seeds', variety: 'Butterhead', quantity: 800, viability: 88, storedDate: '2025-08-01' },
    ],
    totalVarieties: 24,
    totalSeeds: 12450,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/herbal/seedbank - Add seeds to bank
router.post('/seedbank', (req, res) => {
  const { name, variety, quantity, viability } = req.body;
  
  if (!name || !variety || !quantity) {
    return res.status(400).json({ error: 'Missing required fields: name, variety, quantity' });
  }
  
  res.status(201).json({
    id: `seed-${Date.now()}`,
    name,
    variety,
    quantity,
    viability: viability || 100,
    storedDate: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
