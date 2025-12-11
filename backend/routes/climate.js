// backend/routes/climate.js - Climate Domain API Routes
// Matches frontend useClimateData hook + api.js climate methods

const express = require('express');
const router = express.Router();

const mockClimateData = {
  regionId: 'default',
  indoor: {
    temperature: 22.5,
    humidity: 65,
    co2: 420,
    airQuality: 95,
  },
  outdoor: {
    temperature: 18.3,
    humidity: 72,
    windSpeed: 12,
    precipitation: 0,
  },
  zones: [
    { id: 'zone-1', name: 'Main Greenhouse', temp: 23.5, humidity: 68, status: 'optimal' },
    { id: 'zone-2', name: 'Seedling Area', temp: 25.0, humidity: 75, status: 'optimal' },
    { id: 'zone-3', name: 'Fish Tank Room', temp: 20.5, humidity: 55, status: 'good' },
  ],
};

// GET /api/climate/:regionId - Get climate data
router.get('/:regionId', (req, res) => {
  res.json({
    ...mockClimateData,
    regionId: req.params.regionId,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/climate/:regionId/indoor - Get indoor climate
router.get('/:regionId/indoor', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    ...mockClimateData.indoor,
    zones: mockClimateData.zones,
    hvacStatus: 'active',
    targetTemp: 22.0,
    targetHumidity: 65,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/climate/:regionId/outdoor - Get outdoor conditions
router.get('/:regionId/outdoor', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    ...mockClimateData.outdoor,
    forecast: [
      { time: '12:00', temp: 19, humidity: 70, precipitation: 0 },
      { time: '15:00', temp: 21, humidity: 65, precipitation: 0 },
      { time: '18:00', temp: 18, humidity: 75, precipitation: 10 },
    ],
    timestamp: new Date().toISOString(),
  });
});

// GET /api/climate/:regionId/zones/:zoneId - Get specific zone data
router.get('/:regionId/zones/:zoneId', (req, res) => {
  const zone = mockClimateData.zones[0]; // Mock: return first zone
  
  res.json({
    regionId: req.params.regionId,
    zoneId: req.params.zoneId,
    ...zone,
    history24h: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      temp: zone.temp + (Math.random() - 0.5) * 2,
      humidity: zone.humidity + (Math.random() - 0.5) * 10,
    })),
    timestamp: new Date().toISOString(),
  });
});

// PUT /api/climate/:regionId/zones/:zoneId - Update zone settings
router.put('/:regionId/zones/:zoneId', (req, res) => {
  const { targetTemp, targetHumidity, mode } = req.body;
  
  res.json({
    regionId: req.params.regionId,
    zoneId: req.params.zoneId,
    settings: { targetTemp, targetHumidity, mode },
    message: 'Zone settings updated successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/climate/:regionId/airquality - Get air quality data
router.get('/:regionId/airquality', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    score: 95,
    aqi: 42,
    pollutants: {
      pm25: 8.5,
      pm10: 15.2,
      co2: 420,
      voc: 125,
    },
    rating: 'Excellent',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/climate/:regionId/predictions - Get climate predictions
router.get('/:regionId/predictions', (req, res) => {
  const { days = 7 } = req.query;
  
  const predictions = Array.from({ length: parseInt(days) }, (_, i) => ({
    date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
    tempMin: 15 + Math.floor(Math.random() * 5),
    tempMax: 22 + Math.floor(Math.random() * 5),
    humidity: 60 + Math.floor(Math.random() * 20),
    precipitation: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
    confidence: 0.92 - (i * 0.02),
  }));
  
  res.json({
    regionId: req.params.regionId,
    predictions,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/climate/:regionId/weather - Get current weather
router.get('/:regionId/weather', (req, res) => {
  res.json({
    regionId: req.params.regionId,
    current: mockClimateData.outdoor,
    conditions: 'Partly Cloudy',
    uvIndex: 6,
    visibility: 10,
    sunrise: '06:45',
    sunset: '18:30',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
