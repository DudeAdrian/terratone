/**
 * System Domain Routes
 * Endpoints for system expansion, inventory, IoT devices, and plugins
 */

const express = require('express');
const router = express.Router();
const SystemController = require('../controllers/SystemController');

// System Expansion
router.get('/expansion', SystemController.getExpansion);
router.post('/expansion', SystemController.createExpansionPlan);
router.patch('/expansion/:id', SystemController.updateExpansion);
router.post('/expansion/:id/complete', SystemController.completePhase);

// Inventory Management
router.get('/inventory', SystemController.getInventory);
router.get('/inventory/categories', SystemController.getInventoryByCategory);
router.post('/inventory/items', SystemController.addInventoryItem);
router.patch('/inventory/items/:id', SystemController.updateInventoryItem);
router.delete('/inventory/items/:id', SystemController.deleteInventoryItem);
router.post('/inventory/items/:id/restock', SystemController.restockItem);

// IoT Device Management
router.get('/iot/devices', SystemController.getIoTDevices);
router.get('/iot/devices/:id', SystemController.getDeviceDetail);
router.post('/iot/devices', SystemController.registerDevice);
router.patch('/iot/devices/:id', SystemController.updateDevice);
router.delete('/iot/devices/:id', SystemController.removeDevice);
router.post('/iot/devices/:id/status', SystemController.updateDeviceStatus);
router.get('/iot/status', SystemController.getIoTStatus);

// Plugin Management
router.get('/plugins', SystemController.getPlugins);
router.post('/plugins', SystemController.installPlugin);
router.patch('/plugins/:id', SystemController.updatePlugin);
router.delete('/plugins/:id', SystemController.uninstallPlugin);
router.post('/plugins/:id/enable', SystemController.enablePlugin);
router.post('/plugins/:id/disable', SystemController.disablePlugin);

// System Health & Metrics
router.get('/health', SystemController.getSystemHealth);
router.get('/metrics', SystemController.getSystemMetrics);
router.get('/metrics/history', SystemController.getMetricsHistory);
router.post('/audit/log', SystemController.logAction);

module.exports = router;
