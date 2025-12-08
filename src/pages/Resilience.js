import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const Resilience = () => {
  const [emergencyPlans, setEmergencyPlans] = useState([]);
  const [resources, setResources] = useState({});
  const [risks, setRisks] = useState([]);
  const [resilienceScore, setResilienceScore] = useState(0);

  useEffect(() => {
    const resService = sofieCore.getService("resilience");
    if (resService) {
      setEmergencyPlans(resService.getEmergencyPlans());
      setResources(resService.getEmergencyResources());
      setRisks(resService.assessRisks());
      setResilienceScore(resService.getResilienceScore());
    }
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🛡️ Community Resilience</h1>
        <p className="text-lg text-gray-600">Emergency preparedness and risk management</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-8 mb-8 border-l-4 border-green-600">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Community Resilience Score</p>
          <div className="text-6xl font-bold text-green-600">{resilienceScore}%</div>
          <p className="text-gray-600 mt-2">Emergency preparedness level</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚨 Risk Assessment</h2>
          <div className="space-y-3">
            {risks.map((risk) => (
              <div key={risk.id} className={`border-l-4 p-4 rounded-lg ${getSeverityColor(risk.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold capitalize">{risk.type}</h3>
                  <span className="text-sm font-bold capitalize">{risk.severity}</span>
                </div>
                <p className="text-sm mb-2">{risk.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${risk.probability * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">Probability: {Math.round(risk.probability * 100)}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Emergency Resources</h2>
          <div className="space-y-3">
            {Object.entries(resources).map(([resource, quantity]) => (
              <div key={resource} className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="font-semibold text-gray-700 capitalize">{resource.replace(/_/g, " ")}</span>
                <span className="text-lg font-bold text-blue-600">{quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">🗂️ Emergency Plans</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {emergencyPlans.map((plan) => (
          <div key={plan.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-700 mb-4">{plan.description}</p>
            <div className="flex justify-between items-center">
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-bold">{plan.status}</span>
              <p className="text-xs text-gray-600">Last review: {plan.lastReview}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg shadow-md p-8 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Resilience Best Practices</h2>
        <ul className="grid md:grid-cols-2 gap-6">
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3 text-xl">✓</span>
            <span className="text-gray-700"><strong>Regular Training:</strong> Monthly emergency drills for all members</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3 text-xl">✓</span>
            <span className="text-gray-700"><strong>Diversification:</strong> Multiple sources for food, water, and energy</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3 text-xl">✓</span>
            <span className="text-gray-700"><strong>Communication:</strong> Mesh network backup for grid failures</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 font-bold mr-3 text-xl">✓</span>
            <span className="text-gray-700"><strong>Cooperation:</strong> Mutual aid agreements with neighboring communities</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Resilience;
