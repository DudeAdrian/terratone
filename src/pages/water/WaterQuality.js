import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";

export default function WaterQuality() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading quality data...</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={() => navigate("/", { state: { activeRing: ringData.activeRing } })}
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
              🧪 Potable Water Quality
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Real-time water quality testing and monitoring for safe consumption
            </p>
          </div>
        </GlassSection>

        {/* Quality Metrics Grid */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Source Quality Metrics
            </h2>
            <GlassGrid cols={1} colsMd={2} gap={6}>
              {qualityMetrics.map((metric, idx) => (
                <GlassCard key={idx}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      Source: {metric.sourceId}
                    </h3>
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
                    <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">pH Level</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.pH}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Target: 6.5-8.5</p>
                    </div>
                    <div className="bg-blue-500/10 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Temperature</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.temperature}°C</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Safe range</p>
                    </div>
                    <div className="bg-cyan-500/10 dark:bg-cyan-900/20 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Turbidity</p>
                      <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{metric.turbidity} NTU</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{"<5 NTU ideal"}</p>
                    </div>
                    <div className="bg-cyan-500/10 dark:bg-cyan-900/20 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">TDS</p>
                      <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{metric.tds} ppm</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{"<500 ppm safe"}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">Chemical Parameters</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Conductivity:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{metric.conductivity} µS/cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Hardness:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{metric.hardness} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Residual Cl:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{metric.residualChlorine} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Coliform:</span>
                        <span 
                          className="font-semibold"
                          style={{ color: metric.coliform === 0 ? '#4ade80' : '#ef4444' }}
                        >
                          {metric.coliform} MPN/100ml
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Last tested: {new Date(metric.timestamp).toLocaleString()}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Quality Summary */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                {qualityMetrics.filter(m => m.status === "pass").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Sources Passing</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-gray-900 dark:text-white">
                {(qualityMetrics.reduce((sum, m) => sum + m.pH, 0) / qualityMetrics.length).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Average pH</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">
                {Math.max(...qualityMetrics.map(m => m.tds))}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Max TDS (ppm)</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: qualityMetrics.every(m => m.coliform === 0) ? "emerald" : "red", secondary: qualityMetrics.every(m => m.coliform === 0) ? "green" : "rose" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className={`text-5xl font-bold ${qualityMetrics.every(m => m.coliform === 0) ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {qualityMetrics.every(m => m.coliform === 0) ? "SAFE" : "ALERT"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Coliform Status</p>
            </div>
          </GlassCard>
        </GlassGrid>

      </div>
    </div>
  );
}
