// backend/routes/admin.js - Admin & System Management Routes
// Matches frontend useAdminData hook + api.js admin methods

const express = require('express');
const router = express.Router();

// GET /api/admin/dashboard - Admin dashboard overview
router.get('/dashboard', (req, res) => {
  res.json({
    systemStatus: 'operational',
    uptime: process.uptime(),
    services: {
      water: 'healthy',
      energy: 'healthy',
      food: 'healthy',
      climate: 'healthy',
      community: 'healthy',
    },
    metrics: {
      totalUsers: 245,
      activeRegions: 12,
      apiCalls24h: 18450,
      errorRate: 0.02,
    },
    recentActivity: [
      { type: 'user_registered', userId: 'user-123', timestamp: new Date(Date.now() - 600000).toISOString() },
      { type: 'trade_completed', tradeId: 'trade-456', timestamp: new Date(Date.now() - 1200000).toISOString() },
    ],
    timestamp: new Date().toISOString(),
  });
});

// GET /api/admin/logs - System logs
router.get('/logs', (req, res) => {
  const { limit = 100, level = 'all' } = req.query;
  
  const logs = Array.from({ length: parseInt(limit) }, (_, i) => ({
    id: `log-${i}`,
    level: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
    message: `System event ${i}`,
    service: ['water', 'energy', 'food'][i % 3],
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }));
  
  res.json({
    logs: level === 'all' ? logs : logs.filter(log => log.level === level),
    totalCount: logs.length,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/admin/services - Service status
router.get('/services', (req, res) => {
  res.json({
    services: [
      { name: 'water', status: 'running', uptime: 99.8, lastCheck: new Date().toISOString() },
      { name: 'energy', status: 'running', uptime: 99.9, lastCheck: new Date().toISOString() },
      { name: 'food', status: 'running', uptime: 99.7, lastCheck: new Date().toISOString() },
      { name: 'climate', status: 'running', uptime: 99.6, lastCheck: new Date().toISOString() },
      { name: 'community', status: 'running', uptime: 99.5, lastCheck: new Date().toISOString() },
    ],
    timestamp: new Date().toISOString(),
  });
});

// GET /api/admin/users - User management
router.get('/users', (req, res) => {
  const { limit = 50 } = req.query;
  
  res.json({
    users: Array.from({ length: parseInt(limit) }, (_, i) => ({
      id: `user-${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      role: i < 5 ? 'admin' : 'member',
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    })),
    totalCount: 245,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/admin/users/:userId/role - Update user role
router.post('/users/:userId/role', (req, res) => {
  const { role } = req.body;
  
  if (!['admin', 'member', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  res.json({
    userId: req.params.userId,
    role,
    message: 'User role updated successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/admin/analytics - System analytics
router.get('/analytics', (req, res) => {
  const { period = '7d' } = req.query;
  
  res.json({
    period,
    apiUsage: {
      total: 128450,
      byEndpoint: {
        '/api/water': 32100,
        '/api/energy': 28900,
        '/api/food': 35200,
        '/api/climate': 22150,
        '/api/community': 10100,
      },
    },
    performance: {
      avgResponseTime: 45, // ms
      p95ResponseTime: 120,
      p99ResponseTime: 250,
    },
    errors: {
      total: 256,
      rate: 0.002,
      topErrors: [
        { code: 404, count: 120 },
        { code: 500, count: 86 },
        { code: 429, count: 50 },
      ],
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
