import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = ({ title = 'Error', message, onDismiss, type = 'error' }) => {
  const bgColor = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColor = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const icon = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`${bgColor[type]} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <span className="text-xl mr-3">{icon[type]}</span>
          <div>
            <h3 className={`font-semibold ${textColor[type]}`}>{title}</h3>
            <p className={`${textColor[type]} text-sm mt-1`}>{message}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${textColor[type]} hover:opacity-70 transition ml-2`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

ErrorAlert.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
  type: PropTypes.oneOf(['error', 'warning', 'info']),
};

export default ErrorAlert;
