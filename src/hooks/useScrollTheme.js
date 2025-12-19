import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for scroll-based Olympic theme transitions
 * Switches between Munich, Sapporo, and Winter 1976 themes as user scrolls
 */
const useScrollTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('munich');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Theme order for cycling through Olympic eras
  const themes = ['munich', 'sapporo', 'winter76'];

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    
    setScrollProgress(progress);

    // Divide page into theme sections
    if (progress < 0.33) {
      setCurrentTheme('munich');
    } else if (progress < 0.66) {
      setCurrentTheme('sapporo');
    } else {
      setCurrentTheme('winter76');
    }
  }, []);

  useEffect(() => {
    // Initial check
    handleScroll();
    
    // Throttled scroll listener
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

  /**
   * Get theme class for a specific section
   * @param {string} sectionId - Section identifier
   * @param {boolean} strong - Use stronger opacity variant
   * @returns {string} CSS classes to apply
   */
  const getThemeClass = useCallback((sectionId, strong = false) => {
    const sectionThemes = {
      hero: 'munich',
      calculator: 'sapporo',
      training: 'winter76',
      coaching: 'munich',
      footer: 'sapporo'
    };

    const theme = sectionThemes[sectionId] || currentTheme;
    const suffix = strong ? '-strong' : '';
    
    return `olympic-theme olympic-theme--${theme}${suffix} olympic-theme--animated`;
  }, [currentTheme]);

  /**
   * Get dynamic theme based on scroll position
   * @param {boolean} strong - Use stronger opacity
   * @param {boolean} pulse - Add pulse animation
   * @returns {string} CSS classes
   */
  const getDynamicTheme = useCallback((strong = false, pulse = false) => {
    const suffix = strong ? '-strong' : '';
    const pulseClass = pulse ? ' olympic-theme--pulse' : '';
    
    return `olympic-theme olympic-theme--${currentTheme}${suffix} olympic-theme--animated${pulseClass}`;
  }, [currentTheme]);

  return {
    currentTheme,
    scrollProgress,
    themes,
    getThemeClass,
    getDynamicTheme
  };
};

export default useScrollTheme;
