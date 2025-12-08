// src/pages/PestManagement.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const PestManagement = () => {
  const [pestService, setPestService] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [selectedZone, setSelectedZone] = useState("temperate");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [activeTab, setActiveTab] = useState("alerts");
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const service = sofieCore.getService("pestManagement");
    setPestService(service);
    
    if (service) {
      setActiveAlerts(service.getActiveAlerts());
      setRiskAssessments(service.getAllRiskAssessments());
      setTreatments(service.treatments || []);
    }
  }, []);

  const zones = ["tropical", "subtropical", "temperate", "boreal", "arid"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getZoneColor = (zone) => {
    const colors = {
      tropical: "text-red-600",
      subtropical: "text-orange-600",
      temperate: "text-green-600",
      boreal: "text-blue-600",
      arid: "text-yellow-600",
    };
    return colors[zone] || "text-gray-600";
  };

  const getRiskColor = (score) => {
    if (score >= 75) return "bg-red-100 text-red-800 border-red-300";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const getRiskLabel = (score) => {
    if (score >= 75) return "🚨 HIGH RISK";
    if (score >= 50) return "⚠️ MEDIUM RISK";
    return "✓ LOW RISK";
  };

  const currentRiskAssessment = pestService?.getRiskAssessment(selectedZone, selectedMonth);

  if (!pestService) {
    return <div className="text-center py-12"><p className="text-gray-500">Loading pest management...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🛡️ Integrated Pest Management</h1>
        <p className="text-green-100">
          Regional pest profiles, prevention strategies, and treatment tracking for sustainable production
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
          <div className="text-sm text-gray-600">Active Alerts</div>
          <div className="text-2xl font-bold text-red-700">{activeAlerts.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-600">
          <div className="text-sm text-gray-600">Zones Monitored</div>
          <div className="text-2xl font-bold text-yellow-700">{zones.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="text-sm text-gray-600">Treatments Logged</div>
          <div className="text-2xl font-bold text-green-700">{treatments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Prevention Strategies</div>
          <div className="text-2xl font-bold text-blue-700">6+</div>
        </div>
      </div>

      {/* Alert Banner */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">🔔 Active Pest Alerts</h3>
          <p className="text-red-700 text-sm">{activeAlerts.length} pest alert(s) require attention. Review each zone's risk assessment below.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b">
          {["alerts", "risk-assessment", "prevention", "treatments"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                activeTab === tab
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab === "risk-assessment" ? "Risk Assessment" : tab === "prevention" ? "Prevention" : tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Active Alerts Tab */}
          {activeTab === "alerts" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Active Pest Alerts</h3>
              
              {activeAlerts.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-green-700 text-lg">✓ No active pest alerts</p>
                  <p className="text-sm text-green-600 mt-2">Your systems are operating optimally</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className={`border-l-4 rounded-lg p-4 ${
                        alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{alert.pestName}</h4>
                          <p className="text-sm text-gray-600">Zone: <span className="font-semibold capitalize">{alert.zone}</span> | Crop: {alert.cropId}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded capitalize ${
                          alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>

                      {alert.recommendations && alert.recommendations.length > 0 && (
                        <div className="bg-white bg-opacity-60 rounded p-3 mb-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Actions:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {alert.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">→</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {alert.prevention && (
                        <div className="bg-white bg-opacity-60 rounded p-3 mt-3 text-xs">
                          <p className="font-semibold text-gray-700 mb-2">Prevention Strategies:</p>
                          <div className="grid md:grid-cols-3 gap-3">
                            {alert.prevention.preventative && (
                              <div>
                                <p className="font-semibold text-gray-600 mb-1">Preventative</p>
                                <ul className="space-y-1 text-gray-600">
                                  {alert.prevention.preventative.slice(0, 2).map((p, idx) => (
                                    <li key={idx} className="text-xs">• {p}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {alert.prevention.organic && (
                              <div>
                                <p className="font-semibold text-gray-600 mb-1">Organic</p>
                                <ul className="space-y-1 text-gray-600">
                                  {alert.prevention.organic.slice(0, 2).map((o, idx) => (
                                    <li key={idx} className="text-xs">• {o}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {alert.prevention.ipm && (
                              <div>
                                <p className="font-semibold text-gray-600 mb-1">IPM Tactics</p>
                                <ul className="space-y-1 text-gray-600">
                                  {alert.prevention.ipm.slice(0, 2).map((i, idx) => (
                                    <li key={idx} className="text-xs">• {i}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Risk Assessment Tab */}
          {activeTab === "risk-assessment" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Regional Risk Assessment</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Climate Zone:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {zones.map(zone => (
                      <button
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`py-2 px-3 rounded text-sm font-medium capitalize transition ${
                          selectedZone === zone
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Month:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {months.map((month, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedMonth(idx + 1)}
                        className={`py-2 px-2 rounded text-xs font-medium transition ${
                          selectedMonth === idx + 1
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {currentRiskAssessment && (
                <div className={`${getRiskColor(currentRiskAssessment.overallRisk)} border rounded-lg p-6 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-bold">{getRiskLabel(currentRiskAssessment.overallRisk)}</h4>
                      <p className="text-sm mt-1 capitalize">{currentRiskAssessment.zone} - {months[currentRiskAssessment.month - 1]}</p>
                    </div>
                    <div className="text-4xl font-bold opacity-50">{currentRiskAssessment.overallRisk}/100</div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-400 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          currentRiskAssessment.overallRisk >= 75 ? 'bg-red-500' :
                          currentRiskAssessment.overallRisk >= 50 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${currentRiskAssessment.overallRisk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {currentRiskAssessment?.activeThreats && currentRiskAssessment.activeThreats.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">🚨 Active Threats</h4>
                  <div className="grid gap-2">
                    {currentRiskAssessment.activeThreats.map((pest, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{pest.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-bold px-2 py-1 rounded bg-gray-200">
                              Severity: {pest.severity}/10
                            </div>
                            <div className="w-20 bg-gray-300 rounded-full h-2">
                              <div 
                                className={`h-full rounded-full ${
                                  pest.severity >= 8 ? 'bg-red-500' :
                                  pest.severity >= 6 ? 'bg-yellow-500' :
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${pest.severity * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Affects: {pest.affectedCrops?.join(", ") || "multiple crops"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentRiskAssessment?.recommendations && currentRiskAssessment.recommendations.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3">💡 Recommendations</h4>
                  <ul className="space-y-2">
                    {currentRiskAssessment.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start text-sm text-blue-700">
                        <span className="mr-3 font-bold">→</span>
                        <div>
                          <p className="font-semibold">{rec.message}</p>
                          <p className="text-xs text-blue-600 mt-1">{rec.action}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Prevention Tab */}
          {activeTab === "prevention" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Prevention Strategies by Pest</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(pestService.getPreventionStrategies() || {}).map(([pestName, strategies]) => (
                  <div key={pestName} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white">
                    <h4 className="font-bold text-gray-800 mb-3">{pestName}</h4>
                    
                    {strategies.preventative && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">🛡️ PREVENTATIVE</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {strategies.preventative.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {strategies.organic && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">🌿 ORGANIC TREATMENTS</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {strategies.organic.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {strategies.ipm && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">🔄 IPM TACTICS</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {strategies.ipm.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatments Tab */}
          {activeTab === "treatments" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Treatment History</h3>

              {treatments.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No treatments logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {treatments.map(treatment => (
                    <div key={treatment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">{treatment.pestName}</h4>
                          <p className="text-xs text-gray-600">Crop: {treatment.cropId} | Treatment: {treatment.treatment}</p>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(treatment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-white rounded p-2 text-sm">
                        <p className="text-gray-700">
                          <strong>Effectiveness:</strong> {treatment.effectiveness}% 
                          {treatment.notes && <span> - {treatment.notes}</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestManagement;
