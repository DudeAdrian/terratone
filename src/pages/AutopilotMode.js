// src/pages/AutopilotMode.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const AutopilotMode = () => {
  const [autopilotService, setAutopilotService] = useState(null);
  const [mode, setMode] = useState("manual");
  const [activeTab, setActiveTab] = useState("overview");
  const [playbooks, setPlaybooks] = useState([]);
  const [lastExecution, setLastExecution] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);

  useEffect(() => {
    sofieCore.init();
    const service = sofieCore.getService("autopilot");
    
    if (service) {
      setAutopilotService(service);
      setMode(service.mode);
      updateDisplayData(service);
    }
  }, []);

  const updateDisplayData = (service) => {
    if (!service) return;
    
    setPlaybooks(service.getPlaybookStatus());
    setMode(service.mode);
    setStatistics(service.getStatistics());
    setInterventions(service.getInterventionAlerts());
    setExecutionHistory(service.getExecutionHistory(10));
    
    if (service.lastExecution) {
      setLastExecution(service.lastExecution);
    }
  };

  const handleModeSwitch = (newMode) => {
    if (autopilotService) {
      const result = autopilotService.setMode(newMode);
      if (result.success) {
        setMode(newMode);
        if (newMode === "autopilot") {
          const execution = autopilotService.executeAutopilot("autopilot");
          setLastExecution(execution);
          updateDisplayData(autopilotService);
        }
      }
    }
  };

  const handleExecuteAutopilot = () => {
    if (autopilotService && mode === "autopilot") {
      const execution = autopilotService.executeAutopilot("autopilot");
      setLastExecution(execution);
      updateDisplayData(autopilotService);
    }
  };

  const handleTogglePlaybook = (playbookKey) => {
    if (autopilotService) {
      const playbook = autopilotService.playbooks[playbookKey];
      autopilotService.togglePlaybook(playbookKey, !playbook.enabled);
      setPlaybooks(autopilotService.getPlaybookStatus());
    }
  };

  if (!autopilotService) {
    return <div className="text-center py-12"><p className="text-gray-500">Loading autopilot service...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🤖 Autopilot Mode Control</h1>
        <p className="text-green-100">
          Automated system management with intelligent playbooks and real-time decision making
        </p>
      </div>

      {/* Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Operation Mode</h2>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => handleModeSwitch("manual")}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              mode === "manual"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            👤 Manual Control
          </button>
          <button
            onClick={() => handleModeSwitch("autopilot")}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              mode === "autopilot"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🤖 Autopilot
          </button>
          
          {mode === "autopilot" && (
            <button
              onClick={handleExecuteAutopilot}
              className="ml-auto px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition"
            >
              ▶️ Execute Now
            </button>
          )}
        </div>
        
        {mode === "autopilot" && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ <strong>Autopilot Active</strong> - System is managing {playbooks.filter(p => p.enabled).length} playbooks automatically
            </p>
          </div>
        )}
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600">System Health</div>
            <div className="text-3xl font-bold text-blue-700">{statistics.systemHealthScore}%</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md border-l-4 border-green-600">
            <div className="text-sm text-gray-600">Execution Success</div>
            <div className="text-3xl font-bold text-green-700">{statistics.successRate}%</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md border-l-4 border-purple-600">
            <div className="text-sm text-gray-600">Total Decisions</div>
            <div className="text-3xl font-bold text-purple-700">{statistics.totalDecisions}</div>
          </div>
          <div className="bg-amber-100 p-4 rounded-lg shadow-md border-l-4 border-amber-600">
            <div className="text-sm text-gray-600">Alerts Generated</div>
            <div className="text-3xl font-bold text-amber-700">{statistics.totalAlerts}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b overflow-x-auto">
          {["overview", "playbooks", "decisions", "interventions", "history"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab === "overview" && "📊"}
              {tab === "playbooks" && "📋"}
              {tab === "decisions" && "✅"}
              {tab === "interventions" && "⚠️"}
              {tab === "history" && "📜"}
              {" " + tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Current Status</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600"><strong>Mode:</strong> {mode === "autopilot" ? "🤖 Autopilot" : "👤 Manual"}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>Active Playbooks:</strong> {playbooks.filter(p => p.enabled).length}/{playbooks.length}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>System Health:</strong> {statistics?.systemHealthScore}%</p>
                  </div>
                  {lastExecution && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600"><strong>Last Execution:</strong> {new Date(lastExecution.timestamp).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>Decisions Made:</strong> {lastExecution.decisions.length}</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>Status:</strong> {lastExecution.success ? "✅ Success" : "❌ Failed"}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">📈 Performance Metrics</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Total Executions:</strong> {statistics?.totalExecutions}</p>
                  <p><strong>Average Decisions/Execution:</strong> {statistics?.averageDecisionsPerExecution}</p>
                  <p><strong>Average Alerts/Execution:</strong> {statistics?.averageAlertsPerExecution}</p>
                  <p><strong>Enabled Playbooks:</strong> {statistics?.enabledPlaybooks}/{statistics?.totalPlaybooks}</p>
                </div>
              </div>
            </div>
          )}

          {/* Playbooks Tab */}
          {activeTab === "playbooks" && (
            <div className="space-y-4">
              <p className="text-gray-600">Manage automation playbooks for different system functions</p>
              {playbooks.map(playbook => (
                <div key={playbook.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{playbook.name}</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={playbook.enabled}
                        onChange={() => handleTogglePlaybook(playbook.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">{playbook.enabled ? "Enabled" : "Disabled"}</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Actions</p>
                      <p className="font-semibold">{playbook.actionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Interval</p>
                      <p className="font-semibold">{playbook.interval}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="font-semibold">{Math.round(playbook.successRate * 100)}%</p>
                    </div>
                  </div>
                  {playbook.lastRun && (
                    <p className="text-xs text-gray-500 mt-2">Last run: {new Date(playbook.lastRun).toLocaleTimeString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Decisions Tab */}
          {activeTab === "decisions" && (
            <div className="space-y-3">
              {lastExecution && lastExecution.decisions.length > 0 ? (
                lastExecution.decisions.map((decision, idx) => (
                  <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900">{decision.actionName}</h4>
                    <p className="text-sm text-green-800 mt-2">
                      Triggered conditions: {decision.triggeredConditions.length}
                    </p>
                    {decision.triggeredConditions.map((cond, cidx) => (
                      <p key={cidx} className="text-xs text-green-700 mt-1">
                        • {cond.metric} {cond.operator} {cond.threshold} → {cond.action}
                      </p>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No decisions made yet. Execute autopilot to generate decisions.</p>
              )}
            </div>
          )}

          {/* Interventions Tab */}
          {activeTab === "interventions" && (
            <div className="space-y-3">
              {interventions.length > 0 ? (
                interventions.map((intervention, idx) => (
                  <div key={idx} className={`border rounded-lg p-4 ${
                    intervention.priority === "high" 
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-bold ${intervention.priority === "high" ? "text-red-900" : "text-amber-900"}`}>
                          {intervention.action}
                        </h4>
                        <p className={`text-sm mt-2 ${intervention.priority === "high" ? "text-red-800" : "text-amber-800"}`}>
                          {intervention.reason}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        intervention.priority === "high"
                          ? "bg-red-200 text-red-800"
                          : "bg-amber-200 text-amber-800"
                      }`}>
                        {intervention.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">✅ No manual interventions required</p>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {executionHistory.length > 0 ? (
                executionHistory.map((execution, idx) => (
                  <div key={idx} className={`border rounded-lg p-4 ${
                    execution.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(execution.timestamp).toLocaleString()}
                        </p>
                        <div className="grid grid-cols-3 gap-3 mt-2 text-sm text-gray-600">
                          <div>Decisions: <span className="font-semibold">{execution.decisions.length}</span></div>
                          <div>Alerts: <span className="font-semibold">{execution.alerts.length}</span></div>
                          <div>Interventions: <span className="font-semibold">{execution.interventions.length}</span></div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        execution.success
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}>
                        {execution.success ? "✅ Success" : "❌ Failed"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No execution history available</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Playbook Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Autopilot Playbooks</h2>
        <p className="text-gray-600 mb-4">
          Six intelligent playbooks manage different aspects of system automation:
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "💧", name: "Water Management", desc: "Auto-regulate pH, temperature, dissolved oxygen, ammonia" },
            { icon: "🥗", name: "Nutrient Management", desc: "Monitor nitrification cycle and optimize fish feeding" },
            { icon: "🛡️", name: "Pest Control", desc: "Daily risk assessment and preventative treatments" },
            { icon: "🔄", name: "Crop Rotation", desc: "Plan cycles, maintain diversity, succession planting" },
            { icon: "🌡️", name: "Climate Control", desc: "Maintain temperature, humidity, and lighting" },
            { icon: "⚙️", name: "System Monitoring", desc: "Equipment health checks and alert generation" },
          ].map((playbook, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">{playbook.icon} {playbook.name}</h3>
              <p className="text-sm text-gray-600">{playbook.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutopilotMode;
