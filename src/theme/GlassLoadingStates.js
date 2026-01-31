/**
 * Glassmorphic Loading States & Skeleton Components
 * Provides smooth loading animations with glass effect
 */

import React from 'react';

/**
 * GlassSkeletonLoader - Shimmer loading state
 * Displays placeholder content while data loads
 */
export const GlassSkeletonLoader = ({ 
  count = 3, 
  type = 'card', 
  className = '' 
}) => {
  const skeletonVariants = {
    card: 'h-32 rounded-lg',
    line: 'h-4 rounded',
    circle: 'h-12 w-12 rounded-full',
    block: 'h-24 rounded-lg',
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${skeletonVariants[type] || skeletonVariants.card}
            bg-gradient-to-r from-white/20 via-white/40 to-white/20
            dark:from-gray-800/20 dark:via-gray-700/40 dark:to-gray-800/20
            backdrop-blur-md
            border border-white/20 dark:border-gray-700/50
            animate-shimmer
          `}
        />
      ))}
    </div>
  );
};

/**
 * GlassLoadingSpinner - Rotating loading indicator
 * Circular spinner with glassmorphism
 */
export const GlassLoadingSpinner = ({ 
  size = 'md', 
  color = 'blue',
  message = 'Loading...',
  className = ''
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    white: 'text-white',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        {/* Outer rotating ring */}
        <div
          className={`
            absolute inset-0 rounded-full
            border-4 border-transparent
            border-t-current border-r-current
            ${colors[color]}
            animate-spin
          `}
          style={{ animationDuration: '1s' }}
        />
        
        {/* Inner pulsing ring */}
        <div
          className={`
            absolute inset-2 rounded-full
            border-2 border-current
            ${colors[color]}
            animate-pulse-glow
            opacity-30
          `}
        />
      </div>
      
      {message && (
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * GlassProgressBar - Animated progress indicator
 * Linear progress with glassmorphism
 */
export const GlassProgressBar = ({ 
  progress = 0, 
  color = 'blue',
  showLabel = true,
  animated = true,
  className = ''
}) => {
  const colorClasses = {
    blue: 'from-blue-400 to-cyan-500',
    green: 'from-green-400 to-emerald-500',
    purple: 'from-purple-400 to-violet-500',
    orange: 'from-orange-400 to-red-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-3 rounded-full overflow-hidden bg-white/20 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 backdrop-blur-md">
        <div
          className={`
            h-full bg-gradient-to-r ${colorClasses[color]}
            transition-all duration-300 ease-out
            ${animated ? 'animate-gradient-shift' : ''}
            rounded-full
          `}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="mt-2 flex justify-between items-center text-xs">
          <span className="text-slate-600 dark:text-slate-400">Progress</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

/**
 * GlassPulseLoader - Pulsing loading state
 * Subtle pulsing animation
 */
export const GlassPulseLoader = ({ 
  message = 'Processing...',
  className = '' 
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center gap-3
      p-6 rounded-lg
      bg-white/30 dark:bg-gray-900/50
      backdrop-blur-md
      border border-white/20 dark:border-gray-700/50
      ${className}
    `}>
      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow" />
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {message}
      </p>
    </div>
  );
};

/**
 * GlassLoadingOverlay - Full-screen loading state
 * Modal-style loading overlay
 */
export const GlassLoadingOverlay = ({ 
  isVisible = true, 
  message = 'Loading...',
  spinner = true,
  blur = true
}) => {
  if (!isVisible) return null;

  return (
    <div className={`
      fixed inset-0 z-50
      flex items-center justify-center
      ${blur ? 'backdrop-blur-sm' : ''}
      bg-black/20 dark:bg-black/40
      transition-opacity duration-300
    `}>
      <div className="
        bg-white/40 dark:bg-gray-900/60
        backdrop-blur-xl
        rounded-2xl
        border border-white/40 dark:border-gray-700/50
        p-8
        shadow-2xl
        flex flex-col items-center gap-6
        animate-expand
      ">
        {spinner && (
          <GlassLoadingSpinner size="lg" message="" />
        )}
        
        <p className="text-lg font-semibold text-slate-900 dark:text-white text-center">
          {message}
        </p>
      </div>
    </div>
  );
};

/**
 * GlassLoadingCard - Card-level loading state
 * Used within cards/sections
 */
export const GlassLoadingCard = ({ 
  lines = 3,
  hasImage = false,
  className = ''
}) => {
  return (
    <div className={`
      bg-white/30 dark:bg-gray-900/50
      backdrop-blur-md
      border border-white/20 dark:border-gray-700/50
      rounded-lg
      p-6
      space-y-4
      ${className}
    `}>
      {hasImage && (
        <div className="
          h-40 rounded-lg
          bg-gradient-to-r from-white/20 via-white/40 to-white/20
          dark:from-gray-800/20 dark:via-gray-700/40 dark:to-gray-800/20
          animate-shimmer
        " />
      )}
      
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            h-4 rounded
            bg-gradient-to-r from-white/20 via-white/40 to-white/20
            dark:from-gray-800/20 dark:via-gray-700/40 dark:to-gray-800/20
            animate-shimmer
            ${i === lines - 1 ? 'w-2/3' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
};

/**
 * GlassLoadingDots - Three-dot loading animation
 * Animated dots for simple loading state
 */
export const GlassLoadingDots = ({ 
  message,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      {message && (
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default {
  GlassSkeletonLoader,
  GlassLoadingSpinner,
  GlassProgressBar,
  GlassPulseLoader,
  GlassLoadingOverlay,
  GlassLoadingCard,
  GlassLoadingDots,
};
