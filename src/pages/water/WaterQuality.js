import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function WaterQuality() {
  const [qualityMetrics, setQualityMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const waterService = sofieCore.getService("water");
      if (waterService && waterService.getPotableQualityMetrics) {
        const metrics = waterService.getPotableQualityMetrics();
        setQualityMetrics(metrics);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading water quality data:", error);
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status) => {
    return status === "pass" ? "#4ade80" : "#ef4444";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading quality data...</div>
      </div>
    );
  }

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
          🧪 Potable Water Quality
        </h1>
        <p className="text-gray-300">Real-time water quality testing and monitoring for safe consumption</p>
      </div>

      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {qualityMetrics.map((metric, idx) => (
          <div
            key={idx}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
              border: '1px solid #46c6ff55',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#46c6ff' }}>
                Source: {metric.sourceId}
              </h2>
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: `${getStatusColor(metric.status)}20`,
                  color: getStatusColor(metric.status),
                  borderColor: `${getStatusColor(metric.status)}40`
                }}
              >
                {metric.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">pH Level</p>
                <p className="text-2xl font-bold text-white">{metric.pH}</p>
                <p className="text-xs text-gray-500">Target: 6.5-8.5</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Temperature</p>
                <p className="text-2xl font-bold text-white">{metric.temperature}°C</p>
                <p className="text-xs text-gray-500">Safe range</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Turbidity</p>
                <p className="text-2xl font-bold" style={{ color: '#46c6ff' }}>{metric.turbidity} NTU</p>
                <p className="text-xs text-gray-500">{"<5 NTU ideal"}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">TDS</p>
                <p className="text-2xl font-bold" style={{ color: '#46c6ff' }}>{metric.tds} ppm</p>
                <p className="text-xs text-gray-500">{"<500 ppm safe"}</p>
              </div>
            </div>

            <div className="border-t border-blue-400/20 pt-4 mt-4">
              <h3 className="text-sm font-bold text-blue-300 mb-3">Chemical Parameters</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Conductivity:</span>
                  <span className="text-white font-semibold">{metric.conductivity} µS/cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hardness:</span>
                  <span className="text-white font-semibold">{metric.hardness} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Residual Cl:</span>
                  <span className="text-white font-semibold">{metric.residualChlorine} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coliform:</span>
                  <span 
                    className="font-semibold"
                    style={{ color: metric.coliform === 0 ? '#4ade80' : '#ef4444' }}
                  >
                    {metric.coliform} MPN/100ml
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-400/20 pt-3 mt-3">
              <p className="text-xs text-gray-500">
                Last tested: {new Date(metric.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Quality Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {qualityMetrics.filter(m => m.status === "pass").length}
            </p>
            <p className="text-sm text-gray-400">Sources Passing</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {(qualityMetrics.reduce((sum, m) => sum + m.pH, 0) / qualityMetrics.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Average pH</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#46c6ff' }}>
              {Math.max(...qualityMetrics.map(m => m.tds))}
            </p>
            <p className="text-sm text-gray-400">Max TDS (ppm)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {qualityMetrics.every(m => m.coliform === 0) ? "SAFE" : "ALERT"}
            </p>
            <p className="text-sm text-gray-400">Coliform Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}
