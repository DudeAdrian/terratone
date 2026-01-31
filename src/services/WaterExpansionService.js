// src/services/WaterExpansionService.js

/**
 * Water Expansion Service
 * Manages water infrastructure expansion, rainwater harvesting, greywater systems
 */

class WaterExpansionService {
  constructor() {
    this.name = "WaterExpansion";
    
    this.expansionProjects = [
      {
        id: "water-001",
        name: "Community Rainwater Harvesting System",
        type: "Rainwater Collection",
        capacity: 100000, // Liters
        status: "in-progress",
        priority: "high",
        startDate: "2025-11-01",
        estimatedCompletion: "2026-04-30",
        budget: 120000,
        spent: 35000,
        completion: 30,
        components: [
          { name: "Roof catchment area expansion", size: "2000 sqm", status: "in-progress" },
          { name: "Storage tanks (5x20000L)", status: "ordered" },
          { name: "Filtration system", status: "not-started" },
          { name: "Distribution network", status: "not-started" }
        ],
        expectedImpact: "Additional 25,000L/day collection capacity"
      },
      {
        id: "water-002",
        name: "Greywater Recycling Plant",
        type: "Greywater Treatment",
        capacity: 15000, // Liters/day
        status: "planning",
        priority: "high",
        startDate: "2026-02-01",
        estimatedCompletion: "2026-09-30",
        budget: 180000,
        spent: 15000,
        completion: 8,
        components: [
          { name: "Collection system", status: "design-phase" },
          { name: "Biofilter beds", status: "not-started" },
          { name: "UV treatment unit", status: "not-started" },
          { name: "Irrigation distribution", status: "not-started" }
        ],
        expectedImpact: "Reuse 15,000L/day for irrigation and toilet flushing"
      },
      {
        id: "water-003",
        name: "Aquifer Recharge Basin",
        type: "Groundwater Management",
        capacity: 50000, // Liters/day infiltration
        status: "approved",
        priority: "medium",
        startDate: "2026-05-01",
        estimatedCompletion: "2026-11-30",
        budget: 95000,
        spent: 0,
        completion: 0,
        components: [
          { name: "Infiltration basin excavation", status: "approved" },
          { name: "Permeable layers", status: "not-started" },
          { name: "Overflow management", status: "not-started" },
          { name: "Monitoring wells", status: "not-started" }
        ],
        expectedImpact: "Recharge local aquifer, improve dry season availability"
      },
      {
        id: "water-004",
        name: "Smart Leak Detection Network",
        type: "Infrastructure Upgrade",
        capacity: null,
        status: "design",
        priority: "medium",
        startDate: "2026-03-01",
        estimatedCompletion: "2026-08-15",
        budget: 65000,
        spent: 8000,
        completion: 12,
        components: [
          { name: "IoT pressure sensors (200 units)", status: "design-phase" },
          { name: "AI analytics platform", status: "in-progress" },
          { name: "Mobile alert system", status: "not-started" },
          { name: "Automated shutoff valves", status: "not-started" }
        ],
        expectedImpact: "Reduce water loss from 8% to 2%, save 3,000L/day"
      }
    ];

    this.waterSources = [
      {
        id: "src-001",
        name: "Municipal Supply",
        type: "External",
        capacity: 30000,
        currentUsage: 20000,
        reliability: 98,
        cost: 0.002 // per liter
      },
      {
        id: "src-002",
        name: "Rainwater Harvesting",
        type: "Local",
        capacity: 15000,
        currentUsage: 15000,
        reliability: 85,
        cost: 0
      },
      {
        id: "src-003",
        name: "Greywater Recycling",
        type: "Local",
        capacity: 12000,
        currentUsage: 12000,
        reliability: 92,
        cost: 0.0005
      },
      {
        id: "src-004",
        name: "Community Well",
        type: "Groundwater",
        capacity: 8000,
        currentUsage: 3000,
        reliability: 95,
        cost: 0.001
      }
    ];

    this.conservationPrograms = [
      {
        id: "cons-001",
        name: "Low-Flow Fixture Retrofit",
        target: "120 housing units",
        status: "active",
        completion: 65,
        savings: "8,500L/day",
        investment: 18000
      },
      {
        id: "cons-002",
        name: "Smart Irrigation Controllers",
        target: "45 garden plots",
        status: "active",
        completion: 80,
        savings: "4,200L/day",
        investment: 12000
      },
      {
        id: "cons-003",
        name: "Water Education Campaign",
        target: "450 residents",
        status: "ongoing",
        completion: 45,
        savings: "3,000L/day behavioral change",
        investment: 5000
      }
    ];

    this.metrics = {
      totalCapacityIncrease: 165000, // Liters/day when complete
      totalInvestment: 460000,
      totalSpent: 58000,
      projectedSavings: 15700, // Liters/day
      selfSufficiency: {
        current: 71, // percentage
        projected: 89 // with all projects complete
      },
      costSavings: {
        annual: 45000, // USD
        perResident: 100
      }
    };
  }

  init(core) {
    this.core = core;
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    
    const savedData = this.storage?.load("water_expansion");
    if (savedData) {
      this.expansionProjects = savedData.projects || this.expansionProjects;
      this.conservationPrograms = savedData.conservation || this.conservationPrograms;
    }
    
    this.logger?.info("WaterExpansionService initialized");
  }

  getExpansionProjects() {
    return this.expansionProjects;
  }

  getWaterSources() {
    return this.waterSources;
  }

  getConservationPrograms() {
    return this.conservationPrograms;
  }

  getMetrics() {
    return this.metrics;
  }

  updateProjectProgress(projectId, completion, spent) {
    const project = this.expansionProjects.find(p => p.id === projectId);
    if (!project) return { success: false, error: "Project not found" };

    project.completion = completion;
    project.spent = spent;
    
    this.metrics.totalSpent = this.expansionProjects.reduce((sum, p) => sum + p.spent, 0);
    
    this.saveData();
    
    return { success: true, project };
  }

  updateComponentStatus(projectId, componentName, status) {
    const project = this.expansionProjects.find(p => p.id === projectId);
    if (!project) return { success: false, error: "Project not found" };

    const component = project.components.find(c => c.name === componentName);
    if (!component) return { success: false, error: "Component not found" };

    component.status = status;
    this.saveData();
    
    return { success: true, component };
  }

  getWaterBalance() {
    const totalCapacity = this.waterSources.reduce((sum, s) => sum + s.capacity, 0);
    const totalUsage = this.waterSources.reduce((sum, s) => sum + s.currentUsage, 0);
    const localProduction = this.waterSources
      .filter(s => s.type === "Local")
      .reduce((sum, s) => sum + s.currentUsage, 0);

    return {
      totalCapacity,
      totalUsage,
      available: totalCapacity - totalUsage,
      localProduction,
      localPercentage: Math.round((localProduction / totalUsage) * 100),
      utilizationRate: Math.round((totalUsage / totalCapacity) * 100)
    };
  }

  getExpansionTimeline() {
    return this.expansionProjects.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      start: p.startDate,
      end: p.estimatedCompletion,
      completion: p.completion,
      status: p.status
    }));
  }

  getFutureCapacity(year) {
    const completedProjects = this.expansionProjects.filter(p => 
      new Date(p.estimatedCompletion).getFullYear() <= year && p.capacity
    );
    
    const additionalCapacity = completedProjects.reduce((sum, p) => sum + p.capacity, 0);
    const currentCapacity = 50000; // Current daily capacity
    
    return {
      year,
      totalCapacity: currentCapacity + additionalCapacity,
      increase: additionalCapacity,
      selfSufficiency: Math.min(100, this.metrics.selfSufficiency.current + 
        Math.round((additionalCapacity / currentCapacity) * 100))
    };
  }

  saveData() {
    this.storage?.save("water_expansion", {
      projects: this.expansionProjects,
      conservation: this.conservationPrograms
    });
  }
}

export default WaterExpansionService;
