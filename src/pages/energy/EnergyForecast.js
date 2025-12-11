import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function EnergyForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const energyService = sofieCore.getService("energy");
      if (energyService && energyService.getEnergyForecast) {
        const data = energyService.getEnergyForecast();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading forecast data...</div>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No forecast data available</div>
      </div>
    );
  }

  const getTariffColor = (tariff) => {
    const colors = {
      peak: "#ef4444",
      shoulder: "#f59e0b",
      "off-peak": "#4ade80"
    };
    return colors[tariff] || "#9ca3af";
  };

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
          📈 Energy Forecast & Pricing
        </h1>
        <p className="text-gray-300">AI-powered predictions for optimal energy scheduling and cost savings</p>
      </div>

      {/* Today vs Tomorrow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>Today's Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Solar Production</span>
              <span className="text-2xl font-bold" style={{ color: '#4ade80' }}>
                {forecast.todayTotal.production}kWh
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Consumption</span>
              <span className="text-2xl font-bold text-white">
                {forecast.todayTotal.consumption}kWh
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Grid Cost</span>
              <span 
                className="text-2xl font-bold"
                style={{ color: forecast.todayTotal.gridCost <= 0 ? '#4ade80' : '#ef4444' }}
              >
                ${Math.abs(forecast.todayTotal.gridCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: '#60a5fa' }}>Tomorrow's Estimate</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Solar Production</span>
              <span className="text-2xl font-bold" style={{ color: '#4ade80' }}>
                {forecast.tomorrowEstimate.production}kWh
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Consumption</span>
              <span className="text-2xl font-bold text-white">
                {forecast.tomorrowEstimate.consumption}kWh
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Grid Cost</span>
              <span 
                className="text-2xl font-bold"
                style={{ color: forecast.tomorrowEstimate.gridCost <= 0 ? '#4ade80' : '#ef4444' }}
              >
                ${forecast.tomorrowEstimate.gridCost >= 0 ? '' : '-'}${Math.abs(forecast.tomorrowEstimate.gridCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Impact */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
          border: '1px solid #4ade8055',
        }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: '#4ade80' }}>☀️ Weather Impact</h2>
        <p className="text-white text-lg">{forecast.weatherImpact}</p>
      </div>

      {/* Hourly Forecast */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>Next 6 Hours Forecast</h2>
        <div className="space-y-3">
          {forecast.nextHours.map((hour) => (
            <div key={hour.hour} className="bg-orange-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-white">{hour.hour}:00</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-1"
                    style={{
                      backgroundColor: `${getTariffColor(hour.tariff)}20`,
                      color: getTariffColor(hour.tariff),
                      border: `1px solid ${getTariffColor(hour.tariff)}40`
                    }}
                  >
                    {hour.tariff.toUpperCase()} - ${hour.price}/kWh
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Net Balance</p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: hour.netEstimate >= 0 ? '#4ade80' : '#ef4444' }}
                  >
                    {hour.netEstimate >= 0 ? '+' : ''}{hour.netEstimate}kWh
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Solar</p>
                  <p className="text-lg font-semibold" style={{ color: '#4ade80' }}>
                    {hour.solarEstimate}kWh
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Demand</p>
                  <p className="text-lg font-semibold text-white">{hour.demandEstimate}kWh</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Net</p>
                  <p 
                    className="text-lg font-semibold"
                    style={{ color: hour.netEstimate >= 0 ? '#4ade80' : '#ef4444' }}
                  >
                    {hour.netEstimate >= 0 ? '+' : ''}{hour.netEstimate}kWh
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>💡 Smart Recommendations</h2>
        <div className="space-y-3">
          {forecast.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-orange-500/10 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white mb-1">{rec.action}</p>
                <p className="text-sm text-gray-400">Scheduled for {rec.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Potential Savings</p>
                <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>
                  ${rec.savings.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-orange-400/20 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-lg">Total Potential Savings</span>
            <span className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              ${forecast.recommendations.reduce((sum, r) => sum + r.savings, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
