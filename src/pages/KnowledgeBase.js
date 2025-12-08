import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [bestPractices, setBestPractices] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const kbService = sofieCore.getService("knowledgeBase");
    if (kbService) {
      setArticles(kbService.getArticles());
      setBestPractices(kbService.getBestPractices());
      setStats(kbService.getStats());
    }
  }, []);

  const filteredArticles =
    selectedCategory === "all"
      ? articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : articles.filter((a) => a.category === selectedCategory && a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">📚 Knowledge Base</h1>
        <p className="text-lg text-gray-600">Learn from shared knowledge and best practices across Harmonic Habitats</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-sm font-semibold text-blue-600 uppercase">Articles</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalArticles || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">Best Practices</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBestPractices || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-sm font-semibold text-purple-600 uppercase">Categories</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.categories?.length || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <div className="text-sm font-semibold text-orange-600 uppercase">Total Views</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalViews || 0}</div>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
        <div>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`mr-2 mb-2 px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            All
          </button>
          {stats.categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`mr-2 mb-2 px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">📖 Featured Articles</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">{article.title}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{article.category}</span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{article.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {article.author}</span>
              <span>👁 {article.views} views</span>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Read More
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ Best Practices</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {bestPractices.map((practice) => (
          <div key={practice.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{practice.title}</h3>
            <p className="text-sm text-gray-700 mb-3">{practice.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600">From: {practice.community}</p>
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">{practice.sustainability}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
