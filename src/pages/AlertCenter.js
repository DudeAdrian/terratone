// src/pages/AlertCenter.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import eventBus, { EVENTS } from "../core/EventBus";

const AlertCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all"); // all, critical, high, medium, low
  const [serviceFilter, setServiceFilter] = useState("all");
  const [acknowledgedFilter, setAcknowledgedFilter] = useState("unacknowledged"); // all, acknowledged, unacknowledged

  useEffect(() => {
    initializeAlerts();
    
    // Subscribe to alert events
    const unsubscribers = [];
    
    unsubscribers.push(eventBus.on(EVENTS.ALERT_CREATED, handleNewAlert));
    unsubscribers.push(eventBus.on(EVENTS.WATER_QUALITY_ALERT, handleWaterAlert));
    unsubscribers.push(eventBus.on(EVENTS.PEST_RISK_CHANGED, handlePestAlert));
    unsubscribers.push(eventBus.on(EVENTS.AUTOPILOT_INTERVENTION, handleAutopilotIntervention));
    unsubscribers.push(eventBus.on(EVENTS.ENERGY_CONSUMPTION_ALERT, handleEnergyAlert));

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  const initializeAlerts = () => {
    // Load existing alerts from storage or generate sample alerts
    const sampleAlerts = [
      {
        id: 1,
        timestamp: Date.now() - 3600000,
        service: "water",
        severity: "high",
        title: "pH Level Outside Range",
        message: "Water pH is 8.4 - above recommended range of 6.5-8.0",
        acknowledged: false,
        resolvedAt: null,
      },
      {
        id: 2,
        timestamp: Date.now() - 7200000,
        service: "pest",
        severity: "medium",
        title: "Pest Population Increasing",
        message: "Aphid population detected in Zone A - 35 individuals",
        acknowledged: false,
        resolvedAt: null,
      },
      {
        id: 3,
        timestamp: Date.now() - 10800000,
        service: "autopilot",
        severity: "medium",
        title: "Manual Review Required",
        message: "Crop rotation playbook requires manual approval for bed rotation",
        acknowledged: true,
        acknowledgedAt: Date.now() - 3600000,
        resolvedAt: null,
      },
      {
        id: 4,
        timestamp: Date.now() - 14400000,
        service: "energy",
        severity: "low",
        title: "Pump Efficiency Degraded",
        message: "Main pump efficiency dropped to 88% (from 95%)",
        acknowledged: true,
        acknowledgedAt: Date.now() - 7200000,
        resolvedAt: Date.now() - 3600000,
      },
      {
        id: 5,
        timestamp: Date.now() - 1800000,
        service: "water",
        severity: "critical",
        title: "Dissolved Oxygen Critically Low",
        message: "DO level at 4.2 mg/L - CRITICAL! Fish health at risk",
        acknowledged: false,
        resolvedAt: null,
      },
    ];

    setAlerts(sampleAlerts);
  };

  // Event handlers
  const handleNewAlert = (alertData) => {
    const newAlert = {
      id: Date.now(),
      timestamp: Date.now(),
      ...alertData,
      acknowledged: false,
      resolvedAt: null,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleWaterAlert = (data) => {
    handleNewAlert({
      service: "water",
      severity: data.severity || "high",
      title: "Water Quality Alert",
      message: data.message || "Water quality parameter out of range",
    });
  };

  const handlePestAlert = (data) => {
    handleNewAlert({
      service: "pest",
      severity: data.severity || "medium",
      title: "Pest Risk Changed",
      message: data.message || "Pest risk level has changed",
    });
  };

  const handleAutopilotIntervention = (data) => {
    handleNewAlert({
      service: "autopilot",
      severity: data.priority || "medium",
      title: "Autopilot Intervention Required",
      message: data.reason || "Manual review required",
    });
  };

  const handleEnergyAlert = (data) => {
    handleNewAlert({
      service: "energy",
      severity: data.severity || "low",
      title: "Energy Alert",
      message: data.message || "Energy consumption anomaly detected",
    });
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedAt: Date.now() }
        : alert
    ));

    // Emit acknowledge event
    eventBus.emit(EVENTS.ALERT_ACKNOWLEDGED, { alertId });

    // Log to logger service
    const logger = sofieCore.getService("logger");
    if (logger) {
      logger.log(`[AlertCenter] Alert ${alertId} acknowledged`);
    }
  };

  const resolveAlert = (alertId, resolution = "") => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolvedAt: Date.now(), resolution }
        : alert
    ));

    // Emit resolve event
    eventBus.emit(EVENTS.ALERT_RESOLVED, { alertId, resolution });

    // Log to logger service
    const logger = sofieCore.getService("logger");
    if (logger) {
      logger.log(`[AlertCenter] Alert ${alertId} resolved: ${resolution}`);
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Filtering
  const filteredAlerts = alerts.filter(alert => {
    // Severity filter
    if (filter !== "all" && alert.severity !== filter) return false;
    
    // Service filter
    if (serviceFilter !== "all" && alert.service !== serviceFilter) return false;
    
    // Acknowledged filter
    if (acknowledgedFilter === "acknowledged" && !alert.acknowledged) return false;
    if (acknowledgedFilter === "unacknowledged" && alert.acknowledged) return false;
    
    return true;
  });

  // Statistics
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === "critical" && !a.resolvedAt).length,
    high: alerts.filter(a => a.severity === "high" && !a.resolvedAt).length,
    medium: alerts.filter(a => a.severity === "medium" && !a.resolvedAt).length,
    low: alerts.filter(a => a.severity === "low" && !a.resolvedAt).length,
    unacknowledged: alerts.filter(a => !a.acknowledged && !a.resolvedAt).length,
    resolved: alerts.filter(a => a.resolvedAt).length,
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-100 border-red-500 text-red-800";
      case "high": return "bg-orange-100 border-orange-500 text-orange-800";
      case "medium": return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "low": return "bg-blue-100 border-blue-500 text-blue-800";
      default: return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical": return "🚨";
      case "high": return "⚠️";
      case "medium": return "⚡";
      case "low": return "ℹ️";
      default: return "📋";
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case "water": return "💧";
      case "pest": return "🐛";
      case "autopilot": return "🤖";
      case "energy": return "⚡";
      case "food": return "🌱";
      default: return "🔧";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🔔 Alert Center</h1>
        <p className="text-red-100">
          Centralized monitoring and management of all system alerts
        </p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-6 gap-4">
        <StatCard label="Total Alerts" value={stats.total} color="bg-gray-100" />
        <StatCard label="Critical" value={stats.critical} color="bg-red-100 text-red-800" />
        <StatCard label="High" value={stats.high} color="bg-orange-100 text-orange-800" />
        <StatCard label="Medium" value={stats.medium} color="bg-yellow-100 text-yellow-800" />
        <StatCard label="Unacknowledged" value={stats.unacknowledged} color="bg-purple-100 text-purple-800" />
        <StatCard label="Resolved" value={stats.resolved} color="bg-green-100 text-green-800" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Services</option>
              <option value="water">Water</option>
              <option value="pest">Pest Management</option>
              <option value="autopilot">Autopilot</option>
              <option value="energy">Energy</option>
              <option value="food">Food</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={acknowledgedFilter}
              onChange={(e) => setAcknowledgedFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="unacknowledged">Unacknowledged</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Alerts</h3>
            <p className="text-gray-600">All systems operating normally</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg shadow-md p-6 border-l-4 ${getSeverityColor(alert.severity)} ${
                alert.resolvedAt ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{getSeverityIcon(alert.severity)}</span>
                    <span className="text-2xl mr-3">{getServiceIcon(alert.service)}</span>
                    <div>
                      <h3 className="text-lg font-bold">{alert.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-semibold capitalize">{alert.service}</span>
                        <span>•</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        {alert.acknowledged && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">✓ Acknowledged</span>
                          </>
                        )}
                        {alert.resolvedAt && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">✓ Resolved</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 ml-14">{alert.message}</p>
                  {alert.resolution && (
                    <div className="ml-14 bg-green-50 border border-green-200 rounded p-3 mb-4">
                      <span className="font-semibold text-green-800">Resolution: </span>
                      <span className="text-green-700">{alert.resolution}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!alert.resolvedAt && (
                  <div className="flex gap-2 ml-4">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const resolution = prompt("Enter resolution notes:");
                        if (resolution) resolveAlert(alert.id, resolution);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className={`p-4 rounded-lg ${color} text-center`}>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm font-medium">{label}</div>
  </div>
);

export default AlertCenter;
