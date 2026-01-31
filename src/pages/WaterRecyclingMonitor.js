// src/pages/WaterRecyclingMonitor.js - Glassmorphic Water Domain

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassButton, GlassSection, GlassContainer, GlassGrid } from "../theme/GlassmorphismTheme";
import { createBackHandler } from "../utils/navigation";

const WaterRecyclingMonitor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [waterService, setWaterService] = useState(null);
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [todayMetrics, setTodayMetrics] = useState(null);
  const [annualStats, setAnnualStats] = useState(null);
  const [qualityTrends, setQualityTrends] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const service = sofieCore.getService("waterRecycling");
    setWaterService(service);
    
    if (service) {
      const allSystems = service.getAllSystems();
      setSystems(allSystems);
      if (allSystems.length > 0) {
        const systemId = allSystems[0].id;
        setSelectedSystem(allSystems[0]);
        setTodayMetrics(service.getDailySummary(systemId));
        setAnnualStats(service.getAnnualStats());
        setQualityTrends(service.getQualityTrends(systemId, 30));
        setHealthStatus(service.checkHealthStatus(systemId));
      }
    }
  }, []);

  const handleSystemChange = (system) => {
    setSelectedSystem(system);
    if (waterService) {
      setTodayMetrics(waterService.getDailySummary(system.id));
      setQualityTrends(waterService.getQualityTrends(system.id, 30));
      setHealthStatus(waterService.checkHealthStatus(system.id));
    }
  };

  const getQualityIndicator = (value, min, max) => {
    if (value < min || value > max) return "🔴";
    if (Math.abs(value - (min + max) / 2) > (max - min) * 0.3) return "🟡";
    return "🟢";
  };

  if (!waterService || !selectedSystem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading water recycling system...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "blue", secondary: "cyan" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#46c6ff'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              💧 Water Recycling System
            </h1>
            <p className="text-lg text-blue-700 dark:text-blue-200 max-w-2xl">
              Real-time aquaponics water quality monitoring and efficiency tracking
            </p>
          </div>
        </GlassSection>

        {/* System Selection */}
        <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
          <div className="p-8">
            <label className="block text-xl font-semibold text-gray-800 dark:text-white mb-6">Select Active System</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {systems.map(system => (
                <button
                  key={system.id}
                  onClick={() => handleSystemChange(system)}
                  className={`p-6 rounded-xl text-left transition-all duration-300 backdrop-blur-md border-2 min-h-[120px] ${
                    selectedSystem?.id === system.id
                      ? "bg-blue-400/40 dark:bg-blue-600/50 border-blue-400 dark:border-blue-500 ring-2 ring-blue-300 dark:ring-blue-400 shadow-lg"
                      : "bg-white/20 dark:bg-gray-700/30 border-blue-200/50 dark:border-gray-600/50 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-300/25 dark:hover:bg-blue-700/40 hover:shadow-md"
                  }`}
                >
                  <div className="font-bold text-xl text-gray-800 dark:text-white">{system.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                    Capacity: <strong>{system.volume}L</strong> | Type: <strong>{system.type}</strong>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Health Status Alert */}
        {healthStatus && !healthStatus.healthy && (
          <div className="border-l-4 border-red-500 rounded-lg p-6 bg-red-500/15 dark:bg-red-600/20 backdrop-blur-sm">
            <h3 className="font-bold text-red-700 dark:text-red-300 mb-3 text-lg">⚠️ System Health Issues Detected</h3>
            <div className="space-y-2">
              {healthStatus.alerts.map((alert, idx) => (
                <p key={idx} className="text-sm text-red-600 dark:text-red-200">{alert}</p>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {todayMetrics && (
          <GlassGrid cols={2} colsMd={4} gap={5}>
            <GlassCard colors={{ primary: "blue", secondary: "blue" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Recycling %</div>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{todayMetrics.recyclingPercentage}%</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">today's efficiency</p>
              </div>
            </GlassCard>
            <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Recycled Water</div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">{todayMetrics.recycledWater}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">liters reused</p>
              </div>
            </GlassCard>
            <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Fresh Water</div>
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{todayMetrics.freshWaterUsed}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">liters added</p>
              </div>
            </GlassCard>
            <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Efficiency Score</div>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{todayMetrics.efficiency}/100</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">system performance</p>
              </div>
            </GlassCard>
          </GlassGrid>
        )}

        {/* Tabs */}
        <GlassSection colors={{ primary: "blue", secondary: "cyan" }}>
          <div>
            <div className="flex flex-wrap border-b border-blue-300/30 dark:border-blue-700/30 backdrop-blur-sm">
              {["overview", "quality", "trends", "efficiency"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-b from-blue-400/40 to-blue-300/20 dark:from-blue-600/50 dark:to-blue-700/30 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-200/10 dark:hover:bg-blue-700/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === "overview" && todayMetrics && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Daily Summary</h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Water Flow */}
                    <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                      <div className="p-8">
                        <h4 className="font-bold text-2xl text-blue-700 dark:text-blue-300 mb-8">💧 Water Flow</h4>
                        
                        <div className="space-y-8">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Inflow</span>
                              <span className="text-blue-700 dark:text-blue-300 font-bold text-2xl">{todayMetrics.totalInflow}L</span>
                            </div>
                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full" style={{ width: "70%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Recycled</span>
                              <span className="text-green-700 dark:text-green-300 font-bold text-2xl">{todayMetrics.recycledWater}L</span>
                            </div>
                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full"
                                style={{ width: `${(todayMetrics.recycledWater / todayMetrics.totalInflow) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Fresh Water Added</span>
                              <span className="text-orange-700 dark:text-orange-300 font-bold text-2xl">{todayMetrics.freshWaterUsed}L</span>
                            </div>
                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full"
                                style={{ width: `${(todayMetrics.freshWaterUsed / todayMetrics.totalInflow) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="bg-blue-400/30 dark:bg-blue-600/40 rounded-lg p-5 border border-blue-300/50 dark:border-blue-600/50">
                            <p className="text-gray-700 dark:text-gray-200 font-medium">
                              Daily Efficiency: <strong className="text-blue-700 dark:text-blue-300">{todayMetrics.recyclingPercentage}%</strong>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                              Fresh water savings: {todayMetrics.recycledWater}L vs 100% fresh supply
                            </p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    {/* System Details */}
                    <GlassCard colors={{ primary: "gray", secondary: "blue" }}>
                      <div className="p-8">
                        <h4 className="font-bold text-2xl text-gray-800 dark:text-white mb-8">⚙️ System Config</h4>
                        
                        <div className="space-y-5">
                          {[
                            { label: "System Type", value: selectedSystem.type, color: "gray" },
                            { label: "Total Capacity", value: `${selectedSystem.volume}L`, color: "blue" },
                            { label: "Max Capacity", value: `${selectedSystem.maxCapacity}L`, color: "blue" },
                            { label: "Recycling Target", value: `${(selectedSystem.recyclingRate * 100).toFixed(0)}%`, color: "green" },
                            { label: "Target Temp", value: `${selectedSystem.targetTemp}°C`, color: "orange" },
                            { label: "Target pH", value: selectedSystem.targetPH, color: "purple" },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-300/30 dark:border-gray-700/50 last:border-b-0">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                              <span className={`font-bold text-lg ${
                                item.color === "green" ? "text-green-700 dark:text-green-400" :
                                item.color === "blue" ? "text-blue-700 dark:text-blue-400" :
                                item.color === "orange" ? "text-orange-700 dark:text-orange-400" :
                                item.color === "purple" ? "text-purple-700 dark:text-purple-400" :
                                "text-gray-800 dark:text-white"
                              }`}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-blue-400/40 dark:bg-blue-600/40 rounded-lg p-5 mt-8 border border-blue-300/50 dark:border-blue-600/50">
                          <span className="text-blue-700 dark:text-blue-200 font-semibold text-sm">📍 {selectedSystem.location}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* Quality Tab - Simplified */}
              {activeTab === "quality" && todayMetrics && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Water Quality Metrics</h3>

                  <GlassGrid cols={2} colsMd={3} gap={5}>
                    {[
                      { icon: "🌡️", title: "Temperature", value: todayMetrics.waterQuality.temperature.toFixed(1), unit: "°C", min: 24, max: 28, color: "red" },
                      { icon: "⚖️", title: "pH Level", value: todayMetrics.waterQuality.pH.toFixed(2), unit: "", min: 6.5, max: 7.2, color: "yellow" },
                      { icon: "💨", title: "Dissolved O₂", value: todayMetrics.waterQuality.dissolvedOxygen.toFixed(1), unit: "mg/L", min: 6, max: 8, color: "blue" },
                      { icon: "⚠️", title: "Ammonia", value: todayMetrics.waterQuality.ammonia.toFixed(2), unit: "mg/L", min: 0, max: 1, color: "orange" },
                      { icon: "🔴", title: "Nitrite", value: todayMetrics.waterQuality.nitrite.toFixed(2), unit: "mg/L", min: 0, max: 0.1, color: "red" },
                      { icon: "🌿", title: "Nitrate", value: todayMetrics.waterQuality.nitrate.toFixed(0), unit: "mg/L", min: 50, max: 300, color: "green" },
                    ].map((metric, idx) => (
                      <GlassCard key={idx} colors={{ primary: metric.color, secondary: metric.color }}>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-gray-800 dark:text-white">{metric.icon} {metric.title}</h4>
                            <span className="text-2xl">{getQualityIndicator(metric.value, metric.min, metric.max)}</span>
                          </div>
                          <div className="text-3xl font-bold text-gray-800 dark:text-white">{metric.value}{metric.unit}</div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Target: {metric.min}-{metric.max}</p>
                        </div>
                      </GlassCard>
                    ))}
                  </GlassGrid>

                  {todayMetrics.recommendation && (
                    <div className={`mt-8 rounded-lg p-6 border-l-4 backdrop-blur-sm ${
                      todayMetrics.recommendation.status === 'normal' ? 'bg-green-500/15 dark:bg-green-600/20 border-green-500' :
                      todayMetrics.recommendation.status === 'caution' ? 'bg-yellow-500/15 dark:bg-yellow-600/20 border-yellow-500' :
                      'bg-red-500/15 dark:bg-red-600/20 border-red-500'
                    }`}>
                      <h4 className="font-bold mb-3 text-lg">
                        {todayMetrics.recommendation.status === 'normal' ? '✓ System Status: Normal' :
                         todayMetrics.recommendation.status === 'caution' ? '⚠️ Caution Required' :
                         '🚨 Critical Alert'}
                      </h4>
                      {todayMetrics.recommendation.issues.length > 0 && (
                        <div className="mb-4">
                          <p className="font-semibold text-sm mb-2">Issues:</p>
                          <ul className="text-sm space-y-1">
                            {todayMetrics.recommendation.issues.map((issue, i) => (
                              <li key={i} className="flex items-start"><span className="mr-2">•</span><span>{issue}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {todayMetrics.recommendation.suggestions.length > 0 && (
                        <div>
                          <p className="font-semibold text-sm mb-2">Suggestions:</p>
                          <ul className="text-sm space-y-1">
                            {todayMetrics.recommendation.suggestions.map((sugg, i) => (
                              <li key={i} className="flex items-start"><span className="mr-2">→</span><span>{sugg}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Trends Tab */}
              {activeTab === "trends" && qualityTrends && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">30-Day Quality Trends</h3>

                  <GlassGrid cols={2} colsMd={2} gap={6}>
                    {[
                      { icon: "🌡️", title: "Temperature", data: qualityTrends.temperature, unit: "°C" },
                      { icon: "⚖️", title: "pH Level", data: qualityTrends.pH, unit: "" },
                      { icon: "💨", title: "Dissolved Oxygen", data: qualityTrends.dissolvedOxygen, unit: "mg/L" },
                      { icon: "⚠️", title: "Ammonia", data: qualityTrends.ammonia, unit: "mg/L" },
                    ].map((trend, idx) => (
                      <GlassCard key={idx} colors={{ primary: "blue", secondary: "cyan" }}>
                        <div className="p-8">
                          <h4 className="font-bold text-xl text-gray-800 dark:text-white mb-6">{trend.icon} {trend.title}</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-gray-300/30 dark:border-gray-700/50">
                              <span className="text-gray-600 dark:text-gray-400">Average</span>
                              <span className="font-bold text-gray-800 dark:text-white">{trend.data.avg}{trend.unit}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-300/30 dark:border-gray-700/50">
                              <span className="text-gray-600 dark:text-gray-400">Min</span>
                              <span className="font-bold text-gray-800 dark:text-white">{trend.data.min}{trend.unit}</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600 dark:text-gray-400">Max</span>
                              <span className="font-bold text-gray-800 dark:text-white">{trend.data.max}{trend.unit}</span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </GlassGrid>
                </div>
              )}

              {/* Efficiency Tab */}
              {activeTab === "efficiency" && annualStats && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Annual Efficiency Metrics</h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
                      <div className="p-8">
                        <h4 className="font-bold text-2xl text-green-700 dark:text-green-300 mb-8">🌊 Water Recycling</h4>
                        
                        <div className="space-y-8">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 dark:text-gray-300 font-semibold">Total Recycled</span>
                              <span className="font-bold text-green-700 dark:text-green-300 text-xl">{(annualStats.totalRecycled / 1000).toFixed(1)}kL</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">annual volume recycled</p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 dark:text-gray-300 font-semibold">Fresh Water Used</span>
                              <span className="font-bold text-orange-700 dark:text-orange-300 text-xl">{(annualStats.totalFreshWaterUsed / 1000).toFixed(1)}kL</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">new water required</p>
                          </div>

                          <div className="bg-green-400/30 dark:bg-green-600/40 rounded-lg p-6 border border-green-300/50 dark:border-green-600/50">
                            <div className="text-center mb-4">
                              <span className="text-4xl font-bold text-green-700 dark:text-green-300">{annualStats.recyclingPercentage}%</span>
                              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-2">Annual Recycling Rate</p>
                            </div>
                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full"
                                style={{ width: `${annualStats.recyclingPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                      <div className="p-8">
                        <h4 className="font-bold text-2xl text-blue-700 dark:text-blue-300 mb-8">📊 Annual Summary</h4>
                        
                        <div className="space-y-5">
                          {[
                            { label: "Total Processed", value: `${(annualStats.totalWaterProcessed / 1000).toFixed(1)}kL` },
                            { label: "Total Losses", value: `${(annualStats.totalLosses / 1000).toFixed(1)}kL` },
                            { label: "Avg Efficiency", value: `${annualStats.averageEfficiency}%` },
                            { label: "Fresh Water Saved", value: `${(annualStats.freshWaterSavings / 1000).toFixed(1)}kL` },
                            { label: "Data Points", value: annualStats.dataPoints },
                          ].map((stat, idx) => (
                            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-300/30 dark:border-gray-700/50 last:border-b-0">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</span>
                              <span className="font-bold text-gray-800 dark:text-white text-lg">{stat.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-green-400/40 dark:bg-green-600/40 rounded-lg p-5 mt-8 border border-green-300/50 dark:border-green-600/50 text-center">
                          <p className="text-green-700 dark:text-green-200 font-semibold">✓ Excellent Conservation</p>
                          <p className="text-sm text-green-600 dark:text-green-300 mt-2">{annualStats.recyclingPercentage}% recycling rate achieved!</p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

export default WaterRecyclingMonitor;
