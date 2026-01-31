// src/services/IoTService.js
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

class IoTService {
  constructor() {
    this.status = "idle";
    this.sensors = new Map();
    this.readings = [];
    this.alerts = [];
    this.lastSync = null;
  }

  initialize() {
    this.status = "initialized";
    this.initializeSensorTypes();
    sofieCore.getService("logger").log("[IoTService] IoT sensor management initialized");
  }

  initializeSensorTypes() {
    this.sensorTypes = {
      water_ph: { unit: "pH", range: { min: 6.0, max: 8.5 }, critical: { min: 6.5, max: 8.0 } },
      water_temp: { unit: "°C", range: { min: 10, max: 35 }, critical: { min: 15, max: 30 } },
      water_do: { unit: "mg/L", range: { min: 4, max: 12 }, critical: { min: 5, max: 10 } },
      soil_moisture: { unit: "%", range: { min: 20, max: 80 }, critical: { min: 30, max: 70 } },
      soil_temp: { unit: "°C", range: { min: 10, max: 35 }, critical: { min: 15, max: 28 } },
      air_temp: { unit: "°C", range: { min: -10, max: 45 }, critical: { min: 10, max: 35 } },
      air_humidity: { unit: "%", range: { min: 30, max: 90 }, critical: { min: 40, max: 80 } },
      light_level: { unit: "lux", range: { min: 0, max: 100000 }, critical: { min: 10000, max: 80000 } },
    };
  }

  // Register new IoT sensor
  registerSensor(sensorData) {
    const sensor = {
      id: sensorData.id || `sensor_${Date.now()}`,
      type: sensorData.type,
      location: sensorData.location,
      status: "active",
      lastReading: null,
      lastReadingTime: null,
      registeredAt: new Date().toISOString(),
      calibrationDate: sensorData.calibrationDate || new Date().toISOString(),
    };

    this.sensors.set(sensor.id, sensor);
    
    eventBus.emit(EVENTS.SERVICE_INITIALIZED, {
      service: "iot",
      sensor: sensor.id,
      type: sensor.type,
    });

    return sensor;
  }

  // Process incoming sensor data and trigger relevant services
  processSensorData(sensorId, reading) {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) {
      console.warn(`[IoTService] Unknown sensor: ${sensorId}`);
      return null;
    }

    const sensorType = this.sensorTypes[sensor.type];
    if (!sensorType) {
      console.warn(`[IoTService] Unknown sensor type: ${sensor.type}`);
      return null;
    }

    // Store reading
    const dataPoint = {
      sensorId,
      type: sensor.type,
      location: sensor.location,
      value: reading.value,
      timestamp: reading.timestamp || new Date().toISOString(),
      unit: sensorType.unit,
    };

    this.readings.push(dataPoint);
    sensor.lastReading = reading.value;
    sensor.lastReadingTime = dataPoint.timestamp;

    // Keep last 10000 readings
    if (this.readings.length > 10000) {
      this.readings = this.readings.slice(-10000);
    }

    // Check thresholds and emit events
    this.checkThresholds(sensor, reading.value, sensorType);

    // Route to appropriate services
    this.routeToServices(sensor.type, reading.value, sensor.location);

    return dataPoint;
  }

  // Check if reading is outside acceptable range
  checkThresholds(sensor, value, sensorType) {
    const { critical, range } = sensorType;

    if (value < critical.min || value > critical.max) {
      const alert = {
        id: `alert_${Date.now()}`,
        severity: "high",
        sensorId: sensor.id,
        type: sensor.type,
        location: sensor.location,
        value,
        message: `${sensor.type} ${value < critical.min ? "below" : "above"} critical threshold`,
        timestamp: new Date().toISOString(),
      };

      this.alerts.push(alert);

      // Emit critical alert
      eventBus.emit(EVENTS.ALERT_CREATED, {
        severity: "high",
        source: "iot",
        sensor: sensor.id,
        type: sensor.type,
        value,
      });
    } else if (value < range.min || value > range.max) {
      // Warning level
      eventBus.emit(EVENTS.ALERT_CREATED, {
        severity: "medium",
        source: "iot",
        sensor: sensor.id,
        type: sensor.type,
        value,
      });
    }
  }

  // Route sensor data to appropriate existing services
  routeToServices(sensorType, value, location) {
    const waterService = sofieCore.getService("water");
    const climateService = sofieCore.getService("food");

    switch (sensorType) {
      case "water_ph":
      case "water_temp":
      case "water_do":
        if (waterService) {
          eventBus.emit(EVENTS.WATER_QUALITY_CHANGED, {
            source: "iot",
            metric: sensorType,
            value,
            location,
          });
        }
        break;

      case "air_temp":
      case "air_humidity":
        eventBus.emit(EVENTS.CLIMATE_ZONE_CHANGED, {
          source: "iot",
          metric: sensorType,
          value,
          location,
        });
        break;

      case "soil_moisture":
      case "soil_temp":
        eventBus.emit(EVENTS.RESOURCE_DEPLETED, {
          source: "iot",
          resource: "soil",
          metric: sensorType,
          value,
          location,
        });
        break;
    }
  }

  // Get all sensors by type or location
  getSensors(filter = {}) {
    let sensors = Array.from(this.sensors.values());

    if (filter.type) {
      sensors = sensors.filter(s => s.type === filter.type);
    }

    if (filter.location) {
      sensors = sensors.filter(s => s.location === filter.location);
    }

    if (filter.status) {
      sensors = sensors.filter(s => s.status === filter.status);
    }

    return sensors;
  }

  // Get recent readings for a sensor
  getSensorReadings(sensorId, limit = 100) {
    return this.readings
      .filter(r => r.sensorId === sensorId)
      .slice(-limit);
  }

  // Get all readings by type
  getReadingsByType(type, hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    return this.readings.filter(r => r.type === type && r.timestamp > cutoff);
  }

  // Get active alerts
  getActiveAlerts() {
    return this.alerts.slice(-50);
  }

  // Deactivate sensor
  deactivateSensor(sensorId) {
    const sensor = this.sensors.get(sensorId);
    if (sensor) {
      sensor.status = "inactive";
      return true;
    }
    return false;
  }

  // Get sensor health status
  getSensorHealth() {
    const sensors = Array.from(this.sensors.values());
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    return {
      total: sensors.length,
      active: sensors.filter(s => s.status === "active").length,
      inactive: sensors.filter(s => s.status === "inactive").length,
      stale: sensors.filter(s => {
        const lastTime = s.lastReadingTime ? new Date(s.lastReadingTime).getTime() : 0;
        return s.status === "active" && lastTime < oneHourAgo;
      }).length,
      recentAlerts: this.alerts.slice(-10).length,
    };
  }

  // Bulk import sensor data (for testing or initial setup)
  bulkImport(sensorDataArray) {
    const results = {
      success: 0,
      failed: 0,
      sensors: [],
    };

    sensorDataArray.forEach(data => {
      try {
        const sensor = this.registerSensor(data);
        results.success++;
        results.sensors.push(sensor.id);
      } catch (error) {
        results.failed++;
        console.error("[IoTService] Failed to import sensor:", error);
      }
    });

    return results;
  }

  // Get dashboard summary
  getDashboardSummary() {
    const health = this.getSensorHealth();
    const recentReadings = this.readings.slice(-100);
    
    return {
      ...health,
      totalReadings: this.readings.length,
      recentReadings: recentReadings.length,
      lastSync: this.lastSync,
      coverage: {
        water: this.getSensors({ type: "water_ph" }).length > 0,
        soil: this.getSensors({ type: "soil_moisture" }).length > 0,
        climate: this.getSensors({ type: "air_temp" }).length > 0,
      },
    };
  }
}

export default IoTService;
