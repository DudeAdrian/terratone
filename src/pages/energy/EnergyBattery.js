import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useEnergyData } from "../../hooks/useApi";

export default function EnergyBattery() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [batteryState, setBatteryState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const energyData = useEnergyData("default");

  useEffect(() => {
    const loadData = () => {
      try {
        if (energyData.battery.data) {
          const payload = energyData.battery.data;
          const state = Array.isArray(payload) ? payload[0] : payload;
          setBatteryState(state);
          setError(null);
        } else if (!energyData.isLoading) {
          const energyService = sofieCore.getService("energy");
          if (energyService?.getBatteryState) {
            setBatteryState(energyService.getBatteryState());
          }
        }

        setLoading(energyData.isLoading);

        if (energyData.battery.error) {
          setError(energyData.battery.error.message || "Failed to load battery data");
        }
      } catch (err) {
        console.error("Error loading battery data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [energyData.battery.data, energyData.isLoading, energyData.battery.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full mr-3"></div>
            Loading battery data...
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
              onClick={() => energyData.battery.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!batteryState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No battery data available</div>
        </GlassCard>
      </div>
    );
  }

  const getModeColor = (mode) => {
    const colors = {
      charging: "#4ade80",
      discharging: "#f7c66b",
      idle: "#9ca3af"
    };
    return colors[mode] || "#9ca3af";
  };

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
              🔋 Battery Energy Storage
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Home battery state of charge, health, and runtime analytics
            </p>
          </div>
        </GlassSection>

        {/* Main Battery Card */}
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{batteryState.manufacturer}</h2>
              <span
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: `${getModeColor(batteryState.mode)}20`,
                  color: getModeColor(batteryState.mode),
                  border: `2px solid ${getModeColor(batteryState.mode)}40`
                }}
              >
                {batteryState.mode.toUpperCase()}
              </span>
            </div>

            {/* Charge Level Display */}
            <div className="mb-6">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">State of Charge</p>
                  <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">{batteryState.chargePercent}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stored Energy</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{(batteryState.currentCharge/1000).toFixed(1)}kWh</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">of {(batteryState.capacity/1000).toFixed(1)}kWh capacity</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-6 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{
                    width: `${batteryState.chargePercent}%`,
                    background: `linear-gradient(90deg, #4ade80, #f7c66b)`,
                  }}
                >
                  <span className="text-xs font-bold text-gray-900">{batteryState.chargePercent}%</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <GlassGrid cols={2} colsMd={4} gap={4}>
              <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Voltage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{batteryState.voltage}V</p>
              </div>
              <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current</p>
                <p className="text-2xl font-bold" style={{ color: batteryState.current >= 0 ? '#4ade80' : '#ef4444' }}>
                  {batteryState.current >= 0 ? '+' : ''}{batteryState.current}A
                </p>
              </div>
              <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Temperature</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{batteryState.temperature}°C</p>
              </div>
              <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Health</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{batteryState.health}%</p>
              </div>
            </GlassGrid>

            {/* Runtime Estimates */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time to Full Charge</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {batteryState.mode === 'charging' ? `${batteryState.timeToFull} min` : 'N/A'}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Runtime</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {batteryState.estimatedRuntime.toFixed(1)}h
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Battery Info Grid */}
        <GlassGrid cols={1} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Battery Lifecycle</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Charge Cycles</span>
                  <span className="text-gray-900 dark:text-white font-bold">{batteryState.cycleCount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(batteryState.cycleCount / 5000) * 100}%`,
                      backgroundColor: '#60a5fa'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Est. 5000 cycle lifespan</p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Battery Health</span>
                  <span className="text-gray-900 dark:text-white font-bold">{batteryState.health}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${batteryState.health}%`,
                      backgroundColor: '#4ade80'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Excellent condition</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Warranty Period</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{batteryState.warrantyYears} years</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Current Power Flow</h3>
              
              <div className="space-y-4">
                <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Mode</span>
                    <span 
                      className="font-bold text-lg"
                      style={{ color: getModeColor(batteryState.mode) }}
                    >
                      {batteryState.mode.charAt(0).toUpperCase() + batteryState.mode.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {batteryState.mode === 'charging' && 'Battery is storing excess energy'}
                    {batteryState.mode === 'discharging' && 'Battery is supplying power to loads'}
                    {batteryState.mode === 'idle' && 'Battery is on standby'}
                  </p>
                </div>

                <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Power</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {(Math.abs(batteryState.current * batteryState.voltage) / 1000).toFixed(2)}kW
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {batteryState.current >= 0 ? 'Charging at' : 'Discharging at'} {Math.abs(batteryState.current)}A
                  </p>
                </div>

                <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Efficiency</span>
                    <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">95%</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Round-trip energy efficiency</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* System Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {batteryState.chargePercent}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">State of Charge</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {(batteryState.capacity/1000).toFixed(1)}kWh
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Capacity</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {batteryState.health}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Battery Health</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {batteryState.cycleCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Charge Cycles</p>
            </div>
          </GlassCard>
        </GlassGrid>

      </div>
    </div>
  );
}
