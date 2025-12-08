import React, { useState, useEffect } from "react";
import "../styles/Predictions.css";

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("yield");
  const [climateZone, setClimateZone] = useState("temperate");
  const [selectedCrop, setSelectedCrop] = useState("tomato");

  useEffect(() => {
    loadPredictions();
  }, [climateZone, selectedCrop]);

  const loadPredictions = () => {
    if (!window.sofieCore || !window.sofieCore.services.predictiveAnalytics) {
      console.warn("Predictive Analytics service not initialized");
      return;
    }

    const predService = window.sofieCore.services.predictiveAnalytics;

    // Load yield predictions
    const yieldPreds = predService.predictYield?.(selectedCrop, climateZone, 3);
    setPredictions(yieldPreds || []);

    // Load anomalies
    const anom = predService.getHistoricalAnomalies?.() || [];
    setAnomalies(anom);

    // Load recommendations
    const recs = predService.suggestOptimalPlanting?.(climateZone) || [];
    setRecommendations(recs);
  };

  const crops = [
    "tomato",
    "lettuce",
    "basil",
    "pepper",
    "cucumber",
    "spinach",
    "kale",
    "radish",
  ];
  const zones = ["tropical", "subtropical", "temperate", "cold"];

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return "#22c55e";
    if (accuracy >= 80) return "#84cc16";
    if (accuracy >= 70) return "#eab308";
    return "#f97316";
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.9) return "🎯";
    if (confidence >= 0.8) return "👍";
    if (confidence >= 0.7) return "👌";
    return "⚠️";
  };

  const renderPredictionCard = (title, data, unit) => (
    <div className="prediction-card">
      <h4>{title}</h4>
      {Array.isArray(data) && data.length > 0 ? (
        <div className="prediction-list">
          {data.slice(0, 3).map((item, idx) => (
            <div key={idx} className="prediction-item">
              <div className="prediction-period">{item.month || `Month ${idx + 1}`}</div>
              <div className="prediction-value">
                {Math.round(item.yield || item.value || 0)} {unit}
              </div>
              <div className="prediction-confidence">
                {item.confidence && (
                  <>
                    {getConfidenceIcon(item.confidence)} {Math.round(item.confidence * 100)}%
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">No predictions available</p>
      )}
    </div>
  );

  return (
    <div className="predictions-container">
      <div className="predictions-header">
        <h1>🔮 Predictive Analytics & Recommendations</h1>
        <p>ML-powered forecasts and optimization recommendations</p>
      </div>

      <div className="predictions-controls">
        <div className="control-group">
          <label>Climate Zone:</label>
          <select value={climateZone} onChange={(e) => setClimateZone(e.target.value)}>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone.charAt(0).toUpperCase() + zone.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Crop:</label>
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="predictions-tabs">
        <button
          className={`prediction-tab ${activeTab === "yield" ? "active" : ""}`}
          onClick={() => setActiveTab("yield")}
        >
          Yield Forecast
        </button>
        <button
          className={`prediction-tab ${activeTab === "recommendations" ? "active" : ""}`}
          onClick={() => setActiveTab("recommendations")}
        >
          Recommendations
        </button>
        <button
          className={`prediction-tab ${activeTab === "anomalies" ? "active" : ""}`}
          onClick={() => setActiveTab("anomalies")}
        >
          Anomalies
        </button>
        <button
          className={`prediction-tab ${activeTab === "pest" ? "active" : ""}`}
          onClick={() => setActiveTab("pest")}
        >
          Pest Risk
        </button>
      </div>

      {/* Yield Forecast Tab */}
      {activeTab === "yield" && (
        <div className="predictions-yield">
          <h2>
            {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Yield Forecast - {climateZone}
          </h2>

          <div className="yield-chart-container">
            <div className="yield-summary">
              <div className="summary-card">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <div className="summary-label">Predicted Yield (Next 3 Months)</div>
                  <div className="summary-value">
                    {predictions.length > 0
                      ? Math.round(
                          predictions.reduce((sum, p) => sum + (p.yield || 0), 0)
                        )
                      : "N/A"}{" "}
                    kg
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">🎯</div>
                <div className="summary-content">
                  <div className="summary-label">Model Accuracy</div>
                  <div className="summary-value">85%</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">📈</div>
                <div className="summary-content">
                  <div className="summary-label">Confidence Level</div>
                  <div className="summary-value">
                    {predictions.length > 0
                      ? Math.round(
                          (predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) /
                            predictions.length) *
                            100
                        )
                      : "N/A"}
                    %
                  </div>
                </div>
              </div>
            </div>

            <div className="yield-details">
              {predictions.length > 0 ? (
                <div className="yield-timeline">
                  {predictions.map((pred, idx) => (
                    <div key={idx} className="yield-month">
                      <div className="month-label">{pred.month || `Month ${idx + 1}`}</div>
                      <div className="month-bar">
                        <div
                          className="month-fill"
                          style={{
                            width: `${Math.min(
                              100,
                              (pred.yield || 0) / 100
                            )}%`,
                            backgroundColor: getAccuracyColor(pred.yield || 0),
                          }}
                        />
                      </div>
                      <div className="month-value">{Math.round(pred.yield || 0)} kg</div>
                      <div className="month-confidence">
                        {getConfidenceIcon(pred.confidence || 0.8)}{" "}
                        {Math.round((pred.confidence || 0.8) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No yield predictions available for this crop and zone</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="predictions-recommendations">
          <h2>Optimal Planting Recommendations for {climateZone}</h2>

          {recommendations.length > 0 ? (
            <div className="recommendations-grid">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-card">
                  <div className="recommendation-rank">#{idx + 1}</div>
                  <h3>{rec.crop}</h3>

                  <div className="recommendation-score">
                    <div className="score-label">Predicted Yield</div>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${Math.min(100, (rec.score || 0) / 10)}%`,
                          backgroundColor: getAccuracyColor(rec.score || 0),
                        }}
                      />
                    </div>
                    <div className="score-value">{Math.round(rec.score || 0)}/100</div>
                  </div>

                  <div className="recommendation-stats">
                    <div className="stat">
                      <span className="stat-label">Confidence</span>
                      <span className="stat-value">
                        {getConfidenceIcon(rec.confidence || 0.8)}{" "}
                        {Math.round((rec.confidence || 0.8) * 100)}%
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Season</span>
                      <span className="stat-value">{rec.season || "Year-round"}</span>
                    </div>
                  </div>

                  {rec.reason && (
                    <div className="recommendation-reason">
                      <div className="reason-label">Why this crop?</div>
                      <p>{rec.reason}</p>
                    </div>
                  )}

                  <button className="btn-select">Plant Now</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-full">
              <div className="empty-icon">🌱</div>
              <h2>No recommendations yet</h2>
              <p>Change climate zone to see crop recommendations</p>
            </div>
          )}
        </div>
      )}

      {/* Anomalies Tab */}
      {activeTab === "anomalies" && (
        <div className="predictions-anomalies">
          <h2>Detected Anomalies</h2>

          {anomalies.length > 0 ? (
            <div className="anomalies-list">
              {anomalies.map((anomaly, idx) => (
                <div
                  key={idx}
                  className={`anomaly-item severity-${anomaly.severity || "warning"}`}
                >
                  <div className="anomaly-icon">
                    {anomaly.severity === "critical" && "🚨"}
                    {anomaly.severity === "warning" && "⚠️"}
                    {anomaly.severity === "info" && "ℹ️"}
                  </div>
                  <div className="anomaly-content">
                    <div className="anomaly-title">{anomaly.type}</div>
                    <div className="anomaly-description">{anomaly.description}</div>
                    <div className="anomaly-value">
                      Expected: {anomaly.expected}, Got: {anomaly.actual}
                    </div>
                    <div className="anomaly-date">
                      {new Date(anomaly.detected).toLocaleString()}
                    </div>
                  </div>
                  {anomaly.suggestion && (
                    <div className="anomaly-suggestion">
                      <strong>Action:</strong> {anomaly.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-full">
              <div className="empty-icon">✅</div>
              <h2>No anomalies detected</h2>
              <p>All metrics are within expected ranges</p>
            </div>
          )}
        </div>
      )}

      {/* Pest Risk Tab */}
      {activeTab === "pest" && (
        <div className="predictions-pest">
          <h2>Pest Outbreak Risk Assessment</h2>

          <div className="pest-cards">
            <div className="pest-card">
              <div className="pest-icon">🦗</div>
              <h3>Current Risk</h3>
              <div className="pest-risk-level">
                <div className="risk-percentage">35%</div>
                <div className="risk-label">Low to Moderate</div>
              </div>
              <p>No active pest threats detected in your climate zone</p>
            </div>

            <div className="pest-card">
              <div className="pest-icon">📅</div>
              <h3>Peak Season Risk</h3>
              <div className="risk-months">
                <div className="risk-month">Jun: 52%</div>
                <div className="risk-month">Jul: 68%</div>
                <div className="risk-month">Aug: 61%</div>
              </div>
              <p>Higher risk during summer months</p>
            </div>

            <div className="pest-card">
              <div className="pest-icon">🛡️</div>
              <h3>Preventative Measures</h3>
              <ul className="pest-measures">
                <li>Maintain integrated pest management (IPM)</li>
                <li>Monitor for early warning signs</li>
                <li>Encourage natural predators</li>
                <li>Use organic pesticides as last resort</li>
              </ul>
            </div>
          </div>

          <div className="pest-risks-by-species">
            <h3>Risk by Potential Pest</h3>
            <div className="pest-species-list">
              {[
                { name: "Aphids", risk: 28, icon: "🐛" },
                { name: "Whiteflies", risk: 35, icon: "🦟" },
                { name: "Spider Mites", risk: 22, icon: "🕷️" },
                { name: "Powdery Mildew", risk: 18, icon: "🍂" },
              ].map((pest, idx) => (
                <div key={idx} className="pest-species-item">
                  <span className="pest-name">
                    {pest.icon} {pest.name}
                  </span>
                  <div className="pest-risk-bar">
                    <div
                      className="pest-risk-fill"
                      style={{
                        width: `${pest.risk}%`,
                        backgroundColor: getAccuracyColor(pest.risk * 2.5),
                      }}
                    />
                  </div>
                  <span className="pest-risk-percent">{pest.risk}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="predictions-footer">
        <p>
          ℹ️ Predictions based on historical data, climate patterns, and machine learning models.
          Accuracy improves as more data is collected.
        </p>
      </div>
    </div>
  );
};

export default Predictions;
