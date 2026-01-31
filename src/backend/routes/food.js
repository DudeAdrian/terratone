/**
 * Food Domain Routes
 * Endpoints for food production, nutrition, storage, planning, and safety
 */

const express = require('express');
const router = express.Router();
const FoodController = require('../controllers/FoodController');

// Food Production
router.get('/production', FoodController.getProduction);
router.get('/production/gardens', FoodController.getGardens);
router.post('/production/gardens', FoodController.createGarden);
router.patch('/production/gardens/:id', FoodController.updateGarden);
router.delete('/production/gardens/:id', FoodController.deleteGarden);

// Crops Management
router.get('/production/crops', FoodController.getCrops);
router.post('/production/crops', FoodController.plantCrop);
router.patch('/production/crops/:id', FoodController.updateCrop);
router.post('/production/crops/:id/harvest', FoodController.harvestCrop);

// Nutrition Tracking
router.get('/nutrition', FoodController.getNutritionMetrics);
router.get('/nutrition/weekly', FoodController.getWeeklyNutrition);
router.post('/nutrition/record', FoodController.recordNutrition);

// Food Storage
router.get('/storage', FoodController.getStorage);
router.get('/storage/locations', FoodController.getStorageLocations);
router.post('/storage/items', FoodController.addStorageItem);
router.patch('/storage/items/:id', FoodController.updateStorageItem);
router.delete('/storage/items/:id', FoodController.removeStorageItem);
router.get('/storage/inventory', FoodController.getInventory);

// Food Planning
router.get('/planning', FoodController.getPlanning);
router.post('/planning/crops', FoodController.planCropPlanting);
router.get('/planning/calendar', FoodController.getPlanningCalendar);

// Food Safety
router.get('/safety', FoodController.getSafetyRecords);
router.post('/safety/test', FoodController.recordSafetyTest);
router.get('/safety/compliance', FoodController.getComplianceStatus);

module.exports = router;
