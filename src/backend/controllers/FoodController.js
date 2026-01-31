/**
 * Food Controller
 * Business logic for food production, storage, and safety
 */

const db = require('../database/connection');

class FoodController {
  static async getProduction(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const gardens = await db.getInstance().garden.findMany({
        where: { regionId }
      });
      
      const totalYield = gardens.reduce((sum, g) => sum + g.monthlyYield, 0);
      
      res.json({
        gardens,
        monthlyYield: totalYield,
        yearlyProjection: totalYield * 12,
        biodiversity: gardens.flatMap(g => g.crops).length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGardens(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const gardens = await db.getInstance().garden.findMany({
        where: { regionId }
      });
      
      res.json(gardens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createGarden(req, res) {
    try {
      const { regionId = 'default', gardenId, location, areaSqm, type, crops } = req.body;
      
      const garden = await db.getInstance().garden.create({
        data: {
          regionId,
          gardenId,
          location,
          areaSqm,
          type,
          crops: crops || [],
          status: 'preparing',
          monthlyYield: 0,
          productivity: 0,
          waterUse: 0
        }
      });
      
      res.status(201).json(garden);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateGarden(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const garden = await db.getInstance().garden.update({
        where: { id },
        data: { ...updates, updatedAt: new Date() }
      });
      
      res.json(garden);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteGarden(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().garden.delete({ where: { id } });
      res.json({ message: 'Garden deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCrops(req, res) {
    try {
      const { regionId = 'default', gardenId } = req.query;
      
      const crops = await db.getInstance().crop.findMany({
        where: { regionId, ...(gardenId && { gardenId }) }
      });
      
      res.json(crops);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async plantCrop(req, res) {
    try {
      const { regionId = 'default', gardenId, name, type, plantDate, harvestDate } = req.body;
      
      const crop = await db.getInstance().crop.create({
        data: {
          regionId,
          gardenId,
          name,
          type,
          plantDate: new Date(plantDate),
          harvestDate: new Date(harvestDate)
        }
      });
      
      res.status(201).json(crop);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCrop(req, res) {
    try {
      const { id } = req.params;
      
      const crop = await db.getInstance().crop.update({
        where: { id },
        data: { ...req.body, updatedAt: new Date() }
      });
      
      res.json(crop);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async harvestCrop(req, res) {
    try {
      const { id } = req.params;
      const { yield: yieldAmount, quality } = req.body;
      
      const crop = await db.getInstance().crop.update({
        where: { id },
        data: {
          yield: yieldAmount,
          quality,
          harvestDate: new Date(),
          updatedAt: new Date()
        }
      });
      
      res.json(crop);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNutritionMetrics(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const metrics = await db.getInstance().nutritionMetric.findMany({
        where: { regionId },
        orderBy: { measuredAt: 'desc' },
        take: 7
      });
      
      res.json({ metrics });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getWeeklyNutrition(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const metrics = await db.getInstance().nutritionMetric.findMany({
        where: {
          regionId,
          measuredAt: { gte: weekAgo }
        }
      });
      
      res.json({ weeklyAverage: metrics });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async recordNutrition(req, res) {
    try {
      const { regionId = 'default', category, daily, target } = req.body;
      
      const metric = await db.getInstance().nutritionMetric.create({
        data: {
          regionId,
          category,
          daily,
          target,
          measuredAt: new Date()
        }
      });
      
      res.status(201).json(metric);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStorage(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const items = await db.getInstance().foodStorage.findMany({
        where: { regionId }
      });
      
      const locations = [...new Set(items.map(i => i.location))];
      const capacity = items.length * 50; // Placeholder
      const current = items.reduce((sum, i) => sum + i.quantity, 0);
      
      res.json({
        locations: locations.map(loc => ({
          name: loc,
          items: items.filter(i => i.location === loc)
        })),
        totalCapacity: capacity,
        totalCurrent: current
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStorageLocations(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const items = await db.getInstance().foodStorage.findMany({
        where: { regionId }
      });
      
      const locations = [...new Set(items.map(i => i.location))];
      
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addStorageItem(req, res) {
    try {
      const { regionId = 'default', location, itemName, quantity, unit, temperature, humidity } = req.body;
      
      const item = await db.getInstance().foodStorage.create({
        data: {
          regionId,
          location,
          itemName,
          quantity,
          unit,
          temperature,
          humidity
        }
      });
      
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStorageItem(req, res) {
    try {
      const { id } = req.params;
      
      const item = await db.getInstance().foodStorage.update({
        where: { id },
        data: { ...req.body, updatedAt: new Date() }
      });
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeStorageItem(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().foodStorage.delete({ where: { id } });
      res.json({ message: 'Item removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getInventory(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const items = await db.getInstance().foodStorage.findMany({
        where: { regionId }
      });
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPlanning(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const crops = await db.getInstance().crop.findMany({
        where: { regionId, harvestDate: { gte: new Date() } }
      });
      
      res.json({
        nextPlanting: crops[0]?.plantDate || new Date(),
        crops,
        supplies: {
          seeds: 'sufficient',
          fertilizer: 'low',
          tools: 'good'
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async planCropPlanting(req, res) {
    try {
      const { regionId = 'default', cropName, plantDate, harvestDate, gardenId } = req.body;
      
      const crop = await db.getInstance().crop.create({
        data: {
          regionId,
          gardenId,
          name: cropName,
          plantDate: new Date(plantDate),
          harvestDate: new Date(harvestDate)
        }
      });
      
      res.status(201).json(crop);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPlanningCalendar(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const crops = await db.getInstance().crop.findMany({
        where: { regionId }
      });
      
      res.json(crops.map(c => ({
        name: c.name,
        plantDate: c.plantDate,
        harvestDate: c.harvestDate
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSafetyRecords(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const records = await db.getInstance().foodSafetyTest.findMany({
        where: { regionId },
        orderBy: { testedAt: 'desc' }
      });
      
      res.json({ records });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async recordSafetyTest(req, res) {
    try {
      const { regionId = 'default', testedItem, bacteria, toxins, mold } = req.body;
      const result = (bacteria === 'safe' && toxins !== 'detected' && mold !== 'detected') ? 'passed' : 'warning';
      
      const test = await db.getInstance().foodSafetyTest.create({
        data: {
          regionId,
          testId: `test-${Date.now()}`,
          testedItem,
          bacteria,
          toxins,
          mold,
          result,
          testedAt: new Date()
        }
      });
      
      res.status(201).json(test);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getComplianceStatus(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const tests = await db.getInstance().foodSafetyTest.findMany({
        where: { regionId },
        orderBy: { testedAt: 'desc' },
        take: 10
      });
      
      const passed = tests.filter(t => t.result === 'passed').length;
      const compliance = (passed / tests.length) * 100;
      
      res.json({
        status: compliance > 80 ? 'compliant' : 'warning',
        complianceScore: compliance,
        recentTests: tests.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FoodController;
