// src/services/WaterService.js
import sofieCore from "../core/SofieCore";
import APIService from "./APIService";

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
    this.apiService = APIService;
    this.currentRegionId = null;

    // Sustainable living datasets (home-scale diligence)
    this.potableQualityMetrics = [];
    this.usageRecords = [];
    this.leakEvents = [];
    this.sensorHealth = [];
    this.irrigationZones = [];
    this.irrigationEvents = [];
  }

  initialize(regionId) {
    try {
      this.currentRegionId = regionId;
      this.status = "initialized";
      sofieCore.getService("logger").log("[WaterService] Water conservation module initialized for region: " + regionId);
      this.seedLocalData();
      // Fetch water data from backend
      this.fetchWaterDataFromAPI(regionId);
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[WaterService] Initialization failed", error);
      throw error;
    }
  }

  seedLocalData() {
    // Potable quality metrics (home operations focus)
    this.potableQualityMetrics = [
      { sourceId: "tap-01", turbidity: 0.3, pH: 7.4, conductivity: 420, residualChlorine: 0.4, tds: 210, coliform: 0, hardness: 120, temperature: 22, status: "pass", timestamp: new Date().toISOString() },
      { sourceId: "rain-01", turbidity: 0.8, pH: 6.8, conductivity: 90, residualChlorine: 0.0, tds: 55, coliform: 0, hardness: 35, temperature: 21, status: "pass", timestamp: new Date(Date.now() - 86400000).toISOString() },
    ];

    // Usage analytics (home categories)
    this.usageRecords = [
      { id: "use-001", category: "domestic", liters: 320, meterId: "home-main", zone: "household", timestamp: new Date().toISOString() },
      { id: "use-002", category: "irrigation", liters: 180, meterId: "garden-01", zone: "garden", timestamp: new Date().toISOString() },
    ];

    // Leak detection events and sensor health
    this.leakEvents = [
      { id: "leak-001", sensorId: "prs-12", zone: "corridor", pressureDrop: 0.35, flowDelta: 18, confidence: 0.82, startedAt: new Date(Date.now() - 3600000).toISOString(), resolvedAt: null, status: "investigating", actionTaken: "Isolate valve pending" },
    ];
    this.sensorHealth = [
      { sensorId: "prs-12", battery: 92, signal: 88, lastSeen: new Date().toISOString(), location: "corridor" },
      { sensorId: "prs-14", battery: 77, signal: 81, lastSeen: new Date().toISOString(), location: "kitchen" },
    ];

    // Irrigation planning and events
    this.irrigationZones = [
      { zoneId: "zone-garden", crop: "mixed vegetables", areaSqm: 60, soilType: "loam", etRate: 4.2, targetMoisture: 28, schedule: "06:00, 18:30", source: "rain/grey", dailyAllotment: 180, lastIrrigation: new Date(Date.now() - 7200000).toISOString(), nextIrrigation: new Date(Date.now() + 32400000).toISOString() },
      { zoneId: "zone-greenhouse", crop: "leafy greens", areaSqm: 40, soilType: "hydroponic media", etRate: 3.1, targetMoisture: 30, schedule: "05:30, 17:30", source: "recycled", dailyAllotment: 140, lastIrrigation: new Date(Date.now() - 5400000).toISOString(), nextIrrigation: new Date(Date.now() + 30600000).toISOString() },
    ];
    this.irrigationEvents = [
      { id: "irr-001", zoneId: "zone-garden", volume: 90, durationMin: 18, source: "rain", timestamp: new Date(Date.now() - 7200000).toISOString(), weatherOverride: false },
      { id: "irr-002", zoneId: "zone-greenhouse", volume: 70, durationMin: 15, source: "recycled", timestamp: new Date(Date.now() - 5400000).toISOString(), weatherOverride: false },
    ];
  }

  async fetchWaterDataFromAPI(regionId) {
    try {
      const backendURL = this.apiService.baseURL || "http://localhost:3001/api";
      const response = await fetch(`${backendURL}/regions/${regionId}/water`);
      if (response.ok) {
        const data = await response.json();
        if (data.metrics && data.metrics.length > 0) {
          const latest = data.metrics[0];
          this.waterData = {
            totalReserve: latest.waterAvailability || 5000,
            dailyUsage: (latest.waterAvailability || 5000) * 0.2,
            rainfall: 0,
            systems: [],
            purificationCapacity: (latest.waterAvailability || 5000) * 0.5,
            plants: []
          };
          this.history = data.metrics;
        }
      }
    } catch (error) {
      sofieCore.getService("logger").warn("[WaterService] API fetch failed, using local data", error);
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
    
    // Save to backend
    if (this.currentRegionId) {
      this.saveToBackend();
    }
    return system;
  }

  async saveToBackend() {
    try {
      const backendURL = this.apiService.baseURL || "http://localhost:3001/api";
      await fetch(`${backendURL}/regions/${this.currentRegionId}/water`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waterAvailability: this.waterData.totalReserve,
          waterScore: 70
        })
      });
    } catch (error) {
      sofieCore.getService("logger").warn("[WaterService] Could not save to backend", error);
    }
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

  // Getters for UI consumption
  getPotableQualityMetrics() { return this.potableQualityMetrics; }
  getUsageRecords() { return this.usageRecords; }
  getLeakEvents() { return this.leakEvents; }
  getSensorHealth() { return this.sensorHealth; }
  getIrrigationZones() { return this.irrigationZones; }
  getIrrigationEvents() { return this.irrigationEvents; }
}

const waterService = new WaterService();
export default waterService;