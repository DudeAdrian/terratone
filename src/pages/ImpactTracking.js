import React, { useState, useEffect } from "react";
import "../styles/ImpactTracking.css";

const ImpactTracking = () => {
  const [impact, setImpact] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadImpactData();
    const interval = setInterval(loadImpactData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadImpactData = () => {
    if (!window.sofieCore || !window.sofieCore.services.impactTracking) {
      console.warn("Impact Tracking service not initialized");
      return;
    }

    const impactService = window.sofieCore.services.impactTracking;
    setImpact(impactService.getCurrentImpact?.());
    setSummary(impactService.getImpactSummary?.());
    setTrends(impactService.getHistoricalTrends?.(timeRange));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#eab308"; // Yellow
    if (score >= 40) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return Math.round(num).toLocaleString();
  };

  const renderMetricCard = (title, value, unit, icon, color = "#3b82f6") => (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <div className="metric-label">{title}</div>
        <div className="metric-value">
          {formatNumber(value)} <span className="metric-unit">{unit}</span>
        </div>
      </div>
    </div>
  );

  const renderProgressBar = (value, max = 100, label = "") => (
    <div className="progress-container">
      <div className="progress-label">{label}</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, (value / max) * 100)}%`,
            backgroundColor: getScoreColor(value),
          }}
        />
      </div>
      <div className="progress-value">{Math.round(value)}%</div>
    </div>
  );

  if (!impact || !summary) {
    return <div className="impact-loading">Loading impact data...</div>;
  }

  const overallScore = summary?.overallScore || 0;

  return (
    <div className="impact-container">
      <div className="impact-header">
        <h1>🌍 Sustainability Impact Dashboard</h1>
        <p>Comprehensive tracking of environmental and community impact metrics</p>
      </div>

      {/* Overall Score */}
      <div className="overall-score-section">
        <div className="overall-score-card">
          <div
            className="overall-score-circle"
            style={{ borderColor: getScoreColor(overallScore) }}
          >
            <div className="overall-score-value">{Math.round(overallScore)}</div>
            <div className="overall-score-max">/100</div>
          </div>
          <div className="overall-score-info">
            <h2>Overall Sustainability Score</h2>
            <p className="score-label" style={{ color: getScoreColor(overallScore) }}>
              {getScoreLabel(overallScore)}
            </p>
            <p className="score-description">
              Weighted average across all sustainability metrics
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="impact-tabs">
        <button
          className={`impact-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`impact-tab ${activeTab === "carbon" ? "active" : ""}`}
          onClick={() => setActiveTab("carbon")}
        >
          Carbon
        </button>
        <button
          className={`impact-tab ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
        <button
          className={`impact-tab ${activeTab === "biodiversity" ? "active" : ""}`}
          onClick={() => setActiveTab("biodiversity")}
        >
          Biodiversity
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="impact-overview">
          <div className="metrics-grid">
            {renderMetricCard(
              "Carbon Footprint",
              impact?.carbonFootprint || 0,
              "kg CO₂/year",
              "🔥",
              "#ef4444"
            )}
            {renderMetricCard(
              "Carbon Saved",
              summary?.carbonReduction?.saved || 0,
              "kg CO₂/year",
              "🍃",
              "#22c55e"
            )}
            {renderMetricCard(
              "Water Conserved",
              impact?.waterSaved || 0,
              "liters/year",
              "💧",
              "#06b6d4"
            )}
            {renderMetricCard(
              "Energy Produced",
              impact?.energyProduced || 0,
              "kWh",
              "⚡",
              "#f59e0b"
            )}
            {renderMetricCard(
              "Food Produced",
              impact?.foodProduced || 0,
              "kg",
              "🥬",
              "#84cc16"
            )}
            {renderMetricCard(
              "Waste Reduced",
              impact?.wasteReduced || 0,
              "kg",
              "♻️",
              "#8b5cf6"
            )}
          </div>

          <div className="progress-section">
            <h3>Self-Sufficiency & Efficiency</h3>
            <div className="progress-grid">
              {renderProgressBar(
                impact?.energySelfSufficiency || 0,
                100,
                `Energy Independence: ${impact?.energySelfSufficiency || 0}%`
              )}
              {renderProgressBar(
                impact?.foodSelfSufficiency || 0,
                100,
                `Food Sovereignty: ${impact?.foodSelfSufficiency || 0}%`
              )}
              {renderProgressBar(
                impact?.waterEfficiency || 0,
                100,
                `Water Efficiency: ${impact?.waterEfficiency || 0}%`
              )}
              {renderProgressBar(
                impact?.wasteRecyclingRate || 0,
                100,
                `Waste Recycling: ${impact?.wasteRecyclingRate || 0}%`
              )}
            </div>
          </div>
        </div>
      )}

      {/* Carbon Tab */}
      {activeTab === "carbon" && (
        <div className="impact-carbon">
          <div className="carbon-section">
            <div className="carbon-card">
              <h3>Annual Carbon Impact</h3>
              <div className="carbon-comparison">
                <div className="comparison-item baseline">
                  <div className="comparison-label">Baseline (Conventional)</div>
                  <div className="comparison-value">
                    {formatNumber(summary?.carbonReduction?.baseline || 0)}
                  </div>
                  <div className="comparison-unit">kg CO₂/year</div>
                </div>
                <div className="comparison-arrow">→</div>
                <div className="comparison-item actual">
                  <div className="comparison-label">Sofie Systems</div>
                  <div className="comparison-value">
                    {formatNumber(summary?.carbonReduction?.current || 0)}
                  </div>
                  <div className="comparison-unit">kg CO₂/year</div>
                </div>
              </div>
            </div>

            <div className="carbon-card">
              <h3>Reduction Achievement</h3>
              <div className="reduction-metric">
                <div className="reduction-percentage">
                  {summary?.carbonReduction?.percentReduced || 0}%
                </div>
                <div className="reduction-label">Carbon Reduced</div>
                <div className="reduction-saved">
                  {formatNumber(summary?.carbonReduction?.saved || 0)} kg CO₂ saved annually
                </div>
              </div>
              {renderProgressBar(
                summary?.carbonReduction?.percentReduced || 0,
                100,
                "Reduction Progress"
              )}
            </div>
          </div>

          <div className="carbon-breakdown">
            <h3>Carbon Sources</h3>
            <div className="sources-list">
              <div className="source-item">
                <span className="source-name">Energy Generation</span>
                <span className="source-impact">
                  {impact?.energySelfSufficiency >= 90 ? "✅ Minimal" : "⚠️ Significant"}
                </span>
              </div>
              <div className="source-item">
                <span className="source-name">Food Production</span>
                <span className="source-impact">
                  {impact?.foodSelfSufficiency >= 80 ? "✅ Low" : "⚠️ Moderate"}
                </span>
              </div>
              <div className="source-item">
                <span className="source-name">Community Trade</span>
                <span className="source-impact">📊 Optimized routing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="impact-resources">
          <div className="resource-grid">
            <div className="resource-card">
              <h3>💧 Water</h3>
              <div className="resource-stat">
                <div className="stat-label">Conserved Annually</div>
                <div className="stat-value">
                  {formatNumber(summary?.waterConservation?.saved || 0)} liters
                </div>
              </div>
              {renderProgressBar(
                summary?.waterConservation?.efficiency || 0,
                100,
                "Water Efficiency"
              )}
            </div>

            <div className="resource-card">
              <h3>⚡ Energy</h3>
              <div className="resource-stat">
                <div className="stat-label">Self-Sufficiency</div>
                <div className="stat-value">
                  {summary?.energyIndependence?.selfSufficiency || 0}%
                </div>
              </div>
              <div className="resource-stat">
                <div className="stat-label">Produced Annually</div>
                <div className="stat-value">
                  {formatNumber(summary?.energyIndependence?.produced || 0)} kWh
                </div>
              </div>
            </div>

            <div className="resource-card">
              <h3>🥬 Food</h3>
              <div className="resource-stat">
                <div className="stat-label">Food Sovereignty</div>
                <div className="stat-value">{summary?.foodSovereignty?.selfSufficiency || 0}%</div>
              </div>
              <div className="resource-stat">
                <div className="stat-label">Produced Annually</div>
                <div className="stat-value">
                  {formatNumber(summary?.foodSovereignty?.produced || 0)} kg
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Biodiversity Tab */}
      {activeTab === "biodiversity" && (
        <div className="impact-biodiversity">
          <div className="biodiversity-card">
            <h3>🌿 Biodiversity Score</h3>
            <div className="biodiversity-score-display">
              <div
                className="biodiversity-meter"
                style={{ borderColor: getScoreColor(impact?.biodiversityScore || 0) }}
              >
                <div className="biodiversity-value">{impact?.biodiversityScore || 0}</div>
                <div className="biodiversity-rating">
                  {summary?.biodiversity?.rating || "Unknown"}
                </div>
              </div>
              <div className="biodiversity-info">
                <p>
                  Based on species diversity, ecosystem health, and sustainable management practices
                </p>
              </div>
            </div>
          </div>

          <div className="biodiversity-factors">
            <h3>Contributing Factors</h3>
            <div className="factors-list">
              <div className="factor-item">
                <span className="factor-icon">🐟</span>
                <span className="factor-name">Aquatic Species Diversity</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">🦗</span>
                <span className="factor-name">Integrated Pest Management</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">🌾</span>
                <span className="factor-name">Polyculture Systems</span>
              </div>
              <div className="factor-item">
                <span className="factor-icon">🍃</span>
                <span className="factor-name">Native Plant Integration</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="impact-footer">
        <div className="footer-info">
          <p>Last updated: {impact?.lastUpdated ? new Date(impact.lastUpdated).toLocaleString() : "Never"}</p>
          <button className="btn-export" onClick={() => {
            if (window.sofieCore?.services?.impactTracking) {
              const report = window.sofieCore.services.impactTracking.exportImpactReport?.();
              const dataStr = JSON.stringify(report, null, 2);
              const dataBlob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `impact-report-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }
          }}>
            📥 Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracking;
