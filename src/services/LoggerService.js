// src/services/LoggerService.js

class LoggerService {
  constructor() {
    this.logs = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  getLogs() {
    return this.logs;
  }
}

export default new LoggerService();
