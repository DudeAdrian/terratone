import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useFoodData } from "../../hooks/useApi";

export default function FoodStorage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [storageInventory, setStorageInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const foodData = useFoodData("default");

  useEffect(() => {
    const loadData = () => {
      try {
        if (foodData.storage.data) {
          const payload = foodData.storage.data;
          const data = Array.isArray(payload)
            ? { locations: payload, totalCapacity: payload.reduce((s, l) => s + (l?.capacity || 0), 0) }
            : payload;
          setStorageInventory(data);
          setError(null);
        } else if (!foodData.isLoading) {
          const foodService = sofieCore.getService("food");
          if (foodService?.getStorageInventory) {
            setStorageInventory(foodService.getStorageInventory());
          }
        }

        setLoading(foodData.isLoading);

        if (foodData.storage.error) {
          setError(foodData.storage.error.message || "Failed to load storage data");
        }
      } catch (err) {
        console.error("Error loading storage data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [foodData.storage.data, foodData.isLoading, foodData.storage.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full mr-3"></div>
            Loading storage data...
          </div>
        </GlassCard>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "orange" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => foodData.storage.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }
  if (!storageInventory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">No storage data available</div>
        </GlassCard>
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

  const locations = storageInventory.locations || [];
  const totalUsed = locations.reduce((sum, loc) => sum + (loc?.currentWeight || 0), 0);
  const totalCapacity = storageInventory.totalCapacity || locations.reduce((s, l) => s + (l?.capacity || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button onClick={handleBack} style={{ color: '#ea580c', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)' }}>
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">🧊 Food Storage</h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 mt-4 max-w-2xl">Climate-controlled storage inventory and capacity management</p>
          </div>
        </GlassSection>

        {/* Storage Overview */}
        <GlassGrid cols={4} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{totalUsed}kg</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Inventory</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {(totalUsed / (locations.length || 1)).toFixed(1)}kg
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Per Location Avg</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {storageInventory.wastePercentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Monthly Waste</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">
                {(totalCapacity - totalUsed).toFixed(1)}kg
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Growth Potential</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Storage Locations */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">Storage Locations</h2>
            <GlassGrid cols={2} colsMd={1} gap={6}>
              {locations.map((location) => (
                <GlassCard key={location.locationId} colors={{ primary: "amber", secondary: "orange" }}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{location.locationId}</h3>
                      <span className="text-2xl">{location.emoji}</span>
                    </div>

                    {/* Temperature */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                        <span className="font-bold" style={{ color: getTemperatureColor(location.temperature) }}>
                          {location.temperature ?? "--"}°C
                        </span>
                      </div>
                    </div>

                    {/* Capacity Usage */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Storage</span>
                        <span className="font-bold text-gray-900 dark:text-white">{location.currentWeight ?? 0}kg / {location.capacity ?? 0}kg</span>
                      </div>
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min(((location.currentWeight || 0) / (location.capacity || 1)) * 100, 100)}%`,
                            backgroundColor: getStorageStatusColor(location.currentWeight || 0, location.capacity || 1)
                          }}
                        />
                      </div>
                    </div>

                    {/* Items Stored */}
                    <div className="border-t border-amber-200 dark:border-amber-400/20 pt-3">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stored Items</p>
                      <div className="flex flex-wrap gap-2">
                        {(location.itemsStored || []).map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Health Status */}
                    <div className="mt-3 flex justify-between text-xs text-gray-600 dark:text-gray-400 border-t border-amber-200 dark:border-amber-400/20 pt-3">
                      <span>Health: <span className="text-green-600 dark:text-green-400 font-semibold">{location.healthStatus || "Healthy"}</span></span>
                      <span>Humidity: {location.humidity ?? 0}%</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Storage Statistics */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">
              Storage Analytics
            </h2>
            <GlassGrid cols={4} colsMd={2} gap={4}>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {totalUsed}kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Inventory</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {(totalUsed / (locations.length || 1)).toFixed(1)}kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Per Location Avg</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {storageInventory.wastePercentage}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Monthly Waste</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  {(totalCapacity - totalUsed).toFixed(1)}kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Growth Potential</p>
              </div>
            </GlassGrid>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
