import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function FoodProduction() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      console.log("[FoodProduction] Food service:", foodService);
      if (foodService && foodService.getProductionData) {
        const data = foodService.getProductionData();
        console.log("[FoodProduction] Production data:", data);
        setProductionData(data);
      } else {
        console.error("[FoodProduction] Food service or getProductionData not available");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading production data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading production data...</div>
        </GlassCard>
      </div>
    );
  }

  if (!productionData || !productionData.gardens || !Array.isArray(productionData.gardens)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <p>No production data available</p>
            <p className="text-xs mt-2">Debug: {JSON.stringify(productionData)}</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  const totalArea = productionData.gardens.reduce((sum, g) => sum + g.areaSqm, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#ea580c', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">🌱 Production Systems</h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 mt-4 max-w-2xl">Home-scale garden productivity and yield tracking</p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={4} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{productionData.monthlyYield}kg</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Monthly Yield</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">This month</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{productionData.yearlyProjection}kg</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Yearly Estimate</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {(productionData.monthlyYield / productionData.gardens.length).toFixed(1)}kg
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Per Garden Avg</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {(productionData.monthlyYield / totalArea).toFixed(1)}kg/m²
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Yield Density</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Production Areas */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">Production Areas</h2>
            <GlassGrid cols={2} colsMd={1} gap={6}>
              {productionData.gardens.map((garden) => (
                <GlassCard key={garden.gardenId} colors={{ primary: "amber", secondary: "orange" }}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{garden.gardenId}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        garden.status === 'productive' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400'
                      }`}>
                        {garden.status}
                      </span>
                    </div>

                    {/* Location & Type */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Location</span>
                        <span className="font-bold text-gray-900 dark:text-white">{garden.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Type</span>
                        <span className="font-bold text-gray-900 dark:text-white capitalize">{garden.type}</span>
                      </div>
                    </div>

                    {/* Area & Productivity */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Growing Area</span>
                        <span className="font-bold text-gray-900 dark:text-white">{garden.areaSqm} m²</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Productivity</span>
                        <span className="font-bold text-gray-900 dark:text-white">{garden.productivity}%</span>
                      </div>
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{
                            width: `${garden.productivity}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Crops */}
                    <div className="mb-4">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Crops Growing</p>
                      <div className="flex flex-wrap gap-2">
                        {garden.crops.map((crop) => (
                          <span
                            key={crop}
                            className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-amber-200 dark:border-amber-400/20 pt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Water Today:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{garden.waterUse}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Harvest:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{new Date(garden.lastHarvest).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Next Harvest:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{new Date(garden.nextHarvest).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Production Summary */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">
              Production Overview
            </h2>
            <GlassGrid cols={4} colsMd={2} gap={4}>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {productionData.monthlyYield}kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Monthly Average</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {productionData.yearlyProjection}kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Yearly Estimate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {(productionData.monthlyYield / productionData.gardens.length).toFixed(1)}kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Per Garden Avg</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {(productionData.monthlyYield / totalArea).toFixed(1)}kg/m²
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Yield Density</p>
              </div>
            </GlassGrid>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
