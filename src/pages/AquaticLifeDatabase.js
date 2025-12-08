// src/pages/AquaticLifeDatabase.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import AquaticLifeService from "../services/AquaticLifeService";

const AquaticLifeDatabase = () => {
  const [aquaticService, setAquaticService] = useState(null);
  const [activeTab, setActiveTab] = useState("fish");
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedClimate, setSelectedClimate] = useState("temperate");
  const [overview, setOverview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const logs = [];
    try {
      logs.push("Step 1: Calling sofieCore.init()");
      // Initialize SofieCore once
      sofieCore.init();

      logs.push("Step 2: Getting aquaticLife service from core");
      // Get service immediately
      let service = sofieCore.getService("aquaticLife");
      logs.push(`Step 3: Service found=${!!service}, hasDatabase=${!!service?.database}`);

      // Fallback: if service missing or database not initialized, create a fresh instance
      if (!service || !service.database) {
        logs.push("Step 4: Service missing/uninitialized - creating fallback");
        const fallback = new AquaticLifeService();
        logs.push("Step 5: Fallback instance created");
        
        fallback.initialize();
        logs.push("Step 6: Fallback initialized");
        logs.push(`Step 7: Fallback has database=${!!fallback.database}`);
        logs.push(`Step 8: Fallback fish species count=${Object.keys(fallback.database?.fish || {}).length}`);
        
        // Override the service in sofieCore
        sofieCore.services["aquaticLife"] = fallback;
        service = fallback;
        logs.push("Step 9: Fallback registered to sofieCore");
      }

      if (service && service.database) {
        logs.push("Step 10: Service ready with database");
        const cats = Object.keys(service.database);
        logs.push(`Step 11: Database categories=${cats.join(", ")}`);
        logs.push(`Step 12: Fish count=${Object.keys(service.database?.fish || {}).length}`);

        // Set the service state
        setAquaticService(service);
        logs.push("Step 13: Service state set");

        // Get and set overview
        const overviewData = service.getDatabaseOverview?.();
        if (overviewData) {
          setOverview(overviewData);
          logs.push(`Step 14: Overview loaded - total species=${overviewData.totalSpecies}`);
        } else {
          logs.push("Step 14: Overview failed or missing");
        }
      } else {
        logs.push("ERROR: Service or database still missing after fallback!");
        setAquaticService(null);
      }
      setDebugInfo(logs.join("\n"));
    } catch (error) {
      logs.push(`ERROR: ${error.message}`);
      logs.push(error.stack);
      setDebugInfo(logs.join("\n"));
      setAquaticService(null);
    }
  }, []);

  if (!aquaticService) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Loading aquatic life database...</p>
        {debugInfo && (
          <div className="max-w-2xl mx-auto bg-gray-100 border border-gray-300 rounded p-4 text-left">
            <p className="font-bold text-sm mb-2">🔍 Debug Log:</p>
            <pre className="text-xs whitespace-pre-wrap break-words font-mono text-gray-700">
              {debugInfo}
            </pre>
          </div>
        )}
      </div>
    );
  }

  const climates = ["tropical", "subtropical", "temperate", "boreal", "arid"];
  
  const getCategory = (categoryName) => {
    if (!aquaticService || !aquaticService.database) {
      console.warn(`No database available for ${categoryName}`);
      return {};
    }
    const categoryData = aquaticService.database[categoryName] || {};
    console.log(`Category '${categoryName}' has ${Object.keys(categoryData).length} species:`, Object.keys(categoryData));
    return categoryData;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      fish: "🐟",
      bacteria: "🦠",
      zooplankton: "🔬",
      plants: "🌿",
      protozoans: "🦧",
      insects: "🦟",
      crustaceans: "🦐",
    };
    return icons[category] || "📊";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🌊 Aquatic Life Database</h1>
        <p className="text-cyan-100">
          Comprehensive database of aquatic species for sustainable aquaponics systems
        </p>
        {aquaticService && (
          <p className="text-cyan-50 text-xs mt-2">
            ✅ Service loaded • {Object.keys(aquaticService.database?.fish || {}).length} fish species • {Object.keys(aquaticService.database?.bacteria || {}).length} bacteria species
          </p>
        )}
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600">Fish Species</div>
            <div className="text-2xl font-bold text-blue-700">{overview.fishSpecies}</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md border-l-4 border-green-600">
            <div className="text-sm text-gray-600">Bacteria Species</div>
            <div className="text-2xl font-bold text-green-700">{overview.bacteriaSpecies}</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md border-l-4 border-purple-600">
            <div className="text-sm text-gray-600">Zooplankton</div>
            <div className="text-2xl font-bold text-purple-700">{overview.zooplanktonSpecies}</div>
          </div>
          <div className="bg-amber-100 p-4 rounded-lg shadow-md border-l-4 border-amber-600">
            <div className="text-sm text-gray-600">Total Species</div>
            <div className="text-2xl font-bold text-amber-700">{overview.totalSpecies}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b overflow-x-auto">
          {["fish", "bacteria", "zooplankton", "plants", "protozoans", "insects", "crustaceans"].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedSpecies(null);
              }}
              className={`px-4 py-3 font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {getCategoryIcon(tab)} {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Search Bar */}
          {!selectedSpecies && (
            <div className="mb-6">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Climate Filter for Fish */}
          {activeTab === "fish" && !selectedSpecies && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Climate:</label>
              <div className="flex flex-wrap gap-2">
                {climates.map(climate => (
                  <button
                    key={climate}
                    onClick={() => setSelectedClimate(climate)}
                    className={`px-3 py-1 rounded text-sm font-medium capitalize transition ${
                      selectedClimate === climate
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {climate}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Species Grid */}
          {!selectedSpecies && (
            <div>
              {Object.keys(getCategory(activeTab)).length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <p className="text-amber-800 font-semibold mb-2">No species data loaded for "{activeTab}"</p>
                  <p className="text-sm text-amber-700">Database is initializing. Please refresh the page.</p>
                  <details className="mt-4 text-left text-xs text-gray-600">
                    <summary className="cursor-pointer font-semibold">Debug Info</summary>
                    <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-48">
                      {JSON.stringify({
                        serviceLoaded: !!aquaticService,
                        databaseLoaded: !!aquaticService?.database,
                        categories: aquaticService?.database ? Object.keys(aquaticService.database) : [],
                        currentCategory: activeTab,
                        categoryKeys: Object.keys(getCategory(activeTab)),
                      }, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(getCategory(activeTab))
                    .filter(([key, species]) => {
                      // Search filter
                      const matchesSearch = searchTerm === "" || 
                        key.toLowerCase().includes(searchTerm) ||
                        species.commonName?.toLowerCase().includes(searchTerm) ||
                        species.scientificName?.toLowerCase().includes(searchTerm);
                      
                      // Climate filter (only for fish)
                      const matchesClimate = activeTab !== "fish" || 
                        !species.climate || 
                        species.climate.includes(selectedClimate);
                      
                      return matchesSearch && matchesClimate;
                    })
                    .map(([key, species]) => (
                      <div
                        key={key}
                        onClick={() => setSelectedSpecies(key)}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 cursor-pointer transition transform hover:scale-105"
                      >
                        <h3 className="font-bold text-gray-800 mb-1">
                          {species.commonName || species.name || key}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 italic">
                          {species.scientificName || species.category || ""}
                        </p>
                        <div className="text-xs text-gray-700 space-y-1">
                          {species.category && (
                            <p><strong>Category:</strong> {species.category}</p>
                          )}
                          {species.lifespan && (
                            <p><strong>Lifespan:</strong> {species.lifespan}</p>
                          )}
                          {species.temperatureRange && (
                            <p><strong>Temp:</strong> {species.temperatureRange.min}-{species.temperatureRange.max}°C</p>
                          )}
                          {species.function && (
                            <p><strong>Role:</strong> {species.function.substring(0, 40)}...</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Species Detail View */}
          {selectedSpecies && (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedSpecies(null)}
                className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                ← Back to List
              </button>

              {(() => {
                const speciesData = getCategory(activeTab)[selectedSpecies];
                if (!speciesData) return <p>Species not found</p>;

                return (
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-6 space-y-6">
                    <div className="border-b pb-4">
                      <h2 className="text-3xl font-bold text-gray-800">{speciesData.commonName || selectedSpecies}</h2>
                      <p className="text-sm italic text-gray-600">{speciesData.scientificName}</p>
                      {speciesData.category && (
                        <p className="text-sm text-blue-600 font-semibold mt-1">Category: {speciesData.category}</p>
                      )}
                    </div>

                    {/* General Info */}
                    {(speciesData.function || speciesData.description) && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-blue-900 mb-2">📋 Function</h3>
                        <p className="text-blue-800">{speciesData.function || speciesData.description}</p>
                      </div>
                    )}

                    {/* Physical Characteristics */}
                    {(speciesData.matureSize || speciesData.size || speciesData.lifespan) && (
                      <div className="grid md:grid-cols-3 gap-4">
                        {speciesData.matureSize && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="font-semibold text-green-900 text-sm">Mature Size</p>
                            <p className="text-green-700">{speciesData.matureSize}</p>
                          </div>
                        )}
                        {speciesData.size && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="font-semibold text-green-900 text-sm">Size</p>
                            <p className="text-green-700">{speciesData.size}</p>
                          </div>
                        )}
                        {speciesData.lifespan && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="font-semibold text-green-900 text-sm">Lifespan</p>
                            <p className="text-green-700">{speciesData.lifespan}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Environmental Requirements */}
                    {(speciesData.temperatureRange || speciesData.pHRange) && (
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">🌡️ Environmental Requirements</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {speciesData.temperatureRange && (
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <p className="font-semibold text-orange-900 mb-2">Temperature</p>
                              <p className="text-sm text-orange-800">
                                Range: {speciesData.temperatureRange.min}-{speciesData.temperatureRange.max}°C
                              </p>
                              {speciesData.temperatureRange.optimal && (
                                <p className="text-sm text-orange-700">
                                  Optimal: {speciesData.temperatureRange.optimal}°C
                                </p>
                              )}
                            </div>
                          )}
                          {speciesData.pHRange && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <p className="font-semibold text-yellow-900 mb-2">pH Level</p>
                              <p className="text-sm text-yellow-800">
                                Range: {speciesData.pHRange.min}-{speciesData.pHRange.max}
                              </p>
                              {speciesData.pHRange.optimal && (
                                <p className="text-sm text-yellow-700">
                                  Optimal: {speciesData.pHRange.optimal}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stocking & Production */}
                    {(speciesData.stocking || speciesData.productivity || speciesData.harvestYield) && (
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">📊 Production Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {speciesData.stocking && (
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <p className="font-semibold text-purple-900 mb-2">Stocking Density</p>
                              <p className="text-sm text-purple-800">
                                {speciesData.stocking.density || speciesData.stocking}
                              </p>
                            </div>
                          )}
                          {speciesData.productivity && (
                            <div className="bg-pink-50 p-4 rounded-lg">
                              <p className="font-semibold text-pink-900 mb-2">Productivity</p>
                              <p className="text-sm text-pink-800">{speciesData.productivity}</p>
                            </div>
                          )}
                          {speciesData.harvestYield && (
                            <div className="bg-emerald-50 p-4 rounded-lg">
                              <p className="font-semibold text-emerald-900 mb-2">Expected Yield</p>
                              <p className="text-sm text-emerald-800">{speciesData.harvestYield}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Nutrition */}
                    {speciesData.proteinContent && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-bold text-red-900 mb-2">🍖 Nutritional Profile</h3>
                        <p className="text-sm text-red-800">
                          Protein: {speciesData.proteinContent}% | Fat: {speciesData.nutritionProfile?.fat || "N/A"}%
                        </p>
                        {speciesData.nutritionProfile?.omega3 && (
                          <p className="text-sm text-red-700">
                            Omega-3: {speciesData.nutritionProfile.omega3}%
                          </p>
                        )}
                      </div>
                    )}

                    {/* Climate Compatibility */}
                    {speciesData.climate && (
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <h3 className="font-bold text-teal-900 mb-2">🌍 Climate Compatibility</h3>
                        <div className="flex flex-wrap gap-2">
                          {speciesData.climate.map(climate => (
                            <span key={climate} className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                              {climate}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {(speciesData.notes || speciesData.warning || speciesData.benefit) && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h3 className="font-bold text-blue-900 mb-2">ℹ️ Additional Information</h3>
                        {speciesData.notes && <p className="text-sm text-blue-800 mb-2">{speciesData.notes}</p>}
                        {speciesData.warning && <p className="text-sm text-amber-700 mb-2">⚠️ {speciesData.warning}</p>}
                        {speciesData.benefit && <p className="text-sm text-green-700">✓ {speciesData.benefit}</p>}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Ecosystem Presets */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏗️ Ecosystem Presets</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {aquaticService.getAllEcosystems().map((ecosystem, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{ecosystem.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{ecosystem.description}</p>
              <div className="text-xs text-gray-700 space-y-1">
                <p><strong>Primary Fish:</strong> {ecosystem.primaryFish.join(", ")}</p>
                <p><strong>Climate:</strong> {ecosystem.climate}</p>
                <p><strong>Expected Yield:</strong> {ecosystem.expectedYield}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AquaticLifeDatabase;
