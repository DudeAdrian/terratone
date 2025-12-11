import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function EnergyLoad() {
  const [loadProfiles, setLoadProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const energyService = sofieCore.getService("energy");
      if (energyService && energyService.getLoadProfiles) {
        const profiles = energyService.getLoadProfiles();
        setLoadProfiles(profiles);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading load data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading load data...</div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#4ade80"
    };
    return colors[priority] || "#9ca3af";
  };

  const totalCurrentLoad = loadProfiles.reduce((sum, l) => sum + l.currentLoad, 0);
  const totalTodayConsumption = loadProfiles.reduce((sum, l) => sum + l.todayConsumption, 0);
  const activeLoads = loadProfiles.filter(l => l.status === "active").length;

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
          ⚙️ Load Management
        </h1>
        <p className="text-gray-300">Smart load shedding and priority-based energy distribution</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f7c66b55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Current Load</p>
          <p className="text-4xl font-bold" style={{ color: '#f7c66b' }}>{(totalCurrentLoad/1000).toFixed(2)}kW</p>
          <p className="text-xs text-gray-500 mt-2">{activeLoads} zones active</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Today's Consumption</p>
          <p className="text-4xl font-bold text-white">{totalTodayConsumption.toFixed(1)}kWh</p>
          <p className="text-xs text-gray-500 mt-2">All zones combined</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Controllable Load</p>
          <p className="text-4xl font-bold" style={{ color: '#4ade80' }}>
            {(loadProfiles.filter(l => l.controllable).reduce((sum, l) => sum + l.currentLoad, 0) / 1000).toFixed(2)}kW
          </p>
          <p className="text-xs text-gray-500 mt-2">{loadProfiles.filter(l => l.controllable).length} zones</p>
        </div>
      </div>

      {/* Load Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {loadProfiles.map((load) => (
          <div
            key={load.zone}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
              border: '1px solid #f7c66b55',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{load.zone}</h2>
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getPriorityColor(load.priority)}20`,
                    color: getPriorityColor(load.priority),
                    border: `1px solid ${getPriorityColor(load.priority)}40`
                  }}
                >
                  {load.priority.toUpperCase()}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: load.status === "active" ? '#4ade8020' : '#9ca3af20',
                    color: load.status === "active" ? '#4ade80' : '#9ca3af',
                    border: load.status === "active" ? '1px solid #4ade8040' : '1px solid #9ca3af40'
                  }}
                >
                  {load.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Current Load</p>
                <p className="text-2xl font-bold" style={{ color: '#f7c66b' }}>{load.currentLoad}W</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Today's Use</p>
                <p className="text-2xl font-bold text-white">{load.todayConsumption}kWh</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">vs Daily Average</span>
                <span className={load.todayConsumption > load.averageDailyUse ? 'text-orange-400' : 'text-green-400'}>
                  {load.todayConsumption > load.averageDailyUse ? '↑' : '↓'} 
                  {Math.abs(((load.todayConsumption - load.averageDailyUse) / load.averageDailyUse) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min((load.todayConsumption / load.averageDailyUse) * 100, 100)}%`,
                    backgroundColor: load.todayConsumption > load.averageDailyUse ? '#f59e0b' : '#4ade80'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Avg daily: {load.averageDailyUse}kWh</p>
            </div>

            <div className="border-t border-orange-400/20 pt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Scheduled:</span>
                <span className="text-white font-semibold">{load.scheduled ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Controllable:</span>
                <span className="text-white font-semibold">{load.controllable ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load Distribution */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f7c66b18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f7c66b55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f7c66b' }}>
          Priority Distribution
        </h2>
        <div className="space-y-4">
          {['high', 'medium', 'low'].map((priority) => {
            const priorityLoads = loadProfiles.filter(l => l.priority === priority);
            const priorityPower = priorityLoads.reduce((sum, l) => sum + l.currentLoad, 0);
            const percentage = Math.round((priorityPower / totalCurrentLoad) * 100);
            
            return (
              <div key={priority}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getPriorityColor(priority) }}
                    />
                    <span className="text-white capitalize font-semibold">{priority} Priority</span>
                  </div>
                  <span className="text-gray-400">
                    {(priorityPower/1000).toFixed(2)}kW ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getPriorityColor(priority)
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{priorityLoads.length} zone(s)</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
