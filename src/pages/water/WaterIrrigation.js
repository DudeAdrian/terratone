import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function WaterIrrigation() {
  const [irrigationZones, setIrrigationZones] = useState([]);
  const [irrigationEvents, setIrrigationEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const waterService = sofieCore.getService("water");
      if (waterService) {
        if (waterService.getIrrigationZones) {
          setIrrigationZones(waterService.getIrrigationZones());
        }
        if (waterService.getIrrigationEvents) {
          setIrrigationEvents(waterService.getIrrigationEvents());
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading irrigation data:", error);
      setLoading(false);
    }
  }, []);

  const getSourceColor = (source) => {
    const colors = {
      rain: "#60a5fa",
      "rain/grey": "#4ade80",
      recycled: "#22d3ee",
      municipal: "#9ca3af"
    };
    return colors[source] || "#9ca3af";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading irrigation data...</div>
      </div>
    );
  }

  const totalAllotment = irrigationZones.reduce((sum, z) => sum + z.dailyAllotment, 0);
  const totalArea = irrigationZones.reduce((sum, z) => sum + z.areaSqm, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #46c6ff22, rgba(210, 175, 135, 0.12))',
        border: '1px solid #46c6ff66',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #46c6ff55, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#46c6ff' }}>
          🌱 Irrigation Planning
        </h1>
        <p className="text-gray-300">Smart water management for optimal crop growth and resource efficiency</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Daily Allotment</p>
          <p className="text-4xl font-bold" style={{ color: '#4ade80' }}>{totalAllotment}L</p>
          <p className="text-xs text-gray-500 mt-2">Across all zones</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #46c6ff55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Cultivation Area</p>
          <p className="text-4xl font-bold text-white">{totalArea}m²</p>
          <p className="text-xs text-gray-500 mt-2">{irrigationZones.length} active zones</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #22d3ee18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #22d3ee55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Water Efficiency</p>
          <p className="text-4xl font-bold" style={{ color: '#22d3ee' }}>
            {(totalAllotment / totalArea).toFixed(1)}L/m²
          </p>
          <p className="text-xs text-gray-500 mt-2">Daily per square meter</p>
        </div>
      </div>

      {/* Irrigation Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {irrigationZones.map((zone) => {
          const nextEvent = new Date(zone.nextIrrigation);
          const lastEvent = new Date(zone.lastIrrigation);
          const timeUntilNext = Math.round((nextEvent - new Date()) / (1000 * 60 * 60));
          
          return (
            <div
              key={zone.zoneId}
              style={{
                ...glassPanel,
                background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
                border: '1px solid #46c6ff55',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{zone.zoneId}</h2>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getSourceColor(zone.source)}20`,
                    color: getSourceColor(zone.source),
                    border: `1px solid ${getSourceColor(zone.source)}40`
                  }}
                >
                  {zone.source}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400">Crop Type</p>
                <p className="text-lg font-semibold" style={{ color: '#4ade80' }}>{zone.crop}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Area</p>
                  <p className="text-xl font-bold text-white">{zone.areaSqm}m²</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Daily Water</p>
                  <p className="text-xl font-bold" style={{ color: '#46c6ff' }}>{zone.dailyAllotment}L</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">ET Rate</p>
                  <p className="text-xl font-bold text-white">{zone.etRate} mm/day</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Target Moisture</p>
                  <p className="text-xl font-bold text-white">{zone.targetMoisture}%</p>
                </div>
              </div>

              <div className="border-t border-blue-400/20 pt-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Soil Type:</span>
                  <span className="text-white font-semibold">{zone.soilType}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Schedule:</span>
                  <span className="text-white font-semibold">{zone.schedule}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Next irrigation:</span>
                  <span className="text-green-400 font-semibold">
                    {timeUntilNext > 0 ? `in ${timeUntilNext}h` : "Due now"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Recent Irrigation Events
        </h2>
        <div className="space-y-3">
          {irrigationEvents.map((event) => (
            <div
              key={event.id}
              className="bg-blue-500/10 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white mb-1">{event.zoneId}</p>
                <p className="text-sm text-gray-400">
                  {event.durationMin} minutes • {event.volume}L delivered
                </p>
                <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getSourceColor(event.source)}20`,
                    color: getSourceColor(event.source),
                    border: `1px solid ${getSourceColor(event.source)}40`
                  }}
                >
                  {event.source}
                </span>
                {event.weatherOverride && (
                  <p className="text-xs text-yellow-400 mt-2">Weather override</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
