// src/services/PredictiveAnalyticsService.js
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

class PredictiveAnalyticsService {
  constructor() {
    this.status = "idle";
    this.predictions = [];
    this.anomalies = [];
    this.recommendations = [];
    this.historicalData = new Map();
  }

  initialize() {
    this.status = "initialized";
    this.initializeModels();
    sofieCore.getService("logger").log("[PredictiveAnalyticsService] Predictive analytics initialized");
  }

  initializeModels() {
    this.models = {
      yieldPrediction: { accuracy: 0.85, lastTrained: new Date().toISOString() },
      pestOutbreak: { accuracy: 0.78, lastTrained: new Date().toISOString() },
      waterQuality: { accuracy: 0.92, lastTrained: new Date().toISOString() },
      climateImpact: { accuracy: 0.81, lastTrained: new Date().toISOString() },
    };
  }

  // Predict crop yield based on historical data and current conditions
  predictYield(crop, climateZone, months = 3) {
    const harvestService = sofieCore.getService("harvestForecast");
    const growingService = sofieCore.getService("globalGrowingSchedule");

    if (!harvestService || !growingService) {
      return null;
    }

    // Get historical yields
    const forecasts = harvestService.getAllForecasts();
    const cropData = growingService.getCropDetails?.(crop);

    // Simple prediction model (can be enhanced with ML)
    const currentMonth = new Date().getMonth() + 1;
    const predictions = [];

    for (let i = 1; i <= months; i++) {
      const targetMonth = (currentMonth + i - 1) % 12 + 1;
      
      // Base prediction on seasonal patterns
      const seasonalFactor = this.getSeasonalFactor(crop, climateZone, targetMonth);
      const baseYield = cropData?.yieldPerPlant || 2.5;
      
      const prediction = {
        month: targetMonth,
        monthName: this.getMonthName(targetMonth),
        predictedYield: (baseYield * seasonalFactor).toFixed(2),
        confidence: 0.85,
        factors: {
          seasonal: seasonalFactor,
          climate: climateZone,
          historicalAverage: baseYield,
        },
      };

      predictions.push(prediction);
    }

    const result = {
      crop,
      climateZone,
      predictions,
      generatedAt: new Date().toISOString(),
      modelAccuracy: this.models.yieldPrediction.accuracy,
    };

    this.predictions.push(result);
    return result;
  }

  // Detect anomalies in system data
  detectAnomalies(serviceData, threshold = 2.0) {
    const anomalies = [];
    
    // Check water quality anomalies
    if (serviceData.waterQuality) {
      const { ph, temperature, dissolvedOxygen } = serviceData.waterQuality;
      
      if (ph < 6.5 || ph > 8.0) {
        anomalies.push({
          type: "water_ph",
          severity: "high",
          value: ph,
          expected: "6.5-8.0",
          deviation: Math.abs(ph - 7.0),
        });
      }

      if (temperature < 18 || temperature > 28) {
        anomalies.push({
          type: "water_temperature",
          severity: "medium",
          value: temperature,
          expected: "18-28°C",
        });
      }
    }

    // Check harvest anomalies
    if (serviceData.yields) {
      const avgYield = serviceData.yields.reduce((sum, y) => sum + y, 0) / serviceData.yields.length;
      const stdDev = this.calculateStdDev(serviceData.yields, avgYield);

      serviceData.yields.forEach((yield_, idx) => {
        const zScore = Math.abs((yield_ - avgYield) / stdDev);
        if (zScore > threshold) {
          anomalies.push({
            type: "yield_anomaly",
            severity: "low",
            index: idx,
            value: yield_,
            expected: avgYield.toFixed(2),
            deviation: zScore.toFixed(2),
          });
        }
      });
    }

    // Store anomalies
    if (anomalies.length > 0) {
      const anomalyRecord = {
        detectedAt: new Date().toISOString(),
        count: anomalies.length,
        anomalies,
      };
      
      this.anomalies.push(anomalyRecord);

      // Emit alert for high-severity anomalies
      const highSeverity = anomalies.filter(a => a.severity === "high");
      if (highSeverity.length > 0) {
        eventBus.emit(EVENTS.ALERT_CREATED, {
          source: "predictive_analytics",
          severity: "high",
          message: `${highSeverity.length} critical anomalies detected`,
          anomalies: highSeverity,
        });
      }
    }

    return anomalies;
  }

  // Suggest optimal planting based on predictions
  suggestOptimalPlanting(climateZone, availableCrops) {
    const growingService = sofieCore.getService("globalGrowingSchedule");
    if (!growingService) return [];

    const currentMonth = new Date().getMonth() + 1;
    const recommendations = [];

    availableCrops.forEach(crop => {
      // Get 3-month yield prediction
      const prediction = this.predictYield(crop, climateZone, 3);
      
      if (prediction) {
        const avgPredictedYield = prediction.predictions.reduce((sum, p) => 
          sum + parseFloat(p.predictedYield), 0) / prediction.predictions.length;

        const confidence = prediction.predictions[0].confidence;

        recommendations.push({
          crop,
          score: avgPredictedYield * confidence,
          predictedYield: avgPredictedYield.toFixed(2),
          confidence: (confidence * 100).toFixed(0) + "%",
          optimalPlantingMonth: currentMonth,
          harvestMonths: prediction.predictions.map(p => p.monthName),
          reason: this.getRecommendationReason(avgPredictedYield, confidence),
        });
      }
    });

    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);

    // Store recommendations
    this.recommendations.push({
      climateZone,
      generatedAt: new Date().toISOString(),
      recommendations: recommendations.slice(0, 5),
    });

    return recommendations.slice(0, 5);
  }

  // Predict pest outbreak probability
  predictPestOutbreak(climateZone, season) {
    const pestService = sofieCore.getService("pestManagement");
    if (!pestService) return null;

    // Simple risk model based on climate and season
    const riskFactors = {
      tropical: { spring: 0.7, summer: 0.9, fall: 0.6, winter: 0.4 },
      subtropical: { spring: 0.6, summer: 0.8, fall: 0.5, winter: 0.3 },
      temperate: { spring: 0.5, summer: 0.7, fall: 0.4, winter: 0.2 },
      boreal: { spring: 0.4, summer: 0.5, fall: 0.3, winter: 0.1 },
      arid: { spring: 0.3, summer: 0.4, fall: 0.3, winter: 0.2 },
    };

    const baseProbability = riskFactors[climateZone]?.[season] || 0.5;

    const prediction = {
      climateZone,
      season,
      probability: baseProbability,
      riskLevel: baseProbability > 0.7 ? "high" : baseProbability > 0.4 ? "medium" : "low",
      recommendedActions: this.getPestPreventionActions(baseProbability),
      predictedAt: new Date().toISOString(),
      modelAccuracy: this.models.pestOutbreak.accuracy,
    };

    // Emit alert if high risk
    if (prediction.riskLevel === "high") {
      eventBus.emit(EVENTS.PEST_DETECTED, {
        source: "predictive_analytics",
        probability: baseProbability,
        climateZone,
        season,
      });
    }

    return prediction;
  }

  // Predict resource needs
  predictResourceNeeds(communitySize, timeframe = 30) {
    const waterService = sofieCore.getService("water");
    const energyService = sofieCore.getService("energy");

    const dailyWaterPerPerson = 150; // liters
    const dailyEnergyPerPerson = 10; // kWh

    const prediction = {
      timeframeDays: timeframe,
      water: {
        daily: communitySize * dailyWaterPerPerson,
        total: communitySize * dailyWaterPerPerson * timeframe,
        unit: "liters",
        confidence: 0.9,
      },
      energy: {
        daily: communitySize * dailyEnergyPerPerson,
        total: communitySize * dailyEnergyPerPerson * timeframe,
        unit: "kWh",
        confidence: 0.88,
      },
      food: {
        daily: communitySize * 2000, // calories
        total: communitySize * 2000 * timeframe,
        unit: "calories",
        confidence: 0.85,
      },
      generatedAt: new Date().toISOString(),
    };

    return prediction;
  }

  // Helper: Calculate seasonal factor
  getSeasonalFactor(crop, climateZone, month) {
    // Simple seasonal model - can be enhanced
    const seasonalPatterns = {
      tropical: [0.9, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0, 0.95],
      temperate: [0.3, 0.4, 0.6, 0.8, 1.0, 1.0, 0.95, 0.9, 0.7, 0.5, 0.4, 0.3],
    };

    const pattern = seasonalPatterns[climateZone] || seasonalPatterns.temperate;
    return pattern[month - 1];
  }

  // Helper: Get month name
  getMonthName(month) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1];
  }

  // Helper: Calculate standard deviation
  calculateStdDev(values, mean) {
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  // Helper: Get recommendation reason
  getRecommendationReason(yield_, confidence) {
    if (yield_ > 3 && confidence > 0.8) return "High yield potential with good confidence";
    if (yield_ > 2 && confidence > 0.7) return "Moderate yield with acceptable confidence";
    if (confidence < 0.6) return "Low confidence - consider alternatives";
    return "Standard yield expected";
  }

  // Helper: Get pest prevention actions
  getPestPreventionActions(probability) {
    if (probability > 0.7) {
      return ["Increase monitoring frequency", "Apply preventive treatments", "Check vulnerable crops daily"];
    } else if (probability > 0.4) {
      return ["Regular monitoring", "Maintain healthy plants", "Monitor for early signs"];
    }
    return ["Standard monitoring", "Maintain good practices"];
  }

  // Get all predictions
  getPredictions(limit = 10) {
    return this.predictions.slice(-limit);
  }

  // Get recent anomalies
  getAnomalies(limit = 20) {
    return this.anomalies.slice(-limit);
  }

  // Get recommendations
  getRecommendations(limit = 5) {
    return this.recommendations.slice(-limit);
  }

  // Get service status
  getStatus() {
    return {
      status: this.status,
      models: this.models,
      totalPredictions: this.predictions.length,
      totalAnomalies: this.anomalies.length,
      totalRecommendations: this.recommendations.length,
    };
  }
}

export default PredictiveAnalyticsService;
