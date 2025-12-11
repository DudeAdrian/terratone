import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";

export default function EnergyForecast() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading forecast data...</div>
        </GlassCard>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No forecast data available</div>
        </GlassCard>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={() => navigate("/", { state: { activeRing: ringData.activeRing } })}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#b45309'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              📈 Energy Forecast & Pricing
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              AI-powered predictions for optimal energy scheduling and cost savings
            </p>
          </div>
        </GlassSection>

        {/* Today vs Tomorrow */}
        <GlassGrid cols={1} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="flex flex-col min-h-[160px]">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Today's Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Solar Production</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {forecast.todayTotal.production}kWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Consumption</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {forecast.todayTotal.consumption}kWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Grid Cost</span>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: forecast.todayTotal.gridCost <= 0 ? '#4ade80' : '#ef4444' }}
                  >
                    ${Math.abs(forecast.todayTotal.gridCost).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "sky" }}>
            <div className="flex flex-col min-h-[160px]">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tomorrow's Estimate</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Solar Production</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {forecast.tomorrowEstimate.production}kWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Consumption</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {forecast.tomorrowEstimate.consumption}kWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Grid Cost</span>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: forecast.tomorrowEstimate.gridCost <= 0 ? '#4ade80' : '#ef4444' }}
                  >
                    ${forecast.tomorrowEstimate.gridCost >= 0 ? '' : '-'}${Math.abs(forecast.tomorrowEstimate.gridCost).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Weather Impact */}
        <GlassSection colors={{ primary: "emerald", secondary: "green" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">☀️ Weather Impact</h2>
            <p className="text-lg text-gray-900 dark:text-white">{forecast.weatherImpact}</p>
          </div>
        </GlassSection>

        {/* Hourly Forecast */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Next 6 Hours Forecast</h2>
            <div className="space-y-3">
              {forecast.nextHours.map((hour) => (
                <div key={hour.hour} className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{hour.hour}:00</p>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
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
                      <p className="text-xs text-gray-600 dark:text-gray-400">Solar</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        {hour.solarEstimate}kWh
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Demand</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{hour.demandEstimate}kWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Net</p>
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
        </GlassSection>

        {/* Recommendations */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">💡 Smart Recommendations</h2>
            <div className="space-y-3 mb-6">
              {forecast.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">{rec.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled for {rec.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Potential Savings</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${rec.savings.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Potential Savings</span>
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${forecast.recommendations.reduce((sum, r) => sum + r.savings, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </GlassSection>

      </div>
    </div>
  );
}
