import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const ImpactBenchmarks = () => {
  const [, setMetrics] = useState({});
  const [comparison, setComparison] = useState({});
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const impactService = sofieCore.getService("impactMetrics");
    if (impactService) {
      setMetrics(impactService.getMetrics());
      setComparison(impactService.getBenchmarkComparison());
      setOverallScore(impactService.getOverallScore());
    }
  }, []);

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (percentage) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">📊 Impact Benchmarks</h1>
        <p className="text-lg text-gray-600">Track sustainability metrics against global benchmarks</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-8 mb-8 border-l-4 border-green-600">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Overall Sustainability Score</p>
          <div className="text-6xl font-bold text-green-600">{overallScore}%</div>
          <p className="text-gray-600 mt-2">Compared to global benchmarks</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(comparison).map(([key, data]) => (
          <div key={key} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <p className="text-sm text-gray-600">Current: {data.current}</p>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(data.percentageOfTarget)}`}>{data.percentageOfTarget}%</span>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`${getBarColor(data.percentageOfTarget)} h-4 rounded-full transition-all`}
                  style={{ width: `${Math.min(data.percentageOfTarget, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Target: {data.target}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg shadow-md p-8 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Sustainability Categories</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg text-gray-800 mb-2">✓ On Track</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Energy Generation: 95%</li>
              <li>• Waste Reduction: 92%</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg text-gray-800 mb-2">⚠ Needs Attention</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Carbon Footprint: 125%</li>
              <li>• Water Conservation: 90%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactBenchmarks;
