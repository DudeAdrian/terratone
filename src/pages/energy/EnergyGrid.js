import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function EnergyGrid() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading grid data...</div>
      </div>
    );
  }

  const totalImported = gridMetrics.reduce((sum, m) => sum + m.imported, 0);
  const totalExported = gridMetrics.reduce((sum, m) => sum + m.exported, 0);
  const netBalance = totalExported - totalImported;
  const totalCost = gridMetrics.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #f7c66b22, rgba(210, 175, 135, 0.12))',
        border: '1px solid #f7c66b66',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #f7c66b55, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f7c66b' }}>
          ⚡ Grid Import/Export
        </h1>
        <p className="text-gray-300">Bi-directional energy flow and net metering analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #ef444418, rgba(210, 175, 135, 0.10))',
            border: '1px solid #ef444455',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Imported</p>
          <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>{totalImported.toFixed(1)}kWh</p>
          <p className="text-xs text-gray-500 mt-2">From grid</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Exported</p>
          <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>{totalExported.toFixed(1)}kWh</p>
          <p className="text-xs text-gray-500 mt-2">To grid</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: netBalance >= 0 
              ? 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))'
              : 'linear-gradient(135deg, #ef444418, rgba(210, 175, 135, 0.10))',
            border: netBalance >= 0 ? '1px solid #4ade8055' : '1px solid #ef444455',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Net Balance</p>
          <p className="text-3xl font-bold" style={{ color: netBalance >= 0 ? '#4ade80' : '#ef4444' }}>
            {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(1)}kWh
          </p>
          <p className="text-xs text-gray-500 mt-2">{netBalance >= 0 ? 'Net exporter' : 'Net importer'}</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: totalCost <= 0
              ? 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))'
              : 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: totalCost <= 0 ? '1px solid #4ade8055' : '1px solid #f7c66b55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Cost</p>
          <p className="text-3xl font-bold" style={{ color: totalCost <= 0 ? '#4ade80' : '#f7c66b' }}>
            ${Math.abs(totalCost).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{totalCost <= 0 ? 'Credit earned' : 'Amount owed'}</p>
        </div>
      </div>

      {/* Grid Events */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>
          Recent Grid Activity
        </h2>
        <div className="space-y-4">
          {gridMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-orange-500/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-white text-lg">
                    {metric.netFlow < 0 ? '⬆️ Exporting' : '⬇️ Importing'}
                  </p>
                  <p className="text-sm text-gray-400">{new Date(metric.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: metric.netFlow < 0 ? '#4ade80' : '#ef4444' }}>
                    {Math.abs(metric.netFlow).toFixed(1)}kWh
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-1"
                    style={{
                      backgroundColor: metric.tariff === 'peak' ? '#ef444420' : '#4ade8020',
                      color: metric.tariff === 'peak' ? '#ef4444' : '#4ade80',
                      border: metric.tariff === 'peak' ? '1px solid #ef444440' : '1px solid #4ade8040'
                    }}
                  >
                    {metric.tariff.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Imported</p>
                  <p className="text-lg font-semibold" style={{ color: '#ef4444' }}>{metric.imported}kWh</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Exported</p>
                  <p className="text-lg font-semibold" style={{ color: '#4ade80' }}>{metric.exported}kWh</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Voltage</p>
                  <p className="text-lg font-semibold text-white">{metric.voltage}V</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Frequency</p>
                  <p className="text-lg font-semibold text-white">{metric.frequency}Hz</p>
                </div>
              </div>

              <div className="border-t border-orange-400/20 pt-3 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-400">Power Factor: </span>
                  <span className="text-white font-semibold">{metric.powerFactor}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Cost: </span>
                  <span 
                    className="font-bold"
                    style={{ color: metric.cost <= 0 ? '#4ade80' : '#f7c66b' }}
                  >
                    ${Math.abs(metric.cost).toFixed(2)} {metric.cost <= 0 ? 'credit' : 'charge'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>
          Grid Connection Health
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {Math.round(gridMetrics.reduce((sum, m) => sum + m.voltage, 0) / gridMetrics.length)}V
            </p>
            <p className="text-sm text-gray-400">Avg Voltage</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {(gridMetrics.reduce((sum, m) => sum + m.frequency, 0) / gridMetrics.length).toFixed(2)}Hz
            </p>
            <p className="text-sm text-gray-400">Avg Frequency</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
              {(gridMetrics.reduce((sum, m) => sum + m.powerFactor, 0) / gridMetrics.length).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">Avg Power Factor</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: netBalance >= 0 ? '#4ade80' : '#f7c66b' }}>
              {((totalExported / (totalImported + totalExported)) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-400">Export Ratio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
