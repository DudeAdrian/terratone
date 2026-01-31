import React, { useState } from 'react';

/**
 * ResourceWidget
 * Displays a resource transaction between communities
 * Shows resource type, quantity, status, and action buttons
 */
const ResourceWidget = ({ transaction, onAccept = null, onReject = null }) => {
  const [expanded, setExpanded] = useState(false);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'ENERGY': return '⚡';
      case 'WATER': return '💧';
      case 'FOOD': return '🌾';
      case 'MEDICINE': return '💊';
      case 'LABOR': return '👨‍💼';
      case 'KNOWLEDGE': return '📚';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'proposed': return '#3b82f6'; // Blue
      case 'accepted': return '#f59e0b'; // Amber
      case 'in_transit': return '#8b5cf6'; // Purple
      case 'completed': return '#10b981'; // Green
      case 'rejected': return '#ef4444'; // Red
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'proposed': return 'Awaiting Acceptance';
      case 'accepted': return 'Accepted';
      case 'in_transit': return 'In Transit';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const statusColor = getStatusColor(transaction.status);
  const canRespond = transaction.status === 'proposed' && transaction.direction === 'incoming';

  return (
    <div className="resource-widget">
      <div 
        className="resource-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="resource-flow">
          <div className="community-badge from">
            <span className="resource-icon">{getResourceIcon(transaction.resourceType)}</span>
            <strong>{transaction.fromCommunity.name}</strong>
          </div>
          <div className="flow-arrow">→</div>
          <div className="community-badge to">
            <strong>{transaction.toCommunity.name}</strong>
          </div>
        </div>

        <div className="resource-meta">
          <span className="quantity">{transaction.quantity} units</span>
          <span 
            className="status-badge"
            style={{ backgroundColor: statusColor }}
          >
            {getStatusLabel(transaction.status)}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="resource-details">
          <div className="detail-row">
            <label>Resource Type:</label>
            <strong>{transaction.resourceType}</strong>
          </div>

          <div className="detail-row">
            <label>Quantity:</label>
            <strong>{transaction.quantity} units</strong>
          </div>

          <div className="detail-row">
            <label>Status:</label>
            <strong style={{ color: statusColor }}>
              {getStatusLabel(transaction.status)}
            </strong>
          </div>

          {transaction.estimatedDelivery && (
            <div className="detail-row">
              <label>Estimated Delivery:</label>
              <strong>{new Date(transaction.estimatedDelivery).toLocaleDateString()}</strong>
            </div>
          )}

          {transaction.negotiationNotes && (
            <div className="detail-row">
              <label>Notes:</label>
              <p>{transaction.negotiationNotes}</p>
            </div>
          )}

          <div className="resource-timeline">
            <div className={`timeline-item ${['proposed', 'accepted', 'in_transit', 'completed'].includes(transaction.status) ? 'completed' : ''}`}>
              <span>Proposed</span>
            </div>
            <div className={`timeline-item ${['accepted', 'in_transit', 'completed'].includes(transaction.status) ? 'completed' : ''}`}>
              <span>Accepted</span>
            </div>
            <div className={`timeline-item ${['in_transit', 'completed'].includes(transaction.status) ? 'completed' : ''}`}>
              <span>In Transit</span>
            </div>
            <div className={`timeline-item ${transaction.status === 'completed' ? 'completed' : ''}`}>
              <span>Completed</span>
            </div>
          </div>

          {canRespond && (
            <div className="resource-actions">
              <button 
                className="btn btn-primary"
                onClick={onAccept}
              >
                ✓ Accept Offer
              </button>
              <button 
                className="btn btn-danger"
                onClick={onReject}
              >
                ✗ Reject Offer
              </button>
            </div>
          )}

          {transaction.status === 'accepted' && (
            <div className="resource-actions">
              <button className="btn btn-secondary">
                📍 Track Shipment
              </button>
            </div>
          )}

          <div className="resource-footer">
            <small>Created: {new Date(transaction.createdAt).toLocaleDateString()}</small>
            {transaction.completedAt && (
              <small>Completed: {new Date(transaction.completedAt).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceWidget;
