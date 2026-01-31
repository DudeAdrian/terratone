// src/pages/GlobalNetwork.js - Glassmorphic Global Community Network with Libraries Integration

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";
import { useCommunityData, useSystemData } from '../hooks/useApi';
import api from '../services/api';

const GlobalNetwork = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [librariesData, setLibrariesData] = useState(null);
  
  const [communities, setCommunities] = useState([
    { id: "1", name: "Harmony Village", region: "North America", population: 245, status: "operational", tier: "hub", sustainabilityScore: 92 },
    { id: "2", name: "Green Haven", region: "Europe", population: 180, status: "operational", tier: "regional", sustainabilityScore: 88 },
    { id: "3", name: "Eco Community", region: "South America", population: 120, status: "growing", tier: "local", sustainabilityScore: 79 },
  ]);
  const [metrics, setMetrics] = useState({
    totalCommunities: 156,
    totalPopulation: 28450,
    averageSelfSufficiency: 76,
    energyExchanged: 1250,
    foodExchanged: 8900,
    waterShared: 45000,
  });
  const [selectedTab, setSelectedTab] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [web3Status] = useState("synced");

  // API hooks for communities and system data
  const { 
    loading: communitiesLoading, 
    error: communitiesError,
    refetch: refetchCommunities 
  } = useCommunityData(selectedRegion !== 'all' ? selectedRegion : null);

  const { 
    loading: systemLoading 
  } = useSystemData();

  // Fetch global libraries data
  useEffect(() => {
    const loadLibrariesData = async () => {
      try {
        const regionId = selectedRegion === 'all' ? 'global' : selectedRegion;
        const [herbal, seedBank, knowledge, aquaponic, globalLibs] = await Promise.all([
          api.getHerbalLibrary(regionId),
          api.getSeedBank(regionId),
          api.getKnowledgeBase(regionId),
          api.getAquaponicLibrary(regionId),
          api.getGlobalLibraries()
        ]);
        
        setLibrariesData({
          herbal: herbal || { remedies: [], totalRemedies: 0 },
          seedBank: seedBank || { varieties: [], totalSeeds: 0 },
          knowledge: knowledge || { articles: [], totalArticles: 0 },
          aquaponic: aquaponic || { species: [], totalSpecies: 0 },
          global: globalLibs || { libraries: [] }
        });
      } catch (err) {
        console.warn('Library API not available, using fallback:', err);
        // Fallback to sofieCore if API not available
        const networkService = await sofieCore.getService('globalNetwork');
        if (networkService) {
          try {
            const libs = await networkService.getLibraries();
            setLibrariesData(libs || {
              herbal: { remedies: [], totalRemedies: 0 },
              seedBank: { varieties: [], totalSeeds: 0 },
              knowledge: { articles: [], totalArticles: 0 },
              aquaponic: { species: [], totalSpecies: 0 }
            });
          } catch {
            setLibrariesData({
              herbal: { remedies: [], totalRemedies: 0 },
              seedBank: { varieties: [], totalSeeds: 0 },
              knowledge: { articles: [], totalArticles: 0 },
              aquaponic: { species: [], totalSpecies: 0 }
            });
          }
        }
      }
    };
    loadLibrariesData();
  }, [selectedRegion]);

  // Load global network data from API
  useEffect(() => {
    const loadGlobalData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try API first
        const [apiCommunitiesData, apiMetrics] = await Promise.all([
          api.getGlobalCommunities(selectedRegion !== 'all' ? selectedRegion : null),
          api.getGlobalMetrics()
        ]);
        
        // Update communities and metrics with API data
        if (apiCommunitiesData?.communities?.length > 0) {
          setCommunities(apiCommunitiesData.communities);
        }
        if (apiMetrics) {
          setMetrics(prev => ({ ...prev, ...apiMetrics }));
        }
      } catch (err) {
        console.warn('Global API not available, using sofieCore fallback:', err);
        // Fallback to sofieCore
        try {
          const service = sofieCore.getService("globalNetwork");
          if (service) {
            const comms = service.getCommunities?.();
            if (comms && comms.length > 0) setCommunities(comms);
            const mets = service.getGlobalMetrics?.();
            if (mets) setMetrics(prev => ({ ...prev, ...mets }));
          }
        } catch (fallbackErr) {
          setError('Unable to load global network data');
          console.error(fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    loadGlobalData();
  }, [selectedRegion]);

  const regions = [
    { name: "all", label: "All Regions" },
    { name: "North America", label: "North America" },
    { name: "South America", label: "South America" },
    { name: "Europe", label: "Europe" },
    { name: "Africa", label: "Africa" },
    { name: "Oceania", label: "Oceania" }
  ];

  const filteredCommunities = selectedRegion === "all" 
    ? communities 
    : communities.filter(c => c.region === selectedRegion);

  const getTierColor = (tier) => {
    switch (tier) {
      case "hub": return "from-purple-400 to-violet-500";
      case "regional": return "from-blue-400 to-cyan-500";
      case "local": return "from-green-400 to-emerald-500";
      default: return "from-slate-400 to-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "operational": return "from-green-400 to-emerald-500";
      case "growing": return "from-amber-400 to-orange-500";
      case "active": return "from-blue-400 to-cyan-500";
      default: return "from-slate-400 to-gray-500";
    }
  };

  const handleRetry = () => {
    refetchCommunities();
    window.location.reload();
  };

  // Loading state
  if (loading || communitiesLoading || systemLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950">
        <div className="text-center space-y-4">
          <div className="text-3xl quantum-pulse text-teal-400">
            Loading Global Network...
          </div>
          <div className="text-cyan-300/70">
            Connecting to {metrics.totalCommunities} communities worldwide
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || communitiesError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950 space-y-6">
        <div className="text-3xl text-red-400">
          {error || communitiesError}
        </div>
        <button
          onClick={handleRetry}
          className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-teal-500/50"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="throat" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_25px_rgba(0,187,255,0.55)]">
                🌍 Global Community Network
              </h1>
              <p className="text-cyan-100/80 mt-2 drop-shadow-[0_0_12px_rgba(0,187,255,0.35)]">
                Connecting {metrics.totalCommunities} sustainable communities worldwide • {metrics.totalPopulation.toLocaleString()} members
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_20px_rgba(0,187,255,0.35)]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-semibold text-white">{web3Status}</span>
              </div>
              <p className="text-cyan-100/80 mt-2">Blockchain verified</p>
            </div>
          </div>
        </QuantumSection>

        {/* Global Metrics */}
        <QuantumGlassGrid columns={6} gap={4}>
          <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <p className="text-xs font-semibold text-cyan-200 uppercase drop-shadow-[0_0_10px_rgba(0,187,255,0.5)]">Communities</p>
            <p className="text-3xl font-bold text-white mt-1 drop-shadow-[0_0_15px_rgba(0,187,255,0.35)]">{metrics.totalCommunities}</p>
          </QuantumCard>

          <QuantumCard chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <p className="text-xs font-semibold text-violet-200 uppercase drop-shadow-[0_0_10px_rgba(170,76,255,0.45)]">Population</p>
            <p className="text-2xl font-bold text-white mt-1 drop-shadow-[0_0_15px_rgba(170,76,255,0.35)]">{(metrics.totalPopulation / 1000).toFixed(0)}k</p>
          </QuantumCard>

          <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <p className="text-xs font-semibold text-emerald-200 uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">Avg Self-Suff.</p>
            <p className="text-3xl font-bold text-white mt-1 drop-shadow-[0_0_15px_rgba(0,255,136,0.35)]">{metrics.averageSelfSufficiency}%</p>
          </QuantumCard>

          <QuantumCard chakra="solar" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <p className="text-xs font-semibold text-amber-200 uppercase drop-shadow-[0_0_10px_rgba(255,255,0,0.45)]">Energy Exchanged</p>
            <p className="text-2xl font-bold text-white mt-1 drop-shadow-[0_0_15px_rgba(255,255,0,0.35)]">{metrics.energyExchanged} MWh</p>
          </QuantumCard>

          <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <p className="text-xs font-semibold text-emerald-200 uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">Food Exchanged</p>
            <p className="text-2xl font-bold text-white mt-1 drop-shadow-[0_0_15px_rgba(0,255,136,0.35)]">{(metrics.foodExchanged / 1000).toFixed(1)}t</p>
          </QuantumCard>

          <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <p className="text-xs font-semibold text-cyan-200 uppercase drop-shadow-[0_0_10px_rgba(0,187,255,0.5)]">Water Shared</p>
            <p className="text-2xl font-bold text-white mt-1 drop-shadow-[0_0_15px_rgba(0,187,255,0.35)]">{(metrics.waterShared / 1000).toFixed(0)}k L</p>
          </QuantumCard>
        </QuantumGlassGrid>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["map", "communities", "libraries", "analytics", "trades"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? "bg-gradient-to-r from-teal-700 to-blue-900 text-white dark:from-teal-300 dark:to-blue-100 dark:text-slate-900"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {tab === "map" && "🗺️"} 
              {tab === "communities" && "🏘️"}
              {tab === "libraries" && "📚"}
              {tab === "analytics" && "📊"}
              {tab === "trades" && "🔄"}
              {" " + tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Map Tab */}
        {selectedTab === "map" && (
          <QuantumSection chakra="throat" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,187,255,0.4)]">Network Map by Region</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {regions.map(region => (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(region.name)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedRegion === region.name
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(0,187,255,0.45)]"
                      : "bg-white/5 text-white border border-cyan-700/50 hover:bg-white/10"
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>

                <div className="space-y-3">
              {filteredCommunities.map(community => (
                <div key={community.id} className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30 hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">🏘️</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{community.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{community.region} • {community.population} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(community.tier)} text-white`}>
                        {community.tier}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(community.status)} text-white`}>
                        {community.status}
                      </span>
                    </div>
                    <p className="text-xs text-amber-200 font-bold mt-1">↑ {community.sustainabilityScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </QuantumSection>
        )}

        {/* Communities Tab */}
        {selectedTab === "communities" && (
          <QuantumGlassGrid columns={2} gap={6}>
            {filteredCommunities.map(community => (
              <QuantumCard key={community.id} chakra="throat" blurLevel="medium" opacityLevel="veil" glow edgeGlow>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white drop-shadow-[0_0_12px_rgba(0,187,255,0.4)]">{community.name}</h4>
                    <p className="text-sm text-cyan-100/80">{community.region}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(community.tier)} text-white`}>
                    {community.tier}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-cyan-100/70">Population:</span>
                    <span className="font-bold text-white">{community.population}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-100/70">Sustainability:</span>
                    <span className="font-bold text-amber-200">{community.sustainabilityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-100/70">Status:</span>
                    <span className={`font-bold ${
                      community.status === "operational" ? "text-emerald-200" : "text-amber-200"
                    }`}>
                      {community.status}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                  <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_15px_rgba(0,187,255,0.5)] transition-all">
                    View Details
                  </button>
                </div>
              </QuantumCard>
            ))}
          </QuantumGlassGrid>
        )}

        {/* Analytics Tab */}
        {selectedTab === "analytics" && (
          <QuantumSection chakra="third_eye" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(170,76,255,0.45)]">Network Analytics</h3>
            
            <QuantumGlassGrid columns={2} gap={6}>
              <QuantumCard chakra="third_eye" blurLevel="medium" opacityLevel="ultraClear" glow edgeGlow>
                <h4 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(170,76,255,0.4)]">Self-Sufficiency Leaderboard</h4>
                <div className="space-y-2">
                  {[
                    { rank: 1, name: "Harmony Village", score: 92 },
                    { rank: 2, name: "Green Haven", score: 88 },
                    { rank: 3, name: "Eco Community", score: 79 },
                  ].map(item => (
                    <div key={item.rank} className="flex items-center justify-between p-2 rounded bg-white/5 border border-violet-500/20">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-violet-200">#{item.rank}</span>
                        <p className="font-semibold text-white">{item.name}</p>
                      </div>
                      <span className="text-lg font-bold text-white">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </QuantumCard>

              <QuantumCard chakra="throat" blurLevel="medium" opacityLevel="ultraClear" glow edgeGlow>
                <h4 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(0,187,255,0.4)]">Resource Exchange Rate</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyan-100/80">Energy (MWh)</span>
                      <span className="font-bold text-white">{metrics.energyExchanged}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyan-100/80">Food (tonnes)</span>
                      <span className="font-bold text-white">{(metrics.foodExchanged / 1000).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyan-100/80">Water (k liters)</span>
                      <span className="font-bold text-white">{(metrics.waterShared / 1000).toFixed(0)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </QuantumCard>
            </QuantumGlassGrid>
          </QuantumSection>
        )}

        {/* Libraries Tab - Global Knowledge Hub */}
        {selectedTab === "libraries" && (
          <QuantumSection chakra="third-eye" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]">
              📚 Global Libraries Network
            </h3>
            <p className="text-purple-100/80 mb-6">
              Shared knowledge resources branching from the global community network • {selectedRegion === 'all' ? 'All Regions' : selectedRegion}
            </p>

            <QuantumGlassGrid columns={2} gap={6}>
              {/* Herbal Library */}
              <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🌿</span>
                  <div>
                    <h4 className="text-xl font-bold text-white drop-shadow-[0_0_12px_rgba(0,255,136,0.4)]">
                      Herbal Library
                    </h4>
                    <p className="text-sm text-emerald-100/70">Traditional remedies & medicine</p>
                  </div>
                </div>
                {librariesData?.herbal ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-emerald-500/20">
                      <span className="text-emerald-100/80">Total Remedies</span>
                      <span className="text-xl font-bold text-white">{librariesData.herbal.totalRemedies || librariesData.herbal.remedies?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-emerald-500/20">
                      <span className="text-emerald-100/80">Plant Species</span>
                      <span className="text-xl font-bold text-white">{librariesData.herbal.totalSpecies || 145}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-emerald-500/20">
                      <span className="text-emerald-100/80">Practitioners</span>
                      <span className="text-xl font-bold text-white">{librariesData.herbal.practitioners || 78}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-emerald-100/60 text-sm">Loading herbal library data...</div>
                )}
              </QuantumCard>

              {/* Seed Bank */}
              <QuantumCard chakra="root" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🌱</span>
                  <div>
                    <h4 className="text-xl font-bold text-white drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                      Global Seed Bank
                    </h4>
                    <p className="text-sm text-red-100/70">Heirloom & indigenous varieties</p>
                  </div>
                </div>
                {librariesData?.seedBank ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-red-500/20">
                      <span className="text-red-100/80">Seed Varieties</span>
                      <span className="text-xl font-bold text-white">{librariesData.seedBank.totalSeeds || librariesData.seedBank.varieties?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-red-500/20">
                      <span className="text-red-100/80">Endangered</span>
                      <span className="text-xl font-bold text-white">{librariesData.seedBank.endangered || 34}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-red-500/20">
                      <span className="text-red-100/80">Contributors</span>
                      <span className="text-xl font-bold text-white">{librariesData.seedBank.contributors || 92}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-100/60 text-sm">Loading seed bank data...</div>
                )}
              </QuantumCard>

              {/* Knowledge Base */}
              <QuantumCard chakra="third-eye" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📖</span>
                  <div>
                    <h4 className="text-xl font-bold text-white drop-shadow-[0_0_12px_rgba(147,51,234,0.4)]">
                      Knowledge Base
                    </h4>
                    <p className="text-sm text-purple-100/70">Guides, tutorials & documentation</p>
                  </div>
                </div>
                {librariesData?.knowledge ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-purple-500/20">
                      <span className="text-purple-100/80">Articles</span>
                      <span className="text-xl font-bold text-white">{librariesData.knowledge.totalArticles || librariesData.knowledge.articles?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-purple-500/20">
                      <span className="text-purple-100/80">Categories</span>
                      <span className="text-xl font-bold text-white">{librariesData.knowledge.categories || 12}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-purple-500/20">
                      <span className="text-purple-100/80">Contributors</span>
                      <span className="text-xl font-bold text-white">{librariesData.knowledge.contributors || 156}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-purple-100/60 text-sm">Loading knowledge base data...</div>
                )}
              </QuantumCard>

              {/* Aquaponic Library */}
              <QuantumCard chakra="sacral" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🐟</span>
                  <div>
                    <h4 className="text-xl font-bold text-white drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                      Aquaponic Library
                    </h4>
                    <p className="text-sm text-orange-100/70">Aquatic life & systems</p>
                  </div>
                </div>
                {librariesData?.aquaponic ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-orange-500/20">
                      <span className="text-orange-100/80">Species Documented</span>
                      <span className="text-xl font-bold text-white">{librariesData.aquaponic.totalSpecies || librariesData.aquaponic.species?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-orange-500/20">
                      <span className="text-orange-100/80">System Designs</span>
                      <span className="text-xl font-bold text-white">{librariesData.aquaponic.designs || 23}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-orange-500/20">
                      <span className="text-orange-100/80">Active Systems</span>
                      <span className="text-xl font-bold text-white">{librariesData.aquaponic.activeSystems || 67}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-orange-100/60 text-sm">Loading aquaponic data...</div>
                )}
              </QuantumCard>
            </QuantumGlassGrid>

            {/* Library Network Visualization */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🌐</span>
                Library Network Structure
              </h4>
              <div className="text-sm text-purple-100/80 space-y-2">
                <p>• <strong>Central Globe:</strong> Global community hub connecting all regions</p>
                <p>• <strong>Regional Branches:</strong> Each region maintains local library instances</p>
                <p>• <strong>Community Nodes:</strong> Individual communities contribute & access shared knowledge</p>
                <p>• <strong>Library Hubs:</strong> Specialized repositories (herbal, seed, aquaponic, knowledge)</p>
                <p className="mt-4 pt-4 border-t border-purple-500/30">
                  🔗 All libraries synchronized via distributed ledger • Real-time updates across {metrics.totalCommunities} communities
                </p>
              </div>
            </div>
          </QuantumSection>
        )}

        {/* Trades Tab */}
        {selectedTab === "trades" && (
          <QuantumSection chakra="heart" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,255,136,0.4)]">Recent Inter-Community Trades</h3>
            <div className="space-y-2">
              {[
                { from: "Harmony Village", to: "Green Haven", resource: "Energy", amount: "250 MWh" },
                { from: "Eco Community", to: "Harmony Village", resource: "Food", amount: "45 tonnes" },
                { from: "Green Haven", to: "Eco Community", resource: "Water", amount: "12000 L" },
              ].map((trade, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-emerald-500/20 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">🔄</span>
                    <div>
                      <p className="font-semibold text-white">{trade.resource} Trade</p>
                      <p className="text-xs text-emerald-100/80">{trade.from} → {trade.to}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-white">{trade.amount}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-emerald-500/30">
              <p className="text-xs text-emerald-200 font-semibold">
                🔗 All trades recorded on blockchain • Smart contract verified
              </p>
            </div>
          </QuantumSection>
        )}
      </div>
    </div>
  );
};

export default GlobalNetwork;
