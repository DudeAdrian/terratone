import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function EnergySolar() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading solar data...</div>
      </div>
    );
  }

  const totalCapacity = solarArrays.reduce((sum, a) => sum + a.capacity, 0);
  const totalOutput = solarArrays.reduce((sum, a) => sum + a.currentOutput, 0);
  const totalProduction = solarArrays.reduce((sum, a) => sum + a.todayProduction, 0);
  const avgEfficiency = Math.round(solarArrays.reduce((sum, a) => sum + a.efficiency, 0) / solarArrays.length);

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
          ☀️ Solar Array Performance
        </h1>
        <p className="text-gray-300">Real-time monitoring of photovoltaic panels and inverter systems</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Capacity</p>
          <p className="text-3xl font-bold" style={{ color: '#f7c66b' }}>{(totalCapacity/1000).toFixed(1)}kW</p>
          <p className="text-xs text-gray-500 mt-2">{solarArrays.reduce((sum, a) => sum + a.panelCount, 0)} panels</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Current Output</p>
          <p className="text-3xl font-bold text-white">{(totalOutput/1000).toFixed(2)}kW</p>
          <p className="text-xs text-gray-500 mt-2">{Math.round((totalOutput/totalCapacity)*100)}% of capacity</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Today's Production</p>
          <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>{totalProduction.toFixed(1)}kWh</p>
          <p className="text-xs text-gray-500 mt-2">Since sunrise</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Avg Efficiency</p>
          <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>{avgEfficiency}%</p>
          <p className="text-xs text-gray-500 mt-2">System-wide</p>
        </div>
      </div>

      {/* Array Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {solarArrays.map((array) => (
          <div
            key={array.arrayId}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
              border: '1px solid #f7c66b55',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#f7c66b' }}>{array.arrayId}</h2>
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

            <p className="text-sm text-gray-400 mb-4">{array.location}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Current Output</p>
                <p className="text-2xl font-bold text-white">{(array.currentOutput/1000).toFixed(2)}kW</p>
                <p className="text-xs text-gray-500">{array.capacity}W capacity</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Today's Total</p>
                <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{array.todayProduction}kWh</p>
                <p className="text-xs text-gray-500">{array.panelCount} panels</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Efficiency</p>
                <p className="text-2xl font-bold" style={{ color: '#f7c66b' }}>{array.efficiency}%</p>
                <p className="text-xs text-gray-500">Panel temp: {array.temperature}°C</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Voltage</p>
                <p className="text-2xl font-bold text-white">{array.voltage}V</p>
                <p className="text-xs text-gray-500">DC output</p>
              </div>
            </div>

            <div className="border-t border-orange-400/20 pt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Capacity Utilization</span>
                <span className="text-white font-semibold">
                  {Math.round((array.currentOutput/array.capacity)*100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.round((array.currentOutput/array.capacity)*100)}%`,
                    backgroundColor: '#f7c66b'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Overview */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>
          System Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{solarArrays.length}</p>
            <p className="text-sm text-gray-400">Active Arrays</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#f7c66b' }}>
              {solarArrays.reduce((sum, a) => sum + a.panelCount, 0)}
            </p>
            <p className="text-sm text-gray-400">Total Panels</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {solarArrays.filter(a => a.inverterStatus === "online").length}
            </p>
            <p className="text-sm text-gray-400">Inverters Online</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {Math.round(solarArrays.reduce((sum, a) => sum + a.temperature, 0) / solarArrays.length)}°C
            </p>
            <p className="text-sm text-gray-400">Avg Temperature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
