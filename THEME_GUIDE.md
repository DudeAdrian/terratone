# Glassmorphism Theme Enhancement Guide

## Overview

The Sofie Systems UI now includes comprehensive glassmorphic component system with advanced animations, micro-interactions, and accessibility features.

## Theme Files Structure

```
src/theme/
├── GlassmorphismTheme.js      (Core components)
├── GlassThemeUtilities.js     (Utility constants & helpers)
├── GlassLoadingStates.js      (Loading animations & skeletons)
├── GlassPageLayouts.js        (Layout wrappers & transitions)
└── ColorSchema.js             (WCAG compliance colors)
```

## Core Components

### From GlassThemeUtilities.js

**Color Palettes**
```javascript
import { GLASS_COLORS, getGlassColorScheme } from '../theme/GlassThemeUtilities';

// Use semantic color schemes
const scheme = getGlassColorScheme('success'); // or 'warning', 'danger', 'info'
```

**Animation Utilities**
```javascript
import { 
  GLASS_TRANSITIONS,
  GLASS_HOVER_EFFECTS,
  GLASS_SHADOWS 
} from '../theme/GlassThemeUtilities';

// Smooth transition with preset durations
className={`${GLASS_TRANSITIONS.smooth}`}

// Hover effect with lift animation
className={`${GLASS_HOVER_EFFECTS.lift}`}
```

### From GlassLoadingStates.js

**Loading Spinner**
```javascript
import { GlassLoadingSpinner } from '../theme/GlassLoadingStates';

<GlassLoadingSpinner 
  size="md" 
  color="blue"
  message="Loading..." 
/>
```

**Skeleton Loader**
```javascript
import { GlassSkeletonLoader } from '../theme/GlassLoadingStates';

<GlassSkeletonLoader 
  count={3} 
  type="card" 
/>
```

**Progress Bar**
```javascript
import { GlassProgressBar } from '../theme/GlassLoadingStates';

<GlassProgressBar 
  progress={65}
  color="green"
  showLabel
  animated
/>
```

**Loading Overlay**
```javascript
import { GlassLoadingOverlay } from '../theme/GlassLoadingStates';

<GlassLoadingOverlay 
  isVisible={loading}
  message="Processing your request..."
  spinner
/>
```

### From GlassPageLayouts.js

**Page Transition**
```javascript
import { PageTransition } from '../theme/GlassPageLayouts';

<PageTransition direction="up" delay={100}>
  {children}
</PageTransition>
```

**Page Layout**
```javascript
import { GlassPageLayout } from '../theme/GlassPageLayouts';

<GlassPageLayout
  title="Dashboard"
  subtitle="Welcome back"
  icon="📊"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' }
  ]}
>
  {/* Page content */}
</GlassPageLayout>
```

**Grid Layout**
```javascript
import { GlassGrid } from '../theme/GlassPageLayouts';

<GlassGrid cols={1} colsMd={2} colsLg={3} gap={6}>
  {/* Grid items */}
</GlassGrid>
```

**Empty State**
```javascript
import { GlassEmptyState } from '../theme/GlassPageLayouts';

<GlassEmptyState
  icon="📦"
  title="No Data"
  message="No items found"
  action={<button>Create New</button>}
/>
```

**Tab Navigation**
```javascript
import { GlassTabs } from '../theme/GlassPageLayouts';

<GlassTabs
  tabs={[
    { label: 'Overview', icon: '📊', content: <Overview /> },
    { label: 'Details', icon: '📝', content: <Details /> }
  ]}
  onChange={(index) => console.log(index)}
/>
```

## Animation Classes

### Available Animations

| Class | Effect | Duration |
|-------|--------|----------|
| `animate-shimmer` | Shimmer loading effect | 2s loop |
| `animate-pulse-glow` | Pulsing glow effect | 2s loop |
| `animate-slide-in-bottom` | Slide up from bottom | 500ms |
| `animate-slide-in-top` | Slide down from top | 500ms |
| `animate-fade-in` | Fade in | 300ms |
| `animate-expand` | Scale + fade in | 300ms |
| `animate-gradient-shift` | Gradient animation | 3s loop |
| `animate-float` | Floating effect | 3s loop |
| `animate-glow-pulse` | Glowing pulse | 2s loop |

## Color Scheme Examples

### Success (Green)
```javascript
<GlassCard className={`
  ${GLASS_COLORS.success.glass}
  ${GLASS_COLORS.success.border}
  ${GLASS_COLORS.success.text}
`}>
  ✓ Operation successful
</GlassCard>
```

### Warning (Amber)
```javascript
<GlassCard className={`
  ${GLASS_COLORS.warning.glass}
  ${GLASS_COLORS.warning.border}
  ${GLASS_COLORS.warning.text}
`}>
  ⚠ Warning message
</GlassCard>
```

## Responsive Classes

```javascript
import { RESPONSIVE_CLASSES } from '../theme/GlassThemeUtilities';

// Show only on mobile
<div className={RESPONSIVE_CLASSES.mobile}>Mobile View</div>

// Show only on tablet
<div className={RESPONSIVE_CLASSES.tablet}>Tablet View</div>

// Show only on desktop
<div className={RESPONSIVE_CLASSES.desktop}>Desktop View</div>

// Touch target (48px minimum)
<button className={RESPONSIVE_CLASSES.touchTarget}>Touch Me</button>
```

## Accessibility Features

### Focus States
```javascript
import { GLASS_FOCUS_STATES } from '../theme/GlassThemeUtilities';

<button className={`
  px-4 py-2 rounded-lg
  ${GLASS_FOCUS_STATES.outline}
`}>
  Accessible Button
</button>
```

### Screen Reader Only Content
```javascript
import { A11Y_HELPERS } from '../theme/GlassThemeUtilities';

<span className={A11Y_HELPERS.srOnly}>
  Screen reader only text
</span>
```

### Skip Link
```javascript
<a href="#main" className={A11Y_HELPERS.skipLink}>
  Skip to main content
</a>
```

## Dark Mode Support

All components automatically support dark mode through Tailwind's `dark:` prefix.

```javascript
// Example: Text color changes based on theme
className="text-slate-900 dark:text-white"

// Glass effect adapts to dark mode
className="bg-white/30 dark:bg-gray-900/50"
```

## Performance Optimization

### Reduced Motion
The CSS includes support for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled for accessibility */
}
```

### Touch Device Optimization
- Minimum touch target: 48px (WCAG recommendation)
- Optimized spacing for touch interaction
- Haptic feedback ready (can be added)

## Examples by Page Type

### Landing Page
```javascript
<GlassPageLayout title="Welcome" icon="🏠">
  <GlassSection title="Features">
    <GlassGrid cols={1} colsMd={2} gap={6}>
      {/* Feature cards */}
    </GlassGrid>
  </GlassSection>
</GlassPageLayout>
```

### Dashboard
```javascript
<GlassPageLayout title="Dashboard" icon="📊">
  <GlassTabs tabs={dashboardTabs} />
  <GlassGrid cols={1} colsMd={2} colsLg={4}>
    {/* Metric cards */}
  </GlassGrid>
</GlassPageLayout>
```

### Loading States
```javascript
// While data loads
{isLoading ? (
  <GlassLoadingSpinner message="Fetching data..." />
) : (
  // Content
)}

// Skeleton while loading
{isLoading && <GlassSkeletonLoader count={3} type="card" />}

// Full-screen overlay
<GlassLoadingOverlay isVisible={globalLoading} />
```

## Migration Guide

### Updating Existing Pages

1. **Add imports**
   ```javascript
   import { GlassPageLayout, GlassSection } from '../theme/GlassPageLayouts';
   import { GLASS_TRANSITIONS, GLASS_COLORS } from '../theme/GlassThemeUtilities';
   ```

2. **Wrap with PageLayout**
   ```javascript
   // Old
   <div className="p-8">
     <h1>Title</h1>
     {content}
   </div>

   // New
   <GlassPageLayout title="Title">
     {content}
   </GlassPageLayout>
   ```

3. **Use component utilities**
   ```javascript
   // Old
   <div className="grid grid-cols-2 gap-4">

   // New
   <GlassGrid cols={1} colsMd={2} gap={4}>
   ```

## CSS Custom Properties (Optional)

For advanced customization, these variables are available:

```css
:root {
  --glass-blur: 12px;
  --glass-radius: 12px;
  --glass-opacity: 0.3;
  --animation-fast: 150ms;
  --animation-normal: 300ms;
}
```

## Browser Support

- ✅ Chrome/Edge 85+
- ✅ Firefox 85+
- ✅ Safari 15+
- ✅ Mobile browsers with backdrop-filter support

## Troubleshooting

### Animations not showing
- Ensure `@tailwind utilities` is in your CSS
- Check that Tailwind config includes animation extensions
- Verify browser supports CSS animations

### Glass effect not visible
- Ensure content has proper z-index
- Check backdrop-filter browser support
- Dark mode might require color adjustments

### Focus states not working
- Add `focus:ring-2 focus:ring-blue-500` to interactive elements
- Test with keyboard navigation (Tab key)
- Check `GLASS_FOCUS_STATES` utility classes

## Performance Tips

1. **Use skeletons while loading** - Better perceived performance
2. **Lazy load images** - Especially in grids
3. **Debounce animations** - For resize/scroll events
4. **Use CSS animations** - Prefer CSS over JS animations
5. **Minimize Tailwind classes** - Use utility combinations efficiently

## Future Enhancements

- [ ] Haptic feedback support (mobile)
- [ ] Custom color scheme builder
- [ ] Animation preference detection
- [ ] Component storybook
- [ ] Figma design tokens
- [ ] Advanced transitions (page swipe)

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintainer:** Sofie Systems Team
