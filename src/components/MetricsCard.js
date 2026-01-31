import React from 'react';
import { GlassCard } from '../theme/GlassmorphismTheme';

/**
 * MetricsCard
 * Displays a single sustainability metric with score, trend, and interpretation
 * Used in CommunityDashboard and GlobalAdminDashboard
 */
const MetricsCard = ({ title, score, icon, subtitle, trend = null, onClick = null, className = '' }) => {
  // Determine color based on score
  const getColor = (score) => {
    if (score >= 75) return '#10b981'; // Green - Excellent
    if (score >= 50) return '#f59e0b'; // Amber - Good
    if (score >= 25) return '#ef4444'; // Red - Warning
    return '#991b1b'; // Dark Red - Critical
  };

  const getStatus = (score) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Warning';
    return 'Critical';
  };

  const color = getColor(score);
  const status = getStatus(score);

  return (
    <GlassCard
      className={`metrics-card ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      role="region"
      aria-label={title}
    >
      <div className="card-header flex items-center gap-2 mb-2">
        <span className="metric-icon text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="card-score flex flex-col items-center mb-2">
        <svg width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${score * 2.827} 282.7`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50px 50px',
              transition: 'stroke-dasharray 0.5s ease',
            }}
          />
        </svg>
        <div className="score-text text-xl font-bold" style={{ color }}>
          <span className="score-number">{Math.round(score)}</span>
          <span className="score-max">/100</span>
        </div>
      </div>
      <div className="card-status text-base font-medium mb-1" style={{ color }}>
        {status}
      </div>
      {subtitle && <p className="card-subtitle text-sm text-gray-500 dark:text-gray-400 mb-1">{subtitle}</p>}
      {trend !== null && (
        <div className="card-trend mt-1">
          <span className={trend > 0 ? 'trend-up text-green-500' : trend < 0 ? 'trend-down text-red-500' : 'trend-stable text-gray-400'}>
            {trend > 0 ? '📈' : trend < 0 ? '📉' : '→'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </GlassCard>
  );
};

export default MetricsCard;
