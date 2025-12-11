import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function ClimateAir() {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const climateService = sofieCore.getService("climate");
      if (climateService && climateService.getAirQuality) {
        const data = climateService.getAirQuality();
        setAirQuality(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading air quality data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading air quality data...</div>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No air quality data available</div>
      </div>
    );
  }

  const getRatingColor = (rating) => {
    const colors = {
      Excellent: "#4ade80",
      Good: "#5dd0b1",
      Moderate: "#f59e0b",
      Poor: "#ef4444",
      "Very Poor": "#dc2626"
    };
    return colors[rating] || "#9ca3af";
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "#4ade80";
    if (aqi <= 100) return "#5dd0b1";
    if (aqi <= 150) return "#f59e0b";
    if (aqi <= 200) return "#ef4444";
    return "#dc2626";
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
          🌬️ Air Quality Monitoring
        </h1>
        <p className="text-gray-300">Real-time indoor and outdoor air quality sensors and analysis</p>
      </div>

      {/* Outdoor Air Quality */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#5dd0b1' }}>Outdoor Air Quality</h2>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-6xl font-bold" style={{ color: getAqiColor(airQuality.outdoor.aqi) }}>
              {airQuality.outdoor.aqi}
            </p>
            <p className="text-xl" style={{ color: getRatingColor(airQuality.outdoor.rating) }}>
              {airQuality.outdoor.rating}
            </p>
            <p className="text-sm text-gray-400 mt-2">Source: {airQuality.outdoor.source}</p>
          </div>
          <div className="text-6xl">🌍</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">PM2.5</p>
            <p className="text-2xl font-bold text-white">{airQuality.outdoor.pm25}</p>
            <p className="text-xs text-gray-500">µg/m³</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">PM10</p>
            <p className="text-2xl font-bold text-white">{airQuality.outdoor.pm10}</p>
            <p className="text-xs text-gray-500">µg/m³</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Ozone</p>
            <p className="text-2xl font-bold" style={{ color: '#60a5fa' }}>{airQuality.outdoor.o3}</p>
            <p className="text-xs text-gray-500">ppb</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">NO₂</p>
            <p className="text-2xl font-bold text-white">{airQuality.outdoor.no2}</p>
            <p className="text-xs text-gray-500">ppb</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex justify-between text-sm bg-green-500/10 rounded-lg p-2">
            <span className="text-gray-400">SO₂:</span>
            <span className="text-white font-semibold">{airQuality.outdoor.so2} ppb</span>
          </div>
          <div className="flex justify-between text-sm bg-green-500/10 rounded-lg p-2">
            <span className="text-gray-400">CO:</span>
            <span className="text-white font-semibold">{airQuality.outdoor.co} ppm</span>
          </div>
        </div>
      </div>

      {/* Indoor Air Quality */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>Indoor Air Quality by Zone</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {airQuality.indoor.map((zone) => (
            <div
              key={zone.location}
              className="bg-green-500/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{zone.location}</h3>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getRatingColor(zone.rating)}20`,
                    color: getRatingColor(zone.rating),
                    border: `1px solid ${getRatingColor(zone.rating)}40`
                  }}
                >
                  {zone.rating}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Air Quality Index</span>
                  <span className="text-white font-bold">{zone.aqi}</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((zone.aqi / 200) * 100, 100)}%`,
                      backgroundColor: getAqiColor(zone.aqi)
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-400">PM2.5</p>
                  <p className="text-lg font-semibold" style={{ color: '#5dd0b1' }}>{zone.pm25}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">PM10</p>
                  <p className="text-lg font-semibold" style={{ color: '#5dd0b1' }}>{zone.pm10}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">CO₂</p>
                  <p className="text-lg font-semibold text-white">{zone.co2}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">VOC:</span>
                  <span className="text-white font-semibold">{zone.voc} ppb</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">NO₂:</span>
                  <span className="text-white font-semibold">{zone.no2} ppb</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Updated: {new Date(zone.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Air Quality Comparison */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #5dd0b118, rgba(210, 175, 135, 0.10))',
          border: '1px solid #5dd0b155',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#5dd0b1' }}>
          Indoor vs Outdoor Comparison
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Indoor Avg AQI</p>
            <p className="text-3xl font-bold" style={{ 
              color: getAqiColor(Math.round(airQuality.indoor.reduce((sum, z) => sum + z.aqi, 0) / airQuality.indoor.length))
            }}>
              {Math.round(airQuality.indoor.reduce((sum, z) => sum + z.aqi, 0) / airQuality.indoor.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Outdoor AQI</p>
            <p className="text-3xl font-bold" style={{ color: getAqiColor(airQuality.outdoor.aqi) }}>
              {airQuality.outdoor.aqi}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Best Zone</p>
            <p className="text-xl font-bold" style={{ color: '#4ade80' }}>
              {airQuality.indoor.reduce((min, z) => z.aqi < min.aqi ? z : min).location}
            </p>
            <p className="text-sm text-gray-500">AQI: {airQuality.indoor.reduce((min, z) => z.aqi < min.aqi ? z : min).aqi}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Filtration</p>
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>ACTIVE</p>
            <p className="text-sm text-gray-500">All zones</p>
          </div>
        </div>
      </div>
    </div>
  );
}
