// src/core/SofieCore.js
import LoggerService from "../services/LoggerService";
import EnergyService from "../services/EnergyService";
import CommunityService from "../services/CommunityService"; // ✅ Import CommunityService

class SofieCore {
  constructor() {
    this.services = {};
    this.state = {};
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
  }

  getState(key) {
    return this.state[key];
  }

  init() {
    this.registerService("logger", LoggerService);
    LoggerService.log("SofieCore initialized and logger service active.");

    this.registerService("energy", EnergyService);
    LoggerService.log("Energy service registered and active.");

    this.registerService("community", CommunityService); // ✅ Register community
    LoggerService.log("Community service registered and active.");
  }
}

const sofieCore = new SofieCore();
export default sofieCore;
