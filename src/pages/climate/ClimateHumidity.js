import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useClimateData } from "../../hooks/useApi";

export default function ClimateHumidity() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [humidityData, setHumidityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const climateData = useClimateData("default");

  useEffect(() => {
    const loadData = () => {
      try {
        if (climateData.monitoring.data) {
          const payload = climateData.monitoring.data;
          const data = Array.isArray(payload) ? payload[0] : payload;
          setHumidityData(data);
          setError(null);
        } else if (!climateData.isLoading) {
          const climateService = sofieCore.getService("climate");
          if (climateService?.getHumidityData) {
            setHumidityData(climateService.getHumidityData());
          }
        }

        setLoading(climateData.isLoading);

        if (climateData.monitoring.error) {
          setError(climateData.monitoring.error.message || "Failed to load humidity data");
        }
      } catch (err) {
        console.error("Error loading humidity data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [climateData.monitoring.data, climateData.isLoading, climateData.monitoring.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full mr-3"></div>
            Loading humidity data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "orange" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => climateData.monitoring.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!humidityData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No humidity data available</div>
        </GlassCard>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === "rising") return "↗️";
    if (trend === "falling") return "↘️";
    return "➡️";
  };

  const getTrendColor = (current, target) => {
    const diff = Math.abs(current - target);
    if (diff <= 2) return "#4ade80";
    if (diff <= 5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#059669', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">💧 Humidity Control</h1>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={3} colsMd={1} gap={6}>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Humidity</p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{humidityData.overallHumidity}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Home average</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Target Range</p>
              <p className="text-4xl font-bold text-gray-800 dark:text-white">{humidityData.targetRange[0]}-{humidityData.targetRange[1]}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Optimal comfort zone</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">System Health</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{humidityData.systemHealth}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Equipment status</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Zone Humidity Controls */}
        <GlassGrid cols={2} colsMd={1} gap={6}>
          {humidityData.zones.map((zone) => (
            <GlassCard key={zone.zoneId} colors={{ primary: "emerald", secondary: "teal" }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{zone.zoneId}</h2>
                  <span className="text-2xl">{getTrendIcon(zone.trend)}</span>
                </div>

                {/* Humidity Level Display */}
                <div className="mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Humidity</p>
                      <p className="text-4xl font-bold" style={{ color: getTrendColor(zone.current, zone.target) }}>
                        {zone.current}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{zone.target}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 relative">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${zone.current}%`,
                        backgroundColor: getTrendColor(zone.current, zone.target)
                      }}
                    />
                  </div>
                </div>

                {/* Equipment Status */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-100 dark:bg-green-500/10 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Humidifier</p>
                    <p className="text-lg font-bold" style={{ color: zone.humidifierActive ? '#4ade80' : '#9ca3af' }}>
                      {zone.humidifierActive ? 'ACTIVE' : 'OFF'}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dehumidifier</p>
                    <p className="text-lg font-bold" style={{ color: zone.dehumidifierActive ? '#60a5fa' : '#9ca3af' }}>
                      {zone.dehumidifierActive ? 'ACTIVE' : 'OFF'}
                    </p>
                  </div>
                </div>

                {/* Water Level */}
                <div className="border-t border-emerald-200 dark:border-emerald-400/20 pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Water Level</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{zone.waterLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${zone.waterLevel}%`,
                        backgroundColor: zone.waterLevel > 30 ? '#60a5fa' : '#f59e0b'
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {zone.waterLevel < 30 ? 'Refill recommended' : 'Level healthy'}
                  </p>
                </div>

                {/* Trend */}
                <div className="border-t border-emerald-200 dark:border-emerald-400/20 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Trend:</span>
                    <span className="font-semibold text-gray-800 dark:text-white capitalize">{zone.trend}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </GlassGrid>

        {/* System Overview */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">
              Humidity Control Summary
            </h2>
            <GlassGrid cols={4} colsMd={2} gap={4}>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {humidityData.overallHumidity}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {humidityData.zones.filter(z => z.humidifierActive).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Humidifiers Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {humidityData.zones.filter(z => z.dehumidifierActive).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dehumidifiers Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {Math.round(humidityData.zones.reduce((sum, z) => sum + z.waterLevel, 0) / humidityData.zones.length)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Water Level</p>
              </div>
            </GlassGrid>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
