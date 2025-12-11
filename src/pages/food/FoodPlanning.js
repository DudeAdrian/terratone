import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function FoodPlanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [supplyPlanning, setSupplyPlanning] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      if (foodService && foodService.getSupplyPlanning) {
        const data = foodService.getSupplyPlanning();
        setSupplyPlanning(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading supply planning data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading planning data...</div>
        </GlassCard>
      </div>
    );
  }

  if (!supplyPlanning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No planning data available</div>
        </GlassCard>
      </div>
    );
  }

  const totalPlannedYield = (supplyPlanning?.upcomingHarvests || []).reduce(
    (sum, harvest) => sum + (harvest.plannedYield || 0),
    0
  );

  const getHarvestColor = (daysUntil) => {
    if (daysUntil <= 7) return "#ef4444";
    if (daysUntil <= 14) return "#f59e0b";
    if (daysUntil <= 21) return "#f5a873";
    return "#4ade80";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#ea580c', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">📅 Supply Planning</h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 mt-4 max-w-2xl">Upcoming harvests and seasonal supply projections</p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={4} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{totalPlannedYield}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Planned Yield (kg)</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {supplyPlanning.upcomingHarvests.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Upcoming Harvests</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {supplyPlanning.storageCapacityUsed}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Storage Used</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {supplyPlanning.projectedCapacityAfterHarvest}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">After Harvest</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Upcoming Harvests */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">Upcoming Harvests</h2>
            <GlassGrid cols={2} colsMd={1} gap={6}>
              {supplyPlanning.upcomingHarvests.map((harvest) => (
                <GlassCard key={harvest.cropId} colors={{ primary: "amber", secondary: "orange" }}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{harvest.cropName}</h3>
                      <span className="text-2xl">{harvest.emoji}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Days Until Harvest</span>
                          <span className="font-bold" style={{ color: getHarvestColor(harvest.daysUntilReady) }}>
                            {harvest.daysUntilReady} days
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-bold text-gray-900 dark:text-white">{harvest.maturityPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${harvest.maturityPercentage}%`,
                              backgroundColor: '#f5a873'
                            }}
                          />
                        </div>
                      </div>

                      <div className="border-t border-amber-200 dark:border-amber-400/20 pt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Est. Yield:</strong> {harvest.estimatedYield} kg
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Location:</strong> {harvest.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Storage Projections */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">
              Storage Projections
            </h2>
            <GlassGrid cols={2} colsMd={1} gap={4}>
              <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Current Capacity Used</p>
                  <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                    {supplyPlanning.storageCapacityUsed}%
                  </p>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mt-4">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${supplyPlanning.storageCapacityUsed}%`,
                        backgroundColor: '#f5a873'
                      }}
                    />
                  </div>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Projected After Harvest</p>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {supplyPlanning.projectedCapacityAfterHarvest}%
                  </p>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mt-4">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${supplyPlanning.projectedCapacityAfterHarvest}%`,
                        backgroundColor: '#4ade80'
                      }}
                    />
                  </div>
                </div>
              </GlassCard>
            </GlassGrid>

            {/* Distribution Analysis */}
            <GlassSection colors={{ primary: "amber", secondary: "orange" }} className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-amber-600 dark:text-amber-400">
                  Projected Distribution
                </h3>
                <div className="space-y-3">
                  {supplyPlanning.storageDistribution.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{item.location}</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${item.percentageOfTotal}%`,
                              backgroundColor: '#f5a873'
                            }}
                          />
                        </div>
                        <span className="font-bold text-sm text-gray-900 dark:text-white min-w-fit">
                          {item.projectedKg}kg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassSection>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
