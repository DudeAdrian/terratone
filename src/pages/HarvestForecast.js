// src/pages/HarvestForecast.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const HarvestForecast = () => {
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
      tropical: "text-red-600",
      subtropical: "text-orange-600",
      temperate: "text-green-600",
      boreal: "text-blue-600",
      arid: "text-yellow-600",
    };
    return colors[zone] || "text-gray-600";
  };

  const getZoneBg = (zone) => {
    const colors = {
      tropical: "bg-red-50",
      subtropical: "bg-orange-50",
      temperate: "bg-green-50",
      boreal: "bg-blue-50",
      arid: "bg-yellow-50",
    };
    return colors[zone] || "bg-gray-50";
  };

  const getNutritionStatus = (percentage) => {
    if (percentage >= 100) return { status: "✓ Met", color: "text-green-700", bg: "bg-green-100" };
    if (percentage >= 80) return { status: "⚠ Low", color: "text-yellow-700", bg: "bg-yellow-100" };
    return { status: "✗ Deficit", color: "text-red-700", bg: "bg-red-100" };
  };

  const getYieldBar = (yield_val, max) => {
    return Math.min((yield_val / max) * 100, 100);
  };

  const currentForecast = forecasts.find(f => f.monthIndex === selectedMonth);
  const zoneForecast = currentForecast?.zoneForecasts.find(zf => zf.zone === selectedZone);
  const nutrition = forecastService?.getNutritionAnalysis(selectedMonth);

  if (!forecastService) {
    return <div className="text-center py-12"><p className="text-gray-500">Loading harvest forecast...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-lime-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🌾 Global Harvest Forecast</h1>
        <p className="text-green-100">
          12-month production planning across all climate zones for sustainable aquaponics
        </p>
      </div>

      {/* Global Statistics */}
      {globalStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
            <div className="text-sm text-gray-600">Annual Yield</div>
            <div className="text-2xl font-bold text-green-700">{globalStats.annualGlobalYield.toLocaleString()} kg</div>
            <p className="text-xs text-gray-500 mt-1">all zones combined</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600">Monthly Avg</div>
            <div className="text-2xl font-bold text-blue-700">{globalStats.averageMonthlyYield.toLocaleString()} kg</div>
            <p className="text-xs text-gray-500 mt-1">monthly average</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-600">
            <div className="text-sm text-gray-600">Peak Month</div>
            <div className="text-2xl font-bold text-orange-700">{globalStats.peakMonth}</div>
            <p className="text-xs text-gray-500 mt-1">{globalStats.peakYield} kg peak</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
            <div className="text-sm text-gray-600">Low Month</div>
            <div className="text-2xl font-bold text-red-700">{globalStats.lowMonth}</div>
            <p className="text-xs text-gray-500 mt-1">{globalStats.lowYield} kg low</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b">
          {["monthly", "nutrition", "zones", "opportunities"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                activeTab === tab
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab === "zones" ? "by Zone" : tab === "opportunities" ? "Trade Opp." : tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Monthly Tab */}
          {activeTab === "monthly" && currentForecast && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Month:</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {months.map((month, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMonth(idx + 1)}
                      className={`py-2 px-3 rounded font-medium text-sm transition ${
                        selectedMonth === idx + 1
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Overview */}
                <div className="bg-gradient-to-br from-green-50 to-lime-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-4">{currentForecast.month} Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">Global Production</span>
                        <span className="font-bold text-green-700">{currentForecast.globalYield} kg</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-lime-500 h-full transition-all duration-300"
                          style={{ width: `${getYieldBar(currentForecast.globalYield, 300)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 mt-4">
                      <p className="text-sm text-gray-600">
                        <strong>Climate Zones Active:</strong> {currentForecast.zoneForecasts.length}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentForecast.zoneForecasts.map(zf => (
                          <span 
                            key={zf.zone}
                            className={`px-2 py-1 rounded text-xs font-medium ${getZoneBg(zf.zone)} ${getZoneColor(zf.zone)}`}
                          >
                            {zf.zone} ({zf.estimatedYield} kg)
                          </span>
                        ))}
                      </div>
                    </div>

                    {currentForecast.zoneForecasts.length > 0 && currentForecast.zoneForecasts[0].seasonalReminder && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-700 rounded">
                        <strong>Seasonal Note:</strong> {currentForecast.zoneForecasts[0].seasonalReminder}
                      </div>
                    )}
                  </div>
                </div>

                {/* Zone Details */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Zone Details</h3>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Zone:</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {zones.map(zone => (
                      <button
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`py-2 px-2 rounded text-sm font-medium capitalize transition ${
                          selectedZone === zone
                            ? `${getZoneBg(zone)} ${getZoneColor(zone)}`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>

                  {zoneForecast && (
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Estimated Yield</p>
                        <p className="text-2xl font-bold text-green-700">{zoneForecast.estimatedYield} kg</p>
                      </div>
                      
                      {zoneForecast.crops && zoneForecast.crops.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Crops (Top 5)</p>
                          <div className="space-y-1">
                            {zoneForecast.crops.slice(0, 5).map((crop, idx) => (
                              <span key={idx} className="inline-block bg-white px-2 py-1 rounded text-xs mr-2 mb-1 border border-gray-200">
                                {typeof crop === 'string' ? crop : crop.name || crop.id}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {zoneForecast.waterNeeded && (
                        <div className="bg-white rounded p-2 text-xs">
                          <p className="font-medium text-gray-700">Water Needs</p>
                          <p className="text-gray-600">Fresh: {zoneForecast.waterNeeded.freshWater} L | Recycled: {zoneForecast.waterNeeded.recycledWater} L</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === "nutrition" && nutrition && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nutrition Analysis for {months[selectedMonth - 1]}</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Calories */}
                <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">🔥 Calories</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getNutritionStatus(nutrition.calories.percentage).bg} ${getNutritionStatus(nutrition.calories.percentage).color}`}>
                      {nutrition.calories.percentage}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700 mb-2">{Math.round(nutrition.calories.actual)} / {nutrition.calories.target} kcal</div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(nutrition.calories.percentage, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{getNutritionStatus(nutrition.calories.percentage).status}</p>
                </div>

                {/* Protein */}
                <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-pink-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">💪 Protein</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getNutritionStatus(nutrition.protein.percentage).bg} ${getNutritionStatus(nutrition.protein.percentage).color}`}>
                      {nutrition.protein.percentage}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 mb-2">{Math.round(nutrition.protein.actual)}g / {nutrition.protein.target}g</div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(nutrition.protein.percentage, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{getNutritionStatus(nutrition.protein.percentage).status}</p>
                </div>

                {/* Fiber */}
                <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">🌿 Fiber</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getNutritionStatus(nutrition.fiber.percentage).bg} ${getNutritionStatus(nutrition.fiber.percentage).color}`}>
                      {nutrition.fiber.percentage}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mb-2">{Math.round(nutrition.fiber.actual)}g / {nutrition.fiber.target}g</div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(nutrition.fiber.percentage, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{getNutritionStatus(nutrition.fiber.percentage).status}</p>
                </div>

                {/* Diversity Score */}
                <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-indigo-50 md:col-span-2 lg:col-span-3">
                  <h4 className="font-bold text-gray-800 mb-2">🌈 Crop Diversity Score</h4>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-purple-700 mr-4">{nutrition.diversityScore}/100</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full" style={{ width: `${nutrition.diversityScore}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {nutrition.diversityScore >= 80 ? "Excellent crop variety!" : 
                         nutrition.diversityScore >= 60 ? "Good diversity, consider expanding" :
                         "Limited variety - increase crop types"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zones Tab */}
          {activeTab === "zones" && currentForecast && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Production by Climate Zone - {months[selectedMonth - 1]}</h3>
              
              <div className="grid gap-4">
                {currentForecast.zoneForecasts.map(zf => (
                  <div key={zf.zone} className={`${getZoneBg(zf.zone)} border-l-4 border-${zf.zone === 'tropical' ? 'red' : zf.zone === 'subtropical' ? 'orange' : zf.zone === 'temperate' ? 'green' : zf.zone === 'boreal' ? 'blue' : 'yellow'}-500 p-4 rounded-lg`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className={`text-lg font-bold capitalize ${getZoneColor(zf.zone)}`}>{zf.zone}</h4>
                        <p className="text-sm text-gray-600">Expected yield: {zf.estimatedYield} kg</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{zf.estimatedYield} kg</div>
                        <div className="text-xs text-gray-500">estimated</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-300 rounded-full h-3 mb-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          zf.zone === 'tropical' ? 'bg-red-500' :
                          zf.zone === 'subtropical' ? 'bg-orange-500' :
                          zf.zone === 'temperate' ? 'bg-green-500' :
                          zf.zone === 'boreal' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${getYieldBar(zf.estimatedYield, 60)}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {zf.crops && zf.crops.length > 0 && (
                        <div>
                          <p className="font-semibold text-gray-700">Crops</p>
                          <p className="text-gray-600">{zf.crops.length} varieties</p>
                        </div>
                      )}
                      {zf.waterNeeded && (
                        <>
                          <div>
                            <p className="font-semibold text-gray-700">Fresh Water</p>
                            <p className="text-gray-600">{zf.waterNeeded.freshWater} L</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Recycled</p>
                            <p className="text-gray-600">{zf.waterNeeded.recycledWater} L</p>
                          </div>
                        </>
                      )}
                      {zf.nutritionContribution && (
                        <div>
                          <p className="font-semibold text-gray-700">Nutrition</p>
                          <p className="text-gray-600">{zf.nutritionContribution.calories} kcal</p>
                        </div>
                      )}
                    </div>

                    {zf.seasonalReminder && (
                      <div className="bg-white bg-opacity-50 rounded p-2 mt-3 text-xs italic text-gray-700">
                        💡 {zf.seasonalReminder}
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trade Opportunities - {months[selectedMonth - 1]}</h3>
              
              {tradeOpportunities.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-700">✓ No significant trade opportunities this month</p>
                  <p className="text-sm text-blue-600 mt-2">Production is balanced with local needs</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tradeOpportunities.map((opp, idx) => (
                    <div 
                      key={idx}
                      className={`border-l-4 rounded-lg p-4 ${
                        opp.type === 'surplus' ? 'bg-green-50 border-green-500' :
                        opp.type === 'deficit' ? 'bg-red-50 border-red-500' :
                        'bg-purple-50 border-purple-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg capitalize">
                            {opp.type === 'surplus' ? '📈' : opp.type === 'deficit' ? '📉' : '🌈'} {opp.type} - {opp.category}
                          </h4>
                          <p className="text-gray-700 mt-1">{opp.recommendation}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded capitalize ${
                          opp.priority === 'high' ? 'bg-red-100 text-red-800' :
                          opp.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {opp.priority}
                        </span>
                      </div>
                      {opp.amount > 0 && (
                        <div className="mt-2 text-sm font-semibold text-gray-700">
                          Amount: {opp.amount} kg
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
    </div>
  );
};

export default HarvestForecast;
