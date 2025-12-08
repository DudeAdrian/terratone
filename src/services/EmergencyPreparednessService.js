// src/services/EmergencyPreparednessService.js

/**
 * Emergency Preparedness Service
 * Manages emergency response, disaster preparedness, and community resilience
 */

class EmergencyPreparednessService {
  constructor() {
    this.name = "EmergencyPreparedness";
    
    this.emergencySupplies = {
      food: {
        currentReserve: 45, // days
        target: 60,
        status: "adequate",
        items: [
          { name: "Grains & Rice", quantity: "2800 kg", expiryDate: "2027-08-15" },
          { name: "Canned Goods", quantity: "1200 units", expiryDate: "2028-03-20" },
          { name: "Dried Beans & Legumes", quantity: "1500 kg", expiryDate: "2027-12-10" },
          { name: "Preserved Fruits/Veg", quantity: "900 kg", expiryDate: "2027-06-30" },
          { name: "Emergency Rations", quantity: "450 units", expiryDate: "2029-01-15" }
        ],
        storageLocations: ["Central Warehouse", "Community Center Basement", "School Storage"]
      },
      water: {
        currentReserve: 30, // days
        target: 45,
        status: "needs-improvement",
        capacity: 1500000, // Liters (30 days for 500 people)
        purificationSystems: 3,
        portableFilters: 50,
        testingKits: 20
      },
      medical: {
        currentReserve: 60, // days
        target: 90,
        status: "good",
        supplies: [
          { category: "First Aid", quantity: "50 kits", status: "stocked" },
          { category: "Prescription Medications", quantity: "60-day supply", status: "adequate" },
          { category: "Pain Relief", quantity: "2000 doses", status: "stocked" },
          { category: "Antibiotics", quantity: "500 courses", status: "adequate" },
          { category: "Trauma Supplies", quantity: "25 kits", status: "stocked" },
          { category: "Chronic Disease Meds", quantity: "60-day supply", status: "needs-review" }
        ],
        equipment: [
          { item: "AED Units", quantity: 4, status: "operational", lastChecked: "2025-11-15" },
          { item: "Oxygen Tanks", quantity: 8, status: "operational", lastChecked: "2025-12-01" },
          { item: "Stretchers", quantity: 6, status: "operational", lastChecked: "2025-10-20" }
        ]
      },
      energy: {
        currentReserve: 15, // days
        target: 21,
        status: "adequate",
        backupSystems: [
          { type: "Battery Storage", capacity: "2400 kWh", status: "operational" },
          { type: "Diesel Generator", capacity: "150 kW", fuel: "800 L", runtime: "5 days" },
          { type: "Solar (Grid-Independent)", capacity: "200 kW", status: "operational" }
        ]
      }
    };

    this.emergencyPlans = [
      {
        id: "plan-001",
        name: "Natural Disaster Response",
        type: "Earthquake/Flood/Storm",
        lastUpdated: "2025-09-15",
        status: "current",
        keyComponents: [
          "Evacuation routes mapped",
          "Emergency shelters designated (3 locations)",
          "Communication protocol established",
          "Supply distribution plan",
          "Medical triage system"
        ],
        lastDrill: "2025-11-10",
        nextDrill: "2026-02-15",
        participation: "87%"
      },
      {
        id: "plan-002",
        name: "Medical Emergency Protocol",
        type: "Health Crisis/Pandemic",
        lastUpdated: "2025-10-20",
        status: "current",
        keyComponents: [
          "Isolation facilities (capacity: 20 people)",
          "Medical supply chain backup",
          "Telemedicine capabilities",
          "Contact tracing system",
          "Community health monitoring"
        ],
        lastDrill: "2025-10-25",
        nextDrill: "2026-01-20",
        participation: "76%"
      },
      {
        id: "plan-003",
        name: "Grid Failure Response",
        type: "Power Outage",
        lastUpdated: "2025-11-05",
        status: "current",
        keyComponents: [
          "Automatic generator activation",
          "Critical systems priority list",
          "Manual backup procedures",
          "Communication via radio network",
          "Food preservation protocol"
        ],
        lastDrill: "2025-12-02",
        nextDrill: "2026-03-05",
        participation: "92%"
      },
      {
        id: "plan-004",
        name: "Fire Emergency Response",
        type: "Fire/Explosion",
        lastUpdated: "2025-08-30",
        status: "needs-review",
        keyComponents: [
          "Fire suppression systems (12 locations)",
          "Volunteer fire brigade (25 members)",
          "Evacuation assembly points",
          "Equipment: 3 pumps, 8 hoses, protective gear",
          "Mutual aid with neighboring communities"
        ],
        lastDrill: "2025-09-18",
        nextDrill: "2026-01-10",
        participation: "81%"
      }
    ];

    this.responseTeams = [
      {
        id: "team-001",
        name: "Emergency Medical Team",
        members: 12,
        lead: "Dr. Sarah Chen",
        training: "Advanced First Aid, CPR, Trauma",
        lastTraining: "2025-10-15",
        certifications: "Current",
        equipment: "2 medical kits, AED, oxygen"
      },
      {
        id: "team-002",
        name: "Search & Rescue",
        members: 15,
        lead: "Marcus Johnson",
        training: "SAR Techniques, Rope Rescue",
        lastTraining: "2025-09-20",
        certifications: "Current",
        equipment: "Ropes, harnesses, communications gear"
      },
      {
        id: "team-003",
        name: "Fire Response Brigade",
        members: 25,
        lead: "James Park",
        training: "Fire Suppression, Hazmat Awareness",
        lastTraining: "2025-11-08",
        certifications: "Current",
        equipment: "Pumps, hoses, protective gear, breathing apparatus"
      },
      {
        id: "team-004",
        name: "Communications & Coordination",
        members: 8,
        lead: "Elena Rodriguez",
        training: "Radio Operations, Incident Command",
        lastTraining: "2025-10-30",
        certifications: "Current",
        equipment: "Ham radios, satellite phone, emergency network"
      },
      {
        id: "team-005",
        name: "Logistics & Supply",
        members: 10,
        lead: "Aisha Okonkwo",
        training: "Supply Chain, Distribution Management",
        lastTraining: "2025-09-12",
        certifications: "Current",
        equipment: "Vehicles, distribution tools, inventory system"
      }
    ];

    this.communicationSystems = [
      { type: "Ham Radio Network", coverage: "50km radius", units: 12, status: "operational" },
      { type: "Satellite Phone", coverage: "Global", units: 2, status: "operational" },
      { type: "Emergency Sirens", coverage: "Community-wide", units: 5, status: "operational" },
      { type: "Mobile Alert System", coverage: "All residents", enrollment: "94%", status: "operational" },
      { type: "Community Bulletin Boards", locations: 8, status: "maintained" }
    ];

    this.trainingPrograms = [
      { name: "CPR & First Aid", frequency: "Quarterly", nextSession: "2026-01-18", capacity: 30, enrolled: 28 },
      { name: "Emergency Preparedness 101", frequency: "Monthly", nextSession: "2026-01-08", capacity: 40, enrolled: 35 },
      { name: "Fire Safety", frequency: "Bi-annual", nextSession: "2026-02-22", capacity: 50, enrolled: 42 },
      { name: "Community Emergency Response Team (CERT)", frequency: "Annual", nextSession: "2026-03-15", capacity: 25, enrolled: 25 }
    ];

    this.recentIncidents = [
      {
        date: "2025-11-22",
        type: "Minor Medical Emergency",
        description: "Resident fall, sprained ankle",
        response: "EMT team responded in 4 minutes",
        outcome: "Treated on-site, no hospitalization",
        lessonsLearned: "None - standard procedure followed"
      },
      {
        date: "2025-10-15",
        type: "Power Outage",
        description: "Grid failure during storm",
        response: "Backup generators activated automatically",
        outcome: "Critical systems maintained, restored in 6 hours",
        lessonsLearned: "Need additional fuel storage"
      }
    ];
  }

  init(core) {
    this.core = core;
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    
    const savedData = this.storage?.load("emergency_preparedness");
    if (savedData) {
      this.emergencySupplies = savedData.supplies || this.emergencySupplies;
      this.emergencyPlans = savedData.plans || this.emergencyPlans;
    }
    
    this.logger?.info("EmergencyPreparednessService initialized");
  }

  getEmergencySupplies() {
    return this.emergencySupplies;
  }

  getEmergencyPlans() {
    return this.emergencyPlans;
  }

  getResponseTeams() {
    return this.responseTeams;
  }

  getCommunicationSystems() {
    return this.communicationSystems;
  }

  getTrainingPrograms() {
    return this.trainingPrograms;
  }

  getRecentIncidents() {
    return this.recentIncidents;
  }

  getReadinessScore() {
    const foodScore = (this.emergencySupplies.food.currentReserve / this.emergencySupplies.food.target) * 100;
    const waterScore = (this.emergencySupplies.water.currentReserve / this.emergencySupplies.water.target) * 100;
    const medicalScore = (this.emergencySupplies.medical.currentReserve / this.emergencySupplies.medical.target) * 100;
    const energyScore = (this.emergencySupplies.energy.currentReserve / this.emergencySupplies.energy.target) * 100;
    
    const plansCurrent = this.emergencyPlans.filter(p => p.status === "current").length;
    const plansScore = (plansCurrent / this.emergencyPlans.length) * 100;
    
    const teamsCertified = this.responseTeams.filter(t => t.certifications === "Current").length;
    const teamsScore = (teamsCertified / this.responseTeams.length) * 100;
    
    const overall = Math.round(
      (foodScore + waterScore + medicalScore + energyScore + plansScore + teamsScore) / 6
    );
    
    return {
      overall,
      categories: {
        food: Math.round(foodScore),
        water: Math.round(waterScore),
        medical: Math.round(medicalScore),
        energy: Math.round(energyScore),
        plans: Math.round(plansScore),
        teams: Math.round(teamsScore)
      },
      status: overall >= 85 ? "excellent" : overall >= 70 ? "good" : overall >= 50 ? "adequate" : "needs-improvement"
    };
  }

  updateSupplyLevel(category, subcategory, value) {
    if (this.emergencySupplies[category] && this.emergencySupplies[category][subcategory] !== undefined) {
      this.emergencySupplies[category][subcategory] = value;
      
      // Update status based on target
      if (this.emergencySupplies[category].target) {
        const percentage = (value / this.emergencySupplies[category].target) * 100;
        this.emergencySupplies[category].status = 
          percentage >= 90 ? "excellent" :
          percentage >= 75 ? "good" :
          percentage >= 60 ? "adequate" : "needs-improvement";
      }
      
      this.saveData();
      return { success: true };
    }
    
    return { success: false, error: "Invalid category or subcategory" };
  }

  scheduleDrill(planId, date) {
    const plan = this.emergencyPlans.find(p => p.id === planId);
    if (!plan) return { success: false, error: "Plan not found" };
    
    plan.nextDrill = date;
    this.saveData();
    
    return { success: true, plan };
  }

  recordIncident(incident) {
    this.recentIncidents.unshift({
      date: new Date().toISOString().split('T')[0],
      ...incident
    });
    
    // Keep only last 20 incidents
    if (this.recentIncidents.length > 20) {
      this.recentIncidents = this.recentIncidents.slice(0, 20);
    }
    
    this.saveData();
    
    return { success: true };
  }

  saveData() {
    this.storage?.save("emergency_preparedness", {
      supplies: this.emergencySupplies,
      plans: this.emergencyPlans
    });
  }
}

export default EmergencyPreparednessService;
