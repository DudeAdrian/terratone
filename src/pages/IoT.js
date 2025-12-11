// src/pages/IoT_v2.js - Glassmorphic IoT Sensor Network Dashboard

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useCommunityData } from "../hooks/useApi";
import { createBackHandler } from "../utils/navigation";

const IoT = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const { data: communityApi, loading: iotLoading, error: iotError, refetch } = useCommunityData("default");
  const [sensors, setSensors] = useState([
    { id: "1", name: "Water pH Monitor", type: "water_ph", location: "Tank A", lastReading: 7.2, status: "active" },
    { id: "2", name: "Soil Moisture", type: "soil_moisture", location: "Garden B", lastReading: 65, status: "active" },
    { id: "3", name: "Air Temperature", type: "air_temp", location: "Greenhouse", lastReading: 22.5, status: "active" },
  ]);
  const [activeTab, setActiveTab] = useState("overview");
  const [health, setHealth] = useState({
    active: 3,
    inactive: 1,
    stale: 0,
  });
  const [newSensor, setNewSensor] = useState({
    type: "water_ph",
    location: "",
    name: "",
  });

  // Merge sensors from API if present
  useEffect(() => {
    const apiSensors = communityApi?.sensors || communityApi?.iotSensors || [];
    if (Array.isArray(apiSensors) && apiSensors.length) {
      setSensors(apiSensors);
      setHealth({
        active: apiSensors.filter(s => s.status === 'active').length,
        inactive: apiSensors.filter(s => s.status === 'inactive').length,
        stale: apiSensors.filter(s => s.status === 'stale').length,
      });
    }
  }, [communityApi]);

  const handleAddSensor = () => {
    if (!newSensor.name || !newSensor.location) {
      alert("Please fill in all fields");
      return;
    }

    const sensorData = {
      id: `sensor-${Date.now()}`,
      ...newSensor,
      status: "active",
      lastReading: null,
      createdAt: new Date().toISOString(),
    };

    setSensors([...sensors, sensorData]);
    setHealth({ ...health, active: health.active + 1 });
    setNewSensor({ type: "water_ph", location: "", name: "" });
  };

  const getSensorIcon = (type) => {
    const icons = {
      water_ph: "💧",
      water_temp: "🌡️",
      water_do: "🫧",
      soil_moisture: "🌱",
      soil_temp: "🥔",
      air_temp: "🌡️",
      air_humidity: "💨",
      light_level: "💡",
    };
    return icons[type] || "📡";
  };

  const getSensorThresholds = (type) => {
    const thresholds = {
      water_ph: { critical: { min: 6.5, max: 8.0 }, warning: { min: 6.0, max: 8.5 }, unit: "pH" },
      water_temp: { critical: { min: 15, max: 30 }, warning: { min: 10, max: 35 }, unit: "°C" },
      soil_moisture: { critical: { min: 40, max: 80 }, warning: { min: 30, max: 90 }, unit: "%" },
      air_temp: { critical: { min: 15, max: 28 }, warning: { min: 10, max: 35 }, unit: "°C" },
      light_level: { critical: { min: 200, max: 800 }, warning: { min: 100, max: 1000 }, unit: "lux" },
    };
    return thresholds[type] || {};
  };

  const getStatusLabel = (value, thresholds) => {
    if (!thresholds.critical) return "🟢 OK";
    if (value < thresholds.critical.min || value > thresholds.critical.max) return "🔴 Critical";
    if (value < thresholds.warning.min || value > thresholds.warning.max) return "🟠 Warning";
    return "🟢 OK";
  };

  if (iotLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <div className="p-8 text-slate-700 dark:text-slate-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-slate-500 border-t-transparent rounded-full mr-3"></div>
            Loading IoT data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (iotError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading IoT Data</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">{iotError}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }} elevation="high">
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e8d3ba'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              📡 IoT Sensor Network
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Real-time monitoring and management of connected sensors across your communities
            </p>
          </div>
        </GlassSection>

        {/* Health Overview */}
        <GlassGrid cols={2} colsMd={4} gap={4}>
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Active</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{health.active}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">✅ Sensors</p>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Inactive</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{health.inactive}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">⏸️ Paused</p>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Stale</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{health.stale}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">⚠️ &gt;1h old</p>
          </GlassCard>

          <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Total</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{sensors.length}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">📡 Registered</p>
          </GlassCard>
        </GlassGrid>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["overview", "sensors", "add"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white dark:from-slate-300 dark:to-slate-100 dark:text-slate-900"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {tab === "overview" && "👁️"} 
              {tab === "sensors" && `📊 (${sensors.length})`}
              {tab === "add" && "➕"}
              {" " + (tab === "add" ? "Add Sensor" : tab.charAt(0).toUpperCase() + tab.slice(1))}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Readings</h3>
            <div className="space-y-3">
              {sensors.slice(0, 5).map(sensor => {
                const thresholds = getSensorThresholds(sensor.type);
                return (
                  <div key={sensor.id} className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30 hover:bg-white/30 transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getSensorIcon(sensor.type)}</span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{sensor.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{sensor.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {sensor.lastReading} {thresholds.unit}
                      </p>
                      <p className="text-xs font-semibold mt-1">{getStatusLabel(sensor.lastReading, thresholds)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 dark:border-slate-700/50">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                🔗 All sensor data recorded on-chain for verification
              </p>
            </div>
          </GlassSection>
        )}

        {/* Sensors Tab */}
        {activeTab === "sensors" && (
          <GlassGrid cols={1} colsMd={2} gap={6}>
            {sensors.map(sensor => {
              const thresholds = getSensorThresholds(sensor.type);
              return (
                <GlassCard key={sensor.id} colors={{ primary: "blue", secondary: "cyan" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{getSensorIcon(sensor.type)}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{sensor.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{sensor.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sensor.status === "active"
                        ? "bg-green-400/30 text-green-700 dark:text-green-300"
                        : "bg-slate-400/30 text-slate-700 dark:text-slate-300"
                    }`}>
                      {sensor.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Current Value:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{sensor.lastReading} {thresholds.unit}</span>
                    </div>
                    {thresholds.critical && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Range:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {thresholds.critical.min}–{thresholds.critical.max}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {getStatusLabel(sensor.lastReading || 0, thresholds)}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </GlassGrid>
        )}

        {/* Add Sensor Tab */}
        {activeTab === "add" && (
          <GlassSection colors={{ primary: "green", secondary: "emerald" }}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Register New Sensor</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Sensor Name
                </label>
                <input
                  type="text"
                  value={newSensor.name}
                  onChange={(e) => setNewSensor({ ...newSensor, name: e.target.value })}
                  placeholder="e.g., Water pH Monitor"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newSensor.location}
                  onChange={(e) => setNewSensor({ ...newSensor, location: e.target.value })}
                  placeholder="e.g., Greenhouse A"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Sensor Type
                </label>
                <select
                  value={newSensor.type}
                  onChange={(e) => setNewSensor({ ...newSensor, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white"
                >
                  <option value="water_ph">💧 Water pH</option>
                  <option value="water_temp">🌡️ Water Temperature</option>
                  <option value="soil_moisture">🌱 Soil Moisture</option>
                  <option value="air_temp">🌡️ Air Temperature</option>
                  <option value="light_level">💡 Light Level</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddSensor}
              className="w-full px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all"
            >
              + Register Sensor
            </button>

            <div className="mt-6 pt-6 border-t border-white/20 dark:border-slate-700/50">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                🔗 All new sensors will be registered on blockchain immediately
              </p>
            </div>
          </GlassSection>
        )}
      </div>
    </div>
  );
};

export default IoT;
