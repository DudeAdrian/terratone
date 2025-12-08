// src/services/WaterService.js
import sofieCore from "../core/SofieCore";

class WaterService {
  constructor() {
    this.status = "idle";
    this.waterData = {
      totalReserve: 0, // liters
      dailyUsage: 0,
      rainfall: 0,
      systems: [], // rainwater, greywater, wells
      purificationCapacity: 0,
      plants: [], // water-consuming plants
    };
    this.history = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      sofieCore.getService("logger").log("[WaterService] Water conservation module initialized.");
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[WaterService] Initialization failed", error);
      throw error;
    }
  }

  addWaterSystem(systemData) {
    const system = {
      id: Date.now(),
      ...systemData,
      capacity: systemData.capacity || 1000,
      current: systemData.current || 0,
      createdAt: new Date().toISOString(),
    };
    this.waterData.systems.push(system);
    sofieCore.updateState("waterSystems", this.waterData.systems);
    sofieCore.getService("logger").log("[WaterService] Water system added:", system.name);
    return system;
  }

  recordRainfall(liters) {
    this.waterData.rainfall += liters;
    this.waterData.totalReserve += liters;
    this.history.push({
      type: "rainfall",
      amount: liters,
      timestamp: new Date().toISOString(),
    });
    sofieCore.updateState("waterReserve", this.waterData.totalReserve);
    sofieCore.getService("logger").log(`[WaterService] Rainfall recorded: +${liters}L`);
  }

  recordUsage(liters, category = "general") {
    this.waterData.dailyUsage += liters;
    this.waterData.totalReserve = Math.max(0, this.waterData.totalReserve - liters);
    this.history.push({
      type: "usage",
      amount: liters,
      category,
      timestamp: new Date().toISOString(),
    });
    sofieCore.updateState("waterUsage", this.waterData.dailyUsage);
  }

  purifyWater(liters) {
    const purified = Math.min(liters, this.waterData.purificationCapacity);
    this.history.push({
      type: "purification",
      amount: purified,
      timestamp: new Date().toISOString(),
    });
    return purified;
  }

  getWaterBalance() {
    return this.waterData.totalReserve;
  }

  getConservationScore() {
    const usageEfficiency = Math.max(100 - (this.waterData.dailyUsage / 10), 0);
    const reserveScore = Math.min((this.waterData.totalReserve / 5000) * 100, 100);
    return Math.round((usageEfficiency + reserveScore) / 2);
  }

  getWaterData() {
    return this.waterData;
  }

  getHistory() {
    return this.history;
  }
}

const waterService = new WaterService();
export default waterService;