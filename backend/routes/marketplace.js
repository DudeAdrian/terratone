// backend/routes/marketplace.js - Marketplace & Trade Routes

const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Trade = require('../models/Trade');
const { dbFind, dbSave } = require('../utils/dbHelper');

// GET /api/marketplace/listings - Get marketplace listings
router.get('/listings', async (req, res) => {
  const { category, status } = req.query;
  
  try {
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
  
    // DB-backed listings
    const dbListings = await dbFind(Listing, { category, status }, []);
    const finalListings = dbListings?.length ? dbListings : listings;
    res.json({
      listings: finalListings,
      totalCount: finalListings.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// POST /api/marketplace/listings - Create new listing
router.post('/listings', async (req, res) => {
  const { seller, item, quantity, price, category } = req.body;
  
  if (!seller || !item || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields: seller, item, quantity, price' });
  }
  
  try {
    const newListing = {
      sellerId: seller,
      item,
      quantity,
      price,
      category: category || 'other',
      status: 'active',
    };
    const saved = await dbSave(Listing, newListing);
    res.status(201).json({
      ...saved.toObject(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// GET /api/marketplace/trades - Get trade history
router.get('/trades', async (req, res) => {
  try {
    const trades = await dbFind(Trade, {}, []);
    res.json({
      trades: trades || [
        { id: 'trade-1', buyer: 'Community B', seller: 'Community A', item: 'Tomatoes', quantity: 50, price: 175, completedAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'trade-2', buyer: 'Community A', seller: 'Community C', item: 'Seeds', quantity: 200, price: 50, completedAt: new Date(Date.now() - 172800000).toISOString() },
      ],
      totalVolume: 8540,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// POST /api/marketplace/trades - Execute trade
router.post('/trades', async (req, res) => {
  const { buyer, seller, listingId, quantity } = req.body;
  
  if (!buyer || !seller || !listingId) {
    return res.status(400).json({ error: 'Missing required fields: buyer, seller, listingId' });
  }
  
  try {
    const newTrade = { buyerId: buyer, sellerId: seller, item: listingId, quantity, status: 'pending' };
    const saved = await dbSave(Trade, newTrade);
    res.status(201).json({
      ...saved.toObject(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute trade' });
  }
});

module.exports = router;
