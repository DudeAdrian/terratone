// src/pages/AquaticLifeDatabase.js - Glassmorphic Food Domain (Teal/Cyan)

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassButton, GlassSection, GlassContainer, GlassGrid } from "../theme/GlassmorphismTheme";

const AquaticLifeDatabase = () => {
  const [aquaticService, setAquaticService] = useState(null);
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [activeTab, setActiveTab] = useState("species");
  const [searchFilter, setSearchFilter] = useState("");
  const [ecologyData, setEcologyData] = useState({});

  useEffect(() => {
    const service = sofieCore.getService("aquaticLife");
    setAquaticService(service);
    if (service && service.getAllSpecies) {
      const allSpecies = service.getAllSpecies();
      setSpecies(Array.isArray(allSpecies) ? allSpecies : Object.values(allSpecies || {}));
      if (allSpecies && Object.keys(allSpecies).length > 0) {
        const first = Array.isArray(allSpecies) ? allSpecies[0] : Object.values(allSpecies)[0];
        setSelectedSpecies(first);
      }
    }
  }, []);

  const handleSelectSpecies = (spec) => {
    setSelectedSpecies(spec);
    if (aquaticService && aquaticService.getEcologyData) {
      const data = aquaticService.getEcologyData(spec.id);
      setEcologyData(data);
    }
  };

  const filteredSpecies = species.filter(spec =>
    (spec.name && spec.name.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (spec.commonName && spec.commonName.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  if (!aquaticService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading aquatic life database...</p>
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
              🐟 Aquatic Life Database
            </h1>
            <p className="text-lg text-teal-700 dark:text-teal-200 max-w-2xl">
              Comprehensive database of aquaponics-suitable fish and organisms with detailed ecology profiles
            </p>
          </div>
        </GlassSection>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Species List */}
          <div className="md:col-span-1">
            <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Species List</h3>
                <input
                  type="text"
                  placeholder="Search species..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-teal-300/40 dark:border-teal-700/40 bg-white/50 dark:bg-gray-800/50 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 backdrop-blur-sm transition mb-6"
                />
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredSpecies.map((spec, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSpecies(spec)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        selectedSpecies?.id === spec.id
                          ? "bg-gradient-to-b from-teal-400/40 to-teal-300/20 dark:from-teal-600/50 dark:to-teal-700/30 border-2 border-teal-500 dark:border-teal-400 text-teal-700 dark:text-teal-300"
                          : "bg-white/20 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-teal-200/10 dark:hover:bg-teal-700/10 border-2 border-transparent"
                      }`}
                    >
                      <p className="font-semibold">{spec.name || "Unknown"}</p>
                      <p className="text-xs mt-1">{spec.commonName || spec.scientificName || ""}</p>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Species Details */}
          <div className="md:col-span-2">
            {selectedSpecies ? (
              <div className="space-y-6">
                {/* Header Card */}
                <GlassCard colors={{ primary: "teal", secondary: "cyan" }} elevation="high">
                  <div className="p-8 border-l-4 border-teal-500 dark:border-teal-400">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{selectedSpecies.name}</h2>
                    <p className="text-lg text-teal-700 dark:text-teal-200 italic mb-6">{selectedSpecies.scientificName}</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">pH Range</p>
                        <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{selectedSpecies.phRange || "6.5-7.5"}</p>
                      </div>
                      <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Temperature</p>
                        <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{selectedSpecies.tempRange || "22-28°C"}</p>
                      </div>
                      <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Max Size</p>
                        <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{selectedSpecies.maxSize || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Tabs */}
                <GlassSection colors={{ primary: "teal", secondary: "cyan" }}>
                  <div>
                    <div className="flex flex-wrap border-b border-teal-300/30 dark:border-teal-700/30 backdrop-blur-sm">
                      {["ecology", "nutrition", "breeding", "compatibility"].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                            activeTab === tab
                              ? "bg-gradient-to-b from-teal-400/40 to-teal-300/20 dark:from-teal-600/50 dark:to-teal-700/30 text-teal-700 dark:text-teal-300 border-b-2 border-teal-600 dark:border-teal-400"
                              : "text-gray-700 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-200/10 dark:hover:bg-teal-700/10"
                          }`}
                        >
                          {tab === "ecology" && "🌊"}
                          {tab === "nutrition" && "🥗"}
                          {tab === "breeding" && "👶"}
                          {tab === "compatibility" && "🤝"}
                          {" " + tab}
                        </button>
                      ))}
                    </div>
                    <div className="p-8">
                      {activeTab === "ecology" && (
                        <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
                          <div className="p-6 space-y-4">
                            <p className="text-base text-gray-700 dark:text-gray-300"><strong>Habitat:</strong> {selectedSpecies.habitat || "N/A"}</p>
                            <p className="text-base text-gray-700 dark:text-gray-300"><strong>Behavior:</strong> {selectedSpecies.behavior || "N/A"}</p>
                            <p className="text-base text-gray-700 dark:text-gray-300"><strong>Lifespan:</strong> {selectedSpecies.lifespan || "N/A"}</p>
                          </div>
                        </GlassCard>
                      )}
                      {activeTab === "nutrition" && (
                        <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
                          <div className="p-6">
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-4"><strong>Diet:</strong> {selectedSpecies.diet || "N/A"}</p>
                            <p className="text-base text-gray-700 dark:text-gray-300"><strong>Feed Frequency:</strong> {selectedSpecies.feedingFrequency || "Daily"}</p>
                          </div>
                        </GlassCard>
                      )}
                      {activeTab === "breeding" && (
                        <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
                          <div className="p-6">
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-4"><strong>Breeding Type:</strong> {selectedSpecies.breedingType || "N/A"}</p>
                            <p className="text-base text-gray-700 dark:text-gray-300"><strong>Maturity:</strong> {selectedSpecies.maturityAge || "N/A"}</p>
                          </div>
                        </GlassCard>
                      )}
                      {activeTab === "compatibility" && (
                        <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
                          <div className="p-6">
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-4"><strong>Suitable Tank Mates:</strong> {selectedSpecies.tankMates || "N/A"}</p>
                            <p className="text-base text-gray-700 dark:text-gray-300"><strong>Min Tank Size:</strong> {selectedSpecies.minTankSize || "N/A"}</p>
                          </div>
                        </GlassCard>
                      )}
                    </div>
                  </div>
                </GlassSection>
              </div>
            ) : (
              <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
                <div className="p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Select a species to view details</p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AquaticLifeDatabase;
