// src/services/ImpactMetricsService.js

class ImpactMetricsService {
  constructor() {
    this.status = "idle";
    this.metrics = {
      carbonFootprint: 2.5,
      waterSaved: 45000,
      energyGenerated: 9500,
      foodProduced: 450,
      wasteReduced: 92,
      biodiversityIndex: 78,
    };
    this.benchmarks = {};
    this.history = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      this.generateBenchmarks();
      console.log("[ImpactMetricsService] Impact metrics initialized");
    } catch (error) {
      this.status = "error";
      console.error("[ImpactMetricsService] Initialization failed", error);
    }
  }

  generateBenchmarks() {
    this.benchmarks = {
      carbonFootprint: { target: 2, unit: "tons CO2/person/year" },
      waterSaved: { target: 50000, unit: "liters/year" },
      energyGenerated: { target: 10000, unit: "kWh/year" },
      foodProduced: { target: 500, unit: "kg/person/year" },
      wasteReduced: { target: 95, unit: "% diversion rate" },
      biodiversityIndex: { target: 85, unit: "species count" },
    };
  }

  updateMetrics(data) {
    try {
      this.metrics = { ...this.metrics, ...data };
      this.history.push({
        timestamp: new Date().toISOString(),
        metrics: { ...this.metrics },
      });
    } catch (error) {
      console.error("[ImpactMetricsService] Update failed", error);
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getBenchmarkComparison() {
    const comparison = {};
    Object.keys(this.metrics).forEach((key) => {
      const current = this.metrics[key];
      const target = this.benchmarks[key]?.target || 0;
      comparison[key] = {
        current,
        target,
        percentageOfTarget: target > 0 ? Math.round((current / target) * 100) : 0,
      };
    });
    return comparison;
  }

  getOverallScore() {
    const comparison = this.getBenchmarkComparison();
    const avgScore = Object.values(comparison).reduce((sum, item) => sum + item.percentageOfTarget, 0) / Object.keys(comparison).length;
    return Math.min(Math.round(avgScore), 100);
  }

  getHistory() {
    return this.history;
  }
}

const impactMetricsService = new ImpactMetricsService();
export default impactMetricsService;
