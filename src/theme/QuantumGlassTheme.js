/**
 * Quantum Glassmorphism Theme - Enhanced Edition
 * 
 * Quantum Visual Parameters:
 * - Superposition: Multiple blur layers create quantum superposition effect
 * - Entanglement: Color interactions across chakra spectrum
 * - Wave Function: Smooth transitions between opacity states
 * - Uncertainty Principle: Micro-interactions reveal depth
 * - Observation Effect: Hover states collapse to specific states
 * 
 * Chakra Color System (7 Energy Centers):
 * 1. Root (Muladhara):     #DC2626 - Deep Red/Crimson
 * 2. Sacral (Svadhisthana): #EA580C - Orange
 * 3. Solar (Manipura):      #FACC15 - Golden Yellow
 * 4. Heart (Anahata):       #10B981 - Emerald Green
 * 5. Throat (Vishuddha):    #0EA5E9 - Sky Blue
 * 6. Third Eye (Ajna):      #8B5CF6 - Purple Violet
 * 7. Crown (Sahasrara):     #EC4899 - Magenta Pink
 * 
 * WCAG AAA Compliance + Deep Transparency
 */

import React, { useEffect, useRef } from 'react';

// ============================================================================
// QUANTUM PARAMETERS - Core Visual Properties
// ============================================================================

export const QuantumParams = {
  // Depth Layers - Create quantum superposition through layering
  blur: {
    quantum: 'backdrop-blur-3xl',      // 48px - Deep quantum tunnel
    deep: 'backdrop-blur-2xl',         // 40px - Entangled state
    medium: 'backdrop-blur-xl',        // 20px - Observable reality
    light: 'backdrop-blur-lg',         // 12px - Surface level
    minimal: 'backdrop-blur-md',       // 8px - Initial observation
    stack: 'backdrop-blur-3xl',        // Stacked blur for enhanced depth
  },

  // Transparency Spectrum - Wave function collapse (ENHANCED: Ultra-clear)
  opacity: {
    crystal: 'bg-white/2 dark:bg-black/2',      // 2% - Crystal clear
    ultraClear: 'bg-white/3 dark:bg-black/3',   // 3% - Ultra transparent
    quantum: 'bg-white/5 dark:bg-black/5',      // 5% - Pure superposition
    ethereal: 'bg-white/8 dark:bg-black/8',     // 8% - Near-transparent
    veil: 'bg-white/12 dark:bg-black/12',       // 12% - Semi-transparent
    mist: 'bg-white/15 dark:bg-black/15',       // 15% - Visible mist
    fog: 'bg-white/20 dark:bg-black/20',        // 20% - Deep fog
    haze: 'bg-white/25 dark:bg-black/25',       // 25% - Moderate haze
    cloud: 'bg-white/30 dark:bg-black/30',      // 30% - Cloud-like
    dense: 'bg-white/40 dark:bg-black/40',      // 40% - Dense glass
  },

  // Border Transparency - Quantum boundary states (ENHANCED: Color-hued edges)
  border: {
    quantum: 'border-white/5 dark:border-white/3',
    ethereal: 'border-white/10 dark:border-white/5',
    veil: 'border-white/15 dark:border-white/8',
    mist: 'border-white/20 dark:border-white/12',
    fog: 'border-white/30 dark:border-white/20',
    clear: 'border-white/40 dark:border-white/30',
  },

  // Edge Halos - Color-shifted borders with quantum glow
  edgeHalo: {
    root: 'shadow-[0_0_20px_rgba(220,38,38,0.4),0_0_40px_rgba(220,38,38,0.2),inset_0_0_20px_rgba(220,38,38,0.1)]',
    sacral: 'shadow-[0_0_20px_rgba(234,88,12,0.4),0_0_40px_rgba(234,88,12,0.2),inset_0_0_20px_rgba(234,88,12,0.1)]',
    solar: 'shadow-[0_0_20px_rgba(250,204,21,0.4),0_0_40px_rgba(250,204,21,0.2),inset_0_0_20px_rgba(250,204,21,0.1)]',
    heart: 'shadow-[0_0_20px_rgba(16,185,129,0.4),0_0_40px_rgba(16,185,129,0.2),inset_0_0_20px_rgba(16,185,129,0.1)]',
    throat: 'shadow-[0_0_20px_rgba(14,165,233,0.4),0_0_40px_rgba(14,165,233,0.2),inset_0_0_20px_rgba(14,165,233,0.1)]',
    third_eye: 'shadow-[0_0_20px_rgba(139,92,246,0.4),0_0_40px_rgba(139,92,246,0.2),inset_0_0_20px_rgba(139,92,246,0.1)]',
    crown: 'shadow-[0_0_20px_rgba(236,72,153,0.4),0_0_40px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(236,72,153,0.1)]',
  },

  // Chakra Colors - Energy center alignment (ENHANCED: Gradient edges)
  chakra: {
    root: {
      bg: 'bg-red-600/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-600/40',
      glow: 'from-red-600/30 to-red-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-red-600/60 from-red-600/20',
      hex: '#DC2626',
    },
    sacral: {
      bg: 'bg-orange-600/20',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-600/40',
      glow: 'from-orange-600/30 to-orange-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-orange-600/60 from-orange-600/20',
      hex: '#EA580C',
    },
    solar: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-600/40',
      glow: 'from-yellow-600/30 to-yellow-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-yellow-600/60 from-yellow-600/20',
      hex: '#FACC15',
    },
    heart: {
      bg: 'bg-emerald-600/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-600/40',
      glow: 'from-emerald-600/30 to-emerald-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-emerald-600/60 from-emerald-600/20',
      hex: '#10B981',
    },
    throat: {
      bg: 'bg-sky-600/20',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-600/40',
      glow: 'from-sky-600/30 to-sky-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-sky-600/60 from-sky-600/20',
      hex: '#0EA5E9',
    },
    third_eye: {
      bg: 'bg-purple-600/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-600/40',
      glow: 'from-purple-600/30 to-purple-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-purple-600/60 from-purple-600/20',
      hex: '#8B5CF6',
    },
    crown: {
      bg: 'bg-pink-600/20',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-600/40',
      glow: 'from-pink-600/30 to-pink-400/10',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-pink-600/60 from-pink-600/20',
      hex: '#EC4899',
    },
  },

  // Transition Curves - Quantum wave function
  transition: {
    quantum: 'transition-all duration-500 ease-in-out',    // Smooth superposition
    entangled: 'transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)',
    observing: 'transition-all duration-200 ease-out',     // Quick observation
    collapsing: 'transition-all duration-150 ease-in',     // Wave collapse
  },

  // Shadow Layers - Quantum depth
  shadow: {
    quantum: 'shadow-2xl dark:shadow-2xl/50',
    deep: 'shadow-xl dark:shadow-xl/40',
    medium: 'shadow-lg dark:shadow-lg/30',
    light: 'shadow-sm dark:shadow-sm/20',
  },
};

// ============================================================================
// QUANTUM CARD - Ultra-Transparent with Color-Hued Edges
// ============================================================================

export const QuantumCard = ({
  children,
  chakra = 'heart',
  blurLevel = 'medium',
  opacityLevel = 'ultraClear',
  glow = true,
  interactive = true,
  edgeGlow = true,
  role = 'article',
  ariaLabel,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra] || QuantumParams.chakra.heart;
  const blurClass = QuantumParams.blur[blurLevel];
  const opacityClass = QuantumParams.opacity[opacityLevel];
  const borderClass = QuantumParams.border[blurLevel === 'quantum' ? 'quantum' : 'mist'];
  const shadowClass = QuantumParams.shadow[blurLevel === 'quantum' ? 'quantum' : 'deep'];
  const transitionClass = QuantumParams.transition.quantum;
  const edgeHaloClass = QuantumParams.edgeHalo[chakra] || QuantumParams.edgeHalo.heart;

  return (
    <div
      className={`
        relative
        group
        ${blurClass}
        ${opacityClass}
        ${chakraConfig.bg}
        rounded-2xl
        border
        ${borderClass}
        ${chakraConfig.border}
        p-5
        ${shadowClass}
        ${edgeGlow ? edgeHaloClass : ''}
        ${interactive ? 'cursor-pointer hover:shadow-2xl dark:hover:shadow-2xl/60' : ''}
        ${interactive ? 'hover:' + opacityClass.replace('bg-white/', 'bg-white/') : ''}
        ${transitionClass}
        ${glow ? 'before:absolute before:inset-0 before:rounded-2xl before:opacity-0 group-hover:before:opacity-100 before:' + chakraConfig.glow.split(' ')[0] + ' before:pointer-events-none before:transition-opacity before:duration-300' : ''}
        ${interactive ? 'hover:-translate-y-1' : ''}
        ${className}
      `}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {/* Edge Gradient Overlay - Color-hued border effect */}
      {edgeGlow && (
        <div className={`
          absolute
          inset-0
          rounded-2xl
          border
          border-2
          ${chakraConfig.edgeBorder}
          opacity-0
          group-hover:opacity-100
          ${transitionClass}
          pointer-events-none
          bg-gradient-to-br
          ${chakraConfig.edgeGradient}
          -z-10
        `} />
      )}

      <div className="relative z-10">
        {children}
      </div>
      
      {/* Quantum Gradient Underlay */}
      {glow && (
        <div className={`
          absolute
          inset-0
          rounded-2xl
          bg-gradient-to-br
          ${chakraConfig.glow}
          opacity-0
          group-hover:opacity-40
          ${transitionClass}
          pointer-events-none
          -z-10
        `} />
      )}
    </div>
  );
};

// ============================================================================
// QUANTUM GLASS PANEL - Ultra-Clear with Color-Shifted Edges
// ============================================================================

export const QuantumGlassPanel = ({
  children,
  chakra = 'throat',
  depth = 'deep',
  className = '',
  edgeGlow = true,
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const edgeHaloClass = QuantumParams.edgeHalo[chakra] || QuantumParams.edgeHalo.throat;
  const depthConfig = {
    quantum: { blur: 'quantum', opacity: 'ultraClear', border: 'quantum' },
    deep: { blur: 'deep', opacity: 'crystal', border: 'ethereal' },
    medium: { blur: 'medium', opacity: 'ultraClear', border: 'veil' },
    light: { blur: 'light', opacity: 'quantum', border: 'mist' },
  }[depth];

  return (
    <div className={`
      relative
      group
      overflow-hidden
      rounded-3xl
      ${edgeGlow ? edgeHaloClass : ''}
      ${className}
    `}>
      {/* Layer 1: Quantum Base - Ultra-transparent */}
      <div className={`
        absolute
        inset-0
        ${QuantumParams.blur[depthConfig.blur]}
        ${QuantumParams.opacity[depthConfig.opacity]}
        ${chakraConfig.bg}
      `} />

      {/* Layer 2: Quantum Entanglement - Enhanced depth */}
      <div className={`
        absolute
        inset-0
        backdrop-blur-3xl
        ${QuantumParams.opacity.quantum}
        from-transparent to-white/5 dark:to-black/5
        bg-gradient-to-br
      `} />

      {/* Layer 3: Border Quantum State with Color Hue */}
      <div className={`
        absolute
        inset-0
        rounded-3xl
        border-2
        ${QuantumParams.border[depthConfig.border]}
        ${chakraConfig.border}
        pointer-events-none
        opacity-0
        group-hover:opacity-100
        ${QuantumParams.transition.quantum}
        bg-gradient-to-br
        ${chakraConfig.edgeGradient}
      `} />

      {/* Standard Border */}
      <div className={`
        absolute
        inset-0
        rounded-3xl
        border
        ${QuantumParams.border[depthConfig.border]}
        ${chakraConfig.border}
        pointer-events-none
      `} />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Enhanced Glow Effect Layer */}
      <div className={`
        absolute
        -inset-1
        rounded-3xl
        bg-gradient-to-br
        ${chakraConfig.glow}
        opacity-10
        group-hover:opacity-30
        blur-2xl
        -z-10
        ${QuantumParams.transition.quantum}
      `} />
    </div>
  );
};

// ============================================================================
// QUANTUM ENERGY BUTTON - Chakra-Powered Interactive Element
// ============================================================================

export const QuantumEnergyButton = ({
  children,
  chakra = 'throat',
  size = 'md',
  variant = 'glass',
  icon,
  ariaLabel,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const sizeConfig = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size];

  const variantClasses = {
    glass: `
      ${QuantumParams.blur.light}
      ${QuantumParams.opacity.fog}
      ${chakraConfig.bg}
      border
      ${QuantumParams.border.fog}
      ${chakraConfig.border}
      hover:${QuantumParams.opacity.cloud}
      hover:${QuantumParams.blur.medium}
    `,
    solid: `
      bg-gradient-to-br
      ${chakraConfig.glow}
      border
      ${chakraConfig.border}
    `,
    outline: `
      ${QuantumParams.opacity.ethereal}
      border-2
      ${chakraConfig.border}
      ${chakraConfig.text}
    `,
  }[variant];

  return (
    <button
      className={`
        relative
        group
        ${sizeConfig}
        rounded-xl
        font-semibold
        ${chakraConfig.text}
        ${variantClasses}
        ${QuantumParams.transition.observing}
        hover:shadow-2xl dark:hover:shadow-2xl/50
        hover:-translate-y-1
        active:translate-y-0
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-offset-white dark:focus:ring-offset-gray-950
        ${chakraConfig.border}
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 relative z-10">
        {icon && <span aria-hidden="true" className="text-lg">{icon}</span>}
        <span>{children}</span>
      </div>

      {/* Quantum Glow Effect */}
      <div className={`
        absolute
        inset-0
        rounded-xl
        bg-gradient-to-br
        ${chakraConfig.glow}
        opacity-0
        group-hover:opacity-30
        group-active:opacity-20
        ${QuantumParams.transition.quantum}
        pointer-events-none
        -z-10
      `} />
    </button>
  );
};

// ============================================================================
// QUANTUM METRIC CARD - Data Display with Chakra Energy
// ============================================================================

export const QuantumMetricCard = ({
  label,
  value,
  unit = '',
  icon,
  chakra = 'solar',
  trend,
  edgeGlow = true,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];

  return (
    <QuantumCard
      chakra={chakra}
      blurLevel="medium"
      opacityLevel="ultraClear"
      edgeGlow={edgeGlow}
      className={`
        flex
        flex-col
        justify-between
        min-h-32
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <dt className={`text-sm font-medium ${chakraConfig.text}`}>
          {label}
        </dt>
        {icon && <span className="text-2xl" aria-hidden="true">{icon}</span>}
      </div>

      <div>
        <dd className={`
          text-3xl
          font-black
          ${chakraConfig.text}
          mb-1
        `}>
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </dd>
        {trend && (
          <span className={`
            text-xs
            font-semibold
            ${trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
          `}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </QuantumCard>
  );
};

// ============================================================================
// QUANTUM CHAKRA SPECTRUM - 7-Chakra Color Gradient Strip
// ============================================================================

export const QuantumChakraSpectrum = ({
  className = '',
  interactive = false,
  onChakraSelect,
  ...props
}) => {
  const chakras = Object.entries(QuantumParams.chakra).map(([key, value]) => ({
    name: key,
    ...value,
  }));

  return (
    <div
      className={`
        flex
        gap-1
        ${QuantumParams.blur.medium}
        ${QuantumParams.opacity.fog}
        rounded-2xl
        p-2
        border
        ${QuantumParams.border.mist}
        ${className}
      `}
      {...props}
    >
      {chakras.map(({ name, hex }) => (
        <button
          key={name}
          onClick={() => onChakraSelect?.(name)}
          className={`
            flex-1
            h-12
            rounded-lg
            transition-all
            duration-300
            cursor-pointer
            hover:shadow-lg
            hover:scale-105
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-offset-1
            focus:ring-offset-white dark:focus:ring-offset-gray-950
          `}
          style={{
            backgroundColor: hex,
            opacity: 0.7,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          aria-label={`Select ${name} chakra`}
          title={name.replace('_', ' ').toUpperCase()}
        />
      ))}
    </div>
  );
};

// ============================================================================
// QUANTUM GLASS GRID - Multi-Chakra Responsive Layout
// ============================================================================

export const QuantumGlassGrid = ({
  children,
  columns = 3,
  gap = 5,
  chakras = true,
  className = '',
  ...props
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gapClasses = {
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={`
        grid
        ${colClasses[columns]}
        ${gapClasses[gap]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// QUANTUM MODAL - Deep Glass Overlay
// ============================================================================

export const QuantumModal = ({
  children,
  isOpen,
  onClose,
  chakra = 'crown',
  size = 'md',
  ariaLabel,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }[size];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Quantum Blur */}
      <div
        className={`
          absolute
          inset-0
          ${QuantumParams.blur.quantum}
          ${QuantumParams.opacity.fog}
          bg-black/30 dark:bg-black/50
          cursor-pointer
          ${QuantumParams.transition.quantum}
        `}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Modal Panel - Deep Quantum Glass */}
      <QuantumGlassPanel
        chakra={chakra}
        depth="deep"
        className={`
          relative
          z-10
          w-full
          ${sizeClasses}
          ${QuantumParams.shadow.quantum}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        {...props}
      >
        <button
          onClick={onClose}
          className={`
            absolute
            top-4
            right-4
            z-20
            text-2xl
            ${chakraConfig.text}
            hover:opacity-60
            transition-opacity
            duration-200
            focus:outline-none
            focus:ring-2
            ${chakraConfig.border}
          `}
          aria-label="Close modal"
        >
          ✕
        </button>

        {children}
      </QuantumGlassPanel>
    </div>
  );
};

// ============================================================================
// QUANTUM SECTION - Full-Width Energy Band
// ============================================================================

export const QuantumSection = ({
  children,
  chakra = 'heart',
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];

  return (
    <section
      className={`
        w-full
        py-12
        px-6
        relative
        overflow-hidden
        ${QuantumParams.blur.medium}
        ${QuantumParams.opacity.mist}
        ${chakraConfig.bg}
        border-y
        ${QuantumParams.border.mist}
        ${chakraConfig.border}
        ${QuantumParams.shadow.medium}
        bg-gradient-to-br
        from-transparent
        to-transparent
        ${className}
      `}
      {...props}
    >
      {/* Background Glow */}
      <div className={`
        absolute
        inset-0
        bg-gradient-to-br
        ${chakraConfig.glow}
        opacity-20
        blur-3xl
        pointer-events-none
        -z-10
      `} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

// ============================================================================
// EXPORT - Quantum Theme Package
// ============================================================================

const QuantumGlassTheme = {
  QuantumParams,
  QuantumCard,
  QuantumGlassPanel,
  QuantumEnergyButton,
  QuantumMetricCard,
  QuantumChakraSpectrum,
  QuantumGlassGrid,
  QuantumModal,
  QuantumSection,
};

export default QuantumGlassTheme;
