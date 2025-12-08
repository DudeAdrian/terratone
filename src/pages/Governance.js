import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const Governance = () => {
  const [stats, setStats] = useState({});
  const [proposals, setProposals] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const govService = sofieCore.getService("governance");
    if (govService) {
      setStats(govService.getGovernanceStats());
      setProposals(govService.getProposals());
      setMembers(govService.getMembers());
    }
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🗳️ Community Governance</h1>
        <p className="text-lg text-gray-600">Transparent community decision-making and voting</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-sm font-semibold text-blue-600 uppercase">Members</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalMembers || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">Proposals</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalProposals || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-sm font-semibold text-purple-600 uppercase">Active</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.activeProposals || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <div className="text-sm font-semibold text-orange-600 uppercase">Passed</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.passedProposals || 0}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Members</h2>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Joined: {member.joinDate}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Proposals</h2>
          <div className="space-y-4">
            {proposals.slice(0, 3).map((proposal) => (
              <div key={proposal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{proposal.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{proposal.status}</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{proposal.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-bold">For: {proposal.votesFor}</span>
                  <span className="text-red-600 font-bold">Against: {proposal.votesAgainst}</span>
                </div>
              </div>
            ))}
            {proposals.length === 0 && <p className="text-gray-600">No active proposals</p>}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg shadow-md p-8 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Governance Guidelines</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3">✓</span>
            <span>All community members have equal voting rights</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3">✓</span>
            <span>Proposals require 24 hours for community discussion</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3">✓</span>
            <span>Voting period lasts 7 days from proposal submission</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3">✓</span>
            <span>Simple majority (50%+1) determines proposal outcome</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3">✓</span>
            <span>All decisions are documented and transparent</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Governance;
