// src/services/SustainabilityService.js
import sofieCore from "../core/SofieCore";
import foodService from "./FoodService";
import waterService from "./WaterService";
import housingService from "./HousingService";

class SustainabilityService {
  constructor() {
    this.foodService = foodService;
    this.waterService = waterService;
    this.housingService = housingService;
    this.overallScore = 0;
    this.goals = [];
  }

  initialize() {
    sofieCore.getService("logger").log("[SustainabilityService] Sustainability aggregator initialized.");
  }

  calculateOverallScore() {
    const foodScore = this.foodService.getSustainabilityScore() || 0;
    const waterScore = this.waterService.getConservationScore() || 0;
    const habitatScore = this.housingService.getHabitatScore() || 0;

    this.overallScore = Math.round((foodScore + waterScore + habitatScore) / 3);
    sofieCore.updateState("sustainabilityScore", this.overallScore);
    return this.overallScore;
  }

  setGoal(goalData) {
    const goal = {
      id: Date.now(),
      ...goalData,
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    this.goals.push(goal);
    sofieCore.updateState("sustainabilityGoals", this.goals);
    sofieCore.getService("logger").log("[SustainabilityService] Goal set:", goalData.title);
    return goal;
  }

  updateGoalProgress(goalId, progress) {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.progress = Math.min(progress, 100);
      sofieCore.getService("logger").log(`[SustainabilityService] Goal progress updated: ${progress}%`);
    }
  }

  getSystemHealth() {
    return {
      food: {
        score: this.foodService.getSustainabilityScore(),
        data: this.foodService.getFoodData(),
      },
      water: {
        score: this.waterService.getConservationScore(),
        data: this.waterService.getWaterData(),
      },
      housing: {
        score: this.housingService.getHabitatScore(),
        data: this.housingService.getHousingData(),
      },
      overall: this.overallScore,
    };
  }

  getDashboardMetrics() {
    return {
      systemHealth: this.getSystemHealth(),
      goals: this.goals,
      recommendations: this.generateRecommendations(),
    };
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.foodService.getSustainabilityScore() < 50) {
      recommendations.push({
        priority: "high",
        system: "food",
        message: "Increase crop diversity and yields",
      });
    }

    if (this.waterService.getConservationScore() < 50) {
      recommendations.push({
        priority: "high",
        system: "water",
        message: "Implement water conservation practices",
      });
    }

    if (this.housingService.getHabitatScore() < 60) {
      recommendations.push({
        priority: "medium",
        system: "housing",
        message: "Improve thermal efficiency and air quality",
      });
    }

    return recommendations;
  }
}

const sustainabilityService = new SustainabilityService();
export default sustainabilityService;