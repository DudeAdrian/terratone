// src/pages/SelfSufficiency_v2.js - Quantum Self-Sufficiency Dashboard with Heart Chakra Theme

import React, { useState } from "react";
import { useAdminData } from "../hooks/useApi";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";

const SelfSufficiency = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [overallScore, setOverallScore] = useState(78);
  const [metrics, setMetrics] = useState({
    food: 82,
    water: 75,
    energy: 71,
    housing: 80,
  });
  const { data: adminData, loading: adminLoading, error: adminError, refetch } = useAdminData();

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-emerald-950 flex items-center justify-center">
        <QuantumCard chakra="heart">
          <div className="p-8 text-emerald-100 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-400 border-t-transparent rounded-full mr-3"></div>
            Loading self-sufficiency data...
          </div>
        </QuantumCard>
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-emerald-950 flex items-center justify-center p-4">
        <QuantumCard chakra="heart">
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-emerald-100/80 mb-4">{adminError}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </QuantumCard>
      </div>
    );
  }

  const handleAddFood = () => {
    const foodService = sofieCore.getService("food");
    foodService?.addGarden?.({
      name: "Main Garden",
      size: 50,
      type: "vegetable",
    });
  };

  const handleAddWater = () => {
    const waterService = sofieCore.getService("water");
    waterService?.addWaterSystem?.({
      name: "Rainwater Cistern",
      type: "rainwater",
      capacity: 5000,
    });
  };

  const handleAddHousing = () => {
    const housingService = sofieCore.getService("housing");
    housingService?.addStructure?.({
      name: "Main Dwelling",
      type: "passive_solar",
      area: 150,
    });
  };

  const handleCalculateScore = () => {
    const sustainability = sofieCore.getService("sustainability");
    sustainability?.calculateOverallScore?.();
    setOverallScore(Math.round(Math.random() * 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="heart">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
            Self-Sufficiency Dashboard
          </h1>
          <p className="text-emerald-200 mt-2">Monitor and optimize your sustainable living systems</p>
        </QuantumSection>

        {/* Overall Score */}
        <QuantumCard chakra="crown" blurLevel="deep" opacityLevel="ultraClear" glow={true} edgeGlow={true}>
          <div className="text-center">
            <p className="text-xs font-semibold text-pink-300 uppercase mb-2 drop-shadow-[0_0_10px_rgba(255,0,170,0.5)]">Overall Score</p>
            <div className="text-5xl font-bold bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,0,170,0.5)]">
              {overallScore}%
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 shadow-[0_0_10px_rgba(255,0,170,0.5)]" style={{ width: `${overallScore}%` }}></div>
            </div>
            <button
              onClick={handleCalculateScore}
              className="mt-4 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:shadow-[0_0_30px_rgba(255,0,170,0.7)] transition-all"
            >
              Recalculate
            </button>
          </div>
        </QuantumCard>

        {/* Metrics Grid */}
        <QuantumGlassGrid columns={4} gap={4}>
          {[
            { key: "food", label: "Food", icon: "🌱", chakra: "heart" },
            { key: "water", label: "Water", icon: "💧", chakra: "throat" },
            { key: "energy", label: "Energy", icon: "⚡", chakra: "solar" },
            { key: "housing", label: "Housing", icon: "🏠", chakra: "root" },
          ].map(item => (
            <QuantumCard key={item.key} chakra={item.chakra} blurLevel="medium" opacityLevel="veil" glow={true}>
              <p className="text-3xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{item.icon}</p>
              <p className="text-xs font-semibold text-white/80 uppercase">{item.label}</p>
              <p className="text-2xl font-bold text-white mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{metrics[item.key]}%</p>
            </QuantumCard>
          ))}
        </QuantumGlassGrid>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "food", label: "Food", icon: "🌱" },
            { key: "water", label: "Water", icon: "💧" },
            { key: "housing", label: "Housing", icon: "🏠" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_20px_rgba(0,255,136,0.5)]"
                  : "bg-white/10 text-emerald-200 border border-emerald-400/30 hover:bg-white/20"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === "overview" && (
          <QuantumSection chakra="heart">
            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">Quick Actions</h2>
            <QuantumGlassGrid columns={4} gap={4}>
              <button
                onClick={handleAddFood}
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-[0_0_30px_rgba(0,255,136,0.7)] transition-all"
              >
                + Add Garden
              </button>
              <button
                onClick={handleAddWater}
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(0,187,255,0.7)] transition-all"
              >
                + Add Water System
              </button>
              <button
                onClick={handleAddHousing}
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-pink-400 to-red-500 text-white hover:shadow-[0_0_30px_rgba(255,0,85,0.7)] transition-all"
              >
                + Add Housing
              </button>
              <button
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:shadow-[0_0_30px_rgba(255,255,0,0.7)] transition-all"
              >
                + Add Energy
              </button>
            </QuantumGlassGrid>
          </QuantumSection>
        )}

        {activeTab === "food" && (
          <QuantumSection chakra="heart">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">Food Self-Sufficiency</h2>
            <p className="text-emerald-200 mb-6">Current Score: <span className="font-bold text-white">{metrics.food}%</span></p>
            <div className="p-4 rounded-lg bg-green-400/20 border border-green-400/30">
              <p className="text-sm text-emerald-200">🌱 Track your gardens, crops, and harvest yield</p>
            </div>
          </QuantumSection>
        )}

        {activeTab === "water" && (
          <QuantumSection chakra="throat">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,187,255,0.5)]">Water Self-Sufficiency</h2>
            <p className="text-cyan-200 mb-6">Current Score: <span className="font-bold text-white">{metrics.water}%</span></p>
            <div className="p-4 rounded-lg bg-blue-400/20 border border-cyan-400/30">
              <p className="text-sm text-cyan-200">💧 Monitor rainwater, recycling, and conservation</p>
            </div>
          </QuantumSection>
        )}

        {activeTab === "housing" && (
          <QuantumSection chakra="root">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,0,85,0.5)]">Housing Self-Sufficiency</h2>
            <p className="text-red-200 mb-6">Current Score: <span className="font-bold text-white">{metrics.housing}%</span></p>
            <div className="p-4 rounded-lg bg-red-400/20 border border-red-400/30">
              <p className="text-sm text-red-200">🏠 Track energy efficiency, passive design, and climate control</p>
            </div>
          </QuantumSection>
        )}
      </div>
    </div>
  );
};

export default SelfSufficiency;
