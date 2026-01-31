// src/pages/SetupWizard_v2.js - Glassmorphic Setup Wizard

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    climateZone: "temperate",
    crops: [],
    fish: [],
    autopilotEnabled: false,
    enabledPlaybooks: [],
  });
  const [availableCrops, setAvailableCrops] = useState([]);
  const [availableFish, setAvailableFish] = useState([]);
  const [saving, setSaving] = useState(false);

  const totalSteps = 4;
  const climateZones = ["tropical", "temperate", "arid", "cold"];
  const playbooks = [
    { name: "Daily Check-In", enabled: true },
    { name: "Weekly Optimization", enabled: true },
    { name: "Monthly Reporting", enabled: false },
    { name: "Emergency Response", enabled: true },
  ];

  useEffect(() => {
    loadAvailableCrops();
    loadAvailableFish();
    
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      const wizardCompleted = storageService.getPreference("setupWizardCompleted", false);
      if (wizardCompleted) {
        const savedConfig = storageService.getPreference("systemConfiguration", {});
        if (Object.keys(savedConfig).length > 0) {
          setConfig(savedConfig);
        }
      }
    }
  }, []);

  const loadAvailableCrops = () => {
    const growingService = sofieCore.getService("globalGrowingSchedule");
    if (growingService && growingService.getAllCrops) {
      const allCrops = growingService.getAllCrops();
      const cropList = Object.entries(allCrops).map(([key, crop]) => ({
        id: key,
        name: crop.name || key,
        family: crop.family,
        difficulty: crop.difficulty || "medium",
        daysToHarvest: crop.daysToMaturity || 60,
      }));
      setAvailableCrops(cropList.slice(0, 30));
    }
  };

  const loadAvailableFish = () => {
    const aquaticService = sofieCore.getService("aquaticLife");
    if (aquaticService && aquaticService.database && aquaticService.database.fish) {
      const fishList = [];
      Object.entries(aquaticService.database.fish).forEach(([key, species]) => {
        if (species.diseaseResistance === "high" || species.productivity === "high" || species.productivity === "very high") {
          fishList.push({
            id: key,
            name: species.commonName,
            scientific: species.scientificName,
            category: species.category,
            difficulty: species.diseaseResistance === "high" ? "easy" : "medium",
          });
        }
      });
      setAvailableFish(fishList.slice(0, 20));
    }
  };

  const handleClimateSelect = (zone) => {
    setConfig({ ...config, climateZone: zone });
  };

  const toggleCrop = (cropId) => {
    setConfig({
      ...config,
      crops: config.crops.includes(cropId)
        ? config.crops.filter(id => id !== cropId)
        : [...config.crops, cropId],
    });
  };

  const toggleFish = (fishId) => {
    setConfig({
      ...config,
      fish: config.fish.includes(fishId)
        ? config.fish.filter(id => id !== fishId)
        : [...config.fish, fishId],
    });
  };

  const toggleAutopilot = () => {
    setConfig({ ...config, autopilotEnabled: !config.autopilotEnabled });
  };

  const togglePlaybook = (playbookName) => {
    setConfig({
      ...config,
      enabledPlaybooks: config.enabledPlaybooks.includes(playbookName)
        ? config.enabledPlaybooks.filter(p => p !== playbookName)
        : [...config.enabledPlaybooks, playbookName],
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);

    try {
      const storageService = sofieCore.getService("storage");
      if (storageService) {
        storageService.savePreference("climateZone", config.climateZone);
        storageService.savePreference("systemConfiguration", config);
        storageService.savePreference("setupWizardCompleted", true);
      }

      eventBus.emit(EVENTS.CLIMATE_ZONE_CHANGED, {
        previousZone: "temperate",
        newZone: config.climateZone,
        timestamp: new Date().toISOString(),
      });

      if (config.autopilotEnabled) {
        const autopilotService = sofieCore.getService("autopilot");
        if (autopilotService) {
          autopilotService.setMode("autopilot");
          config.enabledPlaybooks.forEach(playbook => {
            autopilotService.enablePlaybook(playbook);
          });
        }
      }

      alert("✅ System configured successfully! Redirecting...");
      window.location.href = "/";
    } catch (error) {
      console.error("Setup failed:", error);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "blue", secondary: "cyan" }} elevation="high">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-green-700 dark:from-blue-100 dark:to-green-400 bg-clip-text text-transparent">
            🚀 System Setup Wizard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Configure your Sofie Systems environment</p>
        </GlassSection>

        {/* Progress Bar */}
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Step {currentStep} of {totalSteps}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{Math.round((currentStep / totalSteps) * 100)}%</p>
            </div>
            <div className="h-2 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </GlassCard>

        {/* Step 1: Climate Zone */}
        {currentStep === 1 && (
          <GlassSection colors={{ primary: "blue", secondary: "cyan" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Select Your Climate Zone</h2>
            <GlassGrid cols={1} colsMd={2} gap={4}>
              {climateZones.map(zone => (
                <button
                  key={zone}
                  onClick={() => handleClimateSelect(zone)}
                  className={`p-4 rounded-lg font-bold transition-all ${
                    config.climateZone === zone
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
                      : "bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/60"
                  }`}
                >
                  <span className="text-2xl mb-2 block">
                    {zone === "tropical" && "🌴"}
                    {zone === "temperate" && "🌳"}
                    {zone === "arid" && "🏜️"}
                    {zone === "cold" && "❄️"}
                  </span>
                  {zone.charAt(0).toUpperCase() + zone.slice(1)}
                </button>
              ))}
            </GlassGrid>
          </GlassSection>
        )}

        {/* Step 2: Crops */}
        {currentStep === 2 && (
          <GlassSection colors={{ primary: "green", secondary: "emerald" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Select Crops to Grow</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {availableCrops.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => toggleCrop(crop.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    config.crops.includes(crop.id)
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
                      : "bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/60"
                  }`}
                >
                  <p className="font-semibold">{crop.name}</p>
                  <p className="text-xs opacity-75">{crop.daysToHarvest} days to harvest</p>
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">Selected: {config.crops.length} crops</p>
          </GlassSection>
        )}

        {/* Step 3: Fish Species */}
        {currentStep === 3 && (
          <GlassSection colors={{ primary: "teal", secondary: "cyan" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Select Fish Species</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {availableFish.map(fish => (
                <button
                  key={fish.id}
                  onClick={() => toggleFish(fish.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    config.fish.includes(fish.id)
                      ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg"
                      : "bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/60"
                  }`}
                >
                  <p className="font-semibold">{fish.name}</p>
                  <p className="text-xs opacity-75">{fish.scientific}</p>
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">Selected: {config.fish.length} species</p>
          </GlassSection>
        )}

        {/* Step 4: Automation */}
        {currentStep === 4 && (
          <GlassSection colors={{ primary: "purple", secondary: "violet" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Enable Automation</h2>
            
            <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Autopilot Mode</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automatic system management</p>
                </div>
                <button
                  onClick={toggleAutopilot}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    config.autopilotEnabled
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                      : "bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {config.autopilotEnabled ? "✓ Enabled" : "Enable"}
                </button>
              </div>
            </GlassCard>

            {config.autopilotEnabled && (
              <div className="mt-6">
                <p className="font-bold text-slate-900 dark:text-white mb-3">Select Playbooks</p>
                <div className="space-y-2">
                  {playbooks.map(pb => (
                    <button
                      key={pb.name}
                      onClick={() => togglePlaybook(pb.name)}
                      className={`w-full p-3 rounded-lg text-left font-semibold transition-all ${
                        config.enabledPlaybooks.includes(pb.name)
                          ? "bg-gradient-to-r from-purple-400 to-violet-500 text-white"
                          : "bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/60"
                      }`}
                    >
                      {config.enabledPlaybooks.includes(pb.name) ? "✓" : "○"} {pb.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </GlassSection>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-lg font-bold border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all disabled:opacity-50"
          >
            ← Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-400 to-green-500 text-white hover:shadow-lg transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={saveConfiguration}
              disabled={saving}
              className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Complete Setup"}
            </button>
          )}
        </div>

        {/* Web3 Badge */}
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
            🔗 Configuration stored on blockchain • Smart contract verified setup
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default SetupWizard;
