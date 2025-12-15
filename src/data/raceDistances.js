/**
 * Standard Racing Distances
 * Used for PR-based training calculator
 */

export const RACE_DISTANCES = {
  '100m': 100,
  '200m': 200,
  '400m': 400,
  '800m': 800,
  '1500m': 1500,
  'Mile': 1609.34,
  '5K': 5000,
  '10K': 10000,
  '15K': 15000,
  '10 Mile': 16093.4,
  'Half Marathon': 21097,
  'Marathon': 42195,
  '50K': 50000,
  '50 Mile': 80467,
  '100K': 100000,
  '100 Mile': 160934
};

export const STANDARD_DISTANCES = Object.keys(RACE_DISTANCES);

// Common distances shown by default
export const DEFAULT_DISTANCES = ['5K', '10K', 'Half Marathon', 'Marathon', 'Mile'];

// All other distances (shown in expandable section)
export const ADVANCED_DISTANCES = STANDARD_DISTANCES.filter(d => !DEFAULT_DISTANCES.includes(d));
