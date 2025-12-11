import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid, GlassButton } from "../theme/GlassmorphismTheme";
import { createBackHandler } from "../utils/navigation";

const Resilience = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [emergencyPlans, setEmergencyPlans] = useState([]);
  const [resources, setResources] = useState({});
  const [risks, setRisks] = useState([]);
  const [resilienceScore, setResilienceScore] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const resService = sofieCore.getService("resilience");
    if (resService) {
      setEmergencyPlans(resService.getEmergencyPlans());
      setResources(resService.getEmergencyResources());
      setRisks(resService.assessRisks());
      setResilienceScore(resService.getResilienceScore());
    }
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return { bg: "bg-red-100/40 dark:bg-red-900/40", border: "border-red-300/50 dark:border-red-700/50", text: "text-red-700 dark:text-red-300" };
      case "medium":
        return { bg: "bg-yellow-100/40 dark:bg-yellow-900/40", border: "border-yellow-300/50 dark:border-yellow-700/50", text: "text-yellow-700 dark:text-yellow-300" };
      case "low":
        return { bg: "bg-emerald-100/40 dark:bg-emerald-900/40", border: "border-emerald-300/50 dark:border-emerald-700/50", text: "text-emerald-700 dark:text-emerald-300" };
      default:
        return { bg: "bg-gray-100/40 dark:bg-gray-700/40", border: "border-gray-300/50 dark:border-gray-700/50", text: "text-gray-700 dark:text-gray-300" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "red", secondary: "rose" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e8d3ba'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              🛡️ Community Resilience
            </h1>
            <p className="text-lg text-red-700 dark:text-red-200 max-w-2xl">
              Emergency preparedness, risk management, and disaster recovery with decentralized backup systems
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🚨 Alert System
              </span>
              <span className="px-4 py-2 bg-rose-100/50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📡 Mesh Network
              </span>
              <span className="px-4 py-2 bg-orange-100/50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🔄 Redundancy
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Resilience Score */}
        <GlassSection colors={{ primary: "red", secondary: "rose" }} elevation="medium">
          <div className="p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Community Resilience Score</p>
            <div className="flex items-end justify-center gap-3 mb-6">
              <div className="text-7xl font-bold bg-gradient-to-br from-red-600 to-rose-600 bg-clip-text text-transparent">
                {resilienceScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-red-500 to-rose-500 h-4 rounded-full"
                style={{ width: `${resilienceScore}%` }}
              ></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto">
              Emergency preparedness and disaster response capability. Based on planning, resources, training, and infrastructure redundancy.
            </p>
          </div>
        </GlassSection>

        {/* Tabs */}
        <GlassSection colors={{ primary: "red", secondary: "rose" }}>
          <div className="flex flex-wrap border-b border-red-300/30 dark:border-red-700/30 backdrop-blur-sm">
            {["overview", "risks", "resources", "plans"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-red-400/40 to-red-300/20 dark:from-red-600/50 dark:to-red-700/30 text-red-700 dark:text-red-300 border-b-2 border-red-600 dark:border-red-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-200/10 dark:hover:bg-red-700/10"
                }`}
              >
                {tab === "overview" && "📊"}
                {tab === "risks" && "⚠️"}
                {tab === "resources" && "📦"}
                {tab === "plans" && "📋"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "red", secondary: "rose" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resilience Strategy</h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🔄</span>
                        <div>
                          <p className="font-bold">System Redundancy</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Multiple independent systems for critical functions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📡</span>
                        <div>
                          <p className="font-bold">Mesh Network Backup</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Low-power radio network for emergency comms</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🏥</span>
                        <div>
                          <p className="font-bold">Medical Stockpiles</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Emergency medical supplies and medications</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🤝</span>
                        <div>
                          <p className="font-bold">Mutual Aid Agreements</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Partnerships with neighboring communities</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "rose", secondary: "red" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Food Security", value: 85, color: "emerald" },
                        { label: "Water Availability", value: 92, color: "blue" },
                        { label: "Energy Independence", value: 78, color: "amber" },
                        { label: "Medical Readiness", value: 88, color: "red" }
                      ].map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 h-2.5 rounded-full`}
                              style={{ 
                                width: `${metric.value}%`,
                                background: metric.color === "emerald" ? "linear-gradient(90deg, rgb(16, 185, 129), rgb(5, 150, 105))" 
                                  : metric.color === "blue" ? "linear-gradient(90deg, rgb(59, 130, 246), rgb(37, 99, 235))"
                                  : metric.color === "amber" ? "linear-gradient(90deg, rgb(217, 119, 6), rgb(180, 83, 9))"
                                  : "linear-gradient(90deg, rgb(239, 68, 68), rgb(220, 38, 38))"
                              }}
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

          {/* Risks Tab */}
          {activeTab === "risks" && (
            <div className="p-8 space-y-5">
              {risks.length > 0 ? risks.map((risk) => {
                const severityColors = getSeverityColor(risk.severity);
                return (
                  <GlassCard key={risk.id} colors={{ primary: "red", secondary: "rose" }}>
                    <div className={`p-6 border-l-4 ${severityColors.border}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{risk.type}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{risk.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap capitalize ${severityColors.text} ${severityColors.bg}`}>
                          {risk.severity}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Probability</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(risk.probability * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${risk.probability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              }) : (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No major risks identified
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="p-8">
              <GlassGrid cols={1} colsMd={2} gap={5}>
                {Object.entries(resources).length > 0 ? Object.entries(resources).map(([resource, quantity], idx) => (
                  <GlassCard key={resource} colors={{ primary: "red", secondary: "rose" }}>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{resource.replace(/_/g, " ")}</h3>
                        <span className="text-3xl font-bold text-red-600 dark:text-red-400">{quantity}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-rose-500 h-3 rounded-full"
                          style={{ width: `${(quantity / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                        {quantity >= 75 ? "✓ Well-stocked" : quantity >= 50 ? "⚠ Monitor levels" : "🔴 Needs replenishment"}
                      </p>
                    </div>
                  </GlassCard>
                )) : (
                  <div className="text-center py-12 text-gray-600 dark:text-gray-400 md:col-span-2">
                    No resource data available
                  </div>
                )}
              </GlassGrid>
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === "plans" && (
            <div className="p-8">
              <GlassGrid cols={1} colsMd={3} gap={5}>
                {emergencyPlans.length > 0 ? emergencyPlans.map((plan) => (
                  <GlassCard key={plan.id} colors={{ primary: "red", secondary: "rose" }}>
                    <div className="p-6 min-h-[200px] flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{plan.name}</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-1">{plan.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            plan.status === "active" 
                              ? "bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Last review: {plan.lastReview}</p>
                      </div>
                    </div>
                  </GlassCard>
                )) : (
                  <div className="text-center py-12 text-gray-600 dark:text-gray-400 md:col-span-3">
                    No emergency plans configured
                  </div>
                )}
              </GlassGrid>
            </div>
          )}
        </GlassSection>

        {/* Resilience Best Practices */}
        <GlassCard colors={{ primary: "red", secondary: "rose" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span>💡</span>
              <span>Resilience Best Practices</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  icon: "🏋️", 
                  title: "Regular Training", 
                  desc: "Monthly emergency drills and community preparedness training for all members" 
                },
                { 
                  icon: "🌳", 
                  title: "System Diversification", 
                  desc: "Multiple independent sources for food, water, energy, and medicine" 
                },
                { 
                  icon: "📡", 
                  title: "Communication Backup", 
                  desc: "Mesh network and alternative communication methods for grid failures" 
                },
                { 
                  icon: "🤝", 
                  title: "Community Cooperation", 
                  desc: "Mutual aid agreements and resource sharing with neighboring communities" 
                },
                { 
                  icon: "🔍", 
                  title: "Regular Assessment", 
                  desc: "Quarterly risk evaluation and plan updates based on changing conditions" 
                },
                { 
                  icon: "🛡️", 
                  title: "Secure Backups", 
                  desc: "Encrypted off-site data backups and decentralized information storage" 
                }
              ].map((practice, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{practice.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{practice.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{practice.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Resilience;
