/**
 * Water Controller
 * Business logic for water management operations
 */

const db = require('../database/connection');

class WaterController {
  static async getRecyclingSystem(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const system = await db.getInstance().waterRecyclingSystem.findFirst({
        where: { regionId }
      });
      
      if (!system) {
        return res.status(404).json({ error: 'Recycling system not found' });
      }
      
      res.json(system);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRecyclingSystem(req, res) {
    try {
      const { id } = req.params;
      const { capacity, efficiency, status } = req.body;
      
      const updated = await db.getInstance().waterRecyclingSystem.update({
        where: { id },
        data: { capacity, efficiency, status, updatedAt: new Date() }
      });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logMaintenance(req, res) {
    try {
      const { regionId = 'default', notes } = req.body;
      
      const updated = await db.getInstance().waterRecyclingSystem.update({
        where: { regionId },
        data: { lastMaintenance: new Date() }
      });
      
      res.json({
        message: 'Maintenance logged',
        system: updated
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getWaterQuality(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const quality = await db.getInstance().waterQuality.findFirst({
        where: { regionId },
        orderBy: { testedAt: 'desc' }
      });
      
      res.json(quality || { error: 'No quality data' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async recordQualityTest(req, res) {
    try {
      const { regionId = 'default', ph, turbidity, bacteria, calcium, magnesium, sodium } = req.body;
      
      const test = await db.getInstance().waterQuality.create({
        data: {
          regionId,
          ph,
          turbidity,
          bacteria,
          calcium,
          magnesium,
          sodium,
          testedAt: new Date()
        }
      });
      
      res.status(201).json(test);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getQualityHistory(req, res) {
    try {
      const { regionId = 'default', days = 30 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const history = await db.getInstance().waterQuality.findMany({
        where: {
          regionId,
          testedAt: { gte: startDate }
        },
        orderBy: { testedAt: 'desc' }
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getWaterUsage(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const usage = await db.getInstance().waterUsage.findFirst({
        where: { regionId },
        orderBy: { recordedAt: 'desc' }
      });
      
      res.json(usage || { error: 'No usage data' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUsageStatistics(req, res) {
    try {
      const { regionId = 'default', period = 'monthly' } = req.query;
      
      const usage = await db.getInstance().waterUsage.findFirst({
        where: { regionId },
        orderBy: { recordedAt: 'desc' }
      });
      
      res.json({
        period,
        usage,
        trend: usage?.trend || 'stable'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async recordUsage(req, res) {
    try {
      const { regionId = 'default', daily, weekly, monthly, yearly, trend } = req.body;
      
      const record = await db.getInstance().waterUsage.create({
        data: {
          regionId,
          daily,
          weekly,
          monthly,
          yearly,
          trend,
          recordedAt: new Date()
        }
      });
      
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLeaks(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const leaks = await db.getInstance().waterLeak.findMany({
        where: { regionId, detected: true }
      });
      
      res.json(leaks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async detectLeak(req, res) {
    try {
      const { regionId = 'default', location, flowRate, size } = req.body;
      
      const leak = await db.getInstance().waterLeak.create({
        data: {
          regionId,
          location,
          size,
          flowRate,
          detected: true,
          severity: flowRate > 5 ? 'high' : flowRate > 2 ? 'medium' : 'low',
          detectedAt: new Date(),
          repaired: false
        }
      });
      
      res.status(201).json(leak);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async repairLeak(req, res) {
    try {
      const { id } = req.params;
      
      const repaired = await db.getInstance().waterLeak.update({
        where: { id },
        data: {
          repaired: true,
          repairedAt: new Date()
        }
      });
      
      res.json(repaired);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getIrrigationZones(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const zones = await db.getInstance().irrigationZone.findMany({
        where: { regionId }
      });
      
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createZone(req, res) {
    try {
      const { regionId = 'default', name, targetMoisture } = req.body;
      
      const zone = await db.getInstance().irrigationZone.create({
        data: {
          regionId,
          name,
          targetMoisture,
          moisture: targetMoisture,
          status: 'healthy',
          lastWatered: new Date(),
          nextScheduled: new Date(Date.now() + 86400000)
        }
      });
      
      res.status(201).json(zone);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateZone(req, res) {
    try {
      const { id } = req.params;
      const { targetMoisture, status } = req.body;
      
      const updated = await db.getInstance().irrigationZone.update({
        where: { id },
        data: { targetMoisture, status, updatedAt: new Date() }
      });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async scheduleWatering(req, res) {
    try {
      const { regionId = 'default', zoneId, time } = req.body;
      
      const zone = await db.getInstance().irrigationZone.update({
        where: { id: zoneId },
        data: { nextScheduled: new Date(time) }
      });
      
      res.json({
        message: 'Watering scheduled',
        zone
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = WaterController;
