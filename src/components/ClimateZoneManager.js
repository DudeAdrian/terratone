// src/components/ClimateZoneManager.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const ClimateZoneManager = ({ currentZone = "temperate", onZoneChange }) => {
  const [selectedZone, setSelectedZone] = useState(currentZone);
  const [zoneInfo, setZoneInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [impact, setImpact] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const climateZones = [
    {
      id: "tropical",
      name: "Tropical",
      icon: "🌴",
      description: "Hot and humid year-round, abundant rainfall",
      tempRange: "20-32°C (68-90°F)",
      avgRainfall: "2000-3000mm/year",
      growingSeason: "Year-round",
      challenges: ["High humidity", "Heavy rainfall", "Pest pressure", "Rapid decomposition"],
      advantages: ["Year-round growing", "Fast growth rates", "High biodiversity"],
    },
    {
      id: "subtropical",
      name: "Subtropical",
      icon: "🌺",
      description: "Warm with distinct seasons, moderate rainfall",
      tempRange: "10-28°C (50-82°F)",
      avgRainfall: "1000-2000mm/year",
      growingSeason: "9-10 months",
      challenges: ["Seasonal temperature variation", "Summer heat stress", "Winter cold snaps"],
      advantages: ["Extended growing season", "Diverse crop options", "Moderate pest pressure"],
    },
    {
      id: "temperate",
      name: "Temperate",
      icon: "🍂",
      description: "Four distinct seasons, moderate temperatures",
      tempRange: "0-25°C (32-77°F)",
      avgRainfall: "500-1500mm/year",
      growingSeason: "6-8 months",
      challenges: ["Winter freeze", "Short growing season", "Seasonal planning required"],
      advantages: ["Natural pest die-off in winter", "Seasonal crop rotation", "Cooler temperature crops thrive"],
    },
    {
      id: "boreal",
      name: "Boreal",
      icon: "🌲",
      description: "Short, cool summers and long, cold winters",
      tempRange: "-10-18°C (14-64°F)",
      avgRainfall: "300-600mm/year",
      growingSeason: "3-5 months",
      challenges: ["Very short growing season", "Frost risk", "Limited crop diversity", "Cold-hardy varieties needed"],
      advantages: ["Very low pest pressure", "Cold-hardy crops excel", "Minimal disease pressure"],
    },
    {
      id: "arid",
      name: "Arid/Desert",
      icon: "🏜️",
      description: "Hot, dry climate with minimal rainfall",
      tempRange: "5-40°C (41-104°F)",
      avgRainfall: "<250mm/year",
      growingSeason: "Varies with irrigation",
      challenges: ["Water scarcity", "Extreme heat", "Low humidity", "Soil salinity"],
      advantages: ["Low disease pressure", "Intense sunlight for growth", "Minimal pests if managed"],
    },
  ];

  useEffect(() => {
    const zone = climateZones.find(z => z.id === selectedZone);
    setZoneInfo(zone);
    calculateImpact(zone);
    generateRecommendations(zone);
  }, [selectedZone]);

  const calculateImpact = (zone) => {
    if (!zone) return;

    const growingService = sofieCore.getService("globalGrowingSchedule");
    const aquaticService = sofieCore.getService("aquaticLife");

    setImpact({
      viableCrops: getViableCropsCount(zone.id),
      viableFish: aquaticService ? aquaticService.getFishForClimate(zone.id) : {},
      expectedYield: getYieldMultiplier(zone.id),
      waterRequirement: getWaterRequirementMultiplier(zone.id),
      energyRequirement: getEnergyRequirementMultiplier(zone.id),
    });
  };

  const getViableCropsCount = (zoneId) => {
    const cropCounts = {
      tropical: 45,
      subtropical: 38,
      temperate: 30,
      boreal: 15,
      arid: 20,
    };
    return cropCounts[zoneId] || 0;
  };

  const getYieldMultiplier = (zoneId) => {
    const multipliers = {
      tropical: 1.2,
      subtropical: 1.1,
      temperate: 1.0,
      boreal: 0.7,
      arid: 0.8,
    };
    return multipliers[zoneId] || 1.0;
  };

  const getWaterRequirementMultiplier = (zoneId) => {
    const multipliers = {
      tropical: 1.3,
      subtropical: 1.1,
      temperate: 1.0,
      boreal: 0.9,
      arid: 1.5,
    };
    return multipliers[zoneId] || 1.0;
  };

  const getEnergyRequirementMultiplier = (zoneId) => {
    const multipliers = {
      tropical: 0.8,
      subtropical: 0.9,
      temperate: 1.0,
      boreal: 1.4,
      arid: 1.2,
    };
    return multipliers[zoneId] || 1.0;
  };

  const generateRecommendations = (zone) => {
    if (!zone) return;

    const recs = [];

    if (zone.id === "tropical") {
      recs.push({ priority: "high", text: "Implement high-efficiency ventilation to manage humidity" });
      recs.push({ priority: "high", text: "Use organic pest management and beneficial insects" });
      recs.push({ priority: "medium", text: "Select fast-growing, heat-tolerant varieties" });
    } else if (zone.id === "subtropical") {
      recs.push({ priority: "high", text: "Plan for seasonal temperature variation in crop selection" });
      recs.push({ priority: "medium", text: "Implement shade structures for summer heat" });
      recs.push({ priority: "medium", text: "Consider cold frames for winter cold protection" });
    } else if (zone.id === "temperate") {
      recs.push({ priority: "high", text: "Maximize growing season with succession planting" });
      recs.push({ priority: "high", text: "Plan crop rotation for 4-season cycle" });
      recs.push({ priority: "medium", text: "Use cold-tolerant varieties for spring/fall" });
    } else if (zone.id === "boreal") {
      recs.push({ priority: "high", text: "Focus on cold-hardy, fast-maturing varieties" });
      recs.push({ priority: "high", text: "Implement greenhouse systems for season extension" });
      recs.push({ priority: "medium", text: "Maximize use of short summer with continuous daylight" });
    } else if (zone.id === "arid") {
      recs.push({ priority: "high", text: "Prioritize water-efficient crops and recycling systems" });
      recs.push({ priority: "high", text: "Implement shade structures to reduce evaporation" });
      recs.push({ priority: "medium", text: "Use drought-tolerant and heat-adapted varieties" });
    }

    setRecommendations(recs);
  };

  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId);
  };

  const handleConfirmZone = () => {
    if (onZoneChange) {
      onZoneChange(selectedZone);
    }
    setIsOpen(false);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
      >
        🌍 Manage Climate Zone
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold mb-2">🌍 Climate Zone Configuration</h2>
              <p className="text-blue-100">Select your community's climate zone for optimized recommendations</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Zone Selector */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Select Climate Zone</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {climateZones.map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneSelect(zone.id)}
                      className={`text-left p-4 rounded-lg border-2 transition ${
                        selectedZone === zone.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{zone.icon}</span>
                        <div>
                          <h4 className="font-bold text-gray-800">{zone.name}</h4>
                          <p className="text-xs text-gray-600">{zone.description}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 space-y-1">
                        <p><strong>Temperature:</strong> {zone.tempRange}</p>
                        <p><strong>Growing Season:</strong> {zone.growingSeason}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Details */}
              {zoneInfo && (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">🌡️ Climate Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600"><strong>Temperature Range:</strong></p>
                        <p className="text-gray-800">{zoneInfo.tempRange}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><strong>Average Rainfall:</strong></p>
                        <p className="text-gray-800">{zoneInfo.avgRainfall}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><strong>Growing Season:</strong></p>
                        <p className="text-gray-800">{zoneInfo.growingSeason}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">⚠️ Challenges</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {zoneInfo.challenges.map((challenge, idx) => (
                        <li key={idx}>{challenge}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">✅ Advantages</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {zoneInfo.advantages.map((advantage, idx) => (
                        <li key={idx}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Impact Analysis */}
              {impact && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📊 System Impact Analysis</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Viable Crops</p>
                      <p className="text-2xl font-bold text-green-700">{impact.viableCrops}</p>
                      <p className="text-xs text-gray-500 mt-1">species available</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Viable Fish Species</p>
                      <p className="text-2xl font-bold text-blue-700">{Object.keys(impact.viableFish).length}</p>
                      <p className="text-xs text-gray-500 mt-1">for aquaponics</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Yield Multiplier</p>
                      <p className="text-2xl font-bold text-purple-700">{impact.expectedYield}×</p>
                      <p className="text-xs text-gray-500 mt-1">vs baseline</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm text-gray-600 mb-1">Water Requirement</p>
                      <p className="text-2xl font-bold text-amber-700">{impact.waterRequirement}×</p>
                      <p className="text-xs text-gray-500 mt-1">vs baseline</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Energy Requirement</p>
                      <p className="text-2xl font-bold text-red-700">{impact.energyRequirement}×</p>
                      <p className="text-xs text-gray-500 mt-1">vs baseline</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Zone-Specific Recommendations</h3>
                  <div className="space-y-2">
                    {recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          rec.priority === "high"
                            ? "bg-red-50 border-red-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              rec.priority === "high"
                                ? "bg-red-200 text-red-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {rec.priority}
                          </span>
                          <p className="text-sm text-gray-800">{rec.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 p-6 rounded-b-lg flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmZone}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                ✅ Confirm Zone: {zoneInfo?.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateZoneManager;
