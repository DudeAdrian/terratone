import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useCommunityData } from "../hooks/useApi";

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const communityData = useCommunityData("default");

  const mockStats = {
    totalListings: 127,
    activeListings: 98,
    totalTransactions: 354,
    totalItemsTraded: 2847
  };

  const mockListings = [
    { id: 1, title: "Organic Tomatoes", category: "food", quantity: 45, unit: "kg", description: "Fresh heirloom tomatoes from Zone 3", status: "available", provider: "Green Garden Co" },
    { id: 2, title: "Excess Solar Energy", category: "energy", quantity: 120, unit: "kWh", description: "Thursday-Sunday surplus capacity", status: "available", provider: "Solar Collective" },
    { id: 3, title: "Carpentry Services", category: "skills", quantity: 1, unit: "project", description: "Raised beds, compost bins, storage", status: "available", provider: "BuildTech" }
  ];

  useEffect(() => {
    const marketplaceService = sofieCore.getService("marketplace");
    if (marketplaceService) {
      setListings(marketplaceService.getListings?.() || mockListings);
      setStats(marketplaceService.getStats?.() || mockStats);
    } else {
      setListings(mockListings);
      setStats(mockStats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const apiResourcesRaw = communityData.resources?.data;
      const apiSkillsRaw = communityData.skills?.data;
      const apiEvents = communityData.events?.data;

      const resourceListings = Array.isArray(apiResourcesRaw?.resources)
        ? apiResourcesRaw.resources
        : Array.isArray(apiResourcesRaw)
          ? apiResourcesRaw
          : [];

      const skillListings = Array.isArray(apiSkillsRaw?.skills)
        ? apiSkillsRaw.skills
        : Array.isArray(apiSkillsRaw)
          ? apiSkillsRaw
          : [];

      const mappedResources = resourceListings.map((res, idx) => ({
        id: res.id || res.resourceId || `resource-${idx}`,
        title: res.name || res.title || "Community Resource",
        category: (res.type || "materials").toLowerCase(),
        quantity: typeof res.available === "number" ? res.available : 1,
        unit: res.unit || res.measure || "units",
        description: res.description || "Shared community resource",
        status: res.available === false ? "unavailable" : "available",
        provider: res.owner || res.provider || "Community"
      }));

      const mappedSkills = skillListings.map((skill, idx) => ({
        id: skill.id || skill.skillId || `skill-${idx}`,
        title: skill.name || skill.skill || "Skill Offer",
        category: "skills",
        quantity: 1,
        unit: skill.proficiency || "skill",
        description: skill.description || skill.details || "Community skill offering",
        status: "available",
        provider: skill.provider || skill.userId || skill.offeredBy || "Community Member"
      }));

      const combined = [...mappedResources, ...mappedSkills];

      if (combined.length > 0) {
        const activeListings = combined.filter(l => l.status !== "unavailable" && l.status !== "inactive");
        const totalItemsTraded = combined.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);
        const baseStats = Object.keys(stats || {}).length > 0 ? stats : mockStats;

        setListings(combined);
        setStats({
          totalListings: combined.length,
          activeListings: activeListings.length,
          totalTransactions: Array.isArray(apiEvents) ? apiEvents.length : baseStats.totalTransactions || 0,
          totalItemsTraded: totalItemsTraded || baseStats.totalItemsTraded || 0
        });
        setError(null);
      }

      if (communityData.resources?.error || communityData.skills?.error || communityData.events?.error) {
        setError(
          communityData.resources?.error?.message ||
          communityData.skills?.error?.message ||
          communityData.events?.error?.message ||
          "Failed to load marketplace data"
        );
      }

      setLoading(communityData.isLoading);
    } catch (err) {
      console.error("Error loading marketplace data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [
    communityData.resources?.data,
    communityData.skills?.data,
    communityData.events?.data,
    communityData.isLoading,
    communityData.resources?.error,
    communityData.skills?.error,
    communityData.events?.error
  ]);

  const categories = ["all", "food", "energy", "tools", "skills", "materials"];
  const filteredListings = selectedCategory === "all" ? listings : listings.filter(l => l.category === selectedCategory);

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case "food": return "🥬";
      case "energy": return "⚡";
      case "tools": return "🔧";
      case "skills": return "🎓";
      case "materials": return "📦";
      default: return "📌";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-teal-500 border-t-transparent rounded-full mr-3"></div>
            Loading marketplace data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "teal" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => communityData.resources?.refetch?.() || communityData.skills?.refetch?.() || communityData.events?.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "teal", secondary: "cyan" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              🛒 Community Marketplace
            </h1>
            <p className="text-lg text-teal-700 dark:text-teal-200 max-w-2xl">
              Trade resources, share skills, and exchange goods within the community network
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-teal-100/50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium backdrop-blur-sm">
                💱 Peer-to-Peer Trading
              </span>
              <span className="px-4 py-2 bg-cyan-100/50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🔄 Resource Sharing
              </span>
              <span className="px-4 py-2 bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🌱 Circular Economy
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Listings</div>
              <div className="text-5xl font-bold text-teal-600 dark:text-teal-400">{stats.totalListings || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">All-time</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "cyan", secondary: "teal" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Active Now</div>
              <div className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">{stats.activeListings || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Available to trade</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "indigo" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Transactions</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTransactions || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Completed trades</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Items Traded</div>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">{stats.totalItemsTraded || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Total exchanged</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Tabs & Filters */}
        <GlassSection colors={{ primary: "teal", secondary: "cyan" }}>
          <div className="flex flex-wrap border-b border-teal-300/30 dark:border-teal-700/30 backdrop-blur-sm">
            {["listings", "transactions", "sellers"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-teal-400/40 to-teal-300/20 dark:from-teal-600/50 dark:to-teal-700/30 text-teal-700 dark:text-teal-300 border-b-2 border-teal-600 dark:border-teal-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-200/10 dark:hover:bg-teal-700/10"
                }`}
              >
                {tab === "listings" && "📌"}
                {tab === "transactions" && "📊"}
                {tab === "sellers" && "👥"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="p-4 md:p-8 border-b border-teal-200/30 dark:border-teal-700/30 flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white"
                    : "bg-teal-100/30 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200/50"
                }`}
              >
                {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "listings" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredListings.map(listing => (
                  <GlassCard key={listing.id} colors={{ primary: "teal", secondary: "cyan" }}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{listing.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{listing.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-teal-100/50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-xs font-bold whitespace-nowrap ml-3">
                          {listing.status}
                        </span>
                      </div>
                      <div className="bg-gray-100/30 dark:bg-gray-700/30 rounded-lg p-4 mb-4">
                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          {listing.quantity} <span className="text-sm text-gray-600 dark:text-gray-400">{listing.unit}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">By: <span className="font-bold text-gray-900 dark:text-white">{listing.provider}</span></p>
                        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all">
                          Trade
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              {filteredListings.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No listings in this category
                </div>
              )}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="p-8 space-y-4">
              {[
                { item: "Organic Produce Box", from: "Green Garden", to: "Community Hub", date: "Today", status: "completed" },
                { item: "Solar Energy Credits", from: "Solar Collective", to: "3 households", date: "Yesterday", status: "completed" },
                { item: "Tool Rental (Chainsaw)", from: "BuildTech", to: "Water Zone Maintenance", date: "2 days ago", status: "completed" }
              ].map((tx, idx) => (
                <GlassCard key={idx} colors={{ primary: "teal", secondary: "cyan" }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{tx.item}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {tx.from} → {tx.to}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                        ✓ {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{tx.date}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {activeTab === "sellers" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "Green Garden Co", location: "Zone 3", rating: 4.8, items: 24 },
                  { name: "Solar Collective", location: "Central Grid", rating: 4.9, items: 18 },
                  { name: "BuildTech", location: "Workshop Hub", rating: 4.7, items: 31 },
                  { name: "Aqua Systems", location: "Water Station", rating: 4.6, items: 12 }
                ].map((seller, idx) => (
                  <GlassCard key={idx} colors={{ primary: "cyan", secondary: "teal" }}>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{seller.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <p>📍 {seller.location}</p>
                        <p>⭐ {seller.rating} rating</p>
                        <p>📦 {seller.items} items listed</p>
                      </div>
                      <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
                        View All Items
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </GlassSection>

      </div>
    </div>
  );
};

export default Marketplace;
