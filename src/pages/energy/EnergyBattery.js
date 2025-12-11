import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function EnergyBattery() {
  const [batteryState, setBatteryState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const energyService = sofieCore.getService("energy");
      if (energyService && energyService.getBatteryState) {
        const state = energyService.getBatteryState();
        setBatteryState(state);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading battery data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading battery data...</div>
      </div>
    );
  }

  if (!batteryState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No battery data available</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #f7c66b22, rgba(210, 175, 135, 0.12))',
        border: '1px solid #f7c66b66',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #f7c66b55, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f7c66b' }}>
          🔋 Battery Energy Storage
        </h1>
        <p className="text-gray-300">Home battery state of charge, health, and runtime analytics</p>
      </div>

      {/* Main Battery Card */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{batteryState.manufacturer}</h2>
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
              <p className="text-sm text-gray-400">State of Charge</p>
              <p className="text-5xl font-bold" style={{ color: '#f7c66b' }}>{batteryState.chargePercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Stored Energy</p>
              <p className="text-3xl font-bold text-white">{(batteryState.currentCharge/1000).toFixed(1)}kWh</p>
              <p className="text-xs text-gray-500">of {(batteryState.capacity/1000).toFixed(1)}kWh capacity</p>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-6 relative overflow-hidden">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Voltage</p>
            <p className="text-2xl font-bold text-white">{batteryState.voltage}V</p>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Current</p>
            <p className="text-2xl font-bold" style={{ color: batteryState.current >= 0 ? '#4ade80' : '#ef4444' }}>
              {batteryState.current >= 0 ? '+' : ''}{batteryState.current}A
            </p>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Temperature</p>
            <p className="text-2xl font-bold text-white">{batteryState.temperature}°C</p>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Health</p>
            <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{batteryState.health}%</p>
          </div>
        </div>

        {/* Runtime Estimates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-t border-orange-400/20 pt-4">
            <p className="text-sm text-gray-400 mb-2">Time to Full Charge</p>
            <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>
              {batteryState.mode === 'charging' ? `${batteryState.timeToFull} min` : 'N/A'}
            </p>
          </div>
          <div className="border-t border-orange-400/20 pt-4">
            <p className="text-sm text-gray-400 mb-2">Estimated Runtime</p>
            <p className="text-2xl font-bold" style={{ color: '#f7c66b' }}>
              {batteryState.estimatedRuntime.toFixed(1)}h
            </p>
          </div>
        </div>
      </div>

      {/* Battery Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cycle Count & Warranty */}
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>Battery Lifecycle</h3>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Charge Cycles</span>
              <span className="text-white font-bold">{batteryState.cycleCount}</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(batteryState.cycleCount / 5000) * 100}%`,
                  backgroundColor: '#60a5fa'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Est. 5000 cycle lifespan</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Battery Health</span>
              <span className="text-white font-bold">{batteryState.health}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${batteryState.health}%`,
                  backgroundColor: '#4ade80'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Excellent condition</p>
          </div>

          <div className="border-t border-orange-400/20 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Warranty Period</span>
              <span className="text-white font-semibold">{batteryState.warrantyYears} years</span>
            </div>
          </div>
        </div>

        {/* Power Flow */}
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>Current Power Flow</h3>
          
          <div className="space-y-4">
            <div className="bg-orange-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Mode</span>
                <span 
                  className="font-bold text-lg"
                  style={{ color: getModeColor(batteryState.mode) }}
                >
                  {batteryState.mode.charAt(0).toUpperCase() + batteryState.mode.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {batteryState.mode === 'charging' && 'Battery is storing excess energy'}
                {batteryState.mode === 'discharging' && 'Battery is supplying power to loads'}
                {batteryState.mode === 'idle' && 'Battery is on standby'}
              </p>
            </div>

            <div className="bg-orange-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Power</span>
                <span className="font-bold text-lg text-white">
                  {(Math.abs(batteryState.current * batteryState.voltage) / 1000).toFixed(2)}kW
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {batteryState.current >= 0 ? 'Charging at' : 'Discharging at'} {Math.abs(batteryState.current)}A
              </p>
            </div>

            <div className="bg-orange-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Efficiency</span>
                <span className="font-bold text-lg" style={{ color: '#4ade80' }}>95%</span>
              </div>
              <p className="text-xs text-gray-500">Round-trip energy efficiency</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>
          System Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#f7c66b' }}>
              {batteryState.chargePercent}%
            </p>
            <p className="text-sm text-gray-400">State of Charge</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {(batteryState.capacity/1000).toFixed(1)}kWh
            </p>
            <p className="text-sm text-gray-400">Total Capacity</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {batteryState.health}%
            </p>
            <p className="text-sm text-gray-400">Battery Health</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {batteryState.cycleCount}
            </p>
            <p className="text-sm text-gray-400">Charge Cycles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
