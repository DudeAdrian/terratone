// src/services/GlobalGrowingScheduleService.js

/**
 * Global Growing Schedule Service
 * Coordinates aquaponics and food production across the global network
 * Optimizes crop rotations, seed sharing, and seasonal production for maximum sustainability
 */

class GlobalGrowingScheduleService {
  constructor() {
    this.name = "GlobalGrowingSchedule";
    this.status = "idle";

    // Climate zones and their optimal growing windows
    this.climateZones = {
      tropical: {
        name: "Tropical",
        regions: ["Southeast Asia", "Central America", "Sub-Saharan Africa"],
        frostFreeDays: 365,
        mainSeasons: ["wet", "dry"],
        optimalTemp: { min: 20, max: 30 },
        avgRainfall: 2000, // mm/year
        soilType: "laterite, sandy loam",
        phRange: { min: 5.5, max: 7.0 },
        waterAvailability: "high (seasonal)",
        sunlight: 12, // hours/day
        humidityRange: { min: 60, max: 90 },
        monthlyVariation: {
          jan: { temp: 25, rainfall: 100, lightHours: 12 },
          feb: { temp: 26, rainfall: 110, lightHours: 12 },
          mar: { temp: 27, rainfall: 150, lightHours: 12 },
          apr: { temp: 27, rainfall: 200, lightHours: 12 },
          may: { temp: 26, rainfall: 220, lightHours: 12 },
          jun: { temp: 25, rainfall: 210, lightHours: 12 },
          jul: { temp: 24, rainfall: 200, lightHours: 12 },
          aug: { temp: 24, rainfall: 190, lightHours: 12 },
          sep: { temp: 25, rainfall: 180, lightHours: 12 },
          oct: { temp: 26, rainfall: 160, lightHours: 12 },
          nov: { temp: 26, rainfall: 120, lightHours: 12 },
          dec: { temp: 25, rainfall: 90, lightHours: 12 },
        },
      },
      subtropical: {
        name: "Subtropical",
        regions: ["Southern USA", "North Africa", "Southern Brazil"],
        frostFreeDays: 240,
        mainSeasons: ["summer", "winter"],
        optimalTemp: { min: 15, max: 28 },
        avgRainfall: 1000, // mm/year
        soilType: "clay loam, well-draining",
        phRange: { min: 6.0, max: 7.5 },
        waterAvailability: "moderate",
        sunlight: 10, // hours/day avg
        humidityRange: { min: 40, max: 70 },
        monthlyVariation: {
          jan: { temp: 18, rainfall: 60, lightHours: 10 },
          feb: { temp: 19, rainfall: 70, lightHours: 10 },
          mar: { temp: 22, rainfall: 80, lightHours: 11 },
          apr: { temp: 24, rainfall: 100, lightHours: 12 },
          may: { temp: 27, rainfall: 120, lightHours: 13 },
          jun: { temp: 29, rainfall: 140, lightHours: 13 },
          jul: { temp: 30, rainfall: 130, lightHours: 13 },
          aug: { temp: 29, rainfall: 120, lightHours: 13 },
          sep: { temp: 27, rainfall: 100, lightHours: 12 },
          oct: { temp: 24, rainfall: 90, lightHours: 11 },
          nov: { temp: 21, rainfall: 70, lightHours: 10 },
          dec: { temp: 18, rainfall: 60, lightHours: 10 },
        },
      },
      temperate: {
        name: "Temperate",
        regions: ["Northern USA", "Europe", "Southern Canada"],
        frostFreeDays: 180,
        mainSeasons: ["spring", "summer", "fall", "winter"],
        optimalTemp: { min: 10, max: 25 },
        avgRainfall: 800, // mm/year
        soilType: "loamy, rich organic matter",
        phRange: { min: 6.0, max: 7.0 },
        waterAvailability: "adequate (spring/summer)",
        sunlight: 9, // hours/day avg
        humidityRange: { min: 50, max: 80 },
        monthlyVariation: {
          jan: { temp: 2, rainfall: 50, lightHours: 8 },
          feb: { temp: 3, rainfall: 50, lightHours: 8 },
          mar: { temp: 8, rainfall: 60, lightHours: 9 },
          apr: { temp: 14, rainfall: 70, lightHours: 10 },
          may: { temp: 20, rainfall: 80, lightHours: 12 },
          jun: { temp: 23, rainfall: 90, lightHours: 13 },
          jul: { temp: 24, rainfall: 85, lightHours: 13 },
          aug: { temp: 23, rainfall: 80, lightHours: 12 },
          sep: { temp: 18, rainfall: 70, lightHours: 11 },
          oct: { temp: 12, rainfall: 70, lightHours: 10 },
          nov: { temp: 7, rainfall: 60, lightHours: 9 },
          dec: { temp: 3, rainfall: 50, lightHours: 8 },
        },
      },
      boreal: {
        name: "Boreal",
        regions: ["Canada", "Scandinavia", "Northern Russia"],
        frostFreeDays: 120,
        mainSeasons: ["brief summer", "long winter"],
        optimalTemp: { min: 5, max: 20 },
        avgRainfall: 400, // mm/year
        soilType: "acidic podzol, sandy",
        phRange: { min: 5.0, max: 6.5 },
        waterAvailability: "low (summer melt)",
        sunlight: 8, // hours/day avg
        humidityRange: { min: 40, max: 70 },
        monthlyVariation: {
          jan: { temp: -10, rainfall: 30, lightHours: 6 },
          feb: { temp: -8, rainfall: 30, lightHours: 7 },
          mar: { temp: -3, rainfall: 35, lightHours: 8 },
          apr: { temp: 5, rainfall: 40, lightHours: 10 },
          may: { temp: 12, rainfall: 50, lightHours: 12 },
          jun: { temp: 17, rainfall: 60, lightHours: 14 },
          jul: { temp: 18, rainfall: 55, lightHours: 14 },
          aug: { temp: 16, rainfall: 50, lightHours: 12 },
          sep: { temp: 10, rainfall: 45, lightHours: 10 },
          oct: { temp: 3, rainfall: 40, lightHours: 8 },
          nov: { temp: -4, rainfall: 35, lightHours: 7 },
          dec: { temp: -9, rainfall: 30, lightHours: 6 },
        },
      },
      arid: {
        name: "Arid",
        regions: ["Middle East", "Southern Africa", "Australia"],
        frostFreeDays: 300,
        mainSeasons: ["wet season", "dry season"],
        optimalTemp: { min: 18, max: 35 },
        avgRainfall: 250, // mm/year
        soilType: "sandy, low organic matter",
        phRange: { min: 7.0, max: 8.5 },
        waterAvailability: "very low (irrigation required)",
        sunlight: 11, // hours/day avg
        humidityRange: { min: 15, max: 40 },
        monthlyVariation: {
          jan: { temp: 28, rainfall: 5, lightHours: 12 },
          feb: { temp: 29, rainfall: 8, lightHours: 12 },
          mar: { temp: 27, rainfall: 10, lightHours: 11 },
          apr: { temp: 23, rainfall: 15, lightHours: 11 },
          may: { temp: 20, rainfall: 20, lightHours: 11 },
          jun: { temp: 19, rainfall: 25, lightHours: 11 },
          jul: { temp: 22, rainfall: 30, lightHours: 11 },
          aug: { temp: 24, rainfall: 28, lightHours: 11 },
          sep: { temp: 25, rainfall: 20, lightHours: 11 },
          oct: { temp: 26, rainfall: 10, lightHours: 11 },
          nov: { temp: 27, rainfall: 5, lightHours: 12 },
          dec: { temp: 28, rainfall: 3, lightHours: 12 },
        },
      },
    };

    // Regional crop varieties optimized for sustainable production
    this.regionalCropVarieties = {
      tropical: [
        { base: "lettuce-global", variety: "Buttercrunch (heat-tolerant)", waterNeeds: "high", pestResistance: "medium" },
        { base: "basil-global", variety: "Thai Basil", waterNeeds: "high", pestResistance: "high" },
        { base: "tilapia-stock", variety: "Nile Tilapia", waterNeeds: "n/a", pestResistance: "high" },
        { base: "swiss-chard", variety: "Bright Lights", waterNeeds: "medium", pestResistance: "medium" },
      ],
      subtropical: [
        { base: "lettuce-global", variety: "Romaine", waterNeeds: "medium", pestResistance: "medium" },
        { base: "tomato-cherry", variety: "Sungold", waterNeeds: "medium", pestResistance: "low" },
        { base: "basil-global", variety: "Genovese", waterNeeds: "medium", pestResistance: "medium" },
        { base: "spinach-global", variety: "Space", waterNeeds: "medium", pestResistance: "high" },
      ],
      temperate: [
        { base: "lettuce-global", variety: "Red Leaf", waterNeeds: "medium", pestResistance: "medium" },
        { base: "kale-curly", variety: "Lacinato", waterNeeds: "medium", pestResistance: "high" },
        { base: "spinach-global", variety: "Bloomsdale", waterNeeds: "medium", pestResistance: "high" },
        { base: "swiss-chard", variety: "Fordhook", waterNeeds: "medium", pestResistance: "medium" },
        { base: "tomato-cherry", variety: "Tiny Tim", waterNeeds: "medium", pestResistance: "low" },
      ],
      boreal: [
        { base: "lettuce-global", variety: "Arctic Crisp", waterNeeds: "low", pestResistance: "high" },
        { base: "kale-curly", variety: "Winterbor", waterNeeds: "low", pestResistance: "high" },
        { base: "spinach-global", variety: "Matador", waterNeeds: "low", pestResistance: "high" },
        { base: "basil-global", variety: "Finissimo", waterNeeds: "medium", pestResistance: "medium" },
      ],
      arid: [
        { base: "lettuce-global", variety: "Desert Crisp", waterNeeds: "low", pestResistance: "high" },
        { base: "basil-global", variety: "African Blue", waterNeeds: "low", pestResistance: "high" },
        { base: "swiss-chard", variety: "Desert Gold", waterNeeds: "low", pestResistance: "high" },
        { base: "kale-curly", variety: "Dwarf Blue", waterNeeds: "low", pestResistance: "medium" },
      ],
    };

    // Core aquaponics crops with global growing profiles
    this.globalCrops = [
      {
        id: "lettuce-global",
        name: "Lettuce (Leafy Mix)",
        family: "Brassicaceae",
        growTime: 35,
        tempRange: { min: 10, max: 22 },
        phRange: { min: 6.0, max: 7.0 },
        yield: 2.5, // kg per sq meter per 35 days
        aquaponicsSuitability: "excellent",
        climateZones: ["tropical", "subtropical", "temperate", "boreal"],
        seedsPerPacket: 500,
        nutritionProfile: { protein: 1.5, calcium: 2.2, iron: 0.8 },
      },
      {
        id: "tilapia-stock",
        name: "Tilapia (Fingerlings)",
        family: "Cichlidae",
        growTime: 180,
        tempRange: { min: 22, max: 30 },
        phRange: { min: 6.5, max: 8.0 },
        yield: 15, // kg per 1000L system per 180 days
        aquaponicsSuitability: "excellent",
        climateZones: ["tropical", "subtropical"],
        stocking: 50, // fingerlings per 1000L
        nutritionProfile: { protein: 19, omega3: 1.2, calcium: 1.0 },
      },
      {
        id: "basil-global",
        name: "Basil (Culinary)",
        family: "Lamiaceae",
        growTime: 50,
        tempRange: { min: 15, max: 28 },
        phRange: { min: 6.0, max: 7.5 },
        yield: 1.8,
        aquaponicsSuitability: "excellent",
        climateZones: ["tropical", "subtropical", "temperate", "arid"],
        seedsPerPacket: 1200,
        nutritionProfile: { protein: 2.7, calcium: 2.0, iron: 3.2 },
      },
      {
        id: "swiss-chard",
        name: "Swiss Chard",
        family: "Amaranthaceae",
        growTime: 45,
        tempRange: { min: 8, max: 25 },
        phRange: { min: 6.0, max: 7.5 },
        yield: 2.8,
        aquaponicsSuitability: "excellent",
        climateZones: ["temperate", "boreal", "subtropical"],
        seedsPerPacket: 400,
        nutritionProfile: { protein: 1.8, calcium: 5.1, iron: 1.6 },
      },
      {
        id: "tomato-cherry",
        name: "Cherry Tomato",
        family: "Solanaceae",
        growTime: 60,
        tempRange: { min: 18, max: 28 },
        phRange: { min: 6.0, max: 7.0 },
        yield: 8,
        aquaponicsSuitability: "good",
        climateZones: ["tropical", "subtropical", "temperate"],
        seedsPerPacket: 300,
        nutritionProfile: { protein: 0.9, vitamin_c: 15, lycopene: 2.5 },
      },
      {
        id: "kale-curly",
        name: "Kale (Curly)",
        family: "Brassicaceae",
        growTime: 55,
        tempRange: { min: 5, max: 20 },
        phRange: { min: 6.0, max: 7.5 },
        yield: 2.0,
        aquaponicsSuitability: "good",
        climateZones: ["temperate", "boreal"],
        seedsPerPacket: 350,
        nutritionProfile: { protein: 3.3, calcium: 13.4, iron: 1.7 },
      },
      {
        id: "spinach-global",
        name: "Spinach",
        family: "Amaranthaceae",
        growTime: 40,
        tempRange: { min: 8, max: 22 },
        phRange: { min: 6.5, max: 7.5 },
        yield: 2.2,
        aquaponicsSuitability: "excellent",
        climateZones: ["temperate", "boreal", "subtropical"],
        seedsPerPacket: 600,
        nutritionProfile: { protein: 2.7, iron: 2.7, calcium: 3.0 },
      },
    ];

    // Global production schedule (month-by-month for each climate zone)
    this.productionSchedule = this.initializeGlobalSchedule();
    this.communitySchedules = {};
    this.seedExchangeNetwork = [];
    this.harvestAlerts = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      this.generateSeedExchangeNetwork();
      console.log("[GlobalGrowingScheduleService] Global growing schedule initialized");
    } catch (error) {
      this.status = "error";
      console.error("[GlobalGrowingScheduleService] Initialization failed", error);
    }
  }

  // Wrapper for init() compatibility with SofieCore patterns
  init(sofieCore) {
    this.initialize();
  }

  initializeGlobalSchedule() {
    const schedule = {};
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ];

    Object.keys(this.climateZones).forEach((zone) => {
      schedule[zone] = {};
      months.forEach((month, idx) => {
        schedule[zone][month] = this.getOptimalCropsForMonth(zone, idx);
      });
    });

    return schedule;
  }

  getOptimalCropsForMonth(climateZone, monthIndex) {
    // 1-12 months; return crops optimal for this zone/month
    const season = this.getSeasonFromMonth(monthIndex, climateZone);
    
    return this.globalCrops.filter((crop) => {
      const isZoneCompatible = crop.climateZones.includes(climateZone);
      const isSeasonal = this.isCropInSeason(crop.id, season, climateZone);
      return isZoneCompatible && isSeasonal;
    });
  }

  getSeasonFromMonth(monthIndex, climateZone) {
    // monthIndex 0-11
    const seasons = {
      tropical: monthIndex < 6 ? "wet" : "dry",
      subtropical: monthIndex < 3 || monthIndex >= 9 ? "winter" : "summer",
      temperate:
        monthIndex < 3
          ? "winter"
          : monthIndex < 6
          ? "spring"
          : monthIndex < 9
          ? "summer"
          : "fall",
      boreal: monthIndex >= 5 && monthIndex < 9 ? "summer" : "winter",
      arid: monthIndex < 3 || monthIndex >= 10 ? "wet" : "dry",
    };
    return seasons[climateZone] || "spring";
  }

  isCropInSeason(cropId, season, climateZone) {
    // Simplified logic: some crops year-round in controlled aquaponics
    // Others prefer specific seasons
    const seasonalCrops = {
      tomato_cherry: ["summer", "fall"],
      kale_curly: ["winter", "spring", "fall"],
    };
    if (seasonalCrops[cropId]) {
      return seasonalCrops[cropId].includes(season);
    }
    return true; // most leafy greens/herbs go year-round in aquaponics
  }

  generateSeedExchangeNetwork() {
    // Create seed sharing network across communities
    this.seedExchangeNetwork = this.globalCrops.map((crop) => ({
      cropId: crop.id,
      cropName: crop.name,
      seedSupply: crop.seedsPerPacket * 10, // initial supply
      shareable: crop.seedsPerPacket * 2, // surplus for sharing
      demandCenters: [],
      lastRestocked: new Date().toISOString(),
    }));
  }

  getScheduleForCommunity(communityId, climateZone, month) {
    // Return optimized crops and planting schedule for a specific community
    const monthIndex = new Date(`2025-${String(month).padStart(2, "0")}-01`).getMonth();
    const crops = this.getOptimalCropsForMonth(climateZone, monthIndex);

    return {
      communityId,
      climateZone,
      month,
      recommendedCrops: crops.map((crop) => ({
        id: crop.id,
        name: crop.name,
        growTime: crop.growTime,
        expectedYield: crop.yield,
        harvestDate: this.calculateHarvestDate(monthIndex, crop.growTime),
        systemsNeeded: this.calculateSystemsRequired(crop, 100), // assume 100kg target
        seedInventory: this.getSeedInventoryFor(crop.id),
      })),
      nutritionalTarget: this.calculateNutritionalTarget(crops),
      seedSharingOpportunities: this.findSeedSharingPartners(climateZone, crops),
    };
  }

  calculateHarvestDate(plantMonth, growTime) {
    const plantDate = new Date(2025, plantMonth, 1);
    const harvestDate = new Date(plantDate);
    harvestDate.setDate(harvestDate.getDate() + growTime);
    return harvestDate.toISOString().split("T")[0];
  }

  calculateSystemsRequired(crop, targetYield) {
    // Return aquaponics system count to meet target yield
    const systemSize = 1000; // liters
    const systemYield = crop.yield; // kg per system per cycle
    return Math.ceil(targetYield / systemYield);
  }

  getSeedInventoryFor(cropId) {
    const seed = this.seedExchangeNetwork.find((s) => s.cropId === cropId);
    return seed ? { available: seed.seedSupply, shareable: seed.shareable } : null;
  }

  calculateNutritionalTarget(crops) {
    // Aggregate nutrition from recommended crops
    const nutrition = { protein: 0, calcium: 0, iron: 0, other: [] };
    crops.forEach((crop) => {
      const profile = crop.nutritionProfile || {};
      nutrition.protein += profile.protein || 0;
      nutrition.calcium += profile.calcium || 0;
      nutrition.iron += profile.iron || 0;
    });
    return nutrition;
  }

  findSeedSharingPartners(climateZone, crops) {
    // Identify other communities with surplus seeds this zone needs
    return this.seedExchangeNetwork
      .filter((seed) => seed.shareable > 100)
      .map((seed) => ({
        crop: seed.cropName,
        available: seed.shareable,
        contactHubs: [], // would be populated with actual hubs
      }));
  }

  requestSeedExchange(fromCommunity, toCommunity, cropId, quantity) {
    // Log seed exchange request across network
    const exchange = {
      id: `exchange-${Date.now()}`,
      from: fromCommunity,
      to: toCommunity,
      cropId,
      quantity,
      status: "pending",
      requestDate: new Date().toISOString(),
      estimatedDelivery: null,
    };
    this.seedExchangeNetwork = this.seedExchangeNetwork.map((seed) => {
      if (seed.cropId === cropId && seed.shareable >= quantity) {
        exchange.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        return { ...seed, shareable: seed.shareable - quantity };
      }
      return seed;
    });
    return exchange;
  }

  generateGlobalHarvestForecast(month) {
    // Predict aggregate harvest across all climate zones for the month
    const forecast = {};
    Object.keys(this.climateZones).forEach((zone) => {
      const monthIndex = month - 1;
      const crops = this.getOptimalCropsForMonth(zone, monthIndex);
      forecast[zone] = {
        crops,
        estimatedTotalYield: crops.reduce((sum, crop) => sum + crop.yield * 50, 0), // assume 50 systems per zone
        readyForHarvest: crops.filter((c) => c.growTime <= 45),
      };
    });
    return forecast;
  }

  optimizeForNutrition(targetCalories, targetDuration) {
    // Suggest crop mix to meet nutrition target across climate zones
    const recommendation = {
      targetCalories,
      durationDays: targetDuration,
      suggestedCrops: [],
      expectedNutrition: {},
      estimatedYield: 0,
    };

    // Simple heuristic: prioritize high-yield, high-nutrition crops
    const scored = this.globalCrops.map((crop) => ({
      ...crop,
      score:
        (crop.yield || 0) * 10 +
        (crop.nutritionProfile.protein || 0) * 5 +
        (crop.nutritionProfile.calcium || 0) * 3,
    }));

    recommendation.suggestedCrops = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return recommendation;
  }

  // Get regional climate data for a specific climate zone
  getRegionalClimateData(climateZone) {
    return this.climateZones[climateZone] || null;
  }

  // Get optimized crop varieties for a region
  getRegionalCropVarieties(climateZone) {
    return this.regionalCropVarieties[climateZone] || [];
  }

  // Get full regional production profile with all data
  getRegionalProductionProfile(climateZone, month) {
    const climate = this.climateZones[climateZone];
    if (!climate) return null;

    const monthNames = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ];
    const monthKey = monthNames[month - 1] || "jan";
    const monthData = climate.monthlyVariation[monthKey] || {};

    const varieties = this.regionalCropVarieties[climateZone] || [];
    const optimalCrops = this.getOptimalCropsForMonth(climateZone, month - 1);

    return {
      region: climate.name,
      month,
      currentConditions: {
        temperature: monthData.temp,
        rainfall: monthData.rainfall,
        lightHours: monthData.lightHours,
        humidity: climate.humidityRange,
      },
      soilProfile: {
        type: climate.soilType,
        phRange: climate.phRange,
        organicMatter: "medium to high recommended",
      },
      waterManagement: {
        availability: climate.waterAvailability,
        avgAnnualRainfall: climate.avgRainfall,
        irrigationNeeded: climate.waterAvailability.includes("low"),
      },
      optimalCrops: optimalCrops.map((crop) => {
        const variety = varieties.find((v) => v.base === crop.id);
        return {
          cropId: crop.id,
          cropName: crop.name,
          variety: variety?.variety || "standard",
          growTime: crop.growTime,
          expectedYield: crop.yield,
          waterNeeds: variety?.waterNeeds || "medium",
          pestResistance: variety?.pestResistance || "medium",
          compatibleWithMonth: true,
        };
      }),
      sunlight: climate.sunlight,
      seasonalRemarks: this.getSeasonalRemarks(climateZone, month),
    };
  }

  // Get specific guidance for sustainable production
  getSustainableProductionGuidance(climateZone) {
    const guidance = {
      tropical: {
        waterRecycling: "Essential - implement rainwater harvesting and greywater recycling",
        pestManagement: "Integrated pest management critical in high-humidity environment",
        soilAmendment: "Add compost regularly to combat leaching in tropical soils",
        biodiversity: "Encourage companion planting to maintain pest balance",
      },
      subtropical: {
        waterRecycling: "Important - seasonal rainfall variation requires storage",
        pestManagement: "Monitor pest pressure during warm months",
        soilAmendment: "Maintain organic matter to prevent compaction",
        biodiversity: "Rotate crops to maintain soil health",
      },
      temperate: {
        waterRecycling: "Moderate - spring/summer abundance, save for dry seasons",
        pestManagement: "Seasonal - monitor spring/fall pest emergence",
        soilAmendment: "Add compost in spring for best results",
        biodiversity: "Winter cover crops recommended for soil health",
      },
      boreal: {
        waterRecycling: "Low priority - abundant melt water available",
        pestManagement: "Limited pest pressure; focus on disease prevention",
        soilAmendment: "Break up acidic soils with lime as needed",
        biodiversity: "Short season - focus on fast-growing, cold-tolerant varieties",
      },
      arid: {
        waterRecycling: "CRITICAL - every drop must be captured and recycled",
        pestManagement: "Low pest pressure; focus on efficient water use",
        soilAmendment: "Add mulch and organic matter to retain moisture",
        biodiversity: "Drip irrigation essential; mulching critical for survival",
      },
    };
    return guidance[climateZone] || {};
  }

  // Calculate optimal water requirements for a crop in a region
  calculateWaterRequirements(cropId, climateZone, systemVolume = 1000) {
    const crop = this.globalCrops.find((c) => c.id === cropId);
    const climate = this.climateZones[climateZone];

    if (!crop || !climate) return null;

    // Base water needs adjusted by climate
    const baseWaterPerLiter = 0.5; // liters per liter per day (cycling)
    const climateMultiplier = {
      tropical: 1.3,
      subtropical: 1.1,
      temperate: 0.9,
      boreal: 0.7,
      arid: 1.5,
    };

    const dailyWaterNeeds = systemVolume * baseWaterPerLiter * (climateMultiplier[climateZone] || 1);

    return {
      cropId,
      crop: crop.name,
      systemVolume,
      dailyWaterNeeds: Math.round(dailyWaterNeeds),
      annualWaterNeeds: Math.round(dailyWaterNeeds * 365),
      recyclingRate: 0.85,
      freshwaterNeeded: Math.round(dailyWaterNeeds * 0.15),
      recommendation: `For ${crop.name} in ${climate.name}, system needs ${Math.round(dailyWaterNeeds)}L/day. Recycle 85%, fresh water: ${Math.round(dailyWaterNeeds * 0.15)}L/day`,
    };
  }

  // Get pest and disease info for a region/crop combination
  getRegionalPestProfile(cropId, climateZone) {
    const climate = this.climateZones[climateZone];
    if (!climate) return null;

    const pests = {
      tropical: {
        high: ["spider mites", "aphids", "fungal diseases"],
        prevention: "Maintain humidity control, ensure airflow, biological pest control",
      },
      subtropical: {
        high: ["whiteflies", "mealybugs", "powdery mildew"],
        prevention: "Screen insects, neem oil treatments, sulfur dust",
      },
      temperate: {
        high: ["cabbage moths", "slugs", "downy mildew"],
        prevention: "Row covers in spring, hand-pick slugs, copper fungicide",
      },
      boreal: {
        high: ["greenflies", "root rot", "damping off"],
        prevention: "Sterilize soil, ensure drainage, cold tolerance selection",
      },
      arid: {
        high: ["spider mites", "scale insects", "powdery mildew"],
        prevention: "Increase humidity in indoor systems, sulfur treatments",
      },
    };

    return pests[climateZone] || { high: [], prevention: "Standard integrated pest management" };
  }

  // Get seasonal remarks and production tips
  getSeasonalRemarks(climateZone, month) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const remarks = {
      tropical: {
        wet: "Peak growing season - ensure drainage, monitor for fungal issues",
        dry: "Irrigation critical - conserve water, use mulch heavily",
      },
      subtropical: {
        summer: "High heat - provide shade cloth, increase water circulation",
        winter: "Slower growth - reduce feeding, extend growing cycles",
      },
      temperate: {
        spring: "Ideal growing conditions - maximize production",
        summer: "Consistent growth - monitor water during heat spikes",
        fall: "Harvest peak crops, start cold-season varieties",
        winter: "Indoor systems shine - extend photoperiod if possible",
      },
      boreal: {
        summer: "CRITICAL WINDOW - maximize this short season",
        winter: "Indoor only - focus on hardy greens, maintain heating",
      },
      arid: {
        wet: "Store water aggressively for dry season",
        dry: "Run minimal systems, focus on perennials and stored crops",
      },
    };

    const season = this.getSeasonFromMonth(month - 1, climateZone);
    return remarks[climateZone]?.[season] || "Maintain standard operations";
  }
}

export default GlobalGrowingScheduleService;
