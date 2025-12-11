import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useFoodData } from "../../hooks/useApi";

export default function FoodSafety() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [safetyRecords, setSafetyRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const foodData = useFoodData("default");

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

  useEffect(() => {
    const load = () => {
      try {
        if (foodData.pests?.data) {
          const mapped = Array.isArray(foodData.pests.data)
            ? foodData.pests.data
            : foodData.pests.data?.inspections || [];
          setSafetyRecords(mapped);
          setError(null);
        } else if (!foodData.isLoading) {
          const foodService = sofieCore.getService("food");
          if (foodService?.getSafetyRecords) {
            setSafetyRecords(foodService.getSafetyRecords());
          }
        }

        setLoading(foodData.isLoading);
        if (foodData.pests?.error) {
          setError(foodData.pests.error.message || "Failed to load safety data");
        }
      } catch (err) {
        console.error("Error loading food safety data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    load();
  }, [foodData.pests?.data, foodData.isLoading, foodData.pests?.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full mr-3"></div>
            Loading safety records...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "amber" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => foodData.pests?.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const getResultColor = (result) => {
    return result === "PASS" ? "#4ade80" : result === "WARN" ? "#f59e0b" : "#ef4444";
  };

  const passedTests = safetyRecords.filter((r) => r.result === "PASS").length;
  const overallScore = safetyRecords.length > 0 ? Math.round((passedTests / safetyRecords.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#ea580c'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              ✓ Food Safety
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 mt-4 max-w-2xl">Quality control tests and contamination monitoring</p>
          </div>
        </GlassSection>

        {/* Summary Cards */}
        <GlassGrid cols={4} colsMd={2} gap={6}>
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{overallScore}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Safety Score</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">All tests passed</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{safetyRecords.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Tests</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Conducted this season</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">{passedTests}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Passed Tests</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">No contamination</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "indigo" }}>
            <div className="p-6 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {safetyRecords.length > 0
                  ? new Date(safetyRecords[safetyRecords.length - 1].testDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Latest Test</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Test completion</p>
            </div>
          </GlassCard>
        </GlassGrid>

        <GlassSection colors={{ primary: "amber", secondary: "orange" }} elevation="standard">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Safety Test Records</h2>
            <div className="space-y-4">
              {safetyRecords.map((record, idx) => (
                <GlassCard key={record.testId} colors={{ primary: "amber", secondary: "orange" }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {record.testType}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              record.result === "PASS"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                            }`}
                          >
                            {record.result}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(record.testDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tested Sample</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{record.testedSample}</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Location</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{record.location}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Test Parameters</p>
                      <div className="space-y-2 text-sm">
                         {(record.parameters || []).map((param, idx) => (
                          <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>{param.name}:</span>
                            <span className={param.status === "PASS" ? "text-green-600 dark:text-green-400 font-bold" : "text-orange-600 dark:text-orange-400 font-bold"}>
                              {param.value} {param.status === "PASS" ? "✓" : "⚠"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {record.notes && (
                      <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <span>Tested by: <span className="text-gray-700 dark:text-gray-400 font-semibold">{record.testedBy}</span></span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  );
}
