import React, { useState, useEffect } from 'react';
import MetricsCard from './MetricsCard';
import '../styles/GlobalAdminDashboard.css';

/**
 * GlobalAdminDashboard
 * High-level governance view for global leaders and administrators
 * Shows all 64 communities at a glance, resource flows, alert status, inefficiencies
 * 
 * Features:
 * - Global metrics across all communities
 * - Continental breakdown with drilling capability
 * - Alert heat map
 * - Resource flow visualization
 * - Comparative analytics
 * - Governance decision tracking
 */
const GlobalAdminDashboard = () => {
  const [communities, setCommunities] = useState([]);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [viewMode, setViewMode] = useState('global'); // global, continental, alerts, resources
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${apiUrl}/communities?limit=100`);
      if (!response.ok) throw new Error('Failed to fetch communities');
      
      const data = await response.json();
      setCommunities(data.communities || []);
      
      // Calculate global metrics
      if (data.communities) {
        calculateGlobalMetrics(data.communities);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateGlobalMetrics = (comms) => {
    const metrics = {
      totalCommunities: comms.length,
      activeCommunities: comms.filter(c => c.status === 'active').length,
      criticalAlerts: comms.reduce((sum, c) => sum + (c.alerts?.filter(a => a.severity === 'CRITICAL').length || 0), 0),
      averageHealth: 0,
      byContinent: {},
      healthPillars: {
        health: 0,
        energy: 0,
        food: 0,
        water: 0,
        trade: 0,
        governance: 0,
      },
    };

    // Continental breakdown
    comms.forEach(community => {
      const continent = community.continent;
      if (!metrics.byContinent[continent]) {
        metrics.byContinent[continent] = {
          count: 0,
          activeCount: 0,
          alerts: 0,
          averageHealth: 0,
        };
      }
      metrics.byContinent[continent].count++;
      if (community.status === 'active') {
        metrics.byContinent[continent].activeCount++;
      }
      metrics.byContinent[continent].alerts += community.alerts?.length || 0;
    });

    // Calculate averages
    if (comms.length > 0) {
      const healthScores = comms.flatMap(c => c.metrics?.map(m => m.healthScore) || []);
      const energyScores = comms.flatMap(c => c.metrics?.map(m => m.energyScore) || []);
      const foodScores = comms.flatMap(c => c.metrics?.map(m => m.foodScore) || []);
      const waterScores = comms.flatMap(c => c.metrics?.map(m => m.waterScore) || []);
      const tradeScores = comms.flatMap(c => c.metrics?.map(m => m.tradeScore) || []);
      const governanceScores = comms.flatMap(c => c.metrics?.map(m => m.governanceScore) || []);

      metrics.healthPillars.health = healthScores.length ? healthScores.reduce((a, b) => a + b) / healthScores.length : 0;
      metrics.healthPillars.energy = energyScores.length ? energyScores.reduce((a, b) => a + b) / energyScores.length : 0;
      metrics.healthPillars.food = foodScores.length ? foodScores.reduce((a, b) => a + b) / foodScores.length : 0;
      metrics.healthPillars.water = waterScores.length ? waterScores.reduce((a, b) => a + b) / waterScores.length : 0;
      metrics.healthPillars.trade = tradeScores.length ? tradeScores.reduce((a, b) => a + b) / tradeScores.length : 0;
      metrics.healthPillars.governance = governanceScores.length ? governanceScores.reduce((a, b) => a + b) / governanceScores.length : 0;

      const allScores = [...healthScores, ...energyScores, ...foodScores, ...waterScores, ...tradeScores, ...governanceScores];
      metrics.averageHealth = allScores.length ? allScores.reduce((a, b) => a + b) / allScores.length : 0;
    }

    setGlobalMetrics(metrics);
  };

  const getContinentColor = (continent) => {
    const colors = {
      'Africa': '#f59e0b',
      'Asia': '#3b82f6',
      'Europe': '#10b981',
      'North America': '#8b5cf6',
      'South America': '#ec4899',
      'Oceania': '#06b6d4',
    };
    return colors[continent] || '#6b7280';
  };

  const filteredCommunities = selectedContinent 
    ? communities.filter(c => c.continent === selectedContinent)
    : communities;

  if (loading) return <div className="global-dashboard-loading">Loading global system...</div>;
  if (error) return <div className="global-dashboard-error">Error: {error}</div>;

  return (
    <div className="global-admin-dashboard">
      {/* Header */}
      <div className="global-header">
        <h1>Global System Overview</h1>
        <p>Monitor all {globalMetrics?.totalCommunities || 0} communities across {Object.keys(globalMetrics?.byContinent || {}).length} continents</p>
      </div>

      {/* KPI Cards */}
      <div className="global-kpis">
        <div className="kpi-card">
          <div className="kpi-value">{globalMetrics?.activeCommunities || 0}</div>
          <div className="kpi-label">Active Communities</div>
        </div>
        <div className="kpi-card critical">
          <div className="kpi-value">{globalMetrics?.criticalAlerts || 0}</div>
          <div className="kpi-label">Critical Alerts</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{Math.round(globalMetrics?.averageHealth || 0)}%</div>
          <div className="kpi-label">Global Health Average</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">64</div>
          <div className="kpi-label">Total Communities</div>
        </div>
      </div>

      {/* Global Pillars */}
      <div className="global-pillars">
        <h2>Global Sustainability Pillars</h2>
        <div className="pillars-grid">
          <MetricsCard 
            title="Global Health" 
            score={Math.round(globalMetrics?.healthPillars.health || 0)} 
            icon="🏥"
          />
          <MetricsCard 
            title="Global Energy" 
            score={Math.round(globalMetrics?.healthPillars.energy || 0)} 
            icon="⚡"
          />
          <MetricsCard 
            title="Global Food Security" 
            score={Math.round(globalMetrics?.healthPillars.food || 0)} 
            icon="🌾"
          />
          <MetricsCard 
            title="Global Water" 
            score={Math.round(globalMetrics?.healthPillars.water || 0)} 
            icon="💧"
          />
          <MetricsCard 
            title="Global Trade" 
            score={Math.round(globalMetrics?.healthPillars.trade || 0)} 
            icon="💰"
          />
          <MetricsCard 
            title="Global Governance" 
            score={Math.round(globalMetrics?.healthPillars.governance || 0)} 
            icon="🏛️"
          />
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="view-selector">
        <button 
          className={`view-btn ${viewMode === 'global' ? 'active' : ''}`}
          onClick={() => { setViewMode('global'); setSelectedContinent(null); }}
        >
          🌍 Global View
        </button>
        <button 
          className={`view-btn ${viewMode === 'continental' ? 'active' : ''}`}
          onClick={() => setViewMode('continental')}
        >
          🗺️ Continental
        </button>
        <button 
          className={`view-btn ${viewMode === 'alerts' ? 'active' : ''}`}
          onClick={() => setViewMode('alerts')}
        >
          🚨 Alerts
        </button>
        <button 
          className={`view-btn ${viewMode === 'resources' ? 'active' : ''}`}
          onClick={() => setViewMode('resources')}
        >
          🔄 Resources
        </button>
      </div>

      {/* Continental View */}
      {viewMode === 'continental' && (
        <div className="continental-view">
          <h2>Communities by Continent</h2>
          <div className="continent-grid">
            {Object.entries(globalMetrics?.byContinent || {}).map(([continent, data]) => (
              <div 
                key={continent}
                className={`continent-card ${selectedContinent === continent ? 'selected' : ''}`}
                onClick={() => setSelectedContinent(selectedContinent === continent ? null : continent)}
                style={{ borderColor: getContinentColor(continent) }}
              >
                <h3>{continent}</h3>
                <div className="continent-stats">
                  <div className="stat">
                    <span className="stat-value">{data.activeCount}/{data.count}</span>
                    <span className="stat-label">Active</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{data.alerts}</span>
                    <span className="stat-label">Alerts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedContinent && (
            <div className="continent-communities">
              <h3>Communities in {selectedContinent}</h3>
              <div className="communities-list">
                {filteredCommunities.map(community => (
                  <div key={community.id} className="community-list-item">
                    <div className="community-name">{community.name}</div>
                    <div className="community-status">
                      <span className="badge">{community.status}</span>
                      {community.alerts?.length > 0 && (
                        <span className="alert-count">🚨 {community.alerts.length}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alerts View */}
      {viewMode === 'alerts' && (
        <div className="alerts-view">
          <h2>System-Wide Alerts</h2>
          <div className="alert-severity-breakdown">
            {communities.reduce((acc, c) => {
              const critical = c.alerts?.filter(a => a.severity === 'CRITICAL').length || 0;
              const warning = c.alerts?.filter(a => a.severity === 'WARNING').length || 0;
              acc.critical += critical;
              acc.warning += warning;
              return acc;
            }, { critical: 0, warning: 0 }).critical > 0 && (
              <div className="severity-summary">
                <span className="critical">🔴 {communities.reduce((sum, c) => sum + (c.alerts?.filter(a => a.severity === 'CRITICAL').length || 0), 0)} Critical</span>
                <span className="warning">🟡 {communities.reduce((sum, c) => sum + (c.alerts?.filter(a => a.severity === 'WARNING').length || 0), 0)} Warnings</span>
              </div>
            )}
          </div>
          <p className="empty-state">Alert details will be available in detailed alerts panel. Navigate to specific communities for action.</p>
        </div>
      )}

      {/* Resources View */}
      {viewMode === 'resources' && (
        <div className="resources-view">
          <h2>Global Resource Network</h2>
          <div className="resource-summary">
            <p>Resource transfer status across all communities. Total transactions: {communities.reduce((sum, c) => sum + (c.transactions?.length || 0), 0)}</p>
            <div className="transaction-summary">
              {['proposed', 'accepted', 'in_transit', 'completed'].map(status => (
                <div key={status} className="transaction-status">
                  <span className="status-label">{status}</span>
                  <span className="status-count">
                    {communities.reduce((sum, c) => sum + (c.transactions?.filter(t => t.status === status).length || 0), 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global View */}
      {viewMode === 'global' && (
        <div className="global-map-section">
          <h2>System Map</h2>
          <p className="info-text">All {communities.length} communities monitored in real-time</p>
          <div className="communities-snapshot">
            {communities.slice(0, 12).map(community => (
              <div key={community.id} className="community-snapshot">
                <strong>{community.name}</strong>
                <small>{community.country}</small>
              </div>
            ))}
            {communities.length > 12 && (
              <div className="community-snapshot more">
                +{communities.length - 12} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="global-footer">
        <p>Last updated: {new Date().toLocaleTimeString()} | Auto-refresh every 60 seconds</p>
      </div>
    </div>
  );
};

export default GlobalAdminDashboard;
