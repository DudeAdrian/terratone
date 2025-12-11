// src/services/EnergyService.js
import sofieCore from "../core/SofieCore";
import APIService from "./APIService";

class EnergyService {
  constructor() {
    this.status = "idle";
    this.energyData = {
      solarProduction: 0,
      batteryLevel: 0,
      gridBalance: 0,
    };
    this.history = [];
    this.apiService = APIService;
    this.currentRegionId = null;
    
    // Home energy system data
    this.solarArrays = [];
    this.gridMetrics = [];
    this.batteryState = null;
    this.loadProfiles = [];
    this.energyForecast = null;
    
    this.seedLocalData();
  }

  initialize(regionId) {
    try {
      this.currentRegionId = regionId;
      this.status = "initialized";
      sofieCore.getService("logger").log("[EnergyService] Energy module initialized for region: " + regionId);
      // Fetch energy data from backend
      this.fetchEnergyDataFromAPI(regionId);
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[EnergyService] Initialization failed", error);
      throw error;
    }
  }

  async fetchEnergyDataFromAPI(regionId) {
    try {
      const backendURL = this.apiService.baseURL || "http://localhost:3001/api";
      const response = await fetch(`${backendURL}/regions/${regionId}/energy`);
      if (response.ok) {
        const data = await response.json();
        if (data.metrics && data.metrics.length > 0) {
          const latest = data.metrics[0];
          this.energyData = {
            solarProduction: latest.energyProduction || 0,
            batteryLevel: 85,
            gridBalance: latest.energyScore || 50,
          };
          this.history = data.metrics;
        }
      }
    } catch (error) {
      sofieCore.getService("logger").warn("[EnergyService] API fetch failed, using local data", error);
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
      
      // Save to backend
      if (this.currentRegionId) {
        this.saveToBackend();
      }
    } catch (error) {
      sofieCore.getService("logger").error("[EnergyService] Update failed", error);
      throw error;
    }
  }

  async saveToBackend() {
    try {
      const backendURL = this.apiService.baseURL || "http://localhost:3001/api";
      await fetch(`${backendURL}/regions/${this.currentRegionId}/energy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energyProduction: this.energyData.solarProduction,
          energyConsumption: this.energyData.gridBalance,
          energyScore: 75
        })
      });
    } catch (error) {
      sofieCore.getService("logger").warn("[EnergyService] Could not save to backend", error);
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

  /**
   * Seed local sustainable living energy data
   */
  seedLocalData() {
    const now = new Date();
    
    // Solar Arrays
    this.solarArrays = [
      {
        arrayId: "Roof-North",
        panelCount: 12,
        capacity: 4800, // watts
        currentOutput: 3200,
        efficiency: 92,
        temperature: 42,
        inverterStatus: "online",
        todayProduction: 18.5, // kWh
        voltage: 385,
        location: "North roof slope"
      },
      {
        arrayId: "Roof-South",
        panelCount: 8,
        capacity: 3200,
        currentOutput: 2100,
        efficiency: 89,
        temperature: 45,
        inverterStatus: "online",
        todayProduction: 12.3,
        voltage: 380,
        location: "South roof slope"
      },
      {
        arrayId: "Garden-Ground",
        panelCount: 6,
        capacity: 2400,
        currentOutput: 1600,
        efficiency: 94,
        temperature: 38,
        inverterStatus: "online",
        todayProduction: 9.7,
        voltage: 390,
        location: "Ground mount garden"
      }
    ];

    // Grid Metrics
    this.gridMetrics = [
      {
        id: 1,
        timestamp: new Date(now - 3600000).toISOString(),
        imported: 2.3, // kWh
        exported: 5.8,
        netFlow: -3.5, // negative = export
        voltage: 240,
        frequency: 50.02,
        powerFactor: 0.98,
        tariff: "off-peak",
        cost: -0.42 // negative = earned from export
      },
      {
        id: 2,
        timestamp: new Date(now - 7200000).toISOString(),
        imported: 0.8,
        exported: 7.2,
        netFlow: -6.4,
        voltage: 239,
        frequency: 50.01,
        powerFactor: 0.97,
        tariff: "off-peak",
        cost: -0.64
      },
      {
        id: 3,
        timestamp: new Date(now - 10800000).toISOString(),
        imported: 4.1,
        exported: 1.2,
        netFlow: 2.9,
        voltage: 241,
        frequency: 49.99,
        powerFactor: 0.96,
        tariff: "peak",
        cost: 1.23
      }
    ];

    // Battery State
    this.batteryState = {
      capacity: 13500, // Wh (13.5 kWh)
      currentCharge: 10800, // 80%
      chargePercent: 80,
      voltage: 51.2,
      current: 12.5, // positive = charging
      temperature: 24,
      cycleCount: 342,
      health: 96,
      mode: "charging",
      timeToFull: 45, // minutes
      estimatedRuntime: 8.5, // hours at current load
      manufacturer: "Tesla Powerwall 2",
      warrantyYears: 10
    };

    // Load Profiles
    this.loadProfiles = [
      {
        zone: "HVAC",
        currentLoad: 1200, // watts
        priority: "high",
        scheduled: true,
        controllable: true,
        todayConsumption: 14.2, // kWh
        averageDailyUse: 13.8,
        status: "active"
      },
      {
        zone: "Kitchen",
        currentLoad: 800,
        priority: "medium",
        scheduled: false,
        controllable: false,
        todayConsumption: 6.5,
        averageDailyUse: 7.2,
        status: "active"
      },
      {
        zone: "Lighting",
        currentLoad: 320,
        priority: "low",
        scheduled: true,
        controllable: true,
        todayConsumption: 2.8,
        averageDailyUse: 3.1,
        status: "active"
      },
      {
        zone: "Water Pump",
        currentLoad: 0,
        priority: "high",
        scheduled: true,
        controllable: true,
        todayConsumption: 3.2,
        averageDailyUse: 3.5,
        status: "idle"
      },
      {
        zone: "EV Charger",
        currentLoad: 0,
        priority: "low",
        scheduled: true,
        controllable: true,
        todayConsumption: 18.5,
        averageDailyUse: 12.0,
        status: "idle"
      }
    ];

    // Energy Forecast
    this.energyForecast = {
      nextHours: [
        { hour: 14, solarEstimate: 6.2, demandEstimate: 2.8, netEstimate: 3.4, tariff: "off-peak", price: 0.12 },
        { hour: 15, solarEstimate: 5.8, demandEstimate: 3.1, netEstimate: 2.7, tariff: "off-peak", price: 0.12 },
        { hour: 16, solarEstimate: 4.5, demandEstimate: 3.5, netEstimate: 1.0, tariff: "shoulder", price: 0.18 },
        { hour: 17, solarEstimate: 2.8, demandEstimate: 4.2, netEstimate: -1.4, tariff: "shoulder", price: 0.18 },
        { hour: 18, solarEstimate: 1.2, demandEstimate: 5.8, netEstimate: -4.6, tariff: "peak", price: 0.32 },
        { hour: 19, solarEstimate: 0.0, demandEstimate: 6.2, netEstimate: -6.2, tariff: "peak", price: 0.32 }
      ],
      recommendations: [
        { time: "17:00", action: "Charge battery from solar", savings: 1.20 },
        { time: "18:30", action: "Run dishwasher before peak", savings: 0.45 },
        { time: "22:00", action: "Delay EV charging to off-peak", savings: 2.80 }
      ],
      weatherImpact: "Clear skies expected, optimal solar generation",
      todayTotal: { production: 40.5, consumption: 45.2, gridCost: 0.85 },
      tomorrowEstimate: { production: 42.0, consumption: 44.0, gridCost: -0.35 }
    };
  }

  getSolarArrays() {
    return this.solarArrays;
  }

  getGridMetrics() {
    return this.gridMetrics;
  }

  getBatteryState() {
    return this.batteryState;
  }

  getLoadProfiles() {
    return this.loadProfiles;
  }

  getEnergyForecast() {
    return this.energyForecast;
  }
}

const energyService = new EnergyService();
export default energyService;
