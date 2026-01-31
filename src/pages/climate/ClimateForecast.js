import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useClimateData } from "../../hooks/useApi";

export default function ClimateForecast() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const climateData = useClimateData("default");

  useEffect(() => {
    const loadData = () => {
      try {
        if (climateData.weather.data) {
          const data = climateData.weather.data;
          setForecast(data);
          setError(null);
        } else if (!climateData.isLoading) {
          const climateService = sofieCore.getService("climate");
          if (climateService?.getOutdoorForecast) {
            setForecast(climateService.getOutdoorForecast());
          }
        }

        setLoading(climateData.isLoading);

        if (climateData.weather.error) {
          setError(climateData.weather.error.message || "Failed to load forecast data");
        }
      } catch (err) {
        console.error("Error loading forecast data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [climateData.weather.data, climateData.isLoading, climateData.weather.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full mr-3"></div>
            Loading forecast data...
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
              onClick={() => climateData.weather.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No forecast data available</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#059669', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">🌤️ Weather Forecast</h1>
          </div>
        </GlassSection>

        {/* Current Conditions */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">Current Conditions</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-6">
              <div>
                <p className="text-6xl font-bold text-gray-900 dark:text-white">{forecast.current.temperature}°C</p>
                <p className="text-xl text-gray-600 dark:text-gray-400">Feels like {forecast.current.feelsLike}°C</p>
                <p className="text-lg text-emerald-600 dark:text-emerald-400">{forecast.current.conditions}</p>
              </div>
              <div className="text-6xl">
                {forecast.current.conditions.includes("Sunny") ? "☀️" :
                 forecast.current.conditions.includes("Cloudy") ? "☁️" :
                 forecast.current.conditions.includes("Rain") ? "🌧️" : "🌤️"}
              </div>
            </div>

            <GlassGrid cols={4} colsMd={2} gap={4}>
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Humidity</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{forecast.current.humidity}%</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Wind</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{forecast.current.windSpeed}km/h</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{forecast.current.windDirection}</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pressure</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{forecast.current.pressure}mb</p>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">UV Index</p>
                  <p className="text-2xl font-bold" style={{ color: forecast.current.uvIndex < 3 ? '#4ade80' : '#f59e0b' }}>
                    {forecast.current.uvIndex}
                  </p>
                </div>
              </GlassCard>
            </GlassGrid>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{forecast.current.visibility}km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Dew Point:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{forecast.current.dewPoint}°C</span>
              </div>
            </div>
          </div>
        </GlassSection>

        {/* Alerts */}
        {forecast.alerts && forecast.alerts.length > 0 && (
          <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">⚠️ Weather Alerts</h2>
              <div className="space-y-3">
                {forecast.alerts.map((alert, idx) => (
                  <div key={idx} className="bg-amber-100 dark:bg-amber-500/10 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize mt-1">Severity: {alert.severity}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassSection>
        )}

        {/* Hourly Forecast */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">Hourly Forecast</h2>
            <GlassGrid cols={3} colsMd={2} gap={4}>
              {forecast.hourly.map((hour) => (
                <GlassCard key={hour.hour} colors={{ primary: "emerald", secondary: "teal" }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{hour.hour}:00</p>
                      <p className="text-3xl">
                        {hour.conditions.includes("Sunny") ? "☀️" :
                         hour.conditions.includes("Cloudy") && !hour.conditions.includes("Partly") ? "☁️" :
                         hour.conditions.includes("Rain") ? "🌧️" : "🌤️"}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{hour.temp}°C</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{hour.conditions}</p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Humidity: {hour.humidity}%</span>
                      <span 
                        className="font-semibold"
                        style={{ color: hour.precipitation > 50 ? '#60a5fa' : '#9ca3af' }}
                      >
                        Rain: {hour.precipitation}%
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Daily Forecast */}
        <GlassSection colors={{ primary: "emerald", secondary: "teal" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">5-Day Forecast</h2>
            <div className="space-y-3">
              {forecast.daily.map((day, idx) => (
                <GlassCard key={idx} colors={{ primary: "emerald", secondary: "teal" }}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="text-4xl">
                        {day.conditions.includes("Sunny") ? "☀️" :
                         day.conditions.includes("Cloudy") && !day.conditions.includes("Partly") ? "☁️" :
                         day.conditions.includes("Rain") ? "🌧️" : "🌤️"}
                      </p>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{day.day}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{day.conditions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3 mb-1">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">High</p>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{day.high}°C</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{day.low}°C</p>
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: day.precipitation > 50 ? '#60a5fa' : '#9ca3af' }}>
                        💧 {day.precipitation}% chance
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
