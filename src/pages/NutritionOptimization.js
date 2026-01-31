// src/pages/NutritionOptimization.js - Glassmorphic Food Domain (Orange/Amber)

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassButton, GlassSection, GlassContainer, GlassGrid } from "../theme/GlassmorphismTheme";
import { useFoodData } from "../hooks/useApi";

const NutritionOptimization = () => {
  const { data: apiFoodData, loading, error, refetch } = useFoodData("default");
  const [foodService, setFoodService] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [nutritionGoals, setNutritionGoals] = useState({
    dailyCalories: 2000,
    dailyProtein: 50,
    dailyFat: 65,
    dailyFiber: 25,
    omega3Target: 1.6,
    mineralsDiversity: 85,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full mr-3"></div>
            Loading nutrition data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Nutrition Data</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-orange-700 to-amber-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const updateNutritionData = (service) => {
    if (!service) return;
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading nutrition service...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "orange", secondary: "amber" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              🥗 Nutrition Optimization
            </h1>
            <p className="text-lg text-orange-700 dark:text-orange-200 max-w-2xl">
              Plan and optimize your community's nutrition with personalized crop recommendations
            </p>
          </div>
        </GlassSection>

        {/* Tabs */}
        <GlassSection colors={{ primary: "orange", secondary: "amber" }}>
          <div>
            <div className="flex flex-wrap border-b border-orange-300/30 dark:border-orange-700/30 backdrop-blur-sm overflow-x-auto">
              {["current", "goals", "recommendations", "seasonal", "crops"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-gradient-to-b from-orange-400/40 to-orange-300/20 dark:from-orange-600/50 dark:to-orange-700/30 text-orange-700 dark:text-orange-300 border-b-2 border-orange-600 dark:border-orange-400"
                      : "text-gray-700 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-300 hover:bg-orange-200/10 dark:hover:bg-orange-700/10"
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

            <div className="p-8">
              {/* Current Production Tab */}
              {activeTab === "current" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Current Daily Nutrition</h3>
                    {currentProduction ? (
                      <GlassGrid cols={2} colsMd={4} gap={5}>
                        <GlassCard colors={{ primary: "blue", secondary: "blue" }}>
                          <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Calories</p>
                            <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{Math.round(currentProduction.calories || 1200)}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">kcal per day</p>
                          </div>
                        </GlassCard>
                        <GlassCard colors={{ primary: "red", secondary: "red" }}>
                          <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Protein</p>
                            <p className="text-5xl font-bold text-red-600 dark:text-red-400">{Math.round((currentProduction.protein || 45) * 10) / 10}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">grams per day</p>
                          </div>
                        </GlassCard>
                        <GlassCard colors={{ primary: "green", secondary: "green" }}>
                          <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Fiber</p>
                            <p className="text-5xl font-bold text-green-600 dark:text-green-400">{Math.round((currentProduction.fiber || 20) * 10) / 10}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">grams per day</p>
                          </div>
                        </GlassCard>
                        <GlassCard colors={{ primary: "purple", secondary: "purple" }}>
                          <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Omega-3</p>
                            <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">{Math.round((currentProduction.omega3 || 1.0) * 100) / 100}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">grams per day</p>
                          </div>
                        </GlassCard>
                      </GlassGrid>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-lg">Loading current production data...</p>
                    )}
                  </div>

                  {nutritionGap && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Nutrition Gap Analysis</h3>
                      <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                        <div className="p-8">
                          <div className="space-y-6">
                            {Object.entries(nutritionGap).map(([nutrient, data]) => (
                              <div key={nutrient}>
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-semibold text-gray-800 dark:text-white capitalize text-lg">{nutrient}</p>
                                  <p className={`text-sm font-bold ${data.gap > 0 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}>
                                    {data.gap > 0 ? `+${Math.round(data.gap * 10) / 10}` : `−${Math.round(Math.abs(data.gap) * 10) / 10}`}
                                  </p>
                                </div>
                                <div className="bg-white/30 dark:bg-gray-800/30 rounded-full h-4 overflow-hidden mb-2 backdrop-blur-sm border border-orange-200/50 dark:border-orange-700/50">
                                  <div
                                    className={`h-4 rounded-full transition-all duration-300 ${
                                      data.gap <= 0 
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" 
                                        : "bg-gradient-to-r from-orange-400 to-amber-500 dark:from-orange-500 dark:to-amber-600"
                                    }`}
                                    style={{ width: `${Math.min(100, (data.current / data.target) * 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{Math.round(data.current * 10) / 10} / {data.target}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  )}
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === "goals" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Nutrition Goals</h3>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-6">Set your daily nutrition targets and the system will recommend crops to meet them.</p>
                  </div>

                  <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                    <div className="p-8">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3">Daily Calories (kcal)</label>
                          <input
                            type="number"
                            value={nutritionGoals.dailyCalories}
                            onChange={(e) => handleGoalChange("dailyCalories", e.target.value)}
                            className="w-full px-4 py-3 border border-orange-300/40 dark:border-orange-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 backdrop-blur-sm transition"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Typical: 2000-2500 kcal</p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3">Daily Protein (g)</label>
                          <input
                            type="number"
                            value={nutritionGoals.dailyProtein}
                            onChange={(e) => handleGoalChange("dailyProtein", e.target.value)}
                            className="w-full px-4 py-3 border border-orange-300/40 dark:border-orange-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 backdrop-blur-sm transition"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Typical: 50-60g per day</p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3">Daily Fat (g)</label>
                          <input
                            type="number"
                            value={nutritionGoals.dailyFat}
                            onChange={(e) => handleGoalChange("dailyFat", e.target.value)}
                            className="w-full px-4 py-3 border border-orange-300/40 dark:border-orange-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 backdrop-blur-sm transition"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Typical: 50-70g per day</p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3">Daily Fiber (g)</label>
                          <input
                            type="number"
                            value={nutritionGoals.dailyFiber}
                            onChange={(e) => handleGoalChange("dailyFiber", e.target.value)}
                            className="w-full px-4 py-3 border border-orange-300/40 dark:border-orange-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 backdrop-blur-sm transition"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Typical: 25-30g per day</p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3">Omega-3 Target (g)</label>
                          <input
                            type="number"
                            value={nutritionGoals.omega3Target}
                            onChange={(e) => handleGoalChange("omega3Target", e.target.value)}
                            step="0.1"
                            className="w-full px-4 py-3 border border-orange-300/40 dark:border-orange-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 backdrop-blur-sm transition"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Typical: 1.6-2.0g per day</p>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3">Mineral Diversity (%)</label>
                          <input
                            type="number"
                            value={nutritionGoals.mineralsDiversity}
                            onChange={(e) => handleGoalChange("mineralsDiversity", e.target.value)}
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 border border-orange-300/40 dark:border-orange-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 backdrop-blur-sm transition"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Goal: 85-100% diversity</p>
                        </div>
                      </div>

                      <button
                        onClick={generateRecommendations}
                        className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        💡 Generate Recommendations
                      </button>
                    </div>
                  </GlassCard>
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === "recommendations" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Nutrition Recommendations</h3>
                  {recommendations.length > 0 ? (
                    <div className="grid gap-6">
                      {recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg p-6 backdrop-blur-sm border ${
                            rec.priority === "high"
                              ? "bg-red-400/20 dark:bg-red-700/30 border-red-400/50 dark:border-red-600/50"
                              : "bg-yellow-400/20 dark:bg-yellow-700/30 border-yellow-400/50 dark:border-yellow-600/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className={`font-bold text-xl ${rec.priority === "high" ? "text-red-800 dark:text-red-300" : "text-yellow-800 dark:text-yellow-300"}`}>
                              {rec.category}
                            </h4>
                            <span
                              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize ${
                                rec.priority === "high"
                                  ? "bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-200"
                                  : "bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {rec.priority} Priority
                            </span>
                          </div>
                          <p className={`text-base mb-3 ${rec.priority === "high" ? "text-red-800 dark:text-red-300" : "text-yellow-800 dark:text-yellow-300"}`}>
                            {rec.recommendation}
                          </p>
                          <p className={`text-sm font-semibold ${rec.priority === "high" ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"}`}>
                            {rec.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                      <div className="p-8 text-center">
                        <p className="text-gray-700 dark:text-gray-300 text-lg">Set your goals and click "Generate Recommendations" to see crop suggestions.</p>
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}

              {/* Seasonal Variation Tab */}
              {activeTab === "seasonal" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Seasonal Nutrition Variation</h3>
                  <GlassGrid cols={2} colsMd={2} gap={6}>
                    {Object.entries(seasonalVariation).map(([season, data]) => (
                      <GlassCard key={season} colors={{ primary: "orange", secondary: "amber" }}>
                        <div className="p-8">
                          <h4 className="font-bold text-2xl text-gray-800 dark:text-white capitalize mb-6">{season}</h4>
                          <div className="space-y-5">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-gray-700 dark:text-gray-300">Crop Availability</p>
                                <span className="text-lg font-bold text-orange-700 dark:text-orange-400">{data.availability}%</span>
                              </div>
                              <div className="bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 h-4 rounded-full"
                                  style={{ width: `${data.availability}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Crop Diversity</p>
                              <p className="text-4xl font-bold text-orange-700 dark:text-orange-400">{data.diversity} <span className="text-lg">varieties</span></p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Daily Calories</p>
                              <p className="text-4xl font-bold text-amber-700 dark:text-amber-400">{data.calories} <span className="text-lg">kcal</span></p>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </GlassGrid>
                </div>
              )}

              {/* Crops Tab */}
              {activeTab === "crops" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select Crops for Analysis</h3>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-6">Choose crops to calculate projected nutrition intake</p>
                  </div>

                  <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                    <div className="p-8">
                      <div className="space-y-3 mb-8">
                        {crops.length > 0 ? (
                          crops.map(crop => (
                            <label key={crop.id} className="flex items-center gap-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-400/70 dark:hover:border-orange-600/70 cursor-pointer transition backdrop-blur-sm">
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
                                className="w-5 h-5 rounded cursor-pointer"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 dark:text-white text-lg">{crop.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Current production: {crop.currentProduction} units</p>
                              </div>
                            </label>
                          ))
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 text-lg">No crops available</p>
                        )}
                      </div>

                      <button
                        onClick={handleCalculateOptimization}
                        className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        📊 Calculate Projected Nutrition
                      </button>
                    </div>
                  </GlassCard>

                  {projectedNutrition && (
                    <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
                      <div className="p-8">
                        <h4 className="font-bold text-2xl text-gray-800 dark:text-white mb-6">Projected Daily Nutrition</h4>
                        <GlassGrid cols={2} colsMd={3} gap={4}>
                          <div className="text-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Calories</p>
                            <p className="text-4xl font-bold text-green-700 dark:text-green-400">{projectedNutrition.calories}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Protein (g)</p>
                            <p className="text-4xl font-bold text-green-700 dark:text-green-400">{projectedNutrition.protein}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Crops Selected</p>
                            <p className="text-4xl font-bold text-green-700 dark:text-green-400">{projectedNutrition.selectedCropCount}</p>
                          </div>
                        </GlassGrid>
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

export default NutritionOptimization;
