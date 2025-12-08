// src/services/ResilienceService.js

class ResilienceService {
  constructor() {
    this.status = "idle";
    this.riskAssessments = [];
    this.emergencyPlans = [];
    this.resources = {};
    this.alerts = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      this.setupEmergencyPlans();
      console.log("[ResilienceService] Resilience service initialized");
    } catch (error) {
      this.status = "error";
      console.error("[ResilienceService] Initialization failed", error);
    }
  }

  setupEmergencyPlans() {
    this.emergencyPlans = [
      {
        id: 1,
        name: "Drought Response",
        description: "Water conservation and emergency supplies protocol",
        status: "active",
        lastReview: "2025-01-10",
      },
      {
        id: 2,
        name: "Power Outage Protocol",
        description: "Grid failure contingency and energy management",
        status: "active",
        lastReview: "2024-12-15",
      },
      {
        id: 3,
        name: "Food Supply Disruption",
        description: "Emergency food resources and distribution plan",
        status: "active",
        lastReview: "2024-11-20",
      },
    ];

    this.resources = {
      emergency_water: 5000,
      emergency_food: 500,
      medical_supplies: 200,
      communication_devices: 50,
      power_generators: 3,
    };
  }

  assessRisks() {
    const risks = [
      {
        id: 1,
        type: "climate",
        severity: "high",
        description: "Extended drought period expected",
        probability: 0.6,
      },
      {
        id: 2,
        type: "infrastructure",
        severity: "medium",
        description: "Grid infrastructure aging",
        probability: 0.4,
      },
      {
        id: 3,
        type: "social",
        severity: "low",
        description: "Supply chain disruption potential",
        probability: 0.2,
      },
    ];
    this.riskAssessments = risks;
    return risks;
  }

  getEmergencyPlans() {
    return this.emergencyPlans;
  }

  getEmergencyResources() {
    return this.resources;
  }

  createAlert(type, severity, message) {
    try {
      const alert = {
        id: `alert-${Date.now()}`,
        type,
        severity,
        message,
        createdAt: new Date().toISOString(),
        acknowledged: false,
      };
      this.alerts.push(alert);
      console.warn(`[ResilienceService] Alert: ${message}`);
      return alert;
    } catch (error) {
      console.error("[ResilienceService] Create alert failed", error);
    }
  }

  getActiveAlerts() {
    return this.alerts.filter((a) => !a.acknowledged);
  }

  getResilienceScore() {
    const factors = {
      resources: Object.values(this.resources).reduce((a, b) => a + b, 0) > 5000 ? 85 : 60,
      plans: this.emergencyPlans.length * 20,
      riskAssessment: this.riskAssessments.length > 0 ? 80 : 50,
    };
    const avgScore = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
    return Math.min(Math.round(avgScore), 100);
  }
}

const resilienceService = new ResilienceService();
export default resilienceService;
