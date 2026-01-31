// src/services/smartHomeIntegration.js
// Generic integration for smart home platforms (Home Assistant, Nest, Matter)
// Normalizes device events and publishes to event bus

const axios = require('axios');
const eventBus = require('../eventBus');

class SmartHomeIntegration {
  constructor(config) {
    this.config = config;
  }

  async pollHomeAssistant() {
    try {
      const res = await axios.get(`${this.config.baseUrl}/api/states`, {
        headers: { Authorization: `Bearer ${this.config.token}` }
      });
      res.data.forEach(device => {
        const normalized = this.normalize(device);
        eventBus.emit('smartHome.ha.event', normalized);
      });
    } catch (err) {
      console.error('Home Assistant poll error:', err.message);
    }
  }

  normalize(device) {
    return {
      id: device.entity_id,
      type: device.domain,
      state: device.state,
      attributes: device.attributes,
      timestamp: Date.now()
    };
  }
}

module.exports = SmartHomeIntegration;
