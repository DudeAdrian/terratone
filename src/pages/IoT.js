import React, { useState, useEffect } from "react";
import "../styles/IoT.css";

const IoT = () => {
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [health, setHealth] = useState({});
  const [newSensor, setNewSensor] = useState({
    type: "water_ph",
    location: "",
    name: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [sofieCore, setSofieCore] = useState(null);

  useEffect(() => {
    // Get sofieCore from window
    if (window.sofieCore) {
      setSofieCore(window.sofieCore);
      loadSensorData();
    }
  }, []);

  const loadSensorData = () => {
    if (!window.sofieCore || !window.sofieCore.services.iot) {
      console.warn("IoT service not initialized");
      return;
    }

    const iotService = window.sofieCore.services.iot;
    setSensors(iotService.sensors || []);
    setHealth(iotService.getSensorHealth?.() || {});
  };

  const handleAddSensor = () => {
    if (!newSensor.name || !newSensor.location) {
      alert("Please fill in all fields");
      return;
    }

    const iotService = window.sofieCore?.services?.iot;
    if (!iotService) {
      alert("IoT service not available");
      return;
    }

    const sensorData = {
      id: `sensor-${Date.now()}`,
      ...newSensor,
      status: "active",
      lastReading: null,
      createdAt: new Date().toISOString(),
    };

    iotService.registerSensor(sensorData);
    setSensors([...sensors, sensorData]);
    setNewSensor({ type: "water_ph", location: "", name: "" });
  };

  const handleSubmitReading = (sensorId, value) => {
    const iotService = window.sofieCore?.services?.iot;
    if (!iotService) return;

    iotService.processSensorData(sensorId, value);
    loadSensorData(); // Refresh data
  };

  const getSensorIcon = (type) => {
    const icons = {
      water_ph: "💧",
      water_temp: "🌡️",
      water_do: "🫧",
      soil_moisture: "🌱",
      soil_temp: "🥔",
      air_temp: "🌡️",
      air_humidity: "💨",
      light_level: "💡",
    };
    return icons[type] || "📡";
  };

  const getSensorThresholds = (type) => {
    const thresholds = {
      water_ph: { critical: { min: 6.5, max: 8.0 }, warning: { min: 6.0, max: 8.5 }, unit: "pH" },
      water_temp: { critical: { min: 15, max: 30 }, warning: { min: 10, max: 35 }, unit: "°C" },
      water_do: { critical: { min: 5, max: 10 }, warning: { min: 4, max: 12 }, unit: "mg/L" },
      soil_moisture: { critical: { min: 40, max: 80 }, warning: { min: 30, max: 90 }, unit: "%" },
      soil_temp: { critical: { min: 15, max: 28 }, warning: { min: 10, max: 35 }, unit: "°C" },
      air_temp: { critical: { min: 15, max: 28 }, warning: { min: 10, max: 35 }, unit: "°C" },
      air_humidity: { critical: { min: 40, max: 80 }, warning: { min: 30, max: 90 }, unit: "%" },
      light_level: { critical: { min: 200, max: 800 }, warning: { min: 100, max: 1000 }, unit: "lux" },
    };
    return thresholds[type] || {};
  };

  const getStatusColor = (value, thresholds) => {
    if (!thresholds.critical) return "green";
    if (value < thresholds.critical.min || value > thresholds.critical.max) return "red";
    if (value < thresholds.warning.min || value > thresholds.warning.max) return "orange";
    return "green";
  };

  const getStatusLabel = (value, thresholds) => {
    if (!thresholds.critical) return "OK";
    if (value < thresholds.critical.min || value > thresholds.critical.max) return "🔴 Critical";
    if (value < thresholds.warning.min || value > thresholds.warning.max) return "🟠 Warning";
    return "🟢 OK";
  };

  return (
    <div className="iot-container">
      <div className="iot-header">
        <h1>📡 IoT Sensor Network</h1>
        <p>Real-time monitoring and management of connected sensors</p>
      </div>

      <div className="iot-tabs">
        <button
          className={`iot-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`iot-tab ${activeTab === "sensors" ? "active" : ""}`}
          onClick={() => setActiveTab("sensors")}
        >
          Sensors ({sensors.length})
        </button>
        <button
          className={`iot-tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Sensor
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="iot-overview">
          <div className="health-grid">
            <div className="health-card">
              <div className="health-value">{health.active || 0}</div>
              <div className="health-label">Active Sensors</div>
              <div className="health-icon">✅</div>
            </div>
            <div className="health-card">
              <div className="health-value">{health.inactive || 0}</div>
              <div className="health-label">Inactive</div>
              <div className="health-icon">⏸️</div>
            </div>
            <div className="health-card">
              <div className="health-value">{health.stale || 0}</div>
              <div className="health-label">Stale (&gt;1h)</div>
              <div className="health-icon">⚠️</div>
            </div>
            <div className="health-card">
              <div className="health-value">{sensors.length}</div>
              <div className="health-label">Total Registered</div>
              <div className="health-icon">📡</div>
            </div>
          </div>

          <div className="recent-readings">
            <h3>Recent Readings</h3>
            {sensors.length > 0 ? (
              <div className="readings-list">
                {sensors.slice(0, 5).map((sensor) => (
                  <div key={sensor.id} className="reading-item">
                    <div className="reading-icon">{getSensorIcon(sensor.type)}</div>
                    <div className="reading-info">
                      <div className="reading-name">{sensor.name}</div>
                      <div className="reading-type">{sensor.type}</div>
                    </div>
                    <div className="reading-status">
                      {sensor.lastReading
                        ? `${sensor.lastReading} ${getSensorThresholds(sensor.type).unit || ""}`
                        : "No data"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No sensors registered yet</p>
            )}
          </div>
        </div>
      )}

      {/* Sensors Tab */}
      {activeTab === "sensors" && (
        <div className="iot-sensors">
          {sensors.length > 0 ? (
            <div className="sensors-grid">
              {sensors.map((sensor) => {
                const thresholds = getSensorThresholds(sensor.type);
                const value = sensor.lastReading;
                return (
                  <div key={sensor.id} className="sensor-card">
                    <div className="sensor-header">
                      <span className="sensor-icon">{getSensorIcon(sensor.type)}</span>
                      <span className="sensor-status">{sensor.status === "active" ? "🟢" : "🔴"}</span>
                    </div>
                    <h3>{sensor.name}</h3>
                    <p className="sensor-type">{sensor.type}</p>
                    <p className="sensor-location">📍 {sensor.location}</p>

                    <div className="sensor-readings">
                      {value ? (
                        <>
                          <div className="reading-value">
                            {value} {thresholds.unit}
                          </div>
                          <div className={`reading-status status-${getStatusColor(value, thresholds)}`}>
                            {getStatusLabel(value, thresholds)}
                          </div>
                          <div className="reading-range">
                            Range: {thresholds.critical?.min || "N/A"} - {thresholds.critical?.max || "N/A"} {thresholds.unit}
                          </div>
                        </>
                      ) : (
                        <div className="no-reading">No reading yet</div>
                      )}
                    </div>

                    <div className="sensor-input">
                      <input
                        type="number"
                        placeholder="Enter reading"
                        step="0.1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSubmitReading(sensor.id, parseFloat(e.target.value));
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          handleSubmitReading(sensor.id, parseFloat(input.value));
                          input.value = "";
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-full">
              <div className="empty-icon">📡</div>
              <h2>No sensors registered</h2>
              <p>Add sensors from the "Add Sensor" tab to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Add Sensor Tab */}
      {activeTab === "add" && (
        <div className="iot-add-sensor">
          <div className="add-sensor-form">
            <h2>Register New Sensor</h2>

            <div className="form-group">
              <label>Sensor Name *</label>
              <input
                type="text"
                placeholder="e.g., Main Tank pH Monitor"
                value={newSensor.name}
                onChange={(e) => setNewSensor({ ...newSensor, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Sensor Type *</label>
              <select
                value={newSensor.type}
                onChange={(e) => setNewSensor({ ...newSensor, type: e.target.value })}
              >
                <option value="water_ph">Water pH</option>
                <option value="water_temp">Water Temperature</option>
                <option value="water_do">Water Dissolved Oxygen</option>
                <option value="soil_moisture">Soil Moisture</option>
                <option value="soil_temp">Soil Temperature</option>
                <option value="air_temp">Air Temperature</option>
                <option value="air_humidity">Air Humidity</option>
                <option value="light_level">Light Level</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                placeholder="e.g., Aquaponics System A, Zone 1"
                value={newSensor.location}
                onChange={(e) => setNewSensor({ ...newSensor, location: e.target.value })}
              />
            </div>

            <div className="form-group sensor-info">
              <h3>Sensor Info</h3>
              {newSensor.type && (
                <div className="info-box">
                  <p>
                    <strong>Type:</strong> {newSensor.type}
                  </p>
                  <p>
                    <strong>Icon:</strong> {getSensorIcon(newSensor.type)}
                  </p>
                  <p>
                    <strong>Critical Range:</strong> {getSensorThresholds(newSensor.type).critical?.min || "N/A"} -{" "}
                    {getSensorThresholds(newSensor.type).critical?.max || "N/A"}{" "}
                    {getSensorThresholds(newSensor.type).unit}
                  </p>
                </div>
              )}
            </div>

            <button className="btn-primary" onClick={handleAddSensor}>
              Register Sensor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IoT;
