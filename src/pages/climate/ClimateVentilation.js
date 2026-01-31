import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useClimateData } from "../../hooks/useApi";

export default function ClimateVentilation() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [ventilation, setVentilation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const climateData = useClimateData("default");

  useEffect(() => {
    const load = () => {
      try {
        if (climateData.hvac?.data) {
          setVentilation(climateData.hvac.data);
          setError(null);
        } else if (!climateData.isLoading) {
          const climateService = sofieCore.getService("climate");
          if (climateService?.getVentilationSystem) {
            setVentilation(climateService.getVentilationSystem());
          }
        }

        setLoading(climateData.isLoading);
        if (climateData.hvac?.error) {
          setError(climateData.hvac.error.message || "Failed to load ventilation data");
        }
      } catch (err) {
        console.error("Error loading ventilation data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    load();
  }, [climateData.hvac.data, climateData.isLoading, climateData.hvac.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full mr-3"></div>
            Loading ventilation data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "emerald" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => climateData.hvac.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!ventilation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No ventilation data available</div>
        </GlassCard>
      </div>
    );
  }

  const getModeColor = (mode) => {
    const colors = {
      auto: "#4ade80",
      boost: "#f59e0b",
      sleep: "#60a5fa",
      manual: "#9ca3af"
    };
    return colors[mode] || "#9ca3af";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#059669', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">🌬️ Ventilation System</h1>
          </div>
        </GlassSection>

        {/* System Status Summary */}
        <GlassGrid cols={4} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {ventilation.heatRecovery ?? 0}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Heat Recovery</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {ventilation.filterStatus?.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active Filters</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {(ventilation.fanSpeeds || []).filter(f => f.speed > 0).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Zones Active</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {Math.round(((ventilation.fanSpeeds || []).reduce((sum, f) => sum + (f.speed || 0), 0) / ((ventilation.fanSpeeds || []).length || 1)))}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Fan Speed</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* ERV Status */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-emerald-600 dark:text-emerald-400">
                  Energy Recovery Ventilator
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Heat/cool recovery with fresh air exchange</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold" style={{ color: getModeColor(ventilation.ervStatus?.mode) }}>
                  {ventilation.ervStatus?.efficiency ?? 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
              </div>
            </div>

            <GlassGrid cols={2} colsMd={1} gap={4} className="mb-6">
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Supply Temperature</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {ventilation.ervStatus?.supplyTemp ?? 0}°C
                  </p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Exhaust Temperature</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {ventilation.ervStatus?.exhaustTemp ?? 0}°C
                  </p>
                </div>
              </GlassCard>
            </GlassGrid>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                <span className="font-bold capitalize" style={{ color: getModeColor(ventilation.ervStatus?.mode) }}>
                  {ventilation.ervStatus?.mode || "auto"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-bold" style={{ color: ventilation.ervStatus?.isRunning ? '#4ade80' : '#9ca3af' }}>
                  {ventilation.ervStatus?.isRunning ? '✓ Running' : '✕ Off'}
                </span>
              </div>
            </div>
          </div>
        </GlassSection>

        {/* Filter Status */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">Filter Status</h2>
            <div className="space-y-4">
              {(ventilation.filterStatus || []).map((filter) => (
                <GlassCard key={filter.type} colors={{ primary: "emerald", secondary: "teal" }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white capitalize">{filter.type} Filter</h3>
                      <span className="text-sm font-semibold" style={{ color: filter.life > 50 ? '#4ade80' : filter.life > 25 ? '#f59e0b' : '#ef4444' }}>
                        {filter.life}% Life
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${filter.life}%`,
                          backgroundColor: filter.life > 50 ? '#4ade80' : filter.life > 25 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </GlassSection>

        {/* Fan Speeds by Zone */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">Zone Fan Speeds</h2>
            <GlassGrid cols={2} colsMd={1} gap={4}>
              {(ventilation.fanSpeeds || []).map((fan) => (
                <GlassCard key={fan.zone} colors={{ primary: "emerald", secondary: "teal" }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white">{fan.zone}</h3>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fan.speed}%</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${fan.speed}%`,
                          backgroundColor: '#059669'
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Min: {fan.minSpeed}%</span>
                      <span className="text-gray-600 dark:text-gray-400">Max: {fan.maxSpeed}%</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* System Summary */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">
              Ventilation System Overview
            </h2>
            <GlassGrid cols={4} colsMd={2} gap={4}>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {ventilation.heatRecovery}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Heat Recovery</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {ventilation.filterStatus.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active Filters</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {ventilation.fanSpeeds.filter(f => f.speed > 0).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Zones Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {Math.round(ventilation.fanSpeeds.reduce((sum, f) => sum + f.speed, 0) / ventilation.fanSpeeds.length)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Fan Speed</p>
              </div>
            </GlassGrid>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};
