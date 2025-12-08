// src/components/SustainabilityMetrics.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import sofieCore from "../core/SofieCore";

const ScoreCard = ({ title, score, icon }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 flex items-center justify-between border-l-4 border-green-500">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">{score}%</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
};

ScoreCard.propTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};

const ProgressBar = ({ label, value, color = "green" }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>\n      <span className="text-sm font-bold text-gray-600">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`bg-${color}-500 h-3 rounded-full transition-all`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
};

const SustainabilityMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const sustainability = sofieCore.getService("sustainability");
      if (sustainability) {
        const data = sustainability.getDashboardMetrics();
        setMetrics(data);
      } else {
        setError("Sustainability service not found");
      }
    } catch (err) {
      setError(err.message || "Failed to load metrics");
      sofieCore.getService("logger").error("Failed to load sustainability metrics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingSpinner text="Loading sustainability metrics..." />;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  if (!metrics) return <div className="text-center py-8 text-gray-600">No data available</div>;

  const { systemHealth, recommendations } = metrics;

  return (
    <div className="space-y-6">
      {/* Score Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Food"
          score={systemHealth.food.score}
          icon="🌱"
        />
        <ScoreCard
          title="Water"
          score={systemHealth.water.score}
          icon="💧"
        />
        <ScoreCard
          title="Housing"
          score={systemHealth.housing.score}
          icon="🏠"
        />
        <ScoreCard
          title="Overall"
          score={systemHealth.overall}
          icon="🌍"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Food System */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🌱 Food Systems</h3>
          <div className="space-y-3">
            <ProgressBar label="Crop Diversity" value={Math.min(systemHealth.food.data.crops.length * 15, 100)} color="green" />
            <ProgressBar label="Storage Level" value={Math.min((systemHealth.food.data.storage / 500) * 100, 100)} color="yellow" />
            <p className="text-sm text-gray-600 mt-4">
              <strong>Gardens:</strong> {systemHealth.food.data.gardens.length}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Monthly Yield:</strong> {systemHealth.food.data.yields} kg
            </p>
          </div>
        </div>

        {/* Water System */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💧 Water Systems</h3>
          <div className="space-y-3">
            <ProgressBar label="Reserve Level" value={Math.min((systemHealth.water.data.totalReserve / 5000) * 100, 100)} color="blue" />
            <ProgressBar label="Conservation Efficiency" value={Math.max(100 - (systemHealth.water.data.dailyUsage / 10), 0)} color="cyan" />
            <p className="text-sm text-gray-600 mt-4">
              <strong>Total Reserve:</strong> {systemHealth.water.data.totalReserve.toFixed(0)} L
            </p>
            <p className="text-sm text-gray-600">
              <strong>Daily Usage:</strong> {systemHealth.water.data.dailyUsage.toFixed(0)} L
            </p>
          </div>
        </div>

        {/* Housing System */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🏠 Housing & Environment</h3>
          <div className="space-y-3">
            <ProgressBar label="Thermal Efficiency" value={systemHealth.housing.data.thermalEfficiency} color="orange" />
            <ProgressBar label="Air Quality" value={systemHealth.housing.data.airQuality} color="green" />
            <p className="text-sm text-gray-600 mt-4">
              <strong>Temperature:</strong> {systemHealth.housing.data.indoorClimate.temperature}°C
            </p>
            <p className="text-sm text-gray-600">
              <strong>Humidity:</strong> {systemHealth.housing.data.indoorClimate.humidity}%
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 ${rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                <span className="text-gray-700">{rec.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SustainabilityMetrics;