import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function FoodStorage() {
  const [storageInventory, setStorageInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      if (foodService && foodService.getStorageInventory) {
        const data = foodService.getStorageInventory();
        setStorageInventory(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading storage data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading storage data...</div>
      </div>
    );
  }

  if (!storageInventory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No storage data available</div>
      </div>
    );
  }

  const getTemperatureColor = (temp) => {
    if (temp <= 5) return "#60a5fa";
    if (temp <= 15) return "#4ade80";
    if (temp <= 22) return "#f59e0b";
    return "#ef4444";
  };

  const getStorageStatusColor = (used, capacity) => {
    const percentage = (used / capacity) * 100;
    if (percentage <= 60) return "#4ade80";
    if (percentage <= 80) return "#f59e0b";
    return "#ef4444";
  };

  const totalUsed = storageInventory.locations.reduce((sum, loc) => sum + loc.currentWeight, 0);
  const totalCapacity = storageInventory.totalCapacity;
  const usagePercentage = Math.round((totalUsed / totalCapacity) * 100);

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
          🗄️ Food Storage
        </h1>
        <p className="text-gray-300">Climate-controlled storage inventory and capacity management</p>
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
          <p className="text-sm text-gray-400 mb-2">Total Stored</p>
          <p className="text-4xl font-bold" style={{ color: '#f5a873' }}>{totalUsed}kg</p>
          <p className="text-xs text-gray-500 mt-2">Across all locations</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Available Capacity</p>
          <p className="text-4xl font-bold text-white">{(totalCapacity - totalUsed).toFixed(1)}kg</p>
          <p className="text-xs text-gray-500 mt-2">{usagePercentage}% capacity used</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Storage Locations</p>
          <p className="text-4xl font-bold" style={{ color: '#60a5fa' }}>{storageInventory.locations.length}</p>
          <p className="text-xs text-gray-500 mt-2">Climate zones</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #ef444418, rgba(210, 175, 135, 0.10))',
            border: '1px solid #ef444455',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Waste Rate</p>
          <p className="text-4xl font-bold" style={{ color: '#ef4444' }}>{storageInventory.wastePercentage}%</p>
          <p className="text-xs text-gray-500 mt-2">Monthly spoilage</p>
        </div>
      </div>

      {/* Overall Usage */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: '#f5a873' }}>Storage Capacity Overview</h2>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Total Capacity Used</span>
            <span className="text-white font-bold">{totalUsed}kg / {totalCapacity}kg</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all"
              style={{
                width: `${usagePercentage}%`,
                backgroundColor: getStorageStatusColor(totalUsed, totalCapacity)
              }}
            />
          </div>
        </div>
      </div>

      {/* Storage Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {storageInventory.locations.map((location) => (
          <div
            key={location.locationId}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
              border: '1px solid #f5a87355',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#f5a873' }}>{location.name}</h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${getStorageStatusColor(location.currentWeight, location.capacity)}20`,
                  color: getStorageStatusColor(location.currentWeight, location.capacity),
                  border: `1px solid ${getStorageStatusColor(location.currentWeight, location.capacity)}40`
                }}
              >
                {Math.round((location.currentWeight / location.capacity) * 100)}%
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4">{location.type}</p>

            {/* Temperature */}
            <div className="mb-4 bg-orange-500/10 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Temperature</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getTemperatureColor(location.temperature) }}
                >
                  {location.temperature}°C
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: {location.targetTemp}°C</div>
            </div>

            {/* Capacity Usage */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Storage</span>
                <span className="text-white font-bold">{location.currentWeight}kg / {location.capacity}kg</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((location.currentWeight / location.capacity) * 100, 100)}%`,
                    backgroundColor: getStorageStatusColor(location.currentWeight, location.capacity)
                  }}
                />
              </div>
            </div>

            {/* Items Stored */}
            <div className="border-t border-orange-400/20 pt-3">
              <p className="text-sm font-bold text-gray-300 mb-2">Stored Items</p>
              <div className="flex flex-wrap gap-2">
                {location.itemsStored.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: '#f5a87320',
                      color: '#f5a873',
                      border: '1px solid #f5a87340'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Health Status */}
            <div className="mt-3 flex justify-between text-xs text-gray-500 border-t border-orange-400/20 pt-3">
              <span>Health: <span className="text-green-400">{location.healthStatus}</span></span>
              <span>Humidity: {location.humidity}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Statistics */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Storage Analytics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#f5a873' }}>
              {totalUsed}kg
            </p>
            <p className="text-sm text-gray-400">Total Inventory</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {(totalUsed / storageInventory.locations.length).toFixed(1)}kg
            </p>
            <p className="text-sm text-gray-400">Per Location Avg</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
              {storageInventory.wastePercentage}%
            </p>
            <p className="text-sm text-gray-400">Monthly Waste</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#22d3ee' }}>
              {(totalCapacity - totalUsed).toFixed(1)}kg
            </p>
            <p className="text-sm text-gray-400">Growth Potential</p>
          </div>
        </div>
      </div>
    </div>
  );
}
