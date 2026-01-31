// src/services/LoggerService.js
import appConfig from '../config/appConfig';

class LoggerService {
  constructor() {
    this.logs = [];
    this.logLevel = appConfig.logger.level;
  }

  initialize() {
    try {
      console.log('[LoggerService] Logger service initialized');
    } catch (error) {
      console.error('[LoggerService] Initialization failed:', error);
    }
  }

  log(message, level = 'info') {
    try {
      const timestamp = new Date().toISOString();
      const entry = {
        timestamp,
        message,
        level,
        formatted: `[${timestamp}] [${level.toUpperCase()}] ${message}`,
      };
      this.logs.push(entry);
      console.log(entry.formatted);
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

  error(message, error) {
    this.log(message, 'error');
    if (error) {
      console.error('Error details:', error);
    }
  }

  warn(message) {
    this.log(message, 'warn');
  }

  debug(message) {
    if (this.logLevel === 'debug') {
      this.log(message, 'debug');
    }
  }

  // Info-level alias used by plugin registry and services
  info(message) {
    this.log(message, 'info');
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

const loggerService = new LoggerService();
export default loggerService;
