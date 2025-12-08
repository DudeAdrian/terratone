// src/services/GlobalNetworkService.js

import BaseService from "../core/BaseService";

/**
 * Global Network Service
 * Manages worldwide network of Harmonic Habitats communities and Sofie Systems deployments
 * 
 * @extends BaseService
 * @provides {Object} Global metrics, community data, energy trading
 * @requires StorageService, LoggerService
 */

class GlobalNetworkService extends BaseService {
  constructor() {
    super();
    this.name = "GlobalNetwork";
    
    // Community-to-community trading data
    this.resourceOffers = []; // { id, communityId, resource, quantity, available, price }
    this.resourceRequests = []; // { id, communityId, resource, quantity, urgency }
    this.tradeHistory = []; // { id, fromCommunity, toCommunity, resource, quantity, date }
    // Energy credits ledger per community
    this.energyLedger = {}; // { [communityId]: { balance, reserve, unit: 'kWh' } }
    
    this.communities = [
      {
        id: "comm-001",
        name: "Harmonic Habitats - Valley Site",
        location: "Northern California, USA",
        coordinates: { lat: 37.7749, lng: -122.4194 },
        established: "2022-03-15",
        population: 450,
        capacity: 500,
        status: "operational",
        sofieVersion: "1.0.0",
        tier: "hub",
        specializations: ["Solar energy", "Aquaponics", "Tech innovation"],
        energySelfSufficiency: 98,
        foodSelfSufficiency: 85,
        waterSelfSufficiency: 71,
        carbonNeutral: true,
        connectedCommunities: 8,
        lastSync: "2025-12-07",
        achievements: ["First deployment", "100% renewable", "Model community"]
      },
      {
        id: "comm-002",
        name: "Green Earth Collective",
        location: "Vermont, USA",
        coordinates: { lat: 44.2601, lng: -72.5754 },
        established: "2023-06-20",
        population: 320,
        capacity: 400,
        status: "operational",
        sofieVersion: "1.0.0",
        tier: "regional",
        specializations: ["Forest farming", "Winter resilience", "Maple production"],
        energySelfSufficiency: 92,
        foodSelfSufficiency: 78,
        waterSelfSufficiency: 85,
        carbonNeutral: true,
        connectedCommunities: 5,
        lastSync: "2025-12-06",
        achievements: ["Cold climate pioneer", "Forest integration"]
      },
      {
        id: "comm-003",
        name: "Desert Bloom Co-op",
        location: "Arizona, USA",
        coordinates: { lat: 33.4484, lng: -112.0740 },
        established: "2023-09-10",
        population: 280,
        capacity: 350,
        status: "operational",
        sofieVersion: "0.9.5",
        tier: "regional",
        specializations: ["Desert permaculture", "Water conservation", "Indigenous knowledge"],
        energySelfSufficiency: 95,
        foodSelfSufficiency: 72,
        waterSelfSufficiency: 68,
        carbonNeutral: true,
        connectedCommunities: 6,
        lastSync: "2025-12-05",
        achievements: ["Desert innovation", "Water efficiency leader"]
      },
      {
        id: "comm-004",
        name: "Pacific Roots Network",
        location: "Oregon, USA",
        coordinates: { lat: 45.5152, lng: -122.6784 },
        established: "2024-01-05",
        population: 380,
        capacity: 450,
        status: "operational",
        sofieVersion: "1.0.0",
        tier: "regional",
        specializations: ["Rainwater systems", "Urban integration", "Composting"],
        energySelfSufficiency: 88,
        foodSelfSufficiency: 81,
        waterSelfSufficiency: 92,
        carbonNeutral: true,
        connectedCommunities: 7,
        lastSync: "2025-12-07",
        achievements: ["Urban model", "Rainfall champion"]
      },
      {
        id: "comm-005",
        name: "Terra Nova Settlement",
        location: "British Columbia, Canada",
        coordinates: { lat: 49.2827, lng: -123.1207 },
        established: "2024-04-12",
        population: 215,
        capacity: 300,
        status: "growing",
        sofieVersion: "1.0.0",
        tier: "local",
        specializations: ["Coastal resilience", "Kelp farming", "Tidal energy"],
        energySelfSufficiency: 85,
        foodSelfSufficiency: 68,
        waterSelfSufficiency: 95,
        carbonNeutral: false,
        connectedCommunities: 4,
        lastSync: "2025-12-06",
        achievements: ["Coastal pioneer", "Ocean integration"]
      },
      {
        id: "comm-006",
        name: "Sunshine Community",
        location: "Queensland, Australia",
        coordinates: { lat: -27.4698, lng: 153.0251 },
        established: "2024-07-22",
        population: 340,
        capacity: 420,
        status: "operational",
        sofieVersion: "0.9.8",
        tier: "regional",
        specializations: ["Tropical permaculture", "Cyclone resilience", "Solar thermal"],
        energySelfSufficiency: 96,
        foodSelfSufficiency: 89,
        waterSelfSufficiency: 74,
        carbonNeutral: true,
        connectedCommunities: 6,
        lastSync: "2025-12-07",
        achievements: ["Tropical leader", "Disaster resilience"]
      },
      {
        id: "comm-007",
        name: "Fjord Commons",
        location: "Norway",
        coordinates: { lat: 60.3913, lng: 5.3221 },
        established: "2024-09-30",
        population: 195,
        capacity: 250,
        status: "growing",
        sofieVersion: "1.0.0",
        tier: "local",
        specializations: ["Hydropower", "Arctic growing", "Fish farming"],
        energySelfSufficiency: 100,
        foodSelfSufficiency: 65,
        waterSelfSufficiency: 100,
        carbonNeutral: true,
        connectedCommunities: 3,
        lastSync: "2025-12-05",
        achievements: ["100% renewable", "Arctic innovation"]
      },
      {
        id: "comm-008",
        name: "Ubuntu Village",
        location: "Western Cape, South Africa",
        coordinates: { lat: -33.9249, lng: 18.4241 },
        established: "2024-11-15",
        population: 425,
        capacity: 500,
        status: "operational",
        sofieVersion: "1.0.0",
        tier: "hub",
        specializations: ["Social enterprise", "Drought adaptation", "Community governance"],
        energySelfSufficiency: 91,
        foodSelfSufficiency: 76,
        waterSelfSufficiency: 62,
        carbonNeutral: false,
        connectedCommunities: 5,
        lastSync: "2025-12-06",
        achievements: ["African pioneer", "Governance model"]
      },
      {
        id: "comm-009",
        name: "Selva Collective",
        location: "Costa Rica",
        coordinates: { lat: 9.7489, lng: -83.7534 },
        established: "2025-02-20",
        population: 180,
        capacity: 250,
        status: "growing",
        sofieVersion: "1.0.0",
        tier: "local",
        specializations: ["Rainforest integration", "Biodiversity", "Ecotourism"],
        energySelfSufficiency: 87,
        foodSelfSufficiency: 92,
        waterSelfSufficiency: 98,
        carbonNeutral: true,
        connectedCommunities: 4,
        lastSync: "2025-12-04",
        achievements: ["Biodiversity champion", "Rainforest model"]
      },
      {
        id: "comm-010",
        name: "Alpine Harmony",
        location: "Swiss Alps, Switzerland",
        coordinates: { lat: 46.8182, lng: 8.2275 },
        established: "2025-05-10",
        population: 160,
        capacity: 220,
        status: "growing",
        sofieVersion: "1.0.0",
        tier: "local",
        specializations: ["Mountain agriculture", "Hydropower", "Tourism integration"],
        energySelfSufficiency: 98,
        foodSelfSufficiency: 58,
        waterSelfSufficiency: 100,
        carbonNeutral: true,
        connectedCommunities: 3,
        lastSync: "2025-12-06",
        achievements: ["Alpine pioneer", "Mountain resilience"]
      }
    ];

    this.globalMetrics = {
      totalCommunities: 10,
      totalPopulation: 2945,
      totalCapacity: 3640,
      averageOccupancy: 81,
      communitiesWithSofie: 10,
      sofieVersion: {
        "1.0.0": 8,
        "0.9.8": 1,
        "0.9.5": 1
      },
      continents: 5,
      countries: 8,
      carbonNeutralCommunities: 7,
      averageEnergySelfSufficiency: 93,
      averageFoodSelfSufficiency: 76,
      averageWaterSelfSufficiency: 84,
      totalConnections: 51,
      dataLastUpdated: "2025-12-07"
    };

    this.knowledgeExchanges = [
      {
        id: "kex-001",
        topic: "Aquaponics System Design",
        sharedBy: "Harmonic Habitats - Valley Site",
        sharedWith: ["Green Earth Collective", "Ubuntu Village", "Pacific Roots Network"],
        date: "2025-11-15",
        type: "Technical Documentation",
        impact: "3 communities implementing systems",
        description: "Detailed blueprints for closed-loop aquaponics optimized for mid-scale sites"
      },
      {
        id: "kex-002",
        topic: "Desert Water Conservation Techniques",
        sharedBy: "Desert Bloom Co-op",
        sharedWith: ["Ubuntu Village", "Sunshine Community"],
        date: "2025-10-22",
        type: "Best Practices",
        impact: "20% water savings achieved",
        description: "Protocols for drip irrigation, mulching, and atmospheric water harvesting"
      },
      {
        id: "kex-003",
        topic: "Community Governance Model",
        sharedBy: "Ubuntu Village",
        sharedWith: ["Terra Nova Settlement", "Selva Collective", "Alpine Harmony"],
        date: "2025-11-08",
        type: "Policy Framework",
        impact: "Increased participation rates",
        description: "Consensus-driven governance playbook with transparent budgeting"
      },
      {
        id: "kex-004",
        topic: "Cold Climate Food Production",
        sharedBy: "Green Earth Collective",
        sharedWith: ["Fjord Commons", "Alpine Harmony"],
        date: "2025-09-30",
        type: "Agricultural Methods",
        impact: "Extended growing season",
        description: "Greenhouse thermal mass tricks and varietal selection for sub-zero nights"
      }
    ];

    this.collaborativeProjects = [
      {
        id: "proj-001",
        name: "Global Seed Exchange Network",
        participants: 10,
        status: "active",
        startDate: "2024-06-01",
        description: "Worldwide seed sharing and preservation network",
        impact: "2,300+ seed varieties exchanged",
        leadCommunity: "Harmonic Habitats - Valley Site"
      },
      {
        id: "proj-002",
        name: "Renewable Energy Research Consortium",
        participants: 7,
        status: "active",
        startDate: "2024-09-15",
        description: "Collaborative R&D on solar and energy storage",
        impact: "15% efficiency improvements shared",
        leadCommunity: "Sunshine Community"
      },
      {
        id: "proj-003",
        name: "Climate Adaptation Study",
        participants: 8,
        status: "active",
        startDate: "2025-01-10",
        description: "Long-term climate resilience research",
        impact: "Regional adaptation strategies developed",
        leadCommunity: "Ubuntu Village"
      },
      {
        id: "proj-004",
        name: "Emergency Response Network",
        participants: 10,
        status: "active",
        startDate: "2024-03-20",
        description: "Mutual aid and disaster response coordination",
        impact: "3 communities assisted during emergencies",
        leadCommunity: "Pacific Roots Network"
      }
    ];

    this.upcomingCommunities = [
      {
        name: "Mountain Spring Settlement",
        location: "Colorado, USA",
        expectedLaunch: "2026-Q2",
        plannedPopulation: 300,
        status: "planning"
      },
      {
        name: "Mediterranean Oasis",
        location: "Andalusia, Spain",
        expectedLaunch: "2026-Q3",
        plannedPopulation: 350,
        status: "construction"
      },
      {
        name: "Amazon Regeneration Hub",
        location: "Brazil",
        expectedLaunch: "2026-Q4",
        plannedPopulation: 400,
        status: "design"
      }
    ];
  }

  init(core) {
    super.init(core);
    
    this.storage = core.getService("storage");
    
    const savedData = this.storage?.load("global_network");
    if (savedData) {
      this.communities = savedData.communities || this.communities;
    }
    
    // Initialize energy credit ledger
    this.initializeEnergyLedger();
    
    this.log("GlobalNetworkService initialized");
  }

  initializeEnergyLedger() {
    this.energyLedger = {};
    this.communities.forEach((c) => {
      // Seed balances based on community size and energy self-sufficiency
      const base = Math.max(500, Math.round((c.energySelfSufficiency || 50) * (c.population || 100) * 0.05));
      const reserve = Math.round(base * 0.2);
      this.energyLedger[c.id] = {
        balance: base,
        reserve,
        unit: "kWh"
      };
    });
  }

  getCommunities() {
    return this.communities;
  }

  getCommunity(communityId) {
    return this.communities.find(c => c.id === communityId);
  }

  getCommunityById(communityId) {
    return this.getCommunity(communityId);
  }

  getCommunitiesByTier(tier) {
    return this.communities.filter(c => c.tier === tier);
  }

  getCommunitiesByStatus(status) {
    return this.communities.filter(c => c.status === status);
  }

  getGlobalMetrics() {
    return this.globalMetrics;
  }

  getKnowledgeExchanges() {
    return this.knowledgeExchanges.map((k) => ({
      ...k,
      sourceCommunity: k.sharedBy,
      recipientCommunities: k.sharedWith,
      description: k.description || k.type
    }));
  }

  getCollaborativeProjects() {
    return this.collaborativeProjects.map((p) => ({
      leadCommunity: p.leadCommunity || p.name,
      ...p
    }));
  }

  getUpcomingCommunities() {
    return this.upcomingCommunities;
  }

  getNetworkMap() {
    return this.communities.map(c => ({
      id: c.id,
      name: c.name,
      coordinates: c.coordinates,
      population: c.population,
      tier: c.tier,
      status: c.status,
      carbonNeutral: c.carbonNeutral
    }));
  }

  getCommunityConnections(communityId) {
    const community = this.getCommunity(communityId);
    if (!community) return [];

    // Return communities this one is connected to
    return this.communities
      .filter(c => c.id !== communityId)
      .slice(0, community.connectedCommunities);
  }

  getRegionalStats(region) {
    const regionCommunities = this.communities.filter(c => 
      c.location.includes(region)
    );

    return {
      communities: regionCommunities.length,
      totalPopulation: regionCommunities.reduce((sum, c) => sum + c.population, 0),
      avgEnergySelfSufficiency: Math.round(
        regionCommunities.reduce((sum, c) => sum + c.energySelfSufficiency, 0) / regionCommunities.length
      ),
      avgFoodSelfSufficiency: Math.round(
        regionCommunities.reduce((sum, c) => sum + c.foodSelfSufficiency, 0) / regionCommunities.length
      ),
      carbonNeutralPercentage: Math.round(
        (regionCommunities.filter(c => c.carbonNeutral).length / regionCommunities.length) * 100
      )
    };
  }

  getSelfSufficiencyLeaderboard() {
    const toEntry = (c, key) => ({
      community: c?.name || "Unknown",
      location: c?.location || "TBD",
      percentage: c?.[key] || 0
    });

    const comms = this.communities || [];

    const result = {
      energy: comms.length > 0 ? this.safeMap(
        [...comms]
          .sort((a, b) => (b?.energySelfSufficiency || 0) - (a?.energySelfSufficiency || 0))
          .slice(0, 5),
        c => toEntry(c, "energySelfSufficiency")
      ) : [],
      food: comms.length > 0 ? this.safeMap(
        [...comms]
          .sort((a, b) => (b?.foodSelfSufficiency || 0) - (a?.foodSelfSufficiency || 0))
          .slice(0, 5),
        c => toEntry(c, "foodSelfSufficiency")
      ) : [],
      water: comms.length > 0 ? this.safeMap(
        [...comms]
          .sort((a, b) => (b?.waterSelfSufficiency || 0) - (a?.waterSelfSufficiency || 0))
          .slice(0, 5),
        c => toEntry(c, "waterSelfSufficiency")
      ) : []
    };

    return this.validateAndReturn(result, "getSelfSufficiencyLeaderboard", { energy: [], food: [], water: [] });
  }

  getGrowthTimeline() {
    const operational = this.safeMap(this.communities || [], c => ({
      id: c?.id || "unknown",
      name: c?.name || "Unknown",
      location: c?.location || "TBD",
      status: "operational",
      established: c?.established || null,
      expectedLaunch: c?.established || null,
      plannedPopulation: c?.capacity || 0,
      population: c?.population || 0
    }), []);

    const planned = this.safeMap(this.upcomingCommunities || [], (c, idx) => ({
      id: `upcoming-${idx + 1}`,
      name: c?.name || "Planned Community",
      location: c?.location || "TBD",
      status: "planned",
      established: null,
      expectedLaunch: c?.expectedLaunch || null,
      plannedPopulation: c?.plannedPopulation || 0,
      population: 0
    }), []);

    const timeline = [...operational, ...planned].sort((a, b) => {
      const aDate = new Date(a.expectedLaunch || a.established || "2099-01-01");
      const bDate = new Date(b.expectedLaunch || b.established || "2099-01-01");
      return aDate - bDate;
    });

    return this.validateAndReturn(timeline, "getGrowthTimeline", []);
  }

  addKnowledgeExchange(exchange) {
    const newExchange = {
      id: `kex-${String(this.knowledgeExchanges.length + 1).padStart(3, '0')}`,
      ...exchange,
      date: new Date().toISOString().split('T')[0]
    };

    this.knowledgeExchanges.push(newExchange);
    
    return { success: true, exchange: newExchange };
  }

  saveData() {
    this.storage?.save("global_network", {
      communities: this.communities
    });
  }

  // Community-to-Community Trading Methods
  
  offerSurplus(communityId, resource, quantity, price = 0) {
    const community = this.getCommunityById(communityId);
    if (!community) {
      return { success: false, error: "Community not found" };
    }

    const offer = {
      id: `offer-${String(this.resourceOffers.length + 1).padStart(4, '0')}`,
      communityId,
      communityName: community.name,
      resource,
      quantity,
      available: quantity,
      price, // 0 for gift economy, > 0 for trading credits
      created: new Date().toISOString(),
      status: "active"
    };

    this.resourceOffers.push(offer);
    
    // Auto-match with existing requests
    this.matchSupplyDemand();
    
    return { success: true, offer };
  }

  requestResource(communityId, resource, quantity, urgency = "medium") {
    const community = this.getCommunityById(communityId);
    if (!community) {
      return { success: false, error: "Community not found" };
    }

    const request = {
      id: `req-${String(this.resourceRequests.length + 1).padStart(4, '0')}`,
      communityId,
      communityName: community.name,
      resource,
      quantity,
      urgency, // low, medium, high, critical
      created: new Date().toISOString(),
      status: "open"
    };

    this.resourceRequests.push(request);
    
    // Auto-match with existing offers
    this.matchSupplyDemand();
    
    return { success: true, request };
  }

  matchSupplyDemand() {
    const matches = [];

    for (const request of this.resourceRequests) {
      if (request.status !== "open") continue;

      // Find offers for same resource
      const compatibleOffers = this.resourceOffers.filter(offer => 
        offer.status === "active" &&
        offer.resource === request.resource &&
        offer.available > 0 &&
        offer.communityId !== request.communityId
      );

      // Sort by urgency match and distance
      compatibleOffers.sort((a, b) => {
        const distA = this.calculateDistance(
          this.getCommunityById(a.communityId).coordinates,
          this.getCommunityById(request.communityId).coordinates
        );
        const distB = this.calculateDistance(
          this.getCommunityById(b.communityId).coordinates,
          this.getCommunityById(request.communityId).coordinates
        );
        return distA - distB;
      });

      for (const offer of compatibleOffers) {
        const transferQuantity = Math.min(offer.available, request.quantity);
        if (transferQuantity <= 0) continue;

        // Energy-specific guard: ensure seller has surplus credits beyond reserve and buyer ledger exists
        if (request.resource === "energy") {
          const sellerLedger = this.energyLedger?.[offer.communityId];
          const buyerLedger = this.energyLedger?.[request.communityId];
          if (!sellerLedger || !buyerLedger) continue;
          if ((sellerLedger.balance - sellerLedger.reserve) < transferQuantity) continue;
        }

        const tradeResult = this.executeTrade(
          offer.communityId,
          request.communityId,
          request.resource,
          transferQuantity,
          offer.price
        );

        if (tradeResult.success) {
          offer.available -= transferQuantity;
          if (offer.available === 0) offer.status = "fulfilled";

          request.quantity -= transferQuantity;
          if (request.quantity === 0) request.status = "fulfilled";

          matches.push(tradeResult);
        }

        if (request.quantity === 0) break;
      }
    }

    return matches;
  }

  executeTrade(fromCommunityId, toCommunityId, resource, quantity, pricePerUnit = null) {
    const fromCommunity = this.getCommunityById(fromCommunityId);
    const toCommunity = this.getCommunityById(toCommunityId);

    if (!fromCommunity || !toCommunity) {
      return { success: false, error: "Community not found" };
    }

    // Energy guardrails: ensure ledger exists and seller has available balance
    if (resource === "energy") {
      const sellerLedger = this.energyLedger?.[fromCommunityId];
      const buyerLedger = this.energyLedger?.[toCommunityId];
      if (!sellerLedger || !buyerLedger) {
        return { success: false, error: "Energy ledger missing" };
      }
      if ((sellerLedger.balance - sellerLedger.reserve) < quantity) {
        return { success: false, error: "Insufficient available energy credits" };
      }
    }

    const trade = {
      id: `trade-${String(this.tradeHistory.length + 1).padStart(4, '0')}`,
      fromCommunityId,
      fromCommunityName: fromCommunity.name,
      toCommunityId,
      toCommunityName: toCommunity.name,
      resource,
      quantity,
      date: new Date().toISOString(),
      distance: this.calculateDistance(fromCommunity.coordinates, toCommunity.coordinates),
      carbonCost: this.calculateTradeCarbonCost(fromCommunity.coordinates, toCommunity.coordinates, quantity),
      pricePerUnit: pricePerUnit,
      totalValue: pricePerUnit != null ? Math.round(pricePerUnit * quantity * 100) / 100 : null
    };

    if (resource === "energy") {
      const settlement = this.settleEnergyTransfer(fromCommunityId, toCommunityId, quantity, pricePerUnit);
      if (!settlement.success) {
        return settlement;
      }
      trade.settlement = settlement;
    }

    this.tradeHistory.push(trade);

    return { success: true, trade };
  }

  calculateDistance(coord1, coord2) {
    // Haversine formula for distance between two lat/lng points (in km)
    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  calculateTradeCarbonCost(coord1, coord2, quantity) {
    const distance = this.calculateDistance(coord1, coord2);
    // Assume 0.1 kg CO2 per km per ton of goods
    return Math.round(distance * quantity * 0.0001 * 100) / 100; // kg CO2
  }

  // Energy credit utilities
  getEnergyBalances() {
    return this.communities.map((c) => {
      const ledger = this.energyLedger?.[c.id] || { balance: 0, reserve: 0, unit: "kWh" };
      return {
        id: c.id,
        name: c.name,
        balance: ledger.balance,
        reserve: ledger.reserve,
        available: Math.max(0, ledger.balance - ledger.reserve),
        unit: ledger.unit
      };
    });
  }

  getCommunityEnergyBalance(communityId) {
    const ledger = this.energyLedger?.[communityId];
    if (!ledger) return null;
    const community = this.getCommunityById(communityId);
    return {
      id: communityId,
      name: community?.name,
      ...ledger,
      available: Math.max(0, ledger.balance - ledger.reserve)
    };
  }

  offerEnergyCredits(communityId, quantity, price = 0) {
    const ledger = this.energyLedger?.[communityId];
    if (!ledger) return { success: false, error: "Ledger not found for community" };
    if (quantity <= 0) return { success: false, error: "Quantity must be positive" };
    if ((ledger.balance - ledger.reserve) < quantity) {
      return { success: false, error: "Insufficient available energy credits" };
    }
    return this.offerSurplus(communityId, "energy", quantity, price);
  }

  requestEnergyCredits(communityId, quantity, urgency = "medium") {
    if (quantity <= 0) return { success: false, error: "Quantity must be positive" };
    return this.requestResource(communityId, "energy", quantity, urgency);
  }

  settleEnergyTransfer(sellerId, buyerId, quantity, pricePerUnit = 0) {
    const seller = this.energyLedger?.[sellerId];
    const buyer = this.energyLedger?.[buyerId];
    if (!seller || !buyer) return { success: false, error: "Ledger missing" };
    if ((seller.balance - seller.reserve) < quantity) {
      return { success: false, error: "Seller lacks available credits" };
    }

    seller.balance -= quantity;
    buyer.balance += quantity;

    return {
      success: true,
      transferred: quantity,
      unit: seller.unit,
      pricePerUnit,
      totalValue: pricePerUnit != null ? Math.round(pricePerUnit * quantity * 100) / 100 : null
    };
  }

  getActiveOffers(resourceType = null) {
    let offers = this.resourceOffers.filter(o => o.status === "active" && o.available > 0);
    if (resourceType) {
      offers = offers.filter(o => o.resource === resourceType);
    }
    return offers;
  }

  getOpenRequests(resourceType = null) {
    let requests = this.resourceRequests.filter(r => r.status === "open" && r.quantity > 0);
    if (resourceType) {
      requests = requests.filter(r => r.resource === resourceType);
    }
    return requests;
  }

  getCommunityTrades(communityId) {
    return {
      sent: this.tradeHistory.filter(t => t.fromCommunityId === communityId),
      received: this.tradeHistory.filter(t => t.toCommunityId === communityId)
    };
  }

  getTradeStats() {
    const totalTrades = this.tradeHistory.length;
    const totalVolume = this.tradeHistory.reduce((sum, t) => sum + t.quantity, 0);
    const totalDistance = this.tradeHistory.reduce((sum, t) => sum + t.distance, 0);
    const totalCarbon = this.tradeHistory.reduce((sum, t) => sum + t.carbonCost, 0);

    const resourceBreakdown = {};
    this.tradeHistory.forEach(t => {
      if (!resourceBreakdown[t.resource]) {
        resourceBreakdown[t.resource] = { count: 0, volume: 0 };
      }
      resourceBreakdown[t.resource].count++;
      resourceBreakdown[t.resource].volume += t.quantity;
    });

    return {
      totalTrades,
      totalVolume,
      avgTradeDistance: totalTrades > 0 ? Math.round(totalDistance / totalTrades) : 0,
      totalCarbonCost: Math.round(totalCarbon * 100) / 100,
      resourceBreakdown,
      mostTradedResource: Object.entries(resourceBreakdown)
        .sort((a, b) => b[1].volume - a[1].volume)[0]?.[0] || null
    };
  }

  getTradeHistory(limit = 20) {
    return [...this.tradeHistory]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}

export default GlobalNetworkService;