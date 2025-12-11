// src/pages/KnowledgeBase.js - Glassmorphic Knowledge Base

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { useKnowledgeBaseData } from "../hooks/useApi";

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [bestPractices, setBestPractices] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // API hook
  const { data: kbData, loading: kbLoading, error: kbError, refetch: refetchKB } = useKnowledgeBaseData(null, selectedCategory !== 'all' ? selectedCategory : null);

  useEffect(() => {
    if (kbData) {
      // Use API data when available
      setArticles(kbData.articles || kbData.knowledgeBase?.articles || []);
      setBestPractices(kbData.knowledgeBase?.bestPractices || []);
      setStats({
        totalArticles: kbData.knowledgeBase?.totalArticles || kbData.articles?.length || 0,
        totalBestPractices: kbData.knowledgeBase?.bestPractices?.length || 0,
        categories: kbData.knowledgeBase?.categories || [],
        totalViews: kbData.knowledgeBase?.totalViews || 0
      });
    } else {
      // Fallback to sofieCore
      const kbService = sofieCore.getService("knowledgeBase");
      if (kbService) {
        setArticles(kbService.getArticles());
        setBestPractices(kbService.getBestPractices());
        setStats(kbService.getStats());
      }
    }
  }, [kbData]);

  const filteredArticles =
    selectedCategory === "all"
      ? articles.filter((a) => a.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      : articles.filter((a) => a.category === selectedCategory && a.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const statCards = [
    { label: "Articles", value: stats.totalArticles || 0, icon: "📖", color: "blue" },
    { label: "Best Practices", value: stats.totalBestPractices || 0, icon: "⭐", color: "green" },
    { label: "Categories", value: stats.categories?.length || 0, icon: "📂", color: "purple" },
    { label: "Total Views", value: stats.totalViews || 0, icon: "👁", color: "orange" },
  ];

  // Loading state
  if (kbLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <div className="text-center space-y-4">
          <div className="text-3xl quantum-pulse text-purple-600 dark:text-purple-400">
            Loading Knowledge Base...
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Fetching articles and best practices
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (kbError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 space-y-6">
        <div className="text-3xl text-red-500 dark:text-red-400">
          {kbError}
        </div>
        <button
          onClick={refetchKB}
          className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
        >
          Retry Loading Knowledge Base
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "purple", secondary: "violet" }} elevation="high">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-900 to-violet-700 dark:from-purple-100 dark:to-violet-400 bg-clip-text text-transparent">
            📚 Knowledge Base
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Learn from shared knowledge across Harmonic Habitats communities</p>
        </GlassSection>

        {/* Stats Grid */}
        <GlassGrid cols={1} colsMd={4} gap={4}>
          {statCards.map((stat, idx) => (
            <GlassCard key={idx} colors={{ primary: stat.color, secondary: stat.color }}>
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
            </GlassCard>
          ))}
        </GlassGrid>

        {/* Search & Filter */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="🔍 Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white"
                    : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
                }`}
              >
                All
              </button>
              {stats.categories?.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white"
                      : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </GlassSection>

        {/* Featured Articles */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Featured Articles</h2>
          <GlassGrid cols={1} colsMd={2} gap={6}>
            {filteredArticles.map((article) => (
              <GlassCard key={article.id} colors={{ primary: "blue", secondary: "cyan" }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex-1">{article.title}</h3>
                  <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-400/30 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex-shrink-0">
                    {article.category}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{article.content}</p>
                <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 mb-4">
                  <span>By {article.author}</span>
                  <span>👁 {article.views} views</span>
                </div>
                <button className="w-full px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg transition-all">
                  Read More
                </button>
              </GlassCard>
            ))}
          </GlassGrid>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">⭐ Best Practices</h2>
          <GlassGrid cols={1} colsMd={3} gap={6}>
            {bestPractices.map((practice) => (
              <GlassCard key={practice.id} colors={{ primary: "green", secondary: "emerald" }}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{practice.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{practice.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/20 dark:border-slate-700/50">
                  <p className="text-xs text-slate-600 dark:text-slate-400">From: {practice.community}</p>
                  <span className="px-3 py-1 rounded-full font-bold text-xs bg-green-400/30 dark:bg-green-500/20 text-green-700 dark:text-green-300">
                    {practice.sustainability}% 🌱
                  </span>
                </div>
              </GlassCard>
            ))}
          </GlassGrid>
        </div>

        {/* Web3 Badge */}
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
            🔗 Knowledge verified on blockchain • Community contributions tracked
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default KnowledgeBase;
