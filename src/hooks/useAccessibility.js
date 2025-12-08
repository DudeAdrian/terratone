/**
 * useAccessibility Hook
 * Provides keyboard navigation, focus management, and ARIA support
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  focusUtils,
  keyboardUtils,
  ariaUtils,
  screenReaderUtils
} from '../utils/AccessibilityUtils';

/**
 * Hook for managing focus and keyboard interactions
 * Integrates with WCAG accessibility standards
 */
export const useAccessibility = (options = {}) => {
  const {
    trapFocus = false,
    announceOnMount = null,
    role = 'main'
  } = options;

  const containerRef = useRef(null);

  // Announce page load to screen readers
  useEffect(() => {
    if (announceOnMount) {
      screenReaderUtils.announcePageTitle(announceOnMount);
    }
  }, [announceOnMount]);

  // Set up focus trap for modals/dialogs
  useEffect(() => {
    if (trapFocus && containerRef.current) {
      return focusUtils.trapFocus(containerRef.current);
    }
  }, [trapFocus]);

  // Set role attribute
  useEffect(() => {
    if (containerRef.current && role) {
      containerRef.current.setAttribute('role', role);
    }
  }, [role]);

  return containerRef;
};

/**
 * Hook for handling keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Universal close (Escape)
      if (keyboardUtils.isEscape(e) && shortcuts.onEscape) {
        e.preventDefault();
        shortcuts.onEscape();
      }

      // Universal confirm (Enter)
      if (keyboardUtils.isEnter(e) && shortcuts.onEnter) {
        e.preventDefault();
        shortcuts.onEnter();
      }

      // Custom shortcuts
      Object.entries(shortcuts).forEach(([key, handler]) => {
        if (key.startsWith('on')) return; // Skip built-in handlers
        
        const modifier = key.includes('+') ? key.split('+')[0].toLowerCase() : null;
        const mainKey = key.includes('+') ? key.split('+')[1] : key;

        const isModifierPressed = modifier === 'ctrl' ? e.ctrlKey : modifier === 'shift' ? e.shiftKey : true;
        
        if (e.key.toLowerCase() === mainKey.toLowerCase() && isModifierPressed) {
          e.preventDefault();
          handler();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

/**
 * Hook for managing focus on interactive elements
 */
export const useFocusManagement = (autoFocus = false) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (autoFocus && elementRef.current) {
      focusUtils.setFocus(elementRef.current, 100);
    }
  }, [autoFocus]);

  const setFocus = useCallback(() => {
    if (elementRef.current) {
      focusUtils.setFocus(elementRef.current);
    }
  }, []);

  return { elementRef, setFocus };
};

/**
 * Hook for screen reader announcements
 */
export const useAnnouncement = () => {
  const announce = useCallback((message, priority = 'polite') => {
    ariaUtils.announce(message, priority);
  }, []);

  const announceError = useCallback((fieldLabel, errorMessage) => {
    screenReaderUtils.announceError(fieldLabel, errorMessage);
  }, []);

  const announceSuccess = useCallback((message) => {
    screenReaderUtils.announceSuccess(message);
  }, []);

  return {
    announce,
    announceError,
    announceSuccess
  };
};

/**
 * Hook for ARIA attributes
 */
export const useAriaAttributes = (options = {}) => {
  const getAttributes = useCallback(() => {
    const attrs = {};

    if (options.label) {
      attrs['aria-label'] = options.label;
    }

    if (options.description) {
      attrs['aria-describedby'] = options.description;
    }

    if (options.required) {
      attrs['aria-required'] = 'true';
    }

    if (options.invalid !== undefined) {
      attrs['aria-invalid'] = options.invalid;
    }

    if (options.live) {
      attrs['aria-live'] = options.live;
      attrs['aria-atomic'] = 'true';
    }

    if (options.hidden) {
      attrs['aria-hidden'] = 'true';
    }

    return attrs;
  }, [options]);

  return getAttributes();
};

/**
 * Hook for accessible form field
 */
export const useAccessibleForm = (fieldName, value, isInvalid = false, errorMessage = '') => {
  const { announce, announceError } = useAnnouncement();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isInvalid && errorMessage) {
      announceError(fieldName, errorMessage);
    }
  }, [isInvalid, errorMessage, fieldName, announceError]);

  const attributes = {
    ref: inputRef,
    'aria-label': fieldName,
    'aria-invalid': isInvalid,
    'aria-describedby': isInvalid ? `error-${fieldName}` : undefined,
    'aria-required': true
  };

  return { inputRef, attributes, announce };
};

export default {
  useAccessibility,
  useKeyboardShortcuts,
  useFocusManagement,
  useAnnouncement,
  useAriaAttributes,
  useAccessibleForm
};
