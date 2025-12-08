// src/pages/NutritionOptimization.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const NutritionOptimization = () => {
  const [foodService, setFoodService] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [nutritionGoals, setNutritionGoals] = useState({
    dailyCalories: 2000,
    dailyProtein: 50, // grams
    dailyFat: 65, // grams
    dailyFiber: 25, // grams
    omega3Target: 1.6, // grams
    mineralsDiversity: 85, // %
  });
  const [currentProduction, setCurrentProduction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [projectedNutrition, setProjectedNutrition] = useState(null);
  const [nutritionGap, setNutritionGap] = useState(null);
  const [seasonalVariation, setSeasonalVariation] = useState({});

  useEffect(() => {
    sofieCore.init();
    const service = sofieCore.getService("food");
    
    if (service) {
      setFoodService(service);
      updateNutritionData(service);
      loadAvailableCrops(service);
    }
  }, []);

  const loadAvailableCrops = (service) => {
    // Get available crops from growing schedule or food service
    const growingService = sofieCore.getService("globalGrowingSchedule");
    if (growingService && growingService.getAllCrops) {
      const allCrops = growingService.getAllCrops();
      setCrops(Object.entries(allCrops).map(([key, crop]) => ({
        id: key,
        name: crop.name || key,
        nutrientProfile: crop.nutrition || {},
        caloriesPerServing: crop.caloriesPerServing || 0,
        currentProduction: crop.seasonalProduction?.temperate?.[new Date().getMonth()] || 0,
      })));
    }
  };

  const updateNutritionData = (service) => {
    if (!service) return;

    // Calculate current production nutrition
    if (service.getNutritionProfile) {
      const current = service.getNutritionProfile();
      setCurrentProduction(current);
      calculateNutritionGap(current);
      calculateSeasonalVariation();
    }
  };

  const calculateNutritionGap = (current) => {
    if (!current) return;

    const gap = {
      calories: { current: current.calories || 0, target: nutritionGoals.dailyCalories, gap: (nutritionGoals.dailyCalories - (current.calories || 0)) },
      protein: { current: current.protein || 0, target: nutritionGoals.dailyProtein, gap: (nutritionGoals.dailyProtein - (current.protein || 0)) },
      fat: { current: current.fat || 0, target: nutritionGoals.dailyFat, gap: (nutritionGoals.dailyFat - (current.fat || 0)) },
      fiber: { current: current.fiber || 0, target: nutritionGoals.dailyFiber, gap: (nutritionGoals.dailyFiber - (current.fiber || 0)) },
      omega3: { current: current.omega3 || 0, target: nutritionGoals.omega3Target, gap: (nutritionGoals.omega3Target - (current.omega3 || 0)) },
    };

    setNutritionGap(gap);
  };

  const calculateSeasonalVariation = () => {
    const variation = {
      spring: { availability: 45, diversity: 5, calories: 1200 },
      summer: { availability: 90, diversity: 12, calories: 2200 },
      fall: { availability: 75, diversity: 10, calories: 1900 },
      winter: { availability: 30, diversity: 3, calories: 800 },
    };
    setSeasonalVariation(variation);
  };

  const handleGoalChange = (field, value) => {
    setNutritionGoals({
      ...nutritionGoals,
      [field]: parseFloat(value) || 0,
    });
  };

  const handleCalculateOptimization = () => {
    if (!foodService) return;

    // Calculate optimal crop mix based on goals
    const selectedCropsList = crops.filter(c => selectedCrops.includes(c.id));
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalOmega3 = 0;

    selectedCropsList.forEach(crop => {
      const nutrition = crop.nutrientProfile;
      totalCalories += (nutrition.calories || 0) * crop.currentProduction;
      totalProtein += (nutrition.protein || 0) * crop.currentProduction;
      totalFat += (nutrition.fat || 0) * crop.currentProduction;
      totalFiber += (nutrition.fiber || 0) * crop.currentProduction;
      totalOmega3 += (nutrition.omega3 || 0) * crop.currentProduction;
    });

    const projected = {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      omega3: Math.round(totalOmega3 * 10) / 10,
      selectedCropCount: selectedCropsList.length,
    };

    setProjectedNutrition(projected);
  };

  const generateRecommendations = () => {
    const recs = [];

    if (nutritionGap?.protein.gap > 10) {
      recs.push({
        priority: "high",
        category: "Protein",
        recommendation: "Increase legume-based crops (beans, lentils) or fish protein from aquaponics",
        impact: `+${Math.round(nutritionGap.protein.gap * 10) / 10}g daily protein needed`,
      });
    }

    if (nutritionGap?.omega3.gap > 0.5) {
      recs.push({
        priority: "high",
        category: "Omega-3",
        recommendation: "Increase omega-3 rich crops (flax seeds, walnuts) or consume more fish",
        impact: `+${Math.round(nutritionGap.omega3.gap * 100) / 100}g daily omega-3 needed`,
      });
    }

    if (nutritionGap?.fiber.gap > 5) {
      recs.push({
        priority: "medium",
        category: "Fiber",
        recommendation: "Expand whole grain and vegetable production (dark leafy greens, root vegetables)",
        impact: `+${Math.round(nutritionGap.fiber.gap)}g daily fiber needed`,
      });
    }

    if (nutritionGoals.mineralsDiversity < 80) {
      recs.push({
        priority: "medium",
        category: "Mineral Diversity",
        recommendation: "Cultivate diverse crops to ensure iron, calcium, magnesium, and zinc",
        impact: `Increase crop diversity to ${Math.round(nutritionGoals.mineralsDiversity + 15)}%`,
      });
    }

    if (nutritionGap?.calories.gap > 200) {
      recs.push({
        priority: "medium",
        category: "Caloric Intake",
        recommendation: "Increase production volume across all crops or focus on calorie-dense options",
        impact: `+${Math.round(nutritionGap.calories.gap)} calories daily`,
      });
    }

    setRecommendations(recs);
  };

  useEffect(() => {
    generateRecommendations();
  }, [nutritionGap]);

  if (!foodService) {
    return <div className="text-center py-12"><p className="text-gray-500">Loading nutrition service...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🥗 Nutrition Optimization Dashboard</h1>
        <p className="text-orange-100">
          Plan and optimize your community's nutrition with personalized crop recommendations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b overflow-x-auto">
          {["current", "goals", "recommendations", "seasonal", "crops"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-orange-600 text-white border-b-2 border-orange-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab === "current" && "📊"}
              {tab === "goals" && "🎯"}
              {tab === "recommendations" && "💡"}
              {tab === "seasonal" && "🍂"}
              {tab === "crops" && "🌾"}
              {" " + tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Current Production Tab */}
          {activeTab === "current" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Current Daily Nutrition</h3>
                {currentProduction ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600"><strong>Calories</strong></p>
                      <p className="text-3xl font-bold text-blue-700">{Math.round(currentProduction.calories || 1200)}</p>
                      <p className="text-xs text-gray-500 mt-1">kcal per day</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600"><strong>Protein</strong></p>
                      <p className="text-3xl font-bold text-red-700">{Math.round((currentProduction.protein || 45) * 10) / 10}</p>
                      <p className="text-xs text-gray-500 mt-1">grams per day</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600"><strong>Fiber</strong></p>
                      <p className="text-3xl font-bold text-green-700">{Math.round((currentProduction.fiber || 20) * 10) / 10}</p>
                      <p className="text-xs text-gray-500 mt-1">grams per day</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600"><strong>Omega-3</strong></p>
                      <p className="text-3xl font-bold text-purple-700">{Math.round((currentProduction.omega3 || 1.0) * 100) / 100}</p>
                      <p className="text-xs text-gray-500 mt-1">grams per day</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading current production data...</p>
                )}
              </div>

              {nutritionGap && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Nutrition Gap Analysis</h3>
                  <div className="space-y-3">
                    {Object.entries(nutritionGap).map(([nutrient, data]) => (
                      <div key={nutrient} className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 capitalize">{nutrient}</p>
                          <div className="bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                data.gap <= 0 ? "bg-green-600" : "bg-orange-600"
                              }`}
                              style={{ width: `${Math.min(100, (data.current / data.target) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right w-32">
                          <p className="text-sm text-gray-600">{Math.round(data.current * 10) / 10} / {data.target}</p>
                          <p className={`text-xs font-semibold ${data.gap > 0 ? "text-orange-600" : "text-green-600"}`}>
                            {data.gap > 0 ? `+${Math.round(data.gap * 10) / 10}` : `−${Math.round(Math.abs(data.gap) * 10) / 10}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Nutrition Goals</h3>
                <p className="text-gray-600 mb-4">Set your daily nutrition targets and the system will recommend crops to meet them.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Calories (kcal)</label>
                  <input
                    type="number"
                    value={nutritionGoals.dailyCalories}
                    onChange={(e) => handleGoalChange("dailyCalories", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 2000-2500 kcal</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Protein (g)</label>
                  <input
                    type="number"
                    value={nutritionGoals.dailyProtein}
                    onChange={(e) => handleGoalChange("dailyProtein", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 50-60g per day</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Fat (g)</label>
                  <input
                    type="number"
                    value={nutritionGoals.dailyFat}
                    onChange={(e) => handleGoalChange("dailyFat", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 50-70g per day</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Fiber (g)</label>
                  <input
                    type="number"
                    value={nutritionGoals.dailyFiber}
                    onChange={(e) => handleGoalChange("dailyFiber", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 25-30g per day</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Omega-3 Target (g)</label>
                  <input
                    type="number"
                    value={nutritionGoals.omega3Target}
                    onChange={(e) => handleGoalChange("omega3Target", e.target.value)}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 1.6-2.0g per day</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mineral Diversity (%)</label>
                  <input
                    type="number"
                    value={nutritionGoals.mineralsDiversity}
                    onChange={(e) => handleGoalChange("mineralsDiversity", e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Goal: 85-100% diversity</p>
                </div>
              </div>

              <button
                onClick={generateRecommendations}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition"
              >
                💡 Generate Recommendations
              </button>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Nutrition Recommendations</h3>
              {recommendations.length > 0 ? (
                recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 ${
                      rec.priority === "high"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-bold ${rec.priority === "high" ? "text-red-900" : "text-yellow-900"}`}>
                        {rec.category}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rec.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className={`text-sm ${rec.priority === "high" ? "text-red-800" : "text-yellow-800"}`}>
                      {rec.recommendation}
                    </p>
                    <p className={`text-xs mt-2 font-semibold ${rec.priority === "high" ? "text-red-700" : "text-yellow-700"}`}>
                      {rec.impact}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Set your goals and click "Generate Recommendations" to see crop suggestions.</p>
              )}
            </div>
          )}

          {/* Seasonal Variation Tab */}
          {activeTab === "seasonal" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Seasonal Nutrition Variation</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(seasonalVariation).map(([season, data]) => (
                  <div key={season} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 capitalize mb-3">{season}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Crop Availability</p>
                        <div className="bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${data.availability}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{data.availability}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Crop Diversity</p>
                        <p className="text-lg font-bold text-gray-800">{data.diversity} varieties</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Daily Calories</p>
                        <p className="text-lg font-bold text-orange-600">{data.calories} kcal</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crops Tab */}
          {activeTab === "crops" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Select Crops for Analysis</h3>
                <p className="text-gray-600 mb-4">Choose crops to calculate projected nutrition intake</p>
              </div>

              <div className="space-y-2 mb-6">
                {crops.length > 0 ? (
                  crops.map(crop => (
                    <label key={crop.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCrops.includes(crop.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCrops([...selectedCrops, crop.id]);
                          } else {
                            setSelectedCrops(selectedCrops.filter(c => c !== crop.id));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{crop.name}</p>
                        <p className="text-xs text-gray-600">Current production: {crop.currentProduction} units</p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500">No crops available</p>
                )}
              </div>

              <button
                onClick={handleCalculateOptimization}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition"
              >
                📊 Calculate Projected Nutrition
              </button>

              {projectedNutrition && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-3">Projected Daily Nutrition</h4>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Calories</p>
                      <p className="text-2xl font-bold text-green-700">{projectedNutrition.calories}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Protein (g)</p>
                      <p className="text-2xl font-bold text-green-700">{projectedNutrition.protein}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Crops Selected</p>
                      <p className="text-2xl font-bold text-green-700">{projectedNutrition.selectedCropCount}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionOptimization;
