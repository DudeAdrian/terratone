/**
 * Weather Plugin - Real-time weather integration for sustainable community planning
 * Provides weather data for energy forecasting, water collection, and activity planning
 */

class WeatherPlugin {
  constructor(sofieCore, pluginId) {
    this.sofieCore = sofieCore;
    this.pluginId = pluginId;
    this.api = sofieCore.getService("pluginRegistry")?.getPluginAPI(pluginId);
    this.weatherData = null;
    this.refreshInterval = null;
  }

  async initialize() {
    try {
      // Mock weather data - in production, this would call OpenWeatherMap or similar
      this.weatherData = {
        location: "Harmonic Valley",
        temperature: 22,
        humidity: 65,
        windSpeed: 12,
        conditions: "Partly Cloudy",
        uvIndex: 6,
        solarRadiation: 650, // W/m²
        rainProbability: 15,
        forecast: [
          { day: "Monday", high: 24, low: 18, conditions: "Sunny", solarRadiation: 700 },
          { day: "Tuesday", high: 23, low: 17, conditions: "Cloudy", solarRadiation: 500 },
          { day: "Wednesday", high: 20, low: 15, conditions: "Rainy", solarRadiation: 300 },
          { day: "Thursday", high: 25, low: 19, conditions: "Sunny", solarRadiation: 750 },
          { day: "Friday", high: 26, low: 20, conditions: "Sunny", solarRadiation: 780 },
        ],
      };

      // Update SofieCore state with weather data
      this.api?.updateState({ weatherData: this.weatherData });

      // Simulate weather refresh every 30 minutes
      this.refreshInterval = setInterval(() => {
        this.updateWeather();
      }, 1800000);

      this.api?.log("info", "Weather plugin initialized successfully");
    } catch (error) {
      this.api?.log("error", `Failed to initialize: ${error.message}`);
      throw error;
    }
  }

  updateWeather() {
    // In production, call real weather API
    this.weatherData.temperature = Math.round(15 + Math.random() * 15);
    this.weatherData.humidity = Math.round(40 + Math.random() * 50);
    this.api?.updateState({ weatherData: this.weatherData });
    this.api?.log("info", "Weather data updated");
  }

  getWeatherData() {
    return this.weatherData;
  }

  getSolarForecast() {
    return this.weatherData.forecast.map((day) => ({
      day: day.day,
      expectedEnergy: day.solarRadiation * 0.2, // Assuming 20% panel efficiency
    }));
  }

  getRainfallForecast() {
    return this.weatherData.forecast.map((day) => ({
      day: day.day,
      probability: day.conditions === "Rainy" ? 80 : 20,
      estimatedMM: day.conditions === "Rainy" ? 15 : 2,
    }));
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.api?.log("info", "Weather plugin destroyed");
  }
}

export default WeatherPlugin;
