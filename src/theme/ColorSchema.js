/**
 * Semantic Color Schema
 * Groups pages by domain, each with Chakra color palette
 * Includes light/dark variants with WCAG AA contrast compliance
 */

const ColorSchema = {
  // ===== WATER SYSTEMS =====
  water: {
    primary: 'blue',
    secondary: 'cyan',
    accent: 'teal',
    pages: ['/water', '/water-recycling-monitor', '/aquatic-life-database'],
    description: 'Water management & aquatic systems',
    gradient: 'linear(to-br, blue.50, cyan.50)', // light
    gradientDark: 'linear(to-br, blue.900, cyan.900)', // dark
    brandColor: { light: 'blue.600', dark: 'blue.300' },
    accentColor: { light: 'cyan.500', dark: 'cyan.400' }
  },

  // ===== FOOD & AGRICULTURE =====
  food: {
    primary: 'green',
    secondary: 'lime',
    accent: 'emerald',
    pages: ['/food', '/harvest-forecast', '/nutrition-optimization', '/seed-bank', '/pest-management'],
    description: 'Food production & agricultural optimization',
    gradient: 'linear(to-br, green.50, emerald.50)',
    gradientDark: 'linear(to-br, green.900, emerald.900)',
    brandColor: { light: 'green.600', dark: 'green.300' },
    accentColor: { light: 'emerald.500', dark: 'emerald.400' }
  },

  // ===== ENERGY SYSTEMS =====
  energy: {
    primary: 'yellow',
    secondary: 'orange',
    accent: 'amber',
    pages: ['/energy', '/predictions', '/iot'],
    description: 'Energy production & management',
    gradient: 'linear(to-br, yellow.50, orange.50)',
    gradientDark: 'linear(to-br, yellow.900, orange.900)',
    brandColor: { light: 'orange.600', dark: 'yellow.300' },
    accentColor: { light: 'amber.500', dark: 'amber.400' }
  },

  // ===== HOUSING & INFRASTRUCTURE =====
  housing: {
    primary: 'orange',
    secondary: 'red',
    accent: 'pink',
    pages: ['/expansion', '/community-capacity', '/resilience'],
    description: 'Housing & community infrastructure',
    gradient: 'linear(to-br, orange.50, red.50)',
    gradientDark: 'linear(to-br, orange.900, red.900)',
    brandColor: { light: 'orange.600', dark: 'orange.300' },
    accentColor: { light: 'red.500', dark: 'pink.400' }
  },

  // ===== RISK & EMERGENCY =====
  risk: {
    primary: 'red',
    secondary: 'pink',
    accent: 'crimson',
    pages: ['/alert-center', '/emergency-preparedness'],
    description: 'Risk management & emergency response',
    gradient: 'linear(to-br, red.50, pink.50)',
    gradientDark: 'linear(to-br, red.900, pink.900)',
    brandColor: { light: 'red.600', dark: 'red.300' },
    accentColor: { light: 'pink.500', dark: 'pink.400' }
  },

  // ===== GOVERNANCE & COMMUNITY =====
  governance: {
    primary: 'purple',
    secondary: 'violet',
    accent: 'fuchsia',
    pages: ['/governance', '/global-network', '/community-network', '/marketplace'],
    description: 'Community governance & collaboration',
    gradient: 'linear(to-br, purple.50, violet.50)',
    gradientDark: 'linear(to-br, purple.900, violet.900)',
    brandColor: { light: 'purple.600', dark: 'purple.300' },
    accentColor: { light: 'fuchsia.500', dark: 'fuchsia.400' }
  },

  // ===== ANALYTICS & INSIGHTS =====
  analytics: {
    primary: 'indigo',
    secondary: 'blue',
    accent: 'cyan',
    pages: ['/impact-tracking', '/impact-benchmarks', '/predictions', '/system-dashboard'],
    description: 'Analytics & predictive insights',
    gradient: 'linear(to-br, indigo.50, blue.50)',
    gradientDark: 'linear(to-br, indigo.900, blue.900)',
    brandColor: { light: 'indigo.600', dark: 'indigo.300' },
    accentColor: { light: 'cyan.500', dark: 'cyan.400' }
  },

  // ===== SYSTEM & ADMIN =====
  system: {
    primary: 'gray',
    secondary: 'slate',
    accent: 'zinc',
    pages: ['/home', '/settings', '/autopilot-mode', '/setup-wizard', '/dashboard', '/login'],
    description: 'System administration & core functions',
    gradient: 'linear(to-br, gray.50, slate.50)',
    gradientDark: 'linear(to-br, gray.800, slate.900)',
    brandColor: { light: 'gray.700', dark: 'gray.300' },
    accentColor: { light: 'slate.600', dark: 'slate.400' }
  },

  // ===== INNOVATION & TECH =====
  tech: {
    primary: 'teal',
    secondary: 'cyan',
    accent: 'blue',
    pages: ['/plugin-marketplace', '/knowledge-base', '/inventory'],
    description: 'Technology & innovation',
    gradient: 'linear(to-br, teal.50, cyan.50)',
    gradientDark: 'linear(to-br, teal.900, cyan.900)',
    brandColor: { light: 'teal.600', dark: 'teal.300' },
    accentColor: { light: 'cyan.500', dark: 'cyan.400' }
  },

  // ===== WELLNESS & COMMUNITY =====
  wellness: {
    primary: 'pink',
    secondary: 'rose',
    accent: 'fuchsia',
    pages: ['/wellness', '/community-initiatives'],
    description: 'Community wellness & wellbeing',
    gradient: 'linear(to-br, pink.50, rose.50)',
    gradientDark: 'linear(to-br, pink.900, rose.900)',
    brandColor: { light: 'pink.600', dark: 'pink.300' },
    accentColor: { light: 'rose.500', dark: 'fuchsia.400' }
  }
};

/**
 * Get theme for a specific page/route
 * @param {string} pathname - Current route pathname
 * @returns {object} Theme configuration
 */
export const getThemeForPage = (pathname) => {
  for (const [key, theme] of Object.entries(ColorSchema)) {
    if (theme.pages.some(page => pathname.startsWith(page))) {
      return { key, ...theme };
    }
  }
  // Default to system theme
  return { key: 'system', ...ColorSchema.system };
};

/**
 * Get all theme keys for iteration
 */
export const getAllThemeKeys = () => Object.keys(ColorSchema);

/**
 * Get color for specific use case within a theme
 */
export const getColorForUsage = (theme, usage, mode = 'light') => {
  const colorMap = {
    brand: theme.brandColor[mode],
    primary: `${theme.primary}.${mode === 'light' ? 600 : 300}`,
    secondary: `${theme.secondary}.${mode === 'light' ? 500 : 400}`,
    accent: `${theme.accent}.${mode === 'light' ? 500 : 400}`,
    background: mode === 'light' ? theme.gradient : theme.gradientDark,
    text: mode === 'light' ? 'gray.900' : 'gray.50',
    textMuted: mode === 'light' ? 'gray.600' : 'gray.400',
    border: mode === 'light' ? `${theme.primary}.100` : `${theme.primary}.800`,
    hover: mode === 'light' ? `${theme.primary}.50` : `${theme.primary}.900`
  };
  
  return colorMap[usage] || colorMap.brand;
};

export default ColorSchema;
