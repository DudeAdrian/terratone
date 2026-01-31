// src/eventBus.js
// Singleton EventEmitter for internal pub/sub

const EventEmitter = require('events');
const eventBus = new EventEmitter();

module.exports = eventBus;
