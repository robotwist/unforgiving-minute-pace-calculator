/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and other performance metrics
 * 
 * Usage:
 *   import { measureWebVitals, trackPerformanceMetric } from './utils/performance';
 *   
 *   // In App.js or index.js
 *   measureWebVitals();
 */

/**
 * Measure and report Core Web Vitals
 * LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift)
 */
export const measureWebVitals = () => {
  // Dynamically import web-vitals to avoid including in bundle if not needed
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    // Largest Contentful Paint - measures loading performance
    onLCP((metric) => {
      trackPerformanceMetric('LCP', metric.value, metric);
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('LCP:', metric.value, 'ms');
      }
    });

    // First Input Delay - measures interactivity
    onFID((metric) => {
      trackPerformanceMetric('FID', metric.value, metric);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('FID:', metric.value, 'ms');
      }
    });

    // Cumulative Layout Shift - measures visual stability
    onCLS((metric) => {
      trackPerformanceMetric('CLS', metric.value, metric);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('CLS:', metric.value);
      }
    });

    // First Contentful Paint - measures initial render
    onFCP((metric) => {
      trackPerformanceMetric('FCP', metric.value, metric);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('FCP:', metric.value, 'ms');
      }
    });

    // Time to First Byte - measures server response time
    onTTFB((metric) => {
      trackPerformanceMetric('TTFB', metric.value, metric);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('TTFB:', metric.value, 'ms');
      }
    });

    // Interaction to Next Paint - measures responsiveness (replaces FID)
    if (onINP) {
      onINP((metric) => {
        trackPerformanceMetric('INP', metric.value, metric);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('INP:', metric.value, 'ms');
        }
      });
    }
  }).catch((err) => {
    // Fail silently if web-vitals is not available
    if (process.env.NODE_ENV === 'development') {
      console.warn('web-vitals not available:', err);
    }
  });
};

/**
 * Track performance metric to analytics
 */
const trackPerformanceMetric = (metricName, value, metric) => {
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', metricName, {
      value: Math.round(value),
      metric_id: metric.id,
      metric_value: value,
      metric_delta: metric.delta,
      event_category: 'Web Vitals',
      non_interaction: true
    });
  }

  // Send to custom analytics if available
  if (window.trackEvent && typeof window.trackEvent === 'function') {
    try {
      window.trackEvent('Web Vitals', metricName, value);
    } catch (e) {
      // Fail silently
    }
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metricName}:`, value, metric);
  }
};

/**
 * Measure custom performance mark
 * Usage: measurePerformance('component-render', () => { component render logic })
 */
export const measurePerformance = (markName, callback) => {
  if (!window.performance || !window.performance.mark) {
    return callback();
  }

  const startMark = `${markName}-start`;
  const endMark = `${markName}-end`;
  const measureName = `${markName}-duration`;

  window.performance.mark(startMark);
  const result = callback();
  window.performance.mark(endMark);
  
  try {
    window.performance.measure(measureName, startMark, endMark);
    const measure = window.performance.getEntriesByName(measureName)[0];
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${markName}:`, measure.duration.toFixed(2), 'ms');
    }
    
    // Clean up
    window.performance.clearMarks(startMark);
    window.performance.clearMarks(endMark);
    window.performance.clearMeasures(measureName);
  } catch (e) {
    // Fail silently
  }

  return result;
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = () => {
  if (!window.performance || !window.performance.getEntriesByType) {
    return null;
  }

  const navigation = window.performance.getEntriesByType('navigation')[0];
  if (!navigation) return null;

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    dom: navigation.domComplete - navigation.domLoading,
    load: navigation.loadEventEnd - navigation.loadEventStart,
    total: navigation.loadEventEnd - navigation.fetchStart
  };
};

const performanceUtils = {
  measureWebVitals,
  measurePerformance,
  getPerformanceMetrics
};

export default performanceUtils;
