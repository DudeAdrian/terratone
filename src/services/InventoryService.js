// src/services/InventoryService.js

class InventoryService {
  constructor() {
    this.status = "idle";
    this.inventory = {
      food: { quantity: 0, unit: "kg", categories: {} },
      water: { quantity: 0, unit: "liters", status: "good" },
      materials: { quantity: 0, unit: "items", categories: {} },
      tools: { quantity: 0, unit: "items", inUse: 0 },
      seeds: { quantity: 0, unit: "packets", varieties: {} },
    };
    this.history = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      console.log("[InventoryService] Inventory service initialized");
    } catch (error) {
      this.status = "error";
      console.error("[InventoryService] Initialization failed", error);
    }
  }

  updateInventoryItem(category, data) {
    try {
      if (this.inventory[category]) {
        this.inventory[category] = { ...this.inventory[category], ...data };
        this.history.push({
          timestamp: new Date().toISOString(),
          category,
          data: { ...this.inventory[category] },
        });
      }
    } catch (error) {
      console.error("[InventoryService] Update failed", error);
    }
  }

  getInventory() {
    return { ...this.inventory };
  }

  getCategory(category) {
    return this.inventory[category] || null;
  }

  addItem(category, item, quantity) {
    try {
      if (!this.inventory[category]) return;
      if (!this.inventory[category].categories) {
        this.inventory[category].categories = {};
      }
      if (!this.inventory[category].categories[item]) {
        this.inventory[category].categories[item] = 0;
      }
      this.inventory[category].categories[item] += quantity;
      this.inventory[category].quantity += quantity;
      this.history.push({
        timestamp: new Date().toISOString(),
        action: "add",
        category,
        item,
        quantity,
      });
    } catch (error) {
      console.error("[InventoryService] Add item failed", error);
    }
  }

  removeItem(category, item, quantity) {
    try {
      if (!this.inventory[category]?.categories[item]) return;
      this.inventory[category].categories[item] -= quantity;
      this.inventory[category].quantity -= quantity;
      this.history.push({
        timestamp: new Date().toISOString(),
        action: "remove",
        category,
        item,
        quantity,
      });
    } catch (error) {
      console.error("[InventoryService] Remove item failed", error);
    }
  }

  getHistory() {
    return this.history;
  }

  getLowStockAlerts() {
    const alerts = [];
    Object.keys(this.inventory).forEach((category) => {
      if (this.inventory[category].quantity < 20) {
        alerts.push({ category, quantity: this.inventory[category].quantity });
      }
    });
    return alerts;
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
