// src/services/SolarExpansionService.js

/**
 * Solar Expansion Service
 * Manages solar panel installations, battery storage expansion, and renewable energy growth
 */

class SolarExpansionService {
  constructor() {
    this.name = "SolarExpansion";
    
    this.expansionProjects = [
      {
        id: "solar-001",
        name: "Community Solar Farm Phase 2",
        type: "Ground-Mounted Solar",
        capacity: 200, // kW
        status: "in-progress",
        priority: "high",
        startDate: "2025-12-01",
        estimatedCompletion: "2026-04-15",
        budget: 280000,
        spent: 85000,
        completion: 30,
        specifications: {
          panels: 550,
          panelWattage: 365,
          efficiency: "21.4%",
          inverters: 4,
          mounting: "Fixed tilt",
          landArea: "3200 sqm"
        },
        expectedOutput: "320,000 kWh/year",
        roi: "7.2 years"
      },
      {
        id: "solar-002",
        name: "Rooftop Solar Retrofit Program",
        type: "Rooftop Solar",
        capacity: 85, // kW across 30 buildings
        status: "active",
        priority: "high",
        startDate: "2025-10-01",
        estimatedCompletion: "2026-06-30",
        budget: 145000,
        spent: 62000,
        completion: 45,
        specifications: {
          buildings: 30,
          avgSystemSize: "2.8 kW",
          panels: 234,
          panelWattage: 365,
          efficiency: "20.8%",
          inverters: 30,
          mounting: "Flush roof"
        },
        expectedOutput: "128,000 kWh/year",
        roi: "6.5 years"
      },
      {
        id: "solar-003",
        name: "Battery Storage Expansion",
        type: "Energy Storage",
        capacity: 1200, // kWh storage
        status: "planning",
        priority: "high",
        startDate: "2026-03-01",
        estimatedCompletion: "2026-08-30",
        budget: 420000,
        spent: 25000,
        completion: 6,
        specifications: {
          batteries: 12,
          chemistry: "LiFePO4",
          capacity: "100 kWh each",
          cycleLife: "6000+ cycles",
          warranty: "10 years",
          efficiency: "96%"
        },
        expectedImpact: "50% increase in storage capacity, 3-day backup power",
        roi: "9.5 years"
      },
      {
        id: "solar-004",
        name: "Solar Carport & EV Charging",
        type: "Solar + Infrastructure",
        capacity: 65, // kW
        status: "approved",
        priority: "medium",
        startDate: "2026-05-01",
        estimatedCompletion: "2026-10-15",
        budget: 185000,
        spent: 0,
        completion: 0,
        specifications: {
          parkingSpaces: 50,
          evChargers: 20,
          panels: 178,
          panelWattage: 365,
          inverters: 2,
          mounting: "Canopy structure"
        },
        expectedOutput: "98,000 kWh/year + EV charging infrastructure",
        roi: "8.1 years"
      },
      {
        id: "solar-005",
        name: "Solar Thermal for Community Center",
        type: "Solar Thermal",
        capacity: null,
        status: "design",
        priority: "low",
        startDate: "2026-08-01",
        estimatedCompletion: "2027-01-30",
        budget: 75000,
        spent: 8000,
        completion: 10,
        specifications: {
          collectors: 24,
          collectorArea: "48 sqm",
          storageCapacity: "2000 L",
          type: "Evacuated tube",
          applications: "Hot water + space heating"
        },
        expectedImpact: "80% of hot water needs, reduce gas consumption by 65%",
        roi: "5.8 years"
      }
    ];

    this.installedSystems = [
      {
        id: "sys-001",
        location: "Community Center Roof",
        capacity: 45,
        installed: "2023-06-15",
        production: 68000, // kWh/year actual
        status: "operational"
      },
      {
        id: "sys-002",
        location: "Main Solar Farm",
        capacity: 300,
        installed: "2024-03-20",
        production: 475000,
        status: "operational"
      },
      {
        id: "sys-003",
        location: "Residential Rooftops (45 units)",
        capacity: 115,
        installed: "2024-09-10",
        production: 172000,
        status: "operational"
      }
    ];

    this.metrics = {
      currentCapacity: 460, // kW
      plannedAddition: 550, // kW
      futureCapacity: 1010, // kW
      currentProduction: 715000, // kWh/year
      projectedProduction: 1461000, // kWh/year
      currentStorage: 2400, // kWh
      plannedStorage: 1200, // kWh additional
      totalInvestment: 1105000,
      totalSpent: 180000,
      carbonOffset: {
        current: "358 tons CO2/year",
        projected: "731 tons CO2/year"
      },
      costSavings: {
        current: 107000, // USD/year
        projected: 219000 // USD/year
      },
      renewablePercentage: {
        current: 98,
        projected: 100
      }
    };

    this.maintenanceSchedule = [
      { system: "Main Solar Farm", nextService: "2026-01-15", type: "Annual inspection", status: "scheduled" },
      { system: "Residential Rooftops", nextService: "2026-03-10", type: "Cleaning & inspection", status: "scheduled" },
      { system: "Battery Bank 1", nextService: "2026-02-01", type: "Health check", status: "scheduled" }
    ];
  }

  init(core) {
    this.core = core;
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    
    const savedData = this.storage?.load("solar_expansion");
    if (savedData) {
      this.expansionProjects = savedData.projects || this.expansionProjects;
    }
    
    this.logger?.info("SolarExpansionService initialized");
  }

  getExpansionProjects() {
    return this.expansionProjects;
  }

  getInstalledSystems() {
    return this.installedSystems;
  }

  getMetrics() {
    return this.metrics;
  }

  getMaintenanceSchedule() {
    return this.maintenanceSchedule;
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

  updateProjectStatus(projectId, status) {
    const project = this.expansionProjects.find(p => p.id === projectId);
    if (!project) return { success: false, error: "Project not found" };

    project.status = status;
    
    if (status === "completed") {
      project.completion = 100;
      // Add to installed systems
      this.installedSystems.push({
        id: `sys-${String(this.installedSystems.length + 1).padStart(3, '0')}`,
        location: project.name,
        capacity: project.capacity,
        installed: new Date().toISOString().split('T')[0],
        production: 0,
        status: "operational"
      });
    }
    
    this.saveData();
    
    return { success: true, project };
  }

  getProductionForecast(year) {
    const currentYear = new Date().getFullYear();
    const yearsAhead = year - currentYear;
    
    const completedProjects = this.expansionProjects.filter(p => 
      new Date(p.estimatedCompletion).getFullYear() <= year && p.capacity
    );
    
    const additionalCapacity = completedProjects.reduce((sum, p) => sum + (p.capacity || 0), 0);
    const totalCapacity = this.metrics.currentCapacity + additionalCapacity;
    const estimatedProduction = totalCapacity * 1550; // kWh per kW per year (average)
    
    return {
      year,
      totalCapacity,
      estimatedProduction,
      renewablePercentage: Math.min(100, this.metrics.renewablePercentage.current + (yearsAhead * 0.5)),
      carbonOffset: Math.round(estimatedProduction * 0.0005), // tons CO2
      costSavings: Math.round(estimatedProduction * 0.15) // USD
    };
  }

  getEnergyIndependence() {
    const currentDemand = 680; // kWh/day from community metrics
    const currentProduction = this.metrics.currentProduction / 365; // daily average
    const futureProduction = this.metrics.projectedProduction / 365;
    
    return {
      current: {
        dailyDemand: currentDemand,
        dailyProduction: Math.round(currentProduction),
        independence: Math.round((currentProduction / currentDemand) * 100),
        status: currentProduction >= currentDemand ? "surplus" : "deficit"
      },
      projected: {
        dailyDemand: currentDemand * 1.15, // account for growth
        dailyProduction: Math.round(futureProduction),
        independence: Math.round((futureProduction / (currentDemand * 1.15)) * 100),
        status: futureProduction >= (currentDemand * 1.15) ? "surplus" : "deficit"
      }
    };
  }

  getROIAnalysis() {
    return this.expansionProjects.map(project => ({
      name: project.name,
      investment: project.budget,
      roi: project.roi,
      paybackPeriod: project.roi,
      annualSavings: Math.round(project.budget / parseFloat(project.roi)),
      status: project.status
    }));
  }

  saveData() {
    this.storage?.save("solar_expansion", {
      projects: this.expansionProjects
    });
  }
}

export default SolarExpansionService;
