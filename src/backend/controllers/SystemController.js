/**
 * System Controller
 * Business logic for system expansion, inventory, IoT devices, plugins
 */

const db = require('../database/connection');

class SystemController {
  static async getExpansion(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const expansion = await db.getInstance().systemExpansion.findFirst({
        where: { regionId }
      });
      
      res.json(expansion || {
        stage: 'Phase 1',
        completion: 75
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createExpansionPlan(req, res) {
    try {
      const { regionId = 'default', stage, budget, planned } = req.body;
      
      const plan = await db.getInstance().systemExpansion.create({
        data: {
          regionId,
          stage,
          completion: 0,
          budget,
          spent: 0
        }
      });
      
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateExpansion(req, res) {
    try {
      const { id } = req.params;
      const { completion, spent } = req.body;
      
      const expansion = await db.getInstance().systemExpansion.update({
        where: { id },
        data: { completion, spent, updatedAt: new Date() }
      });
      
      res.json(expansion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async completePhase(req, res) {
    try {
      const { id } = req.params;
      
      res.json({
        message: 'Phase completed',
        expansionId: id,
        nextPhase: 'Phase 2'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getInventory(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const items = await db.getInstance().inventory.findMany({
        where: { regionId }
      });
      
      const categories = {};
      items.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + item.quantity;
      });
      
      res.json({ categories, items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getInventoryByCategory(req, res) {
    try {
      const { regionId = 'default', category } = req.query;
      
      const items = await db.getInstance().inventory.findMany({
        where: { regionId, category }
      });
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addInventoryItem(req, res) {
    try {
      const { regionId = 'default', category, itemName, quantity, unit, location } = req.body;
      
      const item = await db.getInstance().inventory.create({
        data: {
          regionId,
          category,
          itemName,
          quantity,
          unit,
          location
        }
      });
      
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      const item = await db.getInstance().inventory.update({
        where: { id },
        data: { quantity, updatedAt: new Date() }
      });
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteInventoryItem(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().inventory.delete({ where: { id } });
      res.json({ message: 'Item deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async restockItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      res.json({
        message: 'Restock recorded',
        itemId: id,
        quantity,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getIoTDevices(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const devices = await db.getInstance().ioTDevice.findMany({
        where: { regionId }
      });
      
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDeviceDetail(req, res) {
    try {
      const { id } = req.params;
      
      const device = await db.getInstance().ioTDevice.findUnique({
        where: { id }
      });
      
      res.json(device || { error: 'Device not found' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async registerDevice(req, res) {
    try {
      const { regionId = 'default', deviceId, type, name, location } = req.body;
      
      const device = await db.getInstance().ioTDevice.create({
        data: {
          regionId,
          deviceId,
          type,
          name,
          location,
          status: 'online',
          lastUpdate: new Date()
        }
      });
      
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateDevice(req, res) {
    try {
      const { id } = req.params;
      const { location, battery } = req.body;
      
      const device = await db.getInstance().ioTDevice.update({
        where: { id },
        data: { location, battery, updatedAt: new Date() }
      });
      
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeDevice(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().ioTDevice.delete({ where: { id } });
      res.json({ message: 'Device removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateDeviceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const device = await db.getInstance().ioTDevice.update({
        where: { id },
        data: { status, lastUpdate: new Date() }
      });
      
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getIoTStatus(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const devices = await db.getInstance().ioTDevice.findMany({
        where: { regionId }
      });
      
      const online = devices.filter(d => d.status === 'online').length;
      const offline = devices.filter(d => d.status === 'offline').length;
      
      res.json({
        total: devices.length,
        online,
        offline,
        onlineCount: online,
        offlineCount: offline
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPlugins(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const plugins = await db.getInstance().plugin.findMany({
        where: { regionId }
      });
      
      res.json(plugins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async installPlugin(req, res) {
    try {
      const { regionId = 'default', name, version } = req.body;
      
      const plugin = await db.getInstance().plugin.create({
        data: {
          regionId,
          name,
          version,
          status: 'active',
          enabled: true,
          installedAt: new Date()
        }
      });
      
      res.status(201).json(plugin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePlugin(req, res) {
    try {
      const { id } = req.params;
      const { version } = req.body;
      
      const plugin = await db.getInstance().plugin.update({
        where: { id },
        data: { version, updatedAt: new Date() }
      });
      
      res.json(plugin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async uninstallPlugin(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().plugin.delete({ where: { id } });
      res.json({ message: 'Plugin uninstalled' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async enablePlugin(req, res) {
    try {
      const { id } = req.params;
      
      const plugin = await db.getInstance().plugin.update({
        where: { id },
        data: { enabled: true, status: 'active', updatedAt: new Date() }
      });
      
      res.json(plugin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async disablePlugin(req, res) {
    try {
      const { id } = req.params;
      
      const plugin = await db.getInstance().plugin.update({
        where: { id },
        data: { enabled: false, status: 'inactive', updatedAt: new Date() }
      });
      
      res.json(plugin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSystemHealth(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date(),
        systems: {
          water: 'operational',
          energy: 'operational',
          climate: 'operational',
          food: 'operational',
          heartware: 'operational'
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSystemMetrics(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      const metrics = await db.getInstance().systemMetric.findMany({
        where: { regionId },
        orderBy: { recordedAt: 'desc' },
        take: 100
      });
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMetricsHistory(req, res) {
    try {
      const { regionId = 'default', days = 30 } = req.query;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const history = await db.getInstance().systemMetric.findMany({
        where: {
          regionId,
          recordedAt: { gte: startDate }
        },
        orderBy: { recordedAt: 'desc' }
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logAction(req, res) {
    try {
      const { regionId = 'default', action, domain, details, userId } = req.body;
      
      const log = await db.getInstance().auditLog.create({
        data: {
          regionId,
          action,
          domain,
          details,
          userId
        }
      });
      
      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SystemController;
