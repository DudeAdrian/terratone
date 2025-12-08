// src/components/GlobalSearch.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // all, crops, fish, pests, seeds

  useEffect(() => {
    // Load search history from storage
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      const history = storageService.getPreference("searchHistory", []);
      setSearchHistory(history);
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query, activeFilter]);

  const performSearch = async (searchQuery) => {
    setSearching(true);
    const allResults = [];

    try {
      // Search in GlobalGrowingSchedule (Crops)
      if (activeFilter === "all" || activeFilter === "crops") {
        const growingService = sofieCore.getService("globalGrowingSchedule");
        if (growingService && growingService.getAllCrops) {
          const crops = growingService.getAllCrops();
          Object.entries(crops).forEach(([key, crop]) => {
            const searchText = `${crop.name} ${crop.family} ${crop.type}`.toLowerCase();
            if (searchText.includes(searchQuery.toLowerCase())) {
              allResults.push({
                type: "crop",
                id: key,
                title: crop.name,
                subtitle: `${crop.family} • ${crop.type}`,
                data: crop,
                icon: "🌱",
                link: "/harvest-forecast",
              });
            }
          });
        }
      }

      // Search in AquaticLife (Fish/Aquatic Species)
      if (activeFilter === "all" || activeFilter === "fish") {
        const aquaticService = sofieCore.getService("aquaticLife");
        if (aquaticService && aquaticService.database) {
          Object.values(aquaticService.database).forEach(category => {
            category.species.forEach(species => {
              const searchText = `${species.commonName} ${species.scientificName} ${category.name}`.toLowerCase();
              if (searchText.includes(searchQuery.toLowerCase())) {
                allResults.push({
                  type: "fish",
                  id: species.id,
                  title: species.commonName,
                  subtitle: `${species.scientificName} • ${category.name}`,
                  data: species,
                  icon: "🐟",
                  link: "/aquatic-life",
                });
              }
            });
          });
        }
      }

      // Search in PestManagement (Pests)
      if (activeFilter === "all" || activeFilter === "pests") {
        const pestService = sofieCore.getService("pestManagement");
        if (pestService) {
          // Search in monitoring data
          if (pestService.monitoringData) {
            pestService.monitoringData.forEach((entry, idx) => {
              if (entry.pestType && entry.pestType.toLowerCase().includes(searchQuery.toLowerCase())) {
                allResults.push({
                  type: "pest",
                  id: idx,
                  title: entry.pestType,
                  subtitle: `${entry.location} • ${entry.severity} severity`,
                  data: entry,
                  icon: "🐛",
                  link: "/pest-management",
                });
              }
            });
          }
        }
      }

      // Search in SeedBank (Seeds)
      if (activeFilter === "all" || activeFilter === "seeds") {
        const seedService = sofieCore.getService("seedBank");
        if (seedService && seedService.seedInventory) {
          seedService.seedInventory.forEach((seed) => {
            const searchText = `${seed.variety} ${seed.type} ${seed.source}`.toLowerCase();
            if (searchText.includes(searchQuery.toLowerCase())) {
              allResults.push({
                type: "seed",
                id: seed.id,
                title: seed.variety,
                subtitle: `${seed.type} • ${seed.quantity} seeds`,
                data: seed,
                icon: "🌾",
                link: "/seedbank",
              });
            }
          });
        }
      }

      // Fuzzy matching - also include partial matches
      const fuzzyResults = allResults.filter(r => {
        const title = r.title.toLowerCase();
        const queryParts = searchQuery.toLowerCase().split(' ');
        return queryParts.some(part => title.includes(part));
      });

      setResults([...new Set([...allResults, ...fuzzyResults])].slice(0, 50));
    } catch (error) {
      console.error("[GlobalSearch] Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    
    // Save to search history
    if (searchQuery.trim().length >= 2) {
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      
      const storageService = sofieCore.getService("storage");
      if (storageService) {
        storageService.savePreference("searchHistory", newHistory);
      }
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      storageService.removePreference("searchHistory");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search crops, fish, pests, seeds..."
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            {["all", "crops", "fish", "pests", "seeds"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[60vh]">
          {searching && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Searching...</p>
            </div>
          )}

          {!searching && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try different keywords or filters</p>
            </div>
          )}

          {!searching && query.length < 2 && searchHistory.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Recent Searches</h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {searchHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(item)}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                  >
                    🕐 {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searching && results.length > 0 && (
            <div className="divide-y divide-gray-200">
              {results.map((result, idx) => (
                <a
                  key={`${result.type}-${result.id}-${idx}`}
                  href={result.link}
                  onClick={onClose}
                  className="block p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{result.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{result.title}</h4>
                      <p className="text-sm text-gray-600">{result.subtitle}</p>
                      <span className="text-xs text-gray-500 uppercase mt-1 inline-block">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!searching && query.length < 2 && searchHistory.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-6xl mb-4">🔍</div>
              <p>Start typing to search across all databases</p>
              <p className="text-sm mt-2">Crops • Fish • Pests • Seeds</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
