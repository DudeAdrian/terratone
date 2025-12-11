// src/services/ClimateService.js
import sofieCore from "../core/SofieCore";

class ClimateService {
  constructor() {
    this.status = "idle";
    
    // Climate control data
    this.indoorClimate = null;
    this.outdoorForecast = null;
    this.humidityData = null;
    this.airQuality = null;
    this.ventilationSystem = null;
  }

  initialize(regionId) {
    try {
      this.currentRegionId = regionId;
      this.status = "initialized";
      sofieCore.getService("logger")?.log("[ClimateService] Climate module initialized for region: " + regionId);
      this.seedLocalData();
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger")?.error("[ClimateService] Initialization failed", error);
      throw error;
    }
  }

  seedLocalData() {
    const now = new Date();
    
    // Indoor Climate
    this.indoorClimate = {
      zones: [
        {
          zoneId: "Living Room",
          currentTemp: 21.5,
          targetTemp: 22.0,
          humidity: 45,
          targetHumidity: 50,
          co2: 580,
          voc: 120,
          occupancy: 2,
          hvacMode: "auto",
          fanSpeed: "medium",
          energyUse: 1.2, // kWh today
          comfort: 92 // percentage
        },
        {
          zoneId: "Bedroom",
          currentTemp: 19.0,
          targetTemp: 18.5,
          humidity: 48,
          targetHumidity: 50,
          co2: 420,
          voc: 80,
          occupancy: 0,
          hvacMode: "heat",
          fanSpeed: "low",
          energyUse: 0.8,
          comfort: 95
        },
        {
          zoneId: "Kitchen",
          currentTemp: 23.5,
          targetTemp: 22.0,
          humidity: 52,
          targetHumidity: 50,
          co2: 720,
          voc: 240,
          occupancy: 1,
          hvacMode: "cool",
          fanSpeed: "high",
          energyUse: 1.8,
          comfort: 85
        },
        {
          zoneId: "Office",
          currentTemp: 20.8,
          targetTemp: 21.0,
          humidity: 46,
          targetHumidity: 50,
          co2: 650,
          voc: 150,
          occupancy: 1,
          hvacMode: "auto",
          fanSpeed: "medium",
          energyUse: 1.0,
          comfort: 90
        }
      ],
      overallComfort: 90,
      totalEnergyUse: 4.8,
      systemStatus: "online"
    };

    // Outdoor Forecast
    this.outdoorForecast = {
      current: {
        temperature: 15.2,
        feelsLike: 13.8,
        humidity: 65,
        pressure: 1013,
        windSpeed: 12,
        windDirection: "NW",
        conditions: "Partly Cloudy",
        uvIndex: 3,
        visibility: 10,
        dewPoint: 8.5
      },
      hourly: [
        { hour: 14, temp: 16.0, humidity: 62, conditions: "Sunny", precipitation: 0 },
        { hour: 15, temp: 16.5, humidity: 60, conditions: "Sunny", precipitation: 0 },
        { hour: 16, temp: 16.2, humidity: 63, conditions: "Partly Cloudy", precipitation: 0 },
        { hour: 17, temp: 15.5, humidity: 65, conditions: "Partly Cloudy", precipitation: 5 },
        { hour: 18, temp: 14.8, humidity: 68, conditions: "Cloudy", precipitation: 10 },
        { hour: 19, temp: 14.0, humidity: 70, conditions: "Light Rain", precipitation: 25 }
      ],
      daily: [
        { day: "Today", high: 17, low: 12, conditions: "Partly Cloudy", precipitation: 20 },
        { day: "Tomorrow", high: 19, low: 14, conditions: "Sunny", precipitation: 5 },
        { day: "Thursday", high: 18, low: 13, conditions: "Cloudy", precipitation: 40 },
        { day: "Friday", high: 16, low: 11, conditions: "Rain", precipitation: 80 },
        { day: "Saturday", high: 20, low: 15, conditions: "Sunny", precipitation: 0 }
      ],
      alerts: [
        { type: "wind", severity: "low", message: "Gusty winds expected this evening" }
      ]
    };

    // Humidity Data
    this.humidityData = {
      zones: [
        {
          zoneId: "Living Room",
          current: 45,
          target: 50,
          trend: "rising",
          humidifierActive: true,
          dehumidifierActive: false,
          waterLevel: 85 // percentage
        },
        {
          zoneId: "Bedroom",
          current: 48,
          target: 50,
          trend: "stable",
          humidifierActive: true,
          dehumidifierActive: false,
          waterLevel: 72
        },
        {
          zoneId: "Kitchen",
          current: 52,
          target: 50,
          trend: "falling",
          humidifierActive: false,
          dehumidifierActive: true,
          waterLevel: 60
        },
        {
          zoneId: "Bathroom",
          current: 68,
          target: 55,
          trend: "falling",
          humidifierActive: false,
          dehumidifierActive: true,
          waterLevel: 40
        }
      ],
      overallHumidity: 48,
      targetRange: [45, 55],
      systemHealth: 98
    };

    // Air Quality
    this.airQuality = {
      indoor: [
        {
          location: "Living Room",
          aqi: 25,
          pm25: 8,
          pm10: 12,
          co2: 580,
          voc: 120,
          no2: 5,
          rating: "Excellent",
          lastUpdated: new Date(now - 300000).toISOString()
        },
        {
          location: "Bedroom",
          aqi: 18,
          pm25: 5,
          pm10: 8,
          co2: 420,
          voc: 80,
          no2: 3,
          rating: "Excellent",
          lastUpdated: new Date(now - 300000).toISOString()
        },
        {
          location: "Kitchen",
          aqi: 45,
          pm25: 15,
          pm10: 22,
          co2: 720,
          voc: 240,
          no2: 12,
          rating: "Good",
          lastUpdated: new Date(now - 300000).toISOString()
        },
        {
          location: "Office",
          aqi: 32,
          pm25: 10,
          pm10: 15,
          co2: 650,
          voc: 150,
          no2: 7,
          rating: "Good",
          lastUpdated: new Date(now - 300000).toISOString()
        }
      ],
      outdoor: {
        aqi: 55,
        pm25: 18,
        pm10: 28,
        o3: 45,
        no2: 22,
        so2: 8,
        co: 0.4,
        rating: "Moderate",
        source: "EPA AirNow"
      }
    };

    // Ventilation System
    this.ventilationSystem = {
      ervStatus: "active", // Energy Recovery Ventilator
      exchangeRate: 0.35, // air changes per hour
      heatRecovery: 85, // percentage
      filterStatus: [
        { location: "Main ERV", type: "HEPA", efficiency: 92, lifeRemaining: 65, lastChanged: "2025-09-15" },
        { location: "Kitchen Hood", type: "Activated Carbon", efficiency: 88, lifeRemaining: 45, lastChanged: "2025-10-01" },
        { location: "Bathroom", type: "MERV 13", efficiency: 95, lifeRemaining: 78, lastChanged: "2025-08-20" }
      ],
      fanSpeeds: [
        { zone: "Living Room", speed: 45, mode: "auto" },
        { zone: "Bedroom", speed: 30, mode: "sleep" },
        { zone: "Kitchen", speed: 75, mode: "boost" },
        { zone: "Office", speed: 50, mode: "auto" }
      ],
      energyUsage: 0.35, // kWh today
      indoorOutdoorDelta: 6.3, // temperature difference
      bypassDamper: "closed"
    };
  }

  getIndoorClimate() {
    return this.indoorClimate;
  }

  getOutdoorForecast() {
    return this.outdoorForecast;
  }

  getHumidityData() {
    return this.humidityData;
  }

  getAirQuality() {
    return this.airQuality;
  }

  getVentilationSystem() {
    return this.ventilationSystem;
  }
}

const climateService = new ClimateService();
export default climateService;
