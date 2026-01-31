/**
 * Climate Domain Routes
 * Endpoints for indoor climate, forecasts, humidity, air quality, ventilation
 */

const express = require('express');
const router = express.Router();
const ClimateController = require('../controllers/ClimateController');

// Indoor Climate
router.get('/indoor', ClimateController.getIndoorClimate);
router.get('/indoor/zones', ClimateController.getClimateZones);
router.patch('/indoor/zones/:id', ClimateController.updateZone);
router.post('/indoor/climate', ClimateController.recordClimate);

// Weather Forecasts
router.get('/forecast', ClimateController.getWeatherForecast);
router.get('/forecast/extended', ClimateController.getExtendedForecast);

// Humidity Control
router.get('/humidity', ClimateController.getHumidity);
router.patch('/humidity/target', ClimateController.setHumidityTarget);
router.post('/humidity/dehumidify', ClimateController.startDehumidification);
router.post('/humidity/humidify', ClimateController.startHumidification);

// Air Quality
router.get('/air', ClimateController.getAirQuality);
router.get('/air/history', ClimateController.getAirQualityHistory);
router.post('/air/alert', ClimateController.checkAirQualityAlert);

// Ventilation
router.get('/ventilation', ClimateController.getVentilationStatus);
router.post('/ventilation/speed', ClimateController.setVentilationSpeed);
router.post('/ventilation/filter', ClimateController.replaceFilter);
router.get('/ventilation/filter', ClimateController.getFilterStatus);

module.exports = router;
