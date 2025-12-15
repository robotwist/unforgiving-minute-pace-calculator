/**
 * Production-safe logger utility
 * Removes console statements in production builds while preserving error logging
 * 
 * Usage:
 *   import logger from './utils/logger';
 *   logger.log('Debug info'); // Only in development
 *   logger.error('Error occurred'); // Always logged
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log information (development only)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
    // Could send to analytics in production if needed
  },

  /**
   * Log errors (always logged, can send to error tracking)
   */
  error: (...args) => {
    // Always log errors for debugging
    console.error(...args);
    
    // In production, send to error tracking service
    if (!isDevelopment && window.errorTracker) {
      try {
        window.errorTracker.captureException(...args);
      } catch (e) {
        // Fail silently if error tracking fails
      }
    }
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log info (development only)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default logger;
