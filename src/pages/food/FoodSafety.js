import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function FoodSafety() {
  const [safetyRecords, setSafetyRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foodService = sofieCore.getService("food");
      if (foodService && foodService.getSafetyRecords) {
        const data = foodService.getSafetyRecords();
        setSafetyRecords(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading safety data:", error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading safety records...</div>
      </div>
    );
  }

  const getResultColor = (result) => {
    return result === "PASS" ? "#4ade80" : result === "WARN" ? "#f59e0b" : "#ef4444";
  };

  const passedTests = safetyRecords.filter((r) => r.result === "PASS").length;
  const overallScore = Math.round((passedTests / safetyRecords.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-600 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #f5a87322, rgba(210, 175, 135, 0.12))',
        border: '1px solid #f5a87366',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #f5a87355, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f5a873' }}>
          ✓ Food Safety
        </h1>
        <p className="text-gray-300">Quality control tests and contamination monitoring</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Safety Score</p>
          <p className="text-4xl font-bold text-white">{overallScore}%</p>
          <p className="text-xs text-gray-500 mt-2">All tests passed</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
            border: '1px solid #f5a87355',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Total Tests</p>
          <p className="text-4xl font-bold" style={{ color: '#f5a873' }}>{safetyRecords.length}</p>
          <p className="text-xs text-gray-500 mt-2">Conducted this season</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #22d3ee18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #22d3ee55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Passed Tests</p>
          <p className="text-4xl font-bold" style={{ color: '#22d3ee' }}>{passedTests}</p>
          <p className="text-xs text-gray-500 mt-2">No contamination</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #60a5fa18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #60a5fa55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Latest Test</p>
          <p className="text-2xl font-bold" style={{ color: '#60a5fa' }}>
            {safetyRecords.length > 0
              ? new Date(safetyRecords[safetyRecords.length - 1].testDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-2">Test completion</p>
        </div>
      </div>

      {/* Safety Records Timeline */}
      <div className="space-y-4">
        {safetyRecords.map((record, idx) => (
          <div
            key={record.testId}
            style={{
              ...glassPanel,
              background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
              border: '1px solid #f5a87355',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold" style={{ color: '#f5a873' }}>
                    {record.testType}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: `${getResultColor(record.result)}20`,
                      color: getResultColor(record.result),
                      border: `1px solid ${getResultColor(record.result)}40`
                    }}
                  >
                    {record.result}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {record.description}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">
                  {new Date(record.testDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Tested Sample</p>
                <p className="text-sm font-bold text-white">{record.testedSample}</p>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm font-bold text-white">{record.location}</p>
              </div>
            </div>

            {/* Test Details */}
            <div className="border-t border-orange-400/20 pt-3">
              <p className="text-sm font-bold text-gray-300 mb-2">Test Parameters</p>
              <div className="space-y-2 text-sm">
                {record.parameters.map((param, idx) => (
                  <div key={idx} className="flex justify-between text-gray-400">
                    <span>{param.name}:</span>
                    <span className={param.status === "PASS" ? "text-green-400 font-bold" : "text-orange-400 font-bold"}>
                      {param.value} {param.status === "PASS" ? "✓" : "⚠"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {record.notes && (
              <div className="mt-3 bg-orange-500/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-300">{record.notes}</p>
              </div>
            )}

            {/* Technician */}
            <div className="mt-3 text-xs text-gray-500 border-t border-orange-400/20 pt-3">
              <span>Tested by: <span className="text-gray-400 font-semibold">{record.testedBy}</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Summary */}
      <div
        className="mt-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #f5a87318, rgba(210, 175, 135, 0.10))',
          border: '1px solid #f5a87355',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5a873' }}>
          Safety Assessment
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {overallScore}%
            </p>
            <p className="text-sm text-gray-400">Overall Safety</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#22d3ee' }}>
              {passedTests}
            </p>
            <p className="text-sm text-gray-400">Passed Tests</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {safetyRecords.length - passedTests}
            </p>
            <p className="text-sm text-gray-400">Issues Found</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>
              {safetyRecords.length}
            </p>
            <p className="text-sm text-gray-400">Total Tests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
