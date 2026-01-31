// src/pages/services/CommunityCapacity.js

import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { useCommunityData } from "../../hooks/useApi";

const CommunityCapacity = () => {
  const [capacityService, setCapacityService] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [utilization, setUtilization] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const communityData = useCommunityData("default");

  useEffect(() => {
    const service = sofieCore.getService("communityCapacity");
    setCapacityService(service);
    
    if (service) {
      setMetrics(service.getCapacityMetrics());
      setSystemHealth(service.getSystemHealth());
      setUtilization(service.getOverallUtilization());
      setAlerts(service.getCapacityAlerts());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const apiCapacity = communityData.resources?.data?.capacityMetrics || communityData.resources?.data?.capacity || null;
      const apiHealth = communityData.resources?.data?.systemHealth;
      const apiUtilization = communityData.resources?.data?.utilization;
      const apiAlerts = communityData.resources?.data?.alerts;

      if (apiCapacity && apiHealth) {
        setMetrics(apiCapacity);
        setSystemHealth(apiHealth);
        setUtilization(apiUtilization || apiCapacity.utilization || {});
        setAlerts(Array.isArray(apiAlerts) ? apiAlerts : alerts);
        setError(null);
      }

      if (communityData.resources?.error) {
        setError(communityData.resources.error.message || "Failed to load community capacity data");
      }

      setLoading(communityData.isLoading);
    } catch (err) {
      console.error("Error loading community capacity data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [communityData.resources?.data, communityData.resources?.error, communityData.isLoading]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading community capacity data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => communityData.resources?.refetch?.() || window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!metrics || !systemHealth) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No community capacity data available</p>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-lime-600 bg-lime-50 border-lime-200";
    if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getAlertColor = (level) => {
    switch (level) {
      case "critical": return "bg-red-100 border-red-300 text-red-800";
      case "warning": return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "info": return "bg-blue-100 border-blue-300 text-blue-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const populationCurrent = metrics.population?.current || 0;
  const populationCapacity = metrics.population?.capacity || 1;
  const populationPercent = Math.min(100, Math.round((populationCurrent / populationCapacity) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">👥 Community Capacity Monitor</h1>
        <p className="text-green-100">
          Real-time human capacity and system load measurement for Sofie Systems
        </p>
      </div>

      {/* Population Capacity - Main Focus */}
      <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Population Capacity</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Current Population */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-600">
            <div className="text-sm text-gray-600 uppercase font-semibold mb-2">Current Population</div>
            <div className="text-4xl font-bold text-blue-700">{metrics.population.current}</div>
            <div className="text-sm text-gray-600 mt-2">Residents</div>
          </div>

          {/* System Capacity */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-600">
            <div className="text-sm text-gray-600 uppercase font-semibold mb-2">System Capacity</div>
            <div className="text-4xl font-bold text-purple-700">{metrics.population.capacity}</div>
            <div className="text-sm text-gray-600 mt-2">Maximum Residents</div>
          </div>

          {/* Utilization Rate */}
          <div className={`p-6 rounded-lg border-l-4 bg-gradient-to-br ${
            populationPercent >= 85 ? 'from-orange-50 to-orange-100 border-orange-600' :
            populationPercent >= 70 ? 'from-yellow-50 to-yellow-100 border-yellow-600' :
            'from-green-50 to-green-100 border-green-600'
          }`}>
            <div className="text-sm text-gray-600 uppercase font-semibold mb-2">Utilization</div>
            <div className={`text-4xl font-bold ${
              populationPercent >= 85 ? 'text-orange-700' :
              populationPercent >= 70 ? 'text-yellow-700' :
              'text-green-700'
            }`}>{populationPercent}%</div>
            <div className="text-sm text-gray-600 mt-2">Available: {metrics.population.capacity - metrics.population.current} spots</div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">System Load</span>
            <span className="text-sm font-bold text-gray-600">{populationPercent}% of capacity</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all ${
                populationPercent >= 85 ? 'bg-red-500' :
                populationPercent >= 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${populationPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-center mt-6">
          <div className={`inline-block px-6 py-3 rounded-lg font-bold text-white ${
            populationPercent >= 85 ? 'bg-red-600' :
            populationPercent >= 70 ? 'bg-yellow-600' :
            'bg-green-600'
          }`}>
            {populationPercent >= 85 ? '🔴 HIGH CAPACITY' :
             populationPercent >= 70 ? '🟡 MODERATE CAPACITY' :
             '🟢 OPTIMAL CAPACITY'}
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">System Health by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(systemHealth.categories || {}).map(([category, score]) => (
            <div key={category} className={`p-4 rounded-lg border-2 ${getHealthColor(score)}`}>
              <div className="text-sm font-semibold text-gray-700 capitalize mb-2">{category}</div>
              <div className="text-3xl font-bold">{score}%</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    score >= 85 ? 'bg-green-600' :
                    score >= 70 ? 'bg-lime-600' :
                    score >= 50 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Utilization */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Subsystem Load Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(utilization.breakdown || {}).map(([key, value]) => (
            <div key={key} className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{value}%</div>
              <div className="text-sm text-gray-600 capitalize mt-1">{key}</div>
              <div className="mt-3 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-600 h-1.5 rounded-full"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capacity Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Capacity Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.level)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">{alert.message}</div>
                    <div className="text-sm mt-1">Recommendation: {alert.recommendation}</div>
                  </div>
                  <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-opacity-20">{alert.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Metrics by Category */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b bg-gray-50">
          {["population", "housing", "energy", "water", "food"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                selectedTab === tab
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab === 'population' && '👥 '}
              {tab === 'housing' && '🏠 '}
              {tab === 'energy' && '⚡ '}
              {tab === 'water' && '💧 '}
              {tab === 'food' && '🌾 '}
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {selectedTab === "population" && metrics.population && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Current Population</div>
                <div className="text-3xl font-bold text-blue-600">{metrics.population.current}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Maximum Capacity</div>
                <div className="text-3xl font-bold text-purple-600">{metrics.population.capacity}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Utilization Rate</div>
                <div className="text-3xl font-bold text-green-600">{metrics.population.utilization}%</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Growth Trend</div>
                <div className="text-3xl font-bold text-emerald-600">{metrics.population.growth}</div>
              </div>
            </div>
          )}

          {selectedTab === "housing" && metrics.housing && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Total Units</div>
                <div className="text-3xl font-bold">{metrics.housing.units}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Occupied Units</div>
                <div className="text-3xl font-bold">{metrics.housing.occupied}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Available Units</div>
                <div className="text-3xl font-bold text-green-600">{metrics.housing.available}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Utilization</div>
                <div className="text-3xl font-bold">{metrics.housing.utilization}%</div>
              </div>
              <div className="border rounded-lg p-4 md:col-span-2">
                <div className="text-sm text-gray-600 mb-1">Avg Efficiency</div>
                <div className="text-2xl font-bold text-green-600">{metrics.housing.avgEfficiency}</div>
              </div>
            </div>
          )}

          {selectedTab === "energy" && metrics.energy && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Daily Production</div>
                <div className="text-2xl font-bold">{metrics.energy.dailyProduction} kWh</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Daily Consumption</div>
                <div className="text-2xl font-bold">{metrics.energy.dailyConsumption} kWh</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Battery Capacity</div>
                <div className="text-2xl font-bold">{metrics.energy.batteryCapacity} kWh</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Current Storage</div>
                <div className="text-2xl font-bold">{metrics.energy.currentStorage} kWh</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Renewable %</div>
                <div className="text-3xl font-bold text-green-600">{metrics.energy.renewablePercent}%</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Utilization</div>
                <div className="text-3xl font-bold">{metrics.energy.utilization}%</div>
              </div>
            </div>
          )}

          {selectedTab === "water" && metrics.water && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Daily Capacity</div>
                <div className="text-2xl font-bold">{(metrics.water.dailyCapacity / 1000).toFixed(1)}k L</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Daily Usage</div>
                <div className="text-2xl font-bold">{(metrics.water.dailyUsage / 1000).toFixed(1)}k L</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Rainwater Harvested</div>
                <div className="text-2xl font-bold text-blue-600">{(metrics.water.rainwaterHarvested / 1000).toFixed(1)}k L</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Recycled Water</div>
                <div className="text-2xl font-bold text-cyan-600">{(metrics.water.recycledWater / 1000).toFixed(1)}k L</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Efficiency</div>
                <div className="text-3xl font-bold text-green-600">{metrics.water.efficiency}%</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Utilization</div>
                <div className="text-3xl font-bold">{metrics.water.utilization}%</div>
              </div>
            </div>
          )}

          {selectedTab === "food" && metrics.food && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Daily Production</div>
                <div className="text-2xl font-bold">{metrics.food.dailyProduction} kg</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Daily Consumption</div>
                <div className="text-2xl font-bold">{metrics.food.dailyConsumption} kg</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Surplus for Trade</div>
                <div className="text-2xl font-bold text-green-600">{metrics.food.surplusForTrade} kg</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Self-Sufficiency</div>
                <div className="text-3xl font-bold text-green-600">{metrics.food.selfSufficiency}%</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Aquaponics Systems</div>
                <div className="text-2xl font-bold">{metrics.food.aquaponicsSystems}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Garden Plots</div>
                <div className="text-2xl font-bold">{metrics.food.gardenPlots}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityCapacity;
