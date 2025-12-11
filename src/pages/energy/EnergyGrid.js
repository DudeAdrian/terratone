import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";

export default function EnergyGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const [gridMetrics, setGridMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const energyService = sofieCore.getService("energy");
      if (energyService && energyService.getGridMetrics) {
        const metrics = energyService.getGridMetrics();
        setGridMetrics(metrics);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading grid data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading grid data...</div>
        </GlassCard>
      </div>
    );
  }

  const totalImported = gridMetrics.reduce((sum, m) => sum + m.imported, 0);
  const totalExported = gridMetrics.reduce((sum, m) => sum + m.exported, 0);
  const netBalance = totalExported - totalImported;
  const totalCost = gridMetrics.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={() => navigate("/", { state: { activeRing: ringData.activeRing } })}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#b45309'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              ⚡ Grid Import/Export
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Bi-directional energy flow and net metering analytics
            </p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={1} colsMd={4} gap={6}>
          <GlassCard colors={{ primary: "red", secondary: "rose" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Imported</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">{totalImported.toFixed(1)}kWh</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">From grid</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Exported</p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{totalExported.toFixed(1)}kWh</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">To grid</p>
            </div>
          </GlassCard>
          <GlassCard colors={netBalance >= 0 ? { primary: "emerald", secondary: "green" } : { primary: "red", secondary: "rose" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Net Balance</p>
              <p className={`text-4xl font-bold ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(1)}kWh
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{netBalance >= 0 ? 'Net exporter' : 'Net importer'}</p>
            </div>
          </GlassCard>
          <GlassCard colors={totalCost <= 0 ? { primary: "emerald", secondary: "green" } : { primary: "amber", secondary: "orange" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Cost</p>
              <p className={`text-4xl font-bold ${totalCost <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                ${Math.abs(totalCost).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{totalCost <= 0 ? 'Credit earned' : 'Amount owed'}</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Grid Events */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Recent Grid Activity
            </h2>
            <div className="space-y-4">
              {gridMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {metric.netFlow < 0 ? '⬆️ Exporting' : '⬇️ Importing'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(metric.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${metric.netFlow < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {Math.abs(metric.netFlow).toFixed(1)}kWh
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${metric.tariff === 'peak' ? 'bg-red-500/20 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-emerald-500/20 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}
                      >
                        {metric.tariff.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Imported</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">{metric.imported}kWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Exported</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{metric.exported}kWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Voltage</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.voltage}V</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Frequency</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.frequency}Hz</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Power Factor: </span>
                      <span className="text-gray-900 dark:text-white font-semibold">{metric.powerFactor}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Cost: </span>
                      <span className={`font-bold ${metric.cost <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        ${Math.abs(metric.cost).toFixed(2)} {metric.cost <= 0 ? 'credit' : 'charge'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassSection>

        {/* Statistics */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {Math.round(gridMetrics.reduce((sum, m) => sum + m.voltage, 0) / gridMetrics.length)}V
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Voltage</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {(gridMetrics.reduce((sum, m) => sum + m.frequency, 0) / gridMetrics.length).toFixed(2)}Hz
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Frequency</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "blue", secondary: "sky" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {(gridMetrics.reduce((sum, m) => sum + m.powerFactor, 0) / gridMetrics.length).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg Power Factor</p>
            </div>
          </GlassCard>
          <GlassCard colors={netBalance >= 0 ? { primary: "emerald", secondary: "green" } : { primary: "amber", secondary: "orange" }}>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <p className={`text-4xl font-bold ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {((totalExported / (totalImported + totalExported)) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Export Ratio</p>
            </div>
          </GlassCard>
        </GlassGrid>

      </div>
    </div>
  );
}
