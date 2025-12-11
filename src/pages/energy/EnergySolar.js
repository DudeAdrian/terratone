import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function EnergySolar() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [solarArrays, setSolarArrays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const energyService = sofieCore.getService("energy");
      if (energyService && energyService.getSolarArrays) {
        const arrays = energyService.getSolarArrays();
        setSolarArrays(arrays);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading solar data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading solar data...</div>
        </GlassCard>
      </div>
    );
  }

  const totalCapacity = solarArrays.reduce((sum, a) => sum + a.capacity, 0);
  const totalOutput = solarArrays.reduce((sum, a) => sum + a.currentOutput, 0);
  const totalProduction = solarArrays.reduce((sum, a) => sum + a.todayProduction, 0);
  const avgEfficiency = Math.round(solarArrays.reduce((sum, a) => sum + a.efficiency, 0) / solarArrays.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#b45309'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              ☀️ Solar Array Performance
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Real-time monitoring of photovoltaic panels and inverter systems
            </p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={1} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Capacity</div>
              <div className="text-5xl font-bold text-amber-600 dark:text-amber-400">{(totalCapacity/1000).toFixed(1)}kW</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">{solarArrays.reduce((sum, a) => sum + a.panelCount, 0)} panels</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Current Output</div>
              <div className="text-5xl font-bold text-orange-600 dark:text-orange-400">{(totalOutput/1000).toFixed(2)}kW</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">{Math.round((totalOutput/totalCapacity)*100)}% of capacity</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Today's Production</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{totalProduction.toFixed(1)}kWh</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Since sunrise</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Avg Efficiency</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{avgEfficiency}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">System-wide</p>
            </div>
          </GlassCard>
        </GlassGrid>

      {/* Array Details */}
      <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Array Performance Details
          </h2>
          <GlassGrid cols={1} colsMd={2} gap={6}>
            {solarArrays.map((array) => (
              <GlassCard key={array.arrayId}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{array.arrayId}</h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: array.inverterStatus === "online" ? '#4ade8020' : '#ef444420',
                      color: array.inverterStatus === "online" ? '#4ade80' : '#ef4444',
                      border: array.inverterStatus === "online" ? '1px solid #4ade8040' : '1px solid #ef444440'
                    }}
                  >
                    {array.inverterStatus.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{array.location}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-500/10 dark:bg-amber-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current Output</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{(array.currentOutput/1000).toFixed(2)}kW</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{array.capacity}W capacity</p>
                  </div>
                  <div className="bg-green-500/10 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Today's Total</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{array.todayProduction}kWh</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{array.panelCount} panels</p>
                  </div>
                  <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Efficiency</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{array.efficiency}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Panel temp: {array.temperature}°C</p>
                  </div>
                  <div className="bg-purple-500/10 dark:bg-purple-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Voltage</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{array.voltage}V</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">DC output</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600 dark:text-gray-400">Capacity Utilization</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {Math.round((array.currentOutput/array.capacity)*100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.round((array.currentOutput/array.capacity)*100)}%`,
                        backgroundColor: '#b45309'
                      }}
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </GlassGrid>
        </div>
      </GlassSection>

      {/* System Overview */}
      <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            System Performance Summary
          </h2>
          <GlassGrid cols={2} colsMd={4} gap={5}>
            <GlassCard>
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-gray-900 dark:text-white">{solarArrays.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Active Arrays</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                  {solarArrays.reduce((sum, a) => sum + a.panelCount, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Total Panels</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                  {solarArrays.filter(a => a.inverterStatus === "online").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Inverters Online</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-gray-900 dark:text-white">
                  {Math.round(solarArrays.reduce((sum, a) => sum + a.temperature, 0) / solarArrays.length)}°C
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Avg Temperature</p>
              </div>
            </GlassCard>
          </GlassGrid>
        </div>
      </GlassSection>
      </div>
    </div>
  );
}
