// src/plugins/AquaponicsPlugin.js

/**
 * Aquaponics Management Plugin
 * Monitors and manages integrated aquaponics systems combining fish farming with hydroponics
 * Tracks water quality, fish health, plant growth, and system balance
 */

class AquaponicsPlugin {
  constructor() {
    this.name = "Aquaponics Manager";
    this.id = "aquaponics";
    this.version = "1.0.0";
    this.description = "Monitor and optimize aquaponics systems with real-time water quality, fish health, and plant growth tracking";
    this.icon = "🐟";
    this.author = "Sofie Systems";
    this.category = "Food Production";
    
    this.systems = [
      {
        id: "sys-001",
        name: "Community Greenhouse System",
        type: "Media Bed",
        status: "optimal",
        capacity: "500L",
        fishType: "Tilapia",
        fishCount: 45,
        plantBeds: 6,
        waterTemp: 24.5,
        ph: 7.2,
        ammonia: 0.25,
        nitrite: 0.1,
        nitrate: 40,
        dissolvedOxygen: 7.5,
        lastFed: "2 hours ago",
        harvestReady: ["Lettuce Bed 3", "Basil Bed 1"],
        alerts: []
      },
      {
        id: "sys-002",
        name: "School Education System",
        type: "NFT (Nutrient Film Technique)",
        status: "warning",
        capacity: "200L",
        fishType: "Goldfish",
        fishCount: 20,
        plantBeds: 3,
        waterTemp: 22.0,
        ph: 6.8,
        ammonia: 0.5,
        nitrite: 0.3,
        nitrate: 35,
        dissolvedOxygen: 6.8,
        lastFed: "5 hours ago",
        harvestReady: ["Herbs Bed 2"],
        alerts: ["High ammonia - reduce feeding", "Low temperature - check heater"]
      },
      {
        id: "sys-003",
        name: "Rooftop Production System",
        type: "Deep Water Culture",
        status: "optimal",
        capacity: "1000L",
        fishType: "Koi & Tilapia",
        fishCount: 80,
        plantBeds: 12,
        waterTemp: 25.0,
        ph: 7.0,
        ammonia: 0.15,
        nitrite: 0.05,
        nitrate: 45,
        dissolvedOxygen: 8.0,
        lastFed: "1 hour ago",
        harvestReady: ["Tomatoes Bed 5", "Cucumbers Bed 8", "Peppers Bed 10"],
        alerts: []
      }
    ];

    this.productionMetrics = {
      weeklyFishGrowth: "2.3 kg",
      weeklyVegetableYield: "18.5 kg",
      waterEfficiency: "95%",
      feedConversionRatio: 1.2,
      systemUptime: "99.2%",
      co2Offset: "45 kg/month"
    };

    this.communityImpact = {
      householdsServed: 12,
      jobsCreated: 3,
      educationPrograms: 2,
      annualProduction: "960 kg vegetables, 120 kg fish",
      waterSaved: "85% vs traditional farming"
    };
  }

  /**
   * Plugin lifecycle method - called when plugin is installed
   */
  async onInstall(core) {
    console.log(`[${this.name}] Installing aquaponics monitoring system...`);
    
    // Initialize aquaponics service
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    this.api = core.getService("api");
    
    // Load saved data
    const savedData = this.storage.load("aquaponics_systems");
    if (savedData) {
      this.systems = savedData;
    }
    
    this.logger.info(`${this.name} installed successfully`);
  }

  /**
   * Plugin lifecycle method - called when plugin is activated
   */
  async onActivate(core) {
    console.log(`[${this.name}] Activating aquaponics systems monitoring...`);
    
    // Start monitoring intervals
    this.monitoringInterval = setInterval(() => {
      this.checkSystemHealth();
    }, 60000); // Check every minute
    
    // Subscribe to water quality alerts
    core.on("water_quality_alert", (data) => {
      this.handleWaterQualityAlert(data);
    });
    
    this.logger.info(`${this.name} activated - monitoring ${this.systems.length} systems`);
  }

  /**
   * Plugin lifecycle method - called when plugin is deactivated
   */
  async onDeactivate(core) {
    console.log(`[${this.name}] Deactivating aquaponics monitoring...`);
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Save current state
    this.storage.save("aquaponics_systems", this.systems);
    
    this.logger.info(`${this.name} deactivated`);
  }

  /**
   * Get all aquaponics systems
   */
  getSystems() {
    return this.systems;
  }

  /**
   * Get system by ID
   */
  getSystem(systemId) {
    return this.systems.find(s => s.id === systemId);
  }

  /**
   * Get production metrics
   */
  getProductionMetrics() {
    return this.productionMetrics;
  }

  /**
   * Get community impact data
   */
  getCommunityImpact() {
    return this.communityImpact;
  }

  /**
   * Update water quality parameters
   */
  updateWaterQuality(systemId, parameters) {
    const system = this.getSystem(systemId);
    if (!system) return { success: false, error: "System not found" };

    Object.assign(system, parameters);
    
    // Check for alerts
    this.checkWaterQuality(system);
    
    // Save changes
    this.storage.save("aquaponics_systems", this.systems);
    
    return { success: true, system };
  }

  /**
   * Feed fish in system
   */
  feedFish(systemId, amount) {
    const system = this.getSystem(systemId);
    if (!system) return { success: false, error: "System not found" };

    system.lastFed = "Just now";
    
    this.logger.info(`Fed ${amount}g to ${system.name}`);
    this.storage.save("aquaponics_systems", this.systems);
    
    return { success: true, message: `Fed ${amount}g to ${system.fishCount} ${system.fishType}` };
  }

  /**
   * Harvest plants from system
   */
  harvestPlants(systemId, bedName, amount) {
    const system = this.getSystem(systemId);
    if (!system) return { success: false, error: "System not found" };

    system.harvestReady = system.harvestReady.filter(b => b !== bedName);
    
    this.logger.info(`Harvested ${amount}kg from ${bedName} in ${system.name}`);
    
    // Update production metrics
    const currentYield = parseFloat(this.productionMetrics.weeklyVegetableYield);
    this.productionMetrics.weeklyVegetableYield = `${(currentYield + amount).toFixed(1)} kg`;
    
    this.storage.save("aquaponics_systems", this.systems);
    
    return { success: true, message: `Harvested ${amount}kg from ${bedName}` };
  }

  /**
   * Check water quality and generate alerts
   */
  checkWaterQuality(system) {
    system.alerts = [];

    // pH range should be 6.8-7.2
    if (system.ph < 6.5 || system.ph > 7.5) {
      system.alerts.push(`pH ${system.ph < 6.5 ? 'too low' : 'too high'} - adjust to 6.8-7.2 range`);
      system.status = "warning";
    }

    // Ammonia should be < 0.5 ppm
    if (system.ammonia > 0.5) {
      system.alerts.push("High ammonia - reduce feeding or increase biofiltration");
      system.status = "warning";
    }

    // Nitrite should be < 0.5 ppm
    if (system.nitrite > 0.5) {
      system.alerts.push("High nitrite - check biofilter bacteria");
      system.status = "warning";
    }

    // Dissolved oxygen should be > 5 mg/L
    if (system.dissolvedOxygen < 5) {
      system.alerts.push("Low dissolved oxygen - increase aeration");
      system.status = "critical";
    }

    // Water temperature (ideal 22-26°C for tilapia)
    if (system.waterTemp < 20 || system.waterTemp > 28) {
      system.alerts.push(`Water temperature ${system.waterTemp < 20 ? 'too low' : 'too high'}`);
      system.status = "warning";
    }

    if (system.alerts.length === 0) {
      system.status = "optimal";
    }
  }

  /**
   * Check all system health
   */
  checkSystemHealth() {
    this.systems.forEach(system => {
      this.checkWaterQuality(system);
      
      // Simulate minor fluctuations
      system.waterTemp += (Math.random() - 0.5) * 0.2;
      system.ph += (Math.random() - 0.5) * 0.1;
      system.ammonia += (Math.random() - 0.5) * 0.05;
      
      // Keep values in realistic ranges
      system.waterTemp = Math.max(20, Math.min(28, system.waterTemp));
      system.ph = Math.max(6.5, Math.min(7.5, system.ph));
      system.ammonia = Math.max(0, Math.min(1, system.ammonia));
    });
  }

  /**
   * Handle water quality alerts
   */
  handleWaterQualityAlert(data) {
    this.logger.warn(`Water quality alert for ${data.systemId}: ${data.message}`);
  }

  /**
   * Get system recommendations
   */
  getRecommendations(systemId) {
    const system = this.getSystem(systemId);
    if (!system) return [];

    const recommendations = [];

    if (system.status === "optimal") {
      recommendations.push("✅ System is operating optimally");
      recommendations.push("Consider expanding plant beds for increased yield");
    }

    if (system.harvestReady.length > 0) {
      recommendations.push(`🌿 Ready to harvest: ${system.harvestReady.join(", ")}`);
    }

    if (system.ph < 6.8) {
      recommendations.push("Add potassium hydroxide or bicarbonate to raise pH");
    } else if (system.ph > 7.2) {
      recommendations.push("Add phosphoric acid to lower pH");
    }

    if (system.ammonia > 0.5) {
      recommendations.push("Reduce feeding by 25% for next 3 days");
      recommendations.push("Ensure biofilter has adequate surface area");
    }

    if (system.dissolvedOxygen < 6) {
      recommendations.push("Add air stones or increase air pump capacity");
    }

    return recommendations;
  }

  /**
   * Export system data for analysis
   */
  exportData() {
    return {
      systems: this.systems,
      metrics: this.productionMetrics,
      impact: this.communityImpact,
      exportedAt: new Date().toISOString()
    };
  }
}

export default AquaponicsPlugin;
