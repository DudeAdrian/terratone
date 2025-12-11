import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useClimateData } from "../../hooks/useApi";

export default function ClimateAir() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const climateData = useClimateData("default");

  useEffect(() => {
    const load = () => {
      try {
        if (climateData.monitoring?.data) {
          setAirQuality(climateData.monitoring.data);
          setError(null);
        } else if (!climateData.isLoading) {
          const climateService = sofieCore.getService("climate");
          if (climateService?.getAirQuality) {
            setAirQuality(climateService.getAirQuality());
          }
        }

        setLoading(climateData.isLoading);
        if (climateData.monitoring?.error) {
          setError(climateData.monitoring.error.message || "Failed to load air quality data");
        }
      } catch (err) {
        console.error("Error loading air quality data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    load();
  }, [climateData.monitoring.data, climateData.isLoading, climateData.monitoring.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full mr-3"></div>
            Loading air quality data...
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
              onClick={() => climateData.monitoring.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No air quality data available</div>
        </GlassCard>
      </div>
    );
  }

  const getRatingColor = (rating) => {
    const colors = {
      Excellent: "#4ade80",
      Good: "#10b981",
      Moderate: "#f59e0b",
      Poor: "#ef4444",
      "Very Poor": "#dc2626"
    };
    return colors[rating] || "#9ca3af";
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "emerald";
    if (aqi <= 100) return "teal";
    if (aqi <= 150) return "amber";
    if (aqi <= 200) return "red";
    return "rose";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
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
              🌬️ Air Quality Monitoring
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Real-time indoor and outdoor air quality sensors and analysis
            </p>
          </div>
        </GlassSection>

        {/* Outdoor vs Indoor Summary */}
        <GlassGrid cols={1} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Outdoor AQI</p>
              <p className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                {airQuality.outdoor?.aqi ?? 0}
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {airQuality.outdoor?.rating || 'Good'}
              </p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Indoor Avg AQI</p>
              <p className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                {Math.round(((airQuality.indoor || []).reduce((sum, z) => sum + (z.aqi || 0), 0) / ((airQuality.indoor || []).length || 1)))}
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {(airQuality.indoor || []).reduce((min, z) => (z.aqi || 999) < (min.aqi || 999) ? z : min, {}).rating || 'Good'}
              </p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Outdoor Air Quality Details */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Outdoor Air Quality
            </h2>
            <GlassGrid cols={2} colsMd={4} gap={4}>
              <GlassCard>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">PM2.5</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{airQuality.outdoor?.pm25 ?? 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">µg/m³</p>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">PM10</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{airQuality.outdoor?.pm10 ?? 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">µg/m³</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "blue", secondary: "sky" }}>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ozone</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{airQuality.outdoor?.o3 ?? 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">ppb</p>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">NO₂</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{airQuality.outdoor?.no2 ?? 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">ppb</p>
                </div>
              </GlassCard>
            </GlassGrid>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 dark:bg-emerald-900/20 rounded-lg p-4">
                <span className="text-gray-600 dark:text-gray-400">SO₂:</span>
                <span className="text-gray-900 dark:text-white font-semibold ml-2">{airQuality.outdoor?.so2 ?? 0} ppb</span>
              </div>
              <div className="bg-emerald-500/10 dark:bg-emerald-900/20 rounded-lg p-4">
                <span className="text-gray-600 dark:text-gray-400">CO:</span>
                <span className="text-gray-900 dark:text-white font-semibold ml-2">{airQuality.outdoor?.co ?? 0} ppm</span>
              </div>
            </div>
          </div>
        </GlassSection>

        {/* Indoor Air Quality by Zone */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Indoor Air Quality by Zone
            </h2>
            <GlassGrid cols={1} colsMd={2} gap={6}>
              {(airQuality.indoor || []).map((zone) => (
                <GlassCard key={zone.location}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{zone.location}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        {zone.rating}
                      </span>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">AQI: {zone.aqi}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{
                            width: `${Math.min((zone.aqi / 200) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    <GlassGrid cols={3} gap={3} className="mb-4">
                      <div className="bg-emerald-500/10 dark:bg-emerald-900/20 rounded p-2 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">PM2.5</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{zone.pm25}</p>
                      </div>
                      <div className="bg-teal-500/10 dark:bg-teal-900/20 rounded p-2 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">PM10</p>
                        <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{zone.pm10}</p>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded p-2 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">CO₂</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{zone.co2}</p>
                      </div>
                    </GlassGrid>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <span className="text-gray-600 dark:text-gray-400">VOC:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{zone.voc} ppb</span>
                      </div>
                      <div className="flex justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <span className="text-gray-600 dark:text-gray-400">NO₂:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{zone.no2} ppb</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                      Updated: {new Date(zone.lastUpdated).toLocaleTimeString()}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Comparison Summary */}
        <GlassGrid cols={2} colsMd={4} gap={6}>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(airQuality.indoor.reduce((sum, z) => sum + z.aqi, 0) / airQuality.indoor.length)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Indoor Avg</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {airQuality.outdoor.aqi}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Outdoor</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {airQuality.indoor.reduce((min, z) => z.aqi < min.aqi ? z : min).location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Best Zone</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">ACTIVE</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Filtration</p>
            </div>
          </GlassCard>
        </GlassGrid>

      </div>
    </div>
  );
}
