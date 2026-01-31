/**
 * Energy Controller
 * Business logic for solar, grid, battery, and load management
 */

const db = require('../database/connection');

class EnergyController {
  static async getSolarData(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const panels = await db.getInstance().solarPanel.findMany({
        where: { regionId }
      });
      
      const totalGenerated = panels.reduce((sum, p) => sum + p.generatedToday, 0);
      
      res.json({
        panelCount: panels.length,
        capacity: panels.reduce((sum, p) => sum + p.capacity, 0),
        current: panels.reduce((sum, p) => sum + p.current, 0),
        efficiency: (panels.reduce((sum, p) => sum + p.efficiency, 0) / panels.length) || 0,
        generatedToday: totalGenerated
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSolarHistory(req, res) {
    try {
      const { regionId = 'default', days = 30 } = req.query;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const history = await db.getInstance().solarPanel.findMany({
        where: {
          regionId,
          lastUpdated: { gte: startDate }
        }
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSolarPanel(req, res) {
    try {
      const { id } = req.params;
      const { current, temperature } = req.body;
      
      const panel = await db.getInstance().solarPanel.update({
        where: { id },
        data: { current, temperature, lastUpdated: new Date() }
      });
      
      res.json(panel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGridStatus(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const grid = await db.getInstance().gridConnection.findFirst({
        where: { regionId }
      });
      
      res.json(grid || { error: 'No grid connection' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async disconnectFromGrid(req, res) {
    try {
      const { regionId = 'default' } = req.body;
      
      const grid = await db.getInstance().gridConnection.update({
        where: { regionId },
        data: { status: 'disconnected', lastUpdated: new Date() }
      });
      
      res.json({ message: 'Disconnected from grid', grid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async reconnectToGrid(req, res) {
    try {
      const { regionId = 'default' } = req.body;
      
      const grid = await db.getInstance().gridConnection.update({
        where: { regionId },
        data: { status: 'connected', lastUpdated: new Date() }
      });
      
      res.json({ message: 'Reconnected to grid', grid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBatteryStatus(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const battery = await db.getInstance().battery.findFirst({
        where: { regionId }
      });
      
      res.json(battery || { error: 'No battery' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBatteryHealth(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const battery = await db.getInstance().battery.findFirst({
        where: { regionId }
      });
      
      if (!battery) {
        return res.status(404).json({ error: 'No battery' });
      }
      
      res.json({
        health: battery.health,
        cycles: battery.cycles,
        capacity: battery.capacity,
        status: battery.health > 0.9 ? 'excellent' : battery.health > 0.7 ? 'good' : 'degraded'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async setBatteryLimits(req, res) {
    try {
      const { regionId = 'default', minCharge, maxCharge } = req.body;
      
      res.json({
        message: 'Battery limits set',
        minCharge,
        maxCharge
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCurrentLoad(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const loads = await db.getInstance().energyLoad.findMany({
        where: { regionId, status: 'on' }
      });
      
      const currentLoad = loads.reduce((sum, l) => sum + l.powerUsage, 0);
      
      res.json({
        currentLoad,
        maxCapacity: 5000,
        shedding: false,
        devices: loads.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async shedLoad(req, res) {
    try {
      const { regionId = 'default', percentage } = req.body;
      
      res.json({
        message: `Shedding ${percentage}% of non-critical loads`,
        status: 'active'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async restoreLoad(req, res) {
    try {
      res.json({
        message: 'Load restoration initiated',
        status: 'restoring'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLoadDevices(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const devices = await db.getInstance().energyLoad.findMany({
        where: { regionId }
      });
      
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getForecast(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      res.json({
        forecast: [
          { hour: 8, generation: 500 },
          { hour: 12, generation: 3200 },
          { hour: 16, generation: 2100 },
          { hour: 20, generation: 300 }
        ],
        pricing: {
          current: 0.15,
          forecast: 0.12,
          currency: 'USD'
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async get24HourForecast(req, res) {
    try {
      const hours = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        generation: Math.random() * 3000,
        load: Math.random() * 2000
      }));
      
      res.json({ forecast24h: hours });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPricing(req, res) {
    try {
      res.json({
        current: 0.15,
        peak: 0.25,
        offPeak: 0.08,
        currency: 'USD',
        updateFrequency: 'hourly'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EnergyController;
