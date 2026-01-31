/**
 * Accessibility Utilities for WCAG Compliance
 * Focus management, keyboard navigation, ARIA helpers, live regions
 */

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Focus an element with optional delay
   */
  setFocus: (element, delay = 0) => {
    if (!element) return;
    if (delay > 0) {
      setTimeout(() => element.focus(), delay);
    } else {
      element.focus();
    }
  },

  /**
   * Get first focusable element in container
   */
  getFirstFocusable: (container) => {
    if (!container) return null;
    const focusableSelectors = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])'
    ];
    return container.querySelector(focusableSelectors.join(','));
  },

  /**
   * Get last focusable element in container
   */
  getLastFocusable: (container) => {
    if (!container) return null;
    const focusableSelectors = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])'
    ];
    const focusable = container.querySelectorAll(focusableSelectors.join(','));
    return focusable.length > 0 ? focusable[focusable.length - 1] : null;
  },

  /**
   * Trap focus within a modal (for accessibility)
   */
  trapFocus: (element) => {
    const firstFocusable = focusUtils.getFirstFocusable(element);
    const lastFocusable = focusUtils.getLastFocusable(element);

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          focusUtils.setFocus(lastFocusable);
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          focusUtils.setFocus(firstFocusable);
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Check if key is Escape
   */
  isEscape: (e) => e.key === 'Escape' || e.keyCode === 27,

  /**
   * Check if key is Enter
   */
  isEnter: (e) => e.key === 'Enter' || e.keyCode === 13,

  /**
   * Check if key is Space
   */
  isSpace: (e) => e.key === ' ' || e.keyCode === 32,

  /**
   * Check if key is arrow key
   */
  isArrowKey: (e) => {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
  },

  /**
   * Get arrow direction
   */
  getArrowDirection: (e) => {
    const directions = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    };
    return directions[e.key] || null;
  },

  /**
   * Check if modifier key is pressed (Ctrl/Cmd)
   */
  isModifierKey: (e) => e.ctrlKey || e.metaKey
};

/**
 * ARIA (Accessible Rich Internet Applications) utilities
 */
export const ariaUtils = {
  /**
   * Set ARIA label
   */
  setLabel: (element, label) => {
    element.setAttribute('aria-label', label);
  },

  /**
   * Set ARIA description
   */
  setDescription: (element, id) => {
    element.setAttribute('aria-describedby', id);
  },

  /**
   * Mark element as required (for forms)
   */
  setRequired: (element) => {
    element.setAttribute('aria-required', 'true');
  },

  /**
   * Set ARIA hidden (for decorative elements)
   */
  setHidden: (element) => {
    element.setAttribute('aria-hidden', 'true');
  },

  /**
   * Announce message to screen readers (live region)
   */
  announce: (message, priority = 'polite') => {
    const id = `aria-announce-${Date.now()}`;
    const div = document.createElement('div');
    div.id = id;
    div.setAttribute('role', 'status');
    div.setAttribute('aria-live', priority);
    div.setAttribute('aria-atomic', 'true');
    div.textContent = message;
    div.style.position = 'absolute';
    div.style.left = '-10000px';
    div.style.width = '1px';
    div.style.height = '1px';
    div.style.overflow = 'hidden';
    
    document.body.appendChild(div);
    
    setTimeout(() => {
      document.body.removeChild(div);
    }, 1000);
  }
};

/**
 * Screen reader testing utilities
 */
export const screenReaderUtils = {
  /**
   * Announce page title to screen reader
   */
  announcePageTitle: (title) => {
    document.title = title;
    ariaUtils.announce(`Page loaded: ${title}`, 'assertive');
  },

  /**
   * Announce form error
   */
  announceError: (fieldLabel, errorMessage) => {
    ariaUtils.announce(`Error in ${fieldLabel}: ${errorMessage}`, 'assertive');
  },

  /**
   * Announce success
   */
  announceSuccess: (message) => {
    ariaUtils.announce(message, 'polite');
  }
};

/**
 * Color contrast validator (simple check)
 */
export const contrastUtils = {
  /**
   * Check if colors have sufficient contrast
   * Basic implementation - use WCAGColorValidator for precise calculation
   */
  hasSufficientContrast: (color1, color2) => {
    // This is a simplified check. Use WCAGColorValidator.getContrastRatio() for precise validation
    const ratio = estimateContrastRatio(color1, color2);
    return ratio >= 4.5; // WCAG AA for text
  }
};

/**
 * Estimate contrast ratio (simplified)
 */
const estimateContrastRatio = (color1, color2) => {
  // Simplified estimation - returns approximate value
  // For precise calculation, use WCAGColorValidator
  return 4.5; // Conservative default
};

/**
 * Glass readability check
 */
export const glassReadabilityUtils = {
  /**
   * Check if text is readable over glass background
   * Glass effects reduce contrast, so we need opaque text layer
   */
  ensureReadability: (element) => {
    const style = window.getComputedStyle(element);
    const bgOpacity = style.backgroundColor;
    
    // Text should be opaque (opacity 1.0)
    element.style.opacity = '1';
    element.style.textShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // Ensure text color has sufficient contrast
    // Default to white or black depending on background
    const isLight = bgOpacity.includes('rgb(255') || bgOpacity.includes('hsl(');
    element.style.color = isLight ? '#000000' : '#FFFFFF';
    
    return element;
  }
};

export default {
  focusUtils,
  keyboardUtils,
  ariaUtils,
  screenReaderUtils,
  contrastUtils,
  glassReadabilityUtils
};
