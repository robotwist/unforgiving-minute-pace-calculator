/**
 * Race Time Conversion Utilities
 * Uses published VDOT chart as source of truth, falls back to Riegel formula
 * Based on Jack Daniels Running Formula
 */

import { publishedVDOTChart } from '../data/publishedVDOTChart';

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTimeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  
  // Handle periods as separators (e.g., "22.30" -> "22:30")
  const normalized = timeStr.replace(/\./g, ':');
  const parts = normalized.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return null;
}

/**
 * Convert seconds to MM:SS format
 */
export function secondsToMMSS(seconds) {
  if (!seconds || isNaN(seconds)) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert seconds to HH:MM:SS format
 */
export function secondsToHHMMSS(seconds) {
  if (!seconds || isNaN(seconds)) return null;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get pace per mile from race time and distance (in meters)
 * Returns seconds per mile
 */
export function getPacePerMile(timeSeconds, distanceMeters) {
  if (!timeSeconds || !distanceMeters || distanceMeters === 0) return null;
  const miles = distanceMeters * 0.000621371;
  return timeSeconds / miles;
}

/**
 * Format pace per mile (seconds) to MM:SS per mile string
 */
export function formatPacePerMile(secondsPerMile) {
  if (!secondsPerMile || isNaN(secondsPerMile)) return null;
  return secondsToMMSS(secondsPerMile);
}

/**
 * Convert race time from one distance to another using Riegel formula
 * T2 = T1 * (D2/D1)^1.06
 * 
 * This is used as a fallback when published chart doesn't have the exact value
 */
export function convertRaceTimeRiegel(knownTimeSeconds, knownDistanceMeters, targetDistanceMeters) {
  if (!knownTimeSeconds || !knownDistanceMeters || !targetDistanceMeters) return null;
  if (knownDistanceMeters === targetDistanceMeters) return knownTimeSeconds;
  
  return knownTimeSeconds * Math.pow(targetDistanceMeters / knownDistanceMeters, 1.06);
}

/**
 * Find closest VDOT from a race time and distance
 * Uses published VDOT chart as source of truth
 */
export function findVDOTFromRaceTime(timeSeconds, distanceMeters) {
  if (!timeSeconds || !distanceMeters) return null;
  
  // Determine which distance column to use
  let distanceKey = null;
  if (distanceMeters === 5000) distanceKey = '5K';
  else if (distanceMeters === 1609.34) distanceKey = 'Mile';
  else if (distanceMeters === 10000) distanceKey = '10K';
  else if (distanceMeters === 21097) distanceKey = 'Half';
  else if (distanceMeters === 42195) distanceKey = 'Marathon';
  
  if (!distanceKey) return null;
  
  // Find closest VDOT value
  let closestVDOT = null;
  let minDifference = Infinity;
  
  for (const [vdot, times] of Object.entries(publishedVDOTChart)) {
    const chartTime = times[distanceKey];
    if (!chartTime) continue;
    
    const chartTimeSeconds = parseTimeToSeconds(chartTime);
    if (!chartTimeSeconds) continue;
    
    const difference = Math.abs(chartTimeSeconds - timeSeconds);
    if (difference < minDifference) {
      minDifference = difference;
      closestVDOT = parseInt(vdot);
    }
  }
  
  return closestVDOT;
}

/**
 * Get race time for a given VDOT and distance from published chart
 * Returns time string (MM:SS or HH:MM:SS)
 */
export function getRaceTimeFromVDOT(vdot, distanceMeters) {
  if (!vdot || !distanceMeters) return null;
  
  const vdotData = publishedVDOTChart[vdot];
  if (!vdotData) return null;
  
  // Map distance to chart key
  let distanceKey = null;
  if (distanceMeters === 5000) distanceKey = '5K';
  else if (distanceMeters === 1609.34) distanceKey = 'Mile';
  else if (distanceMeters === 10000) distanceKey = '10K';
  else if (distanceMeters === 21097) distanceKey = 'Half';
  else if (distanceMeters === 42195) distanceKey = 'Marathon';
  
  if (distanceKey && vdotData[distanceKey]) {
    return vdotData[distanceKey];
  }
  
  return null;
}

/**
 * Convert race time from one distance to another
 * Prefers published chart data, falls back to Riegel formula
 */
export function convertRaceTime(knownTimeSeconds, knownDistanceMeters, targetDistanceMeters) {
  if (!knownTimeSeconds || !knownDistanceMeters || !targetDistanceMeters) return null;
  if (knownDistanceMeters === targetDistanceMeters) return knownTimeSeconds;
  
  // Try to use published chart
  const vdot = findVDOTFromRaceTime(knownTimeSeconds, knownDistanceMeters);
  if (vdot) {
    const chartTime = getRaceTimeFromVDOT(vdot, targetDistanceMeters);
    if (chartTime) {
      return parseTimeToSeconds(chartTime);
    }
  }
  
  // Fallback to Riegel formula
  return convertRaceTimeRiegel(knownTimeSeconds, knownDistanceMeters, targetDistanceMeters);
}
