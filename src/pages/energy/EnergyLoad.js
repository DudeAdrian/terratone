import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";

export default function EnergyLoad() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading load data...</div>
        </GlassCard>
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
              ⚙️ Load Management
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Smart load shedding and priority-based energy distribution
            </p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={1} colsMd={3} gap={6}>
          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Current Load</p>
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{(totalCurrentLoad/1000).toFixed(2)}kW</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{activeLoads} zones active</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "blue", secondary: "sky" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Today's Consumption</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalTodayConsumption.toFixed(1)}kWh</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">All zones combined</p>
            </div>
          </GlassCard>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="flex flex-col items-center justify-center min-h-[140px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Controllable Load</p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {(loadProfiles.filter(l => l.controllable).reduce((sum, l) => sum + l.currentLoad, 0) / 1000).toFixed(2)}kW
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{loadProfiles.filter(l => l.controllable).length} zones</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Load Profiles */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Load Profiles
            </h2>
            <GlassGrid cols={1} colsMd={2} gap={6}>
              {loadProfiles.map((load) => (
                <GlassCard key={load.zone}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{load.zone}</h3>
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
                        className={`px-3 py-1 rounded-full text-xs font-bold ${load.status === 'active' ? 'bg-emerald-500/20 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-500/20 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'}`}
                      >
                        {load.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Load</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{load.currentLoad}W</p>
                    </div>
                    <div className="bg-orange-500/10 dark:bg-orange-900/20 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Today's Use</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{load.todayConsumption}kWh</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">vs Daily Average</span>
                      <span className={load.todayConsumption > load.averageDailyUse ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {load.todayConsumption > load.averageDailyUse ? '↑' : '↓'} 
                        {Math.abs(((load.todayConsumption - load.averageDailyUse) / load.averageDailyUse) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min((load.todayConsumption / load.averageDailyUse) * 100, 100)}%`,
                          backgroundColor: load.todayConsumption > load.averageDailyUse ? '#f59e0b' : '#4ade80'
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Avg daily: {load.averageDailyUse}kWh</p>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">Scheduled:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{load.scheduled ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">Controllable:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{load.controllable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

        {/* Load Distribution */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
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
                        <span className="text-gray-900 dark:text-white capitalize font-semibold">{priority} Priority</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {(priorityPower/1000).toFixed(2)}kW ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getPriorityColor(priority)
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{priorityLoads.length} zone(s)</p>
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
