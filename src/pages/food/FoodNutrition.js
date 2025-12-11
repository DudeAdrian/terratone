import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function FoodNutrition() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [nutritionMetrics, setNutritionMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      if (foodService && foodService.getNutritionMetrics) {
        const data = foodService.getNutritionMetrics();
        setNutritionMetrics(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading nutrition data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading nutrition data...</div>
        </GlassCard>
      </div>
    );
  }

  const getNutritionColor = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 95) return "#4ade80";
    if (percentage >= 80) return "#22d3ee";
    if (percentage >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const avgNutritionValue = Math.round(nutritionMetrics.reduce((sum, m) => sum + m.nutritionValue, 0) / nutritionMetrics.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#ea580c', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">🥗 Nutrition Metrics</h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 mt-4 max-w-2xl">Daily nutrition intake and home production balance</p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={3} colsMd={1} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Nutrition Score</p>
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{avgNutritionValue}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Across all categories</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Healthy Days This Week</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{Math.ceil(nutritionMetrics.length * 0.85)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">85%+ nutrition met</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Deficit Areas</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {nutritionMetrics.filter(m => (m.daily / m.target) < 0.8).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Needs attention</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Nutrition by Category */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">Nutrition by Category</h2>
            <div className="space-y-6">
              {nutritionMetrics.map((metric) => (
                <div key={metric.category}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{metric.category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.daily}g / {metric.target}g
                        <span className="ml-2 font-semibold" style={{ color: getNutritionColor(metric.daily, metric.target) }}>
                          ({Math.round((metric.daily / metric.target) * 100)}%)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min((metric.daily / metric.target) * 100, 100)}%`,
                        backgroundColor: getNutritionColor(metric.daily, metric.target)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassSection>

        {/* Nutrition Summary */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">
              Nutrition Balance
            </h2>
            <div className="space-y-4">
              {nutritionMetrics.map((metric) => (
                <GlassCard key={metric.category} colors={{ primary: "amber", secondary: "orange" }}>
                  <div className="p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{metric.category}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {metric.daily}g / {metric.target}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((metric.daily / metric.target) * 100, 100)}%`,
                          backgroundColor: getNutritionColor(metric.daily, metric.target)
                        }}
                      />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};
