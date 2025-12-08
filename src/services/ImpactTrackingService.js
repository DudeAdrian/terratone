// src/services/ImpactTrackingService.js

/**
 * Impact Tracking Service
 * Aggregates sustainability metrics from all services
 * Calculates carbon footprint, water savings, biodiversity impact
 */

import LoggerService from "./LoggerService";
import eventBus from "../core/EventBus";

class ImpactTrackingService {
  constructor() {
    this.name = "ImpactTracking";
    this.sofieCore = null;
    this.impactHistory = [];
    this.baseline = null; // Baseline metrics for comparison
    this.currentImpact = {
      carbonFootprint: 0,
      waterSaved: 0,
      energyProduced: 0,
      foodProduced: 0,
      biodiversityScore: 0,
      wasteReduced: 0,
      lastUpdated: null
    };
  }

  initialize(sofieCore) {
    if (!sofieCore) {
      LoggerService.error("ImpactTrackingService requires sofieCore");
      return;
    }

    this.sofieCore = sofieCore;
    this.setBaseline();
    this.subscribeToEvents();
    
    // Delay initial calculation to ensure all services are initialized
    setTimeout(() => {
      try {
        this.calculateCurrentImpact();
      } catch (error) {
        LoggerService.error("Error calculating initial impact:", error);
      }
    }, 100);
    
    // Update impact every hour
    setInterval(() => {
      try {
        this.calculateCurrentImpact();
      } catch (error) {
        LoggerService.error("Error calculating impact:", error);
      }
    }, 60 * 60 * 1000);
    
    LoggerService.log("ImpactTrackingService initialized");
  }

  setBaseline() {
    // Baseline represents conventional community of same size
    const community = this.sofieCore.services.community;
    const population = community?.getProfile?.()?.population || 100;

    this.baseline = {
      carbonPerPerson: 16000, // kg CO2/year (US average)
      waterPerPerson: 375, // liters/day
      energyPerPerson: 30, // kWh/day
      foodPerPerson: 1, // kg/day
      wastePerPerson: 2, // kg/day
      population
    };
  }

  subscribeToEvents() {
    eventBus.on("ENERGY_PRODUCED", (data) => this.recordEvent("energy", data));
    eventBus.on("WATER_QUALITY_CHANGED", (data) => this.recordEvent("water", data));
    eventBus.on("HARVEST_COMPLETED", (data) => this.recordEvent("food", data));
    eventBus.on("WASTE_PROCESSED", (data) => this.recordEvent("waste", data));
  }

  recordEvent(category, data) {
    this.impactHistory.push({
      category,
      data,
      timestamp: new Date().toISOString()
    });

    // Keep only last 10,000 events
    if (this.impactHistory.length > 10000) {
      this.impactHistory.shift();
    }

    // Recalculate impact
    this.calculateCurrentImpact();
  }

  calculateCurrentImpact() {
    const energy = this.calculateEnergyImpact();
    const water = this.calculateWaterImpact();
    const food = this.calculateFoodImpact();
    const carbon = this.calculateCarbonFootprint();
    const biodiversity = this.calculateBiodiversityScore();
    const waste = this.calculateWasteReduction();

    this.currentImpact = {
      carbonFootprint: carbon,
      carbonSaved: this.getAnnualBaseline().carbon - carbon,
      waterSaved: water.saved,
      waterEfficiency: water.efficiency,
      energyProduced: energy.produced,
      energySelfSufficiency: energy.selfSufficiency,
      foodProduced: food.produced,
      foodSelfSufficiency: food.selfSufficiency,
      biodiversityScore: biodiversity,
      wasteReduced: waste.reduced,
      wasteRecyclingRate: waste.recyclingRate,
      lastUpdated: new Date().toISOString()
    };

    eventBus.emit("IMPACT_UPDATED", this.currentImpact);

    return this.currentImpact;
  }

  calculateEnergyImpact() {
    const energy = this.sofieCore.services.energy;
    
    const produced = energy?.getCurrentProduction() || 0;
    const consumption = energy?.getCurrentConsumption() || 0;
    const selfSufficiency = consumption > 0 ? (produced / consumption) * 100 : 0;

    return {
      produced,
      consumption,
      selfSufficiency: Math.min(100, Math.round(selfSufficiency))
    };
  }

  calculateWaterImpact() {
    const water = this.sofieCore.services.water;
    const waterRecycling = this.sofieCore.services.waterRecycling;
    
    const storage = water?.getStorageLevel() || 0;
    const recycled = waterRecycling?.getTotalRecycled?.() || 0;
    
    const dailyBaseline = this.baseline.waterPerPerson * this.baseline.population;
    const saved = recycled > 0 ? recycled : dailyBaseline * 0.3; // Assume 30% savings minimum
    const efficiency = (saved / dailyBaseline) * 100;

    return {
      storage,
      recycled,
      saved: Math.round(saved),
      efficiency: Math.round(efficiency)
    };
  }

  calculateFoodImpact() {
    const food = this.sofieCore.services.food;
    const harvest = this.sofieCore.services.harvestForecast;
    
    const inventory = food?.getInventoryLevel?.() || 0;
    const predicted = harvest?.getAnnualYield?.() || 0;
    
    const annualBaseline = this.baseline.foodPerPerson * this.baseline.population * 365;
    const produced = predicted > 0 ? predicted : inventory;
    const selfSufficiency = (produced / annualBaseline) * 100;

    return {
      inventory,
      produced: Math.round(produced),
      selfSufficiency: Math.min(100, Math.round(selfSufficiency))
    };
  }

  calculateCarbonFootprint() {
    const energy = this.sofieCore.services.energy;
    const globalNetwork = this.sofieCore.services.globalNetwork;
    
    // Calculate carbon from energy (renewable = near zero)
    const energySelfSufficiency = energy?.getSelfSufficiency?.() || 0;
    const baselineCarbon = this.getAnnualBaseline().carbon;
    
    // High renewable energy = low carbon
    const energyCarbon = baselineCarbon * (1 - energySelfSufficiency / 100) * 0.3;
    
    // Calculate carbon from trade transport
    const tradeStats = globalNetwork?.getTradeStats?.() || {};
    const tradeCarbon = tradeStats.totalCarbonCost || 0;
    
    // Calculate carbon from food (local = low, imported = high)
    const foodSelfSufficiency = this.calculateFoodImpact().selfSufficiency;
    const foodCarbon = baselineCarbon * (1 - foodSelfSufficiency / 100) * 0.25;
    
    // Total carbon per year (kg CO2)
    const total = energyCarbon + tradeCarbon + foodCarbon;
    
    return Math.round(total);
  }

  calculateBiodiversityScore() {
    const aquaticLife = this.sofieCore.services.aquaticLife;
    const pestManagement = this.sofieCore.services.pestManagement;
    
    // Count aquatic species diversity
    const aquaticSpecies = aquaticLife?.database ? 
      Object.values(aquaticLife.database).reduce((sum, category) => 
        sum + (typeof category === 'object' ? Object.keys(category).length : 0), 0
      ) : 0;
    
    // Check integrated pest management practices
    const ipmScore = pestManagement?.getIPMScore?.() || 50;
    
    // Biodiversity score (0-100)
    // Higher score = more species diversity + sustainable practices
    const speciesScore = Math.min(50, aquaticSpecies * 2);
    const practicesScore = ipmScore / 2;
    
    return Math.round(speciesScore + practicesScore);
  }

  calculateWasteReduction() {
    const composting = this.sofieCore.services.composting;
    const waterRecycling = this.sofieCore.services.waterRecycling;
    
    const compostTotal = composting?.getTotalComposted?.() || 0;
    const waterRecycled = waterRecycling?.getTotalRecycled?.() || 0;
    
    const dailyBaseline = this.baseline.wastePerPerson * this.baseline.population;
    const annualBaseline = dailyBaseline * 365;
    
    const reduced = compostTotal + (waterRecycled * 0.001); // Convert liters to kg
    const recyclingRate = (reduced / annualBaseline) * 100;

    return {
      reduced: Math.round(reduced),
      recyclingRate: Math.min(100, Math.round(recyclingRate))
    };
  }

  getAnnualBaseline() {
    return {
      carbon: this.baseline.carbonPerPerson * this.baseline.population,
      water: this.baseline.waterPerPerson * this.baseline.population * 365,
      energy: this.baseline.energyPerPerson * this.baseline.population * 365,
      food: this.baseline.foodPerPerson * this.baseline.population * 365,
      waste: this.baseline.wastePerPerson * this.baseline.population * 365
    };
  }

  getCurrentImpact() {
    return this.currentImpact;
  }

  getImpactSummary() {
    const baseline = this.getAnnualBaseline();
    const current = this.currentImpact;

    return {
      carbonReduction: {
        current: current.carbonFootprint,
        baseline: baseline.carbon,
        percentReduced: Math.round((1 - current.carbonFootprint / baseline.carbon) * 100),
        saved: current.carbonSaved
      },
      waterConservation: {
        saved: current.waterSaved,
        baseline: baseline.water,
        efficiency: current.waterEfficiency
      },
      energyIndependence: {
        produced: current.energyProduced,
        selfSufficiency: current.energySelfSufficiency
      },
      foodSovereignty: {
        produced: current.foodProduced,
        selfSufficiency: current.foodSelfSufficiency
      },
      biodiversity: {
        score: current.biodiversityScore,
        rating: this.getBiodiversityRating(current.biodiversityScore)
      },
      wasteManagement: {
        reduced: current.wasteReduced,
        recyclingRate: current.wasteRecyclingRate
      },
      overallScore: this.calculateOverallScore()
    };
  }

  getBiodiversityRating(score) {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  }

  calculateOverallScore() {
    const c = this.currentImpact;
    const baseline = this.getAnnualBaseline();
    
    // Weighted average of all metrics
    const carbonScore = (1 - c.carbonFootprint / baseline.carbon) * 100;
    const waterScore = c.waterEfficiency;
    const energyScore = c.energySelfSufficiency;
    const foodScore = c.foodSelfSufficiency;
    const biodiversityScore = c.biodiversityScore;
    const wasteScore = c.wasteRecyclingRate;
    
    const weights = {
      carbon: 0.25,
      water: 0.15,
      energy: 0.20,
      food: 0.20,
      biodiversity: 0.10,
      waste: 0.10
    };
    
    const overall = 
      carbonScore * weights.carbon +
      waterScore * weights.water +
      energyScore * weights.energy +
      foodScore * weights.food +
      biodiversityScore * weights.biodiversity +
      wasteScore * weights.waste;
    
    return Math.round(Math.max(0, Math.min(100, overall)));
  }

  getHistoricalTrends(days = 30) {
    // Aggregate impact data over time
    const now = Date.now();
    const cutoff = now - (days * 24 * 60 * 60 * 1000);
    
    const recentEvents = this.impactHistory.filter(e => 
      new Date(e.timestamp).getTime() > cutoff
    );

    const trends = {
      energy: [],
      water: [],
      food: [],
      carbon: []
    };

    // Group by day
    const dayGroups = {};
    recentEvents.forEach(event => {
      const day = new Date(event.timestamp).toLocaleDateString();
      if (!dayGroups[day]) dayGroups[day] = [];
      dayGroups[day].push(event);
    });

    return {
      trends,
      totalEvents: recentEvents.length,
      categories: this.getEventCategoryCounts(recentEvents)
    };
  }

  getEventCategoryCounts(events) {
    const counts = {};
    events.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }

  exportImpactReport() {
    return {
      generatedAt: new Date().toISOString(),
      community: this.sofieCore.services.community?.getProfile?.() || {},
      baseline: this.baseline,
      currentImpact: this.currentImpact,
      summary: this.getImpactSummary(),
      overallScore: this.calculateOverallScore()
    };
  }
}

export default ImpactTrackingService;
