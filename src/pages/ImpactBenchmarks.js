import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useWellnessDataAPI } from "../hooks/useApi";

const ImpactBenchmarks = () => {
  const { data: apiWellnessData, loading: loadingImpact, error: errorImpact, refetch } = useWellnessDataAPI("default");
  const [metrics, setMetrics] = useState({});
  const [comparison, setComparison] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [activeTab, setActiveTab] = useState("metrics");

  useEffect(() => {
    const impactService = sofieCore.getService("impactMetrics");
    if (apiWellnessData) {
      // Derive impact metrics from available wellness stats until dedicated API exists
      setMetrics(apiWellnessData.stats || {});
      setComparison(mockComparison);
      setOverallScore(apiWellnessData.stats?.wellnessScore || 78);
    } else if (impactService) {
      setMetrics(impactService.getMetrics?.() || {});
      setComparison(impactService.getBenchmarkComparison?.() || mockComparison);
      setOverallScore(impactService.getOverallScore?.() || 78);
    } else {
      setComparison(mockComparison);
      setOverallScore(78);
    }
  }, [apiWellnessData]);

  if (loadingImpact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full mr-3"></div>
            Loading impact benchmarks...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (errorImpact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Impact Data</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{errorImpact}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-purple-700 to-violet-900 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const mockComparison = {
    energyGeneration: { current: "850 kWh", target: "900 kWh", percentageOfTarget: 94 },
    foodProduction: { current: "2450 kg", target: "2500 kg", percentageOfTarget: 98 },
    waterConservation: { current: "8200 L", target: "8500 L", percentageOfTarget: 96 },
    wasteReduction: { current: "92%", target: "100%", percentageOfTarget: 92 },
    carbonFootprint: { current: "125%", target: "75%", percentageOfTarget: 60 }
  };

  const getBarColor = (percentage) => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 70) return "bg-amber-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "purple", secondary: "violet" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              📊 Impact Benchmarks
            </h1>
            <p className="text-lg text-purple-700 dark:text-purple-200 max-w-2xl">
              Track sustainability metrics against global benchmarks and community targets
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-purple-100/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🌍 Global Comparison
              </span>
              <span className="px-4 py-2 bg-violet-100/50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📈 Goal Tracking
              </span>
              <span className="px-4 py-2 bg-indigo-100/50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🎯 Performance
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Overall Score Card */}
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overall Sustainability Score</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Comprehensive assessment of all environmental and community impact metrics compared to global benchmarks
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Targets Met", value: "4/5" },
                    { label: "Performance", value: "Above Average" },
                    { label: "Trend", value: "Improving" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 rounded-full flex items-center justify-center border-4 border-purple-300 dark:border-purple-700 bg-purple-100/20 dark:bg-purple-900/20">
                  <div>
                    <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">{overallScore}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <GlassSection colors={{ primary: "purple", secondary: "violet" }}>
          <div className="flex flex-wrap border-b border-purple-300/30 dark:border-purple-700/30 backdrop-blur-sm">
            {["metrics", "categories", "analysis"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-purple-400/40 to-purple-300/20 dark:from-purple-600/50 dark:to-purple-700/30 text-purple-700 dark:text-purple-300 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-200/10 dark:hover:bg-purple-700/10"
                }`}
              >
                {tab === "metrics" && "📊"}
                {tab === "categories" && "📋"}
                {tab === "analysis" && "📈"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Metrics Tab */}
          {activeTab === "metrics" && (
            <div className="p-8 space-y-5">
              {Object.entries(comparison).map(([key, data]) => (
                <GlassCard key={key} colors={{ primary: "purple", secondary: "violet" }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Current: <span className="font-bold text-gray-900 dark:text-white">{data.current}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.percentageOfTarget}%</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">of target</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-gray-600 dark:text-gray-400">Target: {data.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                          className={`${getBarColor(data.percentageOfTarget)} h-4 rounded-full transition-all`}
                          style={{ width: `${Math.min(data.percentageOfTarget, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">✓ On Track</h3>
                    <ul className="space-y-2">
                      {[
                        "Energy Generation: 94%",
                        "Food Production: 98%",
                        "Waste Reduction: 92%",
                        "Water Conservation: 96%"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-emerald-600 dark:text-emerald-400">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "orange", secondary: "amber" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⚠ Needs Attention</h3>
                    <ul className="space-y-2">
                      {[
                        "Carbon Footprint: 60%",
                        "Consider offset programs",
                        "Expand renewable sources",
                        "Optimize transportation"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-orange-600 dark:text-orange-400">⚠</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <div className="p-8 space-y-6">
              <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Insights</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Strong Performance", desc: "Food production at 98% of target demonstrates efficient farming practices" },
                      { title: "Growth Opportunity", desc: "Carbon footprint reduction is primary focus area for next quarter" },
                      { title: "Trend Analysis", desc: "Overall metrics improving at 8% quarter-over-quarter" },
                      { title: "Benchmarking", desc: "Performance above global average for similar-sized communities" }
                    ].map((insight, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-purple-100/20 dark:bg-purple-900/20 border-l-4 border-purple-500">
                        <h4 className="font-bold text-gray-900 dark:text-white">{insight.title}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{insight.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard colors={{ primary: "violet", secondary: "purple" }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {[
                      "Invest in solar capacity to offset carbon footprint",
                      "Implement composting program to reach 100% waste reduction",
                      "Expand crop diversity to maintain food security",
                      "Establish carbon offset partnerships with other communities"
                    ].map((rec, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="text-violet-600 dark:text-violet-400 font-bold">{idx + 1}.</span>
                        <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </GlassSection>

      </div>
    </div>
  );
};

export default ImpactBenchmarks;
