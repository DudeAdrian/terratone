import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { glassPanel } from "../../theme/glassTokens";

export default function WaterLeaks() {
  const [leakEvents, setLeakEvents] = useState([]);
  const [sensorHealth, setSensorHealth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const waterService = sofieCore.getService("water");
      if (waterService) {
        if (waterService.getLeakEvents) {
          setLeakEvents(waterService.getLeakEvents());
        }
        if (waterService.getSensorHealth) {
          setSensorHealth(waterService.getSensorHealth());
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading leak detection data:", error);
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      investigating: "#f59e0b",
      resolved: "#4ade80",
      active: "#ef4444",
    };
    return colors[status] || "#9ca3af";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div style={glassPanel} className="text-white">Loading leak detection data...</div>
      </div>
    );
  }

  const activeLeaks = leakEvents.filter(e => !e.resolvedAt).length;
  const avgConfidence = leakEvents.length > 0 
    ? Math.round((leakEvents.reduce((sum, e) => sum + e.confidence, 0) / leakEvents.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      {/* Header */}
      <div style={{ 
        ...glassPanel, 
        background: 'linear-gradient(135deg, #46c6ff22, rgba(210, 175, 135, 0.12))',
        border: '1px solid #46c6ff66',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px #46c6ff55, inset 0 0 16px rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#46c6ff' }}>
          🔍 Leak Detection Network
        </h1>
        <p className="text-gray-300">Smart IoT sensors monitoring pressure and flow for early leak detection</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          style={{
            ...glassPanel,
            background: activeLeaks > 0 
              ? 'linear-gradient(135deg, #ef444418, rgba(210, 175, 135, 0.10))'
              : 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: activeLeaks > 0 ? '1px solid #ef444455' : '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Active Leaks</p>
          <p className="text-4xl font-bold" style={{ color: activeLeaks > 0 ? '#ef4444' : '#4ade80' }}>
            {activeLeaks}
          </p>
          <p className="text-xs text-gray-500 mt-2">{activeLeaks > 0 ? "Requires attention" : "System healthy"}</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
            border: '1px solid #46c6ff55',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Detection Confidence</p>
          <p className="text-4xl font-bold text-white">{avgConfidence}%</p>
          <p className="text-xs text-gray-500 mt-2">Average accuracy</p>
        </div>

        <div
          style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, #4ade8018, rgba(210, 175, 135, 0.10))',
            border: '1px solid #4ade8055',
          }}
        >
          <p className="text-sm text-gray-400 mb-2">Sensors Online</p>
          <p className="text-4xl font-bold" style={{ color: '#4ade80' }}>{sensorHealth.length}</p>
          <p className="text-xs text-gray-500 mt-2">Active monitoring</p>
        </div>
      </div>

      {/* Leak Events */}
      <div
        className="mb-6"
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Detected Leak Events
        </h2>
        <div className="space-y-4">
          {leakEvents.map((leak) => (
            <div
              key={leak.id}
              className="bg-blue-500/10 rounded-lg p-4 border"
              style={{ borderColor: `${getStatusColor(leak.status)}40` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{leak.zone}</h3>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${getStatusColor(leak.status)}20`,
                        color: getStatusColor(leak.status),
                        border: `1px solid ${getStatusColor(leak.status)}40`
                      }}
                    >
                      {leak.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Sensor: {leak.sensorId}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: '#ef4444' }}>
                    {Math.round(leak.confidence * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">Confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Pressure Drop</p>
                  <p className="text-lg font-semibold text-white">{leak.pressureDrop} bar</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Flow Delta</p>
                  <p className="text-lg font-semibold text-white">{leak.flowDelta} L/min</p>
                </div>
              </div>

              <div className="border-t border-gray-600/30 pt-3">
                <p className="text-sm text-gray-400 mb-1">Action: {leak.actionTaken}</p>
                <p className="text-xs text-gray-500">
                  Started: {new Date(leak.startedAt).toLocaleString()}
                </p>
                {leak.resolvedAt && (
                  <p className="text-xs text-green-400">
                    Resolved: {new Date(leak.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Health */}
      <div
        style={{
          ...glassPanel,
          background: 'linear-gradient(135deg, #46c6ff18, rgba(210, 175, 135, 0.10))',
          border: '1px solid #46c6ff55',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#46c6ff' }}>
          Sensor Network Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensorHealth.map((sensor) => (
            <div key={sensor.sensorId} className="bg-blue-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">{sensor.sensorId}</h3>
                <span className="text-xs text-gray-400">{sensor.location}</span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Battery</span>
                    <span className="text-white">{sensor.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${sensor.battery}%`,
                        backgroundColor: sensor.battery > 50 ? '#4ade80' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Signal</span>
                    <span className="text-white">{sensor.signal}%</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${sensor.signal}%`,
                        backgroundColor: '#60a5fa'
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Last seen: {new Date(sensor.lastSeen).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
