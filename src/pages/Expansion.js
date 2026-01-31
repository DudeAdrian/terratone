// src/pages/Expansion.js - Glassmorphic Web3-Integrated Community Expansion Dashboard

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { createBackHandler } from "../utils/navigation";
import { useExpansionData } from "../hooks/useApi";

const Expansion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [web3Status] = useState("connected");
  const [contractBalance] = useState("2.847 ETH");

  // API hook for expansion data
  const { data: expData, loading: expLoading, error: expError, refetch: refetchExp } = useExpansionData(selectedRegion);

  // State for housing, water, solar, emergency data
  const [housingService, setHousingService] = useState(null);
  const [waterService, setWaterService] = useState(null);
  const [solarService, setSolarService] = useState(null);
  const [emergencyService, setEmergencyService] = useState(null);

  // Initialize with API data
  useEffect(() => {
    if (expData) {
      // API data available - use it for rendering
      setHousingService(expData.housing);
      setWaterService(expData.water);
      setSolarService(expData.solar);
      setEmergencyService(expData.projects);
    } else {
      // Fallback to sofieCore
      try {
        setHousingService(sofieCore.getService("housingExpansion"));
        setWaterService(sofieCore.getService("waterExpansion"));
        setSolarService(sofieCore.getService("solarExpansion"));
        setEmergencyService(sofieCore.getService("emergencyPreparedness"));
      } catch (err) {
        console.warn('Expansion services unavailable:', err);
      }
    }
  }, [expData]);

  const handleRetry = () => {
    refetchExp();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "operational":
      case "excellent":
        return "from-emerald-400 to-green-500";
      case "in-progress":
      case "active":
      case "good":
        return "from-blue-400 to-cyan-500";
      case "planning":
      case "design":
      case "adequate":
        return "from-amber-400 to-orange-500";
      case "approved":
        return "from-purple-400 to-violet-500";
      default:
        return "from-slate-400 to-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "from-red-400 to-rose-500";
      case "medium":
        return "from-amber-400 to-orange-500";
      case "low":
        return "from-emerald-400 to-green-500";
      default:
        return "from-slate-400 to-gray-500";
    }
  };

  // Loading state
  if (expLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
        <div className="text-center space-y-4">
          <div className="text-3xl quantum-pulse text-green-600 dark:text-green-400">
            Loading Expansion Projects...
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Fetching housing, water, and solar expansion data
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (expError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 space-y-6">
        <div className="text-3xl text-red-500">
          {expError}
        </div>
        <button
          onClick={handleRetry}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-green-500/50"
        >
          Retry Expansion Data
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "slate", secondary: "green" }} elevation="high">
          <div className="flex items-start justify-between" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e8d3ba',
                zIndex: 10
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-green-700 dark:from-slate-100 dark:to-green-400 bg-clip-text text-transparent">
                🚀 Expansion Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Strategic infrastructure growth, capacity planning & Web3-verified community development
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700/50">
                <div className={`w-2 h-2 rounded-full ${web3Status === "connected" ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{web3Status}</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Contract: {contractBalance}
              </div>
            </div>
          </div>
        </GlassSection>

        {/* Stat Cards */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          {/* Housing Stats */}
          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Housing Projects
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {housingService?.getExpansionProjects().length || 0}
                </p>
              </div>
              <span className="text-2xl">🏘️</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">+65 units planned</p>
            <div className="mt-2 text-blue-600 dark:text-blue-400 text-xs font-semibold">On-chain verified</div>
          </GlassCard>

          {/* Water Stats */}
          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                  Water Projects
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {waterService?.getExpansionProjects().length || 0}
                </p>
              </div>
              <span className="text-2xl">💧</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">+165k L/day capacity</p>
            <div className="mt-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">🔗 Blockchain tracked</div>
          </GlassCard>

          {/* Solar Stats */}
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  Solar Projects
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {solarService?.getExpansionProjects().length || 0}
                </p>
              </div>
              <span className="text-2xl">☀️</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">+550 kW capacity</p>
            <div className="mt-2 text-amber-600 dark:text-amber-400 text-xs font-semibold">Smart contracts active</div>
          </GlassCard>

          {/* Emergency Stats */}
          <GlassCard colors={{ primary: "rose", secondary: "red" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Emergency Readiness
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {emergencyService?.getReadinessScore().overall || 0}%
                </p>
              </div>
              <span className="text-2xl">🚨</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {emergencyService?.getReadinessScore().status || "assessing..."}
            </p>
            <div className="mt-2 text-rose-600 dark:text-rose-400 text-xs font-semibold">Verified on-chain</div>
          </GlassCard>
        </GlassGrid>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["overview", "housing", "water", "solar", "emergency"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white dark:from-slate-300 dark:to-slate-100 dark:text-slate-900"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-700/60"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Expansion Grid Overview */}
            <GlassGrid cols={1} colsMd={2} gap={6}>
              {/* Housing Summary */}
              <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏘️</span> Housing Expansion
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Active Projects:</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {housingService?.getExpansionProjects().filter(p => p.status === "in-progress" || p.status === "active").length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">New Units:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {housingService?.getConstructionMetrics().totalUnitsPlanned || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Investment:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ${(housingService?.getConstructionMetrics().totalBudget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">
                      ✓ Contracts on Ethereum
                    </div>
                    <button className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-semibold hover:shadow-lg transition-all">
                      View Smart Contracts
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Water Summary */}
              <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>💧</span> Water Infrastructure
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Active Projects:</span>
                    <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                      {waterService?.getExpansionProjects().filter(p => p.status === "in-progress" || p.status === "active").length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Capacity Increase:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      +{(waterService?.getMetrics().totalCapacityIncrease / 1000).toFixed(0)}k L/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Self-Sufficiency Target:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {waterService?.getMetrics().selfSufficiency.projected}%
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">
                      🔗 Immutable Records
                    </div>
                    <button className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold hover:shadow-lg transition-all">
                      View Blockchain Records
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Solar Summary */}
              <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>☀️</span> Solar & Energy
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Active Projects:</span>
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {solarService?.getExpansionProjects().filter(p => p.status === "in-progress" || p.status === "active").length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Capacity Addition:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      +{solarService?.getMetrics().plannedAddition} kW
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Renewable Goal:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {solarService?.getMetrics().renewablePercentage.projected}%
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">
                      💡 Grid Contracts Active
                    </div>
                    <button className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold hover:shadow-lg transition-all">
                      View Energy Contracts
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Emergency Summary */}
              <GlassCard colors={{ primary: "rose", secondary: "red" }}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🚨</span> Emergency Preparedness
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Response Teams:</span>
                    <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      {emergencyService?.getResponseTeams().length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Food Reserve:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {emergencyService?.getEmergencySupplies().food.currentReserve} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Overall Readiness:</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {emergencyService?.getReadinessScore().overall}%
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">
                      🔐 Decentralized Network
                    </div>
                    <button className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-rose-400 to-red-500 text-white text-xs font-semibold hover:shadow-lg transition-all">
                      View Emergency Network
                    </button>
                  </div>
                </div>
              </GlassCard>
            </GlassGrid>

            {/* Project Timeline */}
            <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">2026 Project Timeline</h3>
              <div className="space-y-4">
                {housingService?.getProjectTimeline().map(project => (
                  <div key={project.id} className="group">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-48 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {project.name}
                      </div>
                      <div className="flex-1 bg-white/30 dark:bg-slate-800/30 rounded-full h-3 relative overflow-hidden border border-white/20 dark:border-slate-700/50">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${getStatusColor(project.status)} transition-all`}
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300 w-12 text-right">
                        {project.completion}%
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(project.status)} text-white`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="ml-52 text-xs text-slate-500 dark:text-slate-400">
                      On blockchain • {project.completion > 50 ? "Mid-phase" : "Early-stage"}
                    </div>
                  </div>
                ))}
              </div>
            </GlassSection>
          </div>
        )}

        {selectedTab === "housing" && housingService && (
          <HousingTab service={housingService} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />
        )}

        {selectedTab === "water" && waterService && (
          <WaterTab service={waterService} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />
        )}

        {selectedTab === "solar" && solarService && (
          <SolarTab service={solarService} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />
        )}

        {selectedTab === "emergency" && emergencyService && (
          <EmergencyTab service={emergencyService} getStatusColor={getStatusColor} />
        )}
      </div>
    </div>
  );
};

// Housing Tab Component
const HousingTab = ({ service, getStatusColor, getPriorityColor }) => {
  const projects = service.getExpansionProjects();
  const waitlist = service.getWaitlist();
  const metrics = service.getConstructionMetrics();

  return (
    <div className="space-y-8">
      <GlassSection colors={{ primary: "blue", secondary: "cyan" }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🏘️ Housing Expansion Projects</h2>

        {/* Metrics Grid */}
        <GlassGrid cols={1} colsMd={4} gap={4} className="mb-8">
          <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/10 dark:from-blue-500/10 dark:to-cyan-500/5 p-4 rounded-xl border border-blue-200/50 dark:border-blue-500/20">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Units Planned</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{metrics.totalUnitsPlanned}</p>
          </div>
          <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/10 dark:from-green-500/10 dark:to-emerald-500/5 p-4 rounded-xl border border-green-200/50 dark:border-green-500/20">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Total Budget</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${(metrics.totalBudget / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400/20 to-violet-400/10 dark:from-purple-500/10 dark:to-violet-500/5 p-4 rounded-xl border border-purple-200/50 dark:border-purple-500/20">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">On-Time %</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{metrics.onTimeDelivery}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400/20 to-teal-400/10 dark:from-emerald-500/10 dark:to-teal-500/5 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-500/20">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Sustainability</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{metrics.sustainabilityScore}/100</p>
          </div>
        </GlassGrid>

        {/* Projects */}
        <div className="space-y-4">
          {projects.map(project => (
            <GlassCard key={project.id} colors={{ primary: "blue", secondary: "cyan" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{project.type} • {project.units} units</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                    {project.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-3 mb-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Start Date</span>
                  <p className="font-semibold text-slate-900 dark:text-white">{project.startDate}</p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Est. Completion</span>
                  <p className="font-semibold text-slate-900 dark:text-white">{project.estimatedCompletion}</p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Budget</span>
                  <p className="font-semibold text-slate-900 dark:text-white">${(project.budget / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Spent</span>
                  <p className="font-semibold text-slate-900 dark:text-white">${(project.spent / 1000).toFixed(0)}k</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Completion</span>
                  <span className="text-slate-900 dark:text-white font-bold">{project.completion}%</span>
                </div>
                <div className="bg-white/30 dark:bg-slate-800/30 rounded-full h-2.5 border border-white/20 dark:border-slate-700/50 overflow-hidden">
                  <div
                    className={`h-2.5 bg-gradient-to-r ${getStatusColor(project.status)}`}
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
                    View Milestones ({project.milestones.filter(m => m.status === "completed").length}/{project.milestones.length})
                  </summary>
                  <div className="mt-3 space-y-2 pl-4">
                    {project.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          milestone.status === "completed" ? "bg-green-500" :
                          milestone.status === "in-progress" ? "bg-blue-500" :
                          milestone.status === "pending" ? "bg-amber-500" :
                          "bg-slate-400"
                        }`}></span>
                        <span className={`text-sm ${milestone.status === "completed" ? "line-through text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                          {milestone.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">({milestone.dueDate})</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Waitlist */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Housing Waitlist ({waitlist.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 dark:border-slate-700/50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Family Size</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Preferences</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Since</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry, idx) => (
                  <tr key={entry.id} className={`border-b border-white/10 dark:border-slate-800/30 ${idx % 2 === 0 ? "bg-white/10 dark:bg-slate-800/10" : ""}`}>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{entry.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r text-white`}>
                        {entry.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{entry.familySize}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{entry.preferences}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{entry.waitingSince}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassSection>
    </div>
  );
};

// Water Tab Component
const WaterTab = ({ service, getStatusColor, getPriorityColor }) => {
  const projects = service.getExpansionProjects();
  const conservation = service.getConservationPrograms();
  const balance = service.getWaterBalance();

  return (
    <div className="space-y-8">
      <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">💧 Water Infrastructure Expansion</h2>

        {/* Water Balance */}
        <GlassCard colors={{ primary: "cyan", secondary: "blue" }} className="mb-8">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Current Water Balance</h3>
          <GlassGrid cols={2} colsMd={4} gap={4}>
            <div>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase">Total Capacity</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{(balance.totalCapacity / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">L/day</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Usage</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{(balance.totalUsage / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">L/day</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Local Production</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{balance.localPercentage}%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">of supply</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Utilization</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{balance.utilizationRate}%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">in use</p>
            </div>
          </GlassGrid>
        </GlassCard>

        {/* Projects */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Expansion Projects</h3>
          {projects.map(project => (
            <GlassCard key={project.id} colors={{ primary: "cyan", secondary: "blue" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{project.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{project.type}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                    {project.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {project.capacity && (
                <p className="text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Capacity: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{(project.capacity / 1000).toFixed(0)}k L/day</span>
                </p>
              )}

              <p className="text-sm mb-4 text-green-600 dark:text-green-400 font-semibold">
                ✓ Expected Impact: {project.expectedImpact}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">{project.completion}%</span>
                </div>
                <div className="bg-white/30 dark:bg-slate-800/30 rounded-full h-2.5 border border-white/20 dark:border-slate-700/50 overflow-hidden">
                  <div
                    className={`h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500`}
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-cyan-600 dark:text-cyan-400 font-semibold hover:text-cyan-700">
                  View Components
                </summary>
                <div className="mt-3 space-y-2 pl-4">
                  {project.components.map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300">{comp.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${getStatusColor(comp.status)} text-white`}>
                        {comp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </GlassCard>
          ))}
        </div>

        {/* Conservation Programs */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Conservation Programs</h3>
          <GlassGrid cols={1} colsMd={3} gap={4}>
            {conservation.map(program => (
              <GlassCard key={program.id} colors={{ primary: "green", secondary: "emerald" }}>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">{program.name}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{program.target}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">Savings</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{program.savings}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Investment</p>
                    <p className="font-semibold text-slate-900 dark:text-white">${(program.investment / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-bold text-slate-900 dark:text-white">{program.completion}%</span>
                    </div>
                    <div className="bg-white/30 dark:bg-slate-800/30 rounded-full h-2 border border-white/20 dark:border-slate-700/50 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: `${program.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </GlassGrid>
        </div>
      </GlassSection>
    </div>
  );
};

// Solar Tab Component
const SolarTab = ({ service, getStatusColor, getPriorityColor }) => {
  const projects = service.getExpansionProjects();
  const metrics = service.getMetrics();
  const independence = service.getEnergyIndependence();

  return (
    <div className="space-y-8">
      <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">☀️ Solar & Energy Expansion</h2>

        {/* Energy Status */}
        <GlassGrid cols={1} colsMd={2} gap={6} className="mb-8">
          <GlassCard colors={{ primary: "amber", secondary: "yellow" }}>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Current Energy Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Production:</span>
                <span className="font-bold text-slate-900 dark:text-white">{independence.current.dailyProduction} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Demand:</span>
                <span className="font-bold text-slate-900 dark:text-white">{independence.current.dailyDemand} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Independence:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{independence.current.independence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <span className={`font-bold ${independence.current.status === "surplus" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {independence.current.status}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Projected Energy Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Production:</span>
                <span className="font-bold text-slate-900 dark:text-white">{independence.projected.dailyProduction} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Demand:</span>
                <span className="font-bold text-slate-900 dark:text-white">{independence.projected.dailyDemand} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Independence:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{independence.projected.independence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{independence.projected.status}</span>
              </div>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Metrics */}
        <GlassGrid cols={1} colsMd={3} gap={4} className="mb-8">
          <GlassCard colors={{ primary: "amber", secondary: "yellow" }}>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Capacity</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{metrics.futureCapacity} kW</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">+{metrics.plannedAddition} kW planned</p>
          </GlassCard>
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Annual Production</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{(metrics.projectedProduction / 1000).toFixed(0)}k kWh</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">+{((metrics.projectedProduction - metrics.currentProduction) / 1000).toFixed(0)}k increase</p>
          </GlassCard>
          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Annual Savings</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${(metrics.costSavings.projected / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">projected per year</p>
          </GlassCard>
        </GlassGrid>

        {/* Projects */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Solar Projects</h3>
          {projects.map(project => (
            <GlassCard key={project.id} colors={{ primary: "amber", secondary: "orange" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{project.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{project.type}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                    {project.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-4 text-sm">
                {project.capacity && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">Capacity</span>
                    <p className="font-bold text-slate-900 dark:text-white">{project.capacity} kW</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Budget</span>
                  <p className="font-bold text-slate-900 dark:text-white">${(project.budget / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">ROI</span>
                  <p className="font-bold text-slate-900 dark:text-white">{project.roi}</p>
                </div>
              </div>

              {project.expectedOutput && (
                <p className="text-sm mb-2 text-green-600 dark:text-green-400 font-semibold">
                  ⚡ Output: {project.expectedOutput}
                </p>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">{project.completion}%</span>
                </div>
                <div className="bg-white/30 dark:bg-slate-800/30 rounded-full h-2.5 border border-white/20 dark:border-slate-700/50 overflow-hidden">
                  <div
                    className="h-2.5 bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                🔗 Smart contract active on Ethereum
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassSection>
    </div>
  );
};

// Emergency Tab Component
const EmergencyTab = ({ service, getStatusColor }) => {
  const supplies = service.getEmergencySupplies();
  const plans = service.getEmergencyPlans();
  const teams = service.getResponseTeams();
  const readiness = service.getReadinessScore();

  return (
    <div className="space-y-8">
      <GlassSection colors={{ primary: "rose", secondary: "red" }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🚨 Emergency Preparedness</h2>

        {/* Readiness Score */}
        <GlassCard colors={{ primary: "rose", secondary: "red" }} className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Overall Readiness Score</h3>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400 bg-clip-text text-transparent">
              {readiness.overall}%
            </div>
            <div className="text-slate-600 dark:text-slate-400 capitalize mt-2 font-semibold">
              {readiness.status}
            </div>
          </div>
          <GlassGrid cols={1} colsMd={3} gap={4}>
            {Object.entries(readiness.categories).map(([cat, score]) => (
              <div key={cat} className="text-center bg-white/20 dark:bg-slate-800/20 p-3 rounded-lg border border-white/10 dark:border-slate-700/30">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{score}%</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 capitalize mt-1">{cat}</div>
              </div>
            ))}
          </GlassGrid>
        </GlassCard>

        {/* Emergency Supplies */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Emergency Supplies</h3>
          <GlassGrid cols={1} colsMd={2} gap={4}>
            {Object.entries(supplies).map(([category, data]) => (
              <GlassCard key={category} colors={{ primary: "rose", secondary: "red" }}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-900 dark:text-white capitalize">{category}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(data.status)} text-white`}>
                    {data.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Current Reserve:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{data.currentReserve} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Target:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{data.target} days</span>
                  </div>
                  <div className="pt-2 border-t border-white/20 dark:border-slate-700/50">
                    <div className="bg-white/30 dark:bg-slate-800/30 rounded-full h-3 border border-white/20 dark:border-slate-700/50 overflow-hidden">
                      <div
                        className={`h-3 bg-gradient-to-r ${
                          (data.currentReserve / data.target) >= 0.9 ? "from-green-400 to-emerald-500" :
                          (data.currentReserve / data.target) >= 0.75 ? "from-amber-400 to-orange-500" :
                          "from-red-400 to-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, (data.currentReserve / data.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </GlassGrid>
        </div>

        {/* Response Teams */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Response Teams</h3>
          <div className="space-y-3">
            {teams.map(team => (
              <GlassCard key={team.id} colors={{ primary: "rose", secondary: "red" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{team.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lead: {team.lead} • {team.members} members
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Last Training: {team.lastTraining}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(team.certifications.toLowerCase())} text-white`}>
                    {team.certifications}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Emergency Plans */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Emergency Response Plans</h3>
          <div className="space-y-3">
            {plans.map(plan => (
              <GlassCard key={plan.id} colors={{ primary: "rose", secondary: "red" }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{plan.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(plan.status)} text-white`}>
                    {plan.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Last Updated:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{plan.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Last Drill:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{plan.lastDrill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Participation:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{plan.participation}</span>
                  </div>
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-rose-600 dark:text-rose-400 font-semibold hover:text-rose-700">
                    View Components
                  </summary>
                  <ul className="mt-3 space-y-1 pl-4">
                    {plan.keyComponents.map((comp, idx) => (
                      <li key={idx} className="text-slate-700 dark:text-slate-300">• {comp}</li>
                    ))}
                  </ul>
                </details>
              </GlassCard>
            ))}
          </div>
        </div>
      </GlassSection>
    </div>
  );
};

export default Expansion;
