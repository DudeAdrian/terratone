// backend/routes/system.js - System Settings & Configuration Routes

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Alert = require('../models/Alert');
const IoTDevice = require('../models/IoTDevice');
const { dbFind, dbFindOne, dbUpdate } = require('../utils/dbHelper');

// GET /api/system/settings/:userId - Get user settings
router.get('/settings/:userId', async (req, res) => {
  try {
  const { userId } = req.params;
  const user = await dbFindOne(User, { _id: userId }, null);
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/system/settings/:userId - Update user settings
router.put('/settings/:userId', async (req, res) => {
  const settings = req.body;
  
  try {
  await dbUpdate(User, { _id: req.params.userId }, { settings }, {});
  res.json({
    userId: req.params.userId,
    settings,
    message: 'Settings updated successfully',
    timestamp: new Date().toISOString(),
  });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// GET /api/system/alerts - Get system alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await dbFind(Alert, {}, []);
    res.json({
      alerts: alerts || [
        { id: 'alert-1', type: 'warning', message: 'Water level low in Zone 2', severity: 'medium', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { id: 'alert-2', type: 'info', message: 'Scheduled maintenance completed', severity: 'low', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'alert-3', type: 'error', message: 'Sensor offline: Temperature probe 3', severity: 'high', timestamp: new Date(Date.now() - 900000).toISOString() },
      ],
      unreadCount: 3,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// POST /api/system/alerts/:alertId/acknowledge - Acknowledge alert
router.post('/alerts/:alertId/acknowledge', async (req, res) => {
  try {
    await dbUpdate(Alert, { _id: req.params.alertId }, { isRead: true, acknowledgedBy: req.body.userId || 'system' }, {});
    res.json({
      alertId: req.params.alertId,
      acknowledged: true,
      acknowledgedBy: req.body.userId || 'system',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

// GET /api/system/iot/devices - Get IoT devices
router.get('/iot/devices', async (req, res) => {
  try {
    const devices = await dbFind(IoTDevice, {}, []);
    res.json({
      devices: devices || [
        { id: 'sensor-1', type: 'temperature', location: 'Greenhouse A', status: 'online', lastUpdate: new Date().toISOString() },
        { id: 'sensor-2', type: 'humidity', location: 'Greenhouse A', status: 'online', lastUpdate: new Date().toISOString() },
        { id: 'sensor-3', type: 'pH', location: 'Fish Tank', status: 'online', lastUpdate: new Date().toISOString() },
        { id: 'sensor-4', type: 'water_level', location: 'Main Tank', status: 'offline', lastUpdate: new Date(Date.now() - 3600000).toISOString() },
      ],
      totalDevices: (devices?.length ?? 24),
      onlineDevices: 23,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// GET /api/system/iot/devices/:deviceId - Get device details
router.get('/iot/devices/:deviceId', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device details' });
  }
});

module.exports = router;
