import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useCommunityData, useWellnessDataAPI } from "../hooks/useApi";

const Wellness = () => {
  const communityData = useCommunityData("default");
  const { data: apiWellnessData, loading: apiLoading, error: apiError, refetch } = useWellnessDataAPI("default");
  
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("programs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use API data or fallback to sofieCore
  useEffect(() => {
    if (apiWellnessData) {
      setPrograms(apiWellnessData.programs || []);
      setEvents(apiWellnessData.events || []);
      setResources(apiWellnessData.resources || []);
      setStats(apiWellnessData.stats || {});
      setError(null);
      setLoading(false);
    } else if (!apiLoading) {
      // Fallback to sofieCore
      const wellnessService = sofieCore.getService("wellness");
      if (wellnessService) {
        setPrograms(wellnessService.getWellnessPrograms() || []);
        setEvents(wellnessService.getCommunityEvents() || []);
        setResources(wellnessService.getWellnessResources() || []);
        setStats(wellnessService.getWellnessStats() || {});
      }
      setLoading(false);
    }
    if (apiError) setError(apiError);
  }, [apiWellnessData, apiLoading, apiError]);

  useEffect(() => {
    try {
      const wellnessPayload = communityData.wellness?.data;
      const resourcesPayload = communityData.resources?.data;
      const eventsPayload = communityData.events?.data;

      const apiPrograms = Array.isArray(wellnessPayload?.programs)
        ? wellnessPayload.programs
        : Array.isArray(wellnessPayload)
          ? wellnessPayload
          : [];

      const apiEvents = Array.isArray(wellnessPayload?.events)
        ? wellnessPayload.events
        : Array.isArray(eventsPayload)
          ? eventsPayload
          : Array.isArray(eventsPayload?.events)
            ? eventsPayload.events
            : [];

      const apiResources = Array.isArray(wellnessPayload?.resources)
        ? wellnessPayload.resources
        : Array.isArray(resourcesPayload?.resources)
          ? resourcesPayload.resources
          : Array.isArray(resourcesPayload)
            ? resourcesPayload
            : [];

      if (apiPrograms.length || apiEvents.length || apiResources.length) {
        setPrograms(apiPrograms.length ? apiPrograms : programs);
        setEvents(apiEvents.length ? apiEvents : events);
        setResources(apiResources.length ? apiResources : resources);

        const apiStats = wellnessPayload?.stats || resourcesPayload?.stats || {};
        const derivedStats = {
          activePrograms: apiStats.activePrograms || apiPrograms.length || stats.activePrograms,
          totalParticipants: apiStats.totalParticipants || stats.totalParticipants,
          upcomingEvents: apiStats.upcomingEvents || apiEvents.length || stats.upcomingEvents,
          wellnessScore: apiStats.wellnessScore || stats.wellnessScore,
        };
        setStats({ ...stats, ...derivedStats });
        setError(null);
      }

      if (communityData.wellness?.error || communityData.resources?.error || communityData.events?.error) {
        setError(
          communityData.wellness?.error?.message ||
          communityData.resources?.error?.message ||
          communityData.events?.error?.message ||
          "Failed to load wellness data"
        );
      }

      setLoading(communityData.isLoading);
    } catch (err) {
      console.error("Error loading wellness data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [communityData.wellness?.data, communityData.resources?.data, communityData.events?.data, communityData.isLoading, communityData.wellness?.error, communityData.resources?.error, communityData.events?.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full mr-3"></div>
            Loading wellness data...
          </div>
        </GlassCard>

        if (error) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 flex items-center justify-center p-4">
              <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
                <div className="p-8 text-center">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Wellness Data</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
                  <button 
                    onClick={refetch}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Retry
                  </button>
                </div>
              </GlassCard>
            </div>
          );
        }
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "emerald" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => communityData.wellness?.refetch?.() || communityData.events?.refetch?.() || communityData.resources?.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "emerald", secondary: "green" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              🧘 Community Wellness
            </h1>
            <p className="text-lg text-emerald-700 dark:text-emerald-200 max-w-2xl">
              Health, wellbeing, and community connection programs with verified wellness metrics
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium backdrop-blur-sm">
                💪 Active Programs
              </span>
              <span className="px-4 py-2 bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                👥 Community Events
              </span>
              <span className="px-4 py-2 bg-teal-100/50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📊 Wellness Tracking
              </span>
              <Link
                to="/wellness-intake"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-semibold hover:opacity-90"
              >
                🧾 Start Intake
              </Link>
            </div>
          </div>
        </GlassSection>

        {/* Key Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Active Programs</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{stats.activePrograms || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Running now</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Participants</div>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">{stats.totalParticipants || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Community members</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Upcoming Events</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{stats.upcomingEvents || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Next month</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "violet", secondary: "purple" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Wellness Score</div>
              <div className="text-5xl font-bold text-violet-600 dark:text-violet-400">{stats.wellnessScore || 0}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Community avg</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Tabs */}
        <GlassSection colors={{ primary: "emerald", secondary: "green" }}>
          <div className="flex flex-wrap border-b border-emerald-300/30 dark:border-emerald-700/30 backdrop-blur-sm">
            {["programs", "events", "resources"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-emerald-400/40 to-emerald-300/20 dark:from-emerald-600/50 dark:to-emerald-700/30 text-emerald-700 dark:text-emerald-300 border-b-2 border-emerald-600 dark:border-emerald-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-200/10 dark:hover:bg-emerald-700/10"
                }`}
              >
                {tab === "programs" && "💪"}
                {tab === "events" && "📅"}
                {tab === "resources" && "📚"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Programs Tab */}
          {activeTab === "programs" && (
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {programs.slice(0, 6).map((program) => (
                  <GlassCard key={program.id} colors={{ primary: "emerald", secondary: "green" }}>
                    <div className="p-6 min-h-[240px] flex flex-col">
                      <div className="text-5xl mb-4">
                        {program.type === "physical" && "🏃"}
                        {program.type === "mental" && "🧠"}
                        {program.type === "educational" && "📖"}
                        {program.type === "social" && "🤝"}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{program.name}</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-1">{program.description}</p>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <p>📍 {program.frequency}</p>
                        <p>👥 {program.participants} members</p>
                      </div>
                      <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 backdrop-blur-sm">
                        Join Now
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
              {programs.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No wellness programs available yet
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="p-8 space-y-5">
              {events.slice(0, 5).map((event) => (
                <GlassCard key={event.id} colors={{ primary: "emerald", secondary: "green" }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.name}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                          📅 {event.date}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold capitalize">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      👥 {event.participants} registered
                    </p>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200">
                      Register
                    </button>
                  </div>
                </GlassCard>
              ))}
              {events.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No upcoming events scheduled
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {resources.slice(0, 6).map((resource) => (
                  <GlassCard key={resource.id} colors={{ primary: "green", secondary: "emerald" }}>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{resource.name}</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 capitalize">{resource.type}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description || "Wellness resource"}</p>
                        {resource.available ? (
                          <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                            ✓ Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              {resources.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No wellness resources available
                </div>
              )}
            </div>
          )}
        </GlassSection>

        {/* Wellness Tips */}
        <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span>💡</span>
              <span>Daily Wellness Tips</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { emoji: "🥗", title: "Nutrition", tip: "Eat whole foods grown locally when possible" },
                { emoji: "💧", title: "Hydration", tip: "Drink at least 8 glasses of water daily" },
                { emoji: "🚶", title: "Movement", tip: "Take a 30-minute walk or stretch every day" },
                { emoji: "😴", title: "Sleep", tip: "Aim for consistent 7-8 hours per night" },
                { emoji: "🧘", title: "Mindfulness", tip: "Practice 10 minutes of meditation or yoga" },
                { emoji: "🤝", title: "Connection", tip: "Spend time with community members daily" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-emerald-100/20 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{item.tip}</p>
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

export default Wellness;
