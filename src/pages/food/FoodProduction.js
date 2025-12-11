import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function FoodProduction() {
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      if (foodService && foodService.getProductionData) {
        const data = foodService.getProductionData();
        setProductionData(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading production data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading production data...</div>
      </div>
    );
  }

  if (!productionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No production data available</div>
      </div>
    );
  }

  const totalArea = productionData.gardens.reduce((sum, g) => sum + g.areaSqm, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #f5a87322, rgba(210, 175, 135, 0.12))',
        border: '1px solid #f5a87366',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #f5a87355, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f5a873' }}>
          🌾 Food Production
        </h1>
        <p className="text-gray-300">Home-scale garden productivity and yield tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f5a87355',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Monthly Yield</p>
          <p className="text-4xl font-bold" style={{ color: '#f5a873' }}>{productionData.monthlyYield}kg</p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Yearly Projection</p>
          <p className="text-4xl font-bold text-white">{productionData.yearlyProjection}kg</p>
          <p className="text-xs text-gray-500 mt-2">Estimated annual</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Garden Area</p>
          <p className="text-4xl font-bold" style={{ color: '#60a5fa' }}>{totalArea}m²</p>
          <p className="text-xs text-gray-500 mt-2">{productionData.gardens.length} gardens</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #22d3ee18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #22d3ee55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Biodiversity</p>
          <p className="text-4xl font-bold" style={{ color: '#22d3ee' }}>{productionData.biodiversity}</p>
          <p className="text-xs text-gray-500 mt-2">Crop varieties</p>
        </div>
      </div>

      {/* Gardens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {productionData.gardens.map((garden) => (
          <div
            key={garden.gardenId}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
              border: '1px solid #f5a87355',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#f5a873' }}>{garden.gardenId}</h2>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: garden.status === "productive" ? '#4ade8020' : '#9ca3af20',
                  color: garden.status === "productive" ? '#4ade80' : '#9ca3af',
                  border: garden.status === "productive" ? '1px solid #4ade8040' : '1px solid #9ca3af40'
                }}
              >
                {garden.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4">{garden.location}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Area</p>
                <p className="text-2xl font-bold text-white">{garden.areaSqm}m²</p>
                <p className="text-xs text-gray-500">{garden.type}</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Productivity</p>
                <p className="text-2xl font-bold" style={{ color: '#f5a873' }}>{garden.productivity}%</p>
                <p className="text-xs text-gray-500">Today's score</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Current Crops</p>
              <div className="flex flex-wrap gap-2">
                {garden.crops.map((crop) => (
                  <span
                    key={crop}
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: '#f5a87320',
                      color: '#f5a873',
                      border: '1px solid #f5a87340'
                    }}
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-orange-400/20 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Water Today:</span>
                <span className="text-white font-semibold">{garden.waterUse}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Harvest:</span>
                <span className="text-white font-semibold">{new Date(garden.lastHarvest).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Harvest:</span>
                <span className="text-green-400 font-semibold">{new Date(garden.nextHarvest).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Summary */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Production Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#f5a873' }}>
              {productionData.monthlyYield}kg
            </p>
            <p className="text-sm text-gray-400">Monthly Average</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {productionData.yearlyProjection}kg
            </p>
            <p className="text-sm text-gray-400">Yearly Estimate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {(productionData.monthlyYield / productionData.gardens.length).toFixed(1)}kg
            </p>
            <p className="text-sm text-gray-400">Per Garden Avg</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
              {(productionData.monthlyYield / totalArea).toFixed(1)}kg/m²
            </p>
            <p className="text-sm text-gray-400">Yield Density</p>
          </div>
        </div>
      </div>
    </div>
  );
}
