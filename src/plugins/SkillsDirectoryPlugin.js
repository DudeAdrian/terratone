/**
 * Smart Alerts Plugin - Configurable threshold-based notifications
 * Monitors system metrics and triggers alerts for critical conditions
 */

class SmartAlertsPlugin {
  constructor(sofieCore, pluginId) {
    this.sofieCore = sofieCore;
    this.pluginId = pluginId;
    this.api = sofieCore.getService("pluginRegistry")?.getPluginAPI(pluginId);
    this.alerts = [];
    this.thresholds = new Map();
    this.monitoringInterval = null;
  }

  async initialize() {
    try {
      // Set default thresholds
      this.setThreshold("battery-low", 20, "Battery charge below 20%");
      this.setThreshold("battery-critical", 10, "Battery charge critically low (10%)");
      this.setThreshold("water-low", 25, "Water level below 25%");
      this.setThreshold("grid-import-high", 2000, "Grid import exceeding 2000W");
      this.setThreshold("temperature-high", 28, "Temperature above 28°C");
      this.setThreshold("inventory-low", 15, "Item quantity below 15%");

      // Start monitoring
      this.startMonitoring();

      this.api?.updateState({
        alerts: this.alerts,
        thresholds: Array.from(this.thresholds.entries()).map(([key, value]) => ({
          id: key,
          ...value,
        })),
      });

      this.api?.log("info", "Smart Alerts plugin initialized with 6 thresholds");
    } catch (error) {
      this.api?.log("error", `Failed to initialize: ${error.message}`);
      throw error;
    }
  }

  setThreshold(thresholdId, value, description) {
    this.thresholds.set(thresholdId, { value, description, enabled: true });
  }

  startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.checkSystemMetrics();
    }, 60000); // Check every minute

    // Initial check
    this.checkSystemMetrics();
  }

  checkSystemMetrics() {
    // Simulate metric checks against thresholds
    const metrics = {
      batteryCharge: 18,
      waterLevel: 35,
      gridImport: 1800,
      temperature: 26,
    };

    // Check battery threshold
    if (metrics.batteryCharge < 20) {
      this.createAlert("battery-low", "warning", `Battery charge at ${metrics.batteryCharge}%`);
    }
    if (metrics.batteryCharge < 10) {
      this.createAlert("battery-critical", "critical", `Battery CRITICAL at ${metrics.batteryCharge}%`);
    }

    // Check water threshold
    if (metrics.waterLevel < 25) {
      this.createAlert("water-low", "warning", `Water level at ${metrics.waterLevel}%`);
    }

    this.api?.updateState({ alerts: this.alerts });
  }

  createAlert(thresholdId, severity, message) {
    // Avoid duplicate alerts
    const exists = this.alerts.some((a) => a.thresholdId === thresholdId && a.status === "active");
    if (!exists) {
      const alert = {
        id: `alert-${Date.now()}`,
        thresholdId,
        severity, // "info", "warning", "critical"
        message,
        timestamp: new Date().toISOString(),
        status: "active",
      };
      this.alerts.unshift(alert);

      // Keep only last 50 alerts
      if (this.alerts.length > 50) {
        this.alerts = this.alerts.slice(0, 50);
      }

      this.api?.emit("alert:created", alert);
      this.api?.log("warn", `Alert created: ${message}`);
    }
  }

  dismissAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = "dismissed";
      this.api?.emit("alert:dismissed", { alertId });
      return true;
    }
    return false;
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = "acknowledged";
      this.api?.emit("alert:acknowledged", { alertId });
      return true;
    }
    return false;
  }

  getAlerts(filter = "active") {
    if (filter === "all") return this.alerts;
    if (filter === "critical") return this.alerts.filter((a) => a.severity === "critical");
    return this.alerts.filter((a) => a.status === filter);
  }

  getAlertStats() {
    return {
      total: this.alerts.length,
      active: this.alerts.filter((a) => a.status === "active").length,
      critical: this.alerts.filter((a) => a.severity === "critical").length,
      warning: this.alerts.filter((a) => a.severity === "warning").length,
      dismissed: this.alerts.filter((a) => a.status === "dismissed").length,
    };
  }

  destroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.api?.log("info", "Smart Alerts plugin destroyed");
  }
}

export default SmartAlertsPlugin;
