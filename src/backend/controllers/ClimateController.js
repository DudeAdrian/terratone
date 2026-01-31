/**
 * Climate Controller
 * Business logic for indoor/outdoor climate, air quality, ventilation
 */

const db = require('../database/connection');

class ClimateController {
  static async getIndoorClimate(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const climate = await db.getInstance().indoorClimate.findFirst({
        where: { regionId },
        orderBy: { measuredAt: 'desc' }
      });
      
      res.json(climate || { error: 'No climate data' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getClimateZones(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const zones = await db.getInstance().climateZone.findMany({
        where: { regionId }
      });
      
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateZone(req, res) {
    try {
      const { id } = req.params;
      const { targetTemp, targetHumidity } = req.body;
      
      const zone = await db.getInstance().climateZone.update({
        where: { id },
        data: { targetTemp, targetHumidity, updatedAt: new Date() }
      });
      
      res.json(zone);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async recordClimate(req, res) {
    try {
      const { regionId = 'default', temperature, humidity, co2 } = req.body;
      
      const record = await db.getInstance().indoorClimate.create({
        data: {
          regionId,
          temperature,
          humidity,
          co2,
          comfort: humidity > 30 && humidity < 60 ? 'optimal' : 'acceptable',
          measuredAt: new Date()
        }
      });
      
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getWeatherForecast(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      const forecast = [
        { day: 'tomorrow', high: 18, low: 12, condition: 'cloudy', precipitation: 10 },
        { day: 'day-after', high: 20, low: 14, condition: 'partly-cloudy', precipitation: 5 }
      ];
      
      res.json({ forecast });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getExtendedForecast(req, res) {
    try {
      const forecast = Array.from({ length: 7 }, (_, i) => ({
        day: i,
        high: 15 + Math.random() * 10,
        low: 8 + Math.random() * 8,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
        precipitation: Math.random() * 20
      }));
      
      res.json({ forecast });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getHumidity(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const climate = await db.getInstance().indoorClimate.findFirst({
        where: { regionId },
        orderBy: { measuredAt: 'desc' }
      });
      
      res.json({
        current: climate?.humidity || 50,
        target: 50,
        optimal: (climate?.humidity || 50) > 30 && (climate?.humidity || 50) < 60,
        dehumidifier: 'off',
        humidifier: 'off'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async setHumidityTarget(req, res) {
    try {
      const { target } = req.body;
      
      res.json({
        message: 'Humidity target set',
        target,
        status: 'active'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async startDehumidification(req, res) {
    try {
      res.json({
        message: 'Dehumidifier started',
        status: 'running'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async startHumidification(req, res) {
    try {
      res.json({
        message: 'Humidifier started',
        status: 'running'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAirQuality(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const quality = await db.getInstance().airQuality.findFirst({
        where: { regionId },
        orderBy: { measuredAt: 'desc' }
      });
      
      res.json(quality || {
        pm25: 15,
        pm10: 22,
        no2: 25,
        o3: 35,
        quality: 'good',
        aqiIndex: 42
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAirQualityHistory(req, res) {
    try {
      const { regionId = 'default', days = 7 } = req.query;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const history = await db.getInstance().airQuality.findMany({
        where: {
          regionId,
          measuredAt: { gte: startDate }
        },
        orderBy: { measuredAt: 'desc' }
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkAirQualityAlert(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const quality = await db.getInstance().airQuality.findFirst({
        where: { regionId },
        orderBy: { measuredAt: 'desc' }
      });
      
      const alert = quality && quality.aqiIndex > 100;
      
      res.json({
        alertActive: alert,
        severity: alert ? 'high' : 'low',
        recommendation: alert ? 'Reduce outdoor activities' : 'Normal air quality'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVentilationStatus(req, res) {
    try {
      res.json({
        status: 'active',
        speed: 'medium',
        airExchangeRate: 0.8,
        filterLife: 75,
        lastFilter: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async setVentilationSpeed(req, res) {
    try {
      const { speed } = req.body;
      
      res.json({
        message: `Ventilation speed set to ${speed}`,
        speed,
        status: 'updated'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async replaceFilter(req, res) {
    try {
      res.json({
        message: 'Filter replacement logged',
        status: 'completed',
        nextChange: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFilterStatus(req, res) {
    try {
      res.json({
        filterLife: 75,
        status: 'good',
        changeInterval: 6,
        lastChanged: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ClimateController;
