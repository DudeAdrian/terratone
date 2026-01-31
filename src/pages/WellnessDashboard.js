import React, { useState, useEffect } from 'react';
import BiometricsMonitor from '../components/BiometricsMonitor';
import VoiceInterface from '../components/VoiceInterface';
import biometricsService from '../services/BiometricsService';
import voiceRecognitionService from '../services/VoiceRecognitionService';
import WellnessIntakeService from '../services/WellnessIntakeService';
import { useNavigate } from 'react-router-dom';

const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([]);
  const [voiceCommand, setVoiceCommand] = useState(null);
  const [intakeExists, setIntakeExists] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    WellnessIntakeService.getIntakeStatus()
      .then((status) => { if (mounted) setIntakeExists(status.exists); })
      .catch(() => mounted && setIntakeExists(false));
    return () => { mounted = false; };
  }, []);

  const handleAlert = (alert) => {
    setAlerts(prev => [...prev, { ...alert, timestamp: new Date().toISOString() }].slice(-10));
  };

  const handleVoiceCommand = (command) => {
    setVoiceCommand(command);
    
    // Handle specific voice commands
    switch (command.action) {
      case 'CHECK_VITALS':
        biometricsService.takeSingleReading();
        setActiveTab('biometrics');
        break;
      
      case 'HERBAL_CONSULTATION':
        navigate('/herbal-library');
        break;
      
      case 'CREATE_JOURNAL':
        navigate('/herbal-journal');
        break;
      
      case 'WELLNESS_SCORE':
        setActiveTab('overview');
        break;
      
      default:
        break;
    }

    // Clear after 5 seconds
    setTimeout(() => setVoiceCommand(null), 5000);
  };

  const getOverallStatus = () => {
    const readings = biometricsService.getCurrentReadings();
    const voiceVitals = voiceRecognitionService.getVoiceVitals();
    
    if (!readings.timestamp) return 'No Data';
    
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
    const warningAlerts = alerts.filter(a => a.severity === 'warning').length;
    
    if (criticalAlerts > 0) return 'Critical';
    if (warningAlerts > 0) return 'Warning';
    if (voiceVitals.stressLevel > 60) return 'Elevated Stress';
    
    return 'Optimal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'Elevated Stress': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
      case 'Warning': return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
      case 'Critical': return 'bg-red-500/20 border-red-500/40 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            🧘‍♀️ Wellness Intelligence Dashboard
          </h1>
          <p className="text-gray-300">
            Real-time biometric monitoring with voice-activated wellness assistant
          </p>
        </div>

        {/* Overall Status Banner */}
        <div className={`glassmorphic p-6 rounded-2xl mb-6 border ${getStatusColor(getOverallStatus())}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300 mb-1">Overall Wellness Status</div>
              <div className="text-3xl font-bold">{getOverallStatus()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300 mb-1">Active Alerts</div>
              <div className="text-3xl font-bold">
                {alerts.filter(a => a.severity === 'critical' || a.severity === 'warning').length}
              </div>
            </div>
          </div>
          {!intakeExists && (
            <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-100 text-sm flex items-center justify-between gap-3">
              <span>Complete your wellness intake to personalize insights.</span>
              <button
                onClick={() => navigate('/wellness-intake')}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90"
              >
                Start Intake
              </button>
            </div>
          )}
        </div>

        {/* Voice Command Feedback */}
        {voiceCommand && (
          <div className="glassmorphic p-4 rounded-xl mb-6 border border-purple-500/40 bg-purple-500/10 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎤</span>
              <div>
                <div className="font-semibold">{voiceCommand.action?.replace(/_/g, ' ')}</div>
                <div className="text-sm text-gray-300">{voiceCommand.message}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'biometrics', label: '🫀 Biometrics', icon: '🫀' },
            { id: 'voice', label: '🎤 Voice Assistant', icon: '🎤' },
            { id: 'alerts', label: '⚠️ Alerts', icon: '⚠️' },
            { id: 'trends', label: '📈 Trends', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'glassmorphic hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <BiometricsMonitor compact={false} onAlert={handleAlert} />
              <VoiceInterface compact={false} onCommand={handleVoiceCommand} />
            </div>
          )}

          {activeTab === 'biometrics' && (
            <BiometricsMonitor compact={false} onAlert={handleAlert} />
          )}

          {activeTab === 'voice' && (
            <VoiceInterface compact={false} onCommand={handleVoiceCommand} />
          )}

          {activeTab === 'alerts' && (
            <div className="glassmorphic p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">⚠️ Alert History</h2>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.reverse().map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        alert.severity === 'critical'
                          ? 'bg-red-500/20 border-red-500/40'
                          : alert.severity === 'warning'
                          ? 'bg-yellow-500/20 border-yellow-500/40'
                          : 'bg-blue-500/20 border-blue-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{alert.message}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">
                        {alert.metric}: {alert.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-lg">No alerts</div>
                  <div className="text-sm">All vitals within normal range</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="glassmorphic p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">📈 24-Hour Trends</h2>
              
              {(() => {
                const trends = biometricsService.getTrends(24);
                const history = biometricsService.getHistory(20);
                
                if (!trends || history.length < 2) {
                  return (
                    <div className="text-center py-12 text-gray-400">
                      <div className="text-6xl mb-4">📊</div>
                      <div className="text-lg">Not enough data</div>
                      <div className="text-sm">Take more readings to see trends</div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* Trend Summary */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="glassmorphic-light p-4 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Avg Heart Rate</div>
                        <div className="text-2xl font-bold">{trends.heartRate.average}</div>
                        <div className="text-xs text-gray-500">
                          Range: {trends.heartRate.min}-{trends.heartRate.max}
                        </div>
                      </div>
                      
                      <div className="glassmorphic-light p-4 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Avg BP</div>
                        <div className="text-2xl font-bold">
                          {trends.bloodPressure.systolic}/{trends.bloodPressure.diastolic}
                        </div>
                        <div className="text-xs text-gray-500">mmHg</div>
                      </div>
                      
                      <div className="glassmorphic-light p-4 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Avg Temp</div>
                        <div className="text-2xl font-bold">{trends.temperature}°</div>
                        <div className="text-xs text-gray-500">Celsius</div>
                      </div>
                      
                      <div className="glassmorphic-light p-4 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Avg Stress</div>
                        <div className="text-2xl font-bold">{trends.stressIndex}</div>
                        <div className="text-xs text-gray-500">0-100 scale</div>
                      </div>
                    </div>

                    {/* Recent Readings Timeline */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recent Readings</h3>
                      <div className="space-y-2">
                        {history.reverse().map((reading, index) => (
                          <div key={index} className="glassmorphic-light p-3 rounded-lg flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              {new Date(reading.timestamp).toLocaleString()}
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span>❤️ {reading.heartRate}</span>
                              <span>🩺 {reading.bloodPressure.systolic}/{reading.bloodPressure.diastolic}</span>
                              <span>🌡️ {reading.temperature}°</span>
                              <span>🫁 {reading.spO2}%</span>
                              <span>🧠 {reading.stressIndex}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/herbal-library')}
            className="glassmorphic p-6 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <div className="text-3xl mb-2">🌿</div>
            <div className="font-semibold">Herbal Library</div>
            <div className="text-xs text-gray-400">Browse remedies</div>
          </button>

          <button
            onClick={() => navigate('/herbal-journal')}
            className="glassmorphic p-6 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <div className="text-3xl mb-2">📔</div>
            <div className="font-semibold">Journal</div>
            <div className="text-xs text-gray-400">Track wellness</div>
          </button>

          <button
            onClick={() => navigate('/ai-chat')}
            className="glassmorphic p-6 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <div className="text-3xl mb-2">🤖</div>
            <div className="font-semibold">AI Companion</div>
            <div className="text-xs text-gray-400">Health guidance</div>
          </button>

          <button
            onClick={() => {
              const data = biometricsService.exportData();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `wellness-data-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="glassmorphic p-6 rounded-xl hover:bg-white/10 transition-all text-left"
          >
            <div className="text-3xl mb-2">💾</div>
            <div className="font-semibold">Export Data</div>
            <div className="text-xs text-gray-400">Download history</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;
