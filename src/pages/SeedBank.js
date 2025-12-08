// src/pages/SeedBank.js

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const SeedBank = () => {
  const [seedService, setSeedService] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [network, setNetwork] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const service = sofieCore.getService("seedBank");
    setSeedService(service);
    
    if (service) {
      setInventory(service.getSeedInventory());
      setCheckouts(service.getCheckouts());
      setNetwork(service.getSeedExchangeNetwork());
      setMetrics(service.getMetrics());
    }
  }, []);

  const categories = seedService?.getCategories() || [];
  const lowStock = seedService?.getLowStockSeeds() || [];
  const expiringSoon = seedService?.getExpiringSeeds(18) || [];

  const filteredInventory = selectedCategory === "all" 
    ? inventory 
    : inventory.filter(s => s.category === selectedCategory);

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "low-stock": return "bg-yellow-100 text-yellow-800";
      case "out-of-stock": return "bg-red-100 text-red-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "returned": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!seedService || !metrics) {
    return <div className="text-center py-12"><p className="text-gray-500">Loading seed bank...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🌱 Community Seed Bank</h1>
        <p className="text-green-100">
          Preserving biodiversity and food sovereignty through community seed sharing
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="text-sm text-gray-600">Total Seeds</div>
          <div className="text-2xl font-bold text-green-700">{metrics.totalSeedsInBank.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="text-sm text-gray-600">Varieties</div>
          <div className="text-2xl font-bold text-blue-700">{metrics.totalVarieties}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="text-sm text-gray-600">Avg Viability</div>
          <div className="text-2xl font-bold text-purple-700">{metrics.averageViability}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="text-sm text-gray-600">Active Checkouts</div>
          <div className="text-2xl font-bold text-orange-700">{metrics.activeCheckouts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-600">
          <div className="text-sm text-gray-600">Network Communities</div>
          <div className="text-2xl font-bold text-teal-700">{metrics.networkCommunities}</div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || expiringSoon.length > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Attention Needed</h3>
          {lowStock.length > 0 && (
            <p className="text-sm text-yellow-700 mb-1">
              • {lowStock.length} seed varieties are low in stock
            </p>
          )}
          {expiringSoon.length > 0 && (
            <p className="text-sm text-yellow-700">
              • {expiringSoon.length} seed varieties expiring within 18 months
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b">
          {["inventory", "checkouts", "network", "preservation"].map(tab => (
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
          {selectedTab === "inventory" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Seed Inventory</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedCategory === "all" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedCategory === cat.name ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map(seed => (
                  <div key={seed.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{seed.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(seed.status)}`}>
                        {seed.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{seed.category} • {seed.type}</p>
                    
                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-semibold">{seed.quantity} seeds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Viability:</span>
                        <span className="font-semibold text-green-700">{seed.viability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Germ Rate:</span>
                        <span className="font-semibold">{seed.germRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days to Mature:</span>
                        <span className="font-semibold">{seed.daysToMaturity}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1 border-t pt-2">
                      <div>Harvested: {seed.harvestYear}</div>
                      <div>Expires: {seed.expiryYear}</div>
                      <div>Origin: {seed.origin}</div>
                      <div>Checkouts YTD: {seed.checkoutsYTD}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "checkouts" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Seed Checkouts</h2>
              
              <div className="space-y-3">
                {checkouts.map(checkout => (
                  <div key={checkout.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{checkout.seedName}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Borrower: {checkout.borrower}</div>
                        <div>Quantity: {checkout.quantityBorrowed} seeds</div>
                        <div>Checkout: {checkout.checkoutDate}</div>
                        {checkout.status === "active" && <div>Due: {checkout.dueDate}</div>}
                        {checkout.status === "returned" && <div>Returned: {checkout.returnedDate}</div>}
                        <div>Pledged Return: {checkout.pledgedReturn} seeds</div>
                        {checkout.actualReturn && <div>Actual Return: {checkout.actualReturn} seeds</div>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(checkout.status)}`}>
                      {checkout.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "network" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Global Seed Exchange Network</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-gray-600">Seeds Shared Globally</div>
                  <div className="text-3xl font-bold text-green-700">{metrics.seedsSharedGlobally.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-600">Seeds Received</div>
                  <div className="text-3xl font-bold text-blue-700">{metrics.seedsReceivedGlobally.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                {network.map(community => (
                  <div key={community.community} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{community.community}</h3>
                        <p className="text-sm text-gray-600">{community.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        community.role === "hub" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {community.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">Shared:</span>
                        <span className="ml-2 font-semibold text-green-700">{community.seedsShared} seeds</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Received:</span>
                        <span className="ml-2 font-semibold text-blue-700">{community.seedsReceived} seeds</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Specialties:</span>
                      <span className="ml-2">{community.specialties.join(", ")}</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      Last Exchange: {community.lastExchange}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "preservation" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Preservation Projects</h2>
              
              <div className="space-y-4">
                {seedService.getPreservationProjects().map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                      <div>
                        <span className="text-gray-600">Varieties:</span>
                        <span className="ml-2 font-semibold">{project.varieties}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Participants:</span>
                        <span className="ml-2 font-semibold">{project.participants}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="ml-2 font-semibold text-green-700">{project.successRate}%</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      Started: {project.startDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedBank;
