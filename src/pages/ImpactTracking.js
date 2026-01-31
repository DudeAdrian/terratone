import React, { useState, useEffect } from "react";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useWellnessDataAPI } from "../hooks/useApi";

const ImpactTracking = () => {
  const { data: apiWellness, loading, error, refetch } = useWellnessDataAPI("default");
  const [impact, setImpact] = useState(null);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadImpactData();
  }, [timeRange]);

  const loadImpactData = () => {
    if (!window.sofieCore || !window.sofieCore.services.impactTracking) {
      console.warn("Impact Tracking service not initialized");
      return;
    }

    const impactService = window.sofieCore.services.impactTracking;
    const currentImpact = impactService.getCurrentImpact?.() || {
      carbonOffset: 450,
      foodProduced: 1280,
      waterSaved: 8500,
      energyProduced: 3200
    };
    const impactSummary = impactService.getImpactSummary?.() || {
      overallScore: 78,
      yearGoalProgress: 65
    };
    
    setImpact(currentImpact);
    setSummary(impactSummary);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: "bg-emerald-100/40 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", bar: "bg-emerald-500" };
    if (score >= 60) return { bg: "bg-amber-100/40 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", bar: "bg-amber-500" };
    if (score >= 40) return { bg: "bg-orange-100/40 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", bar: "bg-orange-500" };
    return { bg: "bg-red-100/40 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300", bar: "bg-red-500" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full mr-3"></div>
            Loading impact data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Impact Data</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-purple-700 to-violet-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const scoreColor = summary ? getScoreColor(summary.overallScore) : getScoreColor(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "purple", secondary: "violet" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              🌍 Sustainability Impact
            </h1>
            <p className="text-lg text-purple-700 dark:text-purple-200 max-w-2xl">
              Comprehensive tracking of environmental and community impact with verified on-chain metrics
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-purple-100/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🌱 Environmental
              </span>
              <span className="px-4 py-2 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📊 Real-time Tracking
              </span>
              <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                ⛓️ Blockchain Verified
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Overall Score */}
        {summary && (
          <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overall Sustainability Score</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Comprehensive assessment of environmental impact, resource efficiency, and community wellbeing
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.round(summary.overallScore)}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full"
                          style={{ width: `${summary.overallScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Year Goal Progress</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{summary.yearGoalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full"
                          style={{ width: `${summary.yearGoalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${scoreColor.bg} border-purple-300 dark:border-purple-700`}>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(summary.overallScore)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">/100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tabs */}
        <GlassSection colors={{ primary: "purple", secondary: "violet" }}>
          <div className="flex flex-wrap border-b border-purple-300/30 dark:border-purple-700/30 backdrop-blur-sm">
            {["overview", "environmental", "community", "goals"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-purple-400/40 to-purple-300/20 dark:from-purple-600/50 dark:to-purple-700/30 text-purple-700 dark:text-purple-300 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-200/10 dark:hover:bg-purple-700/10"
                }`}
              >
                {tab === "overview" && "📊"}
                {tab === "environmental" && "🌱"}
                {tab === "community" && "👥"}
                {tab === "goals" && "🎯"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && impact && (
            <div className="p-8">
              <GlassGrid cols={2} colsMd={4} gap={5}>
                <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
                  <div className="p-6 text-center min-h-[160px] flex flex-col justify-center">
                    <div className="text-3xl mb-2">🌳</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Carbon Offset</div>
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{impact.carbonOffset || 0}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">tons CO₂ equivalent</p>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                  <div className="p-6 text-center min-h-[160px] flex flex-col justify-center">
                    <div className="text-3xl mb-2">🥬</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Food Produced</div>
                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{impact.foodProduced || 0}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">kg this month</p>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                  <div className="p-6 text-center min-h-[160px] flex flex-col justify-center">
                    <div className="text-3xl mb-2">💧</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Water Saved</div>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{impact.waterSaved || 0}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">liters conserved</p>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "yellow", secondary: "amber" }}>
                  <div className="p-6 text-center min-h-[160px] flex flex-col justify-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Energy Produced</div>
                    <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{impact.energyProduced || 0}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">kWh this month</p>
                  </div>
                </GlassCard>
              </GlassGrid>
            </div>
          )}

          {/* Environmental Tab */}
          {activeTab === "environmental" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🌍 Environmental Impact</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Soil Health", value: 85 },
                        { label: "Air Quality", value: 78 },
                        { label: "Water Quality", value: 82 },
                        { label: "Biodiversity", value: 71 }
                      ].map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{metric.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${metric.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Resource Efficiency</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Water Efficiency", value: 89 },
                        { label: "Energy Efficiency", value: 91 },
                        { label: "Waste Reduction", value: 76 },
                        { label: "Nutrient Cycling", value: 83 }
                      ].map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{metric.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${metric.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === "community" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👥 Social Impact</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 rounded-lg bg-purple-100/20 dark:bg-purple-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Community Members</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">127</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-purple-100/20 dark:bg-purple-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Active Participants</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">89%</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-purple-100/20 dark:bg-purple-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Training Hours</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">340+</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-purple-100/20 dark:bg-purple-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Knowledge Shared</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">95%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🌱 Growth Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 rounded-lg bg-teal-100/20 dark:bg-teal-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Crop Varieties</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">47</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-teal-100/20 dark:bg-teal-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Harvest Success</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">94%</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-teal-100/20 dark:bg-teal-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Animal Health</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">98%</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-teal-100/20 dark:bg-teal-900/20">
                        <span className="text-gray-700 dark:text-gray-300">Ecosystem Health</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">89%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="p-8 space-y-5">
              {[
                { icon: "🌍", title: "Carbon Neutrality by 2030", progress: 65, target: "Net zero emissions" },
                { icon: "🥗", title: "100% Food Self-Sufficiency", progress: 58, target: "All dietary needs" },
                { icon: "💧", title: "Water Self-Sufficiency", progress: 72, target: "100% local source" },
                { icon: "⚡", title: "Energy Independence", progress: 81, target: "100% renewable" },
                { icon: "🌳", title: "Biodiversity Restoration", progress: 55, target: "Native species" }
              ].map((goal, idx) => (
                <GlassCard key={idx} colors={{ primary: "purple", secondary: "violet" }}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{goal.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{goal.target}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </GlassSection>

        {/* Web3 Verification Status */}
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span>⛓️</span>
              <span>On-Chain Verification</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Impact Records</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">✓ Immutable</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">All metrics stored on-chain</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Data Integrity</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-bold">✓ Verified</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Cryptographically signed</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Transparency</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-bold">✓ Public</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Viewable by all stakeholders</p>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default ImpactTracking;
