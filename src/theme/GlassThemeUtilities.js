/**
 * Advanced Glassmorphism Theme Utilities
 * Animations, transitions, and micro-interactions
 * Building upon the base GlassmorphismTheme.js
 */

// Color palette mapping for semantic consistency
export const GLASS_COLORS = {
  primary: {
    glass: 'bg-white/30 dark:bg-gray-900/50',
    border: 'border-white/40 dark:border-gray-700/50',
    text: 'text-slate-900 dark:text-white',
    gradient: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
  },
  success: {
    glass: 'bg-green-100/30 dark:bg-green-900/50',
    border: 'border-green-200/40 dark:border-green-700/50',
    text: 'text-green-900 dark:text-green-100',
    accent: 'from-green-400 to-emerald-500',
  },
  warning: {
    glass: 'bg-amber-100/30 dark:bg-amber-900/50',
    border: 'border-amber-200/40 dark:border-amber-700/50',
    text: 'text-amber-900 dark:text-amber-100',
    accent: 'from-amber-400 to-orange-500',
  },
  danger: {
    glass: 'bg-red-100/30 dark:bg-red-900/50',
    border: 'border-red-200/40 dark:border-red-700/50',
    text: 'text-red-900 dark:text-red-100',
    accent: 'from-red-400 to-rose-500',
  },
  info: {
    glass: 'bg-blue-100/30 dark:bg-blue-900/50',
    border: 'border-blue-200/40 dark:border-blue-700/50',
    text: 'text-blue-900 dark:text-blue-100',
    accent: 'from-blue-400 to-cyan-500',
  },
};

// Animation duration constants
export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  verySlow: '800ms',
};

// Common transition presets
export const GLASS_TRANSITIONS = {
  smooth: 'transition-all duration-300 ease-out',
  smoothSlow: 'transition-all duration-500 ease-out',
  spring: 'transition-all duration-300 ease-out transform',
  bounce: 'transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Hover effect classes
export const GLASS_HOVER_EFFECTS = {
  lift: 'hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl',
  glow: 'hover:shadow-lg hover:shadow-blue-500/20',
  brighten: 'hover:bg-white/40 dark:hover:bg-gray-900/60',
  scale: 'hover:scale-105',
  all: 'hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl hover:bg-white/40 dark:hover:bg-gray-900/60',
};

// Focus state (accessible)
export const GLASS_FOCUS_STATES = {
  outline: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950',
  glow: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg',
  subtle: 'focus:outline-none focus:ring-1 focus:ring-blue-400',
};

// Loading animation keyframes (to be added to global CSS)
export const ANIMATION_KEYFRAMES = `
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes slide-in-bottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-top {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes expand {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 1000px 100%;
}

.animate-pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-slide-in-bottom {
  animation: slide-in-bottom 0.5s ease-out forwards;
}

.animate-slide-in-top {
  animation: slide-in-top 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-expand {
  animation: expand 0.3s ease-out forwards;
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
`;

// Utility function to get color scheme for a component
export const getGlassColorScheme = (type = 'primary') => {
  return GLASS_COLORS[type] || GLASS_COLORS.primary;
};

// Utility to combine Tailwind classes
export const mergeGlassClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Micro-interaction timing
export const MICROINTERACTION_TIMING = {
  tap: 150,      // User sees immediate feedback
  hover: 300,    // Smooth hover transitions
  open: 200,     // Modal/menu opening
  close: 150,    // Modal/menu closing
  notification: 400, // Notification slide-in
};

// Accessibility helpers
export const A11Y_HELPERS = {
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white',
  srOnly: 'sr-only',
  focusVisible: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
};

// Responsive breakpoints helper
export const RESPONSIVE_CLASSES = {
  mobile: 'block md:hidden',
  tablet: 'hidden md:block lg:hidden',
  desktop: 'hidden lg:block',
  touchTarget: 'min-h-12 min-w-12', // 48px minimum touch target
};

// Shadow presets
export const GLASS_SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md dark:shadow-lg',
  lg: 'shadow-lg dark:shadow-xl',
  xl: 'shadow-xl dark:shadow-2xl',
  none: 'shadow-none',
  glow: 'shadow-lg shadow-blue-500/20 dark:shadow-blue-500/40',
};

// Backdrop blur intensities
export const BLUR_AMOUNTS = {
  none: '',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
};

export default {
  GLASS_COLORS,
  ANIMATION_DURATIONS,
  GLASS_TRANSITIONS,
  GLASS_HOVER_EFFECTS,
  GLASS_FOCUS_STATES,
  GLASS_SHADOWS,
  BLUR_AMOUNTS,
  RESPONSIVE_CLASSES,
  A11Y_HELPERS,
  getGlassColorScheme,
  mergeGlassClasses,
};
