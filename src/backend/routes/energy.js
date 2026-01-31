/**
 * Energy Domain Routes
 * Endpoints for solar, grid, battery, load, and forecasting
 */

const express = require('express');
const router = express.Router();
const EnergyController = require('../controllers/EnergyController');

// Solar Generation
router.get('/solar', EnergyController.getSolarData);
router.get('/solar/history', EnergyController.getSolarHistory);
router.patch('/solar/:id', EnergyController.updateSolarPanel);

// Grid Connection
router.get('/grid', EnergyController.getGridStatus);
router.post('/grid/disconnect', EnergyController.disconnectFromGrid);
router.post('/grid/reconnect', EnergyController.reconnectToGrid);

// Battery Management
router.get('/battery', EnergyController.getBatteryStatus);
router.get('/battery/health', EnergyController.getBatteryHealth);
router.patch('/battery/limits', EnergyController.setBatteryLimits);

// Load Management
router.get('/load', EnergyController.getCurrentLoad);
router.post('/load/shed', EnergyController.shedLoad);
router.post('/load/restore', EnergyController.restoreLoad);
router.get('/load/devices', EnergyController.getLoadDevices);

// Energy Forecasting
router.get('/forecast', EnergyController.getForecast);
router.get('/forecast/24h', EnergyController.get24HourForecast);
router.get('/forecast/pricing', EnergyController.getPricing);

module.exports = router;
