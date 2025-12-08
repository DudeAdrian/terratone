// src/pages/SelfSufficiency.js
import React, { useState } from "react";
import SustainabilityMetrics from "../components/SustainabilityMetrics";
import sofieCore from "../core/SofieCore";

const SelfSufficiency = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleAddFood = () => {
    const foodService = sofieCore.getService("food");
    foodService.addGarden({
      name: "Main Garden",
      size: 50,
      type: "vegetable",
    });
    foodService.addCrop({
      name: "Tomatoes",
      gardenId: 1,
      planted: new Date(),
      expectedYield: 30,
    });
  };

  const handleAddWater = () => {
    const waterService = sofieCore.getService("water");
    waterService.addWaterSystem({
      name: "Rainwater Cistern",
      type: "rainwater",
      capacity: 5000,
    });
    waterService.recordRainfall(500);
  };

  const handleAddHousing = () => {
    const housingService = sofieCore.getService("housing");
    housingService.addStructure({
      name: "Main Dwelling",
      type: "passive_solar",
      area: 150,
    });
    housingService.updateThermalData({
      efficiency: 85,
      climate: {
        temperature: 21,
        humidity: 45,
        co2Level: 420,
      },
    });
  };

  const handleCalculateScore = () => {
    const sustainability = sofieCore.getService("sustainability");
    sustainability.calculateOverallScore();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Self-Sufficiency Dashboard</h1>
        <p className="text-lg text-gray-600">Monitor and optimize your sustainable living systems</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "overview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab("food")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "food"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🌱 Food
        </button>
        <button
          onClick={() => setActiveTab("water")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "water"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          💧 Water
        </button>
        <button
          onClick={() => setActiveTab("housing")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "housing"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🏠 Housing
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === "overview" && (
        <div>
          <SustainabilityMetrics />
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <button
                onClick={handleAddFood}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                + Add Garden
              </button>
              <button
                onClick={handleAddWater}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                + Add Water System
              </button>
              <button
                onClick={handleAddHousing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                + Add Structure
              </button>
              <button
                onClick={handleCalculateScore}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                📈 Recalculate
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "food" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🌱 Food Production Systems</h2>
          <p className="text-gray-600 mb-4">Track gardens, crops, yields, and food storage</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Garden Management</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Define garden zones and sizes</li>
                <li>✓ Track crop rotation</li>
                <li>✓ Monitor seasonal yields</li>
                <li>✓ Plan succession planting</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">Detailed food production interface with charts and analytics</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "water" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">💧 Water Systems</h2>
          <p className="text-gray-600 mb-4">Monitor conservation, collection, and purification</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Water Management</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Track rainfall collection</li>
                <li>✓ Monitor daily usage</li>
                <li>✓ Manage greywater recycling</li>
                <li>✓ Plan conservation strategies</li>
              </ul>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">Real-time sensor integration and usage forecasting</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "housing" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🏠 Housing & Environment</h2>
          <p className="text-gray-600 mb-4">Optimize thermal efficiency, air quality, and comfort</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Habitat Management</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Monitor thermal efficiency</li>
                <li>✓ Track air quality metrics</li>
                <li>✓ Log maintenance tasks</li>
                <li>✓ Plan improvements</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">Environmental sensors and climate control optimization</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SelfSufficiency.propTypes = {};

export default SelfSufficiency;