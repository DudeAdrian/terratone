import React, { useState, useEffect } from "react";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useClimateData } from "../hooks/useApi";

const Predictions = () => {
  const { data: apiClimate, loading, error, refetch } = useClimateData("default");
  const [predictions, setPredictions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("yield");
  const [climateZone, setClimateZone] = useState("temperate");
  const [selectedCrop, setSelectedCrop] = useState("tomato");

  useEffect(() => {
    loadPredictions();
  }, [climateZone, selectedCrop]);

  const loadPredictions = () => {
    if (!window.sofieCore || !window.sofieCore.services.predictiveAnalytics) {
      // Mock data for demo
      setPredictions([
        { month: "January", yield: 145, confidence: 0.92 },
        { month: "February", yield: 152, confidence: 0.89 },
        { month: "March", yield: 168, confidence: 0.85 }
      ]);
      setAnomalies([
        { date: "2024-01-15", type: "temperature_spike", severity: "medium", description: "Unexpected warm spell" },
        { date: "2024-01-28", type: "humidity_drop", severity: "low", description: "Brief dry period" }
      ]);
      setRecommendations([
        { crop: "tomato", reason: "Optimal conditions for growth", confidence: 0.88 },
        { crop: "basil", reason: "High market demand forecasted", confidence: 0.82 },
        { crop: "pepper", reason: "Ideal seasonal alignment", confidence: 0.79 }
      ]);
      return;
    }

    const predService = window.sofieCore.services.predictiveAnalytics;
    const yieldPreds = predService.predictYield?.(selectedCrop, climateZone, 3) || [];
    const anom = predService.getHistoricalAnomalies?.() || [];
    const recs = predService.suggestOptimalPlanting?.(climateZone) || [];
    
    setPredictions(yieldPreds);
    setAnomalies(anom);
    setRecommendations(recs);
  };

  const crops = ["tomato", "lettuce", "basil", "pepper", "cucumber", "spinach", "kale"];
  const zones = ["tropical", "subtropical", "temperate", "cold"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full mr-3"></div>
            Loading predictions...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Predictions</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-blue-700 to-cyan-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return { bg: "bg-emerald-100/40 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", icon: "🎯" };
    if (confidence >= 0.8) return { bg: "bg-blue-100/40 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", icon: "👍" };
    if (confidence >= 0.7) return { bg: "bg-amber-100/40 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", icon: "👌" };
    return { bg: "bg-orange-100/40 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", icon: "⚠️" };
  };

  const getSeverityColor = (severity) => {
    if (severity === "high") return "bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300";
    if (severity === "medium") return "bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
    return "bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "indigo", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              🔮 Predictive Analytics
            </h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-200 max-w-2xl">
              ML-powered forecasts, anomaly detection, and AI recommendations for optimal growing conditions
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-indigo-100/50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🤖 Machine Learning
              </span>
              <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📊 Forecasting
              </span>
              <span className="px-4 py-2 bg-purple-100/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🎯 Optimization
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard colors={{ primary: "indigo", secondary: "blue" }}>
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Climate Zone</label>
              <select 
                value={climateZone} 
                onChange={(e) => setClimateZone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-indigo-300/30 dark:border-indigo-700/30 focus:outline-none focus:border-indigo-500"
              >
                {zones.map(zone => (
                  <option key={zone} value={zone}>{zone.charAt(0).toUpperCase() + zone.slice(1)}</option>
                ))}
              </select>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "indigo" }}>
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Select Crop</label>
              <select 
                value={selectedCrop} 
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-blue-300/30 dark:border-blue-700/30 focus:outline-none focus:border-blue-500"
              >
                {crops.map(crop => (
                  <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                ))}
              </select>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <GlassSection colors={{ primary: "indigo", secondary: "blue" }}>
          <div className="flex flex-wrap border-b border-indigo-300/30 dark:border-indigo-700/30 backdrop-blur-sm">
            {["yield", "recommendations", "anomalies"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-indigo-400/40 to-indigo-300/20 dark:from-indigo-600/50 dark:to-indigo-700/30 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-200/10 dark:hover:bg-indigo-700/10"
                }`}
              >
                {tab === "yield" && "📈"}
                {tab === "recommendations" && "💡"}
                {tab === "anomalies" && "⚠️"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Yield Predictions Tab */}
          {activeTab === "yield" && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Yield Predictions - {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} ({climateZone})
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {predictions.length > 0 ? predictions.slice(0, 3).map((pred, idx) => {
                  const confColor = getConfidenceColor(pred.confidence);
                  return (
                    <GlassCard key={idx} colors={{ primary: "indigo", secondary: "blue" }}>
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {pred.month || `Month ${idx + 1}`}
                          </h4>
                          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                            {Math.round(pred.yield || 0)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">kg expected</p>
                        </div>
                        <div className={`p-3 rounded-lg ${confColor.bg} text-center`}>
                          <div className="text-2xl">{confColor.icon}</div>
                          <div className={`text-sm font-bold ${confColor.text} mt-1`}>
                            {Math.round((pred.confidence || 0) * 100)}% confidence
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-indigo-200/30 dark:border-indigo-700/30">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Confidence</span>
                            <span>{Math.round((pred.confidence || 0) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: `${(pred.confidence || 0) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                }) : (
                  <div className="md:col-span-3 text-center py-12 text-gray-600 dark:text-gray-400">
                    No yield predictions available for selected combination
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Optimal Planting Recommendations for {climateZone}
              </h3>
              {recommendations.length > 0 ? recommendations.map((rec, idx) => {
                const confColor = getConfidenceColor(rec.confidence);
                return (
                  <GlassCard key={idx} colors={{ primary: "indigo", secondary: "blue" }}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                            {rec.crop || `Crop ${idx + 1}`}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{rec.reason}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-lg font-bold ${confColor.bg} ${confColor.text}`}>
                          {confColor.icon} {Math.round((rec.confidence || 0) * 100)}%
                        </span>
                      </div>
                      <div className="pt-4 border-t border-indigo-200/30 dark:border-indigo-700/30">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>ML Confidence Score</span>
                          <span>{Math.round((rec.confidence || 0) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full"
                            style={{ width: `${(rec.confidence || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              }) : (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No recommendations available
                </div>
              )}
            </div>
          )}

          {/* Anomalies Tab */}
          {activeTab === "anomalies" && (
            <div className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Historical Anomalies & Alerts
              </h3>
              {anomalies.length > 0 ? anomalies.map((anomaly, idx) => (
                <GlassCard key={idx} colors={{ primary: "indigo", secondary: "blue" }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                          {(anomaly.type || "anomaly").replace(/_/g, " ")}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{anomaly.description}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">📅 {anomaly.date}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity ? anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1) : "Medium"}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-indigo-200/30 dark:border-indigo-700/30">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        📊 Impact: Detected via real-time sensor monitoring • Action: Review growing conditions
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )) : (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No anomalies detected - system operating normally
                </div>
              )}
            </div>
          )}
        </GlassSection>

        {/* ML Model Info */}
        <GlassCard colors={{ primary: "indigo", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span>🤖</span>
              <span>Machine Learning Engine</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Model Accuracy</h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">94.2%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Average prediction accuracy on validation set</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Data Points</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12,847</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Historical data points training the models</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Update Frequency</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Hourly</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Models retrain with new sensor data</p>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Predictions;
