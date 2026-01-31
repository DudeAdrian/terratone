import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";
import { useAlerts } from "../hooks/useApi";

const AlertCenter = () => {
  const { data: apiAlerts, loading: alertsLoading, error: alertsError, refetch } = useAlerts("active");
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [acknowledgedFilter, setAcknowledgedFilter] = useState("unacknowledged");
  const [activeTab, setActiveTab] = useState("active");

  // Initialize with API data or fallback to sample alerts
  useEffect(() => {
    if (apiAlerts && Array.isArray(apiAlerts)) {
      setAlerts(apiAlerts);
    } else {
      initializeAlerts();
    }
  }, [apiAlerts]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribers = [];
    unsubscribers.push(eventBus.on(EVENTS.ALERT_CREATED, handleNewAlert));
    unsubscribers.push(eventBus.on(EVENTS.WATER_QUALITY_ALERT, handleWaterAlert));
    unsubscribers.push(eventBus.on(EVENTS.PEST_RISK_CHANGED, handlePestAlert));
    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const initializeAlerts = () => {
    const sampleAlerts = [
      { id: 1, timestamp: Date.now() - 3600000, service: "water", severity: "high", title: "pH Level Elevated", message: "Water pH is 8.4 - above range", acknowledged: false },
      { id: 2, timestamp: Date.now() - 7200000, service: "pest", severity: "medium", title: "Pest Population Rising", message: "Aphids detected in Zone A", acknowledged: false },
      { id: 3, timestamp: Date.now() - 10800000, service: "energy", severity: "low", title: "Efficiency Degraded", message: "Pump efficiency dropped to 88%", acknowledged: true },
      { id: 5, timestamp: Date.now() - 1800000, service: "water", severity: "critical", title: "CRITICAL: Oxygen Level Low", message: "DO at 4.2 mg/L - fish at risk", acknowledged: false }
    ];
    setAlerts(sampleAlerts);
  };

  const handleNewAlert = (alertData) => {
    const newAlert = {
      id: Date.now(),
      timestamp: Date.now(),
      ...alertData,
      acknowledged: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleWaterAlert = (data) => {
    console.log("Water alert:", data);
  };

  const handlePestAlert = (data) => {
    console.log("Pest alert:", data);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "critical": return { bg: "bg-red-100/40 dark:bg-red-900/40", border: "border-red-500", text: "text-red-700 dark:text-red-300", badge: "bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300" };
      case "high": return { bg: "bg-orange-100/40 dark:bg-orange-900/40", border: "border-orange-500", text: "text-orange-700 dark:text-orange-300", badge: "bg-orange-100/50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300" };
      case "medium": return { bg: "bg-amber-100/40 dark:bg-amber-900/40", border: "border-amber-500", text: "text-amber-700 dark:text-amber-300", badge: "bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" };
      default: return { bg: "bg-blue-100/40 dark:bg-blue-900/40", border: "border-blue-500", text: "text-blue-700 dark:text-blue-300", badge: "bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300" };
    }
  };

  const filteredAlerts = alerts.filter(a => {
    let severityMatch = filter === "all" || a.severity === filter;
    let ackMatch = acknowledgedFilter === "all" || (acknowledgedFilter === "acknowledged" ? a.acknowledged : !a.acknowledged);
    return severityMatch && ackMatch;
  });

  const activeAlerts = filteredAlerts.filter(a => !a.acknowledged && a.severity !== "low");
  const resolvedAlerts = filteredAlerts.filter(a => a.acknowledged);

  // Loading state
  if (alertsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-red-950 flex items-center justify-center">
        <QuantumCard chakra="root">
          <div className="p-8 text-rose-100 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-rose-400 border-t-transparent rounded-full mr-3"></div>
            Loading alerts...
          </div>
        </QuantumCard>
      </div>
    );
  }

  // Error state
  if (alertsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-red-950 flex items-center justify-center p-4">
        <QuantumCard chakra="root">
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Alerts</h2>
            <p className="text-rose-100/80 mb-4">{alertsError}</p>
            <button 
              onClick={refetch}
              className="px-6 py-2 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        </QuantumCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-red-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <QuantumSection chakra="root" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_0_25px_rgba(255,0,85,0.55)]">
              🚨 Alert Center
            </h1>
            <p className="text-lg text-rose-100 max-w-2xl drop-shadow-[0_0_12px_rgba(255,0,85,0.35)]">
              Real-time system alerts, critical notifications, and issue tracking
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-white/15">
                🔔 Live Alerts
              </span>
              <span className="px-4 py-2 bg-white/10 text-amber-200 rounded-full text-sm font-medium backdrop-blur-sm border border-amber-300/30">
                ⚙️ Auto-Detection
              </span>
              <span className="px-4 py-2 bg-white/10 text-cyan-200 rounded-full text-sm font-medium backdrop-blur-sm border border-cyan-300/30">
                📊 Prioritized
              </span>
            </div>
          </div>
        </QuantumSection>

        {/* Alert Stats */}
        <QuantumGlassGrid columns={4} gap={5}>
          <QuantumCard chakra="root" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-rose-100 mb-2">Total Alerts</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,0,85,0.5)]">{alerts.length}</div>
              <p className="text-xs text-rose-200/80 mt-3">All-time</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="sacral" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-amber-100 mb-2">Active</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,102,0,0.5)]">{activeAlerts.length}</div>
              <p className="text-xs text-amber-200/80 mt-3">Unresolved</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="root" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-rose-100 mb-2">Critical</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_22px_rgba(255,0,85,0.55)]">{alerts.filter(a => a.severity === "critical").length}</div>
              <p className="text-xs text-rose-200/80 mt-3">Immediate action</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-emerald-100 mb-2">Resolved</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]">{resolvedAlerts.length}</div>
              <p className="text-xs text-emerald-200/80 mt-3">Acknowledged</p>
            </div>
          </QuantumCard>
        </QuantumGlassGrid>

        {/* Filters & Tabs */}
        <QuantumSection chakra="root" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div className="flex flex-wrap border-b border-red-700/40 backdrop-blur-sm">
            {["active", "resolved"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-red-700/60 to-rose-600/50 text-white border-b-2 border-rose-300 shadow-[0_10px_30px_rgba(255,0,85,0.3)]"
                    : "text-rose-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab === "active" && "🔴"}
                {tab === "resolved" && "✅"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="p-4 md:p-8 border-b border-red-700/30 flex flex-wrap gap-3">
            {["all", "critical", "high", "medium", "low"].map(sev => (
              <button
                key={sev}
                onClick={() => setFilter(sev)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === sev
                    ? "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]"
                    : "bg-white/10 text-rose-100 hover:bg-white/20"
                }`}
              >
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            ))}
          </div>

          {/* Alerts Content */}
          <div className="p-8 space-y-4">
            {activeTab === "active" ? (
              activeAlerts.length > 0 ? activeAlerts.map(alert => {
                const colors = getSeverityColor(alert.severity);
                return (
                  <QuantumCard key={alert.id} chakra="root" blurLevel="medium" opacityLevel="veil" glow edgeGlow>
                    <div className={`p-6 border-l-4 ${colors.border} ${colors.bg}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{alert.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{alert.message}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${colors.badge}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-red-900/40">
                        <p className="text-xs text-rose-100/80">
                          {alert.service.toUpperCase()} • {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                        <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_15px_rgba(0,187,255,0.5)] text-white text-xs font-bold rounded-lg transition">
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  </QuantumCard>
                );
              }) : (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No active alerts - system is healthy ✓
                </div>
              )
            ) : (
              resolvedAlerts.length > 0 ? resolvedAlerts.map(alert => {
                const colors = getSeverityColor(alert.severity);
                return (
                  <QuantumCard key={alert.id} chakra="heart" blurLevel="medium" opacityLevel="veil" glow edgeGlow>
                    <div className={`p-6 border-l-4 border-gray-400/60 opacity-80`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white line-through drop-shadow-[0_0_12px_rgba(0,255,136,0.35)]">{alert.title}</h3>
                          <p className="text-sm text-rose-100/80 mt-2">{alert.message}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-xs font-bold border border-emerald-300/30">
                          ✓ RESOLVED
                        </span>
                      </div>
                      <p className="text-xs text-rose-100/70">
                        {alert.service.toUpperCase()} • Resolved {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </QuantumCard>
                );
              }) : (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  No resolved alerts
                </div>
              )
            )}
          </div>
        </QuantumSection>

      </div>
    </div>
  );
};

export default AlertCenter;
