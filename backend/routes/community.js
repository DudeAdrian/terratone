// backend/routes/community.js - Community Domain API Routes
// Matches frontend useCommunityData hook + api.js community methods

const express = require('express');
const router = express.Router();

const mockCommunityData = {
  regionId: 'default',
  members: 245,
  activeProjects: 12,
  tradeVolume: 8540,
  posts: [
    { id: 'post-1', author: 'Alice', content: 'Great harvest this week!', likes: 23, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'post-2', author: 'Bob', content: 'Tips for growing basil in aquaponics?', likes: 15, timestamp: new Date(Date.now() - 7200000).toISOString() },
  ],
  trades: [
    { id: 'trade-1', from: 'Community A', to: 'Community B', item: 'Tomatoes', quantity: 50, status: 'completed' },
    { id: 'trade-2', from: 'Community C', to: 'Community A', item: 'Seeds', quantity: 200, status: 'pending' },
  ],
};

// GET /api/community/:regionId - Get community overview
router.get('/:regionId', (req, res) => {
  res.json({
    ...mockCommunityData,
    regionId: req.params.regionId,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/community/:regionId/members - Get community members
router.get('/:regionId/members', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    totalMembers: mockCommunityData.members,
    members: Array.from({ length: 10 }, (_, i) => ({
      id: `member-${i + 1}`,
      name: `User ${i + 1}`,
      role: i < 2 ? 'admin' : 'member',
      joinedAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      contributionScore: Math.floor(Math.random() * 100),
    })),
    timestamp: new Date().toISOString(),
  });
});

// GET /api/community/:regionId/posts - Get community posts
router.get('/:regionId/posts', (req, res) => {
  const { limit = 20 } = req.query;
  
  res.json({
    regionId: req.params.regionId,
    posts: mockCommunityData.posts.slice(0, parseInt(limit)),
    totalCount: mockCommunityData.posts.length,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/community/:regionId/posts - Create new post
router.post('/:regionId/posts', (req, res) => {
  const { author, content, tags } = req.body;
  
  if (!author || !content) {
    return res.status(400).json({ error: 'Missing required fields: author, content' });
  }
  
  res.status(201).json({
    id: `post-${Date.now()}`,
    regionId: req.params.regionId,
    author,
    content,
    tags: tags || [],
    likes: 0,
    comments: 0,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/community/:regionId/trades - Get trade history
router.get('/:regionId/trades', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    trades: mockCommunityData.trades,
    totalVolume: mockCommunityData.tradeVolume,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/community/:regionId/trades - Create new trade
router.post('/:regionId/trades', (req, res) => {
  const { from, to, item, quantity, price } = req.body;
  
  if (!from || !to || !item) {
    return res.status(400).json({ error: 'Missing required fields: from, to, item' });
  }
  
  res.status(201).json({
    id: `trade-${Date.now()}`,
    regionId: req.params.regionId,
    from,
    to,
    item,
    quantity: quantity || 1,
    price: price || 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
});

// GET /api/community/:regionId/governance - Get governance data
router.get('/:regionId/governance', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    activeProposals: 3,
    proposals: [
      { id: 'prop-1', title: 'Expand greenhouse capacity', votes: { yes: 120, no: 25 }, status: 'active' },
      { id: 'prop-2', title: 'New trade agreement', votes: { yes: 95, no: 10 }, status: 'passed' },
    ],
    votingPower: 100,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/community/:regionId/governance/vote - Vote on proposal
router.post('/:regionId/governance/vote', (req, res) => {
  const { proposalId, vote, voterId } = req.body;
  
  if (!proposalId || !vote || !voterId) {
    return res.status(400).json({ error: 'Missing required fields: proposalId, vote, voterId' });
  }
  
  res.json({
    proposalId,
    vote,
    voterId,
    message: 'Vote recorded successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/community/:regionId/events - Get community events
router.get('/:regionId/events', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    events: [
      { id: 'event-1', title: 'Community Harvest Festival', date: '2025-12-20', attendees: 85 },
      { id: 'event-2', title: 'Aquaponics Workshop', date: '2025-12-18', attendees: 32 },
    ],
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
