// src/services/HousingExpansionService.js

/**
 * Housing Expansion Service
 * Manages housing development projects, construction planning, and capacity expansion
 */

class HousingExpansionService {
  constructor() {
    this.name = "HousingExpansion";
    
    this.expansionProjects = [
      {
        id: "proj-001",
        name: "Eco-Village Phase 2",
        type: "New Construction",
        units: 30,
        status: "planning",
        priority: "high",
        startDate: "2026-01-15",
        estimatedCompletion: "2026-12-15",
        budget: 1500000,
        spent: 0,
        completion: 0,
        specifications: {
          type: "Passive House",
          sqft: 1200,
          bedrooms: 3,
          features: ["Solar roof", "Rainwater harvesting", "Greywater system", "Smart home"],
          energyRating: "A+++"
        },
        milestones: [
          { name: "Permits & Approvals", status: "pending", dueDate: "2026-02-01" },
          { name: "Site Preparation", status: "not-started", dueDate: "2026-03-15" },
          { name: "Foundation", status: "not-started", dueDate: "2026-05-01" },
          { name: "Framing & Structure", status: "not-started", dueDate: "2026-07-15" },
          { name: "Systems Installation", status: "not-started", dueDate: "2026-09-30" },
          { name: "Interior Finishing", status: "not-started", dueDate: "2026-11-15" },
          { name: "Final Inspection", status: "not-started", dueDate: "2026-12-10" }
        ]
      },
      {
        id: "proj-002",
        name: "Tiny Home Village",
        type: "Modular Construction",
        units: 20,
        status: "approved",
        priority: "medium",
        startDate: "2026-02-01",
        estimatedCompletion: "2026-08-01",
        budget: 800000,
        spent: 50000,
        completion: 5,
        specifications: {
          type: "Tiny Home",
          sqft: 400,
          bedrooms: 1,
          features: ["Solar panels", "Composting toilet", "Murphy bed", "Kitchenette"],
          energyRating: "A+"
        },
        milestones: [
          { name: "Design Finalization", status: "completed", dueDate: "2025-12-15" },
          { name: "Module Manufacturing", status: "in-progress", dueDate: "2026-04-01" },
          { name: "Site Infrastructure", status: "not-started", dueDate: "2026-03-15" },
          { name: "Module Delivery & Assembly", status: "not-started", dueDate: "2026-06-01" },
          { name: "Utilities Connection", status: "not-started", dueDate: "2026-07-15" },
          { name: "Landscaping", status: "not-started", dueDate: "2026-07-30" }
        ]
      },
      {
        id: "proj-003",
        name: "Multi-Family Complex",
        type: "Renovation",
        units: 15,
        status: "design",
        priority: "low",
        startDate: "2026-06-01",
        estimatedCompletion: "2027-03-01",
        budget: 600000,
        spent: 25000,
        completion: 3,
        specifications: {
          type: "Apartment",
          sqft: 850,
          bedrooms: 2,
          features: ["Shared solar", "Green roof", "Community garden", "EV charging"],
          energyRating: "A"
        },
        milestones: [
          { name: "Structural Assessment", status: "completed", dueDate: "2025-11-30" },
          { name: "Architectural Plans", status: "in-progress", dueDate: "2026-01-15" },
          { name: "Permits", status: "not-started", dueDate: "2026-03-01" },
          { name: "Demolition", status: "not-started", dueDate: "2026-07-01" },
          { name: "Renovation Work", status: "not-started", dueDate: "2026-12-01" },
          { name: "Final Touches", status: "not-started", dueDate: "2027-02-15" }
        ]
      }
    ];

    this.waitlist = [
      { id: "wl-001", name: "Sarah Chen", priority: "high", familySize: 4, preferences: "3BR eco-home", waitingSince: "2025-08-15" },
      { id: "wl-002", name: "Marcus Johnson", priority: "medium", familySize: 2, preferences: "2BR apartment", waitingSince: "2025-09-22" },
      { id: "wl-003", name: "Elena Rodriguez", priority: "high", familySize: 1, preferences: "Tiny home", waitingSince: "2025-07-10" },
      { id: "wl-004", name: "James Park", priority: "medium", familySize: 3, preferences: "2-3BR home", waitingSince: "2025-10-05" },
      { id: "wl-005", name: "Aisha Okonkwo", priority: "low", familySize: 2, preferences: "Studio/1BR", waitingSince: "2025-11-12" }
    ];

    this.constructionMetrics = {
      totalUnitsPlanned: 65,
      totalBudget: 2900000,
      totalSpent: 75000,
      averageCompletionTime: "9.5 months",
      onTimeDelivery: "92%",
      budgetAdherence: "95%",
      sustainabilityScore: 94
    };
  }

  init(core) {
    this.core = core;
    this.storage = core.getService("storage");
    this.logger = core.getService("logger");
    
    const savedData = this.storage?.load("housing_expansion");
    if (savedData) {
      this.expansionProjects = savedData.projects || this.expansionProjects;
      this.waitlist = savedData.waitlist || this.waitlist;
    }
    
    this.logger?.info("HousingExpansionService initialized");
  }

  getExpansionProjects() {
    return this.expansionProjects;
  }

  getProject(projectId) {
    return this.expansionProjects.find(p => p.id === projectId);
  }

  getWaitlist() {
    return this.waitlist;
  }

  getConstructionMetrics() {
    return this.constructionMetrics;
  }

  updateProjectStatus(projectId, status) {
    const project = this.getProject(projectId);
    if (!project) return { success: false, error: "Project not found" };

    project.status = status;
    this.saveData();
    
    return { success: true, project };
  }

  updateMilestone(projectId, milestoneName, status) {
    const project = this.getProject(projectId);
    if (!project) return { success: false, error: "Project not found" };

    const milestone = project.milestones.find(m => m.name === milestoneName);
    if (!milestone) return { success: false, error: "Milestone not found" };

    milestone.status = status;
    
    // Recalculate completion percentage
    const completed = project.milestones.filter(m => m.status === "completed").length;
    project.completion = Math.round((completed / project.milestones.length) * 100);
    
    this.saveData();
    
    return { success: true, project };
  }

  updateBudget(projectId, spent) {
    const project = this.getProject(projectId);
    if (!project) return { success: false, error: "Project not found" };

    project.spent = spent;
    
    // Update total metrics
    this.constructionMetrics.totalSpent = this.expansionProjects.reduce((sum, p) => sum + p.spent, 0);
    
    this.saveData();
    
    return { success: true, project };
  }

  addToWaitlist(resident) {
    const newEntry = {
      id: `wl-${String(this.waitlist.length + 1).padStart(3, '0')}`,
      name: resident.name,
      priority: resident.priority || "medium",
      familySize: resident.familySize,
      preferences: resident.preferences,
      waitingSince: new Date().toISOString().split('T')[0]
    };
    
    this.waitlist.push(newEntry);
    this.saveData();
    
    return { success: true, entry: newEntry };
  }

  assignHousing(waitlistId, projectId, unitNumber) {
    const waitlistIndex = this.waitlist.findIndex(w => w.id === waitlistId);
    if (waitlistIndex === -1) return { success: false, error: "Waitlist entry not found" };

    const assigned = this.waitlist[waitlistIndex];
    this.waitlist.splice(waitlistIndex, 1);
    
    this.saveData();
    this.logger?.info(`Assigned housing to ${assigned.name} in project ${projectId}, unit ${unitNumber}`);
    
    return { success: true, message: `Housing assigned to ${assigned.name}` };
  }

  getProjectTimeline() {
    return this.expansionProjects.map(project => ({
      id: project.id,
      name: project.name,
      start: project.startDate,
      end: project.estimatedCompletion,
      status: project.status,
      completion: project.completion
    }));
  }

  getCapacityForecast() {
    const currentYear = new Date().getFullYear();
    const forecast = [];
    
    for (let i = 0; i <= 3; i++) {
      const year = currentYear + i;
      const completedByYear = this.expansionProjects.filter(p => 
        new Date(p.estimatedCompletion).getFullYear() <= year
      );
      
      const additionalUnits = completedByYear.reduce((sum, p) => sum + p.units, 0);
      
      forecast.push({
        year,
        additionalCapacity: additionalUnits,
        totalCapacity: 500 + additionalUnits,
        projectedOccupancy: Math.min(100, 90 + (i * 2))
      });
    }
    
    return forecast;
  }

  saveData() {
    this.storage?.save("housing_expansion", {
      projects: this.expansionProjects,
      waitlist: this.waitlist
    });
  }
}

export default HousingExpansionService;
