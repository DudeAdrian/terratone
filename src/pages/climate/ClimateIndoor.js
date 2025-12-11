import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function ClimateIndoor() {
  const [indoorClimate, setIndoorClimate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const climateService = sofieCore.getService("climate");
      if (climateService && climateService.getIndoorClimate) {
        const data = climateService.getIndoorClimate();
        setIndoorClimate(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading indoor climate data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading climate data...</div>
      </div>
    );
  }

  if (!indoorClimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No climate data available</div>
      </div>
    );
  }

  const getHvacModeColor = (mode) => {
    const colors = {
      heat: "#ef4444",
      cool: "#60a5fa",
      auto: "#4ade80"
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
          🏠 Indoor Climate Control
        </h1>
        <p className="text-gray-300">Multi-zone HVAC monitoring and comfort optimization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
            border: '1px solid #5dd0b155',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Overall Comfort</p>
          <p className="text-4xl font-bold" style={{ color: '#5dd0b1' }}>{indoorClimate.overallComfort}%</p>
          <p className="text-xs text-gray-500 mt-2">All zones average</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Active Zones</p>
          <p className="text-4xl font-bold text-white">{indoorClimate.zones.length}</p>
          <p className="text-xs text-gray-500 mt-2">Climate controlled</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">System Status</p>
          <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
            {indoorClimate.systemStatus.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 mt-2">All systems operational</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Energy Today</p>
          <p className="text-4xl font-bold" style={{ color: '#f7c66b' }}>{indoorClimate.totalEnergyUse}kWh</p>
          <p className="text-xs text-gray-500 mt-2">HVAC consumption</p>
        </div>
      </div>

      {/* Zone Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indoorClimate.zones.map((zone) => (
          <div
            key={zone.zoneId}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
              border: '1px solid #5dd0b155',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#5dd0b1' }}>{zone.zoneId}</h2>
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getHvacModeColor(zone.hvacMode)}20`,
                    color: getHvacModeColor(zone.hvacMode),
                    border: `1px solid ${getHvacModeColor(zone.hvacMode)}40`
                  }}
                >
                  {zone.hvacMode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Temperature Display */}
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-400">Current Temperature</p>
                  <p className="text-4xl font-bold text-white">{zone.currentTemp}°C</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Target</p>
                  <p className="text-2xl font-bold" style={{ color: '#5dd0b1' }}>{zone.targetTemp}°C</p>
                </div>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((zone.currentTemp / 30) * 100, 100)}%`,
                    backgroundColor: zone.currentTemp < zone.targetTemp ? '#60a5fa' : '#ef4444'
                  }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Humidity</p>
                <p className="text-2xl font-bold text-white">{zone.humidity}%</p>
                <p className="text-xs text-gray-500">Target: {zone.targetHumidity}%</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">CO₂ Level</p>
                <p className="text-2xl font-bold" style={{ color: zone.co2 < 1000 ? '#4ade80' : '#f59e0b' }}>
                  {zone.co2}ppm
                </p>
                <p className="text-xs text-gray-500">{"<1000 good"}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">VOC</p>
                <p className="text-2xl font-bold text-white">{zone.voc}ppb</p>
                <p className="text-xs text-gray-500">Volatile compounds</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Occupancy</p>
                <p className="text-2xl font-bold" style={{ color: '#5dd0b1' }}>{zone.occupancy}</p>
                <p className="text-xs text-gray-500">People present</p>
              </div>
            </div>

            {/* Comfort & Fan Speed */}
            <div className="border-t border-green-400/20 pt-3 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Comfort Level</span>
                  <span className="text-white font-semibold">{zone.comfort}%</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${zone.comfort}%`,
                      backgroundColor: '#5dd0b1'
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fan Speed:</span>
                <span className="text-white font-semibold capitalize">{zone.fanSpeed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Energy Today:</span>
                <span className="text-white font-semibold">{zone.energyUse}kWh</span>
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
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>
          Climate Control Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {(indoorClimate.zones.reduce((sum, z) => sum + z.currentTemp, 0) / indoorClimate.zones.length).toFixed(1)}°C
            </p>
            <p className="text-sm text-gray-400">Avg Temperature</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#5dd0b1' }}>
              {Math.round(indoorClimate.zones.reduce((sum, z) => sum + z.humidity, 0) / indoorClimate.zones.length)}%
            </p>
            <p className="text-sm text-gray-400">Avg Humidity</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
              {Math.round(indoorClimate.zones.reduce((sum, z) => sum + z.co2, 0) / indoorClimate.zones.length)}
            </p>
            <p className="text-sm text-gray-400">Avg CO₂ (ppm)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {indoorClimate.zones.reduce((sum, z) => sum + z.occupancy, 0)}
            </p>
            <p className="text-sm text-gray-400">Total Occupants</p>
          </div>
        </div>
      </div>
    </div>
  );
}
