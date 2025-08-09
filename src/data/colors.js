// Munich 1972 Olympic Design System - Color Palette
// Based on Otl Aicher's official design specifications

export const colors = {
  // Primary Munich 1972 Colors
  lightBlue: '#1E6B96',      // Munich light blue (primary) - Pantone 285 C
  lightGreen: '#2E8B57',     // Munich green - Pantone 7487 C
  silver: '#C0C0C0',         // Munich silver - Official events
  violet: '#8B7FC7',         // Munich violet - Pantone 2135 C
  darkGreen: '#004225',      // Munich dark green - Pantone 347 C
  orange: '#FF6B35',         // Munich orange (energy) - Pantone 2013 C
  yellow: '#F7931E',         // Munich yellow - Pantone 123 C
  
  // Base Colors (adaptive for light/dark modes)
  white: '#FFFFFF',          // Symbol of lightness
  black: '#1A1A1A',          // Text color
  gray: '#F5F5F5',           // Light background
  lightGray: '#F8FAFC',      // Subtle background
  border: '#E2E8F0',         // Subtle border
  
  // Dark mode variants
  darkBlue: '#0D2B3E',
  darkForest: '#1A4D35',
  darkOrange: '#B8471F',
  darkYellow: '#B8671F',
  charcoal: '#2C2C2C',
  offWhite: '#E8E8E8',
};

// Adaptive color function for dark mode support
export const getAdaptiveColors = (darkMode = false) => ({
  ...colors,
  white: darkMode ? '#1A1A1A' : '#FFFFFF',
  black: darkMode ? '#E5E5E5' : '#1A1A1A',
  gray: darkMode ? '#2D2D2D' : '#F5F5F5',
  lightGray: darkMode ? '#374151' : '#F8FAFC',
  border: darkMode ? '#4B5563' : '#E2E8F0',
});

// Color utility functions
export const colorUtils = {
  // Convert color to rgba with alpha
  withAlpha: (color, alpha) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Generate gradient from colors
  gradient: (color1, color2, direction = '45deg') => 
    `linear-gradient(${direction}, ${color1}, ${color2})`,
    
  // Munich-style progressive melange background
  progressiveMelange: (colors) => 
    `linear-gradient(45deg, ${colors.join(', ')})`,
};

export default colors;
