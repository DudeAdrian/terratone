/**
 * BaseService - Abstract base class for all Sofie services
 * 
 * Provides:
 * - Data validation & sanitization
 * - Consistent error handling
 * - Return shape enforcement (prevents undefined propagation)
 * - Logging integration
 * - Dependency resolution
 * 
 * All new services should extend BaseService and:
 * 1. Define this.dataContract with expected return shapes
 * 2. Override init(core) to store core reference
 * 3. Call this.validateAndReturn(data) before returning from methods
 */

export default class BaseService {
  constructor() {
    this.name = "BaseService";
    this.core = null;
    this.logger = null;
    
    // Define in subclasses: { methodName: { shape, description } }
    this.dataContract = {};
  }

  /**
   * Initialize service with core reference
   * Subclasses should call super.init(core) first
   */
  init(core) {
    this.core = core;
    this.logger = core?.getService("logger");
    this.log(`[${this.name}] Service initialized`);
  }

  /**
   * Centralized logging with service name prefix
   */
  log(message, data = null) {
    if (this.logger) {
      if (data) {
        this.logger.log(message, data);
      } else {
        this.logger.log(message);
      }
    } else {
      console.log(`${this.name}: ${message}`, data || "");
    }
  }

  warn(message, data = null) {
    if (this.logger) {
      if (data) {
        this.logger.warn(message, data);
      } else {
        this.logger.warn(message);
      }
    } else {
      console.warn(`${this.name}: ${message}`, data || "");
    }
  }

  error(message, data = null) {
    if (this.logger) {
      if (data) {
        this.logger.error(message, data);
      } else {
        this.logger.error(message);
      }
    } else {
      console.error(`${this.name}: ${message}`, data || "");
    }
  }

  /**
   * Get a dependency service
   * Logs warning if service not found
   */
  getService(serviceName) {
    if (!this.core) {
      this.error(`Cannot get service '${serviceName}': core not initialized`);
      return null;
    }
    
    const service = this.core.getService(serviceName);
    if (!service) {
      this.warn(`Service '${serviceName}' not found in core`);
    }
    return service;
  }

  /**
   * Validate input parameters
   * Override in subclasses to add custom validation
   * Throw Error if validation fails
   */
  validateInput(methodName, input) {
    // Base implementation: no validation required
    return true;
  }

  /**
   * Validate and enforce return shape
   * Prevents undefined propagation by returning proper defaults
   * 
   * @param {any} data - Data to validate
   * @param {string} methodName - Method that generated data
   * @param {object} expectedShape - Expected structure/defaults
   * @returns {any} - Either original data or default shape
   */
  validateAndReturn(data, methodName, expectedShape = {}) {
    // If data is explicitly null, return it (caller intends null)
    if (data === null) {
      return null;
    }

    // If data is undefined, return default shape
    if (data === undefined) {
      this.warn(
        `[${methodName}] Returned undefined; using default shape`,
        expectedShape
      );
      return this._deepCopy(expectedShape);
    }

    // If data is array, ensure it's never undefined
    if (Array.isArray(data)) {
      return data.length > 0 ? data : [];
    }

    // If data is object, validate keys exist and aren't undefined
    if (typeof data === "object" && expectedShape && typeof expectedShape === "object") {
      return this._mergeWithDefaults(data, expectedShape);
    }

    // For primitives, return as-is
    return data;
  }

  /**
   * Deep copy to avoid mutations
   */
  _deepCopy(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => this._deepCopy(item));
    }
    if (obj !== null && typeof obj === "object") {
      const copy = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = this._deepCopy(obj[key]);
        }
      }
      return copy;
    }
    return obj;
  }

  /**
   * Merge data with defaults, using defaults where data is undefined
   */
  _mergeWithDefaults(data, defaults) {
    const result = {};
    
    // Copy all keys from defaults
    for (const key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        result[key] = this._deepCopy(defaults[key]);
      }
    }
    
    // Override with data values (only if not undefined)
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== undefined) {
        result[key] = this._deepCopy(data[key]);
      }
    }
    
    return result;
  }

  /**
   * Safe property access with fallback
   * Replaces multiple null checks with single call
   */
  getSafe(obj, path, defaultValue = undefined) {
    const value = path.split(".").reduce((current, prop) => {
      return current?.[prop];
    }, obj);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Transform and filter array safely
   */
  safeMap(arr, mapper, defaultValue = []) {
    if (!Array.isArray(arr)) {
      return defaultValue;
    }
    try {
      return arr.map(mapper).filter(item => item !== undefined);
    } catch (error) {
      this.error(`Error in safeMap: ${error.message}`);
      return defaultValue;
    }
  }

  /**
   * Filter array safely
   */
  safeFilter(arr, predicate, defaultValue = []) {
    if (!Array.isArray(arr)) {
      return defaultValue;
    }
    try {
      return arr.filter(predicate);
    } catch (error) {
      this.error(`Error in safeFilter: ${error.message}`);
      return defaultValue;
    }
  }

  /**
   * Safely reduce array
   */
  safeReduce(arr, reducer, initialValue) {
    if (!Array.isArray(arr)) {
      return initialValue;
    }
    try {
      return arr.reduce(reducer, initialValue);
    } catch (error) {
      this.error(`Error in safeReduce: ${error.message}`);
      return initialValue;
    }
  }

  /**
   * Serialize service state for storage/debugging
   */
  toJSON() {
    return {
      name: this.name,
      initialized: !!this.core,
      timestamp: new Date().toISOString()
    };
  }
}
