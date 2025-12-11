import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function WaterRecycling() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [systems, setSystems] = useState([]);
  const [dailyMetrics, setDailyMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const recyclingService = sofieCore.getService("waterRecycling");
      if (recyclingService) {
        recyclingService.initialize();
        setSystems(recyclingService.systems || []);
        setDailyMetrics(recyclingService.dailyMetrics || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading water recycling data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading recycling data...</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#06b6d4'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              💧 Water Recycling Loop
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Aquaponics systems with real-time metrics and efficiency tracking
            </p>
          </div>
        </GlassSection>

        {/* Systems Grid */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Active Recycling Systems
            </h2>
            <GlassGrid cols={1} colsMd={2} gap={6}>
              {systems.map((system) => {
                const todayMetrics = dailyMetrics.find(m => m.systemId === system.id);
                
                return (
                  <GlassCard key={system.id}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                        {system.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-400/40">
                        {system.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{system.volume.toLocaleString()}L</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Efficiency</p>
                        <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                          {Math.round(system.recyclingRate * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fish Population</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {system.components.fishTank.population.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Grow Beds</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{system.components.growbeds.count}</p>
                      </div>
                    </div>

                    {todayMetrics && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">Today's Performance</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-emerald-500/10 dark:bg-emerald-900/20 rounded-lg p-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Recycled</p>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{todayMetrics.recycled}L</p>
                          </div>
                          <div className="bg-amber-500/10 dark:bg-amber-900/20 rounded-lg p-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Fresh Added</p>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{todayMetrics.freshWaterAdded}L</p>
                          </div>
                          <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Efficiency</p>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{todayMetrics.recyclingPercentage || Math.round(todayMetrics.efficiency * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {todayMetrics?.waterQuality && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">Water Quality</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">pH:</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{todayMetrics.waterQuality.pH?.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Temp:</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{todayMetrics.waterQuality.temperature?.toFixed(1)}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">DO:</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{todayMetrics.waterQuality.dissolvedOxygen?.toFixed(1)} mg/L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Ammonia:</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{todayMetrics.waterQuality.ammonia?.toFixed(2)} mg/L</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Overall Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-gray-900 dark:text-white">{systems.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Active Systems</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">
                {systems.reduce((sum, s) => sum + s.volume, 0).toLocaleString()}L
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Total Volume</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((systems.reduce((sum, s) => sum + s.recyclingRate, 0) / systems.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Avg Efficiency</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-gray-900 dark:text-white">
                {systems.reduce((sum, s) => sum + s.components.fishTank.population, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Total Fish</p>
            </div>
          </GlassCard>
        </GlassGrid>

      </div>
    </div>
  );
}
