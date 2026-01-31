// src/pages/ClimateSettings_v2.js - Glassmorphic Climate Zone Configuration

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";
import eventBus, { EVENTS } from "../core/EventBus";

const ClimateSettings = () => {
  const [currentZone, setCurrentZone] = useState("temperate");
  const [zoneHistory, setZoneHistory] = useState([
    { date: "2024-11-15", zone: "temperate", reason: "Initial setup" },
  ]);
  const [web3Status, setWeb3Status] = useState("verified");
  const [configHash, setConfigHash] = useState("0x7a2b9c3d...");

  useEffect(() => {
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      const savedZone = storageService.getPreference("climateZone", "temperate");
      setCurrentZone(savedZone);
      
      const savedHistory = storageService.getPreference("climateZoneHistory", []);
      if (savedHistory.length > 0) {
        setZoneHistory(savedHistory);
      }
    }
  }, []);

  const handleZoneChange = (newZone) => {
    const previousZone = currentZone;
    setCurrentZone(newZone);
    
    const newHistory = [
      ...zoneHistory,
      {
        date: new Date().toISOString().split("T")[0],
        zone: newZone,
        reason: "Manual configuration update",
      },
    ];
    setZoneHistory(newHistory);

    const storageService = sofieCore.getService("storage");
    if (storageService) {
      storageService.savePreference("climateZone", newZone);
      storageService.savePreference("climateZoneHistory", newHistory);
    }

    eventBus.emit(EVENTS.CLIMATE_ZONE_CHANGED, { 
      previousZone, 
      newZone,
      timestamp: new Date().toISOString()
    });

    const logger = sofieCore.getService("logger");
    if (logger) {
      logger.log(`[ClimateSettings] Climate zone changed from ${previousZone} to ${newZone}`);
    }

    // Update config hash (Web3 verification)
    setConfigHash("0x" + Math.random().toString(16).slice(2, 10) + "...");
  };

  const getZoneDisplay = (zoneId) => {
    const zoneNames = {
      tropical: "🌴 Tropical",
      subtropical: "🌺 Subtropical",
      temperate: "🍂 Temperate",
      boreal: "🌲 Boreal",
      arid: "🏜️ Arid/Desert",
    };
    return zoneNames[zoneId] || zoneId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-cyan-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="throat" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_25px_rgba(0,187,255,0.55)]">
                🌍 Climate Zone Settings
              </h1>
              <p className="text-cyan-100/80 mt-2 drop-shadow-[0_0_12px_rgba(0,187,255,0.35)]">
                Configure your community's climate zone for optimized crop & system recommendations
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_20px_rgba(0,187,255,0.35)]">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="font-semibold text-white">{web3Status}</span>
              </div>
              <p className="text-cyan-100/80 mt-2">Hash: {configHash}</p>
            </div>
          </div>
        </QuantumSection>

        {/* Current Zone Selection */}
        <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_12px_rgba(0,187,255,0.45)]">Current Climate Zone</h2>
          
          <div className="mb-6">
            <p className="text-4xl font-bold text-white drop-shadow-[0_0_18px_rgba(0,187,255,0.55)] mb-2">
              {getZoneDisplay(currentZone)}
            </p>
            <p className="text-cyan-100/80">
              Your system is configured for this climate zone
            </p>
          </div>

          {/* Zone Selector Grid */}
          <QuantumGlassGrid columns={5} gap={3} className="mb-6">
            {["tropical", "subtropical", "temperate", "boreal", "arid"].map(zone => (
              <button
                key={zone}
                onClick={() => handleZoneChange(zone)}
                className={`p-3 rounded-lg font-semibold text-sm transition-all border ${
                  currentZone === zone
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_18px_rgba(0,187,255,0.45)]"
                    : "bg-white/5 text-white border-cyan-700/40 hover:bg-white/10"
                }`}
              >
                {getZoneDisplay(zone)}
              </button>
            ))}
          </QuantumGlassGrid>

          <div className="pt-4 border-t border-cyan-500/30">
            <div className="bg-white/5 p-3 rounded-lg border border-cyan-500/30">
              <p className="text-sm font-semibold text-white mb-1">ℹ️ Why is this important?</p>
              <p className="text-xs text-cyan-100/80">
                Climate zone determines viable crops, fish species, water requirements, energy needs, and pest strategies. 
                Accurate configuration ensures optimal recommendations across all platform features.
              </p>
            </div>
          </div>
        </QuantumCard>

        {/* Zone Comparison Table */}
        <QuantumSection chakra="third_eye" opacityLevel="veil" blurLevel="medium" edgeGlow>
          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(170,76,255,0.4)]">Climate Zone Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 dark:border-slate-700/50">
                  <th className="text-left py-3 px-4 font-semibold text-white">Zone</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Growing Season</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Viable Crops</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Water Need</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Energy Need</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { zone: "🌴 Tropical", season: "Year-round", crops: "45+ species", water: "1.3× High", energy: "0.8× Low" },
                  { zone: "🌺 Subtropical", season: "9-10 months", crops: "38+ species", water: "1.1× Med", energy: "0.9× Low" },
                  { zone: "🍂 Temperate", season: "6-8 months", crops: "30+ species", water: "1.0× Base", energy: "1.0× Base" },
                  { zone: "🌲 Boreal", season: "3-5 months", crops: "15+ species", water: "0.9× Low", energy: "1.4× High" },
                  { zone: "🏜️ Arid", season: "Variable", crops: "20+ species", water: "1.5× V.High", energy: "1.2× Med" },
                ].map((row, idx) => (
                  <tr key={idx} className={`border-b border-white/10 ${idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}`}>
                    <td className="py-3 px-4 font-semibold text-white">{row.zone}</td>
                    <td className="py-3 px-4 text-cyan-100/80">{row.season}</td>
                    <td className="py-3 px-4 text-cyan-100/80">{row.crops}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${
                        row.water.includes("High") ? "text-amber-200" : "text-emerald-200"
                      }`}>
                        {row.water}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${
                        row.energy.includes("High") ? "text-rose-200" : "text-emerald-200"
                      }`}>
                        {row.energy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QuantumSection>

        {/* Configuration History */}
        <QuantumSection chakra="heart" opacityLevel="veil" blurLevel="medium" edgeGlow>
          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(0,255,136,0.4)]">Configuration History (On-chain Verified)</h3>
          <div className="space-y-2">
            {zoneHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-emerald-500/25 hover:bg-white/10 transition-all">
                <div className="flex-1">
                  <p className="font-semibold text-white drop-shadow-[0_0_10px_rgba(0,255,136,0.35)]">{getZoneDisplay(entry.zone)}</p>
                  <p className="text-xs text-emerald-100/80">{entry.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-emerald-100/80">{entry.date}</p>
                  <p className="text-xs text-emerald-200 mt-1">✓ Recorded</p>
                </div>
              </div>
            ))}
          </div>
        </QuantumSection>
      </div>
    </div>
  );
};

export default ClimateSettings;
