import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function ClimateForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const climateService = sofieCore.getService("climate");
      if (climateService && climateService.getOutdoorForecast) {
        const data = climateService.getOutdoorForecast();
        setForecast(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading forecast data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading forecast data...</div>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No forecast data available</div>
      </div>
    );
  }

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
          🌤️ Outdoor Weather Forecast
        </h1>
        <p className="text-gray-300">Hyperlocal weather predictions and climate patterns</p>
      </div>

      {/* Current Conditions */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#5dd0b1' }}>Current Conditions</h2>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-6xl font-bold text-white">{forecast.current.temperature}°C</p>
            <p className="text-xl text-gray-400">Feels like {forecast.current.feelsLike}°C</p>
            <p className="text-lg" style={{ color: '#5dd0b1' }}>{forecast.current.conditions}</p>
          </div>
          <div className="text-6xl">
            {forecast.current.conditions.includes("Sunny") ? "☀️" :
             forecast.current.conditions.includes("Cloudy") ? "☁️" :
             forecast.current.conditions.includes("Rain") ? "🌧️" : "🌤️"}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Humidity</p>
            <p className="text-2xl font-bold text-white">{forecast.current.humidity}%</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Wind</p>
            <p className="text-2xl font-bold" style={{ color: '#5dd0b1' }}>{forecast.current.windSpeed}km/h</p>
            <p className="text-xs text-gray-500">{forecast.current.windDirection}</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Pressure</p>
            <p className="text-2xl font-bold text-white">{forecast.current.pressure}mb</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">UV Index</p>
            <p className="text-2xl font-bold" style={{ color: forecast.current.uvIndex < 3 ? '#4ade80' : '#f59e0b' }}>
              {forecast.current.uvIndex}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Visibility:</span>
            <span className="text-white font-semibold">{forecast.current.visibility}km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Dew Point:</span>
            <span className="text-white font-semibold">{forecast.current.dewPoint}°C</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {forecast.alerts && forecast.alerts.length > 0 && (
        <div
          className="mb-6"
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f59e0b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f59e0b55',
          }}
        >
          <h2 className="text-xl font-bold mb-3" style={{ color: '#f59e0b' }}>⚠️ Weather Alerts</h2>
          {forecast.alerts.map((alert, idx) => (
            <div key={idx} className="bg-orange-500/10 rounded-lg p-3 mb-2">
              <p className="text-white font-semibold">{alert.message}</p>
              <p className="text-xs text-gray-400 capitalize">Severity: {alert.severity}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hourly Forecast */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>Hourly Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {forecast.hourly.map((hour) => (
            <div key={hour.hour} className="bg-green-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-white">{hour.hour}:00</p>
                <p className="text-3xl">
                  {hour.conditions.includes("Sunny") ? "☀️" :
                   hour.conditions.includes("Cloudy") && !hour.conditions.includes("Partly") ? "☁️" :
                   hour.conditions.includes("Rain") ? "🌧️" : "🌤️"}
                </p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#5dd0b1' }}>{hour.temp}°C</p>
              <p className="text-sm text-gray-400">{hour.conditions}</p>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-gray-500">Humidity: {hour.humidity}%</span>
                <span 
                  className="font-semibold"
                  style={{ color: hour.precipitation > 50 ? '#60a5fa' : '#9ca3af' }}
                >
                  Rain: {hour.precipitation}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>5-Day Forecast</h2>
        <div className="space-y-3">
          {forecast.daily.map((day, idx) => (
            <div key={idx} className="bg-green-500/10 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-4xl">
                  {day.conditions.includes("Sunny") ? "☀️" :
                   day.conditions.includes("Cloudy") && !day.conditions.includes("Partly") ? "☁️" :
                   day.conditions.includes("Rain") ? "🌧️" : "🌤️"}
                </p>
                <div>
                  <p className="text-lg font-bold text-white">{day.day}</p>
                  <p className="text-sm text-gray-400">{day.conditions}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3 mb-1">
                  <div>
                    <p className="text-xs text-gray-400">High</p>
                    <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{day.high}°C</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Low</p>
                    <p className="text-2xl font-bold" style={{ color: '#60a5fa' }}>{day.low}°C</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: day.precipitation > 50 ? '#60a5fa' : '#9ca3af' }}>
                  💧 {day.precipitation}% chance
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
