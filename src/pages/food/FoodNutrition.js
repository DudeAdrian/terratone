import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function FoodNutrition() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading nutrition data...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #f5a87322, rgba(210, 175, 135, 0.12))',
        border: '1px solid #f5a87366',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #f5a87355, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f5a873' }}>
          🥗 Nutrition Tracking
        </h1>
        <p className="text-gray-300">Daily nutrition intake and home production balance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f5a87355',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Avg Nutrition Score</p>
          <p className="text-4xl font-bold" style={{ color: '#f5a873' }}>{avgNutritionValue}%</p>
          <p className="text-xs text-gray-500 mt-2">Across all categories</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Home Production</p>
          <p className="text-4xl font-bold text-white">{nutritionMetrics.length}</p>
          <p className="text-xs text-gray-500 mt-2">Tracked categories</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Top Sources</p>
          <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
            {nutritionMetrics.reduce((sum, m) => sum + m.topSources.length, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Different crops</p>
        </div>
      </div>

      {/* Nutrition Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nutritionMetrics.map((metric) => (
          <div
            key={metric.category}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
              border: '1px solid #f5a87355',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#f5a873' }}>{metric.category}</h2>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${getNutritionColor(metric.daily, metric.target)}20`,
                  color: getNutritionColor(metric.daily, metric.target),
                  border: `1px solid ${getNutritionColor(metric.daily, metric.target)}40`
                }}
              >
                {metric.nutritionValue}%
              </span>
            </div>

            {/* Daily vs Target */}
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-400">Today's Intake</p>
                  <p className="text-3xl font-bold text-white">{metric.daily}g</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Target</p>
                  <p className="text-2xl font-bold" style={{ color: '#f5a873' }}>{metric.target}g</p>
                </div>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((metric.daily / metric.target) * 100, 100)}%`,
                    backgroundColor: getNutritionColor(metric.daily, metric.target)
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {((metric.daily / metric.target) * 100).toFixed(0)}% of daily goal
              </p>
            </div>

            {/* Weekly Average */}
            <div className="mb-4 bg-orange-500/10 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Weekly Average</span>
                <span className="text-white font-bold">{(metric.weeklyAvg / 7).toFixed(0)}g/day</span>
              </div>
            </div>

            {/* Top Sources */}
            <div className="border-t border-orange-400/20 pt-4">
              <p className="text-sm font-bold text-gray-300 mb-2">Top Sources</p>
              <div className="flex flex-wrap gap-2">
                {metric.topSources.map((source) => (
                  <span
                    key={source}
                    className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/20"
                    style={{
                      color: '#f5a873',
                      border: '1px solid #f5a87340'
                    }}
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nutrition Summary */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Nutrition Balance
        </h2>
        <div className="space-y-3">
          {nutritionMetrics.map((metric) => (
            <div key={metric.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{metric.category}</span>
                <span className="text-white font-semibold">
                  {metric.daily}g / {metric.target}g
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
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
    </div>
  );
}
