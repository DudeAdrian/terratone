// src/pages/SetupWizard.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

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

  useEffect(() => {
    // Load available options
    loadAvailableCrops();
    loadAvailableFish();
    
    // Check if wizard already completed
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      const wizardCompleted = storageService.getPreference("setupWizardCompleted", false);
      if (wizardCompleted) {
        // Load previous configuration
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
      setAvailableCrops(cropList.slice(0, 30)); // Limit for wizard
    }
  };

  const loadAvailableFish = () => {
    const aquaticService = sofieCore.getService("aquaticLife");
    if (aquaticService && aquaticService.database && aquaticService.database.fish) {
      const fishList = [];
      // Access fish species directly from the database.fish object
      Object.entries(aquaticService.database.fish).forEach(([key, species]) => {
        // Filter for beginner-friendly species (disease resistance high, productivity high/very high)
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
      setAvailableFish(fishList.slice(0, 20)); // Beginner-friendly species
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

  const togglePlaybook = (playbook) => {
    setConfig({
      ...config,
      enabledPlaybooks: config.enabledPlaybooks.includes(playbook)
        ? config.enabledPlaybooks.filter(p => p !== playbook)
        : [...config.enabledPlaybooks, playbook],
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
      // Save climate zone
      const storageService = sofieCore.getService("storage");
      if (storageService) {
        storageService.savePreference("climateZone", config.climateZone);
        storageService.savePreference("systemConfiguration", config);
        storageService.savePreference("setupWizardCompleted", true);
      }

      // Emit climate zone change event
      eventBus.emit(EVENTS.CLIMATE_ZONE_CHANGED, {
        previousZone: "temperate",
        newZone: config.climateZone,
        timestamp: new Date().toISOString(),
      });

      // Configure autopilot
      if (config.autopilotEnabled) {
        const autopilotService = sofieCore.getService("autopilot");
        if (autopilotService) {
          autopilotService.setMode("autopilot");
          
          // Enable selected playbooks
          config.enabledPlaybooks.forEach(playbook => {
            autopilotService.togglePlaybook(playbook, true);
          });
        }
      }

      // Log configuration
      const logger = sofieCore.getService("logger");
      if (logger) {
        logger.log("[SetupWizard] System configured:", config);
      }

      // Wait a moment then redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);

    } catch (error) {
      console.error("[SetupWizard] Error saving configuration:", error);
      setSaving(false);
    }
  };

  const climateZones = [
    {
      id: "tropical",
      name: "🌴 Tropical",
      temp: "25-35°C",
      rainfall: "High (2000-4000mm)",
      growing: "Year-round",
      description: "Consistent warmth and moisture. Ideal for tropical crops and warmwater fish.",
    },
    {
      id: "subtropical",
      name: "🌺 Subtropical",
      temp: "15-30°C",
      rainfall: "Moderate-High",
      growing: "9-10 months",
      description: "Warm summers, mild winters. Great crop diversity and extended growing season.",
    },
    {
      id: "temperate",
      name: "🍂 Temperate",
      temp: "0-25°C",
      rainfall: "Moderate",
      growing: "6-8 months",
      description: "Four distinct seasons. Wide variety of crops and balanced aquaponics.",
    },
    {
      id: "boreal",
      name: "🌲 Boreal",
      temp: "-10-20°C",
      rainfall: "Low-Moderate",
      growing: "3-5 months",
      description: "Cold climate with short growing season. Hardy crops and coldwater species.",
    },
    {
      id: "arid",
      name: "🏜️ Arid/Desert",
      temp: "10-40°C",
      rainfall: "Very Low",
      growing: "Variable",
      description: "Hot and dry. Requires water conservation and drought-resistant crops.",
    },
  ];

  const autopilotPlaybooks = [
    { id: "water", name: "Water Management", description: "Monitors pH, temp, DO, ammonia" },
    { id: "nutrient", name: "Nutrient Management", description: "Nitrification cycle, feeding schedules" },
    { id: "pest", name: "Pest Control", description: "Risk assessment and prevention" },
    { id: "rotation", name: "Crop Rotation", description: "Planning and diversity balance" },
    { id: "climate", name: "Climate Control", description: "Temperature, humidity, lighting" },
    { id: "monitoring", name: "System Monitoring", description: "Equipment health and alerts" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Welcome to Sofie Systems</h1>
          <p className="text-lg text-gray-600">Let's set up your harmonic habitat community</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step <= currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Climate Zone</span>
            <span>Select Crops</span>
            <span>Select Fish</span>
            <span>Autopilot</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Step 1: Climate Zone */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Climate Zone</h2>
              <p className="text-gray-600 mb-6">
                This helps us recommend the best crops and fish species for your environment.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {climateZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleClimateSelect(zone.id)}
                    className={`text-left p-6 rounded-lg border-2 transition ${
                      config.climateZone === zone.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{zone.name}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Temperature:</strong> {zone.temp}</div>
                      <div><strong>Rainfall:</strong> {zone.rainfall}</div>
                      <div><strong>Growing Season:</strong> {zone.growing}</div>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">{zone.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Crops */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Starter Crops</h2>
              <p className="text-gray-600 mb-6">
                Choose 3-5 crops to begin with. You can add more later.
                <span className="ml-2 text-green-600 font-semibold">
                  Selected: {config.crops.length}
                </span>
              </p>
              <div className="grid md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {availableCrops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => toggleCrop(crop.id)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      config.crops.includes(crop.id)
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-bold text-gray-800">{crop.name}</div>
                    <div className="text-sm text-gray-600">{crop.family}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {crop.daysToHarvest} days • {crop.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Fish */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Fish Species</h2>
              <p className="text-gray-600 mb-6">
                Choose 1-3 beginner-friendly species for your aquaponics system.
                <span className="ml-2 text-green-600 font-semibold">
                  Selected: {config.fish.length}
                </span>
              </p>
              <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {availableFish.map((fish) => (
                  <button
                    key={fish.id}
                    onClick={() => toggleFish(fish.id)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      config.fish.includes(fish.id)
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-bold text-gray-800">{fish.name}</div>
                    <div className="text-sm text-gray-600 italic">{fish.scientific}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {fish.category} • {fish.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Autopilot Configuration */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Autopilot Mode</h2>
              <p className="text-gray-600 mb-6">
                Enable autopilot to let Sofie Systems manage routine tasks automatically.
              </p>

              {/* Enable/Disable Toggle */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Enable Autopilot Mode</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Automated monitoring and decision-making for your system
                    </p>
                  </div>
                  <button
                    onClick={toggleAutopilot}
                    className={`px-6 py-3 rounded-lg font-bold transition ${
                      config.autopilotEnabled
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {config.autopilotEnabled ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {/* Playbook Selection */}
              {config.autopilotEnabled && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Select Playbooks to Enable</h3>
                  <div className="space-y-3">
                    {autopilotPlaybooks.map((playbook) => (
                      <button
                        key={playbook.id}
                        onClick={() => togglePlaybook(playbook.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition ${
                          config.enabledPlaybooks.includes(playbook.id)
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-gray-800">{playbook.name}</div>
                            <div className="text-sm text-gray-600">{playbook.description}</div>
                          </div>
                          {config.enabledPlaybooks.includes(playbook.id) && (
                            <span className="text-green-600 text-2xl">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Configuration Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-3">Configuration Summary</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Climate Zone:</strong> {config.climateZone}</div>
                  <div><strong>Crops:</strong> {config.crops.length} selected</div>
                  <div><strong>Fish:</strong> {config.fish.length} selected</div>
                  <div><strong>Autopilot:</strong> {config.autopilotEnabled ? "Enabled" : "Disabled"}</div>
                  {config.autopilotEnabled && (
                    <div><strong>Playbooks:</strong> {config.enabledPlaybooks.length} active</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              ← Previous
            </button>
          )}
          {currentStep < totalSteps && (
            <button
              onClick={nextStep}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Next →
            </button>
          )}
          {currentStep === totalSteps && (
            <button
              onClick={saveConfiguration}
              disabled={saving}
              className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Complete Setup 🎉"}
            </button>
          )}
        </div>

        {/* Skip Wizard Link */}
        <div className="text-center mt-6">
          <a
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Skip wizard and explore manually
          </a>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
