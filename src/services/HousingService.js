// src/services/HousingService.js
import sofieCore from "../core/SofieCore";

class HousingService {
  constructor() {
    this.status = "idle";
    this.housingData = {
      structures: [],
      thermalEfficiency: 0, // percentage
      insulation: [],
      airQuality: 50, // 0-100
      naturalLight: 0, // percentage
      indoorClimate: {
        temperature: 20,
        humidity: 50,
        co2Level: 400,
      },
      materials: [], // sustainable building materials used
      maintenanceLogs: [],
    };
  }

  initialize() {
    try {
      this.status = "initialized";
      sofieCore.getService("logger").log("[HousingService] Housing & shelter module initialized.");
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[HousingService] Initialization failed", error);
      throw error;
    }
  }

  addStructure(structureData) {
    const structure = {
      id: Date.now(),
      ...structureData,
      createdAt: new Date().toISOString(),
    };
    this.housingData.structures.push(structure);
    sofieCore.updateState("housingStructures", this.housingData.structures);
    sofieCore.getService("logger").log("[HousingService] Structure added:", structure.name);
    return structure;
  }

  updateThermalData(thermalData) {
    this.housingData.thermalEfficiency = thermalData.efficiency || this.housingData.thermalEfficiency;
    this.housingData.indoorClimate = {
      ...this.housingData.indoorClimate,
      ...thermalData.climate,
    };
    sofieCore.updateState("housingThermal", this.housingData.indoorClimate);
    sofieCore.getService("logger").log("[HousingService] Thermal data updated");
  }

  addInsulation(insulationData) {
    const insulation = {
      id: Date.now(),
      ...insulationData,
      installedAt: new Date().toISOString(),
    };
    this.housingData.insulation.push(insulation);
    sofieCore.updateState("housingInsulation", this.housingData.insulation);
    sofieCore.getService("logger").log("[HousingService] Insulation added:", insulationData.type);
  }

  updateAirQuality(quality) {
    this.housingData.airQuality = Math.min(quality, 100);
    sofieCore.updateState("airQuality", this.housingData.airQuality);
  }

  updateNaturalLight(percentage) {
    this.housingData.naturalLight = Math.min(percentage, 100);
    sofieCore.updateState("naturalLight", this.housingData.naturalLight);
  }

  logMaintenance(maintenanceRecord) {
    const record = {
      id: Date.now(),
      ...maintenanceRecord,
      date: new Date().toISOString(),
    };
    this.housingData.maintenanceLogs.push(record);
    sofieCore.getService("logger").log("[HousingService] Maintenance logged:", maintenanceRecord.task);
  }

  getHabitatScore() {
    const thermalScore = this.housingData.thermalEfficiency;
    const airScore = this.housingData.airQuality;
    const lightScore = this.housingData.naturalLight;
    return Math.round((thermalScore + airScore + lightScore) / 3);
  }

  getHousingData() {
    return this.housingData;
  }

  /**
   * Get equipment runtime in hours (for AutopilotService)
   */
  getEquipmentRuntime() {
    // Simulate total runtime of HVAC, pumps, etc.
    const baseRuntime = 2000; // hours
    const additionalRuntime = Math.random() * 1000; // 0-1000 hours
    return Math.round(baseRuntime + additionalRuntime);
  }
}

const housingService = new HousingService();
export default housingService;