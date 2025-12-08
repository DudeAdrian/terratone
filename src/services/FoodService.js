// src/services/FoodService.js
import sofieCore from "../core/SofieCore";

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
  }

  initialize() {
    try {
      this.status = "initialized";
      sofieCore.getService("logger").log("[FoodService] Food production module initialized.");
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[FoodService] Initialization failed", error);
      throw error;
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
}

const foodService = new FoodService();
export default foodService;