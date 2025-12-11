import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function ClimateIndoor() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading indoor climate data...</div>
        </GlassCard>
      </div>
    );
  }

  if (!indoorClimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No indoor climate data available</div>
        </GlassCard>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#059669'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              🏠 Indoor Climate Control
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Multi-zone HVAC monitoring and comfort optimization
            </p>
          </div>
        </GlassSection>

        <GlassGrid cols={2} colsMd={4} gap={6}>
          {indoorClimate.zones.map((zone) => (
            <GlassCard key={zone.zoneId} colors={{ primary: "emerald", secondary: "teal" }}>
              <div className="flex flex-col items-center justify-center min-h-[140px]">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{zone.zoneId}</p>
                <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{zone.currentTemp}°C</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Target: {zone.targetTemp}°C</p>
              </div>
            </GlassCard>
          ))}
        </GlassGrid>

        <GlassSection colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Climate Summary
            </h2>
            <GlassGrid cols={2} colsMd={4} gap={4}>
              <GlassCard>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {(indoorClimate.zones.reduce((sum, z) => sum + z.currentTemp, 0) / indoorClimate.zones.length).toFixed(1)}°C
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Temperature</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(indoorClimate.zones.reduce((sum, z) => sum + z.humidity, 0) / indoorClimate.zones.length)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Humidity</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "blue", secondary: "sky" }}>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(indoorClimate.zones.reduce((sum, z) => sum + z.co2, 0) / indoorClimate.zones.length)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg CO₂ (ppm)</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {indoorClimate.zones.reduce((sum, z) => sum + z.occupancy, 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Occupants</p>
                </div>
              </GlassCard>
            </GlassGrid>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
