/**
 * IoT Devices Plugin - Smart device integration and monitoring
 * Connects to solar inverters, smart meters, water sensors, battery systems
 */

class IoTDevicesPlugin {
  constructor(sofieCore, pluginId) {
    this.sofieCore = sofieCore;
    this.pluginId = pluginId;
    this.api = sofieCore.getService("pluginRegistry")?.getPluginAPI(pluginId);
    this.devices = new Map();
  }

  async initialize() {
    try {
      // Initialize mock IoT devices
      this.registerDevice("solar-inverter-1", {
        name: "Solar Inverter Main",
        type: "inverter",
        status: "active",
        currentPower: 3250, // Watts
        totalProduced: 45230, // kWh
        efficiency: 0.97,
      });

      this.registerDevice("battery-pack-1", {
        name: "Battery Storage Pack 1",
        type: "battery",
        status: "active",
        currentCharge: 8500, // Wh
        capacity: 10000, // Wh
        chargeRate: 2000, // W
      });

      this.registerDevice("smart-meter-1", {
        name: "Main Grid Meter",
        type: "meter",
        status: "active",
        currentUsage: 1200, // Watts
        gridImport: 0,
        gridExport: 2050,
      });

      this.registerDevice("water-sensor-1", {
        name: "Rainwater Tank Sensor",
        type: "water",
        status: "active",
        currentLevel: 850, // Liters
        capacity: 1000,
        flowRate: 2.5, // Liters/min
      });

      this.api?.updateState({ devices: Array.from(this.devices.values()) });
      this.api?.log("info", "IoT Devices plugin initialized with 4 devices");
    } catch (error) {
      this.api?.log("error", `Failed to initialize: ${error.message}`);
      throw error;
    }
  }

  registerDevice(deviceId, deviceInfo) {
    this.devices.set(deviceId, {
      id: deviceId,
      ...deviceInfo,
      lastUpdate: new Date().toISOString(),
    });
  }

  getDevices() {
    return Array.from(this.devices.values());
  }

  getDeviceById(deviceId) {
    return this.devices.get(deviceId);
  }

  updateDeviceStatus(deviceId, statusUpdate) {
    const device = this.devices.get(deviceId);
    if (device) {
      const updated = {
        ...device,
        ...statusUpdate,
        lastUpdate: new Date().toISOString(),
      };
      this.devices.set(deviceId, updated);
      this.api?.updateState({ devices: Array.from(this.devices.values()) });
      this.api?.emit("device:updated", { deviceId, device: updated });
      return updated;
    }
    return null;
  }

  getSystemSummary() {
    const summary = {
      totalDevices: this.devices.size,
      activeDevices: Array.from(this.devices.values()).filter((d) => d.status === "active").length,
      currentPowerGeneration: this._sumDeviceMetric("currentPower", 0),
      currentEnergyUsage: this._sumDeviceMetric("currentUsage", 0),
      batteryHealth: this._calculateBatteryHealth(),
      waterAvailability: this._calculateWaterStatus(),
    };
    return summary;
  }

  _sumDeviceMetric(metric, defaultValue = 0) {
    return Array.from(this.devices.values()).reduce((sum, device) => {
      return sum + (device[metric] || defaultValue);
    }, 0);
  }

  _calculateBatteryHealth() {
    const batteryDevice = Array.from(this.devices.values()).find((d) => d.type === "battery");
    if (!batteryDevice) return 0;
    return Math.round((batteryDevice.currentCharge / batteryDevice.capacity) * 100);
  }

  _calculateWaterStatus() {
    const waterDevice = Array.from(this.devices.values()).find((d) => d.type === "water");
    if (!waterDevice) return 0;
    return Math.round((waterDevice.currentLevel / waterDevice.capacity) * 100);
  }

  destroy() {
    this.devices.clear();
    this.api?.log("info", "IoT Devices plugin destroyed");
  }
}

export default IoTDevicesPlugin;
