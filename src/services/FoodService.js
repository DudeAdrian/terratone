// src/services/FoodService.js
import sofieCore from "../core/SofieCore";
import APIService from "./APIService";

class FoodService {
  constructor() {
    this.status = "idle";
    this.foodData = {
      gardens: [],
      crops: [],
      yields: 0, // kg per month
      storage: 0, // kg
      seedBank: [],
      nutritionGoals: {
        calories: 2000,
        proteins: 50,
        vegetables: 5,
      },
    };
    this.history = [];
    this.apiService = APIService;
    this.currentRegionId = null;

    // Home-scale food production data
    this.productionData = null;
    this.nutritionMetrics = null;
    this.storageInventory = null;
    this.safetyRecords = null;
    this.supplyPlanning = null;
  }

  initialize(regionId = "default") {
    try {
      this.currentRegionId = regionId;
      this.status = "initialized";
      sofieCore.getService("logger")?.log("[FoodService] Food production module initialized for region: " + regionId);
      this.seedLocalData();
      // Fetch food data from backend
      if (regionId && regionId !== "default") {
        this.fetchFoodDataFromAPI(regionId);
      }
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger")?.error("[FoodService] Initialization failed", error);
      throw error;
    }
  }

  async fetchFoodDataFromAPI(regionId) {
    try {
      const backendURL = this.apiService.baseURL || "http://localhost:3001/api";
      const response = await fetch(`${backendURL}/regions/${regionId}/food`);
      if (response.ok) {
        const data = await response.json();
        if (data.metrics && data.metrics.length > 0) {
          const latest = data.metrics[0];
          this.foodData = {
            gardens: [],
            crops: [],
            yields: latest.foodProductionTon ? (latest.foodProductionTon * 1000) : 0,
            storage: (latest.foodProductionTon ? (latest.foodProductionTon * 1000) : 0) * 0.3,
            seedBank: [],
            nutritionGoals: {
              calories: 2000,
              proteins: 50,
              vegetables: 5,
            }
          };
          this.history = data.metrics;
        }
      }
    } catch (error) {
      sofieCore.getService("logger").warn("[FoodService] API fetch failed, using local data", error);
    }
  }

  async saveToBackend() {
    try {
      const backendURL = this.apiService.baseURL || "http://localhost:3001/api";
      await fetch(`${backendURL}/regions/${this.currentRegionId}/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodProductionTon: this.foodData.yields / 1000,
          foodScore: 75
        })
      });
    } catch (error) {
      sofieCore.getService("logger").warn("[FoodService] Could not save to backend", error);
    }
  }

  addGarden(gardenData) {
    try {
      if (!gardenData || typeof gardenData !== 'object') {
        throw new Error('Garden data must be a valid object');
      }
      const garden = {
        id: Date.now(),
        ...gardenData,
        createdAt: new Date().toISOString(),
      };
      this.foodData.gardens.push(garden);
      sofieCore.updateState("foodGardens", this.foodData.gardens);
      sofieCore.getService("logger").debug("[FoodService] Garden added");
      
      // Save to backend
      if (this.currentRegionId) {
        this.saveToBackend();
      }
      return garden;
    } catch (error) {
      sofieCore.getService("logger").error("[FoodService] Add garden failed", error);
      throw error;
    }
  }

  addCrop(cropData) {
    const crop = {
      id: Date.now(),
      ...cropData,
      planted: new Date().toISOString(),
    };
    this.foodData.crops.push(crop);
    sofieCore.updateState("foodCrops", this.foodData.crops);
    sofieCore.getService("logger").log("[FoodService] Crop tracked:", crop.name);
    return crop;
  }

  recordYield(cropId, yieldAmount) {
    this.foodData.yields += yieldAmount;
    this.foodData.storage += yieldAmount;
    this.history.push({
      type: "yield",
      cropId,
      amount: yieldAmount,
      timestamp: new Date().toISOString(),
    });
    sofieCore.updateState("foodYields", this.foodData.yields);
    sofieCore.getService("logger").log(`[FoodService] Yield recorded: +${yieldAmount}kg`);
  }

  consumeFood(amount) {
    this.foodData.storage = Math.max(0, this.foodData.storage - amount);
    this.history.push({
      type: "consumption",
      amount,
      timestamp: new Date().toISOString(),
    });
    sofieCore.updateState("foodStorage", this.foodData.storage);
  }

  getSustainabilityScore() {
    const diversityScore = Math.min(this.foodData.crops.length * 10, 100);
    const storageScore = Math.min((this.foodData.storage / 500) * 100, 100);
    return Math.round((diversityScore + storageScore) / 2);
  }

  getFoodData() {
    return this.foodData;
  }

  getHistory() {
    return this.history;
  }

  // Integration with Global Growing Schedule for optimized aquaponics production
  getGlobalScheduleRecommendation(communityId, climateZone, month) {
    try {
      const scheduleService = sofieCore.getService("globalGrowingSchedule");
      if (!scheduleService) {
        throw new Error("Global Growing Schedule service not available");
      }
      return scheduleService.getScheduleForCommunity(communityId, climateZone, month);
    } catch (error) {
      sofieCore.getService("logger").warn("[FoodService] Could not fetch global schedule", error);
      return null;
    }
  }

  // Request seed exchange from global network
  requestSeedsFromGlobalNetwork(fromCommunity, cropId, quantity) {
    try {
      const scheduleService = sofieCore.getService("globalGrowingSchedule");
      if (!scheduleService) {
        throw new Error("Global Growing Schedule service not available");
      }
      const exchange = scheduleService.requestSeedExchange(
        fromCommunity,
        this.communityId || "local",
        cropId,
        quantity
      );
      sofieCore.getService("logger").info("[FoodService] Seed exchange requested", exchange);
      return exchange;
    } catch (error) {
      sofieCore.getService("logger").error("[FoodService] Seed exchange failed", error);
      throw error;
    }
  }

  // Get global harvest forecast for planning
  getGlobalHarvestForecast(month) {
    try {
      const scheduleService = sofieCore.getService("globalGrowingSchedule");
      if (!scheduleService) {
        throw new Error("Global Growing Schedule service not available");
      }
      return scheduleService.generateGlobalHarvestForecast(month);
    } catch (error) {
      sofieCore.getService("logger").warn("[FoodService] Could not fetch harvest forecast", error);
      return null;
    }
  }

  // Optimize crop mix for nutrition targets using global data
  optimizeForNutrition(targetCalories, targetDuration) {
    try {
      const scheduleService = sofieCore.getService("globalGrowingSchedule");
      if (!scheduleService) {
        throw new Error("Global Growing Schedule service not available");
      }
      return scheduleService.optimizeForNutrition(targetCalories, targetDuration);
    } catch (error) {
      sofieCore.getService("logger").warn("[FoodService] Nutrition optimization unavailable", error);
      return { targetCalories, durationDays: targetDuration, suggestedCrops: [] };
    }
  }

  /**
   * Get current feeding rate (for AutopilotService)
   * Returns feeding rate as percentage of fish body weight
   */
  getCurrentFeedingRate() {
    // Default: 2-3% of body weight daily (industry standard for aquaponics)
    return 2.5 + (Math.random() * 0.5 - 0.25); // 2.25-2.75%
  }

  /**
   * Get count of active crops (for AutopilotService)
   */
  getActiveCropsCount() {
    return this.foodData.crops.length || 6;
  }

  /**
   * Get nutrition balance score (for AutopilotService)
   * Returns 0-1 representing how balanced the nutrition profile is
   */
  getNutritionBalance() {
    const crops = this.foodData.crops;
    if (crops.length === 0) return 0.5;
    
    // Simple diversity metric: more crops = better balance
    const diversityScore = Math.min(crops.length / 10, 1); // 10+ crops = perfect
    return 0.7 + (diversityScore * 0.3); // 0.7-1.0 range
  }

  /**
   * Get daily protein production in grams (for AutopilotService)
   */
  getDailyProteinProduction() {
    // Estimate based on active crops and fish
    const baseCropProtein = this.foodData.crops.length * 5; // 5g per crop type
    const fishProtein = 100; // Base fish production
    return baseCropProtein + fishProtein + (Math.random() * 20 - 10); // ±10g variation
  }

  /**
   * Get yield variance percentage (for AutopilotService)
   * Lower is better (more consistent yields)
   */
  getYieldVariance() {
    return 3 + Math.random() * 5; // 3-8% variance
  }

  /**
   * Seed local home-scale food production data
   */
  seedLocalData() {
    const now = new Date();

    // Production Data
    this.productionData = {
      gardens: [
        {
          gardenId: "Raised-Beds-1",
          location: "South facing yard",
          areaSqm: 12,
          type: "raised beds",
          status: "productive",
          crops: ["tomatoes", "peppers", "basil"],
          productivity: 94,
          waterUse: 45, // liters today
          lastHarvest: new Date(now - 86400000).toISOString(),
          nextHarvest: new Date(now + 259200000).toISOString()
        },
        {
          gardenId: "Container-Garden",
          location: "Patio",
          areaSqm: 8,
          type: "containers",
          status: "productive",
          crops: ["lettuce", "spinach", "chard"],
          productivity: 88,
          waterUse: 20,
          lastHarvest: new Date(now - 172800000).toISOString(),
          nextHarvest: new Date(now + 172800000).toISOString()
        },
        {
          gardenId: "Vertical-Wall",
          location: "East wall",
          areaSqm: 4,
          type: "vertical",
          status: "productive",
          crops: ["strawberries", "herbs"],
          productivity: 82,
          waterUse: 15,
          lastHarvest: new Date(now - 604800000).toISOString(),
          nextHarvest: new Date(now + 345600000).toISOString()
        }
      ],
      monthlyYield: 42.5, // kg
      yearlyProjection: 510,
      biodiversity: 24 // crop varieties
    };

    // Nutrition Metrics
    this.nutritionMetrics = [
      {
        category: "Vegetables",
        daily: 380, // grams
        target: 400,
        weeklyAvg: 2660,
        topSources: ["tomatoes", "peppers", "lettuce", "spinach"],
        nutritionValue: 85
      },
      {
        category: "Fruits",
        daily: 165,
        target: 200,
        weeklyAvg: 1155,
        topSources: ["strawberries", "berries"],
        nutritionValue: 92
      },
      {
        category: "Proteins",
        daily: 62,
        target: 60,
        weeklyAvg: 434,
        topSources: ["legumes", "seeds", "nuts"],
        nutritionValue: 88
      },
      {
        category: "Carbohydrates",
        daily: 285,
        target: 325,
        weeklyAvg: 1995,
        topSources: ["potatoes", "grains"],
        nutritionValue: 75
      }
    ];

    // Storage Inventory
    this.storageInventory = {
      locations: [
        {
          locationId: "root-cellar",
          name: "Root Cellar",
          type: "Temperature-Controlled",
          temperature: 4,
          targetTemp: 4,
          humidity: 95,
          capacity: 50,
          currentWeight: 35,
          itemsStored: ["carrots", "beets", "potatoes", "onions"],
          healthStatus: "Optimal"
        },
        {
          locationId: "pantry",
          name: "Pantry Shelves",
          type: "Ambient Storage",
          temperature: 18,
          targetTemp: 18,
          humidity: 60,
          capacity: 30,
          currentWeight: 24,
          itemsStored: ["canned goods", "dried herbs", "seeds"],
          healthStatus: "Good"
        },
        {
          locationId: "freezer",
          name: "Freezer",
          type: "Deep Freeze",
          temperature: -18,
          targetTemp: -18,
          humidity: 5,
          capacity: 80,
          currentWeight: 62,
          itemsStored: ["berries", "herbs", "prepared meals"],
          healthStatus: "Excellent"
        }
      ],
      totalCapacity: 160,
      wastePercentage: 2.5,
      spoilageRisk: "low"
    };

    // Safety Records
    this.safetyRecords = [
      {
        testId: "soil-001",
        testType: "Soil Contaminants",
        description: "Comprehensive soil safety analysis",
        result: "PASS",
        testDate: new Date(now - 604800000).toISOString(),
        testedSample: "Root Cellar Soil",
        location: "Root Cellar",
        testedBy: "Dr. Sarah Green",
        parameters: [
          { name: "Pesticide Residue", value: "None detected", status: "PASS" },
          { name: "Heavy Metals", value: "Safe levels", status: "PASS" },
          { name: "Pathogens", value: "Negative", status: "PASS" }
        ],
        notes: "All soil parameters within safe limits. Excellent for organic production."
      },
      {
        testId: "water-001",
        testType: "Water Quality",
        description: "Irrigation water safety test",
        result: "PASS",
        testDate: new Date(now - 1209600000).toISOString(),
        testedSample: "Irrigation System",
        location: "Garden Water Supply",
        testedBy: "Dr. James Rivera",
        parameters: [
          { name: "pH Level", value: "7.0", status: "PASS" },
          { name: "Nitrogen Content", value: "Safe", status: "PASS" },
          { name: "Bacteria Count", value: "Negative", status: "PASS" }
        ],
        notes: "Water quality excellent. No treatment needed."
      },
      {
        testId: "produce-001",
        testType: "Produce Analysis",
        description: "Fresh produce quality assessment",
        result: "PASS",
        testDate: new Date(now - 1814400000).toISOString(),
        testedSample: "Mixed Vegetables",
        location: "Post-Harvest",
        testedBy: "Dr. Lisa Chen",
        parameters: [
          { name: "Pesticide Residue", value: "None detected", status: "PASS" },
          { name: "Quality Score", value: "96/100", status: "PASS" },
          { name: "Nutrition Intact", value: "Yes", status: "PASS" }
        ],
        notes: "High quality produce with excellent nutritional content."
      },
      {
        testId: "storage-001",
        testType: "Storage Hygiene",
        description: "Storage facility contamination check",
        result: "PASS",
        testDate: new Date(now - 2419200000).toISOString(),
        testedSample: "Storage Environment",
        location: "All Storage Areas",
        testedBy: "Dr. Michael Foster",
        parameters: [
          { name: "Mold Spores", value: "None detected", status: "PASS" },
          { name: "Pest Activity", value: "None found", status: "PASS" },
          { name: "Contamination Risk", value: "Low", status: "PASS" }
        ],
        notes: "Storage facilities maintain excellent sanitation standards."
      }
    ];

    // Supply Planning
    this.supplyPlanning = {
      currentSeason: "Summer",
      upcomingHarvests: [
        { 
          cropId: "tomato-001",
          cropName: "Tomatoes", 
          gardenLocation: "Raised Beds - South",
          estimatedHarvestDate: new Date(now + 259200000).toISOString(), 
          estimatedYield: 8.5, 
          maturityPercentage: 85,
          status: "Near Ready",
          notes: "Plants flowering well, expect harvest in 3-4 days"
        },
        { 
          cropId: "lettuce-001",
          cropName: "Lettuce", 
          gardenLocation: "Container Garden - Patio",
          estimatedHarvestDate: new Date(now + 172800000).toISOString(), 
          estimatedYield: 3.2, 
          maturityPercentage: 92,
          status: "Ready Soon",
          notes: "Heads fully formed, harvest in 2 days"
        },
        { 
          cropId: "pepper-001",
          cropName: "Peppers", 
          gardenLocation: "Raised Beds - South",
          estimatedHarvestDate: new Date(now + 432000000).toISOString(), 
          estimatedYield: 5.8, 
          maturityPercentage: 60,
          status: "Developing",
          notes: "Fruit sizing well, continue watering"
        },
        { 
          cropId: "herbs-001",
          cropName: "Herbs", 
          gardenLocation: "Vertical Wall - East",
          estimatedHarvestDate: new Date(now + 86400000).toISOString(), 
          estimatedYield: 0.5, 
          maturityPercentage: 95,
          status: "Harvest Today",
          notes: "Ready for harvest now"
        },
        { 
          cropId: "squash-001",
          cropName: "Squash", 
          gardenLocation: "Raised Beds - South",
          estimatedHarvestDate: new Date(now + 604800000).toISOString(), 
          estimatedYield: 12.3, 
          maturityPercentage: 40,
          status: "Growing",
          notes: "Vine is flowering, fruits developing"
        }
      ],
      seasonalSchedule: [
        { phase: "Spring Planting", crops: ["lettuce", "spinach", "peas", "beans"], timing: "March-April" },
        { phase: "Summer Growth", crops: ["tomatoes", "peppers", "basil", "squash"], timing: "May-July" },
        { phase: "Fall Harvest", crops: ["carrots", "kale", "beets", "chard"], timing: "August-October" },
        { phase: "Winter Storage", crops: ["stored crops", "sprouts", "microgreens"], timing: "November-February" }
      ],
      storageCapacityUsed: 76,
      projectedCapacityAfterHarvest: 95,
      storageDistribution: [
        { location: "Root Cellar", projectedKg: 45, percentageOfTotal: 35 },
        { location: "Pantry Shelves", projectedKg: 32, percentageOfTotal: 25 },
        { location: "Freezer", projectedKg: 83, percentageOfTotal: 65 }
      ]
    };
  }

  getProductionData() {
    return this.productionData;
  }

  getNutritionMetrics() {
    return this.nutritionMetrics;
  }

  getStorageInventory() {
    return this.storageInventory;
  }

  getSafetyRecords() {
    return this.safetyRecords;
  }

  getSupplyPlanning() {
    return this.supplyPlanning;
  }
}

const foodService = new FoodService();
export default foodService;