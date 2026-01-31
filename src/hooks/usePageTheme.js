/**
 * usePageTheme Hook
 * Auto-applies semantic color theme based on current route
 * Supports light/dark mode with manual/autopilot modes
 */

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getThemeForPage, getColorForUsage } from '../theme/ColorSchema';

/**
 * Main hook for applying page themes
 * @returns {Object} Theme configuration for current page
 */
export const usePageTheme = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // Check dark mode from document class or localStorage
    const isDark = document.documentElement.classList.contains('dark') || 
                   JSON.parse(localStorage.getItem('sofie-dark-mode') || 'false');
    setIsDarkMode(isDark);
    const pageTheme = getThemeForPage(location.pathname);
    setTheme(pageTheme);
  }, [location.pathname]);

  const colorMode = isDarkMode ? 'dark' : 'light';

  return {
    theme,
    colorMode,
    isDarkMode,
    primaryColor: theme?.primary || 'gray',
    secondaryColor: theme?.secondary || 'slate',
    accentColor: theme?.accent || 'zinc',
    brandColor: theme?.brandColor,
    gradient: theme ? (colorMode === 'light' ? theme.gradient : theme.gradientDark) : 'linear(to-br, gray.50, slate.50)',
    getColor: (usage) => theme ? getColorForUsage(theme, usage, colorMode) : getColorForUsage({ primary: 'gray', secondary: 'slate' }, usage, colorMode)
  };
};

/**
 * Get specific color for usage within current theme
 */
export const useThemeColor = (usage = 'brand') => {
  const { getColor } = usePageTheme();
  return getColor(usage);
};

/**
 * Get all colors for a specific usage across all themes
 */
export const useColorByUsage = (usage = 'brand') => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   JSON.parse(localStorage.getItem('sofie-dark-mode') || 'false');
    setIsDarkMode(isDark);
  }, []);

  const theme = getThemeForPage(location.pathname);
  const colorMode = isDarkMode ? 'dark' : 'light';
  
  return getColorForUsage(theme, usage, colorMode);
};

/**
 * Simple hook to get current mode (light/dark)
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('sofie-dark-mode') || 'false');
    }
    return false;
  });

  const toggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sofie-dark-mode', JSON.stringify(newMode));
  };

  return {
    isDark: isDarkMode,
    colorMode: isDarkMode ? 'dark' : 'light',
    toggle
  };
};

export default usePageTheme;
