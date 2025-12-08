// src/services/AquaticLifeService.js
import sofieCore from "../core/SofieCore";

class AquaticLifeService {
  constructor() {
    this.status = "idle";
    this.ecosystems = [];
    this.populations = [];
    this.healthMetrics = [];
    this.breeding = [];
    this.waterQuality = null;
  }

  initialize() {
    this.status = "initialized";
    this.initializeAquaticDatabase();
    this.initializeEcosystems();
    sofieCore.getService("logger").log("[AquaticLifeService] Aquatic life management service initialized");
  }

  // ============================================================================
  // AQUATIC SPECIES DATABASE
  // ============================================================================

  initializeAquaticDatabase() {
    this.database = {
      // ========================================================================
      // PRIMARY FISH SPECIES FOR AQUAPONICS
      // ========================================================================
      fish: {
        tilapia: {
          commonName: "Tilapia (Nile)",
          scientificName: "Oreochromis niloticus",
          category: "primary-protein",
          lifespan: "4-8 years",
          matureSize: "25-35 cm, 1-2 kg",
          matureAge: "6-8 months",
          temperatureRange: { min: 22, max: 30, optimal: 27 },
          pHRange: { min: 6.5, max: 8.5, optimal: 7.5 },
          oxygenNeed: "5-8 mg/L",
          foodConversion: 1.2, // kg food per kg growth
          proteinContent: 26, // % by weight
          nutritionProfile: { protein: 26, fat: 3, omega3: 0.5, minerals: "high" },
          breedingTemp: 26,
          sexRatio: "1:1 (male biased for monosex)",
          stocking: {
            density: "100-150 per 1000L",
            space: "6.6-10L per fish",
            minWeight: 10, // grams
            initialDensity: 25, // per 1000L for juveniles
          },
          wasteProduction: { ammonia: 0.8, dailyFeeding: "1.5-2% body weight" },
          diseaseResistance: "high",
          commonDiseases: ["streptococcosis", "red mouth disease", "ich"],
          climate: ["tropical", "subtropical", "temperate"], // viable climates
          productivity: "very high",
          nitrogenProduction: 2.2, // g N per 1000L per day at 100 fish
          harvestYield: "12-15 kg per 1000L per year",
        },
        trout: {
          commonName: "Rainbow Trout",
          scientificName: "Oncorhynchus mykiss",
          category: "premium-protein",
          lifespan: "4-7 years",
          matureSize: "30-50 cm, 1.5-3 kg",
          matureAge: "18-24 months",
          temperatureRange: { min: 12, max: 18, optimal: 15 },
          pHRange: { min: 6.5, max: 8.0, optimal: 7.0 },
          oxygenNeed: "7-10 mg/L",
          foodConversion: 1.0,
          proteinContent: 24,
          nutritionProfile: { protein: 24, fat: 5, omega3: 1.5, minerals: "high" },
          breedingTemp: 5,
          sexRatio: "1:1",
          stocking: {
            density: "50-80 per 1000L",
            space: "12.5-20L per fish",
            minWeight: 50,
            initialDensity: 20,
          },
          wasteProduction: { ammonia: 0.6, dailyFeeding: "1-1.5% body weight" },
          diseaseResistance: "medium",
          commonDiseases: ["furunculosis", "whirling disease", "ich"],
          climate: ["temperate", "boreal"],
          productivity: "medium",
          nitrogenProduction: 1.8,
          harvestYield: "8-10 kg per 1000L per year",
        },
        barramundi: {
          commonName: "Barramundi (Asian Sea Bass)",
          scientificName: "Lates calcarifer",
          category: "premium-protein",
          lifespan: "5-10 years",
          matureSize: "60-80 cm, 3-5 kg",
          matureAge: "12-18 months",
          temperatureRange: { min: 24, max: 32, optimal: 28 },
          pHRange: { min: 7.0, max: 8.2, optimal: 7.5 },
          oxygenNeed: "5-8 mg/L",
          foodConversion: 1.3,
          proteinContent: 20,
          nutritionProfile: { protein: 20, fat: 4, omega3: 1.2, minerals: "very high" },
          breedingTemp: 28,
          sexRatio: "1:1",
          stocking: {
            density: "60-100 per 1000L",
            space: "10-16.6L per fish",
            minWeight: 20,
            initialDensity: 30,
          },
          wasteProduction: { ammonia: 0.9, dailyFeeding: "2% body weight" },
          diseaseResistance: "very high",
          commonDiseases: ["Vibrio infection", "mycobacterial infection"],
          climate: ["tropical", "subtropical"],
          productivity: "very high",
          nitrogenProduction: 2.4,
          harvestYield: "15-18 kg per 1000L per year",
        },
        catfish: {
          commonName: "African Catfish",
          scientificName: "Clarias gariepinus",
          category: "primary-protein",
          lifespan: "8-12 years",
          matureSize: "40-60 cm, 1-3 kg",
          matureAge: "12-18 months",
          temperatureRange: { min: 20, max: 32, optimal: 26 },
          pHRange: { min: 6.0, max: 8.0, optimal: 7.0 },
          oxygenNeed: "3-5 mg/L", // lower oxygen tolerance
          foodConversion: 1.1,
          proteinContent: 18,
          nutritionProfile: { protein: 18, fat: 7, omega3: 0.8, minerals: "medium" },
          breedingTemp: 26,
          sexRatio: "1:1",
          stocking: {
            density: "200-300 per 1000L",
            space: "3.3-5L per fish",
            minWeight: 5,
            initialDensity: 50,
          },
          wasteProduction: { ammonia: 1.2, dailyFeeding: "1.5% body weight" },
          diseaseResistance: "high",
          commonDiseases: ["bacterial infections", "parasites"],
          climate: ["tropical", "subtropical", "temperate"],
          productivity: "very high",
          nitrogenProduction: 2.6,
          harvestYield: "20-25 kg per 1000L per year",
        },
        carp: {
          commonName: "Common Carp",
          scientificName: "Cyprinus carpio",
          category: "primary-protein",
          lifespan: "15-20 years",
          matureSize: "40-80 cm, 2-10 kg",
          matureAge: "24-36 months",
          temperatureRange: { min: 5, max: 28, optimal: 22 },
          pHRange: { min: 6.5, max: 8.0, optimal: 7.2 },
          oxygenNeed: "5-7 mg/L",
          foodConversion: 2.0,
          proteinContent: 18,
          nutritionProfile: { protein: 18, fat: 4, omega3: 0.5, minerals: "medium" },
          breedingTemp: 20,
          sexRatio: "1:1",
          stocking: {
            density: "40-60 per 1000L",
            space: "16.6-25L per fish",
            minWeight: 100,
            initialDensity: 10,
          },
          wasteProduction: { ammonia: 0.7, dailyFeeding: "2% body weight" },
          diseaseResistance: "very high",
          commonDiseases: ["carp pox", "cyprinid herpesvirus"],
          climate: ["temperate", "boreal", "subtropical"],
          productivity: "high",
          nitrogenProduction: 1.6,
          harvestYield: "6-8 kg per 1000L per year",
        },

        // ====================================================================
        // COMPLEMENTARY FISH SPECIES
        // ====================================================================
        perch: {
          commonName: "European Perch",
          scientificName: "Perca fluviatilis",
          category: "complementary",
          lifespan: "10-15 years",
          matureSize: "20-35 cm, 0.5-1.5 kg",
          matureAge: "24-36 months",
          temperatureRange: { min: 5, max: 22, optimal: 18 },
          pHRange: { min: 6.5, max: 8.0, optimal: 7.2 },
          oxygenNeed: "8-10 mg/L",
          foodConversion: 1.5,
          proteinContent: 20,
          nutritionProfile: { protein: 20, fat: 1.2, omega3: 0.4, minerals: "high" },
          role: "predator control, water quality indicator",
          climate: ["temperate", "boreal"],
          productivity: "medium",
        },
        tilapia_hybrid: {
          commonName: "Tilapia Hybrid (Gendered)",
          scientificName: "Oreochromis x Tilapia sp.",
          category: "primary-protein",
          notes: "All-male hybrids prevent unwanted breeding",
          stocking: { density: "150-180 per 1000L" },
          productivity: "very high",
        },
      },

      // ========================================================================
      // BENEFICIAL BACTERIA & MICROORGANISMS
      // ========================================================================
      bacteria: {
        nitrosomonas: {
          commonName: "Ammonia-Oxidizing Bacteria",
          scientificName: "Nitrosomonas spp.",
          category: "nitrification-stage-1",
          function: "Oxidizes ammonia (NH3) to nitrite (NO2-)",
          optimalTemp: 25,
          tempRange: { min: 5, max: 35 },
          pHRange: { min: 6.0, max: 9.0, optimal: 7.5 },
          oxygenRequirement: "aerobic",
          growthRate: "slow (doubles every 8-16 hours)",
          timeToEstablish: "3-4 weeks",
          biofilmLocation: ["biofilter", "growbed", "pipes"],
          inputSubstrate: "ammonia (NH3/NH4+)",
          outputProduct: "nitrite (NO2-)",
          competitiveFactors: ["low oxygen", "chlorine", "rapid pH change"],
          maintenanceNeeds: ["consistent water flow", "biofilter cleaning", "avoid starvation"],
        },
        nitrobacter: {
          commonName: "Nitrite-Oxidizing Bacteria",
          scientificName: "Nitrobacter spp.",
          category: "nitrification-stage-2",
          function: "Oxidizes nitrite (NO2-) to nitrate (NO3-)",
          optimalTemp: 28,
          tempRange: { min: 5, max: 38 },
          pHRange: { min: 6.0, max: 9.0, optimal: 7.5 },
          oxygenRequirement: "aerobic",
          growthRate: "very slow (doubles every 13-26 hours)",
          timeToEstablish: "2-6 weeks (after Nitrosomonas)",
          biofilmLocation: ["biofilter", "growbed"],
          inputSubstrate: "nitrite (NO2-)",
          outputProduct: "nitrate (NO3-)",
          competitiveFactors: ["low pH", "low oxygen", "high carbon"],
          maintenanceNeeds: ["stable water parameters", "adequate aeration", "biofilter maturation"],
          note: "Slowest bacteria, critical for complete nitrification cycle",
        },
        heterotrophic: {
          commonName: "Heterotrophic Bacteria",
          scientificName: "Bacillus, Pseudomonas spp.",
          category: "heterotrophic",
          function: "Decomposes organic matter, supports biofilm",
          optimalTemp: 25,
          tempRange: { min: 5, max: 40 },
          pHRange: { min: 4.0, max: 9.0 },
          oxygenRequirement: "aerobic/facultative",
          growthRate: "fast (doubles every 20-30 minutes)",
          timeToEstablish: "1-2 weeks",
          biofilmLocation: ["all surfaces", "sump", "piping"],
          role: "decomposition, biofilm matrix formation, disease suppression",
          benefits: ["quick colony establishment", "competes with pathogens", "nutrient recycling"],
        },
        actinobacteria: {
          commonName: "Actinobacteria (Filamentous)",
          scientificName: "Streptomyces, Actinomycetes spp.",
          category: "supportive",
          function: "Decomposition, antibiotic production, fungal control",
          optimalTemp: 25,
          tempRange: { min: 10, max: 35 },
          pHRange: { min: 5.5, max: 8.0 },
          oxygenRequirement: "aerobic",
          growthRate: "medium",
          role: "disease suppression, biofilm stability",
          benefits: ["antifungal compounds", "stabilizes biofilm", "organic matter breakdown"],
        },
        denitrifiers: {
          commonName: "Denitrifying Bacteria",
          scientificName: "Paracoccus, Pseudomonas, Bacillus spp.",
          category: "nitrogen-cycling",
          function: "Reduces nitrate back to nitrogen gas (incomplete cycle)",
          optimalTemp: 20,
          tempRange: { min: 5, max: 40 },
          pHRange: { min: 5.5, max: 8.0 },
          oxygenRequirement: "anaerobic or low-oxygen",
          locationPreference: "dead zones, sump bottoms",
          note: "Usually unwanted as they remove nutrients; keep biofilter aerobic",
          controlMethod: "maintain oxygen levels, avoid anaerobic pockets",
        },
      },

      // ========================================================================
      // ZOOPLANKTON & MICROORGANISMS (Water Cleaners)
      // ========================================================================
      zooplankton: {
        daphnia: {
          commonName: "Daphnia (Water Flea)",
          scientificName: "Daphnia magna, D. pulex",
          category: "water-cleaner",
          function: "Filtration feeder, removes algae, bacteria, suspended solids",
          size: "0.2-0.5 mm",
          reproductionMethod: "asexual (parthenogenesis) under good conditions",
          reproductionRate: "generation every 3-10 days at 25°C",
          diet: "algae, bacteria, suspended organic matter",
          temperatureRange: { min: 4, max: 28, optimal: 20 },
          oxygenTolerance: "moderate (can survive low-oxygen)",
          filtering: "100-300 mL water per individual per day",
          benefit: "natural water clarification, fish food source",
          introduction: "5-10 per 1000L",
          harvestMethod: "culture in separate tank, feed as live food",
        },
        copepods: {
          commonName: "Copepods",
          scientificName: "Cyclopoida, Calanoid spp.",
          category: "water-cleaner",
          function: "Microfilter, reduces suspended solids and bacteria",
          size: "0.5-2 mm",
          reproductionRate: "4-6 generations per year at 20°C",
          diet: "bacteria, algae, detritus",
          temperatureRange: { min: 5, max: 30, optimal: 22 },
          oxygenRequirement: "5+ mg/L",
          filtering: "50-200 mL water per individual per day",
          benefit: "fine filtration, disease suppression, live food",
          introduction: "10-20 per 1000L",
          lifecycle: "nauplius → copepodite → adult (10-20 days at 22°C)",
        },
        rotifer: {
          commonName: "Rotifers",
          scientificName: "Brachionus, Asplanchna spp.",
          category: "water-cleaner",
          function: "Suspension feeder, removes microalgae and bacteria",
          size: "0.2-0.5 mm",
          reproductionRate: "amictic (cloning) or mictic (sexual)",
          generationTime: "2-3 days at 25°C",
          diet: "bacteria, algae particles, dissolved organics",
          temperatureRange: { min: 6, max: 35, optimal: 25 },
          oxygenTolerance: "moderate",
          filtering: "100-500 mL per individual per day",
          benefit: "removes suspended matter, prevents green water, live food for fry",
          introduction: "culture separately, dose as needed",
        },
        cyclops: {
          commonName: "Cyclops Copepod",
          scientificName: "Cyclops vernalis, C. vicinus",
          category: "water-cleaner",
          function: "Predatory filter feeder, removes algae and bacteria",
          size: "0.5-1.5 mm",
          reproductionRate: "3-4 generations per year",
          diet: "algae, bacteria, small protozoa",
          temperatureRange: { min: 3, max: 28, optimal: 18 },
          oxygenRequirement: "5+ mg/L",
          advantage: "hardy, cold-tolerant",
          disadvantage: "can consume fish fry",
          role: "biocontrol for unwanted algae and infusoria",
        },
      },

      // ========================================================================
      // AQUATIC PLANTS & MACROPHYTES (Biofilter Enhancement)
      // ========================================================================
      plants: {
        watercress: {
          commonName: "Watercress",
          scientificName: "Nasturtium officinale",
          category: "aquatic-herb",
          growthRate: "fast",
          nutritionProfile: { vitamins: "A, C, K", minerals: "calcium, iron" },
          temperatureRange: { min: 5, max: 25, optimal: 15 },
          lightRequirement: "moderate (4-6 hrs/day)",
          function: "nutrient uptake, edible, biofilter",
          harvest: "leaf tips continuously for regeneration",
          yield: "0.5-1 kg per m² per month",
        },
        mint: {
          commonName: "Water Mint / Spearmint",
          scientificName: "Mentha aquatica / M. spicata",
          category: "aquatic-herb",
          growthRate: "fast",
          temperatureRange: { min: 3, max: 28, optimal: 22 },
          lightRequirement: "moderate (4-6 hrs/day)",
          function: "flavor additive, aromatic, biofilter",
          harvestMethod: "leaf tips every 2-3 weeks",
          spreadingRate: "aggressive (requires containment)",
        },
        azolla: {
          commonName: "Azolla (Mosquito Fern)",
          scientificName: "Azolla filiculoides",
          category: "floating-plant",
          growthRate: "very fast (doubles every 3-5 days)",
          function: "nitrogen fixation, biofilter, fish shading, insect control",
          lightRequirement: "high (6-8 hrs/day)",
          nitrogenFixation: "10-15 kg N per hectare per year",
          benefit: "bio-fertilizer for growbeds, livestock feed supplement",
          temperatureRange: { min: 8, max: 35, optimal: 25 },
          harvestMethod: "skim surface weekly, use as compost or feed",
        },
        waterhyacinth: {
          commonName: "Water Hyacinth",
          scientificName: "Eichhornia crassipes",
          category: "floating-plant",
          growthRate: "very fast (doubles every 14 days)",
          function: "nitrogen extraction, phytoremediation, biofilter",
          lightRequirement: "high (6+ hrs/day)",
          nitrogenRemoval: "very effective",
          temperatureRange: { min: 5, max: 35, optimal: 25 },
          benefits: ["water purification", "emergency food/bedding", "biocontrol"],
          warning: "highly invasive in natural systems, must contain",
          spreadingRate: "aggressive",
        },
        duckweed: {
          commonName: "Duckweed",
          scientificName: "Lemna minor",
          category: "floating-plant",
          growthRate: "very fast (doubles every 5-7 days)",
          size: "0.3-0.8 cm",
          function: "nutrient uptake, biofilter, fish food/shade",
          nitrogenRemoval: "20-30 kg per hectare per year",
          lightRequirement: "moderate (3-4 hrs/day)",
          temperatureRange: { min: 5, max: 30, optimal: 20 },
          harvestMethod: "skim 30% weekly",
          uses: ["livestock feed", "fertilizer", "biofilter"],
        },
        salvinia: {
          commonName: "Salvinia (Floating Fern)",
          scientificName: "Salvinia minima, S. auriculata",
          category: "floating-plant",
          growthRate: "fast (doubles every 7-10 days)",
          function: "nutrient uptake, water surface cover, pest deterrent",
          lightRequirement: "high (6+ hrs/day)",
          nitrogenRemoval: "moderate",
          temperatureRange: { min: 10, max: 35, optimal: 25 },
          advantage: "attractive, forms insect barrier",
          disadvantage: "can clog intake pipes",
        },
      },

      // ========================================================================
      // PROTOZOANS & MICROBES (Disease Suppression)
      // ========================================================================
      protozoans: {
        tetrahymena: {
          commonName: "Tetrahymena",
          scientificName: "Tetrahymena pyriformis",
          category: "protective-protozoan",
          function: "Predatory ciliate, consumes pathogenic bacteria",
          size: "40-50 micrometers",
          diet: "bacteria (including pathogens)",
          reproductionRate: "binary fission every 2-3 hours at 25°C",
          benefit: "reduces pathogenic bacteria naturally",
          optimal: "established biofilms with adequate bacteria",
        },
        paramecium: {
          commonName: "Paramecium",
          scientificName: "Paramecium caudatum",
          category: "protective-protozoan",
          function: "Ciliate predator, reduces suspended bacteria",
          size: "100-300 micrometers",
          diet: "bacteria, small algae",
          reproductionRate: "binary fission every 4-6 hours",
          benefit: "biological disease suppression",
          appearance: "indicator of healthy biofilm",
        },
        vorticella: {
          commonName: "Vorticella (Bell Animalcule)",
          scientificName: "Vorticella spp.",
          category: "protective-protozoan",
          function: "Sessile ciliate, filters bacteria from water",
          appearance: "bell-shaped on stalk, flowers on biofilm",
          diet: "suspended bacteria",
          benefit: "visual indicator of healthy biofilter",
          indication: "presence indicates mature, stable biofilm",
        },
      },

      // ========================================================================
      // INSECTS & NATURAL CONTROLLERS
      // ========================================================================
      insects: {
        dragonfly_nymph: {
          commonName: "Dragonfly Nymph",
          scientificName: "Odonata spp. (aquatic)",
          category: "predatory-insect",
          function: "Predates mosquito larvae, small flies, gnats",
          role: "natural pest control",
          advantage: "very effective predator",
          disadvantage: "can consume fish fry, aquatic insect larvae",
          stocking: "1-3 per 1000L",
          benefit: "eliminates disease vector insects (mosquitoes)",
        },
        amphipod: {
          commonName: "Freshwater Shrimp / Amphipod",
          scientificName: "Gammarus spp.",
          category: "detritivore",
          function: "Removes dead organic matter, detritus",
          size: "5-20 mm",
          reproductionRate: "slow",
          diet: "detritus, algae, dead plant matter",
          benefit: "biofilter cleaner, fish food, waste decomposition",
          stocking: "5-10 per 1000L",
        },
        isopod: {
          commonName: "Aquatic Isopod / Sow Bug",
          scientificName: "Asellus aquaticus",
          category: "detritivore",
          function: "Consumes detritus and biofilm buildup",
          size: "10-20 mm",
          reproductionRate: "moderate",
          diet: "dead plant material, biofilm, algae",
          benefit: "biofilter maintenance, waste reduction",
          stocking: "5-15 per 1000L",
        },
      },

      // ========================================================================
      // CRAYFISH & CRUSTACEANS (Dual Purpose)
      // ========================================================================
      crustaceans: {
        redclaw: {
          commonName: "Red Claw Crayfish",
          scientificName: "Cherax quadricarinatus",
          category: "aquatic-protein",
          lifespan: "10-12 years",
          size: "20-30 cm, 0.5-1.5 kg mature",
          matureAge: "12-18 months",
          temperatureRange: { min: 15, max: 32, optimal: 26 },
          pHRange: { min: 6.5, max: 8.5, optimal: 7.5 },
          diet: "omnivorous (vegetables, pellets, fish waste)",
          function: "protein source, biofilter cleaner, waste processor",
          stocking: "20-40 per 1000L",
          yields: "2-4 kg per 1000L per year",
          proteinContent: 18,
          benefit: "low water requirements, hardy, high-value protein",
          warning: "aggressive, may consume plants and smaller organisms",
        },
        marron: {
          commonName: "Marron",
          scientificName: "Cherax tenuimanus",
          category: "aquatic-protein",
          lifespan: "12-15 years",
          size: "15-25 cm, 0.3-1 kg",
          temperatureRange: { min: 8, max: 26, optimal: 20 },
          pHRange: { min: 6.5, max: 8.0, optimal: 7.2 },
          diet: "omnivorous",
          yields: "1.5-3 kg per 1000L per year",
          advantage: "can tolerate cooler climates",
        },
      },
    };
  }

  // ============================================================================
  // ECOSYSTEM INITIALIZATION
  // ============================================================================

  initializeEcosystems() {
    const presetEcosystems = {
      "high-yield-tropical": {
        name: "High-Yield Tropical Aquaponics",
        description: "Maximized production for tropical climates",
        primaryFish: ["tilapia", "catfish"],
        fishStocking: {
          tilapia: 120,
          catfish: 150,
        },
        totalBioload: 2.6, // kg nitrogen per 1000L per day
        bacteria: ["nitrosomonas", "nitrobacter", "heterotrophic", "actinobacteria"],
        zooplankton: ["daphnia", "copepods", "rotifer"],
        plants: ["azolla", "waterhyacinth", "duckweed"],
        crustaceans: ["redclaw"],
        climate: "tropical",
        expectedYield: "25-30 kg fish + 15-20 kg vegetables per 1000L per year",
        nutritionContribution: { protein: "high", variety: "high" },
      },
      "balanced-temperate": {
        name: "Balanced Temperate System",
        description: "Sustainable production for temperate climates",
        primaryFish: ["trout", "perch", "carp"],
        fishStocking: {
          trout: 60,
          perch: 40,
          carp: 20,
        },
        totalBioload: 1.8,
        bacteria: ["nitrosomonas", "nitrobacter", "heterotrophic"],
        zooplankton: ["copepods", "cyclops", "daphnia"],
        plants: ["watercress", "mint", "duckweed"],
        climate: "temperate",
        expectedYield: "15-18 kg fish + 20-25 kg vegetables per 1000L per year",
        nutritionContribution: { protein: "high", variety: "medium" },
      },
      "premium-barramundi": {
        name: "Premium Barramundi System",
        description: "High-value protein production",
        primaryFish: ["barramundi"],
        fishStocking: {
          barramundi: 80,
        },
        totalBioload: 2.4,
        bacteria: ["nitrosomonas", "nitrobacter", "heterotrophic", "actinobacteria"],
        zooplankton: ["copepods", "rotifers"],
        plants: ["azolla", "duckweed"],
        crustaceans: ["redclaw"],
        climate: "tropical",
        expectedYield: "16-18 kg fish + 12-15 kg vegetables per 1000L per year",
        premiumMarketValue: "high",
      },
      "cool-water-minimal": {
        name: "Cool-Water Minimal System",
        description: "Boreal/minimal resource system",
        primaryFish: ["carp"],
        fishStocking: {
          carp: 30,
        },
        totalBioload: 1.2,
        bacteria: ["nitrosomonas", "nitrobacter"],
        zooplankton: ["cyclops"],
        plants: ["watercress", "duckweed"],
        climate: "boreal",
        resourceIntensity: "low",
        expectedYield: "6-8 kg fish + 12-15 kg vegetables per 1000L per year",
      },
    };

    this.ecosystems = presetEcosystems;
  }

  // ============================================================================
  // ECOSYSTEM MANAGEMENT METHODS
  // ============================================================================

  // Get ecosystem preset
  getEcosystem(presetName) {
    return this.ecosystems[presetName] || null;
  }

  // Get all available ecosystems
  getAllEcosystems() {
    return Object.values(this.ecosystems);
  }

  // Get fish species by category
  getFishByCategory(category) {
    return Object.values(this.database.fish).filter(fish => fish.category === category);
  }

  // Get fish suitable for climate zone
  getFishForClimate(climateZone) {
    return Object.entries(this.database.fish)
      .filter(([_, fish]) => fish.climate && fish.climate.includes(climateZone))
      .reduce((acc, [key, fish]) => ({ ...acc, [key]: fish }), {});
  }

  // Get individual species profile
  getSpeciesProfile(speciesName) {
    // Check fish
    if (this.database.fish[speciesName]) {
      return { category: "fish", data: this.database.fish[speciesName] };
    }
    // Check bacteria
    if (this.database.bacteria[speciesName]) {
      return { category: "bacteria", data: this.database.bacteria[speciesName] };
    }
    // Check zooplankton
    if (this.database.zooplankton[speciesName]) {
      return { category: "zooplankton", data: this.database.zooplankton[speciesName] };
    }
    // Check plants
    if (this.database.plants[speciesName]) {
      return { category: "plant", data: this.database.plants[speciesName] };
    }
    // Check protozoans
    if (this.database.protozoans[speciesName]) {
      return { category: "protozoan", data: this.database.protozoans[speciesName] };
    }
    // Check insects
    if (this.database.insects[speciesName]) {
      return { category: "insect", data: this.database.insects[speciesName] };
    }
    // Check crustaceans
    if (this.database.crustaceans[speciesName]) {
      return { category: "crustacean", data: this.database.crustaceans[speciesName] };
    }
    return null;
  }

  // Calculate ecosystem nitrogen production
  calculateBioload(fishSpecies, fishCounts) {
    let totalBioload = 0;
    Object.keys(fishCounts).forEach(species => {
      const count = fishCounts[species];
      const speciesData = this.database.fish[species];
      if (speciesData && speciesData.nitrogenProduction) {
        totalBioload += (speciesData.nitrogenProduction / 100) * count;
      }
    });
    return totalBioload;
  }

  // Calculate total projected yield
  getProjectedYield(ecosystemPreset) {
    const ecosystem = this.ecosystems[ecosystemPreset];
    if (!ecosystem) return null;

    const yieldText = ecosystem.expectedYield;
    return {
      system: ecosystem.name,
      yield: yieldText,
      sustainability: ecosystem.expectedYield.includes("25-30") ? "very high" : "high",
    };
  }

  // Get bacteria establishment timeline
  getBacteriaTimeline() {
    return {
      week1: {
        day1_3: "Heterotrophic bacteria colonize (fast)",
        day4_7: "Water becomes clearer, biofilm forming",
      },
      week2_3: {
        day8_21: "Nitrosomonas establishes (slow), ammonia begins converting",
        ammoniaPeak: "Day 5-10, then gradually declines",
      },
      week4_6: {
        day22_42: "Nitrobacter establishes (very slow), nitrite begins converting",
        nitritePeak: "Day 20-30, then gradually declines",
      },
      week7_8: {
        cycleComplete: "Full nitrification cycle complete",
        readiness: "System ready for full stocking",
      },
      recommendation: "Weekly water testing essential; do not overstock during cycling",
    };
  }

  // Get aquatic life recommendations for specific goal
  getRecommendationsForGoal(goal) {
    const recommendations = {
      "maximum-protein": {
        fish: ["catfish", "tilapia", "barramundi"],
        stocking: "high (200-300 per 1000L for catfish)",
        yield: "20-30 kg per 1000L per year",
        maintenance: "high",
        note: "Daily monitoring required for water quality",
      },
      "premium-nutrition": {
        fish: ["barramundi", "trout"],
        yield: "15-18 kg premium fish per 1000L per year",
        nutrition: "omega-3 rich, high-value protein",
        maintenance: "very high",
      },
      "ecosystem-balance": {
        fish: ["tilapia", "perch"],
        complexity: "moderate",
        stability: "high",
        yield: "15-20 kg fish + vegetables",
        resilience: "very good disease resistance",
      },
      "minimal-resource": {
        fish: ["carp"],
        stocking: "low-medium (30-50 per 1000L)",
        maintenance: "low",
        yield: "6-10 kg fish per year",
        advantage: "cold-tolerant, hardy",
      },
      "disease-suppression": {
        bacteria: ["nitrosomonas", "nitrobacter", "heterotrophic", "actinobacteria"],
        protozoans: ["tetrahymena", "paramecium", "vorticella"],
        zooplankton: ["copepods", "rotifers"],
        strategy: "biological biocontrol, competitive exclusion",
      },
      "water-quality-control": {
        zooplankton: ["daphnia", "copepods", "rotifer"],
        plants: ["azolla", "waterhyacinth", "duckweed"],
        strategy: "continuous filtration and nutrient uptake",
        benefit: "algae prevention, turbidity reduction",
      },
    };
    return recommendations[goal] || null;
  }

  // Initialize population tracking
  createPopulation(systemId, species, count, date = new Date()) {
    const population = {
      id: Date.now(),
      systemId,
      species,
      count,
      dateIntroduced: date.toISOString(),
      health: "good",
      growth: [],
      mortality: [],
      reproduction: [],
      lastUpdated: date.toISOString(),
    };
    this.populations.push(population);
    sofieCore.getService("logger").info("[AquaticLifeService] Population created", { species, count });
    return population;
  }

  // Track health metrics
  updateHealthMetrics(systemId, metrics) {
    const health = {
      id: Date.now(),
      systemId,
      timestamp: new Date().toISOString(),
      temperatureC: metrics.temperature || 26,
      pH: metrics.pH || 7.5,
      ammonia: metrics.ammonia || 0.25,
      nitrite: metrics.nitrite || 0.05,
      nitrate: metrics.nitrate || 50,
      dissolvedOxygen: metrics.dissolvedOxygen || 7,
      conductivity: metrics.conductivity || 1200,
      observations: metrics.observations || "",
    };
    this.healthMetrics.push(health);
    return health;
  }

  // Get all population records
  getPopulations() {
    return this.populations;
  }

  // Get health history for system
  getHealthHistory(systemId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return this.healthMetrics.filter(h => 
      h.systemId === systemId && new Date(h.timestamp) >= cutoffDate
    );
  }

  // Get species compatibility
  checkCompatibility(species1, species2) {
    const profile1 = this.getSpeciesProfile(species1);
    const profile2 = this.getSpeciesProfile(species2);

    if (!profile1 || !profile2) return null;

    // Basic compatibility logic
    if (profile1.category === "fish" && profile2.category === "fish") {
      // Check temperature overlap
      const temp1 = profile1.data.temperatureRange;
      const temp2 = profile2.data.temperatureRange;
      const tempOverlap = !(temp1.max < temp2.min || temp2.max < temp1.min);

      // Check pH overlap
      const ph1 = profile1.data.pHRange;
      const ph2 = profile2.data.pHRange;
      const phOverlap = !(ph1.max < ph2.min || ph2.max < ph1.min);

      return {
        compatible: tempOverlap && phOverlap,
        temperatureOverlap: tempOverlap,
        phOverlap: phOverlap,
        note: tempOverlap && phOverlap ? "Compatible" : "Requires special conditions",
      };
    }

    return { compatible: true, note: "Different categories, generally compatible" };
  }

  // Get database overview
  getDatabaseOverview() {
    return {
      fishSpecies: Object.keys(this.database.fish).length,
      bacteriaSpecies: Object.keys(this.database.bacteria).length,
      zooplanktonSpecies: Object.keys(this.database.zooplankton).length,
      plantSpecies: Object.keys(this.database.plants).length,
      protozoans: Object.keys(this.database.protozoans).length,
      insects: Object.keys(this.database.insects).length,
      crustaceans: Object.keys(this.database.crustaceans).length,
      totalSpecies: Object.keys(this.database.fish).length + 
                   Object.keys(this.database.bacteria).length +
                   Object.keys(this.database.zooplankton).length +
                   Object.keys(this.database.plants).length +
                   Object.keys(this.database.protozoans).length +
                   Object.keys(this.database.insects).length +
                   Object.keys(this.database.crustaceans).length,
      presetEcosystems: Object.keys(this.ecosystems).length,
    };
  }

  // Get beginner-friendly fish species
  getBeginnerFriendlyFish() {
    const beginnerFriendly = [];
    Object.entries(this.database.fish).forEach(([key, species]) => {
      if (species.diseaseResistance === "high" || species.productivity === "high" || species.productivity === "very high") {
        beginnerFriendly.push({
          id: key,
          ...species,
        });
      }
    });
    return beginnerFriendly;
  }

  // Get fish species by climate zone
  getSpeciesByClimate(climateZone) {
    const species = [];
    Object.entries(this.database.fish).forEach(([key, fish]) => {
      if (fish.climate && fish.climate.includes(climateZone)) {
        species.push({
          id: key,
          ...fish,
        });
      }
    });
    return species;
  }
}

export default AquaticLifeService;
