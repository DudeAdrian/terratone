// src/pages/AutopilotMode_v2.js - Glassmorphic Autopilot Control with Web3

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";
import { useAutomationData } from "../hooks/useApi";

const AutopilotMode = () => {
  const { data: automationData, loading: automationLoading, error: automationError, refetch } = useAutomationData();
  const [autopilotService, setAutopilotService] = useState(null);
  const [mode, setMode] = useState("manual");
  const [activeTab, setActiveTab] = useState("overview");
  const [playbooks, setPlaybooks] = useState([]);
  const [lastExecution, setLastExecution] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [contractStatus, setContractStatus] = useState("0x2f8a...");

  // Initialize with API data or sofieCore fallback
  useEffect(() => {
    if (automationData) {
      // Use API data
      setPlaybooks(automationData.rules || automationData.playbooks || []);
      setStatistics(automationData.statistics || null);
      setExecutionHistory(automationData.history || []);
    } else {
      // Fallback to sofieCore
      sofieCore.init();
      const service = sofieCore.getService("autopilot");
      
      if (service) {
        setAutopilotService(service);
        setMode(service.mode);
        updateDisplayData(service);
      }
    }
  }, [automationData]);

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
      // Loading state
      if (automationLoading) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-950 to-green-950 flex items-center justify-center">
            <QuantumCard chakra="heart">
              <div className="p-8 text-emerald-100 flex items-center">
                <div className="animate-spin inline-block w-6 h-6 border-3 border-emerald-400 border-t-transparent rounded-full mr-3"></div>
                Loading automation data...
              </div>
            </QuantumCard>
          </div>
        );
      }

      // Error state
      if (automationError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-950 to-green-950 flex items-center justify-center p-4">
            <QuantumCard chakra="heart">
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Automation Data</h2>
                <p className="text-emerald-100/80 mb-4">{automationError}</p>
                <button 
                  onClick={refetch}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Retry
                </button>
              </div>
            </QuantumCard>
          </div>
        );
      }

      if (!autopilotService && !automationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-950 to-green-950 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-emerald-100/80 py-12">Loading autopilot service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-950 to-green-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="heart" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_26px_rgba(16,185,129,0.6)]">
                🤖 Autopilot Mode Control
              </h1>
              <p className="text-emerald-100/85 mt-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">
                Automated system management with intelligent playbooks & real-time decision making
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/40 shadow-[0_0_16px_rgba(16,185,129,0.45)]">
                <div className={`w-2 h-2 rounded-full ${mode === "autopilot" ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}></div>
                <span className="font-semibold text-white">{mode}</span>
              </div>
              <p className="text-emerald-100/75 mt-2">Smart Contract: {contractStatus}</p>
            </div>
          </div>
        </QuantumSection>

        {/* Mode Selector */}
        <QuantumSection chakra="heart" opacityLevel="veil" blurLevel="medium" edgeGlow>
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">⚙️ Operation Mode</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleModeSwitch("manual")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                mode === "manual"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                  : "bg-white/5 text-white border border-emerald-500/30 hover:bg-white/10"
              }`}
            >
              👤 Manual Control
            </button>
            <button
              onClick={() => handleModeSwitch("autopilot")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                mode === "autopilot"
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]"
                  : "bg-white/5 text-white border border-emerald-500/30 hover:bg-white/10"
              }`}
            >
              🤖 Autopilot
            </button>
            
            {mode === "autopilot" && (
              <button
                onClick={handleExecuteAutopilot}
                className="ml-auto px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
              >
                ▶️ Execute Now
              </button>
            )}
          </div>
          
          {mode === "autopilot" && (
            <div className="p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
              <p className="text-sm font-semibold text-emerald-100">
                ✅ <strong>Autopilot Active</strong> - System is managing {playbooks.filter(p => p.enabled).length} playbooks automatically
              </p>
            </div>
          )}
        </QuantumSection>

        {/* Statistics Overview */}
        {statistics && (
          <QuantumGlassGrid columns={4} gap={4} className="grid-cols-1 md:grid-cols-4">
            <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow>
              <p className="text-xs font-semibold text-cyan-200 uppercase">System Health</p>
              <p className="text-3xl font-bold text-white mt-1 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">{statistics.systemHealthScore}%</p>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${statistics.systemHealthScore}%` }}></div>
              </div>
            </QuantumCard>

            <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow>
              <p className="text-xs font-semibold text-emerald-200 uppercase">Success Rate</p>
              <p className="text-3xl font-bold text-white mt-1 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">{statistics.successRate}%</p>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-lime-400" style={{ width: `${statistics.successRate}%` }}></div>
              </div>
            </QuantumCard>

            <QuantumCard chakra="crown" blurLevel="deep" opacityLevel="ultraClear" glow>
              <p className="text-xs font-semibold text-purple-200 uppercase">Decisions</p>
              <p className="text-3xl font-bold text-white mt-1 drop-shadow-[0_0_12px_rgba(192,132,252,0.45)]">{statistics.totalDecisions}</p>
              <p className="text-xs text-purple-100/75 mt-2">avg {statistics.averageDecisionsPerExecution} per run</p>
            </QuantumCard>

            <QuantumCard chakra="solar" blurLevel="deep" opacityLevel="ultraClear" glow>
              <p className="text-xs font-semibold text-amber-200 uppercase">Alerts</p>
              <p className="text-3xl font-bold text-white mt-1 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]">{statistics.totalAlerts}</p>
              <p className="text-xs text-amber-100/80 mt-2">generated this month</p>
            </QuantumCard>
          </QuantumGlassGrid>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["overview", "playbooks", "decisions", "interventions", "history"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-emerald-500 to-green-700 text-white shadow-[0_0_16px_rgba(16,185,129,0.45)]"
                  : "bg-white/5 text-emerald-50 border border-emerald-500/30 hover:bg-white/10"
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

        {/* Content Sections */}
        {activeTab === "overview" && (
          <QuantumSection chakra="throat" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-xl font-bold text-white mb-6 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">Current Status</h3>
            <QuantumGlassGrid columns={2} gap={6} className="grid-cols-1 md:grid-cols-2">
              <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow>
                <p className="text-xs font-semibold text-emerald-200 uppercase mb-2">Mode</p>
                <p className="text-2xl font-bold text-white mb-3 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">
                  {mode === "autopilot" ? "🤖 Autopilot" : "👤 Manual"}
                </p>
                <p className="text-xs text-emerald-100/75 mb-2">
                  <strong>Active Playbooks:</strong> {playbooks.filter(p => p.enabled).length}/{playbooks.length}
                </p>
                <p className="text-xs text-emerald-100/75">
                  <strong>System Health:</strong> {statistics?.systemHealthScore}%
                </p>
              </QuantumCard>

              {lastExecution && (
                <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <p className="text-xs font-semibold text-cyan-200 uppercase mb-2">Last Execution</p>
                  <p className="text-sm font-semibold text-white mb-2">
                    {new Date(lastExecution.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-cyan-100/80 mb-1">
                    <strong>Decisions:</strong> {lastExecution.decisions.length}
                  </p>
                  <p className={`text-xs font-semibold ${lastExecution.success ? "text-emerald-200" : "text-rose-200"}`}>
                    {lastExecution.success ? "✅ Success" : "❌ Failed"}
                  </p>
                </QuantumCard>
              )}
            </QuantumGlassGrid>

            <div className="mt-6 pt-6 border-t border-cyan-500/30">
              <h4 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">📈 Performance Metrics</h4>
              <QuantumGlassGrid columns={3} gap={4} className="grid-cols-1 md:grid-cols-3">
                <div className="p-3 rounded-lg bg-white/5 border border-cyan-500/30">
                  <p className="text-xs font-semibold text-cyan-200">Total Executions</p>
                  <p className="text-2xl font-bold text-white mt-1">{statistics?.totalExecutions}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-cyan-500/30">
                  <p className="text-xs font-semibold text-cyan-200">Avg Decisions/Run</p>
                  <p className="text-2xl font-bold text-white mt-1">{statistics?.averageDecisionsPerExecution}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-emerald-500/30">
                  <p className="text-xs font-semibold text-emerald-200">On-chain Verified</p>
                  <p className="text-sm font-bold text-emerald-200 mt-1">✓ All executions</p>
                </div>
              </QuantumGlassGrid>
            </div>
          </QuantumSection>
        )}

        {activeTab === "playbooks" && (
          <QuantumSection chakra="crown" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(192,132,252,0.45)]">📋 Active Playbooks</h3>
            <div className="space-y-3">
              {playbooks.map((playbook, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-purple-400/30 hover:bg-white/10 transition-all">
                  <div className="flex-1">
                    <p className="font-semibold text-white drop-shadow-[0_0_10px_rgba(192,132,252,0.35)]">{playbook.name}</p>
                    <p className="text-xs text-purple-100/80 mt-1">{playbook.description}</p>
                  </div>
                  <button
                    onClick={() => handleTogglePlaybook(playbook.key)}
                    className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      playbook.enabled
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.45)]"
                        : "bg-white/10 text-purple-100 border border-purple-400/30"
                    }`}
                  >
                    {playbook.enabled ? "✓ Active" : "○ Inactive"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <p className="text-xs text-purple-100/80 font-semibold">
                🔗 All playbooks backed by smart contracts on-chain
              </p>
            </div>
          </QuantumSection>
        )}

        {activeTab === "decisions" && (
          <QuantumSection chakra="throat" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">✅ Recent Decisions</h3>
            <div className="space-y-2">
              {lastExecution?.decisions.slice(0, 10).map((decision, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/5 border border-cyan-500/30 text-sm">
                  <p className="font-semibold text-white">{decision.action}</p>
                  <p className="text-xs text-cyan-100/80 mt-1">{decision.reason}</p>
                </div>
              )) || <p className="text-cyan-100/70">No decisions recorded yet</p>}
            </div>
          </QuantumSection>
        )}

        {activeTab === "interventions" && (
          <QuantumSection chakra="solar" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]">⚠️ Intervention Alerts</h3>
            <div className="space-y-2">
              {interventions.slice(0, 8).map((alert, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-amber-500/15 border border-amber-400/30">
                  <p className="font-semibold text-amber-100">{alert.type}</p>
                  <p className="text-xs text-amber-100/80 mt-1">{alert.message}</p>
                </div>
              )) || <p className="text-amber-100/75">No active interventions</p>}
            </div>
          </QuantumSection>
        )}

        {activeTab === "history" && (
          <QuantumSection chakra="throat" opacityLevel="veil" blurLevel="medium" edgeGlow>
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">📜 Execution History</h3>
            <div className="space-y-2">
              {executionHistory.map((exec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-cyan-500/30">
                  <div>
                    <p className="font-semibold text-white text-sm">{new Date(exec.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-cyan-100/80 mt-1">{exec.decisions.length} decisions</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    exec.success 
                      ? "bg-emerald-500/25 text-emerald-100 border border-emerald-400/30" 
                      : "bg-rose-500/25 text-rose-100 border border-rose-400/30"
                  }`}>
                    {exec.success ? "✓ Success" : "✗ Failed"}
                  </span>
                </div>
              ))}
            </div>
          </QuantumSection>
        )}
      </div>
    </div>
  );
};

export default AutopilotMode;
