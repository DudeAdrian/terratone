/**
 * Water Domain Routes
 * Endpoints for water recycling, quality, usage, leaks, and irrigation
 */

const express = require('express');
const router = express.Router();
const WaterController = require('../controllers/WaterController');

// Water Recycling System
router.get('/recycling', WaterController.getRecyclingSystem);
router.patch('/recycling/:id', WaterController.updateRecyclingSystem);
router.post('/recycling/maintenance', WaterController.logMaintenance);

// Water Quality
router.get('/quality', WaterController.getWaterQuality);
router.post('/quality', WaterController.recordQualityTest);
router.get('/quality/history', WaterController.getQualityHistory);

// Water Usage
router.get('/usage', WaterController.getWaterUsage);
router.get('/usage/statistics', WaterController.getUsageStatistics);
router.post('/usage/record', WaterController.recordUsage);

// Leak Detection
router.get('/leaks', WaterController.getLeaks);
router.post('/leaks/detect', WaterController.detectLeak);
router.patch('/leaks/:id/repair', WaterController.repairLeak);

// Irrigation Management
router.get('/irrigation', WaterController.getIrrigationZones);
router.post('/irrigation/zones', WaterController.createZone);
router.patch('/irrigation/zones/:id', WaterController.updateZone);
router.post('/irrigation/schedule', WaterController.scheduleWatering);

module.exports = router;
