import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useCommunityData } from "../hooks/useApi";

const CommunityNetwork = () => {
  const [communities, setCommunities] = useState([]);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("communities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const communityData = useCommunityData("default");

  useEffect(() => {
    const networkService = sofieCore.getService("communityNetwork");
    if (networkService) {
      setCommunities(networkService.getCommunities?.() || mockCommunities);
      setStats(networkService.getNetworkStats?.() || { totalCommunities: 12, avgSustainabilityScore: 78, totalConnections: 45, totalCollaborations: 18 });
      setLoading(false);
    } else {
      setCommunities(mockCommunities);
      setStats({ totalCommunities: 12, avgSustainabilityScore: 78, totalConnections: 45, totalCollaborations: 18 });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const apiResources = communityData.resources?.data;
      const apiEvents = communityData.events?.data;
      const apiSkills = communityData.skills?.data;

      const communitiesFromResources = Array.isArray(apiResources?.communities)
        ? apiResources.communities
        : Array.isArray(apiResources)
          ? apiResources
          : [];

      const communitiesFromEvents = Array.isArray(apiEvents)
        ? apiEvents
            .map((ev, idx) => ({
              id: ev.communityId || ev.id || `event-${idx}`,
              name: ev.communityName || ev.title || ev.name,
              location: ev.location || "",
              sustainabilityScore: ev.sustainabilityScore,
              population: ev.attendance || ev.participants,
              founded: ev.date?.slice(0, 4),
              focusAreas: ev.focusAreas || ev.tags || [],
            }))
            .filter((c) => c.name)
        : [];

      const apiCommunities = communitiesFromResources.length > 0
        ? communitiesFromResources
        : communitiesFromEvents;

      if (apiCommunities.length > 0) {
        setCommunities(apiCommunities);
        const totalCommunities = apiCommunities.length;
        const avgSustainabilityScore = apiCommunities.reduce((sum, c) => sum + (c.sustainabilityScore || 0), 0) / totalCommunities || 0;
        const totalConnections = Array.isArray(apiSkills) ? apiSkills.length : stats.totalConnections || 0;
        const totalCollaborations = Array.isArray(apiEvents) ? apiEvents.length : stats.totalCollaborations || 0;
        setStats({
          totalCommunities,
          avgSustainabilityScore,
          totalConnections,
          totalCollaborations,
        });
        setError(null);
      }

      if (communityData.resources?.error || communityData.events?.error || communityData.skills?.error) {
        setError(
          communityData.resources?.error?.message ||
          communityData.events?.error?.message ||
          communityData.skills?.error?.message ||
          "Failed to load community data"
        );
      }

      setLoading(communityData.isLoading);
    } catch (err) {
      console.error("Error loading community data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [communityData.resources?.data, communityData.events?.data, communityData.skills?.data, communityData.isLoading, communityData.resources?.error, communityData.events?.error, communityData.skills?.error]);

  const mockCommunities = [
    { id: 1, name: "Harmony Farm Collective", location: "Pacific Northwest", sustainabilityScore: 82, population: 48, founded: 2019, focusAreas: ["Food", "Energy", "Water"] },
    { id: 2, name: "Urban Green Initiative", location: "Portland, OR", sustainabilityScore: 75, population: 62, founded: 2020, focusAreas: ["Urban Farming", "Community"] }
  ];

  const filteredCommunities = (communities || []).filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "teal", secondary: "green" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-teal-500 border-t-transparent rounded-full mr-3"></div>
            Loading community data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "teal" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => communityData.resources?.refetch?.() || communityData.events?.refetch?.() || communityData.skills?.refetch?.() || window.location.reload()}
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "teal", secondary: "green" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              🌐 Harmonic Communities Network
            </h1>
            <p className="text-lg text-teal-700 dark:text-teal-200 max-w-2xl">
              Connect, collaborate, and share knowledge with sustainable communities worldwide
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-teal-100/50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🤝 Global Network
              </span>
              <span className="px-4 py-2 bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                💡 Knowledge Sharing
              </span>
              <span className="px-4 py-2 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🔗 Partnerships
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Key Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "teal", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Communities</div>
              <div className="text-5xl font-bold text-teal-600 dark:text-teal-400">{stats.totalCommunities || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Connected globally</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "green", secondary: "teal" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Avg Score</div>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">{Math.round(stats.avgSustainabilityScore || 0)}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Sustainability</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Connections</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{stats.totalConnections || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Active links</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "purple", secondary: "indigo" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Collaborations</div>
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">{stats.totalCollaborations || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Projects running</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Tabs */}
        <GlassSection colors={{ primary: "teal", secondary: "green" }}>
          <div className="flex flex-wrap border-b border-teal-300/30 dark:border-teal-700/30 backdrop-blur-sm">
            {["communities", "collaborations", "resources"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-teal-400/40 to-teal-300/20 dark:from-teal-600/50 dark:to-teal-700/30 text-teal-700 dark:text-teal-300 border-b-2 border-teal-600 dark:border-teal-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-200/10 dark:hover:bg-teal-700/10"
                }`}
              >
                {tab === "communities" && "🌍"}
                {tab === "collaborations" && "🤝"}
                {tab === "resources" && "📚"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Communities Tab */}
          {activeTab === "communities" && (
            <div className="p-8">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search communities by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-teal-300/30 dark:border-teal-700/30 focus:outline-none focus:border-teal-500 backdrop-blur-sm"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCommunities.map((community) => (
                  <GlassCard key={community.id} colors={{ primary: "teal", secondary: "green" }}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{community.name}</h3>
                        <span className="px-3 py-1 bg-teal-100/50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-bold">
                          {community.sustainabilityScore}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        📍 {community.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        👥 {community.population} members • Founded {community.founded}
                      </p>
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Focus Areas:</p>
                        <div className="flex flex-wrap gap-2">
                          {community.focusAreas?.map((area) => (
                            <span key={area} className="bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200">
                        Connect
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
              {filteredCommunities.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No communities match your search
                </div>
              )}
            </div>
          )}

          {/* Collaborations Tab */}
          {activeTab === "collaborations" && (
            <div className="p-8 space-y-5">
              {[
                { title: "Seed Exchange Initiative", partners: 4, status: "active", progress: 65 },
                { title: "Water Conservation Network", partners: 6, status: "active", progress: 78 },
                { title: "Energy Sharing Grid", partners: 5, status: "planning", progress: 35 }
              ].map((collab, idx) => (
                <GlassCard key={idx} colors={{ primary: "green", secondary: "teal" }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">{collab.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        collab.status === "active" 
                          ? "bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                      }`}>
                        {collab.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">👥 {collab.partners} partner communities</p>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{collab.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${collab.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: "📖", title: "Knowledge Base", items: 127, desc: "Shared articles and guides" },
                  { icon: "🎓", title: "Training Programs", items: 18, desc: "Educational courses" },
                  { icon: "🛠️", title: "Tools & Templates", items: 45, desc: "Ready-to-use resources" },
                  { icon: "📊", title: "Data Sharing", items: 89, desc: "Metrics and analytics" }
                ].map((resource, idx) => (
                  <GlassCard key={idx} colors={{ primary: "teal", secondary: "green" }}>
                    <div className="p-6 text-center">
                      <div className="text-4xl mb-3">{resource.icon}</div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">{resource.items}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{resource.desc}</p>
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

export default CommunityNetwork;
