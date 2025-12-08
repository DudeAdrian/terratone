// src/services/PestManagementService.js
import sofieCore from "../core/SofieCore";

class PestManagementService {
  constructor() {
    this.status = "idle";
    this.alerts = [];
    this.treatments = [];
    this.riskAssessments = [];
    this.globalSchedule = null;
    this.monitored = {
      crops: [],
      zones: ["tropical", "subtropical", "temperate", "boreal", "arid"],
    };
  }

  initialize() {
    this.status = "initialized";
    this.globalSchedule = sofieCore.getService("globalGrowingSchedule");
    this.generateInitialRiskAssessments();
    sofieCore.getService("logger").log("[PestManagementService] Pest management service initialized");
  }

  // Regional pest profiles with severity scoring
  getPestProfiles() {
    return {
      tropical: {
        highRisk: [
          { name: "Leaf Spot", severity: 8, affectedCrops: ["lettuce", "basil", "chard"], seasonalPeak: [5, 6, 7, 8] },
          { name: "Powdery Mildew", severity: 7, affectedCrops: ["chard", "spinach"], seasonalPeak: [4, 5, 9, 10] },
          { name: "Aphids", severity: 7, affectedCrops: ["basil", "lettuce", "chard"], seasonalPeak: [3, 4, 8, 9] },
          { name: "Whitefly", severity: 8, affectedCrops: ["tomato", "basil"], seasonalPeak: [5, 6, 7, 8, 9] },
          { name: "Spider Mites", severity: 6, affectedCrops: ["lettuce", "spinach"], seasonalPeak: [6, 7, 8] },
        ],
        mediumRisk: [
          { name: "Fungal Rot", severity: 5, affectedCrops: ["tomato"], seasonalPeak: [11, 12, 1, 2] },
          { name: "Scale Insects", severity: 4, affectedCrops: ["basil"], seasonalPeak: [6, 7, 8, 9] },
        ],
      },
      subtropical: {
        highRisk: [
          { name: "Powdery Mildew", severity: 8, affectedCrops: ["chard", "spinach", "kale"], seasonalPeak: [4, 5, 9, 10] },
          { name: "Leaf Spot", severity: 7, affectedCrops: ["lettuce", "chard", "basil"], seasonalPeak: [4, 5, 8, 9] },
          { name: "Aphids", severity: 6, affectedCrops: ["basil", "kale"], seasonalPeak: [3, 4, 8, 9] },
          { name: "Tomato Hornworm", severity: 7, affectedCrops: ["tomato"], seasonalPeak: [5, 6, 7, 8, 9] },
          { name: "Whitefly", severity: 6, affectedCrops: ["tomato", "chard"], seasonalPeak: [6, 7, 8] },
        ],
        mediumRisk: [
          { name: "Spider Mites", severity: 4, affectedCrops: ["lettuce"], seasonalPeak: [7, 8] },
          { name: "Fungal Diseases", severity: 5, affectedCrops: ["tomato"], seasonalPeak: [11, 12] },
        ],
      },
      temperate: {
        highRisk: [
          { name: "Aphids", severity: 8, affectedCrops: ["lettuce", "kale", "spinach"], seasonalPeak: [4, 5, 9, 10] },
          { name: "Powdery Mildew", severity: 7, affectedCrops: ["chard", "spinach", "kale"], seasonalPeak: [5, 6, 8, 9] },
          { name: "Leaf Spot", severity: 6, affectedCrops: ["lettuce", "basil"], seasonalPeak: [5, 6, 8, 9] },
          { name: "Tomato Blight", severity: 8, affectedCrops: ["tomato"], seasonalPeak: [7, 8, 9] },
          { name: "Cucumber Beetles", severity: 6, affectedCrops: ["tomato"], seasonalPeak: [6, 7, 8] },
        ],
        mediumRisk: [
          { name: "Spider Mites", severity: 4, affectedCrops: ["lettuce", "spinach"], seasonalPeak: [7, 8] },
          { name: "Scale Insects", severity: 3, affectedCrops: ["basil"], seasonalPeak: [5, 6] },
        ],
      },
      boreal: {
        highRisk: [
          { name: "Aphids", severity: 7, affectedCrops: ["lettuce", "spinach", "kale"], seasonalPeak: [6, 7, 8] },
          { name: "Whitefly", severity: 6, affectedCrops: ["basil"], seasonalPeak: [6, 7] },
          { name: "Spider Mites", severity: 5, affectedCrops: ["lettuce", "spinach"], seasonalPeak: [7, 8] },
        ],
        mediumRisk: [
          { name: "Leaf Spot", severity: 4, affectedCrops: ["lettuce"], seasonalPeak: [7, 8] },
          { name: "Powdery Mildew", severity: 3, affectedCrops: ["chard"], seasonalPeak: [8] },
        ],
      },
      arid: {
        highRisk: [
          { name: "Spider Mites", severity: 8, affectedCrops: ["lettuce", "spinach"], seasonalPeak: [1, 2, 3, 4] },
          { name: "Whitefly", severity: 7, affectedCrops: ["basil", "tomato"], seasonalPeak: [12, 1, 2, 3] },
          { name: "Leaf Hopper", severity: 6, affectedCrops: ["chard", "spinach"], seasonalPeak: [1, 2, 3, 4] },
        ],
        mediumRisk: [
          { name: "Scale Insects", severity: 5, affectedCrops: ["basil"], seasonalPeak: [2, 3] },
          { name: "Aphids", severity: 4, affectedCrops: ["lettuce"], seasonalPeak: [1, 4] },
        ],
      },
    };
  }

  // Prevention strategies by pest type
  getPreventionStrategies() {
    return {
      "Leaf Spot": {
        preventative: [
          "Remove infected leaves immediately",
          "Improve air circulation with fans",
          "Maintain 40-60% humidity",
          "Avoid overhead watering",
          "Sanitize tools between plants",
        ],
        organic: [
          "Neem oil spray every 7 days",
          "Baking soda solution (1:2 ratio with water)",
          "Sulfur dust (temperature dependent)",
          "Copper fungicide for severe cases",
        ],
        ipm: ["Scout twice weekly", "Remove affected leaves", "Monitor humidity sensors", "Adjust watering schedule"],
      },
      "Powdery Mildew": {
        preventative: [
          "Ensure 40-60% humidity range",
          "Increase air circulation",
          "Space plants adequately",
          "Remove lower leaves for airflow",
          "Monitor temperature (ideal 65-75°F)",
        ],
        organic: [
          "Sulfur dust (apply weekly)",
          "Neem oil spray",
          "Baking soda spray (1 tbsp per gallon)",
          "Milk spray (1:9 ratio with water)",
        ],
        ipm: ["Scout weekly", "Prune to improve air flow", "Monitor humidity", "Apply early in disease cycle"],
      },
      "Aphids": {
        preventative: [
          "Use reflective mulches to confuse",
          "Encourage natural predators (ladybugs, lacewings)",
          "Avoid excessive nitrogen fertilizer",
          "Remove infested plants quickly",
          "Monitor with sticky traps",
        ],
        organic: [
          "Insecticidal soap spray",
          "Neem oil every 7-10 days",
          "Release beneficial insects (Ladybugs, Parasitic wasps)",
          "Spinosad for severe infestations",
        ],
        ipm: ["Weekly scouting", "Use sticky traps", "Introduce beneficials early", "Spray only affected areas"],
      },
      "Spider Mites": {
        preventative: [
          "Increase humidity (60-70%)",
          "Mist plants regularly",
          "Avoid excessive heat",
          "Monitor with web presence",
          "Keep area clean of debris",
        ],
        organic: [
          "Spray with water (strong mist)",
          "Neem oil every 5-7 days",
          "Predatory mites (Phytoseiulus persimilis)",
          "Sulfur dust (avoid temperatures above 85°F)",
        ],
        ipm: ["Scout frequently", "Increase humidity early", "Monitor undersides of leaves", "Apply before populations boom"],
      },
      "Whitefly": {
        preventative: [
          "Use yellow sticky traps",
          "Maintain optimal humidity",
          "Avoid overcrowding",
          "Isolate infested plants",
          "Encourage parasitic wasps",
        ],
        organic: [
          "Neem oil spray (weekly)",
          "Insecticidal soap",
          "Yellow sticky traps",
          "Vacuum adults with handheld device",
        ],
        ipm: ["Daily scouting", "Yellow traps for monitoring", "Early intervention", "Release parasitic wasps (Encarsia)"],
      },
      "Tomato Blight": {
        preventative: [
          "Remove lower leaves (6 inches from soil)",
          "Space plants for air circulation",
          "Avoid overhead watering",
          "Mulch to prevent soil splash",
          "Sterilize tools between plants",
        ],
        organic: [
          "Copper fungicide weekly",
          "Bacillus subtilis (Serenade)",
          "Remove infected portions",
          "Dispose of infected plants (burn, not compost)",
        ],
        ipm: ["Scout for symptoms", "Remove lower leaves", "Destroy infected portions", "Monitor weather (cool, wet)"],
      },
    };
  }

  // Generate initial risk assessments for all zones
  generateInitialRiskAssessments() {
    const profiles = this.getPestProfiles();
    const currentMonth = new Date().getMonth() + 1;

    Object.keys(profiles).forEach(zone => {
      const profile = profiles[zone];
      const highRiskPests = profile.highRisk.filter(p => p.seasonalPeak.includes(currentMonth));
      const mediumRiskPests = profile.mediumRisk.filter(p => p.seasonalPeak.includes(currentMonth));

      const assessment = {
        zone,
        month: currentMonth,
        timestamp: new Date().toISOString(),
        overallRisk: this.calculateRiskScore(highRiskPests, mediumRiskPests),
        activeThreats: [...highRiskPests, ...mediumRiskPests],
        recommendations: this.generateRecommendations(highRiskPests, mediumRiskPests),
      };

      this.riskAssessments.push(assessment);
    });
  }

  // Calculate overall risk score (0-100)
  calculateRiskScore(highRiskPests, mediumRiskPests) {
    const highRiskScore = highRiskPests.reduce((sum, p) => sum + p.severity, 0) * 2;
    const mediumRiskScore = mediumRiskPests.reduce((sum, p) => sum + p.severity, 0);
    const totalScore = (highRiskScore + mediumRiskScore) / 10;
    return Math.min(totalScore, 100);
  }

  // Generate recommendations based on active threats
  generateRecommendations(highRiskPests, mediumRiskPests) {
    const recommendations = [];

    if (highRiskPests.length > 0) {
      recommendations.push({
        priority: "high",
        message: `${highRiskPests.length} high-risk pests currently active in your region`,
        pests: highRiskPests.map(p => p.name),
        action: "Review prevention strategies and increase scouting frequency",
      });
    }

    if (mediumRiskPests.length > 0) {
      recommendations.push({
        priority: "medium",
        message: `${mediumRiskPests.length} medium-risk pests to monitor`,
        pests: mediumRiskPests.map(p => p.name),
        action: "Implement preventative measures and monitor with traps",
      });
    }

    if (highRiskPests.length === 0 && mediumRiskPests.length === 0) {
      recommendations.push({
        priority: "low",
        message: "Current pest pressure is minimal for your region",
        action: "Maintain prevention protocols and continue regular scouting",
      });
    }

    return recommendations;
  }

  // Get risk assessment for specific zone and month
  getRiskAssessment(zone, month = null) {
    const monthToCheck = month || new Date().getMonth() + 1;
    const assessment = this.riskAssessments.find(a => a.zone === zone && a.month === monthToCheck);
    
    if (!assessment) {
      // Generate on demand
      const profiles = this.getPestProfiles();
      const profile = profiles[zone];
      if (!profile) return null;

      const activeThreats = [
        ...profile.highRisk.filter(p => p.seasonalPeak.includes(monthToCheck)),
        ...profile.mediumRisk.filter(p => p.seasonalPeak.includes(monthToCheck)),
      ];

      return {
        zone,
        month: monthToCheck,
        overallRisk: this.calculateRiskScore(
          profile.highRisk.filter(p => p.seasonalPeak.includes(monthToCheck)),
          profile.mediumRisk.filter(p => p.seasonalPeak.includes(monthToCheck))
        ),
        activeThreats,
        recommendations: this.generateRecommendations(
          profile.highRisk.filter(p => p.seasonalPeak.includes(monthToCheck)),
          profile.mediumRisk.filter(p => p.seasonalPeak.includes(monthToCheck))
        ),
      };
    }

    return assessment;
  }

  // Get prevention strategies for a specific pest
  getPestPrevention(pestName) {
    return this.getPreventionStrategies()[pestName] || null;
  }

  // Log a treatment application
  logTreatment(cropId, pestName, treatment) {
    const record = {
      id: Date.now(),
      cropId,
      pestName,
      treatment,
      date: new Date().toISOString(),
      effectiveness: 0, // 0-100, updated after observation period
      notes: "",
    };

    this.treatments.push(record);
    sofieCore.getService("logger").info("[PestManagementService] Treatment logged", { pestName, treatment });
    
    // Schedule follow-up assessment in 7 days
    setTimeout(() => {
      sofieCore.getService("logger").info("[PestManagementService] Follow-up assessment needed for:", pestName);
    }, 7 * 24 * 60 * 60 * 1000);

    return record;
  }

  // Create pest alert
  createAlert(zone, cropId, pestName, severity) {
    const alert = {
      id: Date.now(),
      zone,
      cropId,
      pestName,
      severity, // "low", "medium", "high"
      status: "active",
      timestamp: new Date().toISOString(),
      prevention: this.getPestPrevention(pestName),
      recommendations: [],
    };

    // Add recommendations based on severity
    if (severity === "high") {
      alert.recommendations = [
        "Scout affected plants immediately",
        "Implement intensive monitoring",
        "Prepare organic treatments",
        "Consider quarantine/isolation",
        "Increase aeration/circulation",
      ];
    } else if (severity === "medium") {
      alert.recommendations = [
        "Increase scouting frequency",
        "Apply preventative treatments",
        "Monitor microclimate conditions",
        "Review pest population trends",
      ];
    } else {
      alert.recommendations = [
        "Monitor with traps",
        "Maintain prevention protocols",
        "Continue regular scouting",
      ];
    }

    this.alerts.push(alert);
    sofieCore.getService("logger").warn(`[PestManagementService] ALERT: ${severity.toUpperCase()} pest alert created`, alert);
    
    return alert;
  }

  // Get active alerts
  getActiveAlerts() {
    return this.alerts.filter(a => a.status === "active");
  }

  // Resolve/close an alert
  resolveAlert(alertId, resolution) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = "resolved";
      alert.resolution = resolution;
      alert.resolvedAt = new Date().toISOString();
      sofieCore.getService("logger").info("[PestManagementService] Alert resolved", { alertId, resolution });
    }
    return alert;
  }

  // Get treatment history for a crop
  getTreatmentHistory(cropId) {
    return this.treatments.filter(t => t.cropId === cropId);
  }

  // Update treatment effectiveness after observation period
  updateTreatmentEffectiveness(treatmentId, effectiveness, notes) {
    const treatment = this.treatments.find(t => t.id === treatmentId);
    if (treatment) {
      treatment.effectiveness = effectiveness;
      treatment.notes = notes;
      sofieCore.getService("logger").info("[PestManagementService] Treatment effectiveness updated", { treatmentId, effectiveness });
    }
    return treatment;
  }

  // Get all alerts
  getAllAlerts() {
    return this.alerts;
  }

  // Get all risk assessments
  getAllRiskAssessments() {
    return this.riskAssessments;
  }

  /**
   * Get current risk level (for AutopilotService)
   * Returns 0-100 where higher = more risk
   */
  getCurrentRiskLevel() {
    if (this.riskAssessments.length === 0) return 30; // Default low risk
    
    // Get most recent assessment
    const latest = this.riskAssessments[this.riskAssessments.length - 1];
    
    // Map severity to risk score
    const severityMap = {
      low: 20,
      medium: 50,
      high: 80,
      critical: 95,
    };
    
    return severityMap[latest.severity] || 30;
  }

  /**
   * Get pest population estimate (for AutopilotService)
   * Returns estimated pest count across all locations
   */
  getPestPopulation() {
    let total = 0;
    
    this.monitoringData.forEach((entry) => {
      if (entry.count) {
        total += entry.count;
      }
    });
    
    return total || 15; // Default if no data
  }

  /**
   * Get disease risk score (for AutopilotService)
   * Returns 0-100 where higher = more disease risk
   */
  getDiseaseRisk() {
    // Check recent assessments for disease-related issues
    const recentAssessments = this.riskAssessments.slice(-5);
    
    if (recentAssessments.length === 0) return 25; // Default low risk
    
    const diseaseCount = recentAssessments.filter((a) => 
      a.pestType && (
        a.pestType.toLowerCase().includes('disease') ||
        a.pestType.toLowerCase().includes('fungus') ||
        a.pestType.toLowerCase().includes('blight') ||
        a.pestType.toLowerCase().includes('rot')
      )
    ).length;
    
    // More disease reports = higher risk
    const baseRisk = 20;
    const riskIncrement = diseaseCount * 15;
    
    return Math.min(baseRisk + riskIncrement, 100);
  }
}

export default PestManagementService;
