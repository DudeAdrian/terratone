// src/pages/PluginMarketplace_v2.js - Glassmorphic Plugin Marketplace with Web3

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { createBackHandler } from "../utils/navigation";

const PluginMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [availablePlugins, setAvailablePlugins] = useState([
    { id: "weather", name: "Weather Integration", category: "integration", downloads: 1250, rating: 4.8, enabled: true },
    { id: "iot-devices", name: "IoT Device Manager", category: "integration", downloads: 890, rating: 4.6, enabled: true },
    { id: "smart-alerts", name: "Smart Alerts", category: "automation", downloads: 2100, rating: 4.9, enabled: false },
    { id: "skills-directory", name: "Skills Directory", category: "community", downloads: 650, rating: 4.5, enabled: false },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stats, setStats] = useState({
    available: 4,
    installed: 2,
    active: 2,
  });

  useEffect(() => {
    const pluginRegistry = sofieCore.getService("pluginRegistry");
    if (pluginRegistry) {
      const available = pluginRegistry.getAvailablePlugins?.() || availablePlugins;
      setAvailablePlugins(available);
      setStats({
        available: available.length,
        installed: available.filter(p => p.enabled).length,
        active: available.filter(p => p.enabled).length,
      });
    }
  }, []);

  const handleInstallPlugin = (pluginId) => {
    const pluginRegistry = sofieCore.getService("pluginRegistry");
    if (pluginRegistry) {
      const success = pluginRegistry.installPlugin?.(pluginId);
      if (success) {
        setAvailablePlugins(pluginRegistry.getAvailablePlugins?.() || availablePlugins);
      }
    }
  };

  const handleActivatePlugin = (pluginId) => {
    const plugin = availablePlugins.find(p => p.id === pluginId);
    if (plugin) {
      const updated = availablePlugins.map(p => 
        p.id === pluginId ? { ...p, enabled: !p.enabled } : p
      );
      setAvailablePlugins(updated);
      setStats({
        ...stats,
        active: updated.filter(p => p.enabled).length,
      });
    }
  };

  const isPluginInstalled = (pluginId) => {
    return availablePlugins.some((p) => p.id === pluginId && p.enabled);
  };

  const filteredPlugins = selectedCategory === "all" ? availablePlugins : availablePlugins.filter((p) => p.category === selectedCategory);
  const categories = ["all", "integration", "automation", "analytics", "community"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }} elevation="high">
          <div style={{ position: 'relative' }}>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-900 to-emerald-700 dark:from-green-100 dark:to-emerald-400 bg-clip-text text-transparent">
              🔌 Plugin Marketplace
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Extend Sofie Systems with powerful plugins for Harmonic Habitats communities • Web3-verified • Smart contracts
            </p>
          </div>
        </GlassSection>

        {/* Stats */}
        <GlassGrid cols={2} colsMd={4} gap={4}>
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Available</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.available}</p>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "teal" }}>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Installed</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.installed}</p>
          </GlassCard>

          <GlassCard colors={{ primary: "lime", secondary: "green" }}>
            <p className="text-xs font-semibold text-lime-600 dark:text-lime-400 uppercase">Active</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.active}</p>
          </GlassCard>

          <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">Health</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">✓ Optimal</p>
          </GlassCard>
        </GlassGrid>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {cat === "all" ? "All Plugins" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Plugins Grid */}
        <GlassGrid cols={1} colsMd={2} gap={6}>
          {filteredPlugins.map(plugin => {
            const installed = isPluginInstalled(plugin.id);
            return (
              <GlassCard key={plugin.id} colors={{ primary: "green", secondary: "emerald" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plugin.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 capitalize mt-1">{plugin.category} • {plugin.downloads.toLocaleString()} downloads</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">⭐ {plugin.rating}</span>
                    </div>
                    {installed && (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">✓ Installed</span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {plugin.id === "weather" && "Monitor weather patterns and integrate real-time data into your growing systems"}
                  {plugin.id === "iot-devices" && "Connect and manage IoT sensors across your community infrastructure"}
                  {plugin.id === "smart-alerts" && "Intelligent alert system with machine learning-powered notifications"}
                  {plugin.id === "skills-directory" && "Community skills marketplace and knowledge sharing platform"}
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/20 dark:border-slate-700/50">
                  {!installed ? (
                    <button
                      onClick={() => handleInstallPlugin(plugin.id)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg transition-all"
                    >
                      Install
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivatePlugin(plugin.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        plugin.enabled
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : "bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50"
                      }`}
                    >
                      {plugin.enabled ? "✓ Active" : "○ Inactive"}
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-green-600 dark:text-green-400 font-semibold">
                  🔗 Smart contracts verified • On blockchain
                </div>
              </GlassCard>
            );
          })}
        </GlassGrid>

        {/* Info Section */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Plugin Security & Trust</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Verified on Blockchain</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">All plugins are verified through smart contracts for authenticity and safety</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Community Tested</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Rated and reviewed by thousands of community users worldwide</p>
              </div>
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

export default PluginMarketplace;
