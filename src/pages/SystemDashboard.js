// src/pages/SystemDashboard.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

const SystemDashboard = () => {
  const [services, setServices] = useState({});
  const [systemHealth, setSystemHealth] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [autopilotStatus, setAutopilotStatus] = useState(null);
  const [climateZone, setClimateZone] = useState("temperate");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDashboard();
    
    // Subscribe to key events
    const unsubscribers = [];
    
    unsubscribers.push(eventBus.on(EVENTS.AUTOPILOT_DECISION, handleAutopilotDecision));
    unsubscribers.push(eventBus.on(EVENTS.AUTOPILOT_MODE_CHANGED, handleModeChange));
    unsubscribers.push(eventBus.on(EVENTS.CLIMATE_ZONE_CHANGED, handleClimateChange));
    unsubscribers.push(eventBus.on(EVENTS.WATER_QUALITY_ALERT, handleWaterAlert));
    unsubscribers.push(eventBus.on(EVENTS.PEST_RISK_CHANGED, handlePestAlert));
    
    // Refresh dashboard every 30 seconds
    const interval = setInterval(() => {
      updateDashboardData();
    }, 30000);

    return () => {
      unsubscribers.forEach(unsub => unsub());
      clearInterval(interval);
    };
  }, []);

  const initializeDashboard = () => {
    try {
      sofieCore.init();
      
      // Load climate zone preference
      const storageService = sofieCore.getService("storage");
      if (storageService) {
        const savedZone = storageService.getPreference("climateZone", "temperate");
        setClimateZone(savedZone);
      }
      
      updateDashboardData();
      setLoading(false);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
      setLoading(false);
    }
  };

  const updateDashboardData = () => {
    try {
      // Gather data from all services
      const serviceData = {};
      
      // Autopilot
      const autopilot = sofieCore.getService("autopilot");
      if (autopilot) {
        serviceData.autopilot = {
          mode: autopilot.getMode(),
          health: autopilot.getSystemHealthScore(),
          stats: autopilot.getStatistics(),
        };
        setAutopilotStatus(serviceData.autopilot);
      }

    // Water Recycling
    const waterRecycling = sofieCore.getService("waterRecycling");
    if (waterRecycling) {
      const metrics = waterRecycling.getCurrentMetrics();
      serviceData.water = {
        efficiency: waterRecycling.getRecyclingEfficiency(),
        metrics: metrics,
        status: getWaterStatus(metrics),
      };
    }

    // Food Service
    const food = sofieCore.getService("food");
    if (food) {
      serviceData.food = {
        activeCrops: food.getActiveCropsCount(),
        nutritionBalance: food.getNutritionBalance(),
        proteinProduction: food.getDailyProteinProduction(),
      };
    }

    // Pest Management
    const pest = sofieCore.getService("pestManagement");
    if (pest) {
      serviceData.pest = {
        riskLevel: pest.getCurrentRiskLevel(),
        population: pest.getPestPopulation(),
        diseaseRisk: pest.getDiseaseRisk(),
      };
    }

    // Energy
    const energy = sofieCore.getService("energy");
    if (energy) {
      serviceData.energy = {
        consumption: energy.getCurrentPowerConsumption(),
        pumpEfficiency: energy.getPumpEfficiency(),
      };
    }

    // Aquatic Life
    const aquatic = sofieCore.getService("aquaticLife");
    if (aquatic) {
      const overview = aquatic.getDatabaseOverview();
      serviceData.aquatic = {
        totalSpecies: overview?.totalSpecies || 0,
        activeSpecies: overview?.recommendedForBeginners?.length || 0,
      }
    }

    setServices(serviceData);
    calculateSystemHealth(serviceData);
    loadRecentEvents();
    } catch (error) {
      console.error("Error updating dashboard data:", error);
    }
  };

  const getWaterStatus = (metrics) => {
    if (!metrics) return "unknown";
    
    const phInRange = metrics.pH >= 6.5 && metrics.pH <= 8.0;
    const tempInRange = metrics.temperature >= 20 && metrics.temperature <= 32;
    const doInRange = metrics.dissolvedOxygen >= 6;
    
    if (phInRange && tempInRange && doInRange) return "optimal";
    if (phInRange && tempInRange) return "good";
    return "warning";
  };

  const calculateSystemHealth = (serviceData) => {
    const scores = [];
    
    if (serviceData.autopilot) scores.push(serviceData.autopilot.health);
    if (serviceData.water) scores.push(serviceData.water.efficiency);
    if (serviceData.food) scores.push(serviceData.food.nutritionBalance * 100);
    if (serviceData.pest) scores.push(100 - serviceData.pest.riskLevel);
    if (serviceData.energy) scores.push(serviceData.energy.pumpEfficiency);
    
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    setSystemHealth({
      overall: Math.round(average),
      autopilot: serviceData.autopilot?.health || 0,
      water: serviceData.water?.efficiency || 0,
      food: Math.round((serviceData.food?.nutritionBalance || 0) * 100),
      pest: Math.round(100 - (serviceData.pest?.riskLevel || 0)),
      energy: serviceData.energy?.pumpEfficiency || 0,
    });
  };

  const loadRecentEvents = () => {
    const history = eventBus.getHistory(10);
    setRecentEvents(history);
    
    // Filter for alert-type events
    const alerts = history.filter(e => 
      e.event.includes('alert') || 
      e.event.includes('intervention') ||
      e.event === EVENTS.PEST_RISK_CHANGED
    );
    setRecentAlerts(alerts.slice(-5));
  };

  // Event handlers
  const handleAutopilotDecision = (decision) => {
    updateDashboardData();
  };

  const handleModeChange = (data) => {
    updateDashboardData();
  };

  const handleClimateChange = (data) => {
    setClimateZone(data.newZone);
    updateDashboardData();
  };

  const handleWaterAlert = (alert) => {
    setRecentAlerts(prev => [...prev.slice(-4), { event: EVENTS.WATER_QUALITY_ALERT, data: alert, timestamp: Date.now() }]);
  };

  const handlePestAlert = (alert) => {
    setRecentAlerts(prev => [...prev.slice(-4), { event: EVENTS.PEST_RISK_CHANGED, data: alert, timestamp: Date.now() }]);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getHealthTextColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📊 System Dashboard</h1>
        <p className="text-green-100">
          Comprehensive overview of all 30 services • Climate Zone: {climateZone.charAt(0).toUpperCase() + climateZone.slice(1)}
        </p>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Health</h2>
          
          {/* Overall Health */}
          <div className="mb-6 text-center">
            <div className="inline-block">
              <div className={`text-6xl font-bold ${getHealthTextColor(systemHealth.overall)} mb-2`}>
                {systemHealth.overall}%
              </div>
              <div className="text-gray-600 text-lg">Overall Health Score</div>
            </div>
          </div>

          {/* Individual Service Health */}
          <div className="grid md:grid-cols-5 gap-4">
            <HealthCard
              title="Autopilot"
              score={systemHealth.autopilot}
              icon="🤖"
              color={getHealthColor(systemHealth.autopilot)}
            />
            <HealthCard
              title="Water"
              score={systemHealth.water}
              icon="💧"
              color={getHealthColor(systemHealth.water)}
            />
            <HealthCard
              title="Food"
              score={systemHealth.food}
              icon="🌱"
              color={getHealthColor(systemHealth.food)}
            />
            <HealthCard
              title="Pest Control"
              score={systemHealth.pest}
              icon="🐛"
              color={getHealthColor(systemHealth.pest)}
            />
            <HealthCard
              title="Energy"
              score={systemHealth.energy}
              icon="⚡"
              color={getHealthColor(systemHealth.energy)}
            />
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Autopilot Status */}
        {autopilotStatus && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🤖 Autopilot Status
            </h3>
            <div className="space-y-3">
              <StatRow label="Mode" value={autopilotStatus.mode.current} />
              <StatRow label="Active Playbooks" value={`${autopilotStatus.mode.playbooksActive}/${autopilotStatus.mode.totalPlaybooks}`} />
              <StatRow label="Total Decisions" value={autopilotStatus.stats.totalDecisions} />
              <StatRow label="Success Rate" value={`${autopilotStatus.stats.successRate}%`} />
            </div>
          </div>
        )}

        {/* Water Quality */}
        {services.water && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              💧 Water Quality
            </h3>
            <div className="space-y-3">
              <StatRow label="Recycling Efficiency" value={`${services.water.efficiency}%`} />
              <StatRow label="pH Level" value={services.water.metrics.pH.toFixed(1)} />
              <StatRow label="Temperature" value={`${services.water.metrics.temperature.toFixed(1)}°C`} />
              <StatRow label="Dissolved O₂" value={`${services.water.metrics.dissolvedOxygen.toFixed(1)} mg/L`} />
              <div className={`text-sm font-semibold ${
                services.water.status === 'optimal' ? 'text-green-600' :
                services.water.status === 'good' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                Status: {services.water.status.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Food Production */}
        {services.food && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🌱 Food Production
            </h3>
            <div className="space-y-3">
              <StatRow label="Active Crops" value={services.food.activeCrops} />
              <StatRow label="Nutrition Balance" value={`${Math.round(services.food.nutritionBalance * 100)}%`} />
              <StatRow label="Daily Protein" value={`${Math.round(services.food.proteinProduction)}g`} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Pest & Energy */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pest Management */}
        {services.pest && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🐛 Pest Management
            </h3>
            <div className="space-y-3">
              <StatRow 
                label="Risk Level" 
                value={`${services.pest.riskLevel}/100`}
                valueClass={services.pest.riskLevel > 60 ? 'text-red-600 font-bold' : 'text-green-600'}
              />
              <StatRow label="Pest Population" value={services.pest.population} />
              <StatRow 
                label="Disease Risk" 
                value={`${services.pest.diseaseRisk}/100`}
                valueClass={services.pest.diseaseRisk > 60 ? 'text-red-600 font-bold' : 'text-green-600'}
              />
            </div>
          </div>
        )}

        {/* Energy & Equipment */}
        {services.energy && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              ⚡ Energy & Equipment
            </h3>
            <div className="space-y-3">
              <StatRow label="Power Consumption" value={`${services.energy.consumption}W`} />
              <StatRow label="Pump Efficiency" value={`${services.energy.pumpEfficiency}%`} />
              {services.aquatic && (
                <StatRow label="Aquatic Species" value={`${services.aquatic.activeSpecies}/${services.aquatic.totalSpecies}`} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔔 Recent Alerts</h3>
          <div className="space-y-2">
            {recentAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{formatEventName(alert.event)}</div>
                  <div className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Recent System Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentEvents.map((event, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{formatEventName(event.event)}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <QuickActionButton 
            label="Autopilot Mode"
            icon="🤖"
            link="/autopilot"
          />
          <QuickActionButton 
            label="Water Recycling"
            icon="💧"
            link="/water-recycling"
          />
          <QuickActionButton 
            label="Pest Management"
            icon="🐛"
            link="/pest-management"
          />
          <QuickActionButton 
            label="Climate Settings"
            icon="🌍"
            link="/climate-settings"
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const HealthCard = ({ title, score, icon, color }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm text-gray-600 mb-2">{title}</div>
    <div className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>
      {score}%
    </div>
  </div>
);

const StatRow = ({ label, value, valueClass = "text-gray-900" }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
  </div>
);

const QuickActionButton = ({ label, icon, link }) => (
  <a
    href={link}
    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200 hover:border-green-500"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm font-semibold text-gray-700">{label}</div>
  </a>
);

const formatEventName = (eventName) => {
  return eventName
    .split(':')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default SystemDashboard;
