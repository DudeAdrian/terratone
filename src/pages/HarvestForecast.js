// src/pages/HarvestForecast.js - Glassmorphic Food Domain

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassButton, GlassSection, GlassContainer, GlassGrid } from "../theme/GlassmorphismTheme";
import { useFoodData } from "../hooks/useApi";

const HarvestForecast = () => {
  const { data: apiFoodData, loading, error, refetch } = useFoodData("default");
  const [forecastService, setForecastService] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedZone, setSelectedZone] = useState("temperate");
  const [globalStats, setGlobalStats] = useState(null);
  const [activeTab, setActiveTab] = useState("monthly");
  const [tradeOpportunities, setTradeOpportunities] = useState([]);

  useEffect(() => {
    const service = sofieCore.getService("harvestForecast");
    setForecastService(service);
    
    if (service) {
      setForecasts(service.getAllForecasts());
      setGlobalStats(service.getGlobalStats());
      setTradeOpportunities(service.getTradeOpportunities(selectedMonth));
    }
  }, [selectedMonth]);

  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  const zones = ["tropical", "subtropical", "temperate", "boreal", "arid"];

  const getZoneColor = (zone) => {
    const colors = {
      tropical: "text-red-600 dark:text-red-400",
      subtropical: "text-orange-600 dark:text-orange-400",
      temperate: "text-green-600 dark:text-green-400",
      boreal: "text-blue-600 dark:text-blue-400",
      arid: "text-yellow-600 dark:text-yellow-400",
    };
    return colors[zone] || "text-gray-600 dark:text-gray-400";
  };

  const getZoneBg = (zone) => {
    const colors = {
      tropical: "bg-red-50 dark:bg-red-950/30",
      subtropical: "bg-orange-50 dark:bg-orange-950/30",
      temperate: "bg-green-50 dark:bg-green-950/30",
      boreal: "bg-blue-50 dark:bg-blue-950/30",
      arid: "bg-yellow-50 dark:bg-yellow-950/30",
    };
    return colors[zone] || "bg-gray-50 dark:bg-gray-800/30";
  };

  const getNutritionStatus = (percentage) => {
    if (percentage >= 100) return { status: "✓ Met", color: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/50" };
    if (percentage >= 80) return { status: "⚠ Low", color: "text-yellow-700 dark:text-yellow-300", bg: "bg-yellow-100 dark:bg-yellow-900/50" };
    return { status: "✗ Deficit", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/50" };
  };

  const getYieldBar = (yield_val, max) => {
    return Math.min((yield_val / max) * 100, 100);
  };

  const currentForecast = forecasts.find(f => f.monthIndex === selectedMonth);
  const zoneForecast = currentForecast?.zoneForecasts.find(zf => zf.zone === selectedZone);
  const nutrition = forecastService?.getNutritionAnalysis(selectedMonth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-green-500 border-t-transparent rounded-full mr-3"></div>
            Loading harvest forecast...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Forecast</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-green-700 to-emerald-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!forecastService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading harvest forecast...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🌾 Global Harvest Forecast
            </h1>
            <p className="text-lg text-green-700 dark:text-green-200 max-w-2xl">
              12-month production planning across all climate zones for sustainable aquaponics
            </p>
          </div>
        </GlassSection>

        {/* Global Statistics */}
        {globalStats && (
          <GlassGrid cols={2} colsMd={4} gap={5}>
            <GlassCard colors={{ primary: "green", secondary: "green" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Annual Yield</div>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400">{globalStats.annualGlobalYield.toLocaleString()} kg</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">all zones combined</p>
              </div>
            </GlassCard>
            <GlassCard colors={{ primary: "blue", secondary: "blue" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Monthly Avg</div>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{globalStats.averageMonthlyYield.toLocaleString()} kg</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">monthly average</p>
              </div>
            </GlassCard>
            <GlassCard colors={{ primary: "orange", secondary: "orange" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Peak Month</div>
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{globalStats.peakMonth}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">{globalStats.peakYield} kg peak</p>
              </div>
            </GlassCard>
            <GlassCard colors={{ primary: "red", secondary: "red" }}>
              <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Low Month</div>
                <div className="text-4xl font-bold text-red-600 dark:text-red-400">{globalStats.lowMonth}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">{globalStats.lowYield} kg low</p>
              </div>
            </GlassCard>
          </GlassGrid>
        )}

        {/* Tabs */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }}>
          <div>
            <div className="flex flex-wrap border-b border-green-300/30 dark:border-green-700/30 backdrop-blur-sm">
              {["monthly", "nutrition", "zones", "opportunities"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-b from-green-400/40 to-green-300/20 dark:from-green-600/50 dark:to-green-700/30 text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400"
                      : "text-gray-700 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 hover:bg-green-200/10 dark:hover:bg-green-700/10"
                  }`}
                >
                  {tab === "zones" ? "by Zone" : tab === "opportunities" ? "Trade Opp." : tab}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Monthly Tab */}
              {activeTab === "monthly" && currentForecast && (
                <div>
                  <div className="mb-8">
                    <label className="block text-xl font-semibold text-gray-800 dark:text-white mb-6">Select Month:</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {months.map((month, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedMonth(idx + 1)}
                          className={`py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 ${
                            selectedMonth === idx + 1
                              ? "bg-gradient-to-b from-green-400/40 to-green-300/20 dark:from-green-600/50 dark:to-green-700/30 text-green-700 dark:text-green-300 border-2 border-green-500 dark:border-green-400"
                              : "bg-white/20 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-green-200/10 dark:hover:bg-green-700/10 border-2 border-transparent"
                          }`}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Monthly Overview */}
                    <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{currentForecast.month} Overview</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-3">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Global Production</span>
                              <span className="font-bold text-green-700 dark:text-green-400">{currentForecast.globalYield} kg</span>
                            </div>
                            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 h-full transition-all duration-300"
                                style={{ width: `${getYieldBar(currentForecast.globalYield, 300)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 mt-6">
                            <p className="text-base text-gray-700 dark:text-gray-300">
                              <strong>Climate Zones Active:</strong> {currentForecast.zoneForecasts.length}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {currentForecast.zoneForecasts.map(zf => (
                                <span 
                                  key={zf.zone}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium ${getZoneBg(zf.zone)} ${getZoneColor(zf.zone)}`}
                                >
                                  {zf.zone} ({zf.estimatedYield} kg)
                                </span>
                              ))}
                            </div>
                          </div>

                          {currentForecast.zoneForecasts.length > 0 && currentForecast.zoneForecasts[0].seasonalReminder && (
                            <div className="bg-blue-400/20 dark:bg-blue-700/30 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-lg text-base text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                              <strong>Seasonal Note:</strong> {currentForecast.zoneForecasts[0].seasonalReminder}
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>

                    {/* Zone Details */}
                    <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Zone Details</h3>
                        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Select Zone:</label>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {zones.map(zone => (
                            <button
                              key={zone}
                              onClick={() => setSelectedZone(zone)}
                              className={`py-3 px-3 rounded-lg text-base font-medium capitalize transition-all duration-200 ${
                                selectedZone === zone
                                  ? `${getZoneBg(zone)} ${getZoneColor(zone)} border-2 border-current shadow-md`
                                  : "bg-white/20 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-blue-200/10 dark:hover:bg-blue-700/10 border-2 border-transparent"
                              }`}
                            >
                              {zone}
                            </button>
                          ))}
                        </div>

                        {zoneForecast && (
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Yield</p>
                              <p className="text-4xl font-bold text-green-700 dark:text-green-400">{zoneForecast.estimatedYield} kg</p>
                            </div>
                            
                            {zoneForecast.crops && zoneForecast.crops.length > 0 && (
                              <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                                <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">Crops (Top 5)</p>
                                <div className="flex flex-wrap gap-2">
                                  {zoneForecast.crops.slice(0, 5).map((crop, idx) => (
                                    <span key={idx} className="bg-white/40 dark:bg-gray-700/40 px-3 py-1 rounded-lg text-sm border border-blue-200/50 dark:border-blue-700/50 text-gray-700 dark:text-gray-300">
                                      {typeof crop === 'string' ? crop : crop.name || crop.id}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {zoneForecast.waterNeeded && (
                              <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 text-base">
                                <p className="font-medium text-gray-700 dark:text-gray-300">Water Needs</p>
                                <p className="text-gray-700 dark:text-gray-300 mt-2">Fresh: <strong>{zoneForecast.waterNeeded.freshWater} L</strong> | Recycled: <strong>{zoneForecast.waterNeeded.recycledWater} L</strong></p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* Nutrition Tab */}
              {activeTab === "nutrition" && nutrition && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Nutrition Analysis for {months[selectedMonth - 1]}</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Calories */}
                    <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">🔥 Calories</h4>
                          <span className={`text-xs font-bold px-3 py-2 rounded-lg ${getNutritionStatus(nutrition.calories.percentage).bg} ${getNutritionStatus(nutrition.calories.percentage).color}`}>
                            {nutrition.calories.percentage}%
                          </span>
                        </div>
                        <div className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-4">{Math.round(nutrition.calories.actual)} / {nutrition.calories.target} kcal</div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden mb-4">
                          <div className="bg-gradient-to-r from-orange-400 to-amber-500 dark:from-orange-500 dark:to-amber-600 h-full rounded-full" style={{ width: `${Math.min(nutrition.calories.percentage, 100)}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{getNutritionStatus(nutrition.calories.percentage).status}</p>
                      </div>
                    </GlassCard>

                    {/* Protein */}
                    <GlassCard colors={{ primary: "red", secondary: "pink" }}>
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">💪 Protein</h4>
                          <span className={`text-xs font-bold px-3 py-2 rounded-lg ${getNutritionStatus(nutrition.protein.percentage).bg} ${getNutritionStatus(nutrition.protein.percentage).color}`}>
                            {nutrition.protein.percentage}%
                          </span>
                        </div>
                        <div className="text-4xl font-bold text-red-700 dark:text-red-400 mb-4">{Math.round(nutrition.protein.actual)}g / {nutrition.protein.target}g</div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden mb-4">
                          <div className="bg-gradient-to-r from-red-400 to-pink-500 dark:from-red-500 dark:to-pink-600 h-full rounded-full" style={{ width: `${Math.min(nutrition.protein.percentage, 100)}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{getNutritionStatus(nutrition.protein.percentage).status}</p>
                      </div>
                    </GlassCard>

                    {/* Fiber */}
                    <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold text-gray-800 dark:text-white">🌿 Fiber</h4>
                          <span className={`text-xs font-bold px-3 py-2 rounded-lg ${getNutritionStatus(nutrition.fiber.percentage).bg} ${getNutritionStatus(nutrition.fiber.percentage).color}`}>
                            {nutrition.fiber.percentage}%
                          </span>
                        </div>
                        <div className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">{Math.round(nutrition.fiber.actual)}g / {nutrition.fiber.target}g</div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden mb-4">
                          <div className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 h-full rounded-full" style={{ width: `${Math.min(nutrition.fiber.percentage, 100)}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{getNutritionStatus(nutrition.fiber.percentage).status}</p>
                      </div>
                    </GlassCard>

                    {/* Diversity Score */}
                    <GlassCard colors={{ primary: "purple", secondary: "indigo" }}>
                      <div className="p-8 md:col-span-2 lg:col-span-3">
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">🌈 Crop Diversity Score</h4>
                        <div className="flex items-center gap-6">
                          <div className="text-5xl font-bold text-purple-700 dark:text-purple-400">{nutrition.diversityScore}/100</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden mb-4">
                              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 dark:from-purple-500 dark:to-indigo-600 h-full rounded-full" style={{ width: `${nutrition.diversityScore}%` }}></div>
                            </div>
                            <p className="text-base text-gray-700 dark:text-gray-300">
                              {nutrition.diversityScore >= 80 ? "✓ Excellent crop variety!" : 
                               nutrition.diversityScore >= 60 ? "⚠ Good diversity, consider expanding" :
                               "✗ Limited variety - increase crop types"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* Zones Tab */}
              {activeTab === "zones" && currentForecast && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Production by Climate Zone - {months[selectedMonth - 1]}</h3>
                  
                  <div className="grid gap-6">
                    {currentForecast.zoneForecasts.map(zf => (
                      <div key={zf.zone} className={`${getZoneBg(zf.zone)} border-l-4 rounded-lg p-6 backdrop-blur-sm ${
                        zf.zone === 'tropical' ? 'border-red-500' : 
                        zf.zone === 'subtropical' ? 'border-orange-500' : 
                        zf.zone === 'temperate' ? 'border-green-500' : 
                        zf.zone === 'boreal' ? 'border-blue-500' : 
                        'border-yellow-500'
                      }`}>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className={`text-2xl font-bold capitalize ${getZoneColor(zf.zone)}`}>{zf.zone}</h4>
                            <p className="text-base text-gray-700 dark:text-gray-300 mt-2">Expected yield: {zf.estimatedYield} kg</p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-gray-800 dark:text-white">{zf.estimatedYield} kg</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">estimated</div>
                          </div>
                        </div>

                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4 mb-6 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              zf.zone === 'tropical' ? 'bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600' :
                              zf.zone === 'subtropical' ? 'bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600' :
                              zf.zone === 'temperate' ? 'bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-600' :
                              zf.zone === 'boreal' ? 'bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600' :
                              'bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600'
                            }`}
                            style={{ width: `${getYieldBar(zf.estimatedYield, 60)}%` }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {zf.crops && zf.crops.length > 0 && (
                            <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Crops</p>
                              <p className="text-lg font-bold text-gray-800 dark:text-white">{zf.crops.length} varieties</p>
                            </div>
                          )}
                          {zf.waterNeeded && (
                            <>
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Fresh Water</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{zf.waterNeeded.freshWater} L</p>
                              </div>
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Recycled</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{zf.waterNeeded.recycledWater} L</p>
                              </div>
                            </>
                          )}
                          {zf.nutritionContribution && (
                            <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Nutrition</p>
                              <p className="text-lg font-bold text-gray-800 dark:text-white">{zf.nutritionContribution.calories} kcal</p>
                            </div>
                          )}
                        </div>

                        {zf.seasonalReminder && (
                          <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mt-6 text-base text-gray-800 dark:text-gray-200">
                            💡 <strong>{zf.seasonalReminder}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trade Opportunities Tab */}
              {activeTab === "opportunities" && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Trade Opportunities - {months[selectedMonth - 1]}</h3>
                  
                  {tradeOpportunities.length === 0 ? (
                    <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                      <div className="p-8 text-center">
                        <p className="text-lg text-blue-700 dark:text-blue-300">✓ No significant trade opportunities this month</p>
                        <p className="text-base text-blue-600 dark:text-blue-400 mt-2">Production is balanced with local needs</p>
                      </div>
                    </GlassCard>
                  ) : (
                    <div className="grid gap-6">
                      {tradeOpportunities.map((opp, idx) => (
                        <div 
                          key={idx}
                          className={`border-l-4 rounded-lg p-6 backdrop-blur-sm ${
                            opp.type === 'surplus' ? 'bg-green-400/20 dark:bg-green-700/30 border-green-500 dark:border-green-400' :
                            opp.type === 'deficit' ? 'bg-red-400/20 dark:bg-red-700/30 border-red-500 dark:border-red-400' :
                            'bg-purple-400/20 dark:bg-purple-700/30 border-purple-500 dark:border-purple-400'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-xl text-gray-800 dark:text-white capitalize">
                                {opp.type === 'surplus' ? '📈' : opp.type === 'deficit' ? '📉' : '🌈'} {opp.type} - {opp.category}
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300 mt-2 text-base">{opp.recommendation}</p>
                            </div>
                            <span className={`text-xs font-bold px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                              opp.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                              opp.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' :
                              'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                            }`}>
                              {opp.priority}
                            </span>
                          </div>
                          {opp.amount > 0 && (
                            <div className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                              Amount: <strong>{opp.amount} kg</strong>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

export default HarvestForecast;
