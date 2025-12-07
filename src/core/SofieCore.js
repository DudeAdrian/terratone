// src/core/SofieCore.js
import LoggerService from "../services/LoggerService";
import EnergyService from "../services/EnergyService";
import CommunityService from "../services/CommunityService";
import FoodService from "../services/FoodService";
import WaterService from "../services/WaterService";
import HousingService from "../services/HousingService";
import SustainabilityService from "../services/SustainabilityService";

class SofieCore {
  constructor() {
    this.services = {};
    this.state = {};
    this.stateListeners = {};
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
    this.registerService("logger", LoggerService);
    LoggerService.log("SofieCore initialized and logger service active.");

    this.registerService("energy", EnergyService);
    LoggerService.log("Energy service registered and active.");

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
  }
}

const sofieCore = new SofieCore();
export default sofieCore;