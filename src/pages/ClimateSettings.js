// src/pages/ClimateSettings.js

import React, { useState, useEffect } from "react";
import ClimateZoneManager from "../components/ClimateZoneManager";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

const ClimateSettings = () => {
  const [currentZone, setCurrentZone] = useState("temperate");
  const [zoneHistory, setZoneHistory] = useState([
    { date: "2024-11-15", zone: "temperate", reason: "Initial setup" },
  ]);

  // Load saved zone preference on mount
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

    // Save to storage
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      storageService.savePreference("climateZone", newZone);
      storageService.savePreference("climateZoneHistory", newHistory);
    }

    // Emit climate zone change event - all services can listen and adapt
    eventBus.emit(EVENTS.CLIMATE_ZONE_CHANGED, { 
      previousZone, 
      newZone,
      timestamp: new Date().toISOString()
    });

    // Log the change
    const logger = sofieCore.getService("logger");
    if (logger) {
      logger.log(`[ClimateSettings] Climate zone changed from ${previousZone} to ${newZone}`);
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🌍 Climate Zone Settings</h1>
        <p className="text-blue-100">
          Configure your community's climate zone to receive optimized crop, fish, and system recommendations
        </p>
      </div>

      {/* Current Zone */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Climate Zone</h2>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-4xl font-bold text-blue-600">{getZoneDisplay(currentZone)}</p>
            <p className="text-gray-600 mt-2">Your system is currently configured for this climate zone</p>
          </div>
          <ClimateZoneManager
            currentZone={currentZone}
            onZoneChange={handleZoneChange}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 font-semibold mb-2">ℹ️ Why is this important?</p>
          <p className="text-blue-800 text-sm">
            Your climate zone determines which crops grow best, which fish species thrive in your aquaponics systems,
            water requirements, energy needs, and pest management strategies. Accurate configuration ensures optimal
            recommendations throughout the Sofie Systems platform.
          </p>
        </div>
      </div>

      {/* Zone Change History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration History</h2>
        <div className="space-y-3">
          {zoneHistory.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{getZoneDisplay(entry.zone)}</p>
                <p className="text-sm text-gray-600">{entry.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{entry.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Impact Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Climate Zone Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Zone</th>
                <th className="text-left py-3 px-4">Growing Season</th>
                <th className="text-left py-3 px-4">Viable Crops</th>
                <th className="text-left py-3 px-4">Water Need</th>
                <th className="text-left py-3 px-4">Energy Need</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-semibold">🌴 Tropical</td>
                <td className="py-3 px-4">Year-round</td>
                <td className="py-3 px-4">45+ species</td>
                <td className="py-3 px-4 text-amber-600">1.3× High</td>
                <td className="py-3 px-4 text-green-600">0.8× Low</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-semibold">🌺 Subtropical</td>
                <td className="py-3 px-4">9-10 months</td>
                <td className="py-3 px-4">38+ species</td>
                <td className="py-3 px-4 text-green-600">1.1× Medium</td>
                <td className="py-3 px-4 text-green-600">0.9× Low</td>
              </tr>
              <tr className={`border-b border-gray-100 ${currentZone === "temperate" ? "bg-blue-50" : ""}`}>
                <td className="py-3 px-4 font-semibold">🍂 Temperate</td>
                <td className="py-3 px-4">6-8 months</td>
                <td className="py-3 px-4">30+ species</td>
                <td className="py-3 px-4">1.0× Baseline</td>
                <td className="py-3 px-4">1.0× Baseline</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-semibold">🌲 Boreal</td>
                <td className="py-3 px-4">3-5 months</td>
                <td className="py-3 px-4">15+ species</td>
                <td className="py-3 px-4 text-green-600">0.9× Low</td>
                <td className="py-3 px-4 text-red-600">1.4× High</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">🏜️ Arid/Desert</td>
                <td className="py-3 px-4">Varies w/ irrigation</td>
                <td className="py-3 px-4">20+ species</td>
                <td className="py-3 px-4 text-red-600">1.5× Very High</td>
                <td className="py-3 px-4 text-amber-600">1.2× Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClimateSettings;
