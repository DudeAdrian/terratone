// src/pages/SeedBank.js - Glassmorphic Food Domain (Green/Olive)

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassButton, GlassSection, GlassContainer, GlassGrid } from "../theme/GlassmorphismTheme";
import { useSeedBankData } from "../hooks/useApi";

const SeedBank = () => {
  const [seedService, setSeedService] = useState(null);
  const [inventory, setInventory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("vegetables");
  const [activeTab, setActiveTab] = useState("inventory");
  const [categories, setCategories] = useState([]);

  // API hook
  const { data: seedData, loading: seedLoading, error: seedError, refetch: refetchSeeds } = useSeedBankData();

  useEffect(() => {
    if (seedData) {
      // Use API data when available
      const varieties = seedData.varieties || seedData.seedBank?.varieties || [];
      const invByCategory = varieties.reduce((acc, variety) => {
        const cat = variety.category || 'vegetables';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(variety);
        return acc;
      }, {});
      setInventory(invByCategory);
      setCategories(Object.keys(invByCategory).length > 0 ? Object.keys(invByCategory) : ["vegetables", "herbs", "microgreens", "fruits", "legumes"]);
    } else {
      // Fallback to sofieCore
      const service = sofieCore.getService("seedBank");
      setSeedService(service);
      
      if (service) {
        if (service.getInventory) {
          setInventory(service.getInventory());
        }
        if (service.getCategories) {
          const cats = service.getCategories();
          setCategories(Array.isArray(cats) ? cats : Object.keys(cats || {}));
        } else {
          setCategories(["vegetables", "herbs", "microgreens", "fruits", "legumes"]);
        }
      }
    }
  }, [seedData]);

  const currentInventory = inventory[selectedCategory] || [];
  const totalSeeds = Object.values(inventory).reduce((sum, cat) => sum + (Array.isArray(cat) ? cat.length : 0), 0);
  const availableSeeds = currentInventory.filter((seed) => seed.available !== false).length;

  const getHealthColor = (viability) => {
    if (viability >= 90) return "bg-green-500/30 dark:bg-green-700/40 border-green-500/50 dark:border-green-600/50 text-green-800 dark:text-green-300";
    if (viability >= 70) return "bg-yellow-500/30 dark:bg-yellow-700/40 border-yellow-500/50 dark:border-yellow-600/50 text-yellow-800 dark:text-yellow-300";
    return "bg-red-500/30 dark:bg-red-700/40 border-red-500/50 dark:border-red-600/50 text-red-800 dark:text-red-300";
  };

  // Loading state
  if (seedLoading && !seedService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
        <div className="text-center space-y-4">
          <div className="text-3xl quantum-pulse text-green-600 dark:text-green-400">
            Loading Seed Bank...
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Retrieving seed varieties and inventory data
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (seedError && !seedService) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 space-y-6">
        <div className="text-3xl text-red-500 dark:text-red-400">
          {seedError}
        </div>
        <button
          onClick={refetchSeeds}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-green-500/50"
        >
          Retry Loading Seed Bank
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "green", secondary: "yellow" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              🌱 Seed Bank Management
            </h1>
            <p className="text-lg text-green-700 dark:text-green-200 max-w-2xl">
              Manage your seed inventory with viability tracking and optimal storage conditions
            </p>
          </div>
        </GlassSection>

        {/* Overview Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "green", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Seeds</div>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">{totalSeeds}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">varieties stored</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "blue", secondary: "blue" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Categories</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{categories.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">seed types</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "yellow", secondary: "yellow" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Available</div>
              <div className="text-5xl font-bold text-yellow-600 dark:text-yellow-400">{availableSeeds}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">in current category</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "emerald" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Viability Avg</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">87%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">germination rate</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Main Content */}
        <GlassSection colors={{ primary: "green", secondary: "yellow" }}>
          <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap border-b border-green-300/30 dark:border-green-700/30 backdrop-blur-sm overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-gradient-to-b from-green-400/40 to-green-300/20 dark:from-green-600/50 dark:to-green-700/30 text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400"
                      : "text-gray-700 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 hover:bg-green-200/10 dark:hover:bg-green-700/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Seed Inventory Grid */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{selectedCategory} Seeds</h3>
                
                {currentInventory.length > 0 ? (
                  <GlassGrid cols={1} colsMd={2} colsMd={3} gap={5}>
                    {currentInventory.map((seed, idx) => (
                      <GlassCard key={idx} colors={{ primary: "green", secondary: "yellow" }}>
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-800 dark:text-white">{seed.name || "Unknown Seed"}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">{seed.scientificName || ""}</p>
                            </div>
                            {seed.available === false && (
                              <span className="px-3 py-1 rounded-lg bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-bold">Out of Stock</span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {/* Viability Progress */}
                            <div>
                              <div className="flex justify-between mb-2">
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Viability</p>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm ${getHealthColor(seed.viability || 85)}`}>
                                  {seed.viability || 85}%
                                </span>
                              </div>
                              <div className="bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${seed.viability || 85}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Storage Info */}
                            <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Quantity</span>
                                <span className="font-bold text-gray-800 dark:text-white">{seed.quantity || 0} packets</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Stored Since</span>
                                <span className="font-bold text-gray-800 dark:text-white">{seed.storedDate || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Expiration</span>
                                <span className="font-bold text-gray-800 dark:text-white">{seed.expirationDate || "N/A"}</span>
                              </div>
                            </div>

                            {/* Storage Conditions */}
                            <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Optimal Storage</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{seed.storageTemperature || "15-20°C"} | {seed.storageHumidity || "30-40%"} humidity</p>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </GlassGrid>
                ) : (
                  <GlassCard colors={{ primary: "green", secondary: "yellow" }}>
                    <div className="p-12 text-center">
                      <p className="text-gray-600 dark:text-gray-400 text-lg">No seeds in this category</p>
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </GlassSection>

        {/* Storage Best Practices */}
        <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">💡 Optimal Seed Storage Guidelines</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">Temperature</h4>
                <p className="text-base text-gray-700 dark:text-gray-300">Keep seeds in a cool environment between 15-20°C. Lower temperatures extend viability significantly.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">Humidity</h4>
                <p className="text-base text-gray-700 dark:text-gray-300">Maintain 30-40% humidity levels. Use silica gel packets to prevent moisture damage and fungal growth.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">Light</h4>
                <p className="text-base text-gray-700 dark:text-gray-300">Store in dark conditions away from direct sunlight. Use opaque containers to protect seed viability.</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SeedBank;
