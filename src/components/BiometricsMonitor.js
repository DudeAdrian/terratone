import React, { useState, useEffect } from 'react';
import biometricsService from '../services/BiometricsService';

const BiometricsMonitor = ({ compact = false, onAlert }) => {
  const [readings, setReadings] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [wellness, setWellness] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    // Subscribe to biometrics updates
    const unsubscribe = biometricsService.subscribe((event) => {
      if (event.type === 'READING') {
        setReadings(event.readings);
        setAnalysis(event.analysis);
        setWellness(event.wellness);

        // Trigger alerts if provided
        if (onAlert && event.analysis.alerts.length > 0) {
          event.analysis.alerts.forEach(alert => onAlert(alert));
        }
      } else if (event.type === 'STATUS') {
        setIsMonitoring(event.status === 'monitoring');
      }
    });

    // Load initial data
    const current = biometricsService.getCurrentReadings();
    if (current.timestamp) {
      setReadings(current);
    }

    // Load trends
    const trendsData = biometricsService.getTrends(24);
    setTrends(trendsData);

    return unsubscribe;
  }, [onAlert]);

  const handleTakeReading = async () => {
    await biometricsService.takeSingleReading();
    const trendsData = biometricsService.getTrends(24);
    setTrends(trendsData);
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      biometricsService.stopMonitoring();
    } else {
      biometricsService.startMonitoring(5); // 5 minute intervals
    }
  };

  const getVitalStatus = (metric, value) => {
    const baselines = biometricsService.baselines;
    
    if (metric === 'heartRate') {
      if (value < baselines.heartRate.min || value > baselines.heartRate.max) return 'warning';
      if (Math.abs(value - baselines.heartRate.optimal) < 5) return 'excellent';
      return 'normal';
    }
    
    if (metric === 'bloodPressure') {
      const { systolic, diastolic } = value;
      if (systolic > 130 || diastolic > 85) return 'warning';
      if (systolic < 90 || diastolic < 60) return 'warning';
      return 'normal';
    }
    
    if (metric === 'temperature') {
      if (value > 37.5 || value < 36.0) return 'warning';
      if (Math.abs(value - baselines.temperature.optimal) < 0.3) return 'excellent';
      return 'normal';
    }
    
    if (metric === 'spO2') {
      if (value < 95) return 'warning';
      if (value >= 98) return 'excellent';
      return 'normal';
    }
    
    if (metric === 'stress') {
      if (value > 60) return 'warning';
      if (value < 30) return 'excellent';
      return 'normal';
    }
    
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'normal': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 border-green-500/40';
      case 'normal': return 'bg-blue-500/20 border-blue-500/40';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/40';
      case 'critical': return 'bg-red-500/20 border-red-500/40';
      default: return 'bg-gray-500/20 border-gray-500/40';
    }
  };

  if (compact && readings) {
    return (
      <div className="glassmorphic p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">🫀 Vitals</h3>
          <div className={`px-3 py-1 rounded-full text-sm ${getStatusBg(getVitalStatus('stress', readings.stressIndex))}`}>
            Wellness: {wellness}%
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{readings.heartRate}</div>
            <div className="text-xs text-gray-400">BPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{readings.spO2}%</div>
            <div className="text-xs text-gray-400">SpO₂</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphic p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🫀 Biometric Monitor
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {readings?.timestamp ? `Last reading: ${new Date(readings.timestamp).toLocaleTimeString()}` : 'No readings yet'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleTakeReading}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:opacity-90 transition-opacity"
          >
            📊 Take Reading
          </button>
          <button
            onClick={toggleMonitoring}
            className={`px-4 py-2 rounded-lg transition-opacity ${
              isMonitoring 
                ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600'
            } hover:opacity-90`}
          >
            {isMonitoring ? '⏸️ Stop' : '▶️ Start'} Monitoring
          </button>
        </div>
      </div>

      {/* Wellness Score */}
      {wellness !== null && (
        <div className={`p-4 rounded-xl mb-6 border ${getStatusBg(getVitalStatus('stress', readings.stressIndex))}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300 mb-1">Overall Wellness Score</div>
              <div className="text-4xl font-bold">{wellness}%</div>
            </div>
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.2"/>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8"
                  strokeDasharray={`${wellness * 2.51}, 251`}
                  className={getStatusColor(getVitalStatus('stress', readings?.stressIndex || 0))}
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Vital Signs Grid */}
      {readings && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Heart Rate */}
          <div className={`p-4 rounded-xl border ${getStatusBg(getVitalStatus('heartRate', readings.heartRate))}`}>
            <div className="text-sm text-gray-300 mb-2">❤️ Heart Rate</div>
            <div className="text-3xl font-bold mb-1">{readings.heartRate}</div>
            <div className="text-xs text-gray-400">BPM</div>
            {trends && (
              <div className="text-xs text-gray-500 mt-2">
                24h avg: {trends.heartRate.average} BPM
              </div>
            )}
          </div>

          {/* Blood Pressure */}
          <div className={`p-4 rounded-xl border ${getStatusBg(getVitalStatus('bloodPressure', readings.bloodPressure))}`}>
            <div className="text-sm text-gray-300 mb-2">🩺 Blood Pressure</div>
            <div className="text-3xl font-bold mb-1">
              {readings.bloodPressure.systolic}/{readings.bloodPressure.diastolic}
            </div>
            <div className="text-xs text-gray-400">mmHg</div>
            {trends && (
              <div className="text-xs text-gray-500 mt-2">
                24h avg: {trends.bloodPressure.systolic}/{trends.bloodPressure.diastolic}
              </div>
            )}
          </div>

          {/* Temperature */}
          <div className={`p-4 rounded-xl border ${getStatusBg(getVitalStatus('temperature', readings.temperature))}`}>
            <div className="text-sm text-gray-300 mb-2">🌡️ Temperature</div>
            <div className="text-3xl font-bold mb-1">{readings.temperature}°</div>
            <div className="text-xs text-gray-400">Celsius</div>
            {trends && (
              <div className="text-xs text-gray-500 mt-2">
                24h avg: {trends.temperature}°C
              </div>
            )}
          </div>

          {/* SpO2 */}
          <div className={`p-4 rounded-xl border ${getStatusBg(getVitalStatus('spO2', readings.spO2))}`}>
            <div className="text-sm text-gray-300 mb-2">🫁 Blood Oxygen</div>
            <div className="text-3xl font-bold mb-1">{readings.spO2}%</div>
            <div className="text-xs text-gray-400">SpO₂</div>
            {trends && (
              <div className="text-xs text-gray-500 mt-2">
                24h avg: {trends.spO2}%
              </div>
            )}
          </div>

          {/* Respiratory Rate */}
          <div className={`p-4 rounded-xl border bg-blue-500/20 border-blue-500/40`}>
            <div className="text-sm text-gray-300 mb-2">💨 Respiratory Rate</div>
            <div className="text-3xl font-bold mb-1">{readings.respiratoryRate}</div>
            <div className="text-xs text-gray-400">breaths/min</div>
          </div>

          {/* Stress Index */}
          <div className={`p-4 rounded-xl border ${getStatusBg(getVitalStatus('stress', readings.stressIndex))}`}>
            <div className="text-sm text-gray-300 mb-2">🧠 Stress Index</div>
            <div className="text-3xl font-bold mb-1">{readings.stressIndex}</div>
            <div className="text-xs text-gray-400">0-100 scale</div>
            {trends && (
              <div className="text-xs text-gray-500 mt-2">
                24h avg: {trends.stressIndex}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts */}
      {analysis?.alerts && analysis.alerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">⚠️ Alerts</h3>
          <div className="space-y-2">
            {analysis.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'critical' 
                    ? 'bg-red-500/20 border-red-500/40' 
                    : 'bg-yellow-500/20 border-yellow-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{alert.message}</div>
                  <div className="text-sm">{alert.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">💡 Wellness Recommendations</h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="glassmorphic-light p-4 rounded-lg">
                <div className="font-semibold mb-1">{rec.title}</div>
                <div className="text-sm text-gray-300 mb-2">{rec.message}</div>
                <div className="flex flex-wrap gap-2">
                  {rec.herbs.map((herb, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-xs"
                    >
                      🌿 {herb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!readings && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-lg mb-2">No readings yet</div>
          <div className="text-sm">Click "Take Reading" to start monitoring your vitals</div>
        </div>
      )}
    </div>
  );
};

export default BiometricsMonitor;
