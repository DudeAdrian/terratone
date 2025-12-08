// src/pages/Expansion.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { Link } from "react-router-dom";

const Expansion = () => {
  const [housingService, setHousingService] = useState(null);
  const [waterService, setWaterService] = useState(null);
  const [solarService, setSolarService] = useState(null);
  const [emergencyService, setEmergencyService] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    setHousingService(sofieCore.getService("housingExpansion"));
    setWaterService(sofieCore.getService("waterExpansion"));
    setSolarService(sofieCore.getService("solarExpansion"));
    setEmergencyService(sofieCore.getService("emergencyPreparedness"));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "operational":
      case "excellent":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
      case "active":
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "planning":
      case "design":
      case "adequate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🚀 Community Expansion Dashboard</h1>
        <p className="text-green-100">
          Strategic infrastructure growth and capacity planning for Harmonic Habitats communities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Housing Projects</div>
          <div className="text-2xl font-bold text-blue-700">
            {housingService?.getExpansionProjects().length || 0}
          </div>
          <div className="text-xs text-gray-500">+65 units planned</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-cyan-600">
          <div className="text-sm text-gray-600">Water Projects</div>
          <div className="text-2xl font-bold text-cyan-700">
            {waterService?.getExpansionProjects().length || 0}
          </div>
          <div className="text-xs text-gray-500">+165k L/day capacity</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-600">
          <div className="text-sm text-gray-600">Solar Projects</div>
          <div className="text-2xl font-bold text-yellow-700">
            {solarService?.getExpansionProjects().length || 0}
          </div>
          <div className="text-xs text-gray-500">+550 kW capacity</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
          <div className="text-sm text-gray-600">Emergency Readiness</div>
          <div className="text-2xl font-bold text-red-700">
            {emergencyService?.getReadinessScore().overall || 0}%
          </div>
          <div className="text-xs text-gray-500">
            {emergencyService?.getReadinessScore().status || "checking..."}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b">
          {["overview", "housing", "water", "solar", "emergency"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                selectedTab === tab
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {selectedTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Expansion Overview</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Housing Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🏘️</span>
                    Housing Expansion
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Projects:</span>
                      <span className="font-semibold">
                        {housingService?.getExpansionProjects().filter(p => p.status === "in-progress" || p.status === "active").length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total New Units:</span>
                      <span className="font-semibold">
                        {housingService?.getConstructionMetrics().totalUnitsPlanned || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Investment:</span>
                      <span className="font-semibold">
                        ${(housingService?.getConstructionMetrics().totalBudget / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  <Link to="/expansion" className="mt-3 inline-block text-green-600 hover:text-green-700 font-semibold text-sm">
                    View Details →
                  </Link>
                </div>

                {/* Water Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">💧</span>
                    Water Infrastructure
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Projects:</span>
                      <span className="font-semibold">
                        {waterService?.getExpansionProjects().filter(p => p.status === "in-progress" || p.status === "active").length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity Increase:</span>
                      <span className="font-semibold">
                        +{(waterService?.getMetrics().totalCapacityIncrease / 1000).toFixed(0)}k L/day
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Self-Sufficiency Target:</span>
                      <span className="font-semibold">
                        {waterService?.getMetrics().selfSufficiency.projected}%
                      </span>
                    </div>
                  </div>
                  <Link to="/expansion" className="mt-3 inline-block text-green-600 hover:text-green-700 font-semibold text-sm">
                    View Details →
                  </Link>
                </div>

                {/* Solar Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">☀️</span>
                    Solar & Energy
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Projects:</span>
                      <span className="font-semibold">
                        {solarService?.getExpansionProjects().filter(p => p.status === "in-progress" || p.status === "active").length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity Addition:</span>
                      <span className="font-semibold">
                        +{solarService?.getMetrics().plannedAddition} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renewable Goal:</span>
                      <span className="font-semibold">
                        {solarService?.getMetrics().renewablePercentage.projected}%
                      </span>
                    </div>
                  </div>
                  <Link to="/expansion" className="mt-3 inline-block text-green-600 hover:text-green-700 font-semibold text-sm">
                    View Details →
                  </Link>
                </div>

                {/* Emergency Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🚨</span>
                    Emergency Preparedness
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Response Teams:</span>
                      <span className="font-semibold">
                        {emergencyService?.getResponseTeams().length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Food Reserve:</span>
                      <span className="font-semibold">
                        {emergencyService?.getEmergencySupplies().food.currentReserve} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overall Readiness:</span>
                      <span className="font-semibold">
                        {emergencyService?.getReadinessScore().overall}%
                      </span>
                    </div>
                  </div>
                  <Link to="/expansion" className="mt-3 inline-block text-green-600 hover:text-green-700 font-semibold text-sm">
                    View Details →
                  </Link>
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Timeline (2026)</h3>
                <div className="space-y-2">
                  {housingService?.getProjectTimeline().map(project => (
                    <div key={project.id} className="flex items-center gap-3">
                      <div className="w-48 text-sm font-medium text-gray-700">{project.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-green-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ width: `${project.completion}%` }}
                        >
                          {project.completion}%
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === "housing" && housingService && (
            <HousingTab service={housingService} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />
          )}

          {selectedTab === "water" && waterService && (
            <WaterTab service={waterService} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />
          )}

          {selectedTab === "solar" && solarService && (
            <SolarTab service={solarService} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />
          )}

          {selectedTab === "emergency" && emergencyService && (
            <EmergencyTab service={emergencyService} getStatusColor={getStatusColor} />
          )}
        </div>
      </div>
    </div>
  );
};

// Housing Tab Component
const HousingTab = ({ service, getStatusColor, getPriorityColor }) => {
  const projects = service.getExpansionProjects();
  const waitlist = service.getWaitlist();
  const metrics = service.getConstructionMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏘️ Housing Expansion Projects</h2>
        
        {/* Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600">Total Units Planned</div>
            <div className="text-3xl font-bold text-blue-700">{metrics.totalUnitsPlanned}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-gray-600">Total Budget</div>
            <div className="text-3xl font-bold text-green-700">${(metrics.totalBudget / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600">On-Time Delivery</div>
            <div className="text-3xl font-bold text-purple-700">{metrics.onTimeDelivery}</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="text-sm text-gray-600">Sustainability Score</div>
            <div className="text-3xl font-bold text-emerald-700">{metrics.sustainabilityScore}/100</div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.type} • {project.units} units</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-600">Start:</span>
                  <span className="ml-2 font-semibold">{project.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Complete:</span>
                  <span className="ml-2 font-semibold">{project.estimatedCompletion}</span>
                </div>
                <div>
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-semibold">${(project.budget / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-gray-600">Spent:</span>
                  <span className="ml-2 font-semibold">${(project.spent / 1000).toFixed(0)}k</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-semibold">{project.completion}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-green-700 font-semibold hover:text-green-800">
                  View Milestones ({project.milestones.filter(m => m.status === "completed").length}/{project.milestones.length} completed)
                </summary>
                <div className="mt-3 space-y-2 pl-4">
                  {project.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        milestone.status === "completed" ? "bg-green-500" :
                        milestone.status === "in-progress" ? "bg-blue-500" :
                        milestone.status === "pending" ? "bg-yellow-500" :
                        "bg-gray-300"
                      }`}></span>
                      <span className={milestone.status === "completed" ? "line-through text-gray-500" : ""}>
                        {milestone.name}
                      </span>
                      <span className="text-gray-500 text-xs">({milestone.dueDate})</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Housing Waitlist ({waitlist.length})</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Priority</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Family Size</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Preferences</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Waiting Since</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry, idx) => (
                  <tr key={entry.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 text-sm">{entry.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(entry.priority)}`}>
                        {entry.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{entry.familySize}</td>
                    <td className="px-4 py-2 text-sm">{entry.preferences}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{entry.waitingSince}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Water Tab Component
const WaterTab = ({ service, getStatusColor, getPriorityColor }) => {
  const projects = service.getExpansionProjects();
  const conservation = service.getConservationPrograms();
  const balance = service.getWaterBalance();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💧 Water Infrastructure Expansion</h2>

      {/* Water Balance */}
      <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
        <h3 className="font-bold text-gray-800 mb-3">Current Water Balance</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Capacity</div>
            <div className="text-2xl font-bold text-cyan-700">{(balance.totalCapacity / 1000).toFixed(0)}k L/day</div>
          </div>
          <div>
            <div className="text-gray-600">Current Usage</div>
            <div className="text-2xl font-bold text-blue-700">{(balance.totalUsage / 1000).toFixed(0)}k L/day</div>
          </div>
          <div>
            <div className="text-gray-600">Local Production</div>
            <div className="text-2xl font-bold text-green-700">{balance.localPercentage}%</div>
          </div>
          <div>
            <div className="text-gray-600">Utilization</div>
            <div className="text-2xl font-bold text-purple-700">{balance.utilizationRate}%</div>
          </div>
        </div>
      </div>

      {/* Expansion Projects */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Expansion Projects</h3>
        {projects.map(project => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-800">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.type}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>

            {project.capacity && (
              <div className="text-sm mb-2">
                <span className="text-gray-600">Capacity: </span>
                <span className="font-semibold">{(project.capacity / 1000).toFixed(0)}k L/day</span>
              </div>
            )}

            <div className="text-sm mb-2">
              <span className="text-gray-600">Expected Impact: </span>
              <span className="font-semibold text-green-700">{project.expectedImpact}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">{project.completion}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-cyan-600 h-2 rounded-full"
                style={{ width: `${project.completion}%` }}
              ></div>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer text-cyan-700 font-semibold">View Components</summary>
              <div className="mt-2 space-y-1 pl-4">
                {project.components.map((comp, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{comp.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(comp.status)}`}>
                      {comp.status}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Conservation Programs */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Conservation Programs</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {conservation.map(program => (
            <div key={program.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-bold text-gray-800 mb-2">{program.name}</h4>
              <div className="text-sm space-y-1">
                <div><span className="text-gray-600">Target:</span> {program.target}</div>
                <div><span className="text-gray-600">Savings:</span> <span className="font-semibold text-green-700">{program.savings}</span></div>
                <div><span className="text-gray-600">Investment:</span> ${(program.investment / 1000).toFixed(0)}k</div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${program.completion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{program.completion}% complete</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Solar Tab Component
const SolarTab = ({ service, getStatusColor, getPriorityColor }) => {
  const projects = service.getExpansionProjects();
  const metrics = service.getMetrics();
  const independence = service.getEnergyIndependence();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">☀️ Solar & Energy Expansion</h2>

      {/* Energy Independence */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-gray-800 mb-3">Current Energy Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Daily Production:</span>
              <span className="font-semibold">{independence.current.dailyProduction} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Demand:</span>
              <span className="font-semibold">{independence.current.dailyDemand} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Independence:</span>
              <span className="font-semibold text-green-700">{independence.current.independence}%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-semibold ${independence.current.status === "surplus" ? "text-green-700" : "text-orange-700"}`}>
                {independence.current.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-gray-800 mb-3">Projected Energy Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Daily Production:</span>
              <span className="font-semibold">{independence.projected.dailyProduction} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Demand:</span>
              <span className="font-semibold">{independence.projected.dailyDemand} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Independence:</span>
              <span className="font-semibold text-green-700">{independence.projected.independence}%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-green-700">{independence.projected.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Capacity</div>
          <div className="text-3xl font-bold text-yellow-600">{metrics.futureCapacity} kW</div>
          <div className="text-xs text-gray-500">+{metrics.plannedAddition} kW planned</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Annual Production</div>
          <div className="text-3xl font-bold text-green-600">{(metrics.projectedProduction / 1000).toFixed(0)}k kWh</div>
          <div className="text-xs text-gray-500">+{((metrics.projectedProduction - metrics.currentProduction) / 1000).toFixed(0)}k kWh</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Cost Savings</div>
          <div className="text-3xl font-bold text-blue-600">${(metrics.costSavings.projected / 1000).toFixed(0)}k</div>
          <div className="text-xs text-gray-500">per year</div>
        </div>
      </div>

      {/* Solar Projects */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Solar Projects</h3>
        {projects.map(project => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-800">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.type}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-3 text-sm">
              {project.capacity && (
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <span className="ml-2 font-semibold">{project.capacity} kW</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Budget:</span>
                <span className="ml-2 font-semibold">${(project.budget / 1000).toFixed(0)}k</span>
              </div>
              <div>
                <span className="text-gray-600">ROI:</span>
                <span className="ml-2 font-semibold">{project.roi}</span>
              </div>
            </div>

            {project.expectedOutput && (
              <div className="text-sm mb-2">
                <span className="text-gray-600">Expected Output: </span>
                <span className="font-semibold text-green-700">{project.expectedOutput}</span>
              </div>
            )}

            {project.expectedImpact && (
              <div className="text-sm mb-2">
                <span className="text-gray-600">Impact: </span>
                <span className="font-semibold text-green-700">{project.expectedImpact}</span>
              </div>
            )}

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">{project.completion}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${project.completion}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Emergency Tab Component
const EmergencyTab = ({ service, getStatusColor }) => {
  const supplies = service.getEmergencySupplies();
  const plans = service.getEmergencyPlans();
  const teams = service.getResponseTeams();
  const readiness = service.getReadinessScore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🚨 Emergency Preparedness</h2>

      {/* Readiness Score */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Overall Readiness Score</h3>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold text-red-600">{readiness.overall}%</div>
          <div className="text-gray-600 capitalize">{readiness.status}</div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {Object.entries(readiness.categories).map(([cat, score]) => (
            <div key={cat} className="text-center">
              <div className="text-2xl font-bold text-gray-800">{score}%</div>
              <div className="text-gray-600 capitalize">{cat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Supplies */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Emergency Supplies</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(supplies).map(([category, data]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 capitalize">{category}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Reserve:</span>
                  <span className="font-semibold">{data.currentReserve} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-semibold">{data.target} days</span>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (data.currentReserve / data.target) >= 0.9 ? "bg-green-600" :
                        (data.currentReserve / data.target) >= 0.75 ? "bg-yellow-600" :
                        "bg-red-600"
                      }`}
                      style={{ width: `${Math.min(100, (data.currentReserve / data.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Teams */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Response Teams</h3>
        <div className="space-y-3">
          {teams.map(team => (
            <div key={team.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800">{team.name}</h4>
                <div className="text-sm text-gray-600">
                  Lead: {team.lead} • {team.members} members
                </div>
                <div className="text-sm text-gray-500">
                  Last Training: {team.lastTraining}
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(team.certifications.toLowerCase())}`}>
                {team.certifications}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Plans */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Emergency Response Plans</h3>
        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-800">{plan.name}</h4>
                  <p className="text-sm text-gray-600">{plan.type}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
              <div className="text-sm space-y-1 mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-semibold">{plan.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Drill:</span>
                  <span className="font-semibold">{plan.lastDrill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participation:</span>
                  <span className="font-semibold">{plan.participation}</span>
                </div>
              </div>
              <details className="text-sm">
                <summary className="cursor-pointer text-red-700 font-semibold">View Components</summary>
                <ul className="mt-2 space-y-1 pl-4">
                  {plan.keyComponents.map((comp, idx) => (
                    <li key={idx} className="text-gray-700">• {comp}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Expansion;
