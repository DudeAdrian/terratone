import React, { useState } from 'react';

/**
 * AlertPanel
 * Displays a single resource alert with severity, details, and action buttons
 * Shows resource matching suggestions if available
 */
const AlertPanel = ({ alert, onAcknowledge = null, suggestions = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#dc2626';
      case 'WARNING': return '#f59e0b';
      case 'INFO': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'ENERGY_DEFICIT': return '⚡';
      case 'WATER_SHORTAGE': return '💧';
      case 'FOOD_INSECURITY': return '🌾';
      case 'HEALTH_CRISIS': return '🏥';
      case 'TRADE_DEFICIT': return '💰';
      case 'GOVERNANCE_CRISIS': return '🏛️';
      default: return '⚠️';
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case 'ENERGY_DEFICIT': return 'Energy Deficit';
      case 'WATER_SHORTAGE': return 'Water Shortage';
      case 'FOOD_INSECURITY': return 'Food Insecurity';
      case 'HEALTH_CRISIS': return 'Health Emergency';
      case 'TRADE_DEFICIT': return 'Trade Imbalance';
      case 'GOVERNANCE_CRISIS': return 'Governance Issue';
      default: return 'Alert';
    }
  };

  const severityColor = getSeverityColor(alert.severity);

  return (
    <div className="alert-panel" style={{ borderLeftColor: severityColor }}>
      <div 
        className="alert-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="alert-title-section">
          <span className="alert-icon">{getAlertIcon(alert.type)}</span>
          <div className="alert-title-text">
            <h4>{getAlertTitle(alert.type)}</h4>
            <p className="alert-title">{alert.title}</p>
          </div>
        </div>
        <div className="alert-meta">
          <span 
            className="severity-badge" 
            style={{ backgroundColor: severityColor }}
          >
            {alert.severity}
          </span>
          <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {expanded && (
        <div className="alert-details">
          <p className="alert-description">{alert.description}</p>

          {alert.deficit !== undefined && (
            <div className="deficit-info">
              <strong>Current Deficit:</strong>
              <div className="deficit-bar">
                <div 
                  className="deficit-fill"
                  style={{ width: `${Math.min(alert.deficit, 100)}%` }}
                ></div>
              </div>
              <span>{Math.round(alert.deficit)}% below threshold</span>
            </div>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="suggestions">
              <h5>Resource Matching Suggestions</h5>
              <div className="suggestion-list">
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                  <div key={idx} className="suggestion-item">
                    <div className="suggestion-rank">#{idx + 1}</div>
                    <div className="suggestion-content">
                      <strong>{suggestion.donorName}</strong>
                      <p>Available: {suggestion.availableQuantity} units</p>
                      <small>Distance: {suggestion.distance}km | Score: {suggestion.matchScore}%</small>
                    </div>
                    <button className="btn-sm btn-secondary">Request</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="alert-actions">
            {alert.status !== 'resolved' && onAcknowledge && (
              <button 
                className="btn btn-secondary"
                onClick={onAcknowledge}
              >
                ✓ Acknowledge Alert
              </button>
            )}
            <button className="btn btn-secondary">
              📞 Contact Regional Hub
            </button>
            <button className="btn btn-secondary">
              📊 View Analytics
            </button>
          </div>

          <div className="alert-footer">
            <small>Created: {new Date(alert.createdAt).toLocaleDateString()}</small>
            {alert.resolvedAt && (
              <small>Resolved: {new Date(alert.resolvedAt).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
