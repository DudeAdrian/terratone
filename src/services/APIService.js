/**
 * APIService - Centralized HTTP client for external API integrations
 * Handles real weather data, notifications, and future backend connections
 * ENHANCED: Mobile API endpoints wrapping Sofie services
 */

class APIService {
  constructor() {
    this.name = "API";
    // Prefer shared backend env, then legacy API URL, then localhost fallback
    this.baseURL =
      process.env.REACT_APP_BACKEND_URL ||
      process.env.REACT_APP_API_URL ||
      "http://localhost:3001/api";
    this.weatherAPIKey = process.env.REACT_APP_WEATHER_API_KEY || "demo";
    this.endpoints = {
      weather: "https://api.openweathermap.org/data/2.5",
      weatherForecast: "https://api.openweathermap.org/data/2.5/forecast",
    };
    
    // Mobile API enhancements
    this.sofieCore = null;
    this.apiVersion = "v1";
    this.mobileEndpoints = new Map();
    this.requestLog = [];
    this.rateLimits = new Map();
    this.maxRequestsPerMinute = 100;
  }

  initialize(sofieCore) {
    if (!sofieCore) {
      console.error("APIService requires sofieCore for mobile endpoints");
      return;
    }

    this.sofieCore = sofieCore;
    this.registerMobileEndpoints();
    console.log("APIService initialized with " + this.mobileEndpoints.size + " mobile endpoints");
  }

  registerMobileEndpoints() {
    // Dashboard
    this.registerMobileEndpoint("GET", "/mobile/dashboard", this.getMobileDashboard.bind(this));
    
    // Autopilot
    this.registerMobileEndpoint("GET", "/mobile/autopilot/status", this.getAutopilotStatus.bind(this));
    this.registerMobileEndpoint("POST", "/mobile/autopilot/mode", this.setAutopilotMode.bind(this));
    
    // Alerts
    this.registerMobileEndpoint("GET", "/mobile/alerts", this.getMobileAlerts.bind(this));
    this.registerMobileEndpoint("POST", "/mobile/alerts/acknowledge", this.acknowledgeAlert.bind(this));
    
    // Resources
    this.registerMobileEndpoint("GET", "/mobile/resources", this.getResourceStatus.bind(this));
    
    // IoT
    this.registerMobileEndpoint("POST", "/mobile/iot/reading", this.submitSensorReading.bind(this));
    this.registerMobileEndpoint("GET", "/mobile/iot/sensors", this.getSensors.bind(this));
    
    // Predictions
    this.registerMobileEndpoint("GET", "/mobile/predictions", this.getPredictions.bind(this));
    
    // Community
    this.registerMobileEndpoint("GET", "/mobile/community", this.getCommunityInfo.bind(this));
  }

  registerMobileEndpoint(method, path, handler) {
    const key = `${method}:${path}`;
    this.mobileEndpoints.set(key, handler);
  }

  async handleMobileRequest(method, path, params = {}, body = {}) {
    const key = `${method}:${path}`;
    
    if (!this.checkRateLimit(key)) {
      return { status: 429, error: "Rate limit exceeded", retryAfter: 60 };
    }

    this.logRequest(method, path, params);

    const handler = this.mobileEndpoints.get(key);
    if (!handler) {
      return { status: 404, error: "Endpoint not found" };
    }

    try {
      const result = await handler(params, body);
      return {
        status: 200,
        data: result,
        timestamp: new Date().toISOString(),
        apiVersion: this.apiVersion
      };
    } catch (error) {
      console.error("Mobile API request failed:", error.message);
      return { status: 500, error: "Internal server error", message: error.message };
    }
  }

  checkRateLimit(endpoint) {
    const now = Date.now();
    const limit = this.rateLimits.get(endpoint);

    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(endpoint, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (limit.count >= this.maxRequestsPerMinute) return false;

    limit.count++;
    return true;
  }

  logRequest(method, path, params) {
    this.requestLog.push({
      timestamp: new Date().toISOString(),
      method,
      path,
      params
    });

    if (this.requestLog.length > 1000) this.requestLog.shift();
  }

  // Mobile Endpoint Implementations

  getMobileDashboard(params, body) {
    const sustainability = this.sofieCore?.services?.sustainability;
    const autopilot = this.sofieCore?.services?.autopilot;
    const alerts = this.sofieCore?.services?.alerts;
    const energy = this.sofieCore?.services?.energy;
    const water = this.sofieCore?.services?.water;
    const food = this.sofieCore?.services?.food;

    return {
      sustainability: sustainability?.getOverallScore() || 0,
      autopilotMode: autopilot?.getMode() || "manual",
      activeAlerts: alerts?.getActiveAlerts?.()?.length || 0,
      energy: energy?.getCurrentProduction() || 0,
      water: water?.getStorageLevel() || 0,
      food: food?.getInventoryLevel() || 0,
      timestamp: new Date().toISOString()
    };
  }

  getAutopilotStatus(params, body) {
    const autopilot = this.sofieCore?.services?.autopilot;
    return {
      mode: autopilot?.getMode() || "manual",
      active: autopilot?.isActive() || false,
      lastDecision: autopilot?.getLastDecision?.() || null
    };
  }

  setAutopilotMode(params, body) {
    const autopilot = this.sofieCore?.services?.autopilot;
    const { mode } = body;

    if (!mode || !["manual", "assisted", "auto"].includes(mode)) {
      throw new Error("Invalid mode. Must be 'manual', 'assisted', or 'auto'");
    }

    autopilot?.setMode(mode);
    return { success: true, mode, message: `Autopilot mode set to ${mode}` };
  }

  getMobileAlerts(params, body) {
    const alerts = this.sofieCore?.services?.alerts;
    const { severity, limit = 20 } = params;

    let allAlerts = alerts?.getAllAlerts?.() || [];
    if (severity) allAlerts = allAlerts.filter(a => a.severity === severity);

    return { alerts: allAlerts.slice(0, limit), total: allAlerts.length };
  }

  acknowledgeAlert(params, body) {
    const alerts = this.sofieCore?.services?.alerts;
    const { alertId } = body;

    if (!alertId) throw new Error("alertId is required");

    alerts?.acknowledgeAlert?.(alertId);
    return { success: true, alertId, message: "Alert acknowledged" };
  }

  getResourceStatus(params, body) {
    const energy = this.sofieCore?.services?.energy;
    const water = this.sofieCore?.services?.water;
    const food = this.sofieCore?.services?.food;

    return {
      energy: {
        production: energy?.getCurrentProduction() || 0,
        consumption: energy?.getCurrentConsumption() || 0,
        storage: energy?.getStorageLevel() || 0
      },
      water: {
        storage: water?.getStorageLevel() || 0,
        quality: water?.getQualityMetrics() || {}
      },
      food: {
        inventory: food?.getInventoryLevel() || 0,
        categories: food?.getInventoryByCategory?.() || {}
      }
    };
  }

  submitSensorReading(params, body) {
    const iot = this.sofieCore?.services?.iot;
    const { sensorId, value } = body;

    if (!sensorId || value === undefined) throw new Error("sensorId and value are required");

    iot?.processSensorData?.(sensorId, value);
    return { success: true, sensorId, value, timestamp: new Date().toISOString() };
  }

  getSensors(params, body) {
    const iot = this.sofieCore?.services?.iot;
    const { type, status } = params;

    let sensors = iot?.getSensors?.() || [];
    if (type) sensors = sensors.filter(s => s.type === type);
    if (status) sensors = sensors.filter(s => s.status === status);

    return { sensors, count: sensors.length, health: iot?.getSensorHealth?.() || {} };
  }

  getPredictions(params, body) {
    const predictions = this.sofieCore?.services?.predictiveAnalytics;
    const { type, climateZone } = params;

    if (type === "planting" && climateZone) {
      return predictions?.suggestOptimalPlanting?.(climateZone) || [];
    }

    return { predictions: [], message: "Specify prediction type and climateZone" };
  }

  getCommunityInfo(params, body) {
    const community = this.sofieCore?.services?.community;
    const network = this.sofieCore?.services?.globalNetwork;

    return {
      profile: community?.getProfile?.() || {},
      memberCount: community?.getMemberCount?.() || 0,
      networkStats: network?.getNetworkStats?.() || {}
    };
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[APIService] Fetch error for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get current weather data for a location
   */
  async getWeather(location = "San Francisco,US") {
    try {
      const url = `${this.endpoints.weather}/weather?q=${encodeURIComponent(location)}&appid=${this.weatherAPIKey}&units=metric`;
      const data = await this.fetch(url);

      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        conditions: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      };
    } catch (error) {
      console.error("[APIService] Weather fetch failed:", error);
      // Return mock data as fallback
      return this.getMockWeather();
    }
  }

  /**
   * Get 5-day weather forecast
   */
  async getWeatherForecast(location = "San Francisco,US") {
    try {
      const url = `${this.endpoints.weatherForecast}?q=${encodeURIComponent(location)}&appid=${this.weatherAPIKey}&units=metric`;
      const data = await this.fetch(url);

      // Process forecast data (API returns 3-hour intervals)
      const dailyForecasts = this.processForecastData(data.list);
      
      return dailyForecasts;
    } catch (error) {
      console.error("[APIService] Forecast fetch failed:", error);
      return this.getMockForecast();
    }
  }

  /**
   * Process raw forecast data into daily summaries
   */
  processForecastData(forecastList) {
    const dailyData = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString();

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          date: dayKey,
          temps: [],
          conditions: [],
          rain: 0,
          humidity: [],
        };
      }

      dailyData[dayKey].temps.push(item.main.temp);
      dailyData[dayKey].conditions.push(item.weather[0].main);
      dailyData[dayKey].humidity.push(item.main.humidity);
      if (item.rain && item.rain["3h"]) {
        dailyData[dayKey].rain += item.rain["3h"];
      }
    });

    // Convert to array and calculate averages
    return Object.values(dailyData).slice(0, 5).map((day) => ({
      day: day.day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      conditions: this.getMostCommonCondition(day.conditions),
      rainMM: Math.round(day.rain),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      solarRadiation: this.estimateSolarRadiation(day.conditions),
    }));
  }

  /**
   * Get most common weather condition
   */
  getMostCommonCondition(conditions) {
    const counts = {};
    conditions.forEach((c) => {
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  /**
   * Estimate solar radiation based on conditions
   */
  estimateSolarRadiation(conditions) {
    const conditionMap = {
      Clear: 850,
      Clouds: 500,
      Rain: 250,
      Snow: 200,
      Thunderstorm: 300,
      Drizzle: 400,
    };
    
    const avgConditions = Array.isArray(conditions) ? this.getMostCommonCondition(conditions) : conditions;
    return conditionMap[avgConditions] || 600;
  }

  /**
   * Mock weather data fallback
   */
  getMockWeather() {
    return {
      location: "Harmonic Valley (Demo)",
      temperature: 22,
      humidity: 65,
      windSpeed: 12,
      conditions: "Partly Cloudy",
      description: "few clouds",
      icon: "02d",
      pressure: 1013,
      feelsLike: 21,
      sunrise: "6:45 AM",
      sunset: "7:30 PM",
    };
  }

  /**
   * Mock forecast data fallback
   */
  getMockForecast() {
    return [
      { day: "Monday", high: 24, low: 18, conditions: "Sunny", rainMM: 0, solarRadiation: 780 },
      { day: "Tuesday", high: 23, low: 17, conditions: "Clouds", rainMM: 2, solarRadiation: 520 },
      { day: "Wednesday", high: 20, low: 15, conditions: "Rain", rainMM: 15, solarRadiation: 280 },
      { day: "Thursday", high: 25, low: 19, conditions: "Clear", rainMM: 0, solarRadiation: 820 },
      { day: "Friday", high: 26, low: 20, conditions: "Clear", rainMM: 0, solarRadiation: 850 },
    ];
  }

  /**
   * Send notification via email (requires backend)
   */
  async sendNotification(type, recipient, message) {
    try {
      const url = `${this.baseURL}/notifications`;
      return await this.fetch(url, {
        method: "POST",
        body: JSON.stringify({ type, recipient, message }),
      });
    } catch (error) {
      console.error("[APIService] Notification send failed:", error);
      // Log locally as fallback
      console.log(`[NOTIFICATION] ${type} to ${recipient}: ${message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generic backend API call
   */
  async callBackend(endpoint, method = "GET", data = null) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const options = {
        method,
        ...(data && { body: JSON.stringify(data) }),
      };
      return await this.fetch(url, options);
    } catch (error) {
      console.error(`[APIService] Backend call failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

const apiService = new APIService();
export default apiService;
