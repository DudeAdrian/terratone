// backend/routes/system.js - System Settings & Configuration Routes

const express = require('express');
const router = express.Router();

// GET /api/system/settings/:userId - Get user settings
router.get('/settings/:userId', (req, res) => {
  res.json({
    userId: req.params.userId,
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
      alerts: true,
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      units: 'metric',
    },
    dashboard: {
      layout: 'grid',
      widgets: ['water', 'energy', 'food', 'climate'],
    },
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/system/settings/:userId - Update user settings
router.put('/settings/:userId', (req, res) => {
  const settings = req.body;
  
  res.json({
    userId: req.params.userId,
    settings,
    message: 'Settings updated successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/system/alerts - Get system alerts
router.get('/alerts', (req, res) => {
  res.json({
    alerts: [
      { id: 'alert-1', type: 'warning', message: 'Water level low in Zone 2', severity: 'medium', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'alert-2', type: 'info', message: 'Scheduled maintenance completed', severity: 'low', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'alert-3', type: 'error', message: 'Sensor offline: Temperature probe 3', severity: 'high', timestamp: new Date(Date.now() - 900000).toISOString() },
    ],
    unreadCount: 3,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/system/alerts/:alertId/acknowledge - Acknowledge alert
router.post('/alerts/:alertId/acknowledge', (req, res) => {
  res.json({
    alertId: req.params.alertId,
    acknowledged: true,
    acknowledgedBy: req.body.userId || 'system',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/system/iot/devices - Get IoT devices
router.get('/iot/devices', (req, res) => {
  res.json({
    devices: [
      { id: 'sensor-1', type: 'temperature', location: 'Greenhouse A', status: 'online', lastUpdate: new Date().toISOString() },
      { id: 'sensor-2', type: 'humidity', location: 'Greenhouse A', status: 'online', lastUpdate: new Date().toISOString() },
      { id: 'sensor-3', type: 'pH', location: 'Fish Tank', status: 'online', lastUpdate: new Date().toISOString() },
      { id: 'sensor-4', type: 'water_level', location: 'Main Tank', status: 'offline', lastUpdate: new Date(Date.now() - 3600000).toISOString() },
    ],
    totalDevices: 24,
    onlineDevices: 23,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/system/iot/devices/:deviceId - Get device details
router.get('/iot/devices/:deviceId', (req, res) => {
  res.json({
    deviceId: req.params.deviceId,
    type: 'temperature',
    location: 'Greenhouse A',
    status: 'online',
    readings: Array.from({ length: 24 }, (_, i) => ({
      value: 22 + (Math.random() - 0.5) * 4,
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    })),
    battery: 87,
    lastMaintenance: '2025-11-15',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
