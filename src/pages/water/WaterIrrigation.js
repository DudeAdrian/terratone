import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useWaterData } from "../../hooks/useApi";

export default function WaterIrrigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [irrigationZones, setIrrigationZones] = useState([]);
  const [irrigationEvents, setIrrigationEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const waterData = useWaterData("default");

  useEffect(() => {
    const loadData = () => {
      try {
        if (waterData.irrigation.data) {
          const payload = waterData.irrigation.data;
          const zones = Array.isArray(payload)
            ? payload
            : payload.zones || payload.irrigationZones || [];
          const events = Array.isArray(payload)
            ? []
            : payload.events || payload.irrigationEvents || [];

          setIrrigationZones(zones);
          if (events.length) {
            setIrrigationEvents(events);
          }
          setError(null);
        } else if (!waterData.irrigation.isLoading) {
          const waterService = sofieCore.getService("water");
          if (waterService) {
            if (waterService.getIrrigationZones) {
              setIrrigationZones(waterService.getIrrigationZones());
            }
            if (waterService.getIrrigationEvents) {
              setIrrigationEvents(waterService.getIrrigationEvents());
            }
          }
        }

        setLoading(waterData.irrigation.isLoading);

        if (waterData.irrigation.error) {
          setError(waterData.irrigation.error.message || "Failed to load irrigation data");
        }
      } catch (err) {
        console.error("Error loading irrigation data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [waterData.irrigation.data, waterData.irrigation.isLoading, waterData.irrigation.error]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full mr-3"></div>
            Loading irrigation data...
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
              onClick={() => waterData.irrigation.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const totalAllotment = irrigationZones.reduce((sum, z) => sum + (z?.dailyAllotment || 0), 0);
  const totalArea = irrigationZones.reduce((sum, z) => sum + (z?.areaSqm || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#06b6d4'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              🌱 Irrigation Planning
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Smart water management for optimal crop growth and resource efficiency
            </p>
          </div>
        </GlassSection>

        {/* Summary Stats */}
        <GlassGrid cols={1} colsMd={3} gap={6}>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Daily Allotment</p>
              <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{totalAllotment}L</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Across all zones</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cultivation Area</p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white">{totalArea}m²</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{irrigationZones.length} active zones</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Water Efficiency</p>
              <p className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">
                {(totalAllotment / totalArea).toFixed(1)}L/m²
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Daily per square meter</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Irrigation Zones */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Irrigation Zones
            </h2>
            <GlassGrid cols={1} colsMd={2} gap={6}>
              {irrigationZones.map((zone) => {
                const nextEvent = new Date(zone.nextIrrigation);
                const lastEvent = new Date(zone.lastIrrigation);
                const timeUntilNext = Math.round((nextEvent - new Date()) / (1000 * 60 * 60));
                
                return (
                  <GlassCard key={zone.zoneId}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{zone.zoneId}</h3>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Crop Type</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{zone.crop}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Area</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{zone.areaSqm}m²</p>
                      </div>
                      <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Daily Water</p>
                        <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{zone.dailyAllotment}L</p>
                      </div>
                      <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ET Rate</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{zone.etRate} mm/day</p>
                      </div>
                      <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target Moisture</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{zone.targetMoisture}%</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Soil Type:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{zone.soilType}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{zone.schedule}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Next irrigation:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {timeUntilNext > 0 ? `in ${timeUntilNext}h` : "Due now"}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Recent Events */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Recent Irrigation Events
            </h2>
            <div className="space-y-3">
              {irrigationEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">{event.zoneId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.durationMin} minutes • {event.volume}L delivered
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
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
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Weather override</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassSection>

      </div>
    </div>
  );
}
