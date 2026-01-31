// scripts/testEvent.js
// Simulate a smart home event, emit to eventBus, and POST to integration API

const eventBus = require('../src/eventBus');
const axios = require('axios');

// Simulate a normalized smart home event
const testEvent = {
  id: 'sensor.living_room_motion',
  type: 'sensor',
  state: 'on',
  attributes: { location: 'living_room', battery: 98 },
  timestamp: Date.now()
};

console.log('Emitting test event to eventBus...');
eventBus.emit('smartHome.ha.event', testEvent);

// POST to integration API to forward event
(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/integration/forward', {
      event: testEvent,
      forwardTo: ['heartware', 'terracare']
    });
    console.log('Forwarding result:', res.data);
  } catch (err) {
    console.error('Forwarding failed:', err.message);
  }
})();
