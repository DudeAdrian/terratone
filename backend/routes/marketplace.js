// backend/routes/marketplace.js - Marketplace & Trade Routes

const express = require('express');
const router = express.Router();

// GET /api/marketplace/listings - Get marketplace listings
router.get('/listings', (req, res) => {
  const { category, status } = req.query;
  
  let listings = [
    { id: 'listing-1', seller: 'Community A', item: 'Tomatoes', quantity: 50, price: 3.5, category: 'produce', status: 'active' },
    { id: 'listing-2', seller: 'Community B', item: 'Basil Seeds', quantity: 200, price: 0.25, category: 'seeds', status: 'active' },
    { id: 'listing-3', seller: 'Community C', item: 'Solar Panel', quantity: 1, price: 450, category: 'equipment', status: 'sold' },
    { id: 'listing-4', seller: 'Community A', item: 'Lettuce', quantity: 30, price: 2.0, category: 'produce', status: 'active' },
  ];
  
  if (category) {
    listings = listings.filter(l => l.category === category);
  }
  
  if (status) {
    listings = listings.filter(l => l.status === status);
  }
  
  res.json({
    listings,
    totalCount: listings.length,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/marketplace/listings - Create new listing
router.post('/listings', (req, res) => {
  const { seller, item, quantity, price, category } = req.body;
  
  if (!seller || !item || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields: seller, item, quantity, price' });
  }
  
  res.status(201).json({
    id: `listing-${Date.now()}`,
    seller,
    item,
    quantity,
    price,
    category: category || 'other',
    status: 'active',
    createdAt: new Date().toISOString(),
  });
});

// GET /api/marketplace/trades - Get trade history
router.get('/trades', (req, res) => {
  res.json({
    trades: [
      { id: 'trade-1', buyer: 'Community B', seller: 'Community A', item: 'Tomatoes', quantity: 50, price: 175, completedAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'trade-2', buyer: 'Community A', seller: 'Community C', item: 'Seeds', quantity: 200, price: 50, completedAt: new Date(Date.now() - 172800000).toISOString() },
    ],
    totalVolume: 8540,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/marketplace/trades - Execute trade
router.post('/trades', (req, res) => {
  const { buyer, seller, listingId, quantity } = req.body;
  
  if (!buyer || !seller || !listingId) {
    return res.status(400).json({ error: 'Missing required fields: buyer, seller, listingId' });
  }
  
  res.status(201).json({
    id: `trade-${Date.now()}`,
    buyer,
    seller,
    listingId,
    quantity,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
});

module.exports = router;
