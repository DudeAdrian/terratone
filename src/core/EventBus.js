/**
 * EventBus - Pub/Sub system for cross-service communication
 * Enables services to emit and listen to events without direct coupling
 */

class EventBus {
  constructor() {
    this.subscribers = new Map(); // event -> Set of callbacks
    this.eventHistory = []; // Recent events for debugging
    this.maxHistorySize = 100;
    this.enabled = true;
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {function} callback - Function to call when event is emitted
   * @returns {function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    
    this.subscribers.get(event).add(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event (runs only once)
   * @param {string} event - Event name
   * @param {function} callback - Function to call when event is emitted
   * @returns {function} Unsubscribe function
   */
  once(event, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    
    return this.on(event, wrappedCallback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {function} callback - Callback to remove
   */
  off(event, callback) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(callback);
      
      // Clean up empty subscriber sets
      if (this.subscribers.get(event).size === 0) {
        this.subscribers.delete(event);
      }
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Data to pass to subscribers
   */
  emit(event, data = null) {
    if (!this.enabled) return;
    
    // Record in history
    this.recordEvent(event, data);
    
    // Notify all subscribers
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event);
      
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventBus] Error in subscriber for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Emit an event asynchronously
   * @param {string} event - Event name
   * @param {*} data - Data to pass to subscribers
   */
  async emitAsync(event, data = null) {
    if (!this.enabled) return;
    
    // Record in history
    this.recordEvent(event, data);
    
    // Notify all subscribers asynchronously
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event);
      
      const promises = Array.from(callbacks).map(async (callback) => {
        try {
          await callback(data);
        } catch (error) {
          console.error(`[EventBus] Error in async subscriber for "${event}":`, error);
        }
      });
      
      await Promise.all(promises);
    }
  }

  /**
   * Record event in history for debugging
   */
  recordEvent(event, data) {
    this.eventHistory.push({
      event,
      data,
      timestamp: Date.now(),
    });
    
    // Trim history to max size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Get event history
   * @param {number} limit - Maximum number of events to return
   * @returns {Array} Recent events
   */
  getHistory(limit = 50) {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get subscribers for an event
   * @param {string} event - Event name
   * @returns {number} Number of subscribers
   */
  getSubscriberCount(event) {
    return this.subscribers.has(event) ? this.subscribers.get(event).size : 0;
  }

  /**
   * Get all event names that have subscribers
   * @returns {Array<string>} Event names
   */
  getActiveEvents() {
    return Array.from(this.subscribers.keys());
  }

  /**
   * Clear all subscribers for an event
   * @param {string} event - Event name (optional, clears all if not provided)
   */
  clear(event = null) {
    if (event) {
      this.subscribers.delete(event);
    } else {
      this.subscribers.clear();
    }
  }

  /**
   * Enable/disable event bus
   * @param {boolean} enabled - Whether to enable event bus
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Get statistics about the event bus
   * @returns {object} Statistics
   */
  getStats() {
    const stats = {
      enabled: this.enabled,
      activeEvents: this.getActiveEvents().length,
      totalSubscribers: 0,
      eventBreakdown: {},
      recentEvents: this.eventHistory.slice(-10).map(e => ({
        event: e.event,
        timestamp: new Date(e.timestamp).toISOString(),
      })),
    };
    
    this.subscribers.forEach((callbacks, event) => {
      stats.totalSubscribers += callbacks.size;
      stats.eventBreakdown[event] = callbacks.size;
    });
    
    return stats;
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this.eventHistory = [];
  }
}

// Singleton instance
const eventBus = new EventBus();

// Standard event names (for consistency across services)
export const EVENTS = {
  // Climate Zone Events
  CLIMATE_ZONE_CHANGED: 'climate:zone:changed',
  CLIMATE_ZONE_IMPACT: 'climate:zone:impact',
  
  // Autopilot Events
  AUTOPILOT_MODE_CHANGED: 'autopilot:mode:changed',
  AUTOPILOT_DECISION: 'autopilot:decision',
  AUTOPILOT_INTERVENTION: 'autopilot:intervention',
  AUTOPILOT_PLAYBOOK_TOGGLED: 'autopilot:playbook:toggled',
  
  // Water Events
  WATER_QUALITY_ALERT: 'water:quality:alert',
  WATER_QUALITY_UPDATED: 'water:quality:updated',
  WATER_RECYCLING_EFFICIENCY: 'water:recycling:efficiency',
  
  // Food/Crop Events
  CROP_ADDED: 'food:crop:added',
  CROP_HARVESTED: 'food:crop:harvested',
  NUTRITION_GOALS_UPDATED: 'food:nutrition:goals:updated',
  FEEDING_RATE_CHANGED: 'food:feeding:rate:changed',
  
  // Pest Management Events
  PEST_DETECTED: 'pest:detected',
  PEST_TREATMENT_APPLIED: 'pest:treatment:applied',
  PEST_RISK_CHANGED: 'pest:risk:changed',
  
  // Energy Events
  ENERGY_CONSUMPTION_ALERT: 'energy:consumption:alert',
  PUMP_EFFICIENCY_CHANGED: 'energy:pump:efficiency:changed',
  
  // System Events
  SERVICE_INITIALIZED: 'system:service:initialized',
  SERVICE_ERROR: 'system:service:error',
  SYSTEM_HEALTH_UPDATED: 'system:health:updated',
  
  // Alert Events
  ALERT_CREATED: 'alert:created',
  ALERT_ACKNOWLEDGED: 'alert:acknowledged',
  ALERT_RESOLVED: 'alert:resolved',
  
  // User Preference Events
  PREFERENCES_UPDATED: 'preferences:updated',
  SETTINGS_CHANGED: 'settings:changed',
};

export default eventBus;
