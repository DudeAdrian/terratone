// src/services/WaterRecyclingService.js
import sofieCore from "../core/SofieCore";

class WaterRecyclingService {
  constructor() {
    this.status = "idle";
    this.systems = [];
    this.dailyMetrics = [];
    this.recyclingHistory = [];
    this.globalSchedule = null;
    this.currentMetrics = {
      pH: 7.0,
      temperature: 26,
      dissolvedOxygen: 7.0,
      ammonia: 0.5,
      nitrite: 0.1,
      nitrate: 40,
      conductivity: 1500,
    };
  }

  initialize() {
    this.status = "initialized";
    this.globalSchedule = sofieCore.getService("globalGrowingSchedule");
    this.createDefaultSystems();
    sofieCore.getService("logger").log("[WaterRecyclingService] Water recycling service initialized");
  }

  // Create default aquaponics recycling systems
  createDefaultSystems() {
    const defaultSystems = [
      {
        id: "aq-01",
        name: "Primary Aquaponics System",
        type: "aquaponics",
        volume: 10000, // liters
        location: "main-greenhouse",
        setupDate: new Date(2024, 0, 1).toISOString(),
        components: {
          fishTank: { volume: 3000, species: "tilapia", population: 1500 },
          biofilter: { type: "moving-bed", capacity: 2000, mediaType: "plastic-rings" },
          growbeds: { count: 4, capacity: 1000, mediaType: "expanded-clay" },
          sump: { volume: 2000 },
        },
        recyclingRate: 0.92, // 92% recycling efficiency
        targetTemp: 26,
        targetPH: 6.8,
        maxCapacity: 12000,
      },
      {
        id: "aq-02",
        name: "Secondary System",
        type: "aquaponics",
        volume: 5000,
        location: "secondary-greenhouse",
        setupDate: new Date(2024, 3, 15).toISOString(),
        components: {
          fishTank: { volume: 1500, species: "tilapia", population: 750 },
          biofilter: { type: "moving-bed", capacity: 1000, mediaType: "plastic-rings" },
          growbeds: { count: 2, capacity: 500, mediaType: "expanded-clay" },
          sump: { volume: 1000 },
        },
        recyclingRate: 0.88,
        targetTemp: 26,
        targetPH: 6.8,
        maxCapacity: 6000,
      },
    ];

    this.systems = defaultSystems;
    this.generateDailyMetrics();
  }

  // Generate daily performance metrics for all systems
  generateDailyMetrics() {
    const today = new Date();
    this.systems.forEach(system => {
      const metrics = {
        systemId: system.id,
        date: today.toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        inflow: this.generateInflow(system),
        outflow: this.generateOutflow(system),
        recycled: 0,
        freshWaterAdded: 0,
        losses: {
          evaporation: this.calculateEvaporation(system),
          plantAbsorption: this.calculatePlantAbsorption(system),
          biofilterUsage: system.components.biofilter.capacity * 0.05, // 5% per day
        },
        waterQuality: {
          temperature: system.targetTemp + (Math.random() - 0.5) * 2, // ±1°C variation
          pH: system.targetPH + (Math.random() - 0.5) * 0.4, // ±0.2 variation
          dissolvedOxygen: 6.5 + Math.random() * 1.5, // 6.5-8 mg/L
          ammonia: 0.5 + Math.random() * 0.5, // 0.5-1 mg/L
          nitrite: Math.random() * 0.1, // 0-0.1 mg/L
          nitrate: 150 + Math.random() * 50, // 150-200 mg/L
          conductivity: 1000 + Math.random() * 200, // micros/cm
        },
        efficiency: system.recyclingRate,
      };

      // Calculate recycled vs fresh water
      metrics.recycled = metrics.inflow * metrics.efficiency;
      metrics.freshWaterAdded = Math.max(0, metrics.inflow - metrics.recycled);

      this.dailyMetrics.push(metrics);
      this.recyclingHistory.push({
        ...metrics,
        dataType: "daily",
      });
    });
  }

  // Calculate daily inflow (crop + system needs)
  generateInflow(system) {
    const baseInflow = system.volume * 0.15; // 15% system volume per day (standard aquaponics)
    const variation = baseInflow * 0.1 * (Math.random() - 0.5);
    return Math.round(baseInflow + variation);
  }

  // Calculate daily outflow (harvest, maintenance drain)
  generateOutflow(system) {
    const baseOutflow = system.volume * 0.08; // 8% for harvest/maintenance
    return Math.round(baseOutflow * (0.5 + Math.random()));
  }

  // Calculate evaporation losses (temperature dependent)
  calculateEvaporation(system) {
    const baseEvaporation = system.volume * 0.03; // 3% base evaporation
    const tempFactor = (system.targetTemp - 20) / 10; // Higher temp = more evaporation
    return Math.round(baseEvaporation * (1 + tempFactor * 0.2));
  }

  // Calculate plant absorption (growth stage dependent)
  calculatePlantAbsorption(system) {
    const growbedVolume = system.components.growbeds.capacity * system.components.growbeds.count;
    return Math.round(growbedVolume * 0.02); // 2% of growbed volume absorbed daily
  }

  // Get system by ID
  getSystem(systemId) {
    return this.systems.find(s => s.systemId === systemId);
  }

  // Get today's metrics for a system
  getTodayMetrics(systemId) {
    const today = new Date().toISOString().split('T')[0];
    return this.dailyMetrics.filter(m => m.systemId === systemId && m.date === today);
  }

  // Get metrics for a date range
  getMetricsRange(systemId, startDate, endDate) {
    return this.dailyMetrics.filter(m => {
      const metricDate = new Date(m.date);
      return m.systemId === systemId && metricDate >= new Date(startDate) && metricDate <= new Date(endDate);
    });
  }

  // Calculate water efficiency score (0-100)
  getEfficiencyScore(systemId) {
    const todayMetrics = this.getTodayMetrics(systemId);
    if (todayMetrics.length === 0) return 0;

    const latestMetric = todayMetrics[todayMetrics.length - 1];
    const efficiency = latestMetric.efficiency * 100;
    
    // Score based on efficiency and water quality
    let score = efficiency * 0.7; // 70% weight to recycling rate
    
    // Water quality bonus
    const tempScore = 100 - Math.abs(latestMetric.waterQuality.temperature - latestMetric.targetTemp) * 5;
    const phScore = 100 - Math.abs(latestMetric.waterQuality.pH - latestMetric.targetPH) * 10;
    const doScore = latestMetric.waterQuality.dissolvedOxygen > 6 ? 100 : 50;
    
    const qualityScore = (tempScore + phScore + doScore) / 3;
    score += qualityScore * 0.3; // 30% weight to water quality

    return Math.min(100, Math.round(score));
  }

  // Get daily recycling summary
  getDailySummary(systemId) {
    const todayMetrics = this.getTodayMetrics(systemId);
    if (todayMetrics.length === 0) return null;

    const metric = todayMetrics[todayMetrics.length - 1];
    const system = this.systems.find(s => s.id === systemId);

    return {
      systemId,
      systemName: system?.name,
      date: metric.date,
      totalInflow: metric.inflow,
      recycledWater: metric.recycled,
      freshWaterUsed: metric.freshWaterAdded,
      totalLosses: Object.values(metric.losses).reduce((a, b) => a + b, 0),
      recyclingPercentage: Math.round((metric.recycled / metric.inflow) * 100),
      waterQuality: metric.waterQuality,
      efficiency: this.getEfficiencyScore(systemId),
      recommendation: this.generateRecommendation(metric, system),
    };
  }

  // Generate actionable recommendation based on metrics
  generateRecommendation(metric, system) {
    const issues = [];
    const suggestions = [];

    // Temperature check
    if (Math.abs(metric.waterQuality.temperature - system.targetTemp) > 2) {
      issues.push(`Temperature deviation: ${metric.waterQuality.temperature}°C (target: ${system.targetTemp}°C)`);
      suggestions.push("Check heater/chiller and insulation around system");
    }

    // pH check
    if (Math.abs(metric.waterQuality.pH - system.targetPH) > 0.5) {
      issues.push(`pH out of range: ${metric.waterQuality.pH.toFixed(1)} (target: ${system.targetPH})`);
      suggestions.push("Test alkalinity, consider pH adjustment protocol");
    }

    // Dissolved oxygen
    if (metric.waterQuality.dissolvedOxygen < 6) {
      issues.push(`Low dissolved oxygen: ${metric.waterQuality.dissolvedOxygen.toFixed(1)} mg/L`);
      suggestions.push("Increase aeration, check air stone cleanliness, verify pump function");
    }

    // Ammonia
    if (metric.waterQuality.ammonia > 1) {
      issues.push(`Elevated ammonia: ${metric.waterQuality.ammonia.toFixed(1)} mg/L`);
      suggestions.push("Increase biofilter bed area, reduce feeding rates, perform partial water change");
    }

    // Evaporation losses
    const evaporationPercent = (metric.losses.evaporation / metric.inflow) * 100;
    if (evaporationPercent > 5) {
      suggestions.push("Evaporation losses are high - consider shade cloth or cover system");
    }

    // Recycling efficiency
    if (metric.efficiency < 0.85) {
      suggestions.push("Recycling efficiency below target - check filtration system");
    }

    return {
      status: issues.length === 0 ? "normal" : issues.length <= 1 ? "caution" : "alert",
      issues,
      suggestions,
      priority: issues.length > 2 ? "high" : issues.length > 0 ? "medium" : "low",
    };
  }

  // Get all systems
  getAllSystems() {
    return this.systems;
  }

  // Calculate regional water requirements using GlobalGrowingScheduleService
  getRegionalWaterNeeds(climateZone, crops = []) {
    if (!this.globalSchedule) {
      sofieCore.getService("logger").warn("[WaterRecyclingService] GlobalGrowingScheduleService not available");
      return null;
    }

    const systemVolume = 10000; // Standard system
    let totalNeeds = {
      freshWater: 0,
      recycledWater: 0,
      dailyNeeded: 0,
      annualNeeded: 0,
    };

    crops.forEach(crop => {
      const requirements = this.globalSchedule.calculateWaterRequirements(crop, climateZone, systemVolume);
      if (requirements) {
        totalNeeds.freshWater += requirements.freshWaterNeeded;
        totalNeeds.recycledWater += requirements.recycledWater;
        totalNeeds.dailyNeeded += requirements.dailyNeeded;
        totalNeeds.annualNeeded += requirements.annualNeeded;
      }
    });

    return totalNeeds;
  }

  // Get annual water recycling statistics
  getAnnualStats() {
    const allMetrics = this.recyclingHistory;
    if (allMetrics.length === 0) return null;

    const totalRecycled = allMetrics.reduce((sum, m) => sum + m.recycled, 0);
    const totalFresh = allMetrics.reduce((sum, m) => sum + m.freshWaterAdded, 0);
    const avgEfficiency = allMetrics.reduce((sum, m) => sum + m.efficiency, 0) / allMetrics.length;
    const totalLosses = allMetrics.reduce((sum, m) => sum + Object.values(m.losses).reduce((a, b) => a + b, 0), 0);

    return {
      totalWaterProcessed: totalRecycled + totalFresh,
      totalRecycled,
      totalFreshWaterUsed: totalFresh,
      totalLosses,
      averageEfficiency: Math.round(avgEfficiency * 100),
      recyclingPercentage: Math.round((totalRecycled / (totalRecycled + totalFresh)) * 100),
      freshWaterSavings: totalFresh, // Water that would have been needed if not recycling
      dataPoints: allMetrics.length,
    };
  }

  // Get water quality trends
  getQualityTrends(systemId, days = 30) {
    const recentMetrics = this.dailyMetrics
      .filter(m => m.systemId === systemId)
      .slice(-days);

    if (recentMetrics.length === 0) return null;

    return {
      systemId,
      period: `Last ${days} days`,
      temperature: {
        avg: (recentMetrics.reduce((sum, m) => sum + m.waterQuality.temperature, 0) / recentMetrics.length).toFixed(1),
        min: Math.min(...recentMetrics.map(m => m.waterQuality.temperature)).toFixed(1),
        max: Math.max(...recentMetrics.map(m => m.waterQuality.temperature)).toFixed(1),
      },
      pH: {
        avg: (recentMetrics.reduce((sum, m) => sum + m.waterQuality.pH, 0) / recentMetrics.length).toFixed(2),
        min: Math.min(...recentMetrics.map(m => m.waterQuality.pH)).toFixed(2),
        max: Math.max(...recentMetrics.map(m => m.waterQuality.pH)).toFixed(2),
      },
      dissolvedOxygen: {
        avg: (recentMetrics.reduce((sum, m) => sum + m.waterQuality.dissolvedOxygen, 0) / recentMetrics.length).toFixed(1),
        min: Math.min(...recentMetrics.map(m => m.waterQuality.dissolvedOxygen)).toFixed(1),
        max: Math.max(...recentMetrics.map(m => m.waterQuality.dissolvedOxygen)).toFixed(1),
      },
      ammonia: {
        avg: (recentMetrics.reduce((sum, m) => sum + m.waterQuality.ammonia, 0) / recentMetrics.length).toFixed(2),
        max: Math.max(...recentMetrics.map(m => m.waterQuality.ammonia)).toFixed(2),
      },
    };
  }

  // Log a system maintenance event
  logMaintenance(systemId, task, notes) {
    const event = {
      id: Date.now(),
      systemId,
      task,
      notes,
      timestamp: new Date().toISOString(),
      performedBy: "system",
      status: "completed",
    };

    sofieCore.getService("logger").info("[WaterRecyclingService] Maintenance logged", { systemId, task });
    return event;
  }

  // Alert if quality metrics fall outside acceptable range
  checkHealthStatus(systemId) {
    const todayMetrics = this.getTodayMetrics(systemId);
    if (todayMetrics.length === 0) return null;

    const metric = todayMetrics[todayMetrics.length - 1];
    const alerts = [];

    // Define acceptable ranges
    const ranges = {
      temperature: { min: 24, max: 28 },
      pH: { min: 6.5, max: 7.2 },
      dissolvedOxygen: { min: 6, max: 8 },
      ammonia: { max: 1 },
      nitrite: { max: 0.1 },
      nitrate: { max: 300 },
    };

    if (metric.waterQuality.temperature < ranges.temperature.min || 
        metric.waterQuality.temperature > ranges.temperature.max) {
      alerts.push("⚠️ Temperature outside acceptable range");
    }

    if (metric.waterQuality.pH < ranges.pH.min || 
        metric.waterQuality.pH > ranges.pH.max) {
      alerts.push("⚠️ pH outside acceptable range");
    }

    if (metric.waterQuality.dissolvedOxygen < ranges.dissolvedOxygen.min) {
      alerts.push("🚨 CRITICAL: Dissolved oxygen critically low");
    }

    if (metric.waterQuality.ammonia > ranges.ammonia.max) {
      alerts.push("⚠️ Ammonia levels elevated");
    }

    return {
      systemId,
      healthy: alerts.length === 0,
      alerts,
      lastCheck: metric.timestamp,
    };
  }

  /**
   * Get current water quality metrics (for AutopilotService)
   */
  getCurrentMetrics() {
    // Get latest metrics from primary system
    if (this.dailyMetrics.length > 0) {
      const latest = this.dailyMetrics[this.dailyMetrics.length - 1];
      if (latest.waterQuality) {
        this.currentMetrics = latest.waterQuality;
      }
    }
    return this.currentMetrics;
  }

  /**
   * Get current recycling efficiency percentage (for AutopilotService)
   */
  getRecyclingEfficiency() {
    if (this.systems.length === 0) return 85; // Default
    
    // Calculate weighted average efficiency across all systems
    const totalVolume = this.systems.reduce((sum, sys) => sum + sys.volume, 0);
    const weightedEfficiency = this.systems.reduce((sum, sys) => {
      const weight = sys.volume / totalVolume;
      return sum + (sys.recyclingRate * 100 * weight);
    }, 0);
    
    return Math.round(weightedEfficiency);
  }
}

export default WaterRecyclingService;
