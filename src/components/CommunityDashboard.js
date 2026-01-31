import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MetricsCard from './MetricsCard';
import AlertPanel from './AlertPanel';
import ResourceWidget from './ResourceWidget';
import '../styles/CommunityDashboard.css';

/**
 * CommunityDashboard
 * Personalized dashboard for a single community
 * Shows real-time metrics, active alerts, resource status, recent reports
 * Accessible via /community/:slug (e.g., /community/nairobi-hub)
 * 
 * Role-based views:
 * - Community Manager: Can edit metrics, submit reports, view analytics
 * - Admin: Can view all data, create alerts, manage resources
 * - Leader: Read-only access to all communities' data
 */
const CommunityDashboard = () => {
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('manager'); // manager, admin, leader

  useEffect(() => {
    fetchCommunityData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCommunityData, 30000);
    return () => clearInterval(interval);
  }, [slug]);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      // Replace with your backend URL
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${apiUrl}/communities/${slug}`);
      if (!response.ok) throw new Error('Community not found');
      
      const data = await response.json();
      setCommunity(data);
      setMetrics(data.metrics?.[0] || null); // Latest metrics
      setAlerts(data.alerts || []);
      setReports(data.reports || []);
      setTransactions(data.transactions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMetrics = async (newMetrics) => {
    try {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/communities/${slug}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMetrics),
      });
      
      if (!response.ok) throw new Error('Failed to submit metrics');
      fetchCommunityData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAlertAcknowledge = async (alertId) => {
    try {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/communities/${slug}/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'acknowledged' }),
      });
      
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      fetchCommunityData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading community data...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!community) return <div className="dashboard-error">Community not found</div>;

  const healthScore = metrics?.healthScore || 0;
  const energyScore = metrics?.energyScore || 0;
  const foodScore = metrics?.foodScore || 0;
  const waterScore = metrics?.waterScore || 0;
  const tradeScore = metrics?.tradeScore || 0;
  const governanceScore = metrics?.governanceScore || 0;

  const averageHealth = (healthScore + energyScore + foodScore + waterScore + tradeScore + governanceScore) / 6;

  return (
    <div className="community-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{community.name}</h1>
          <p className="location">{community.country}, {community.continent}</p>
          <div className="community-info">
            <span className="badge">Population: {(community.population / 1000).toFixed(0)}K</span>
            <span className="badge">Status: {community.status}</span>
            <span className="badge role-badge">Your Role: {userRole.toUpperCase()}</span>
          </div>
        </div>
        <div className="overall-health">
          <div className="health-circle">
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="55" fill="none" stroke="#e0e0e0" strokeWidth="8" />
              <circle 
                cx="60" 
                cy="60" 
                r="55" 
                fill="none" 
                stroke={averageHealth > 70 ? '#10b981' : averageHealth > 40 ? '#f59e0b' : '#ef4444'} 
                strokeWidth="8"
                strokeDasharray={`${averageHealth * 3.456} 345.6`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
              />
            </svg>
            <div className="health-text">
              <div className="health-score">{Math.round(averageHealth)}%</div>
              <div className="health-label">Overall Health</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="critical-alerts-banner">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <strong>{alerts.length} Active Alert{alerts.length !== 1 ? 's' : ''}</strong>
            <p>{alerts.filter(a => a.severity === 'CRITICAL').length} Critical • {alerts.filter(a => a.severity === 'WARNING').length} Warnings</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          📈 Metrics
        </button>
        <button 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts ({alerts.length})
        </button>
        <button 
          className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          🔄 Resources
        </button>
        <button 
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports
        </button>
      </div>

      {/* Content Sections */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <h2>Community Overview</h2>
            <div className="metrics-grid">
              <MetricsCard 
                title="Health" 
                score={healthScore} 
                icon="🏥"
                subtitle="Disease control, nutrition, healthcare access"
              />
              <MetricsCard 
                title="Energy" 
                score={energyScore} 
                icon="⚡"
                subtitle="Production vs consumption balance"
              />
              <MetricsCard 
                title="Food Security" 
                score={foodScore} 
                icon="🌾"
                subtitle="Agricultural output & distribution"
              />
              <MetricsCard 
                title="Water Availability" 
                score={waterScore} 
                icon="💧"
                subtitle="Per-capita access & quality"
              />
              <MetricsCard 
                title="Trade & Economy" 
                score={tradeScore} 
                icon="💰"
                subtitle="Economic stability & exchange"
              />
              <MetricsCard 
                title="Governance" 
                score={governanceScore} 
                icon="🏛️"
                subtitle="Decision-making & coordination"
              />
            </div>

            {/* Recent Reports Summary */}
            <div className="recent-reports">
              <h3>Recent Data Submissions</h3>
              {reports.length === 0 ? (
                <p className="empty-state">No reports yet. Start reporting community data to track progress.</p>
              ) : (
                <div className="reports-list">
                  {reports.slice(0, 3).map(report => (
                    <div key={report.id} className="report-item">
                      <div className="report-header">
                        <span className="report-type">{report.reportType === 'human' ? '👤' : '🤖'} {report.reportType.toUpperCase()}</span>
                        <span className="report-date">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="report-summary">{report.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="tab-pane">
            <h2>Detailed Metrics & Trends</h2>
            {metrics ? (
              <div className="metrics-detail">
                <div className="metric-row">
                  <label>Health Score</label>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${healthScore}%` }}></div>
                  </div>
                  <span>{healthScore}/100</span>
                </div>
                <div className="metric-row">
                  <label>Energy Score</label>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${energyScore}%` }}></div>
                  </div>
                  <span>{energyScore}/100</span>
                </div>
                <div className="metric-row">
                  <label>Food Security</label>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${foodScore}%` }}></div>
                  </div>
                  <span>{foodScore}/100</span>
                </div>
                <div className="metric-row">
                  <label>Water Availability</label>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${waterScore}%` }}></div>
                  </div>
                  <span>{waterScore}/100</span>
                </div>
                <div className="metric-row">
                  <label>Trade & Economy</label>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${tradeScore}%` }}></div>
                  </div>
                  <span>{tradeScore}/100</span>
                </div>
                <div className="metric-row">
                  <label>Governance</label>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${governanceScore}%` }}></div>
                  </div>
                  <span>{governanceScore}/100</span>
                </div>

                {userRole === 'manager' && (
                  <div className="submit-section">
                    <button className="btn btn-primary" onClick={() => setActiveTab('reports')}>
                      Submit New Report
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="empty-state">No metrics recorded yet.</p>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="tab-pane">
            <h2>Active Alerts & Resource Needs</h2>
            {alerts.length === 0 ? (
              <p className="empty-state">✓ No active alerts. Your community is stable.</p>
            ) : (
              <div className="alerts-list">
                {alerts.map(alert => (
                  <AlertPanel 
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={() => handleAlertAcknowledge(alert.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="tab-pane">
            <h2>Resource Availability & Transfers</h2>
            {transactions.length === 0 ? (
              <p className="empty-state">No active resource transfers.</p>
            ) : (
              <div className="transactions-list">
                {transactions.map(tx => (
                  <ResourceWidget 
                    key={tx.id}
                    transaction={tx}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-pane">
            <h2>Community Reports</h2>
            {userRole === 'manager' && (
              <button className="btn btn-primary" onClick={() => alert('Data submission form - Phase 3')}>
                + Submit New Report
              </button>
            )}
            {reports.length === 0 ? (
              <p className="empty-state">No reports submitted yet.</p>
            ) : (
              <div className="reports-grid">
                {reports.map(report => (
                  <div key={report.id} className="report-card">
                    <div className="report-card-header">
                      <h4>{report.title}</h4>
                      <span className={`report-badge ${report.reportType}`}>{report.reportType}</span>
                    </div>
                    <p>{report.summary}</p>
                    <div className="report-meta">
                      <small>{new Date(report.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="dashboard-footer">
        <p>Data auto-updates every 30 seconds. Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default CommunityDashboard;
