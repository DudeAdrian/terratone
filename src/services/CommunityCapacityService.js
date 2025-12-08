// src/services/CommunityCapacityService.js

/**
 * Community Capacity Service
 * Measures and tracks community operating capacity across all systems
 * Provides comprehensive metrics for sustainable community operations
 */

class CommunityCapacityService {
  constructor() {
    this.name = "CommunityCapacity";
    
    // Core capacity metrics
    this.capacityMetrics = {
      population: {
        current: 450,
        capacity: 500,
        utilization: 90,
        growth: "+12% YoY"
      },
      housing: {
        units: 120,
        occupied: 95,
        available: 25,
        utilization: 79,
        avgEfficiency: "A+ Rating"
      },
      energy: {
        dailyProduction: 850, // kWh
        dailyConsumption: 680,
        batteryCapacity: 2400,
        currentStorage: 1920,
        utilization: 80,
        renewablePercent: 98
      },
      water: {
        dailyCapacity: 50000, // Liters
        dailyUsage: 38000,
        rainwaterHarvested: 15000,
        recycledWater: 12000,
        utilization: 76,
        efficiency: 92
      },
      food: {
        dailyProduction: 180, // kg
        dailyConsumption: 150,
        surplusForTrade: 30,
        selfSufficiency: 85, // percentage
        aquaponicsSystems: 3,
        gardenPlots: 45,
        greenhouseArea: 2400 // sqm
      },
      infrastructure: {
        roads: { condition: "excellent", coverage: "100%" },
        internet: { speed: "1Gbps", uptime: "99.8%" },
        healthcare: { clinics: 2, beds: 20, staffed: 18 },
        education: { schools: 1, students: 85, teachers: 8 },
        communitySpaces: { count: 6, utilization: 68 }
      },
      economic: {
        monthlyLocalTrade: 45000, // USD equivalent
        jobsAvailable: 230,
        jobsFilled: 215,
        employmentRate: 93,
        averageIncome: 3200,
        sharedEconomy: 38 // percentage
      },
      governance: {
        activeMembers: 340,
        participationRate: 76,
        proposalsThisMonth: 8,
        votesThisMonth: 6,
        consensusRate: 94
      },
      resilience: {
        foodReserve: 45, // days
        waterReserve: 30,
        energyReserve: 15,
        medicalSupplies: 60,
        emergencyReadiness: 88
      },
      sustainability: {
        carbonNeutral: true,
        wasteRecycling: 89,
        composting: 95,
        biodiversityIndex: 82,
        greenSpaceCoverage: 45
      }
    };

    // Operating system health indicators
    this.systemHealth = {
      overall: 87,
      categories: {
        infrastructure: 92,
        resources: 85,
        social: 88,
        environmental: 90,
        economic: 84
      }
    };

    // Capacity planning projections
    this.projections = {
      nextQuarter: {
        population: 475,
        energyNeeds: 720,
        foodProduction: 195,
        housingNeeds: 105
      },
      nextYear: {
        population: 550,
        energyNeeds: 850,
        foodProduction: 220,
        housingNeeds: 135
      }
    };

    // Benchmarks against other communities
    this.benchmarks = {
      energyEfficiency: { rank: 3, outOf: 50, percentile: 94 },
      foodSelfSufficiency: { rank: 7, outOf: 50, percentile: 86 },
      waterConservation: { rank: 2, outOf: 50, percentile: 96 },
      communityEngagement: { rank: 5, outOf: 50, percentile: 90 },
      carbonNeutrality: { rank: 1, outOf: 50, percentile: 98 }
    };
  }

  /**
   * Initialize the service
   */
  init(core) {
    this.core = core;
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    
    // Load saved capacity data
    const savedData = this.storage?.load("community_capacity");
    if (savedData) {
      this.capacityMetrics = savedData;
    }
    
    this.logger?.info("CommunityCapacityService initialized");
  }

  /**
   * Get overall capacity metrics
   */
  getCapacityMetrics() {
    return this.capacityMetrics;
  }

  /**
   * Get specific capacity category
   */
  getCapacityCategory(category) {
    return this.capacityMetrics[category] || null;
  }

  /**
   * Get system health score
   */
  getSystemHealth() {
    return this.systemHealth;
  }

  /**
   * Calculate overall capacity utilization
   */
  getOverallUtilization() {
    const utilizationMetrics = {
      population: this.capacityMetrics.population.utilization,
      housing: this.capacityMetrics.housing.utilization,
      energy: this.capacityMetrics.energy.utilization,
      water: this.capacityMetrics.water.utilization,
      food: this.capacityMetrics.food.selfSufficiency
    };

    const average = Object.values(utilizationMetrics).reduce((a, b) => a + b, 0) / Object.keys(utilizationMetrics).length;
    
    return {
      overall: Math.round(average),
      breakdown: utilizationMetrics,
      status: average > 85 ? "optimal" : average > 70 ? "good" : average > 50 ? "adequate" : "needs attention"
    };
  }

  /**
   * Get capacity projections
   */
  getProjections() {
    return this.projections;
  }

  /**
   * Get benchmark comparisons
   */
  getBenchmarks() {
    return this.benchmarks;
  }

  /**
   * Update population metrics
   */
  updatePopulation(current, capacity) {
    this.capacityMetrics.population.current = current;
    this.capacityMetrics.population.capacity = capacity;
    this.capacityMetrics.population.utilization = Math.round((current / capacity) * 100);
    
    this.saveMetrics();
    this.recalculateSystemHealth();
    
    return this.capacityMetrics.population;
  }

  /**
   * Update energy capacity
   */
  updateEnergyCapacity(production, consumption, storage) {
    this.capacityMetrics.energy.dailyProduction = production;
    this.capacityMetrics.energy.dailyConsumption = consumption;
    this.capacityMetrics.energy.currentStorage = storage;
    this.capacityMetrics.energy.utilization = Math.round((consumption / production) * 100);
    
    this.saveMetrics();
    this.recalculateSystemHealth();
    
    return this.capacityMetrics.energy;
  }

  /**
   * Update food production capacity
   */
  updateFoodCapacity(production, consumption, aquaponicsSystems) {
    this.capacityMetrics.food.dailyProduction = production;
    this.capacityMetrics.food.dailyConsumption = consumption;
    this.capacityMetrics.food.surplusForTrade = production - consumption;
    this.capacityMetrics.food.selfSufficiency = Math.min(100, Math.round((production / consumption) * 100));
    
    if (aquaponicsSystems !== undefined) {
      this.capacityMetrics.food.aquaponicsSystems = aquaponicsSystems;
    }
    
    this.saveMetrics();
    this.recalculateSystemHealth();
    
    return this.capacityMetrics.food;
  }

  /**
   * Update water capacity
   */
  updateWaterCapacity(dailyUsage, harvested, recycled) {
    this.capacityMetrics.water.dailyUsage = dailyUsage;
    this.capacityMetrics.water.rainwaterHarvested = harvested;
    this.capacityMetrics.water.recycledWater = recycled;
    this.capacityMetrics.water.utilization = Math.round((dailyUsage / this.capacityMetrics.water.dailyCapacity) * 100);
    
    const totalSustainableWater = harvested + recycled;
    this.capacityMetrics.water.efficiency = Math.round((totalSustainableWater / dailyUsage) * 100);
    
    this.saveMetrics();
    this.recalculateSystemHealth();
    
    return this.capacityMetrics.water;
  }

  /**
   * Update governance participation
   */
  updateGovernanceMetrics(activeMembers, proposals, votes) {
    this.capacityMetrics.governance.activeMembers = activeMembers;
    this.capacityMetrics.governance.proposalsThisMonth = proposals;
    this.capacityMetrics.governance.votesThisMonth = votes;
    this.capacityMetrics.governance.participationRate = Math.round(
      (activeMembers / this.capacityMetrics.population.current) * 100
    );
    
    this.saveMetrics();
    this.recalculateSystemHealth();
    
    return this.capacityMetrics.governance;
  }

  /**
   * Recalculate overall system health
   */
  recalculateSystemHealth() {
    // Infrastructure health (housing, roads, utilities)
    const infrastructure = (
      (this.capacityMetrics.housing.utilization < 90 ? 95 : 75) +
      100 + // roads excellent
      (parseFloat(this.capacityMetrics.infrastructure.internet.uptime) * 100)
    ) / 3;

    // Resources health (energy, water, food)
    const resources = (
      (this.capacityMetrics.energy.renewablePercent) +
      (this.capacityMetrics.water.efficiency) +
      (this.capacityMetrics.food.selfSufficiency)
    ) / 3;

    // Social health (governance, employment, education)
    const social = (
      (this.capacityMetrics.governance.participationRate) +
      (this.capacityMetrics.economic.employmentRate) +
      90 // education quality score
    ) / 3;

    // Environmental health (sustainability metrics)
    const environmental = (
      (this.capacityMetrics.sustainability.wasteRecycling) +
      (this.capacityMetrics.sustainability.biodiversityIndex) +
      (this.capacityMetrics.sustainability.composting)
    ) / 3;

    // Economic health
    const economic = (
      (this.capacityMetrics.economic.employmentRate) +
      85 + // economic diversity
      80   // trade balance
    ) / 3;

    this.systemHealth.categories = {
      infrastructure: Math.round(infrastructure),
      resources: Math.round(resources),
      social: Math.round(social),
      environmental: Math.round(environmental),
      economic: Math.round(economic)
    };

    this.systemHealth.overall = Math.round(
      (infrastructure + resources + social + environmental + economic) / 5
    );
  }

  /**
   * Get capacity alerts and recommendations
   */
  getCapacityAlerts() {
    const alerts = [];

    // Check population vs housing
    if (this.capacityMetrics.housing.utilization > 85) {
      alerts.push({
        level: "warning",
        category: "housing",
        message: "Housing utilization above 85% - plan for expansion",
        recommendation: "Initiate construction of 20 new housing units"
      });
    }

    // Check energy reserves
    const energyReserve = (this.capacityMetrics.energy.currentStorage / this.capacityMetrics.energy.batteryCapacity) * 100;
    if (energyReserve < 50) {
      alerts.push({
        level: "warning",
        category: "energy",
        message: "Battery storage below 50%",
        recommendation: "Reduce non-essential energy consumption or increase production"
      });
    }

    // Check food self-sufficiency
    if (this.capacityMetrics.food.selfSufficiency < 80) {
      alerts.push({
        level: "info",
        category: "food",
        message: "Food self-sufficiency below target of 80%",
        recommendation: "Expand garden plots or add aquaponics system"
      });
    }

    // Check governance participation
    if (this.capacityMetrics.governance.participationRate < 70) {
      alerts.push({
        level: "warning",
        category: "governance",
        message: "Community participation below 70%",
        recommendation: "Organize community events to boost engagement"
      });
    }

    // Check resilience reserves
    if (this.capacityMetrics.resilience.foodReserve < 30) {
      alerts.push({
        level: "critical",
        category: "resilience",
        message: "Food reserves below 30-day minimum",
        recommendation: "Increase food preservation and storage"
      });
    }

    return alerts;
  }

  /**
   * Get capacity expansion recommendations
   */
  getExpansionRecommendations() {
    const recommendations = [];

    // Analyze each category
    if (this.capacityMetrics.population.utilization > 80) {
      recommendations.push({
        priority: "high",
        category: "infrastructure",
        action: "Expand housing capacity by 50 units",
        estimatedCost: "$2.5M",
        timeline: "12 months",
        impact: "Support 20% population growth"
      });
    }

    if (this.capacityMetrics.food.selfSufficiency < 90) {
      recommendations.push({
        priority: "medium",
        category: "food production",
        action: "Add 2 more aquaponics systems",
        estimatedCost: "$80K",
        timeline: "6 months",
        impact: "Increase food production by 30kg/day"
      });
    }

    if (this.capacityMetrics.energy.renewablePercent < 100) {
      recommendations.push({
        priority: "medium",
        category: "energy",
        action: "Install additional solar panels (200kW)",
        estimatedCost: "$400K",
        timeline: "4 months",
        impact: "Achieve 100% renewable energy"
      });
    }

    return recommendations;
  }

  /**
   * Export comprehensive capacity report
   */
  exportCapacityReport() {
    return {
      generatedAt: new Date().toISOString(),
      community: "Sofie Systems - Harmonic Habitats OS",
      metrics: this.capacityMetrics,
      systemHealth: this.systemHealth,
      utilization: this.getOverallUtilization(),
      projections: this.projections,
      benchmarks: this.benchmarks,
      alerts: this.getCapacityAlerts(),
      recommendations: this.getExpansionRecommendations()
    };
  }

  /**
   * Save metrics to storage
   */
  saveMetrics() {
    this.storage?.save("community_capacity", this.capacityMetrics);
  }
}

export default CommunityCapacityService;
