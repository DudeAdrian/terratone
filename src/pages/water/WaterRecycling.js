import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function WaterRecycling() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading recycling data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #46c6ff22, rgba(210, 175, 135, 0.12))',
        border: '1px solid #46c6ff66',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #46c6ff55, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#46c6ff' }}>
          💧 Water Recycling Loop
        </h1>
        <p className="text-gray-300">Aquaponics systems with real-time metrics and efficiency tracking</p>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {systems.map((system) => {
          const todayMetrics = dailyMetrics.find(m => m.systemId === system.id);
          
          return (
            <div
              key={system.id}
              style={{
                ...glassPanel,
                background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
                border: '1px solid #46c6ff55',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#46c6ff' }}>
                  {system.name}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  {system.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Volume</p>
                  <p className="text-lg font-bold text-white">{system.volume.toLocaleString()}L</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Efficiency</p>
                  <p className="text-lg font-bold" style={{ color: '#46c6ff' }}>
                    {Math.round(system.recyclingRate * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Fish Population</p>
                  <p className="text-lg font-bold text-white">
                    {system.components.fishTank.population.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Grow Beds</p>
                  <p className="text-lg font-bold text-white">{system.components.growbeds.count}</p>
                </div>
              </div>

              {todayMetrics && (
                <div className="border-t border-blue-400/20 pt-4 mt-4">
                  <h3 className="text-sm font-bold text-blue-300 mb-3">Today's Performance</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Recycled</p>
                      <p className="text-sm font-bold text-green-400">{todayMetrics.recycled}L</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Fresh Added</p>
                      <p className="text-sm font-bold text-yellow-400">{todayMetrics.freshWaterAdded}L</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Efficiency</p>
                      <p className="text-sm font-bold text-blue-400">{todayMetrics.recyclingPercentage || Math.round(todayMetrics.efficiency * 100)}%</p>
                    </div>
                  </div>
                </div>
              )}

              {todayMetrics?.waterQuality && (
                <div className="border-t border-blue-400/20 pt-4 mt-4">
                  <h3 className="text-sm font-bold text-blue-300 mb-3">Water Quality</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">pH:</span>
                      <span className="text-white font-semibold">{todayMetrics.waterQuality.pH?.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temp:</span>
                      <span className="text-white font-semibold">{todayMetrics.waterQuality.temperature?.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">DO:</span>
                      <span className="text-white font-semibold">{todayMetrics.waterQuality.dissolvedOxygen?.toFixed(1)} mg/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ammonia:</span>
                      <span className="text-white font-semibold">{todayMetrics.waterQuality.ammonia?.toFixed(2)} mg/L</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Stats */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Overall System Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{systems.length}</p>
            <p className="text-sm text-gray-400">Active Systems</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#46c6ff' }}>
              {systems.reduce((sum, s) => sum + s.volume, 0).toLocaleString()}L
            </p>
            <p className="text-sm text-gray-400">Total Volume</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {Math.round((systems.reduce((sum, s) => sum + s.recyclingRate, 0) / systems.length) * 100)}%
            </p>
            <p className="text-sm text-gray-400">Avg Efficiency</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {systems.reduce((sum, s) => sum + s.components.fishTank.population, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Fish</p>
          </div>
        </div>
      </div>
    </div>
  );
}
