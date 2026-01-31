// src/pages/PestManagement.js - Glassmorphic Food Domain (Green/Lime)

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassButton, GlassSection, GlassContainer, GlassGrid } from "../theme/GlassmorphismTheme";
import { useFoodData } from "../hooks/useApi";

const PestManagement = () => {
  const { data: apiFoodData, loading, error, refetch } = useFoodData("default");
  const [pestService, setPestService] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [selectedZone, setSelectedZone] = useState("temperate");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [activeTab, setActiveTab] = useState("alerts");
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const service = sofieCore.getService("pestManagement");
    setPestService(service);
    
    if (service) {
      setActiveAlerts(service.getActiveAlerts());
      setRiskAssessments(service.getAllRiskAssessments());
      setTreatments(service.treatments || []);
    }
  }, []);

  const zones = ["tropical", "subtropical", "temperate", "boreal", "arid"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  const getRiskColor = (score) => {
    if (score >= 75) return "bg-red-500/30 dark:bg-red-700/40 border-red-500/50 dark:border-red-600/50 text-red-800 dark:text-red-300";
    if (score >= 50) return "bg-yellow-500/30 dark:bg-yellow-700/40 border-yellow-500/50 dark:border-yellow-600/50 text-yellow-800 dark:text-yellow-300";
    return "bg-green-500/30 dark:bg-green-700/40 border-green-500/50 dark:border-green-600/50 text-green-800 dark:text-green-300";
  };

  const getRiskLabel = (score) => {
    if (score >= 75) return "🚨 HIGH RISK";
    if (score >= 50) return "⚠️ MEDIUM RISK";
    return "✓ LOW RISK";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "green", secondary: "lime" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-green-500 border-t-transparent rounded-full mr-3"></div>
            Loading pest management...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "green", secondary: "lime" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Pest Data</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-green-700 to-lime-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!pestService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading pest management system...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "green", secondary: "lime" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              🦗 Pest Management & Prevention
            </h1>
            <p className="text-lg text-green-700 dark:text-green-200 max-w-2xl">
              Monitor pest alerts and risks across climate zones with integrated pest control strategies
            </p>
          </div>
        </GlassSection>

        {/* Zone and Month Selection */}
        <GlassCard colors={{ primary: "green", secondary: "lime" }}>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Filter by Zone & Month</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Select Zone:</label>
                <div className="grid grid-cols-2 gap-3">
                  {zones.map(zone => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`py-3 px-4 rounded-lg font-medium capitalize transition-all duration-200 ${
                        selectedZone === zone
                          ? "bg-gradient-to-b from-green-400/40 to-green-300/20 dark:from-green-600/50 dark:to-green-700/30 text-green-700 dark:text-green-300 border-2 border-green-500 dark:border-green-400"
                          : "bg-white/20 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-green-200/10 dark:hover:bg-green-700/10 border-2 border-transparent"
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Select Month:</label>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((month, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMonth(idx + 1)}
                      className={`py-3 px-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        selectedMonth === idx + 1
                          ? "bg-gradient-to-b from-green-400/40 to-green-300/20 dark:from-green-600/50 dark:to-green-700/30 text-green-700 dark:text-green-300 border-2 border-green-500 dark:border-green-400"
                          : "bg-white/20 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-green-200/10 dark:hover:bg-green-700/10 border-2 border-transparent"
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <GlassSection colors={{ primary: "green", secondary: "lime" }}>
          <div>
            <div className="flex flex-wrap border-b border-green-300/30 dark:border-green-700/30 backdrop-blur-sm overflow-x-auto">
              {["alerts", "risks", "treatments"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-gradient-to-b from-green-400/40 to-green-300/20 dark:from-green-600/50 dark:to-green-700/30 text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400"
                      : "text-gray-700 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 hover:bg-green-200/10 dark:hover:bg-green-700/10"
                  }`}
                >
                  {tab === "alerts" && "🚨"}
                  {tab === "risks" && "📊"}
                  {tab === "treatments" && "💊"}
                  {" " + tab}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Alerts Tab */}
              {activeTab === "alerts" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Active Pest Alerts</h3>
                  {activeAlerts.length > 0 ? (
                    <div className="grid gap-5">
                      {activeAlerts.map((alert, idx) => (
                        <GlassCard key={idx} colors={{ primary: "red", secondary: "pink" }}>
                          <div className="p-8 border-l-4 border-red-500 dark:border-red-400">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{alert.pest}</h4>
                              <span className="text-3xl">{alert.emoji || "🐛"}</span>
                            </div>
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-4">{alert.description}</p>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Severity</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{alert.severity}/10</p>
                              </div>
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Affected Crops</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{alert.affectedCrops?.length || 0} crops</p>
                              </div>
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Days Since Detected</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{alert.daysSinceDetected || 0}</p>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  ) : (
                    <GlassCard colors={{ primary: "green", secondary: "lime" }}>
                      <div className="p-8 text-center">
                        <p className="text-lg text-green-700 dark:text-green-300">✓ No active pest alerts. Conditions are optimal!</p>
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}

              {/* Risk Assessment Tab */}
              {activeTab === "risks" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Pest Risk Assessment</h3>
                  <GlassGrid cols={1} colsMd={2} gap={5}>
                    {riskAssessments.length > 0 && riskAssessments.map((risk, idx) => (
                      <GlassCard key={idx} colors={{ primary: "green", secondary: "lime" }}>
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-bold text-gray-800 dark:text-white">{risk.pest || "Unknown Pest"}</h4>
                            <span className={`px-4 py-2 rounded-lg font-bold text-sm border backdrop-blur-sm ${getRiskColor(risk.riskScore || 0)}`}>
                              {getRiskLabel(risk.riskScore || 0)}
                            </span>
                          </div>
                          <div className="mb-6">
                            <div className="flex justify-between mb-2">
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Risk Score</p>
                              <p className="text-xl font-bold text-gray-800 dark:text-white">{risk.riskScore || 0}/100</p>
                            </div>
                            <div className="bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                              <div
                                className={`h-4 rounded-full transition-all duration-300 ${
                                  (risk.riskScore || 0) >= 75
                                    ? "bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600"
                                    : (risk.riskScore || 0) >= 50
                                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-500 dark:to-amber-600"
                                    : "bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600"
                                }`}
                                style={{ width: `${risk.riskScore || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{risk.description || "Risk assessment data pending"}</p>
                        </div>
                      </GlassCard>
                    ))}
                  </GlassGrid>
                </div>
              )}

              {/* Treatments Tab */}
              {activeTab === "treatments" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Integrated Pest Management (IPM)</h3>
                  {treatments.length > 0 ? (
                    <div className="grid gap-5">
                      {treatments.map((treatment, idx) => (
                        <GlassCard key={idx} colors={{ primary: "green", secondary: "emerald" }}>
                          <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{treatment.name || "Treatment Method"}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Type: {treatment.type || "N/A"}</p>
                              </div>
                              <span className="text-3xl">{treatment.emoji || "🌿"}</span>
                            </div>
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-6">{treatment.description || ""}</p>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Effectiveness</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{treatment.effectiveness || 0}%</p>
                              </div>
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Cost</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{treatment.costLevel || "Medium"}</p>
                              </div>
                              <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Application Freq</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{treatment.frequency || "As needed"}</p>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  ) : (
                    <GlassCard colors={{ primary: "green", secondary: "lime" }}>
                      <div className="p-8 text-center">
                        <p className="text-lg text-green-700 dark:text-green-300">📚 Treatment methods and recommendations will appear here</p>
                      </div>
                    </GlassCard>
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

export default PestManagement;
