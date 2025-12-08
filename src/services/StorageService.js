/**
 * StorageService - Client-side data persistence using LocalStorage
 * Provides persistent storage for all services and user data
 */

class StorageService {
  constructor() {
    this.storagePrefix = "harmonic_habitats_";
    this.initialized = false;
  }

  initialize() {
    try {
      // Test localStorage availability
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this.initialized = true;
      console.log("[StorageService] Initialized successfully");
    } catch (e) {
      console.error("[StorageService] LocalStorage not available:", e);
      this.initialized = false;
    }
  }

  /**
   * Save data to localStorage
   */
  save(key, data) {
    if (!this.initialized) return false;
    try {
      const fullKey = this.storagePrefix + key;
      const serialized = JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      });
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error(`[StorageService] Error saving ${key}:`, error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  load(key, defaultValue = null) {
    if (!this.initialized) return defaultValue;
    try {
      const fullKey = this.storagePrefix + key;
      const stored = localStorage.getItem(fullKey);
      if (!stored) return defaultValue;

      const parsed = JSON.parse(stored);
      return parsed.data;
    } catch (error) {
      console.error(`[StorageService] Error loading ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key) {
    if (!this.initialized) return false;
    try {
      const fullKey = this.storagePrefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`[StorageService] Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all Harmonic Habitats data
   */
  clear() {
    if (!this.initialized) return false;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("[StorageService] Error clearing storage:", error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  getStats() {
    if (!this.initialized) return { available: false };

    try {
      const keys = Object.keys(localStorage);
      const harmonicKeys = keys.filter((k) => k.startsWith(this.storagePrefix));
      
      let totalSize = 0;
      harmonicKeys.forEach((key) => {
        const item = localStorage.getItem(key);
        totalSize += item ? item.length : 0;
      });

      return {
        available: true,
        itemCount: harmonicKeys.length,
        sizeKB: (totalSize / 1024).toFixed(2),
        quota: this.getQuota(),
      };
    } catch (error) {
      console.error("[StorageService] Error getting stats:", error);
      return { available: false, error: error.message };
    }
  }

  /**
   * Estimate storage quota
   */
  getQuota() {
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate().then((estimate) => {
        return {
          usage: estimate.usage,
          quota: estimate.quota,
          percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2),
        };
      });
    }
    return Promise.resolve({ usage: 0, quota: 0, percentUsed: 0 });
  }

  /**
   * Export all data as JSON
   */
  exportData() {
    if (!this.initialized) return null;
    try {
      const keys = Object.keys(localStorage);
      const harmonicKeys = keys.filter((k) => k.startsWith(this.storagePrefix));
      
      const exportData = {};
      harmonicKeys.forEach((key) => {
        const shortKey = key.replace(this.storagePrefix, "");
        exportData[shortKey] = this.load(shortKey);
      });

      return {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        data: exportData,
      };
    } catch (error) {
      console.error("[StorageService] Error exporting data:", error);
      return null;
    }
  }

  /**
   * Import data from JSON
   */
  importData(importedData) {
    if (!this.initialized) return false;
    try {
      if (!importedData.data) return false;

      Object.entries(importedData.data).forEach(([key, value]) => {
        this.save(key, value);
      });

      console.log("[StorageService] Data imported successfully");
      return true;
    } catch (error) {
      console.error("[StorageService] Error importing data:", error);
      return false;
    }
  }

  /**
   * Save autopilot decision to history
   */
  saveAutopilotDecision(decision) {
    const decisions = this.load("autopilot_decisions", []);
    decisions.push({
      ...decision,
      timestamp: new Date().toISOString(),
    });
    // Keep last 1000 decisions
    const trimmed = decisions.slice(-1000);
    return this.save("autopilot_decisions", trimmed);
  }

  /**
   * Get autopilot decision history
   */
  getAutopilotDecisions(limit = 100) {
    const decisions = this.load("autopilot_decisions", []);
    return decisions.slice(-limit);
  }

  /**
   * Save autopilot intervention alert
   */
  saveIntervention(intervention) {
    const interventions = this.load("autopilot_interventions", []);
    interventions.push({
      ...intervention,
      timestamp: new Date().toISOString(),
      resolved: false,
    });
    return this.save("autopilot_interventions", interventions);
  }

  /**
   * Get unresolved interventions
   */
  getUnresolvedInterventions() {
    const interventions = this.load("autopilot_interventions", []);
    return interventions.filter(i => !i.resolved);
  }

  /**
   * Mark intervention as resolved
   */
  resolveIntervention(interventionId, resolution = "") {
    const interventions = this.load("autopilot_interventions", []);
    const updated = interventions.map(i => 
      i.id === interventionId || i.timestamp === interventionId
        ? { ...i, resolved: true, resolvedAt: new Date().toISOString(), resolution }
        : i
    );
    return this.save("autopilot_interventions", updated);
  }

  /**
   * Save user preference (alias for save with prefix)
   */
  savePreference(key, value) {
    return this.save(`pref_${key}`, value);
  }

  /**
   * Get user preference
   */
  getPreference(key, defaultValue = null) {
    return this.load(`pref_${key}`, defaultValue);
  }

  /**
   * Remove user preference
   */
  removePreference(key) {
    return this.remove(`pref_${key}`);
  }
}

const storageService = new StorageService();
export default storageService;
