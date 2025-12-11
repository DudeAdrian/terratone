// src/core/SofieCore.js
import LoggerService from "../services/LoggerService";
import EnergyService from "../services/EnergyService";
import CommunityService from "../services/CommunityService";
import FoodService from "../services/FoodService";
import WaterService from "../services/WaterService";
import HousingService from "../services/HousingService";
import SustainabilityService from "../services/SustainabilityService";
import InventoryService from "../services/InventoryService";
import MarketplaceService from "../services/MarketplaceService";
import CommunityNetworkService from "../services/CommunityNetworkService";
import ImpactMetricsService from "../services/ImpactMetricsService";
import KnowledgeBaseService from "../services/KnowledgeBaseService";
import GovernanceService from "../services/GovernanceService";
import ResilienceService from "../services/ResilienceService";
import WellnessService from "../services/WellnessService";
import StorageService from "../services/StorageService";
import APIService from "../services/APIService";
import AuthService from "../services/AuthService";
import CommunityCapacityService from "../services/CommunityCapacityService";
import HousingExpansionService from "../services/HousingExpansionService";
import WaterExpansionService from "../services/WaterExpansionService";
import SolarExpansionService from "../services/SolarExpansionService";
import EmergencyPreparednessService from "../services/EmergencyPreparednessService";
import PluginRegistry from "./PluginRegistry";
import SeedBankService from "../services/SeedBankService";
import GlobalNetworkService from "../services/GlobalNetworkService";
import GlobalGrowingScheduleService from "../services/GlobalGrowingScheduleService";
import HarvestForecastService from "../services/HarvestForecastService";
import PestManagementService from "../services/PestManagementService";
import WaterRecyclingService from "../services/WaterRecyclingService";
import AquaticLifeService from "../services/AquaticLifeService";
import AutopilotService from "../services/AutopilotService";
import ClimateService from "../services/ClimateService";
import IoTService from "../services/IoTService";
import PredictiveAnalyticsService from "../services/PredictiveAnalyticsService";
import ImpactTrackingService from "../services/ImpactTrackingService";
import HerbalLibraryService from "../services/HerbalLibraryService";
import GlobalMapService from "../services/GlobalMapService";

class SofieCore {
  constructor() {
    this.services = {};
    this.state = {};
    this.stateListeners = {};
    this.initialized = false;
  }

  registerService(name, serviceInstance) {
    this.services[name] = serviceInstance;
    console.log(`[SofieCore] Registered service: ${name}`);
  }

  getService(name) {
    return this.services[name];
  }

  updateState(key, value) {
    this.state[key] = value;
    console.log(`[SofieCore] State updated: ${key} =`, value);
    this.notifyStateListeners(key, value);
  }

  getState(key) {
    return this.state[key];
  }

  subscribeToState(key, callback) {
    if (!this.stateListeners[key]) {
      this.stateListeners[key] = [];
    }
    this.stateListeners[key].push(callback);
  }

  notifyStateListeners(key, value) {
    if (this.stateListeners[key]) {
      this.stateListeners[key].forEach(callback => callback(value));
    }
  }

  init() {
    if (this.initialized) {
      return; // prevent double-registration and multiple instantiation
    }

    // Core Infrastructure Services
    this.registerService("logger", LoggerService);
    LoggerService.log("SofieCore initialized and logger service active.");

    this.registerService("storage", StorageService);
    StorageService.initialize();
    LoggerService.log("Storage service initialized.");

    this.registerService("api", APIService);
    LoggerService.log("API service registered.");

    this.registerService("auth", AuthService);
    AuthService.initialize();
    LoggerService.log("Auth service initialized.");

    // Original Services
    this.registerService("energy", EnergyService);
    LoggerService.log("Energy service registered and active.");

    this.registerService("climate", ClimateService);
    ClimateService.initialize();
    LoggerService.log("Climate service registered and active.");

    this.registerService("community", CommunityService);
    LoggerService.log("Community service registered and active.");

    this.registerService("food", FoodService);
    FoodService.initialize();
    LoggerService.log("Food service registered and active.");

    this.registerService("water", WaterService);
    WaterService.initialize();
    LoggerService.log("Water service registered and active.");

    this.registerService("housing", HousingService);
    HousingService.initialize();
    LoggerService.log("Housing service registered and active.");

    this.registerService("sustainability", SustainabilityService);
    SustainabilityService.initialize();
    LoggerService.log("Sustainability aggregator registered and active.");

    // New Benchmark OS Services
    this.registerService("inventory", InventoryService);
    InventoryService.initialize();
    LoggerService.log("Inventory service registered and active.");

    this.registerService("marketplace", MarketplaceService);
    MarketplaceService.initialize();
    LoggerService.log("Marketplace service registered and active.");

    this.registerService("communityNetwork", CommunityNetworkService);
    CommunityNetworkService.initialize();
    LoggerService.log("Community Network service registered and active.");

    this.registerService("impactMetrics", ImpactMetricsService);
    ImpactMetricsService.initialize();
    LoggerService.log("Impact Metrics service registered and active.");

    this.registerService("knowledgeBase", KnowledgeBaseService);
    KnowledgeBaseService.initialize();
    LoggerService.log("Knowledge Base service registered and active.");

    this.registerService("governance", GovernanceService);
    GovernanceService.initialize();
    LoggerService.log("Governance service registered and active.");

    this.registerService("resilience", ResilienceService);
    ResilienceService.initialize();
    LoggerService.log("Resilience service registered and active.");

    this.registerService("wellness", WellnessService);
    WellnessService.initialize();
    LoggerService.log("Wellness service registered and active.");

    this.registerService("communityCapacity", CommunityCapacityService);
    const communityCapacityInstance = new CommunityCapacityService();
    communityCapacityInstance.init(this);
    this.services["communityCapacity"] = communityCapacityInstance;
    LoggerService.log("Community Capacity service registered and active.");

    this.registerService("housingExpansion", HousingExpansionService);
    const housingExpansionInstance = new HousingExpansionService();
    housingExpansionInstance.init(this);
    this.services["housingExpansion"] = housingExpansionInstance;
    LoggerService.log("Housing Expansion service registered and active.");

    this.registerService("waterExpansion", WaterExpansionService);
    const waterExpansionInstance = new WaterExpansionService();
    waterExpansionInstance.init(this);
    this.services["waterExpansion"] = waterExpansionInstance;
    LoggerService.log("Water Expansion service registered and active.");

    this.registerService("solarExpansion", SolarExpansionService);
    const solarExpansionInstance = new SolarExpansionService();
    solarExpansionInstance.init(this);
    this.services["solarExpansion"] = solarExpansionInstance;
    LoggerService.log("Solar Expansion service registered and active.");

    this.registerService("emergencyPreparedness", EmergencyPreparednessService);
    const emergencyPreparednessInstance = new EmergencyPreparednessService();
    emergencyPreparednessInstance.init(this);
    this.services["emergencyPreparedness"] = emergencyPreparednessInstance;
    LoggerService.log("Emergency Preparedness service registered and active.");

    this.registerService("seedBank", SeedBankService);
    const seedBankInstance = new SeedBankService();
    seedBankInstance.init(this);
    this.services["seedBank"] = seedBankInstance;
    LoggerService.log("Seed Bank service registered and active.");

    this.registerService("globalNetwork", GlobalNetworkService);
    const globalNetworkInstance = new GlobalNetworkService();
    globalNetworkInstance.init(this);
    this.services["globalNetwork"] = globalNetworkInstance;
    LoggerService.log("Global Network service registered and active.");

    this.registerService("globalGrowingSchedule", GlobalGrowingScheduleService);
    const growingScheduleInstance = new GlobalGrowingScheduleService();
    growingScheduleInstance.initialize();
    this.services["globalGrowingSchedule"] = growingScheduleInstance;
    LoggerService.log("Global Growing Schedule service registered and active.");

    const herbalLibraryInstance = new HerbalLibraryService();
    herbalLibraryInstance.initialize();
    this.registerService("herbalLibrary", herbalLibraryInstance);
    LoggerService.log("Herbal Library service registered and active.");

    GlobalMapService.initialize();
    this.registerService("globalMap", GlobalMapService);
    LoggerService.log("Global Map service registered and active.");

    this.registerService("harvestForecast", HarvestForecastService);
    const harvestForecastInstance = new HarvestForecastService();
    harvestForecastInstance.initialize();
    this.services["harvestForecast"] = harvestForecastInstance;
    LoggerService.log("Harvest Forecast service registered and active.");

    this.registerService("pestManagement", PestManagementService);
    const pestManagementInstance = new PestManagementService();
    pestManagementInstance.initialize();
    this.services["pestManagement"] = pestManagementInstance;
    LoggerService.log("Pest Management service registered and active.");

    this.registerService("waterRecycling", WaterRecyclingService);
    const waterRecyclingInstance = new WaterRecyclingService();
    waterRecyclingInstance.initialize();
    this.services["waterRecycling"] = waterRecyclingInstance;
    LoggerService.log("Water Recycling service registered and active.");

    this.registerService("aquaticLife", AquaticLifeService);
    const aquaticLifeInstance = new AquaticLifeService();
    aquaticLifeInstance.initialize();
    this.services["aquaticLife"] = aquaticLifeInstance;
    LoggerService.log("Aquatic Life service registered and active.");

    this.registerService("autopilot", AutopilotService);
    const autopilotInstance = new AutopilotService();
    autopilotInstance.initialize();
    this.services["autopilot"] = autopilotInstance;
    LoggerService.log("Autopilot service registered and active.");

    // Expansion Services - IoT, Predictive Analytics, Impact Tracking
    this.registerService("iot", IoTService);
    const iotInstance = new IoTService();
    iotInstance.initialize(this);
    this.services["iot"] = iotInstance;
    LoggerService.log("IoT service registered and active.");

    this.registerService("predictiveAnalytics", PredictiveAnalyticsService);
    const predictiveAnalyticsInstance = new PredictiveAnalyticsService();
    predictiveAnalyticsInstance.initialize(this);
    this.services["predictiveAnalytics"] = predictiveAnalyticsInstance;
    LoggerService.log("Predictive Analytics service registered and active.");

    this.registerService("impactTracking", ImpactTrackingService);
    const impactTrackingInstance = new ImpactTrackingService();
    impactTrackingInstance.initialize(this);
    this.services["impactTracking"] = impactTrackingInstance;
    LoggerService.log("Impact Tracking service registered and active.");

    // Initialize API Service with mobile endpoints
    this.registerService("api", APIService);
    APIService.initialize(this);
    LoggerService.log("API service registered with mobile endpoints.");

    // Initialize Governance Service with sofieCore
    GovernanceService.initialize(this);

    // Initialize Plugin Registry
    const pluginRegistry = new PluginRegistry(this);
    this.registerService("pluginRegistry", pluginRegistry);
    LoggerService.log("Plugin Registry initialized.");

    // Register built-in plugins
    pluginRegistry.registerPlugin("weather", {
      name: "Weather Integration",
      description: "Real-time weather data for forecasting and planning",
      category: "integration",
      version: "1.0.0",
      icon: "🌤️",
    });

    pluginRegistry.registerPlugin("iot-devices", {
      name: "IoT Devices",
      description: "Smart device monitoring and control",
      category: "integration",
      version: "1.0.0",
      icon: "🔌",
    });

    pluginRegistry.registerPlugin("smart-alerts", {
      name: "Smart Alerts",
      description: "Threshold-based system notifications",
      category: "automation",
      version: "1.0.0",
      icon: "🔔",
    });

    pluginRegistry.registerPlugin("skills-directory", {
      name: "Skills Directory",
      description: "Community member expertise and availability",
      category: "community",
      version: "1.0.0",
      icon: "👥",
    });

    pluginRegistry.registerPlugin("aquaponics", {
      name: "Aquaponics Manager",
      description: "Monitor and optimize aquaponics systems",
      category: "automation",
      version: "1.0.0",
      icon: "🐟",
    });

    LoggerService.log("Sofie Systems OS fully initialized with 33 services + Plugin Registry for Harmonic Habitats communities.");

    this.initialized = true;
    
    // Make sofieCore available globally for debugging
    if (typeof window !== 'undefined') {
      window.sofieCore = this;
    }
  }
}

const sofieCore = new SofieCore();
export default sofieCore;