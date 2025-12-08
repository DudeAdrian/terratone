// src/services/EnergyService.js
import sofieCore from "../core/SofieCore";

class EnergyService {
  constructor() {
    this.status = "idle";
    this.energyData = {
      solarProduction: 0,
      batteryLevel: 0,
      gridBalance: 0,
    };
    this.history = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      sofieCore.getService("logger").log("[EnergyService] Energy module initialized.");
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[EnergyService] Initialization failed", error);
      throw error;
    }
  }

  updateEnergyData(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Energy data must be a valid object');
      }
      this.energyData = { ...this.energyData, ...data };
      this.history.push({
        timestamp: new Date().toISOString(),
        data: { ...this.energyData },
      });
      sofieCore.updateState("energyData", this.energyData);
      sofieCore.getService("logger").debug("[EnergyService] Energy data updated");
    } catch (error) {
      sofieCore.getService("logger").error("[EnergyService] Update failed", error);
      throw error;
    }
  }

  getEnergyData() {
    try {
      return { ...this.energyData };
    } catch (error) {
      sofieCore.getService("logger").error("[EnergyService] Get data failed", error);
      return null;
    }
  }

  getHistory() {
    return this.history;
  }

  /**
   * Get pump efficiency percentage (for AutopilotService)
   */
  getPumpEfficiency() {
    // Simulate pump efficiency based on runtime and age
    const baseEfficiency = 95;
    const degradation = Math.random() * 5; // 0-5% degradation
    return Math.round(baseEfficiency - degradation);
  }

  /**
   * Get current power consumption in watts (for AutopilotService)
   */
  getCurrentPowerConsumption() {
    // Base consumption + variable load
    const baseConsumption = 800; // watts
    const variableLoad = Math.random() * 600; // 0-600w variable
    return Math.round(baseConsumption + variableLoad);
  }
}

const energyService = new EnergyService();
export default energyService;
