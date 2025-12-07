// src/services/FoodService.js
import sofieCore from "../core/SofieCore";

class FoodService {
  constructor() {
    this.status = "idle";
    this.foodData = {
      gardens: [],
      crops: [],
      yields: 0, // kg per month
      storage: 0, // kg
      seedBank: [],
      nutritionGoals: {
        calories: 2000,
        proteins: 50,
        vegetables: 5,
      },
    };
    this.history = [];
  }

  initialize() {
    this.status = "initialized";
    sofieCore.getService("logger").log("[FoodService] Food production module initialized.");
  }

  addGarden(gardenData) {
    const garden = {
      id: Date.now(),
      ...gardenData,
      createdAt: new Date().toISOString(),
    };
    this.foodData.gardens.push(garden);
    sofieCore.updateState("foodGardens", this.foodData.gardens);
    sofieCore.getService("logger").log("[FoodService] Garden added:", garden.name);
    return garden;
  }

  addCrop(cropData) {
    const crop = {
      id: Date.now(),
      ...cropData,
      planted: new Date().toISOString(),
    };
    this.foodData.crops.push(crop);
    sofieCore.updateState("foodCrops", this.foodData.crops);
    sofieCore.getService("logger").log("[FoodService] Crop tracked:", crop.name);
    return crop;
  }

  recordYield(cropId, yieldAmount) {
    this.foodData.yields += yieldAmount;
    this.foodData.storage += yieldAmount;
    this.history.push({
      type: "yield",
      cropId,
      amount: yieldAmount,
      timestamp: new Date().toISOString(),
    });
    sofieCore.updateState("foodYields", this.foodData.yields);
    sofieCore.getService("logger").log(`[FoodService] Yield recorded: +${yieldAmount}kg`);
  }

  consumeFood(amount) {
    this.foodData.storage = Math.max(0, this.foodData.storage - amount);
    this.history.push({
      type: "consumption",
      amount,
      timestamp: new Date().toISOString(),
    });
    sofieCore.updateState("foodStorage", this.foodData.storage);
  }

  getSustainabilityScore() {
    const diversityScore = Math.min(this.foodData.crops.length * 10, 100);
    const storageScore = Math.min((this.foodData.storage / 500) * 100, 100);
    return Math.round((diversityScore + storageScore) / 2);
  }

  getFoodData() {
    return this.foodData;
  }

  getHistory() {
    return this.history;
  }
}

const foodService = new FoodService();
export default foodService;