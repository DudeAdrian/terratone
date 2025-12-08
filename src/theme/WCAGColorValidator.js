/**
 * WCAG Color Contrast Validator
 * Validates all colors against WCAG AA (4.5:1 for text, 3:1 for graphics)
 * and WCAG AAA (7:1 for text, 4.5:1 for graphics) standards
 */

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate relative luminance (WCAG formula)
 */
const getLuminance = (rgb) => {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two colors
 * Returns ratio as number (e.g., 4.5 for 4.5:1)
 */
export const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return null;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG standard
 * @param {number} ratio - Contrast ratio (e.g., 4.5)
 * @param {string} level - 'AA' or 'AAA'
 * @param {string} type - 'text' or 'graphics'
 */
export const meetsWCAGStandard = (ratio, level = 'AA', type = 'text') => {
  const standards = {
    AA: { text: 4.5, graphics: 3 },
    AAA: { text: 7, graphics: 4.5 }
  };
  
  return ratio >= standards[level][type];
};

/**
 * Validate text color against background
 */
export const validateTextContrast = (textColor, bgColor, level = 'AA') => {
  const ratio = getContrastRatio(textColor, bgColor);
  const passes = meetsWCAGStandard(ratio, level, 'text');
  
  return {
    passes,
    ratio: ratio ? ratio.toFixed(2) : null,
    level,
    required: level === 'AA' ? '4.5:1' : '7:1',
    status: passes ? '✓ PASS' : '✗ FAIL'
  };
};

/**
 * Validate all colors in ColorSchema
 */
export const validateColorSchema = (colorSchema) => {
  const results = {};
  const issues = [];
  
  Object.entries(colorSchema).forEach(([domainKey, domainConfig]) => {
    results[domainKey] = {
      domain: domainKey,
      lightMode: {},
      darkMode: {},
      issues: []
    };
    
    // Validate light mode colors
    const lightBg = '#FFFFFF';
    const lightText = domainConfig.brandColor?.light || domainConfig.primary;
    
    const lightContrast = validateTextContrast(lightText, lightBg, 'AA');
    results[domainKey].lightMode = {
      foreground: lightText,
      background: lightBg,
      contrast: lightContrast
    };
    
    if (!lightContrast.passes) {
      results[domainKey].issues.push(
        `Light mode: Text color ${lightText} on white fails AA (${lightContrast.ratio}:1, need 4.5:1)`
      );
      issues.push({
        domain: domainKey,
        mode: 'light',
        issue: `Insufficient contrast: ${lightContrast.ratio}:1`
      });
    }
    
    // Validate dark mode colors
    const darkBg = '#000000';
    const darkText = domainConfig.brandColor?.dark || domainConfig.primary;
    
    const darkContrast = validateTextContrast(darkText, darkBg, 'AA');
    results[domainKey].darkMode = {
      foreground: darkText,
      background: darkBg,
      contrast: darkContrast
    };
    
    if (!darkContrast.passes) {
      results[domainKey].issues.push(
        `Dark mode: Text color ${darkText} on black fails AA (${darkContrast.ratio}:1, need 4.5:1)`
      );
      issues.push({
        domain: domainKey,
        mode: 'dark',
        issue: `Insufficient contrast: ${darkContrast.ratio}:1`
      });
    }
  });
  
  return { results, issues, allPass: issues.length === 0 };
};

/**
 * Accessibility report for console
 */
export const generateAccessibilityReport = (colorSchema) => {
  const { results, issues, allPass } = validateColorSchema(colorSchema);
  
  console.group('🔍 WCAG Color Contrast Validation Report');
  
  if (allPass) {
    console.log('✅ All colors pass WCAG AA standard (4.5:1 for text)');
  } else {
    console.error(`❌ ${issues.length} color contrast issues found:`);
    issues.forEach(issue => {
      console.error(`   [${issue.domain} - ${issue.mode}] ${issue.issue}`);
    });
  }
  
  console.table(Object.values(results).map(r => ({
    Domain: r.domain,
    'Light Contrast': r.lightMode.contrast.ratio,
    'Light Status': r.lightMode.contrast.status,
    'Dark Contrast': r.darkMode.contrast.ratio,
    'Dark Status': r.darkMode.contrast.status
  })));
  
  console.groupEnd();
  
  return { results, issues, allPass };
};

/**
 * Get WCAG level string
 */
export const getWCAGLevel = (ratio) => {
  if (ratio >= 7) return 'AAA (7:1)';
  if (ratio >= 4.5) return 'AA (4.5:1)';
  return 'Fail';
};

export default {
  getContrastRatio,
  meetsWCAGStandard,
  validateTextContrast,
  validateColorSchema,
  generateAccessibilityReport,
  getWCAGLevel
};
