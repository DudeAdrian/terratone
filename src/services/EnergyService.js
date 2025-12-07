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
  }

  initialize() {
    this.status = "initialized";
    sofieCore.getService("logger").log("[EnergyService] Energy module initialized.");
  }

  updateEnergyData(data) {
    this.energyData = { ...this.energyData, ...data };
    sofieCore.updateState("energyData", this.energyData);
    sofieCore.getService("logger").log("[EnergyService] Energy data updated:", this.energyData);
  }

  getEnergyData() {
    return this.energyData;
  }
}

const energyService = new EnergyService();
export default energyService;
