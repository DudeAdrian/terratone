import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function FoodPlanning() {
  const [supplyPlanning, setSupplyPlanning] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      if (foodService && foodService.getSupplyPlanning) {
        const data = foodService.getSupplyPlanning();
        setSupplyPlanning(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading supply planning data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading planning data...</div>
      </div>
    );
  }

  if (!supplyPlanning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">No planning data available</div>
      </div>
    );
  }

  const getHarvestColor = (daysUntil) => {
    if (daysUntil <= 7) return "#ef4444";
    if (daysUntil <= 14) return "#f59e0b";
    if (daysUntil <= 21) return "#f5a873";
    return "#4ade80";
  };

  const totalPlannedYield = supplyPlanning.upcomingHarvests.reduce((sum, h) => sum + h.estimatedYield, 0);

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
          📅 Supply Planning
        </h1>
        <p className="text-gray-300">Upcoming harvests and seasonal supply projections</p>
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
          <p className="text-sm text-gray-400 mb-2">Upcoming Harvests</p>
          <p className="text-4xl font-bold" style={{ color: '#f5a873' }}>
            {supplyPlanning.upcomingHarvests.length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Next 30 days</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Planned Yield</p>
          <p className="text-4xl font-bold text-white">{totalPlannedYield}kg</p>
          <p className="text-xs text-gray-500 mt-2">Total projected</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Seasonal Period</p>
          <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
            {supplyPlanning.currentSeason}
          </p>
          <p className="text-xs text-gray-500 mt-2">Growing season</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #22d3ee18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #22d3ee55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Storage Utilization</p>
          <p className="text-4xl font-bold" style={{ color: '#22d3ee' }}>
            {supplyPlanning.storageCapacityUsed}%
          </p>
          <p className="text-xs text-gray-500 mt-2">Current usage</p>
        </div>
      </div>

      {/* Upcoming Harvests */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Upcoming Harvests
        </h2>
        <div className="space-y-4">
          {supplyPlanning.upcomingHarvests.map((harvest) => {
            const daysUntil = Math.floor(
              (new Date(harvest.estimatedHarvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
            );
            return (
              <div
                key={harvest.cropId}
                style={{
                  ...glassPanel,
                  background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
                  border: '1px solid #f5a87355',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold" style={{ color: '#f5a873' }}>
                      {harvest.cropName}
                    </h3>
                    <p className="text-sm text-gray-400">{harvest.gardenLocation}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4"
                    style={{
                      backgroundColor: `${getHarvestColor(daysUntil)}20`,
                      color: getHarvestColor(daysUntil),
                      border: `1px solid ${getHarvestColor(daysUntil)}40`
                    }}
                  >
                    {daysUntil} days
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-orange-500/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Estimated Yield</p>
                    <p className="text-2xl font-bold" style={{ color: '#f5a873' }}>
                      {harvest.estimatedYield}kg
                    </p>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Maturity</p>
                    <p className="text-2xl font-bold text-white">
                      {harvest.maturityPercentage}%
                    </p>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-sm font-bold text-white">{harvest.status}</p>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Harvest Date</p>
                    <p className="text-sm font-bold text-white">
                      {new Date(harvest.estimatedHarvestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Growth Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Maturity Progress</span>
                    <span className="text-white font-bold">{harvest.maturityPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${harvest.maturityPercentage}%`,
                        backgroundColor: '#f5a873'
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                {harvest.notes && (
                  <div className="bg-orange-500/10 rounded-lg p-3 text-sm">
                    <p className="text-xs text-gray-400 mb-1">Notes</p>
                    <p className="text-gray-300">{harvest.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Schedule */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Seasonal Schedule
        </h2>
        <div className="space-y-3">
          {supplyPlanning.seasonalSchedule.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between pb-3 border-b border-orange-400/20 last:pb-0 last:border-b-0">
              <div className="flex-1">
                <p className="font-semibold text-white">{item.phase}</p>
                <p className="text-sm text-gray-400">{item.crops.join(", ")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{item.timing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Projections */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Storage Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-orange-500/10 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Current Capacity Used</p>
            <p className="text-3xl font-bold" style={{ color: '#f5a873' }}>
              {supplyPlanning.storageCapacityUsed}%
            </p>
            <div className="w-full bg-gray-700/30 rounded-full h-3 mt-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${supplyPlanning.storageCapacityUsed}%`,
                  backgroundColor: '#f5a873'
                }}
              />
            </div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Projected After Harvest</p>
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {supplyPlanning.projectedCapacityAfterHarvest}%
            </p>
            <div className="w-full bg-gray-700/30 rounded-full h-3 mt-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${supplyPlanning.projectedCapacityAfterHarvest}%`,
                  backgroundColor: '#4ade80'
                }}
              />
            </div>
          </div>
        </div>

        {/* Distribution Analysis */}
        <div className="border-t border-orange-400/20 pt-4">
          <h3 className="text-lg font-bold mb-3 text-gray-300">
            Projected Distribution
          </h3>
          <div className="space-y-2">
            {supplyPlanning.storageDistribution.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-400">{item.location}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 bg-gray-700/30 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${item.percentageOfTotal}%`,
                        backgroundColor: '#f5a873'
                      }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm min-w-fit">
                    {item.projectedKg}kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
