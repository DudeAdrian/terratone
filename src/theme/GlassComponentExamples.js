/**
 * Example: Best Practices for Using Glassmorphism Theme
 * Copy patterns from this file when building new pages
 */

import React, { useState } from 'react';
import { GlassPageLayout, GlassSection, GlassGrid, GlassTabs, GlassEmptyState } from '../theme/GlassPageLayouts';
import { GlassCard } from '../theme/GlassmorphismTheme';
import { GlassLoadingSpinner, GlassProgressBar } from '../theme/GlassLoadingStates';
import { GLASS_TRANSITIONS, GLASS_COLORS, getGlassColorScheme } from '../theme/GlassThemeUtilities';

/**
 * Example 1: Basic Page with Header and Content
 */
export const BasicPageExample = () => {
  return (
    <GlassPageLayout
      title="Example Page"
      subtitle="This is a subtitle describing the page purpose"
      icon="📋"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Example', href: '/example' }
      ]}
    >
      <GlassSection title="Content Section" subtitle="With organized content">
        <p className="text-slate-700 dark:text-slate-300">
          Your page content goes here with automatic styling.
        </p>
      </GlassSection>
    </GlassPageLayout>
  );
};

/**
 * Example 2: Grid Layout with Multiple Items
 */
export const GridLayoutExample = () => {
  const items = [
    { title: 'Item 1', value: '42', icon: '📊' },
    { title: 'Item 2', value: '156', icon: '📈' },
    { title: 'Item 3', value: '89%', icon: '✓' },
    { title: 'Item 4', value: 'Active', icon: '🟢' },
  ];

  return (
    <GlassPageLayout title="Grid Example">
      <GlassGrid cols={1} colsMd={2} colsLg={4} gap={4}>
        {items.map((item) => (
          <GlassCard key={item.title} className={GLASS_TRANSITIONS.smooth}>
            <div className="text-center">
              <div className="text-4xl mb-2">{item.icon}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {item.title}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </GlassCard>
        ))}
      </GlassGrid>
    </GlassPageLayout>
  );
};

/**
 * Example 3: Tab Navigation
 */
export const TabNavigationExample = () => {
  const tabs = [
    {
      label: 'Overview',
      icon: '📊',
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">Overview content</p>
        </div>
      )
    },
    {
      label: 'Settings',
      icon: '⚙️',
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">Settings content</p>
        </div>
      )
    },
    {
      label: 'Advanced',
      icon: '🔬',
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">Advanced content</p>
        </div>
      )
    },
  ];

  return (
    <GlassPageLayout title="Tab Example">
      <GlassTabs tabs={tabs} defaultTab={0} />
    </GlassPageLayout>
  );
};

/**
 * Example 4: Loading States
 */
export const LoadingStateExample = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(35);

  return (
    <GlassPageLayout title="Loading States Example">
      <div className="space-y-8">
        <GlassSection title="Loading Spinner">
          {isLoading && <GlassLoadingSpinner message="Processing..." />}
        </GlassSection>

        <GlassSection title="Progress Bar">
          <GlassProgressBar progress={progress} color="blue" />
        </GlassSection>

        <GlassSection title="Control">
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
          >
            Toggle Loading
          </button>
        </GlassSection>
      </div>
    </GlassPageLayout>
  );
};

/**
 * Example 5: Color Schemes
 */
export const ColorSchemeExample = () => {
  const schemes = ['primary', 'success', 'warning', 'danger', 'info'];

  return (
    <GlassPageLayout title="Color Schemes">
      <GlassGrid cols={1} colsMd={2} colsLg={5} gap={4}>
        {schemes.map((type) => {
          const scheme = getGlassColorScheme(type);
          return (
            <div
              key={type}
              className={`
                p-4 rounded-lg
                ${scheme.glass}
                ${scheme.border}
                ${scheme.text}
                border
                transition-all duration-300
              `}
            >
              <p className="font-bold capitalize">{type}</p>
              <p className="text-sm opacity-75 mt-1">Color scheme example</p>
            </div>
          );
        })}
      </GlassGrid>
    </GlassPageLayout>
  );
};

/**
 * Example 6: Form with Validation
 */
export const FormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <GlassPageLayout title="Form Example">
      <GlassSection title="User Information" subtitle="Enter your details">
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg transition-all"
          >
            Submit
          </button>

          {submitted && (
            <div className="p-4 rounded-lg bg-green-400/20 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20 text-green-900 dark:text-green-300">
              ✓ Form submitted successfully!
            </div>
          )}
        </form>
      </GlassSection>
    </GlassPageLayout>
  );
};

/**
 * Example 7: Empty State
 */
export const EmptyStateExample = () => {
  return (
    <GlassPageLayout title="Empty State Example">
      <GlassEmptyState
        icon="📦"
        title="No Items Found"
        message="Start by creating your first item to see it here"
        action={
          <button className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg transition-all">
            Create Item
          </button>
        }
      />
    </GlassPageLayout>
  );
};

/**
 * Example 8: Complex Dashboard Layout
 */
export const DashboardExample = () => {
  return (
    <GlassPageLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your overview"
      icon="📊"
      actions={
        <button className="px-4 py-2 rounded-lg bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-slate-700/50 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors font-semibold">
          Last 30 Days
        </button>
      }
    >
      {/* Key Metrics */}
      <GlassGrid cols={1} colsMd={2} colsLg={4} gap={4}>
        {[
          { label: 'Revenue', value: '$12,345', icon: '💰' },
          { label: 'Users', value: '1,234', icon: '👥' },
          { label: 'Growth', value: '23%', icon: '📈' },
          { label: 'Status', value: 'Optimal', icon: '✓' },
        ].map((metric) => (
          <GlassCard key={metric.label} className={GLASS_TRANSITIONS.smooth}>
            <div className="text-3xl mb-2">{metric.icon}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {metric.value}
            </p>
          </GlassCard>
        ))}
      </GlassGrid>

      {/* Chart Section */}
      <GlassSection title="Performance" subtitle="Last 30 days" className="mt-8">
        <div className="h-64 bg-white/10 dark:bg-gray-800/10 rounded-lg border border-white/10 dark:border-slate-700/30 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400">Chart component goes here</p>
        </div>
      </GlassSection>

      {/* Activity Section */}
      <GlassSection title="Recent Activity" className="mt-8">
        <div className="space-y-3">
          {['Event 1', 'Event 2', 'Event 3'].map((event) => (
            <div key={event} className="p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 border border-white/10 dark:border-slate-700/30">
              {event}
            </div>
          ))}
        </div>
      </GlassSection>
    </GlassPageLayout>
  );
};

export default {
  BasicPageExample,
  GridLayoutExample,
  TabNavigationExample,
  LoadingStateExample,
  ColorSchemeExample,
  FormExample,
  EmptyStateExample,
  DashboardExample,
};
