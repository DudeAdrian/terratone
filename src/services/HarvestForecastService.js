// src/services/HarvestForecastService.js
import sofieCore from "../core/SofieCore";

class HarvestForecastService {
  constructor() {
    this.status = "idle";
    this.forecasts = [];
    this.historicalData = [];
    this.globalSchedule = null;
    this.nutritionTargets = {
      calories: 2000,
      protein: 50,
      fat: 65,
      carbs: 300,
      fiber: 25,
      fruits_vegetables: 5,
    };
  }

  initialize() {
    this.status = "initialized";
    this.globalSchedule = sofieCore.getService("globalGrowingSchedule");
    if (!this.globalSchedule) {
      sofieCore.getService("logger").warn("[HarvestForecastService] GlobalGrowingScheduleService not available");
    }
    sofieCore.getService("logger").log("[HarvestForecastService] Harvest forecast service initialized");
    this.generateAnnualForecast();
  }

  // Generate 12-month forecast across all climate zones
  generateAnnualForecast() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const climateZones = ["tropical", "subtropical", "temperate", "boreal", "arid"];
    
    this.forecasts = months.map((month, monthIndex) => {
      const monthForecasts = climateZones.map(zone => {
        const schedule = this.globalSchedule?.getScheduleForCommunity("global", zone, monthIndex + 1) || {};
        const profile = this.globalSchedule?.getRegionalProductionProfile(zone, monthIndex + 1) || {};
        
        return {
          zone,
          crops: schedule.optimalCrops || [],
          estimatedYield: this.calculateZoneYield(zone, monthIndex + 1),
          plantingSchedule: schedule.plantingSchedule || [],
          harvestDates: schedule.harvestDates || [],
          seasonalReminder: profile.seasonalRemarks || "",
          waterNeeded: this.calculateZoneWaterNeeds(zone, schedule.optimalCrops || []),
          nutritionContribution: this.calculateNutritionContribution(schedule.optimalCrops || []),
        };
      });

      return {
        month,
        monthIndex: monthIndex + 1,
        zoneForecasts: monthForecasts,
        globalYield: monthForecasts.reduce((sum, zf) => sum + zf.estimatedYield, 0),
        globalNutrition: this.aggregateNutrition(monthForecasts.map(zf => zf.nutritionContribution)),
      };
    });

    sofieCore.getService("logger").info("[HarvestForecastService] Annual forecast generated");
    return this.forecasts;
  }

  // Calculate estimated yield for a climate zone in a specific month
  calculateZoneYield(climateZone, month) {
    const baseYield = {
      tropical: 45,      // kg/month - high year-round production
      subtropical: 38,   // kg/month - good production with seasons
      temperate: 32,     // kg/month - seasonal variation
      boreal: 20,        // kg/month - short growing season
      arid: 15,          // kg/month - water-limited production
    };

    const seasonalMultiplier = {
      tropical: 1.0,     // consistent
      subtropical: this.getSeasonalMultiplier(month, [4, 5, 6, 7, 8, 9]),  // summer peak
      temperate: this.getSeasonalMultiplier(month, [5, 6, 7, 8, 9]),       // peak summer
      boreal: this.getSeasonalMultiplier(month, [6, 7, 8]),                // very short season
      arid: this.getSeasonalMultiplier(month, [11, 12, 1, 2, 3]),          // winter growing
    };

    const base = baseYield[climateZone] || 25;
    const seasonal = seasonalMultiplier[climateZone] || 1.0;
    
    return Math.round(base * seasonal);
  }

  // Seasonal multiplier: peak production vs. off-season
  getSeasonalMultiplier(currentMonth, peakMonths) {
    if (peakMonths.includes(currentMonth)) {
      return 1.2; // peak season (+20%)
    } else if (currentMonth === 1 || currentMonth === 12 || 
               (currentMonth > peakMonths[0] - 2 && currentMonth < peakMonths[peakMonths.length - 1] + 2)) {
      return 0.8; // shoulder season (-20%)
    }
    return 0.4; // off-season (-60%)
  }

  // Calculate water requirements for crops in a zone
  calculateZoneWaterNeeds(climateZone, crops) {
    const systemVolume = 10000; // liters (typical aquaponics system)
    let totalWaterNeeded = 0;

    crops.forEach(crop => {
      const waterReq = this.globalSchedule?.calculateWaterRequirements(crop.id, climateZone, systemVolume);
      if (waterReq) {
        totalWaterNeeded += waterReq.freshWaterNeeded;
      }
    });

    return {
      freshWater: Math.round(totalWaterNeeded),
      recycledWater: Math.round(systemVolume * 0.85), // 85% recycling efficiency
      dailyNeeded: Math.round(totalWaterNeeded / 30),
    };
  }

  // Calculate nutritional contribution of crops
  calculateNutritionContribution(crops) {
    const cropNutrition = {
      lettuce: { calories: 15, protein: 1.2, fat: 0.3, carbs: 3, fiber: 2, type: "vegetable" },
      tilapia: { calories: 128, protein: 26, fat: 3, carbs: 0, fiber: 0, type: "protein" },
      basil: { calories: 27, protein: 3.3, fat: 0.6, carbs: 3.7, fiber: 1.6, type: "herb" },
      chard: { calories: 19, protein: 1.8, fat: 0.2, carbs: 3.7, fiber: 1.6, type: "vegetable" },
      tomato: { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, type: "vegetable" },
      kale: { calories: 49, protein: 4.3, fat: 0.9, carbs: 9, fiber: 2.4, type: "vegetable" },
      spinach: { calories: 23, protein: 2.7, fat: 0.4, carbs: 3.6, fiber: 2.2, type: "vegetable" },
    };

    let total = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      types: [],
    };

    crops.forEach(crop => {
      const cropId = crop.id || crop.toLowerCase();
      const nutrition = cropNutrition[cropId] || { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, type: "unknown" };
      
      total.calories += nutrition.calories;
      total.protein += nutrition.protein;
      total.fat += nutrition.fat;
      total.carbs += nutrition.carbs;
      total.fiber += nutrition.fiber;
      
      if (!total.types.includes(nutrition.type)) {
        total.types.push(nutrition.type);
      }
    });

    return total;
  }

  // Aggregate nutrition data from multiple zones
  aggregateNutrition(nutritionArray) {
    return {
      totalCalories: nutritionArray.reduce((sum, n) => sum + n.calories, 0),
      totalProtein: nutritionArray.reduce((sum, n) => sum + n.protein, 0),
      totalFat: nutritionArray.reduce((sum, n) => sum + n.fat, 0),
      totalCarbs: nutritionArray.reduce((sum, n) => sum + n.carbs, 0),
      totalFiber: nutritionArray.reduce((sum, n) => sum + n.fiber, 0),
      diversityScore: new Set(nutritionArray.flatMap(n => n.types)).size * 20,
    };
  }

  // Get forecast for specific month
  getForecastByMonth(monthIndex) {
    return this.forecasts.find(f => f.monthIndex === monthIndex) || null;
  }

  // Get forecast for specific climate zone and month
  getZoneForecast(climateZone, monthIndex) {
    const monthForecast = this.getForecastByMonth(monthIndex);
    if (!monthForecast) return null;
    return monthForecast.zoneForecasts.find(zf => zf.zone === climateZone) || null;
  }

  // Get crops available in a specific season
  getSeasonalCrops(month) {
    const forecast = this.getForecastByMonth(month);
    if (!forecast) return [];

    const allCrops = [];
    forecast.zoneForecasts.forEach(zf => {
      zf.crops.forEach(crop => {
        if (!allCrops.find(c => c.id === crop.id)) {
          allCrops.push({ ...crop, availableInZones: [zf.zone] });
        } else {
          const existing = allCrops.find(c => c.id === crop.id);
          existing.availableInZones.push(zf.zone);
        }
      });
    });

    return allCrops;
  }

  // Calculate nutrition targets vs actual production
  getNutritionAnalysis(month) {
    const forecast = this.getForecastByMonth(month);
    if (!forecast) return null;

    const actual = forecast.globalNutrition;
    const targets = this.nutritionTargets;

    return {
      calories: {
        target: targets.calories,
        actual: actual.totalCalories,
        percentage: Math.round((actual.totalCalories / targets.calories) * 100),
        status: actual.totalCalories >= targets.calories ? "met" : "insufficient",
      },
      protein: {
        target: targets.protein,
        actual: actual.totalProtein,
        percentage: Math.round((actual.totalProtein / targets.protein) * 100),
        status: actual.totalProtein >= targets.protein ? "met" : "insufficient",
      },
      fiber: {
        target: targets.fiber,
        actual: actual.totalFiber,
        percentage: Math.round((actual.totalFiber / targets.fiber) * 100),
        status: actual.totalFiber >= targets.fiber ? "met" : "sufficient",
      },
      diversityScore: actual.diversityScore,
    };
  }

  // Trading opportunity detection: surpluses vs. deficits
  getTradeOpportunities(month) {
    const forecast = this.getForecastByMonth(month);
    if (!forecast) return [];

    const opportunities = [];

    // Detect surpluses and deficits
    const nutrition = this.getNutritionAnalysis(month);

    if (nutrition.calories.percentage > 120) {
      opportunities.push({
        type: "surplus",
        category: "calories",
        amount: nutrition.calories.actual - nutrition.calories.target,
        recommendation: "Consider exporting excess caloric production to neighboring communities",
        priority: "medium",
      });
    }

    if (nutrition.protein.percentage < 80) {
      opportunities.push({
        type: "deficit",
        category: "protein",
        amount: nutrition.protein.target - nutrition.protein.actual,
        recommendation: "Request protein-rich crops or aquaponics products from other zones",
        priority: "high",
      });
    }

    if (nutrition.diversityScore < 50) {
      opportunities.push({
        type: "diversity",
        category: "crop-variety",
        amount: 0,
        recommendation: "Increase crop diversity to improve nutrition profile and resilience",
        priority: "medium",
      });
    }

    return opportunities;
  }

  // Get all forecasts
  getAllForecasts() {
    return this.forecasts;
  }

  // Update nutrition targets
  setNutritionTargets(targets) {
    this.nutritionTargets = { ...this.nutritionTargets, ...targets };
    sofieCore.getService("logger").info("[HarvestForecastService] Nutrition targets updated", this.nutritionTargets);
  }

  // Get global production statistics
  getGlobalStats() {
    const totalYield = this.forecasts.reduce((sum, f) => sum + f.globalYield, 0);
    const avgMonthlyYield = totalYield / 12;
    const peakMonth = this.forecasts.reduce((peak, f) => f.globalYield > peak.globalYield ? f : peak);
    const lowMonth = this.forecasts.reduce((low, f) => f.globalYield < low.globalYield ? f : low);

    return {
      annualGlobalYield: totalYield,
      averageMonthlyYield: Math.round(avgMonthlyYield),
      peakMonth: peakMonth.month,
      peakYield: peakMonth.globalYield,
      lowMonth: lowMonth.month,
      lowYield: lowMonth.globalYield,
      zoneCount: 5,
      totalCropsTracked: 7,
    };
  }
}

export default HarvestForecastService;
