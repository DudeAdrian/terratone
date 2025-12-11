import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";

export default function WaterUsage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [usageRecords, setUsageRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const waterService = sofieCore.getService("water");
      if (waterService && waterService.getUsageRecords) {
        const records = waterService.getUsageRecords();
        setUsageRecords(records);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading usage data:", error);
      setLoading(false);
    }
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      domestic: "#60a5fa",
      irrigation: "#4ade80",
      industrial: "#f59e0b",
    };
    return colors[category] || "#9ca3af";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading usage data...</div>
        </GlassCard>
      </div>
    );
  }

  const totalUsage = usageRecords.reduce((sum, r) => sum + r.liters, 0);
  const domesticUsage = usageRecords.filter(r => r.category === "domestic").reduce((sum, r) => sum + r.liters, 0);
  const irrigationUsage = usageRecords.filter(r => r.category === "irrigation").reduce((sum, r) => sum + r.liters, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#06b6d4'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              📊 Water Usage Analytics
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Track consumption patterns across household and irrigation zones
            </p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={1} colsMd={3} gap={5}>
          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Usage Today</div>
              <div className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">{totalUsage}L</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">All categories combined</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Domestic</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{domesticUsage}L</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">{Math.round((domesticUsage/totalUsage)*100)}% of total</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Irrigation</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{irrigationUsage}L</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">{Math.round((irrigationUsage/totalUsage)*100)}% of total</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Usage Records */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Usage Records</h2>
            <div className="space-y-3">
              {usageRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-lg bg-cyan-100/20 dark:bg-cyan-900/20 flex items-center justify-between hover:bg-cyan-100/30 dark:hover:bg-cyan-900/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                      style={{
                        backgroundColor: `${getCategoryColor(record.category)}20`,
                        color: getCategoryColor(record.category),
                        border: `2px solid ${getCategoryColor(record.category)}40`
                      }}
                    >
                      {record.category === "domestic" ? "🏠" : "🌱"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{record.zone}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Meter: {record.meterId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: getCategoryColor(record.category) }}>
                      {record.liters}L
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{record.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassSection>

        {/* Category Breakdown */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Usage by Category</h2>
            <div className="space-y-6">
              {["domestic", "irrigation"].map((category) => {
                const categoryUsage = usageRecords.filter(r => r.category === category).reduce((sum, r) => sum + r.liters, 0);
                const percentage = Math.round((categoryUsage / totalUsage) * 100);
                
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-900 dark:text-white capitalize font-semibold">{category}</span>
                      <span className="text-gray-600 dark:text-gray-400">{categoryUsage}L ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(category)
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassSection>

      </div>
    </div>
  );
}
