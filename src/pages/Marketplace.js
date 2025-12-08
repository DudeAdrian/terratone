import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const marketplaceService = sofieCore.getService("marketplace");
    if (marketplaceService) {
      setListings(marketplaceService.getListings());
      setStats(marketplaceService.getStats());
    }
  }, []);

  const filteredListings = selectedCategory === "all" ? listings : listings.filter((l) => l.category === selectedCategory);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🛒 Community Marketplace</h1>
        <p className="text-lg text-gray-600">Share resources and skills through community trading</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-sm font-semibold text-blue-600 uppercase">Total Listings</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalListings || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">Active</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.activeListings || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-sm font-semibold text-purple-600 uppercase">Transactions</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalTransactions || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <div className="text-sm font-semibold text-orange-600 uppercase">Items Traded</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalItemsTraded || 0}</div>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`mr-2 mb-2 px-4 py-2 rounded-lg font-medium transition ${
            selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          All
        </button>
        {["food", "tools", "skills", "materials"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`mr-2 mb-2 px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">{listing.title}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">{listing.status}</span>
            </div>
            {listing.quantity && (
              <p className="text-lg font-semibold text-blue-600 mb-2">
                {listing.quantity} {listing.unit}
              </p>
            )}
            <p className="text-gray-600 mb-2">{listing.description || listing.price}</p>
            <p className="text-sm text-gray-500">By: {listing.provider}</p>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Learn More
            </button>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No listings in this category</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
