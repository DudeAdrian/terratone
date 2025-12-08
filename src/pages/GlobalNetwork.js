// src/pages/GlobalNetwork.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const GlobalNetwork = () => {
  const [networkService, setNetworkService] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedTab, setSelectedTab] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [energyBalances, setEnergyBalances] = useState([]);
  const [activeCommunityId, setActiveCommunityId] = useState(null);
  const [energyForm, setEnergyForm] = useState({ type: "offer", quantity: 100, price: 0, urgency: "medium" });
  const [energyStatus, setEnergyStatus] = useState("");
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    try {
      // Don't re-initialize - just get the service
      const service = sofieCore.getService("globalNetwork");
      console.log("GlobalNetwork service:", service);
      console.log("All services:", Object.keys(sofieCore.services || {}));
      
      if (service) {
        const comms = service.getCommunities();
        const mets = service.getGlobalMetrics();
        console.log("Communities:", comms?.length, comms);
        console.log("Metrics:", mets);
        
        setNetworkService(service);
        setCommunities(comms || []);
        setMetrics(mets || null);
        setActiveCommunityId(comms?.[0]?.id || null);
        const balances = service.getEnergyBalances?.() || [];
        setEnergyBalances(balances);
        setTradeHistory(service.getTradeHistory?.() || []);
      } else {
        console.error("Global Network service not found in sofieCore.services");
        console.error("Available services:", Object.keys(sofieCore.services || {}));
      }
    } catch (error) {
      console.error("Error loading Global Network:", error);
    }
  }, []);

  const regions = [
    { name: "all", label: "All Regions" },
    { name: "North America", label: "North America" },
    { name: "South America", label: "South America" },
    { name: "Europe", label: "Europe" },
    { name: "Africa", label: "Africa" },
    { name: "Oceania", label: "Oceania" }
  ];

  const filteredCommunities = selectedRegion === "all" 
    ? communities 
    : communities.filter(c => c.region === selectedRegion);

  const getTierColor = (tier) => {
    switch (tier) {
      case "hub": return "bg-purple-100 text-purple-800";
      case "regional": return "bg-blue-100 text-blue-800";
      case "local": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "operational": return "bg-green-100 text-green-800";
      case "growing": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const refreshEnergyBalances = () => {
    if (networkService?.getEnergyBalances) {
      setEnergyBalances(networkService.getEnergyBalances());
    }
  };

  const refreshTradeHistory = () => {
    if (networkService?.getTradeHistory) {
      setTradeHistory(networkService.getTradeHistory());
    }
  };

  const handleEnergySubmit = () => {
    if (!networkService || !activeCommunityId) return;
    setEnergyStatus("");
    const qty = Number(energyForm.quantity);
    if (!qty || qty <= 0) {
      setEnergyStatus("Quantity must be positive.");
      return;
    }

    let result;
    if (energyForm.type === "offer") {
      const price = Number(energyForm.price) || 0;
      result = networkService.offerEnergyCredits?.(activeCommunityId, qty, price);
    } else {
      result = networkService.requestEnergyCredits?.(activeCommunityId, qty, energyForm.urgency || "medium");
    }

    if (result?.success) {
      setEnergyStatus("Saved.");
      refreshEnergyBalances();
      refreshTradeHistory();
    } else {
      setEnergyStatus(result?.error || "Unable to process request");
    }
  };

  if (!networkService || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading global network...</p>
        <p className="text-xs text-gray-400 mt-2">
          Service: {networkService ? "✓" : "✗"} | Metrics: {metrics ? "✓" : "✗"}
        </p>
      </div>
    );
  }

  // Safe to compute after service is loaded
  const leaderboard = networkService.getSelfSufficiencyLeaderboard?.() || { energy: [], food: [], water: [] };
  const knowledgeExchanges = networkService.getKnowledgeExchanges?.() || [];
  const projects = networkService.getCollaborativeProjects?.() || [];
  const timeline = networkService.getGrowthTimeline?.() || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🌍 Global Community Network</h1>
        <p className="text-blue-100">
          Connecting sustainable communities worldwide through Sofie Systems
        </p>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Communities</div>
          <div className="text-2xl font-bold text-blue-700">{metrics.totalCommunities}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="text-sm text-gray-600">Total Population</div>
          <div className="text-2xl font-bold text-green-700">{metrics.totalPopulation.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="text-sm text-gray-600">Occupancy</div>
          <div className="text-2xl font-bold text-purple-700">{metrics.averageOccupancy}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="text-sm text-gray-600">Continents</div>
          <div className="text-2xl font-bold text-orange-700">{metrics.continents}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-600">
          <div className="text-sm text-gray-600">Energy</div>
          <div className="text-2xl font-bold text-teal-700">{metrics.averageEnergySelfSufficiency}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-lime-600">
          <div className="text-sm text-gray-600">Food</div>
          <div className="text-2xl font-bold text-lime-700">{metrics.averageFoodSelfSufficiency}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-cyan-600">
          <div className="text-sm text-gray-600">Water</div>
          <div className="text-2xl font-bold text-cyan-700">{metrics.averageWaterSelfSufficiency}%</div>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
        <h3 className="font-bold text-green-800 mb-1">🏆 Network Achievements</h3>
        <p className="text-sm text-green-700">
          • {metrics.carbonNeutralCommunities} communities are carbon neutral
          • {metrics.totalConnections} inter-community connections established
          • {metrics.communitiesWithSofie} communities running Sofie Systems OS
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b">
          {["map", "leaderboard", "knowledge", "projects", "timeline", "energy"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                selectedTab === tab
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {selectedTab === "map" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Community Map</h2>
                <div className="flex gap-2">
                  {regions.map(region => (
                    <button
                      key={region.name}
                      onClick={() => setSelectedRegion(region.name)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedRegion === region.name ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommunities.map(community => (
                  <div key={community.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{community.name}</h3>
                        <p className="text-sm text-gray-600">{community.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTierColor(community.tier)}`}>
                        {community.tier}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(community.status)}`}>
                        {community.status}
                      </span>
                      {community.carbonNeutral && (
                        <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                          🌱 Carbon Neutral
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population:</span>
                        <span className="font-semibold">{community.population}/{community.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Established:</span>
                        <span className="font-semibold">{community.established}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Connections:</span>
                        <span className="font-semibold">{community.connectedCommunities} communities</span>
                      </div>
                    </div>

                    <div className="border-t pt-3 mb-3">
                      <div className="text-xs text-gray-600 mb-1">Self-Sufficiency</div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-600 w-16">Energy:</span>
                          <div className="flex-1 bg-gray-200 rounded h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded" 
                              style={{ width: `${community?.energySelfSufficiency || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold ml-2 w-10 text-right">{community?.energySelfSufficiency || 0}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-600 w-16">Food:</span>
                          <div className="flex-1 bg-gray-200 rounded h-2">
                            <div 
                              className="bg-lime-600 h-2 rounded" 
                              style={{ width: `${community?.foodSelfSufficiency || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold ml-2 w-10 text-right">{community?.foodSelfSufficiency || 0}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-600 w-16">Water:</span>
                          <div className="flex-1 bg-gray-200 rounded h-2">
                            <div 
                              className="bg-cyan-600 h-2 rounded" 
                              style={{ width: `${community?.waterSelfSufficiency || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold ml-2 w-10 text-right">{community?.waterSelfSufficiency || 0}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <div className="font-semibold mb-1">Specializations:</div>
                      <div className="flex flex-wrap gap-1">
                        {(community?.specializations || []).map((spec, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-0.5 rounded">{spec}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "energy" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Energy Credits</h2>
                    <span className="text-xs text-gray-500">Unit: kWh credits</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {energyBalances.map((b) => (
                      <div key={b.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="font-semibold text-gray-800">{b.name}</div>
                        <div className="text-sm text-gray-600">Balance: <span className="font-bold text-gray-900">{b.balance}</span></div>
                        <div className="text-sm text-gray-600">Reserve: <span className="font-bold text-orange-700">{b.reserve}</span></div>
                        <div className="text-sm text-gray-600">Available: <span className="font-bold text-green-700">{b.available}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Create Energy Offer/Request</h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Community</label>
                    <select
                      value={activeCommunityId || ""}
                      onChange={(e) => setActiveCommunityId(e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {communities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => setEnergyForm({ ...energyForm, type: "offer" })}
                      className={`flex-1 px-3 py-2 rounded-lg border ${energyForm.type === "offer" ? "bg-green-600 text-white border-green-600" : "bg-gray-100 text-gray-700"}`}
                    >
                      Offer
                    </button>
                    <button
                      onClick={() => setEnergyForm({ ...energyForm, type: "request" })}
                      className={`flex-1 px-3 py-2 rounded-lg border ${energyForm.type === "request" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700"}`}
                    >
                      Request
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Quantity (kWh credits)</label>
                    <input
                      type="number"
                      value={energyForm.quantity}
                      onChange={(e) => setEnergyForm({ ...energyForm, quantity: e.target.value })}
                      className="w-full border rounded-lg p-2"
                      min="1"
                    />
                  </div>

                  {energyForm.type === "offer" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Price (credits per kWh, optional)</label>
                      <input
                        type="number"
                        value={energyForm.price}
                        onChange={(e) => setEnergyForm({ ...energyForm, price: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}

                  {energyForm.type === "request" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Urgency</label>
                      <select
                        value={energyForm.urgency}
                        onChange={(e) => setEnergyForm({ ...energyForm, urgency: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleEnergySubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Save
                  </button>
                  {energyStatus && <p className="text-sm text-gray-600">{energyStatus}</p>}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">Recent Energy Trades</h3>
                  <button
                    onClick={refreshTradeHistory}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                {tradeHistory.length === 0 ? (
                  <p className="text-sm text-gray-600">No trades yet.</p>
                ) : (
                  <div className="space-y-2">
                    {tradeHistory
                      .filter((t) => t.resource === "energy")
                      .map((t) => (
                        <div key={t.id} className="border border-gray-100 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">{t.fromCommunityName} → {t.toCommunityName}</div>
                            <div className="text-xs text-gray-600">{new Date(t.date).toLocaleString()}</div>
                          </div>
                          <div className="text-sm text-gray-700 mt-2 md:mt-0">
                            <span className="font-semibold text-green-700">{t.quantity} kWh</span>
                            {t.pricePerUnit != null && (
                              <span className="ml-2 text-xs text-gray-600">@ {t.pricePerUnit} credits/kWh</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === "leaderboard" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Self-Sufficiency Leaderboards</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Energy Leaderboard */}
                <div>
                  <h3 className="font-bold text-teal-700 mb-3 flex items-center">
                    <span className="text-2xl mr-2">⚡</span> Energy Leaders
                  </h3>
                  <div className="space-y-2">
                    {(leaderboard?.energy || []).map((entry, index) => (
                      <div key={entry.community} className="flex items-center p-3 border rounded-lg">
                        <div className={`text-2xl mr-3 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-300'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{entry.community}</div>
                          <div className="text-xs text-gray-600">{entry.location}</div>
                        </div>
                        <div className="text-lg font-bold text-teal-700">{entry.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food Leaderboard */}
                <div>
                  <h3 className="font-bold text-lime-700 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🌾</span> Food Leaders
                  </h3>
                  <div className="space-y-2">
                    {(leaderboard?.food || []).map((entry, index) => (
                      <div key={entry.community} className="flex items-center p-3 border rounded-lg">
                        <div className={`text-2xl mr-3 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-300'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{entry.community}</div>
                          <div className="text-xs text-gray-600">{entry.location}</div>
                        </div>
                        <div className="text-lg font-bold text-lime-700">{entry.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Leaderboard */}
                <div>
                  <h3 className="font-bold text-cyan-700 mb-3 flex items-center">
                    <span className="text-2xl mr-2">💧</span> Water Leaders
                  </h3>
                  <div className="space-y-2">
                    {(leaderboard?.water || []).map((entry, index) => (
                      <div key={entry.community} className="flex items-center p-3 border rounded-lg">
                        <div className={`text-2xl mr-3 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-300'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{entry.community}</div>
                          <div className="text-xs text-gray-600">{entry.location}</div>
                        </div>
                        <div className="text-lg font-bold text-cyan-700">{entry.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "knowledge" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Exchange Network</h2>
              
              <div className="space-y-4">
                {(knowledgeExchanges || []).map(exchange => (
                  <div key={exchange.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{exchange.topic}</h3>
                        <p className="text-sm text-gray-600">{exchange.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{exchange.date}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Source Community:</div>
                        <div className="font-semibold text-sm">{exchange.sourceCommunity}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Recipient Communities:</div>
                        <div className="text-sm">{exchange.recipientCommunities.join(", ")}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <span className="text-gray-600">Impact:</span>
                      <span className="ml-2 font-semibold text-green-700">{exchange.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "projects" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Collaborative Projects</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {(projects || []).map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{project.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participating Communities:</span>
                        <span className="font-semibold">{project.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started:</span>
                        <span className="font-semibold">{project.startDate}</span>
                      </div>
                    </div>

                    <div className="border-t pt-2">
                      <div className="text-xs text-gray-600 mb-1">Lead Community:</div>
                      <div className="text-sm font-semibold">{project.leadCommunity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "timeline" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Network Growth Timeline</h2>
              
              <div className="space-y-6">
                {/* Operational Communities */}
                <div>
                  <h3 className="font-bold text-green-700 mb-3">✅ Operational Communities</h3>
                  <div className="space-y-2">
                    {(timeline || []).filter(c => c.status === "operational").map(community => (
                      <div key={community.id} className="flex items-center p-3 border-l-4 border-green-600 bg-green-50 rounded">
                        <div className="flex-1">
                          <div className="font-semibold">{community.name}</div>
                          <div className="text-sm text-gray-600">{community.location}</div>
                        </div>
                        <div className="text-sm text-gray-600">Est. {community.established || community.expectedLaunch}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Communities */}
                <div>
                  <h3 className="font-bold text-blue-700 mb-3">🚀 Upcoming Communities</h3>
                  <div className="space-y-2">
                    {(timeline || []).filter(c => c.status === "planned").map(community => (
                      <div key={community.id} className="flex items-center p-3 border-l-4 border-blue-600 bg-blue-50 rounded">
                        <div className="flex-1">
                          <div className="font-semibold">{community.name}</div>
                          <div className="text-sm text-gray-600">{community.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-700">{community.expectedLaunch}</div>
                          <div className="text-xs text-gray-600">Planned: {community.plannedPopulation} residents</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalNetwork;
