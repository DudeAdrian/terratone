// src/rituals/ritualsEngine.js
// Subscribes to smartHome.* events and triggers rituals

const eventBus = require('../eventBus');

class RitualsEngine {
  constructor() {
    eventBus.on('smartHome.ha.event', this.handleSmartHomeEvent.bind(this));
    // Add more subscriptions as needed
  }

  handleSmartHomeEvent(event) {
    // Example: trigger ritual if a certain device state is detected
    if (event.type === 'sensor' && event.state === 'on') {
      this.triggerRitual(event);
    }
  }

  triggerRitual(event) {
    // Ritual logic here
    console.log('Ritual triggered by smart home event:', event);
    // Optionally emit ritual completion event for logging/forwarding
    eventBus.emit('ritual.completed', { event, timestamp: Date.now() });
  }
}

module.exports = RitualsEngine;
