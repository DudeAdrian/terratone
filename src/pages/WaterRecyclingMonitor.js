// src/pages/WaterRecyclingMonitor.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const WaterRecyclingMonitor = () => {
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
    return <div className="text-center py-12"><p className="text-gray-500">Loading water recycling system...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">💧 Water Recycling System Monitor</h1>
        <p className="text-blue-100">
          Real-time aquaponics water quality monitoring and efficiency tracking
        </p>
      </div>

      {/* System Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Active System:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systems.map(system => (
            <button
              key={system.id}
              onClick={() => handleSystemChange(system)}
              className={`p-4 rounded-lg text-left transition border-2 ${
                selectedSystem?.id === system.id
                  ? "bg-blue-100 border-blue-600"
                  : "bg-white border-gray-200 hover:border-blue-400"
              }`}
            >
              <div className="font-bold text-gray-800">{system.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                Capacity: {system.volume} L | Type: {system.type}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Health Status Alert */}
      {healthStatus && !healthStatus.healthy && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">⚠️ System Health Issues Detected</h3>
          {healthStatus.alerts.map((alert, idx) => (
            <p key={idx} className="text-sm text-red-700 mb-1">{alert}</p>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {todayMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600">Recycling %</div>
            <div className="text-2xl font-bold text-blue-700">{todayMetrics.recyclingPercentage}%</div>
            <p className="text-xs text-gray-500 mt-1">today's efficiency</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
            <div className="text-sm text-gray-600">Recycled Water</div>
            <div className="text-2xl font-bold text-green-700">{todayMetrics.recycledWater} L</div>
            <p className="text-xs text-gray-500 mt-1">reused today</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-600">
            <div className="text-sm text-gray-600">Fresh Water</div>
            <div className="text-2xl font-bold text-orange-700">{todayMetrics.freshWaterUsed} L</div>
            <p className="text-xs text-gray-500 mt-1">added today</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
            <div className="text-sm text-gray-600">Efficiency Score</div>
            <div className="text-2xl font-bold text-purple-700">{todayMetrics.efficiency}/100</div>
            <p className="text-xs text-gray-500 mt-1">system performance</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b">
          {["overview", "quality", "trends", "efficiency"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && todayMetrics && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Summary - {selectedSystem.name}</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Water Flow */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-4">💧 Water Flow (Daily)</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Inflow</span>
                        <span className="text-blue-700 font-bold">{todayMetrics.totalInflow} L</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Recycled</span>
                        <span className="text-green-700 font-bold">{todayMetrics.recycledWater} L</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-full rounded-full"
                          style={{ width: `${(todayMetrics.recycledWater / todayMetrics.totalInflow) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Fresh Water Added</span>
                        <span className="text-orange-700 font-bold">{todayMetrics.freshWaterUsed} L</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div 
                          className="bg-orange-500 h-full rounded-full"
                          style={{ width: `${(todayMetrics.freshWaterUsed / todayMetrics.totalInflow) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 mt-4 text-sm">
                      <p className="text-gray-700">
                        <strong>Daily Efficiency:</strong> {todayMetrics.recyclingPercentage}% of water recycled
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        Fresh water savings: {todayMetrics.recycledWater} L compared to 100% fresh supply
                      </p>
                    </div>
                  </div>
                </div>

                {/* System Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4">⚙️ System Details</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">System Type:</span>
                      <span className="font-semibold text-gray-800 capitalize">{selectedSystem.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Capacity:</span>
                      <span className="font-semibold text-gray-800">{selectedSystem.volume} L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Capacity:</span>
                      <span className="font-semibold text-gray-800">{selectedSystem.maxCapacity} L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recycling Rate Target:</span>
                      <span className="font-semibold text-green-700">{(selectedSystem.recyclingRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Temperature:</span>
                      <span className="font-semibold text-gray-800">{selectedSystem.targetTemp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target pH:</span>
                      <span className="font-semibold text-gray-800">{selectedSystem.targetPH}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded p-3 mt-4 text-xs text-blue-700">
                    <strong>Location:</strong> {selectedSystem.location}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Water Quality Tab */}
          {activeTab === "quality" && todayMetrics && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Water Quality Metrics</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Temperature */}
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">🌡️ Temperature</h4>
                    <span className="text-2xl">
                      {getQualityIndicator(todayMetrics.waterQuality.temperature, 24, 28)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 mb-1">{todayMetrics.waterQuality.temperature.toFixed(1)}°C</div>
                  <p className="text-xs text-gray-600">Target: {selectedSystem.targetTemp}°C</p>
                </div>

                {/* pH */}
                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">⚖️ pH Level</h4>
                    <span className="text-2xl">
                      {getQualityIndicator(todayMetrics.waterQuality.pH, 6.5, 7.2)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 mb-1">{todayMetrics.waterQuality.pH.toFixed(2)}</div>
                  <p className="text-xs text-gray-600">Target: {selectedSystem.targetPH}</p>
                </div>

                {/* Dissolved Oxygen */}
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">💨 Dissolved Oxygen</h4>
                    <span className="text-2xl">
                      {getQualityIndicator(todayMetrics.waterQuality.dissolvedOxygen, 6, 8)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">{todayMetrics.waterQuality.dissolvedOxygen.toFixed(1)} mg/L</div>
                  <p className="text-xs text-gray-600">Healthy: 6-8 mg/L</p>
                </div>

                {/* Ammonia */}
                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">⚠️ Ammonia</h4>
                    <span className="text-2xl">
                      {getQualityIndicator(todayMetrics.waterQuality.ammonia, 0, 1)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700 mb-1">{todayMetrics.waterQuality.ammonia.toFixed(2)} mg/L</div>
                  <p className="text-xs text-gray-600">Toxic above: 1 mg/L</p>
                </div>

                {/* Nitrite */}
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">🔴 Nitrite</h4>
                    <span className="text-2xl">
                      {getQualityIndicator(todayMetrics.waterQuality.nitrite, 0, 0.1)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 mb-1">{todayMetrics.waterQuality.nitrite.toFixed(2)} mg/L</div>
                  <p className="text-xs text-gray-600">Safe: below 0.1 mg/L</p>
                </div>

                {/* Nitrate */}
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">🌿 Nitrate</h4>
                    <span className="text-2xl">
                      {getQualityIndicator(todayMetrics.waterQuality.nitrate, 50, 300)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-1">{todayMetrics.waterQuality.nitrate.toFixed(0)} mg/L</div>
                  <p className="text-xs text-gray-600">Plant nutrient: 50-300 mg/L</p>
                </div>
              </div>

              {todayMetrics.recommendation && (
                <div className={`mt-6 border-l-4 rounded-lg p-4 ${
                  todayMetrics.recommendation.status === 'normal' ? 'bg-green-50 border-green-500' :
                  todayMetrics.recommendation.status === 'caution' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-red-50 border-red-500'
                }`}>
                  <h4 className="font-bold mb-2">
                    {todayMetrics.recommendation.status === 'normal' ? '✓ System Status: Normal' :
                     todayMetrics.recommendation.status === 'caution' ? '⚠️ Caution Required' :
                     '🚨 Alert'}
                  </h4>
                  {todayMetrics.recommendation.issues.length > 0 && (
                    <div className="mb-3">
                      <p className="font-semibold text-sm mb-1">Issues:</p>
                      <ul className="text-sm space-y-1">
                        {todayMetrics.recommendation.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {todayMetrics.recommendation.suggestions.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-1">Suggestions:</p>
                      <ul className="text-sm space-y-1">
                        {todayMetrics.recommendation.suggestions.map((sugg, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">→</span>
                            <span>{sugg}</span>
                          </li>
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">30-Day Quality Trends</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Temperature Trend */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-gray-800 mb-3">🌡️ Temperature Range</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.temperature.avg}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.temperature.min}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.temperature.max}°C</span>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-blue-100 rounded text-xs text-blue-700">
                    Status: {Math.abs(qualityTrends.temperature.avg - selectedSystem.targetTemp) < 1 ? '✓ Stable' : '⚠️ Variable'}
                  </div>
                </div>

                {/* pH Trend */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-gray-800 mb-3">⚖️ pH Range</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.pH.avg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.pH.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.pH.max}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-yellow-100 rounded text-xs text-yellow-700">
                    Status: {Math.abs(qualityTrends.pH.avg - selectedSystem.targetPH) < 0.2 ? '✓ Stable' : '⚠️ Drifting'}
                  </div>
                </div>

                {/* DO Trend */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-gray-800 mb-3">💨 Dissolved Oxygen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.dissolvedOxygen.avg} mg/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.dissolvedOxygen.min} mg/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.dissolvedOxygen.max} mg/L</span>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-blue-100 rounded text-xs text-blue-700">
                    Status: {qualityTrends.dissolvedOxygen.min > 6 ? '✓ Adequate' : '⚠️ Low'}
                  </div>
                </div>

                {/* Ammonia Trend */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-gray-800 mb-3">⚠️ Ammonia Levels</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.ammonia.avg} mg/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-bold text-gray-800">{qualityTrends.ammonia.max} mg/L</span>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-orange-100 rounded text-xs text-orange-700">
                    Status: {qualityTrends.ammonia.max < 1 ? '✓ Safe' : '⚠️ Elevated'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Efficiency Tab */}
          {activeTab === "efficiency" && annualStats && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Annual Efficiency Metrics</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-lime-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-4">🌊 Water Recycling</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Total Recycled</span>
                        <span className="font-bold text-green-700">{(annualStats.totalRecycled / 1000).toFixed(1)} k L</span>
                      </div>
                      <div className="text-xs text-gray-600">annual volume recycled</div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Fresh Water Used</span>
                        <span className="font-bold text-orange-700">{(annualStats.totalFreshWaterUsed / 1000).toFixed(1)} k L</span>
                      </div>
                      <div className="text-xs text-gray-600">new water required</div>
                    </div>

                    <div className="bg-white rounded p-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-semibold">Recycling Rate</span>
                        <span className="text-2xl font-bold text-green-700">{annualStats.recyclingPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-lime-500 h-full rounded-full"
                          style={{ width: `${annualStats.recyclingPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-4">📊 Annual Summary</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Processed</span>
                      <span className="font-bold text-gray-800">{(annualStats.totalWaterProcessed / 1000).toFixed(1)} k L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Losses</span>
                      <span className="font-bold text-gray-800">{(annualStats.totalLosses / 1000).toFixed(1)} k L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Efficiency</span>
                      <span className="font-bold text-gray-800">{annualStats.averageEfficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fresh Water Saved</span>
                      <span className="font-bold text-green-700">{(annualStats.freshWaterSavings / 1000).toFixed(1)} k L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Points</span>
                      <span className="font-bold text-gray-800">{annualStats.dataPoints}</span>
                    </div>
                  </div>

                  <div className="bg-green-100 rounded p-3 mt-4 text-xs text-green-700 font-semibold">
                    ✓ Excellent water conservation - {annualStats.recyclingPercentage}% recycling rate achieved!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterRecyclingMonitor;
