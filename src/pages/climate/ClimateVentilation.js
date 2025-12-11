import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function ClimateVentilation() {
  const [ventilation, setVentilation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const climateService = sofieCore.getService("climate");
      if (climateService && climateService.getVentilationSystem) {
        const data = climateService.getVentilationSystem();
        setVentilation(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading ventilation data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading ventilation data...</div>
      </div>
    );
  }

  if (!ventilation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No ventilation data available</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #5dd0b122, rgba(210, 175, 135, 0.12))',
        border: '1px solid #5dd0b166',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #5dd0b155, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#5dd0b1' }}>
          🌀 Ventilation Control System
        </h1>
        <p className="text-gray-300">Energy recovery ventilator and smart airflow management</p>
      </div>

      {/* ERV Status */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#5dd0b1' }}>
              Energy Recovery Ventilator
            </h2>
            <p className="text-gray-400">Heat/cool recovery with fresh air exchange</p>
          </div>
          <span
            className="px-4 py-2 rounded-full text-sm font-bold"
            style={{
              backgroundColor: ventilation.ervStatus === "active" ? '#4ade8020' : '#9ca3af20',
              color: ventilation.ervStatus === "active" ? '#4ade80' : '#9ca3af',
              border: ventilation.ervStatus === "active" ? '2px solid #4ade8040' : '2px solid #9ca3af40'
            }}
          >
            {ventilation.ervStatus.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Heat Recovery</p>
            <p className="text-3xl font-bold" style={{ color: '#5dd0b1' }}>{ventilation.heatRecovery}%</p>
            <p className="text-xs text-gray-500">Efficiency</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Air Changes</p>
            <p className="text-3xl font-bold text-white">{ventilation.exchangeRate}</p>
            <p className="text-xs text-gray-500">per hour</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Temp Delta</p>
            <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>{ventilation.indoorOutdoorDelta}°C</p>
            <p className="text-xs text-gray-500">Indoor/Outdoor</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Energy Today</p>
            <p className="text-3xl font-bold" style={{ color: '#f7c66b' }}>{ventilation.energyUsage}kWh</p>
            <p className="text-xs text-gray-500">Consumption</p>
          </div>
        </div>

        <div className="border-t border-green-400/20 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Bypass Damper:</span>
            <span className="text-white font-semibold capitalize">{ventilation.bypassDamper}</span>
          </div>
        </div>
      </div>

      {/* Filter Status */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>Filter Status & Maintenance</h2>
        
        <div className="space-y-4">
          {ventilation.filterStatus.map((filter, idx) => (
            <div key={idx} className="bg-green-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-white">{filter.location}</p>
                  <p className="text-sm text-gray-400">{filter.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ 
                    color: filter.lifeRemaining > 50 ? '#4ade80' : filter.lifeRemaining > 25 ? '#f59e0b' : '#ef4444'
                  }}>
                    {filter.lifeRemaining}%
                  </p>
                  <p className="text-xs text-gray-400">Life Remaining</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Filter Efficiency</span>
                  <span className="text-white font-semibold">{filter.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${filter.efficiency}%`,
                      backgroundColor: '#5dd0b1'
                    }}
                  />
                </div>
              </div>

              <div className="border-t border-green-400/20 pt-2 flex justify-between text-sm">
                <span className="text-gray-400">Last Changed:</span>
                <span className="text-white font-semibold">
                  {new Date(filter.lastChanged).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fan Speeds by Zone */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>Zone Ventilation Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ventilation.fanSpeeds.map((fan, idx) => (
            <div key={idx} className="bg-green-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">{fan.zone}</h3>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getModeColor(fan.mode)}20`,
                    color: getModeColor(fan.mode),
                    border: `1px solid ${getModeColor(fan.mode)}40`
                  }}
                >
                  {fan.mode.toUpperCase()}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Fan Speed</span>
                  <span className="text-white font-semibold">{fan.speed}%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${fan.speed}%`,
                      backgroundColor: getModeColor(fan.mode)
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full" style={{ 
                  backgroundColor: fan.speed > 0 ? '#4ade80' : '#9ca3af'
                }}/>
                <span className="text-xs text-gray-400">
                  {fan.speed > 0 ? 'Actively ventilating' : 'Standby'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Summary */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>
          Ventilation System Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#5dd0b1' }}>
              {ventilation.heatRecovery}%
            </p>
            <p className="text-sm text-gray-400">Heat Recovery</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {ventilation.filterStatus.length}
            </p>
            <p className="text-sm text-gray-400">Active Filters</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {ventilation.fanSpeeds.filter(f => f.speed > 0).length}
            </p>
            <p className="text-sm text-gray-400">Zones Active</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#f7c66b' }}>
              {Math.round(ventilation.fanSpeeds.reduce((sum, f) => sum + f.speed, 0) / ventilation.fanSpeeds.length)}%
            </p>
            <p className="text-sm text-gray-400">Avg Fan Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
