import React from 'react';
import { useApiHealth } from '../hooks/useApi';
import '../styles/components/api-status.css';

/**
 * API Status Monitor Component
 * Displays backend connectivity status in the UI
 */
const ApiStatusMonitor = ({ position = 'top-right' }) => {
  const { isHealthy, isLoading, error, lastCheck } = useApiHealth();

  if (isLoading && lastCheck === null) {
    return null; // Don't show loading indicator on first load
  }

  return (
    <div className={`api-status-monitor ${position}`}>
      <div className={`status-indicator ${isHealthy ? 'healthy' : 'unhealthy'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {isHealthy ? 'Backend Connected' : 'Backend Disconnected'}
        </span>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {lastCheck && (
        <div className="last-check">
          Last checked: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ApiStatusMonitor;
