import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";
import { createBackHandler } from "../../utils/navigation";
import { useWaterData } from "../../hooks/useApi";

export default function WaterLeaks() {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [leakEvents, setLeakEvents] = useState([]);
  const [sensorHealth, setSensorHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const waterData = useWaterData("default");

  useEffect(() => {
    const loadData = () => {
      try {
        if (waterData.leaks.data) {
          const payload = waterData.leaks.data;
          const events = Array.isArray(payload)
            ? payload
            : payload.events || payload.leaks || [];
          const sensors = Array.isArray(payload)
            ? []
            : payload.sensors || payload.sensorHealth || [];

          setLeakEvents(events);
          if (sensors.length) {
            setSensorHealth(sensors);
          }
          setError(null);
        } else if (!waterData.isLoading) {
          const waterService = sofieCore.getService("water");
          if (waterService) {
            if (waterService.getLeakEvents) {
              setLeakEvents(waterService.getLeakEvents());
            }
            if (waterService.getSensorHealth) {
              setSensorHealth(waterService.getSensorHealth());
            }
          }
        }

        setLoading(waterData.isLoading);

        if (waterData.leaks.error) {
          setError(waterData.leaks.error.message || "Failed to load leak detection data");
        }
      } catch (err) {
        console.error("Error loading leak detection data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [waterData.leaks.data, waterData.isLoading, waterData.leaks.error]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full mr-3"></div>
            Loading leak detection data...
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "red", secondary: "orange" }}>
          <div className="p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => waterData.leaks.refetch?.() || window.location.reload()}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const activeLeaks = leakEvents.filter(e => !e.resolvedAt).length;
  const avgConfidence = leakEvents.length > 0 
    ? Math.round((leakEvents.reduce((sum, e) => sum + e.confidence, 0) / leakEvents.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#06b6d4'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              🔍 Leak Detection Network
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Smart IoT sensors monitoring pressure and flow for early leak detection
            </p>
          </div>
        </GlassSection>

        {/* Alert Summary */}
        <GlassGrid cols={1} colsMd={3} gap={5}>
          <GlassCard colors={{ primary: activeLeaks > 0 ? "red" : "emerald", secondary: activeLeaks > 0 ? "rose" : "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Active Leaks</div>
              <div className={`text-5xl font-bold ${activeLeaks > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {activeLeaks}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                {activeLeaks > 0 ? "Requires attention" : "System healthy"}
              </p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Detection Confidence</div>
              <div className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">{avgConfidence}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Average accuracy</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Sensors Online</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{sensorHealth.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Active monitoring</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Leak Events */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Detected Leak Events
            </h2>
            <div className="space-y-4">
              {leakEvents.map((leak) => (
                <div
                  key={leak.id}
                  className="bg-cyan-500/10 dark:bg-cyan-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{leak.zone}</h3>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sensor: {leak.sensorId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {Math.round(leak.confidence * 100)}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Confidence</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pressure Drop</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{leak.pressureDrop} bar</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Flow Delta</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{leak.flowDelta} L/min</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Action: {leak.actionTaken}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Started: {new Date(leak.startedAt).toLocaleString()}
                    </p>
                    {leak.resolvedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Resolved: {new Date(leak.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassSection>

        {/* Sensor Health */}
        <GlassSection colors={{ primary: "cyan", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Sensor Network Health
            </h2>
            <GlassGrid cols={1} colsMd={2} gap={4}>
              {sensorHealth.map((sensor) => (
                <GlassCard key={sensor.sensorId}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">{sensor.sensorId}</h3>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{sensor.location}</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Battery</span>
                        <span className="text-gray-900 dark:text-white">{sensor.battery}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Signal</span>
                        <span className="text-gray-900 dark:text-white">{sensor.signal}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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

                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                    Last seen: {new Date(sensor.lastSeen).toLocaleString()}
                  </p>
                </GlassCard>
              ))}
            </GlassGrid>
          </div>
        </GlassSection>

      </div>
    </div>
  );
}
