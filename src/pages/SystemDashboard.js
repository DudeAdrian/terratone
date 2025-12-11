import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import { createBackHandler } from "../utils/navigation";

const SystemDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [services, setServices] = useState({});
  const [systemHealth, setSystemHealth] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [autopilotStatus, setAutopilotStatus] = useState(null);
  const [climateZone, setClimateZone] = useState("temperate");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    initializeDashboard();
    const unsubscribers = [];
    unsubscribers.push(eventBus.on(EVENTS.AUTOPILOT_DECISION, handleAutopilotDecision));
    unsubscribers.push(eventBus.on(EVENTS.CLIMATE_ZONE_CHANGED, handleClimateChange));
    const interval = setInterval(updateDashboardData, 30000);
    return () => {
      unsubscribers.forEach(unsub => unsub());
      clearInterval(interval);
    };
  }, []);

  const initializeDashboard = () => {
    try {
      sofieCore.init();
      const storageService = sofieCore.getService("storage");
      if (storageService) {
        const savedZone = storageService.getPreference("climateZone", "temperate");
        setClimateZone(savedZone);
      }
      updateDashboardData();
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    }
  };

  const updateDashboardData = () => {
    try {
      const autopilot = sofieCore.getService("autopilot");
      if (autopilot) {
        setAutopilotStatus({
          mode: autopilot.getMode?.() || "monitoring",
          health: autopilot.getSystemHealthScore?.() || 92,
          stats: autopilot.getStatistics?.() || {}
        });
      }
      setSystemHealth({ overall: 92, components: 7, operational: 7 });
      setRecentAlerts([
        { id: 1, type: "water", severity: "medium", message: "pH level slightly elevated", time: "2m ago" },
        { id: 2, type: "energy", severity: "low", message: "Solar efficiency nominal", time: "5m ago" }
      ]);
    } catch (error) {
      console.error("Error updating dashboard:", error);
    }
  };

  const handleAutopilotDecision = (data) => {
    console.log("Autopilot decision:", data);
  };

  const handleClimateChange = (data) => {
    setClimateZone(data.zone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "gray", secondary: "slate" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e8d3ba'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              ⚙️ System Dashboard
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Real-time system health monitoring, service status, and autonomous control
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium backdrop-blur-sm">
                ✓ All Systems Operational
              </span>
              <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🤖 Autopilot Enabled
              </span>
              <span className="px-4 py-2 bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📊 Live Monitoring
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Key Stats */}
        <GlassGrid cols={2} colsMd={3} gap={5}>
          <GlassCard colors={{ primary: "gray", secondary: "slate" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">System Health</div>
              <div className="text-5xl font-bold text-gray-600 dark:text-gray-400">{systemHealth?.overall || 0}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Optimal</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Services</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{systemHealth?.operational || 0}/{systemHealth?.components || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Running</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Uptime</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">99.8%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Last 30 days</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Tabs */}
        <GlassSection colors={{ primary: "gray", secondary: "slate" }}>
          <div className="flex flex-wrap border-b border-gray-300/30 dark:border-gray-700/30 backdrop-blur-sm">
            {["overview", "services", "alerts", "autopilot"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-gray-400/40 to-gray-300/20 dark:from-gray-600/50 dark:to-gray-700/30 text-gray-700 dark:text-gray-300 border-b-2 border-gray-600 dark:border-gray-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/10 dark:hover:bg-gray-700/10"
                }`}
              >
                {tab === "overview" && "📊"}
                {tab === "services" && "🔧"}
                {tab === "alerts" && "🚨"}
                {tab === "autopilot" && "🤖"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "gray", secondary: "slate" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Core Systems</h3>
                    <div className="space-y-3">
                      {["Water Recycling", "Food Production", "Energy Generation", "Climate Control", "Pest Management", "Storage", "Communication"].map((sys, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-100/30 dark:bg-gray-700/30">
                          <span className="text-gray-900 dark:text-white font-medium">{sys}</span>
                          <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      {[
                        { label: "CPU Usage", value: 24 },
                        { label: "Memory", value: 45 },
                        { label: "Storage", value: 62 },
                        { label: "Network", value: 38 }
                      ].map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-gray-500 to-slate-500 h-2 rounded-full"
                              style={{ width: `${metric.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {["Logger", "Energy", "Community", "Food", "Water", "Housing", "Sustainability"].map((service, idx) => (
                  <GlassCard key={service} colors={{ primary: "gray", secondary: "slate" }}>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">{service}</h3>
                        <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">Active</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>Uptime: <span className="font-bold text-gray-900 dark:text-white">99.9%</span></p>
                        <p>Response Time: <span className="font-bold text-gray-900 dark:text-white">&lt;50ms</span></p>
                        <p>Requests/min: <span className="font-bold text-gray-900 dark:text-white">234</span></p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <div className="p-8 space-y-4">
              {recentAlerts.map((alert) => (
                <GlassCard key={alert.id} colors={{ primary: "gray", secondary: "slate" }}>
                  <div className={`p-6 border-l-4 ${
                    alert.severity === "critical" ? "border-red-500" :
                    alert.severity === "high" ? "border-orange-500" :
                    alert.severity === "medium" ? "border-amber-500" : "border-blue-500"
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{alert.message}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        alert.severity === "critical" ? "bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300" :
                        alert.severity === "high" ? "bg-orange-100/50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300" :
                        alert.severity === "medium" ? "bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" :
                        "bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      }`}>{alert.severity}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Service: {alert.type} • {alert.time}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Autopilot Tab */}
          {activeTab === "autopilot" && (
            <div className="p-8 space-y-6">
              <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Autopilot Status</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Mode</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{autopilotStatus?.mode || "Monitoring"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Health Score</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{autopilotStatus?.health || 0}%</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
              <GlassCard colors={{ primary: "gray", secondary: "slate" }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Decisions</h3>
                  <div className="space-y-3">
                    {[
                      "Adjusted irrigation schedule based on soil moisture",
                      "Rotated crop zones for optimal nutrient balance",
                      "Optimized energy storage discharge timing"
                    ].map((decision, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-blue-100/20 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 text-sm">
                        ✓ {decision}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </GlassSection>

      </div>
    </div>
  );
};

export default SystemDashboard;
