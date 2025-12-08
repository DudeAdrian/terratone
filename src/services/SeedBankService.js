// src/services/SeedBankService.js

/**
 * Seed Bank Service
 * Manages community seed library, preservation, and sharing network
 */

class SeedBankService {
  constructor() {
    this.name = "SeedBank";
    
    this.seedInventory = [
      {
        id: "seed-001",
        name: "Heirloom Tomato - Cherokee Purple",
        category: "Vegetables",
        type: "Heirloom",
        quantity: 450, // seed count
        unit: "seeds",
        viability: 95, // percentage
        harvestYear: 2025,
        expiryYear: 2028,
        source: "Community Garden",
        origin: "Tennessee, USA",
        growingZone: "4-10",
        daysToMaturity: 80,
        status: "available",
        checkoutsYTD: 12,
        germRate: 92
      },
      {
        id: "seed-002",
        name: "Rainbow Chard",
        category: "Vegetables",
        type: "Heirloom",
        quantity: 320,
        unit: "seeds",
        viability: 98,
        harvestYear: 2025,
        expiryYear: 2029,
        source: "Local Farm Partnership",
        origin: "Oregon, USA",
        growingZone: "3-10",
        daysToMaturity: 55,
        status: "available",
        checkoutsYTD: 18,
        germRate: 94
      },
      {
        id: "seed-003",
        name: "Blue Corn - Hopi",
        category: "Grains",
        type: "Indigenous/Heirloom",
        quantity: 280,
        unit: "seeds",
        viability: 90,
        harvestYear: 2024,
        expiryYear: 2027,
        source: "Seed Exchange Network",
        origin: "Arizona, USA",
        growingZone: "5-10",
        daysToMaturity: 110,
        status: "available",
        checkoutsYTD: 8,
        germRate: 88
      },
      {
        id: "seed-004",
        name: "Butternut Squash - Waltham",
        category: "Vegetables",
        type: "Open-Pollinated",
        quantity: 195,
        unit: "seeds",
        viability: 93,
        harvestYear: 2025,
        expiryYear: 2031,
        source: "Community Harvest",
        origin: "Massachusetts, USA",
        growingZone: "3-9",
        daysToMaturity: 105,
        status: "available",
        checkoutsYTD: 15,
        germRate: 91
      },
      {
        id: "seed-005",
        name: "Basil - Genovese",
        category: "Herbs",
        type: "Heirloom",
        quantity: 580,
        unit: "seeds",
        viability: 97,
        harvestYear: 2025,
        expiryYear: 2028,
        source: "Community Garden",
        origin: "Italy",
        growingZone: "4-11",
        daysToMaturity: 60,
        status: "available",
        checkoutsYTD: 24,
        germRate: 96
      },
      {
        id: "seed-006",
        name: "Sunflower - Mammoth",
        category: "Flowers",
        type: "Open-Pollinated",
        quantity: 410,
        unit: "seeds",
        viability: 94,
        harvestYear: 2025,
        expiryYear: 2028,
        source: "Community Harvest",
        origin: "Kansas, USA",
        growingZone: "2-11",
        daysToMaturity: 80,
        status: "available",
        checkoutsYTD: 20,
        germRate: 92
      },
      {
        id: "seed-007",
        name: "Purple Hull Peas",
        category: "Legumes",
        type: "Heirloom",
        quantity: 340,
        unit: "seeds",
        viability: 91,
        harvestYear: 2024,
        expiryYear: 2027,
        source: "Seed Swap",
        origin: "Louisiana, USA",
        growingZone: "3-11",
        daysToMaturity: 70,
        status: "available",
        checkoutsYTD: 11,
        germRate: 89
      },
      {
        id: "seed-008",
        name: "Lacinato Kale - Dinosaur",
        category: "Vegetables",
        type: "Heirloom",
        quantity: 275,
        unit: "seeds",
        viability: 96,
        harvestYear: 2025,
        expiryYear: 2029,
        source: "Community Garden",
        origin: "Tuscany, Italy",
        growingZone: "2-11",
        daysToMaturity: 62,
        status: "available",
        checkoutsYTD: 19,
        germRate: 94
      },
      {
        id: "seed-009",
        name: "Cilantro - Slow Bolt",
        category: "Herbs",
        type: "Open-Pollinated",
        quantity: 450,
        unit: "seeds",
        viability: 88,
        harvestYear: 2024,
        expiryYear: 2026,
        source: "Local Farm",
        origin: "Mediterranean",
        growingZone: "3-11",
        daysToMaturity: 50,
        status: "low-stock",
        checkoutsYTD: 28,
        germRate: 85
      },
      {
        id: "seed-010",
        name: "Quinoa - Rainbow",
        category: "Grains",
        type: "Heirloom",
        quantity: 520,
        unit: "seeds",
        viability: 95,
        harvestYear: 2025,
        expiryYear: 2029,
        source: "Seed Exchange Network",
        origin: "Peru",
        growingZone: "4-10",
        daysToMaturity: 120,
        status: "available",
        checkoutsYTD: 7,
        germRate: 93
      }
    ];

    this.checkouts = [
      {
        id: "co-001",
        seedId: "seed-001",
        seedName: "Heirloom Tomato - Cherokee Purple",
        borrower: "Sarah Chen",
        quantityBorrowed: 15,
        checkoutDate: "2025-11-01",
        dueDate: "2026-03-01",
        returnedDate: null,
        status: "active",
        pledgedReturn: 30 // seeds to return after harvest
      },
      {
        id: "co-002",
        seedId: "seed-005",
        seedName: "Basil - Genovese",
        borrower: "Marcus Johnson",
        quantityBorrowed: 20,
        checkoutDate: "2025-10-15",
        dueDate: "2026-02-15",
        returnedDate: "2025-12-01",
        status: "returned",
        pledgedReturn: 40,
        actualReturn: 45
      }
    ];

    this.seedExchangeNetwork = [
      {
        community: "Harmonic Habitats - Valley Site",
        location: "California, USA",
        coordinates: { lat: 37.7749, lng: -122.4194 },
        role: "hub",
        seedsShared: 1250,
        seedsReceived: 890,
        specialties: ["Mediterranean herbs", "Drought-resistant vegetables"],
        lastExchange: "2025-11-20",
        status: "active"
      },
      {
        community: "Green Earth Collective",
        location: "Vermont, USA",
        coordinates: { lat: 44.2601, lng: -72.5754 },
        role: "partner",
        seedsShared: 340,
        seedsReceived: 580,
        specialties: ["Cold-hardy crops", "Root vegetables"],
        lastExchange: "2025-10-15",
        status: "active"
      },
      {
        community: "Desert Bloom Co-op",
        location: "Arizona, USA",
        coordinates: { lat: 33.4484, lng: -112.0740 },
        role: "partner",
        seedsShared: 420,
        seedsReceived: 310,
        specialties: ["Desert-adapted plants", "Indigenous seeds"],
        lastExchange: "2025-11-05",
        status: "active"
      },
      {
        community: "Pacific Roots Network",
        location: "Oregon, USA",
        coordinates: { lat: 45.5152, lng: -122.6784 },
        role: "partner",
        seedsShared: 290,
        seedsReceived: 425,
        specialties: ["Forest gardens", "Perennials"],
        lastExchange: "2025-09-28",
        status: "active"
      }
    ];

    this.preservationProjects = [
      {
        id: "pres-001",
        name: "Indigenous Corn Varieties",
        description: "Preserving 5 traditional corn varieties from Native American heritage",
        varieties: 5,
        status: "active",
        startDate: "2024-06-15",
        participants: 8,
        successRate: 94
      },
      {
        id: "pres-002",
        name: "Rare Medicinal Herbs",
        description: "Conservation of endangered medicinal plant seeds",
        varieties: 12,
        status: "active",
        startDate: "2025-03-01",
        participants: 6,
        successRate: 87
      },
      {
        id: "pres-003",
        name: "Climate-Resilient Varieties",
        description: "Breeding and selecting heat and drought tolerant varieties",
        varieties: 8,
        status: "active",
        startDate: "2024-01-10",
        participants: 10,
        successRate: 91
      }
    ];

    this.metrics = {
      totalSeedsInBank: 4320,
      totalVarieties: 10,
      categoriesRepresented: 5,
      averageViability: 93,
      activeCheckouts: 1,
      totalCheckoutsYTD: 162,
      seedsSharedGlobally: 2300,
      seedsReceivedGlobally: 2205,
      networkCommunities: 4,
      preservationProjects: 3
    };
  }

  init(core) {
    this.core = core;
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    
    const savedData = this.storage?.load("seed_bank");
    if (savedData) {
      this.seedInventory = savedData.inventory || this.seedInventory;
      this.checkouts = savedData.checkouts || this.checkouts;
    }
    
    this.logger?.info("SeedBankService initialized");
  }

  getSeedInventory() {
    return this.seedInventory;
  }

  getSeedsByCategory(category) {
    return this.seedInventory.filter(s => s.category === category);
  }

  getSeed(seedId) {
    return this.seedInventory.find(s => s.id === seedId);
  }

  getCheckouts() {
    return this.checkouts;
  }

  getActiveCheckouts() {
    return this.checkouts.filter(c => c.status === "active");
  }

  getSeedExchangeNetwork() {
    return this.seedExchangeNetwork;
  }

  getPreservationProjects() {
    return this.preservationProjects;
  }

  getMetrics() {
    return this.metrics;
  }

  checkoutSeed(seedId, borrower, quantity, pledgedReturn) {
    const seed = this.getSeed(seedId);
    if (!seed) return { success: false, error: "Seed not found" };
    
    if (seed.quantity < quantity) {
      return { success: false, error: "Insufficient seed quantity" };
    }

    seed.quantity -= quantity;
    seed.checkoutsYTD += 1;

    const checkout = {
      id: `co-${String(this.checkouts.length + 1).padStart(3, '0')}`,
      seedId,
      seedName: seed.name,
      borrower,
      quantityBorrowed: quantity,
      checkoutDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 120 days
      returnedDate: null,
      status: "active",
      pledgedReturn
    };

    this.checkouts.push(checkout);
    this.metrics.activeCheckouts += 1;
    this.saveData();
    
    this.logger?.info(`${borrower} checked out ${quantity} ${seed.name} seeds`);
    
    return { success: true, checkout };
  }

  returnSeed(checkoutId, quantityReturned) {
    const checkout = this.checkouts.find(c => c.id === checkoutId);
    if (!checkout) return { success: false, error: "Checkout not found" };

    const seed = this.getSeed(checkout.seedId);
    if (!seed) return { success: false, error: "Seed not found" };

    checkout.status = "returned";
    checkout.returnedDate = new Date().toISOString().split('T')[0];
    checkout.actualReturn = quantityReturned;

    seed.quantity += quantityReturned;
    this.metrics.activeCheckouts -= 1;

    this.saveData();
    
    this.logger?.info(`Returned ${quantityReturned} ${seed.name} seeds from ${checkout.borrower}`);
    
    return { success: true, checkout };
  }

  addSeedVariety(seedData) {
    const newSeed = {
      id: `seed-${String(this.seedInventory.length + 1).padStart(3, '0')}`,
      ...seedData,
      checkoutsYTD: 0,
      status: "available"
    };

    this.seedInventory.push(newSeed);
    this.metrics.totalVarieties += 1;
    this.metrics.totalSeedsInBank += seedData.quantity;

    this.saveData();
    
    return { success: true, seed: newSeed };
  }

  updateSeedQuantity(seedId, quantity, operation = "add") {
    const seed = this.getSeed(seedId);
    if (!seed) return { success: false, error: "Seed not found" };

    if (operation === "add") {
      seed.quantity += quantity;
      this.metrics.totalSeedsInBank += quantity;
    } else if (operation === "subtract") {
      if (seed.quantity < quantity) {
        return { success: false, error: "Insufficient quantity" };
      }
      seed.quantity -= quantity;
      this.metrics.totalSeedsInBank -= quantity;
    }

    // Update status based on quantity
    if (seed.quantity < 100) {
      seed.status = "low-stock";
    } else if (seed.quantity === 0) {
      seed.status = "out-of-stock";
    } else {
      seed.status = "available";
    }

    this.saveData();
    
    return { success: true, seed };
  }

  getCategories() {
    const categories = [...new Set(this.seedInventory.map(s => s.category))];
    return categories.map(cat => ({
      name: cat,
      count: this.seedInventory.filter(s => s.category === cat).length,
      totalSeeds: this.seedInventory.filter(s => s.category === cat).reduce((sum, s) => sum + s.quantity, 0)
    }));
  }

  getLowStockSeeds() {
    return this.seedInventory.filter(s => s.quantity < 100 || s.status === "low-stock");
  }

  getExpiringSeeds(months = 12) {
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear + Math.floor(months / 12);
    
    return this.seedInventory.filter(s => s.expiryYear <= targetYear);
  }

  shareSeedsWithNetwork(communityName, seedId, quantity) {
    const seed = this.getSeed(seedId);
    if (!seed || seed.quantity < quantity) {
      return { success: false, error: "Insufficient seeds for sharing" };
    }

    const community = this.seedExchangeNetwork.find(c => c.community === communityName);
    if (!community) {
      return { success: false, error: "Community not found in network" };
    }

    seed.quantity -= quantity;
    community.seedsReceived += quantity;
    community.lastExchange = new Date().toISOString().split('T')[0];
    this.metrics.seedsSharedGlobally += quantity;

    this.saveData();
    
    return { success: true, message: `Shared ${quantity} ${seed.name} seeds with ${communityName}` };
  }

  saveData() {
    this.storage?.save("seed_bank", {
      inventory: this.seedInventory,
      checkouts: this.checkouts
    });
  }
}

export default SeedBankService;
