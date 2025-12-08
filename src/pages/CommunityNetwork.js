import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const CommunityNetwork = () => {
  const [communities, setCommunities] = useState([]);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const networkService = sofieCore.getService("communityNetwork");
    if (networkService) {
      setCommunities(networkService.getCommunities());
      setStats(networkService.getNetworkStats());
    }
  }, []);

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🌐 Harmonic Communities Network</h1>
        <p className="text-lg text-gray-600">Connect, collaborate, and share knowledge across Harmonic Habitats</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-sm font-semibold text-blue-600 uppercase">Communities</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCommunities || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">Avg Score</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{Math.round(stats.avgSustainabilityScore || 0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-sm font-semibold text-purple-600 uppercase">Connections</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalConnections || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <div className="text-sm font-semibold text-orange-600 uppercase">Collaborations</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCollaborations || 0}</div>
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search communities by name, location, or focus area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredCommunities.map((community) => (
          <div key={community.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{community.name}</h3>
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-bold">{community.sustainabilityScore}%</div>
            </div>
            <p className="text-gray-600 mb-2">📍 {community.location}</p>
            <p className="text-gray-600 mb-2">👥 {community.population} members • Founded {community.founded}</p>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Focus Areas:</p>
              <div className="flex flex-wrap gap-2">
                {community.focusAreas.map((area) => (
                  <span key={area} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Connect
            </button>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No communities match your search</p>
        </div>
      )}
    </div>
  );
};

export default CommunityNetwork;
