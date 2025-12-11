import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function WaterUsage() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading usage data...</div>
      </div>
    );
  }

  const totalUsage = usageRecords.reduce((sum, r) => sum + r.liters, 0);
  const domesticUsage = usageRecords.filter(r => r.category === "domestic").reduce((sum, r) => sum + r.liters, 0);
  const irrigationUsage = usageRecords.filter(r => r.category === "irrigation").reduce((sum, r) => sum + r.liters, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #46c6ff22, rgba(210, 175, 135, 0.12))',
        border: '1px solid #46c6ff66',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #46c6ff55, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#46c6ff' }}>
          📊 Water Usage Analytics
        </h1>
        <p className="text-gray-300">Track consumption patterns across household and irrigation zones</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Usage Today</p>
          <p className="text-4xl font-bold text-white">{totalUsage}L</p>
          <p className="text-xs text-gray-500 mt-2">All categories combined</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Domestic</p>
          <p className="text-4xl font-bold" style={{ color: '#60a5fa' }}>{domesticUsage}L</p>
          <p className="text-xs text-gray-500 mt-2">{Math.round((domesticUsage/totalUsage)*100)}% of total</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Irrigation</p>
          <p className="text-4xl font-bold" style={{ color: '#4ade80' }}>{irrigationUsage}L</p>
          <p className="text-xs text-gray-500 mt-2">{Math.round((irrigationUsage/totalUsage)*100)}% of total</p>
        </div>
      </div>

      {/* Usage Records */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Recent Usage Records
        </h2>
        <div className="space-y-3">
          {usageRecords.map((record) => (
            <div
              key={record.id}
              className="bg-blue-500/10 rounded-lg p-4 flex items-center justify-between"
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
                  <p className="font-bold text-white">{record.zone}</p>
                  <p className="text-sm text-gray-400">Meter: {record.meterId}</p>
                  <p className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: getCategoryColor(record.category) }}>
                  {record.liters}L
                </p>
                <p className="text-xs text-gray-400 capitalize">{record.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Usage by Category
        </h2>
        <div className="space-y-4">
          {["domestic", "irrigation"].map((category) => {
            const categoryUsage = usageRecords.filter(r => r.category === category).reduce((sum, r) => sum + r.liters, 0);
            const percentage = Math.round((categoryUsage / totalUsage) * 100);
            
            return (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <span className="text-white capitalize font-semibold">{category}</span>
                  <span className="text-gray-400">{categoryUsage}L ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-3">
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
    </div>
  );
}
