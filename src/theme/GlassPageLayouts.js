/**
 * Page Transition & Layout Wrapper Components
 * Provides smooth page transitions and consistent layouts
 */

import React, { useEffect } from 'react';

/**
 * PageTransition - Wraps pages with smooth entrance animation
 * Automatically triggers on mount and when pathname changes
 */
export const PageTransition = ({ 
  children, 
  direction = 'in',
  delay = 0,
  className = ''
}) => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const animationClasses = {
    in: 'animate-fade-in',
    up: 'animate-slide-in-bottom',
    down: 'animate-slide-in-top',
  };

  return (
    <div 
      className={`
        ${animationClasses[direction]}
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * GlassPageHeader - Consistent page header with glassmorphism
 * Used at top of all pages
 */
export const GlassPageHeader = ({ 
  title,
  subtitle,
  icon,
  actions,
  breadcrumbs,
  className = ''
}) => {
  return (
    <header className={`
      bg-gradient-to-br from-slate-50 via-white to-slate-50
      dark:from-gray-950 dark:via-gray-900 dark:to-slate-950
      p-4 md:p-8
      border-b border-white/20 dark:border-gray-700/50
      backdrop-blur-md
      ${className}
    `}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="mb-4 text-sm" aria-label="Breadcrumb">
            <ol className="flex gap-2 text-slate-600 dark:text-slate-400">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  <a 
                    href={crumb.href}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {icon && <span className="text-4xl mt-1">{icon}</span>}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * GlassPageContainer - Standard page wrapper with max-width
 * Provides consistent padding and max-width
 */
export const GlassPageContainer = ({ 
  children,
  maxWidth = '7xl',
  padding = 'p-4 md:p-8',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`${padding} mx-auto ${maxWidthClasses[maxWidth] || maxWidthClasses['7xl']} ${className}`}>
      {children}
    </div>
  );
};

/**
 * GlassSection - Grouped content section
 * Wrapper for related content within a page
 */
export const GlassSection = ({ 
  title,
  subtitle,
  children,
  className = '',
  elevation = 'md'
}) => {
  const elevations = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-lg dark:shadow-xl',
    lg: 'shadow-xl dark:shadow-2xl',
    xl: 'shadow-2xl dark:shadow-2xl',
  };

  return (
    <section className={`
      bg-white/30 dark:bg-gray-900/50
      backdrop-blur-md
      border border-white/20 dark:border-gray-700/50
      rounded-2xl
      p-6 md:p-8
      ${elevations[elevation]}
      transition-all duration-300
      hover:shadow-lg dark:hover:shadow-xl
      ${className}
    `}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </section>
  );
};

/**
 * GlassGrid - Responsive grid layout
 * Automatically responsive with gap handling
 */
export const GlassGrid = ({ 
  children,
  cols = 1,
  colsMd = 2,
  colsLg = 3,
  gap = 6,
  className = ''
}) => {
  const gapClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={`
      grid
      grid-cols-${cols}
      md:grid-cols-${colsMd}
      lg:grid-cols-${colsLg}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * GlassEmptyState - Empty state placeholder
 * Shows when no data is available
 */
export const GlassEmptyState = ({ 
  icon = '📦',
  title = 'No data',
  message = 'There is nothing here yet',
  action,
  className = ''
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center gap-4
      py-12 px-6
      text-center
      ${className}
    `}>
      <div className="text-6xl">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-sm">
        {message}
      </p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * GlassPageLayout - Complete page layout component
 * Combines header, container, and transition
 */
export const GlassPageLayout = ({ 
  title,
  subtitle,
  icon,
  children,
  actions,
  breadcrumbs,
  transitionDelay = 0,
  className = ''
}) => {
  return (
    <PageTransition direction="up" delay={transitionDelay}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
        <GlassPageHeader 
          title={title}
          subtitle={subtitle}
          icon={icon}
          actions={actions}
          breadcrumbs={breadcrumbs}
        />
        
        <GlassPageContainer className={className}>
          {children}
        </GlassPageContainer>
      </div>
    </PageTransition>
  );
};

/**
 * GlassTabs - Tab navigation wrapper
 * Managed state for tab selection
 */
export const GlassTabs = ({ 
  tabs,
  defaultTab = 0,
  onChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div className={className}>
      {/* Tab buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/20 dark:border-gray-700/50">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(i)}
            className={`
              px-5 py-2 rounded-t-lg font-semibold text-sm whitespace-nowrap
              transition-all duration-300
              ${activeTab === i
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                : 'bg-white/20 dark:bg-gray-800/20 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-gray-800/30'
              }
            `}
            aria-selected={activeTab === i}
            role="tab"
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 animate-fade-in">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

const GlassPageLayouts = {
  PageTransition,
  GlassPageHeader,
  GlassPageContainer,
  GlassSection,
  GlassGrid,
  GlassEmptyState,
  GlassPageLayout,
  GlassTabs,
};

export default GlassPageLayouts;
