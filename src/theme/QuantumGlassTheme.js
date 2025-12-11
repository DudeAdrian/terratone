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

  // Transparency Spectrum - Wave function collapse (ENHANCED: Frosted glass like holographic panel)
  opacity: {
    crystal: 'bg-white/8 dark:bg-white/8',        // 8% - Frosted glass base
    ultraClear: 'bg-white/12 dark:bg-white/10',   // 12% - Light frosted
    quantum: 'bg-white/15 dark:bg-white/12',      // 15% - Medium frosted
    ethereal: 'bg-white/18 dark:bg-white/15',     // 18% - Visible frosted
    veil: 'bg-white/22 dark:bg-white/18',         // 22% - Strong frosted
    mist: 'bg-white/25 dark:bg-white/20',         // 25% - Deep frosted
    fog: 'bg-white/30 dark:bg-white/25',          // 30% - Opaque frosted
    haze: 'bg-white/35 dark:bg-white/30',         // 35% - Solid frosted
    cloud: 'bg-white/40 dark:bg-white/35',        // 40% - Very opaque
    dense: 'bg-white/50 dark:bg-white/45',        // 50% - Almost solid
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

  // Edge Halos - NEON Color-shifted borders with quantum glow (VIBRANT)
  edgeHalo: {
    root: 'shadow-[0_0_40px_rgba(255,0,85,0.6),0_0_80px_rgba(255,0,85,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    sacral: 'shadow-[0_0_40px_rgba(255,170,0,0.6),0_0_80px_rgba(255,170,0,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    solar: 'shadow-[0_0_40px_rgba(255,200,50,0.6),0_0_80px_rgba(255,200,50,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    heart: 'shadow-[0_0_40px_rgba(0,255,136,0.6),0_0_80px_rgba(0,255,136,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    throat: 'shadow-[0_0_40px_rgba(0,187,255,0.6),0_0_80px_rgba(0,187,255,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    third_eye: 'shadow-[0_0_40px_rgba(170,76,255,0.6),0_0_80px_rgba(170,76,255,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    crown: 'shadow-[0_0_40px_rgba(255,0,170,0.6),0_0_80px_rgba(255,0,170,0.3),0_4px_20px_rgba(0,0,0,0.3)]',
    // HOLOGRAPHIC PANEL STYLE - Warm golden glow like the image
    holographic: 'shadow-[0_0_60px_rgba(255,200,100,0.7),0_0_100px_rgba(255,170,70,0.4),0_8px_30px_rgba(0,0,0,0.4)]',
  },

  // NEON Chakra Colors - Vibrant energy center alignment with enhanced glow
  chakra: {
    root: {
      bg: 'bg-red-600/30',
      text: 'text-red-400 dark:text-red-200',
      border: 'border-red-500/60',
      glow: 'from-red-500/50 to-red-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-red-500/80 from-red-500/40',
      neonGlow: 'glow-red-500',
      hex: '#FF0055',
    },
    sacral: {
      bg: 'bg-orange-600/30',
      text: 'text-orange-400 dark:text-orange-200',
      border: 'border-orange-500/60',
      glow: 'from-orange-500/50 to-orange-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-orange-500/80 from-orange-500/40',
      neonGlow: 'glow-orange-500',
      hex: '#FF6600',
    },
    solar: {
      bg: 'bg-yellow-500/30',
      text: 'text-yellow-300 dark:text-yellow-200',
      border: 'border-yellow-400/60',
      glow: 'from-yellow-400/50 to-yellow-300/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-yellow-400/80 from-yellow-400/40',
      neonGlow: 'glow-yellow-400',
      hex: '#FFFF00',
    },
    heart: {
      bg: 'bg-emerald-500/30',
      text: 'text-emerald-300 dark:text-emerald-200',
      border: 'border-emerald-400/60',
      glow: 'from-emerald-400/50 to-emerald-300/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-emerald-400/80 from-emerald-400/40',
      neonGlow: 'glow-emerald-400',
      hex: '#00FF88',
    },
    throat: {
      bg: 'bg-cyan-500/30',
      text: 'text-cyan-300 dark:text-cyan-200',
      border: 'border-cyan-400/60',
      glow: 'from-cyan-400/50 to-cyan-300/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-cyan-400/80 from-cyan-400/40',
      neonGlow: 'glow-cyan-400',
      hex: '#00BBFF',
    },
    third_eye: {
      bg: 'bg-violet-600/30',
      text: 'text-violet-300 dark:text-violet-200',
      border: 'border-violet-500/60',
      glow: 'from-violet-500/50 to-violet-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-violet-500/80 from-violet-500/40',
      neonGlow: 'glow-violet-500',
      hex: '#AA4CFF',
    },
    crown: {
      bg: 'bg-pink-600/30',
      text: 'text-pink-300 dark:text-pink-200',
      border: 'border-pink-500/60',
      glow: 'from-pink-500/50 to-pink-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-pink-500/80 from-pink-500/40',
      neonGlow: 'glow-pink-500',
      hex: '#FF00AA',
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
// HOLOGRAPHIC PANEL - Matches the golden glowing touch panel aesthetic
// ============================================================================

export const HolographicCard = ({
  children,
  className = '',
  interactive = true,
  glowColor = 'amber', // amber, emerald, cyan, violet
  style,
  ...props
}) => {
  const glowColors = {
    amber: {
      shadow: 'shadow-[0_10px_50px_rgba(251,191,36,0.45),0_0_80px_rgba(245,158,11,0.35),0_12px_40px_rgba(0,0,0,0.45)]',
      border: 'border-amber-100/50',
      panelSurface: 'bg-gradient-to-br from-[#fef9f3]/75 via-white/68 to-[#fff7e6]/78',
      background:
        'radial-gradient(circle at 18% 22%, rgba(255,214,130,0.18), rgba(255,214,130,0) 32%),\
         radial-gradient(circle at 82% 8%, rgba(255,171,94,0.14), rgba(255,171,94,0) 30%),\
         linear-gradient(135deg, #fff8e5 0%, #fbead1 42%, #f7d7a6 100%)',
      glow: 'from-amber-300/60 via-amber-200/40 to-orange-300/25',
      hoverGlow: 'hover:shadow-[0_14px_70px_rgba(251,191,36,0.7),0_0_120px_rgba(245,158,11,0.5),0_18px_50px_rgba(0,0,0,0.55)]',
      edge: 'from-white/55 via-amber-200/40 to-white/20',
    },
    emerald: {
      shadow: 'shadow-[0_10px_50px_rgba(16,185,129,0.45),0_0_80px_rgba(5,150,105,0.35),0_12px_40px_rgba(0,0,0,0.45)]',
      border: 'border-emerald-100/50',
      panelSurface: 'bg-gradient-to-br from-[#f1fbf5]/75 via-white/68 to-[#e6fff4]/78',
      background:
        'radial-gradient(circle at 18% 22%, rgba(120,255,200,0.16), rgba(120,255,200,0) 32%),\
         radial-gradient(circle at 82% 8%, rgba(90,235,190,0.12), rgba(90,235,190,0) 30%),\
         linear-gradient(135deg, #f2fcf6 0%, #e6f9f0 42%, #d7f4e6 100%)',
      glow: 'from-emerald-300/60 via-teal-200/40 to-emerald-200/25',
      hoverGlow: 'hover:shadow-[0_14px_70px_rgba(16,185,129,0.7),0_0_120px_rgba(5,150,105,0.5),0_18px_50px_rgba(0,0,0,0.55)]',
      edge: 'from-white/55 via-emerald-200/40 to-white/20',
    },
    cyan: {
      shadow: 'shadow-[0_10px_50px_rgba(6,182,212,0.45),0_0_80px_rgba(8,145,178,0.35),0_12px_40px_rgba(0,0,0,0.45)]',
      border: 'border-cyan-100/50',
      panelSurface: 'bg-gradient-to-br from-[#f2fbff]/75 via-white/68 to-[#e8f9ff]/78',
      background:
        'radial-gradient(circle at 18% 22%, rgba(160,230,255,0.16), rgba(160,230,255,0) 32%),\
         radial-gradient(circle at 82% 8%, rgba(120,210,255,0.12), rgba(120,210,255,0) 30%),\
         linear-gradient(135deg, #f2fbff 0%, #e8f7ff 42%, #ddf0ff 100%)',
      glow: 'from-cyan-300/60 via-sky-200/40 to-cyan-200/25',
      hoverGlow: 'hover:shadow-[0_14px_70px_rgba(6,182,212,0.7),0_0_120px_rgba(8,145,178,0.5),0_18px_50px_rgba(0,0,0,0.55)]',
      edge: 'from-white/55 via-cyan-200/40 to-white/20',
    },
    violet: {
      shadow: 'shadow-[0_10px_50px_rgba(139,92,246,0.45),0_0_80px_rgba(124,58,237,0.35),0_12px_40px_rgba(0,0,0,0.45)]',
      border: 'border-violet-100/50',
      panelSurface: 'bg-gradient-to-br from-[#f8f5ff]/75 via-white/68 to-[#f0eaff]/78',
      background:
        'radial-gradient(circle at 18% 22%, rgba(208,180,255,0.16), rgba(208,180,255,0) 32%),\
         radial-gradient(circle at 82% 8%, rgba(180,160,255,0.12), rgba(180,160,255,0) 30%),\
         linear-gradient(135deg, #f8f5ff 0%, #f1ebff 42%, #e7dfff 100%)',
      glow: 'from-violet-300/60 via-purple-200/40 to-violet-200/25',
      hoverGlow: 'hover:shadow-[0_14px_70px_rgba(139,92,246,0.7),0_0_120px_rgba(124,58,237,0.5),0_18px_50px_rgba(0,0,0,0.55)]',
      edge: 'from-white/55 via-violet-200/40 to-white/20',
    },
  };

  const colors = glowColors[glowColor] || glowColors.amber;

  return (
    <div
      className={`
        relative
        group
        overflow-hidden
        rounded-3xl
        p-6
        backdrop-blur-[28px]
        border
        ${colors.border}
        ${colors.panelSurface}
        ${colors.shadow}
        ${interactive ? colors.hoverGlow : ''}
        ${interactive ? 'cursor-pointer hover:-translate-y-2' : ''}
        transition-all duration-500 ease-out
        ${className}
      `}
      style={{
        background: colors.background,
        ...style,
      }}
      {...props}
    >
      {/* Backdrop glow aura */}
      <div className={`
        absolute
        -inset-6
        bg-gradient-to-br
        ${colors.glow}
        opacity-0
        group-hover:opacity-45
        blur-3xl
        rounded-[28px]
        transition-opacity duration-500
        pointer-events-none
      `} />

      {/* Glass core */}
      <div className="absolute inset-[1px] rounded-[22px] bg-white/6 border border-white/12 backdrop-blur-[30px]" />

      {/* Inner frame with subtle amber/cyan edge sweep */}
      <div
        className="absolute inset-[8px] rounded-[20px] border border-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),\
             linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0)),\
             linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0))',
        }}
      />

      {/* Grid and etching lines to mimic wall panel circuitry */}
      <div
        className="absolute inset-[10px] rounded-[18px] opacity-60 mix-blend-screen"
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(255,214,130,0.16) 1px, transparent 1px),\
             linear-gradient(90deg, rgba(255,214,130,0.16) 1px, transparent 1px),\
             radial-gradient(circle at 15% 20%, rgba(255,255,255,0.12), transparent 38%),\
             radial-gradient(circle at 85% 8%, rgba(255,255,255,0.08), transparent 32%)',
          backgroundSize: '140px 140px, 140px 140px, 100% 100%, 100% 100%',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      />

      {/* Edge light sweep */}
      <div className={`
        absolute
        inset-0.5
        rounded-[24px]
        bg-gradient-to-tr
        ${colors.edge}
        opacity-70
        pointer-events-none
      `} />

      {/* Top highlight bar */}
      <div className="absolute inset-x-3 top-3 h-0.5 rounded-full bg-white/35 blur-[1px] opacity-70" />

      {/* Fine noise to sell the glass */}
      <div
        className="absolute inset-0 rounded-3xl opacity-[0.18] mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cpath fill=%22%23ffffff%22 fill-opacity=%220.35%22 d=%22M0 38h2v2H0zM38 0h2v2h-2zM18 18h2v2h-2zM28 28h2v2h-2zM8 8h2v2H8z%22/%3E%3C/svg%3E")',
        }}
      />

      {/* Inner content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
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
  HolographicCard, // NEW: Golden glowing panel style
};

export default QuantumGlassTheme;
