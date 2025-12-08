// src/services/AutopilotService.js
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

class AutopilotService {
  constructor() {
    this.status = "idle";
    this.mode = "manual"; // "manual" or "autopilot"
    this.decisions = [];
    this.playbooks = {};
    this.alerts = [];
    this.interventions = [];
    this.schedules = {};
    this.thresholds = {};
    this.lastExecution = null;
    this.executionHistory = [];
  }

  initialize() {
    this.status = "initialized";
    this.mode = "manual";
    this.initializePlaybooks();
    this.initializeThresholds();
    this.initializeSchedules();
    sofieCore.getService("logger").log("[AutopilotService] Autopilot service initialized with 6 playbooks");
    
    // Emit initialization event
    eventBus.emit(EVENTS.SERVICE_INITIALIZED, { service: 'autopilot' });
  }

  // ============================================================================
  // PLAYBOOK DEFINITIONS
  // ============================================================================

  initializePlaybooks() {
    this.playbooks = {
      // Automated water management
      waterManagement: {
        name: "Water Management Playbook",
        description: "Auto-regulate water quality and recycling efficiency",
        enabled: true,
        interval: "daily",
        actions: [
          {
            id: "wm-check-quality",
            name: "Check Water Quality",
            description: "Monitor pH, temperature, dissolved oxygen, ammonia levels",
            trigger: "hourly",
            conditions: [
              { metric: "pH", operator: "<", threshold: 6.8, action: "addBuffer" },
              { metric: "pH", operator: ">", threshold: 8.2, action: "reduceAcidity" },
              { metric: "temperature", operator: "<", threshold: 20, action: "increaseHeating" },
              { metric: "temperature", operator: ">", threshold: 32, action: "enableCooling" },
              { metric: "dissolvedOxygen", operator: "<", threshold: 6, action: "increaseAeration" },
              { metric: "ammonia", operator: ">", threshold: 2, action: "increaseWaterChange" },
            ],
            manualReview: false,
            priority: "high",
          },
          {
            id: "wm-adjust-recycling",
            name: "Optimize Recycling",
            description: "Adjust water flow and recycling rate for optimal efficiency",
            trigger: "daily",
            conditions: [
              { metric: "recyclingEfficiency", operator: "<", threshold: 85, action: "optimizeFlow" },
              { metric: "freshWaterUsage", operator: ">", threshold: "20%ofTotal", action: "reduceIntake" },
            ],
            manualReview: true,
            priority: "medium",
          },
        ],
        lastRun: null,
        successRate: 0.98,
      },

      // Automated nutrient management
      nutrientManagement: {
        name: "Nutrient Management Playbook",
        description: "Auto-regulate nitrogen cycle and nutrient levels",
        enabled: true,
        interval: "daily",
        actions: [
          {
            id: "nm-monitor-nitrification",
            name: "Monitor Nitrification Cycle",
            description: "Track ammonia → nitrite → nitrate conversion",
            trigger: "every-6-hours",
            conditions: [
              { metric: "ammonia", operator: ">", threshold: 2, action: "increaseAeration" },
              { metric: "nitrite", operator: ">", threshold: 0.5, action: "balanceBacteria" },
              { metric: "nitrateLevel", operator: "<", threshold: 20, action: "addNitrogenSource" },
            ],
            manualReview: false,
            priority: "high",
          },
          {
            id: "nm-balance-feeding",
            name: "Optimize Fish Feeding",
            description: "Adjust daily feeding rate based on water quality and fish growth",
            trigger: "daily",
            conditions: [
              { metric: "feedingRate", operator: "adjust", threshold: "2-3% bodyWeight", action: "updateSchedule" },
              { metric: "ammoniaSpikeDetected", operator: "true", action: "reduceFeedingTemporarily" },
              { metric: "fishGrowthRate", operator: ">", threshold: "above-expected", action: "increaseFeedingGradually" },
            ],
            manualReview: true,
            priority: "high",
          },
        ],
        lastRun: null,
        successRate: 0.95,
      },

      // Automated pest and disease management
      pestControl: {
        name: "Pest Management Playbook",
        description: "Auto-detect and prevent pest and disease outbreaks",
        enabled: true,
        interval: "daily",
        actions: [
          {
            id: "pc-risk-assessment",
            name: "Daily Risk Assessment",
            description: "Evaluate pest and disease risk by climate zone and season",
            trigger: "daily",
            conditions: [
              { metric: "riskLevel", operator: ">", threshold: 60, action: "generateAlert" },
              { metric: "riskLevel", operator: ">", threshold: 80, action: "escalateToManualReview" },
            ],
            manualReview: false,
            priority: "high",
          },
          {
            id: "pc-preventative-measures",
            name: "Apply Preventative Measures",
            description: "Implement organic prevention strategies before outbreak",
            trigger: "seasonal",
            conditions: [
              { metric: "seasonalPeakApproaching", operator: "true", action: "startOrganicTreatments" },
              { metric: "prevailingPest", operator: "detected", action: "applyPreventativeSpray" },
              { metric: "airCirculation", operator: "<", threshold: "optimal", action: "increaseFans" },
            ],
            manualReview: true,
            priority: "high",
          },
          {
            id: "pc-treatment-tracking",
            name: "Track Treatment Effectiveness",
            description: "Monitor effectiveness of pest treatments and adjust strategy",
            trigger: "every-3-days",
            conditions: [
              { metric: "treatmentEffectiveness", operator: "<", threshold: 60, action: "escalateToManual" },
              { metric: "pestPopulation", operator: "increasing", action: "increaseIntervention" },
            ],
            manualReview: true,
            priority: "medium",
          },
        ],
        lastRun: null,
        successRate: 0.92,
      },

      // Automated crop rotation and succession planning
      cropRotation: {
        name: "Crop Rotation Playbook",
        description: "Auto-manage crop cycles and succession planning",
        enabled: true,
        interval: "weekly",
        actions: [
          {
            id: "cr-cycle-planning",
            name: "Plan Next Cycle",
            description: "Recommend next crops based on soil health, current production, and market demand",
            trigger: "weekly",
            conditions: [
              { metric: "harvestCycleComplete", operator: "true", action: "planNextRotation" },
              { metric: "soilNutrientDepletion", operator: ">", threshold: 30, action: "recommendRestPeriod" },
              { metric: "seedAvailability", operator: "check", threshold: "inStock", action: "planSowing" },
            ],
            manualReview: true,
            priority: "medium",
          },
          {
            id: "cr-diversity-balance",
            name: "Maintain Crop Diversity",
            description: "Ensure balanced diversity for nutrition and disease resilience",
            trigger: "monthly",
            conditions: [
              { metric: "cropDiversity", operator: "<", threshold: 5, action: "addComplementaryCrop" },
              { metric: "nutritionBalance", operator: "evaluate", action: "recommendCrops" },
              { metric: "proteinProduction", operator: "<", threshold: "targetDaily", action: "increaseProteinCrops" },
            ],
            manualReview: true,
            priority: "medium",
          },
          {
            id: "cr-succession-timing",
            name: "Succession Planting",
            description: "Automatically schedule staggered plantings for continuous harvest",
            trigger: "every-2-weeks",
            conditions: [
              { metric: "daysToMaturity", operator: "calculated", threshold: "optimal-spacing", action: "schedulePlanting" },
              { metric: "harvestGap", operator: ">", threshold: "3-days", action: "plantSuccession" },
            ],
            manualReview: false,
            priority: "medium",
          },
        ],
        lastRun: null,
        successRate: 0.90,
      },

      // Automated climate control
      climateControl: {
        name: "Climate Control Playbook",
        description: "Auto-maintain optimal growing conditions",
        enabled: true,
        interval: "hourly",
        actions: [
          {
            id: "cc-temperature",
            name: "Maintain Temperature",
            description: "Auto-adjust heating/cooling for zone and crop requirements",
            trigger: "continuous",
            conditions: [
              { metric: "temperature", operator: "<", threshold: "optimal-2", action: "increaseHeating" },
              { metric: "temperature", operator: ">", threshold: "optimal+2", action: "enableCooling" },
              { metric: "nightTemperature", operator: "monitorDrop", threshold: "5-degree-drop", action: "adjustHeating" },
            ],
            manualReview: false,
            priority: "high",
          },
          {
            id: "cc-humidity",
            name: "Regulate Humidity",
            description: "Auto-adjust ventilation and misting for humidity balance",
            trigger: "continuous",
            conditions: [
              { metric: "humidity", operator: "<", threshold: 40, action: "enableMisting" },
              { metric: "humidity", operator: ">", threshold: 70, action: "increaseVentilation" },
              { metric: "humidityVariance", operator: ">", threshold: 20, action: "balanceAirflow" },
            ],
            manualReview: false,
            priority: "high",
          },
          {
            id: "cc-lighting",
            name: "Manage Lighting",
            description: "Auto-adjust grow lights based on natural light and crop needs",
            trigger: "daily",
            conditions: [
              { metric: "naturalLight", operator: "<", threshold: "8-hours", action: "extendGrowLights" },
              { metric: "photoperiod", operator: "adjust", threshold: "crop-specific", action: "setLightSchedule" },
            ],
            manualReview: false,
            priority: "medium",
          },
        ],
        lastRun: null,
        successRate: 0.97,
      },

      // Automated system health monitoring
      systemMonitoring: {
        name: "System Health Monitoring Playbook",
        description: "Auto-detect and alert on system anomalies and maintenance needs",
        enabled: true,
        interval: "every-6-hours",
        actions: [
          {
            id: "sm-equipment-health",
            name: "Monitor Equipment Status",
            description: "Check all system equipment for faults and maintenance needs",
            trigger: "every-4-hours",
            conditions: [
              { metric: "pumpEfficiency", operator: "<", threshold: 90, action: "scheduleMaintenanceAlert" },
              { metric: "powerConsumption", operator: ">", threshold: "baseline+15%", action: "investigateAnomaly" },
              { metric: "equipmentRuntime", operator: ">", threshold: "maintenanceInterval", action: "scheduleService" },
            ],
            manualReview: true,
            priority: "high",
          },
          {
            id: "sm-system-alerts",
            name: "Generate System Alerts",
            description: "Create alerts for parameters outside normal range",
            trigger: "continuous",
            conditions: [
              { metric: "anySystemAlert", operator: "triggered", action: "notifyOperator" },
              { metric: "criticalAlert", operator: "true", action: "escalateImmediate" },
            ],
            manualReview: false,
            priority: "high",
          },
        ],
        lastRun: null,
        successRate: 0.99,
      },
    };
  }

  // Initialize decision thresholds for autopilot actions
  initializeThresholds() {
    this.thresholds = {
      // Water quality thresholds (range of acceptable values)
      water: {
        pH: { min: 6.8, max: 8.2, critical_min: 6.5, critical_max: 8.5 },
        temperature: { min: 20, max: 32, optimal: 26, critical_min: 18, critical_max: 35 },
        dissolvedOxygen: { min: 6, target: 8, critical_min: 5 },
        ammonia: { max: 2, critical_max: 4 },
        nitrite: { max: 0.5, critical_max: 1 },
        nitrate: { min: 20, max: 150 },
        conductivity: { min: 1000, max: 3000 },
      },

      // Fish health thresholds
      fish: {
        feedingRate: "2-3% body weight daily",
        stressIndicators: { maxLevel: 3, escalateAt: 2 },
        mortalityRate: { alertAt: 2, escalateAt: 5 },
        growthRate: { minExpected: 3, maxExpected: 8 }, // % per week
      },

      // Crop health thresholds
      crop: {
        nutrientDepleted: { alertAt: 50, escalateAt: 70 },
        diseaseRiskScore: { alertAt: 60, escalateAt: 80 },
        pestPopulationDensity: { alertAt: 50, escalateAt: 100 },
        yieldVariance: { alertAt: 20, escalateAt: 35 }, // % below expected
      },

      // System efficiency thresholds
      system: {
        recyclingEfficiency: { min: 85, target: 92 },
        powerUsageVariance: { max: 15 }, // % above baseline
        equipmentDowntime: { alertAt: 2, escalateAt: 8 }, // hours
        maintenanceInterval: { checkEvery: 168 }, // hours (1 week)
      },
    };
  }

  // Initialize automatic schedules
  initializeSchedules() {
    this.schedules = {
      waterQualityCheck: {
        frequency: "hourly",
        time: "every-hour",
        autoAction: true,
      },
      nutrientFeeding: {
        frequency: "daily",
        time: "08:00-AM",
        autoAction: true,
      },
      pestRiskAssessment: {
        frequency: "daily",
        time: "06:00-AM",
        autoAction: true,
      },
      cropRotationReview: {
        frequency: "weekly",
        time: "Monday-09:00-AM",
        autoAction: false, // requires manual review
      },
      systemMaintenance: {
        frequency: "weekly",
        time: "Saturday-14:00-PM",
        autoAction: false, // requires manual scheduling
      },
      fullSystemDiagnostic: {
        frequency: "monthly",
        time: "1st-of-month-02:00-AM",
        autoAction: true,
      },
    };
  }

  // ============================================================================
  // AUTOPILOT EXECUTION ENGINE
  // ============================================================================

  /**
   * Execute autopilot logic - main entry point
   * @param {string} mode - "manual" or "autopilot"
   * @returns {object} execution result with decisions and alerts
   */
  executeAutopilot(mode = "autopilot") {
    if (mode === "manual") {
      this.mode = "manual";
      return { mode: "manual", status: "waiting-for-manual-input" };
    }

    this.mode = "autopilot";
    const execution = {
      timestamp: new Date().toISOString(),
      mode: "autopilot",
      decisions: [],
      alerts: [],
      interventions: [],
      success: true,
    };

    try {
      // Execute each enabled playbook
      Object.entries(this.playbooks).forEach(([playbookKey, playbook]) => {
        if (playbook.enabled) {
          const result = this.executePlaybook(playbookKey, playbook);
          execution.decisions.push(...result.decisions);
          execution.alerts.push(...result.alerts);
          execution.interventions.push(...result.interventions);
        }
      });

      this.lastExecution = execution;
      this.executionHistory.push(execution);
      sofieCore.getService("logger").log(`[AutopilotService] Executed autopilot: ${execution.decisions.length} decisions, ${execution.alerts.length} alerts`);

      // Emit events for decisions and interventions
      execution.decisions.forEach(decision => {
        eventBus.emit(EVENTS.AUTOPILOT_DECISION, decision);
      });
      
      execution.interventions.forEach(intervention => {
        eventBus.emit(EVENTS.AUTOPILOT_INTERVENTION, intervention);
      });

      return execution;
    } catch (error) {
      execution.success = false;
      execution.error = error.message;
      sofieCore.getService("logger").error(`[AutopilotService] Autopilot execution failed: ${error.message}`);
      
      // Emit error event
      eventBus.emit(EVENTS.SERVICE_ERROR, { service: 'autopilot', error: error.message });
      
      return execution;
    }
  }

  /**
   * Execute a single playbook with its actions
   */
  executePlaybook(playbookKey, playbook) {
    const result = {
      playbookKey,
      playbookName: playbook.name,
      decisions: [],
      alerts: [],
      interventions: [],
    };

    playbook.actions.forEach(action => {
      const actionResult = this.evaluateActionConditions(action, playbookKey);
      if (actionResult.triggered) {
        result.decisions.push(actionResult);
        if (action.manualReview) {
          result.interventions.push({
            id: action.id,
            type: "manual-review",
            action: action.name,
            reason: actionResult.reason,
            priority: action.priority,
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    playbook.lastRun = new Date().toISOString();
    return result;
  }

  /**
   * Evaluate if action conditions are met
   */
  evaluateActionConditions(action, playbookKey) {
    const result = {
      actionId: action.id,
      actionName: action.name,
      triggered: false,
      triggeredConditions: [],
      reason: "",
    };

    action.conditions.forEach(condition => {
      const conditionMet = this.evaluateCondition(condition);
      if (conditionMet) {
        result.triggeredConditions.push(condition);
        result.triggered = true;
        result.reason = `${condition.metric} triggered: ${condition.action}`;
      }
    });

    return result;
  }

  /**
   * Evaluate individual condition
   */
  evaluateCondition(condition) {
    // In real implementation, fetch actual metrics from services
    // For now, return simulation logic
    const actualValue = this.getMetricValue(condition.metric);

    switch (condition.operator) {
      case "<":
        return actualValue < condition.threshold;
      case ">":
        return actualValue > condition.threshold;
      case "=":
        return actualValue === condition.threshold;
      case "adjust":
        return true; // Always trigger adjustment checks
      case "check":
        return true; // Always trigger checks
      case "evaluate":
        return true; // Always trigger evaluations
      default:
        return false;
    }
  }

  /**
   * Get current metric value from services
   */
  getMetricValue(metricName) {
    // Fetch from actual services
    const waterService = sofieCore.getService("waterRecycling");
    const foodService = sofieCore.getService("food");
    const pestService = sofieCore.getService("pestManagement");
    const energyService = sofieCore.getService("energy");
    const housingService = sofieCore.getService("housing");

    try {
      switch (metricName) {
        // Water Quality Metrics
        case "pH":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.pH || 7.0;
          }
          return 7.2; // Safe default

        case "temperature":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.temperature || 25;
          }
          return 26; // Safe default

        case "dissolvedOxygen":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.dissolvedOxygen || 6.5;
          }
          return 7.5; // Safe default

        case "ammonia":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.ammonia || 0.5;
          }
          return 0.8;

        case "nitrite":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.nitrite || 0.1;
          }
          return 0.2;

        case "nitrate":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.nitrate || 40;
          }
          return 45;

        case "conductivity":
          if (waterService && waterService.currentMetrics) {
            return waterService.currentMetrics.conductivity || 1500;
          }
          return 1800;

        case "recyclingEfficiency":
          if (waterService && typeof waterService.getRecyclingEfficiency === "function") {
            return waterService.getRecyclingEfficiency();
          }
          return 88;

        // Food/Crop Metrics
        case "feedingRate":
          if (foodService && typeof foodService.getCurrentFeedingRate === "function") {
            return foodService.getCurrentFeedingRate();
          }
          return 2.5;

        case "cropDiversity":
          if (foodService && typeof foodService.getActiveCropsCount === "function") {
            return foodService.getActiveCropsCount();
          }
          return 6;

        case "nutritionBalance":
          if (foodService && typeof foodService.getNutritionBalance === "function") {
            return foodService.getNutritionBalance();
          }
          return 0.92;

        case "proteinProduction":
          if (foodService && typeof foodService.getDailyProteinProduction === "function") {
            return foodService.getDailyProteinProduction();
          }
          return 120; // grams per day

        case "yieldVariance":
          if (foodService && typeof foodService.getYieldVariance === "function") {
            return foodService.getYieldVariance();
          }
          return 5;

        // Pest Management Metrics
        case "riskLevel":
          if (pestService && typeof pestService.getCurrentRiskLevel === "function") {
            return pestService.getCurrentRiskLevel();
          }
          return 45;

        case "pestPopulation":
          if (pestService && typeof pestService.getPestPopulation === "function") {
            return pestService.getPestPopulation();
          }
          return 25;

        case "diseaseRiskScore":
          if (pestService && typeof pestService.getDiseaseRisk === "function") {
            return pestService.getDiseaseRisk();
          }
          return 40;

        // Energy/Equipment Metrics
        case "pumpEfficiency":
          if (energyService && typeof energyService.getPumpEfficiency === "function") {
            return energyService.getPumpEfficiency();
          }
          return 92;

        case "powerConsumption":
          if (energyService && typeof energyService.getCurrentPowerConsumption === "function") {
            return energyService.getCurrentPowerConsumption();
          }
          return 1200; // watts

        case "equipmentRuntime":
          if (housingService && typeof housingService.getEquipmentRuntime === "function") {
            return housingService.getEquipmentRuntime();
          }
          return 2400; // hours

        default:
          console.warn(`[AutopilotService] Unknown metric: ${metricName}`);
          return 0;
      }
    } catch (error) {
      console.error(`[AutopilotService] Error fetching metric ${metricName}:`, error);
      return 0;
    }
  }

  // ============================================================================
  // DECISION TRACKING & LOGGING
  // ============================================================================

  /**
   * Get all decisions made by autopilot
   */
  getDecisions(limit = 100) {
    return this.decisions.slice(-limit);
  }

  /**
   * Get alerts requiring manual intervention
   */
  getInterventionAlerts(priority = null) {
    let alerts = this.interventions;
    if (priority) {
      alerts = alerts.filter(a => a.priority === priority);
    }
    return alerts;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit = 50) {
    return this.executionHistory.slice(-limit);
  }

  /**
   * Get playbook status and performance
   */
  getPlaybookStatus() {
    return Object.entries(this.playbooks).map(([key, playbook]) => ({
      id: key,
      name: playbook.name,
      enabled: playbook.enabled,
      lastRun: playbook.lastRun,
      successRate: playbook.successRate,
      actionCount: playbook.actions.length,
      interval: playbook.interval,
    }));
  }

  /**
   * Enable/disable specific playbook
   */
  togglePlaybook(playbookKey, enabled) {
    if (this.playbooks[playbookKey]) {
      this.playbooks[playbookKey].enabled = enabled;
      sofieCore.getService("logger").log(`[AutopilotService] Playbook '${playbookKey}' ${enabled ? "enabled" : "disabled"}`);
      
      // Emit playbook toggle event
      eventBus.emit(EVENTS.AUTOPILOT_PLAYBOOK_TOGGLED, { playbook: playbookKey, enabled });
      
      return true;
    }
    return false;
  }

  /**
   * Get current mode
   */
  getMode() {
    return {
      current: this.mode,
      lastSwitch: new Date().toISOString(),
      playbooksActive: Object.values(this.playbooks).filter(p => p.enabled).length,
      totalPlaybooks: Object.keys(this.playbooks).length,
    };
  }

  /**
   * Switch between manual and autopilot
   */
  setMode(newMode) {
    if (["manual", "autopilot"].includes(newMode)) {
      const previousMode = this.mode;
      this.mode = newMode;
      sofieCore.getService("logger").log(`[AutopilotService] Mode switched from '${previousMode}' to '${newMode}'`);
      
      // Emit mode change event
      eventBus.emit(EVENTS.AUTOPILOT_MODE_CHANGED, { previousMode, newMode });
      
      return { previousMode, newMode, success: true };
    }
    return { success: false, error: "Invalid mode" };
  }

  /**
   * Get system health score based on playbook success rates
   */
  getSystemHealthScore() {
    const playbookScores = Object.values(this.playbooks).map(p => p.successRate);
    const average = playbookScores.reduce((a, b) => a + b, 0) / playbookScores.length;
    return Math.round(average * 100);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(e => e.success).length;
    const totalDecisions = this.executionHistory.reduce((sum, e) => sum + e.decisions.length, 0);
    const totalAlerts = this.executionHistory.reduce((sum, e) => sum + e.alerts.length, 0);

    return {
      totalExecutions,
      successfulExecutions,
      successRate: totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0,
      totalDecisions,
      averageDecisionsPerExecution: totalExecutions > 0 ? Math.round(totalDecisions / totalExecutions) : 0,
      totalAlerts,
      averageAlertsPerExecution: totalExecutions > 0 ? Math.round(totalAlerts / totalExecutions) : 0,
      systemHealthScore: this.getSystemHealthScore(),
      enabledPlaybooks: Object.values(this.playbooks).filter(p => p.enabled).length,
      totalPlaybooks: Object.keys(this.playbooks).length,
    };
  }
}

export default AutopilotService;
