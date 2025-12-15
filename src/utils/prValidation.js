/**
 * PR Validation and Consistency Checking
 * Validates PRs for consistency and flags outliers
 */

import { RACE_DISTANCES } from '../data/raceDistances';
import { parseTimeToSeconds, convertRaceTime, findVDOTFromRaceTime } from './riegel';

/**
 * Check consistency of PRs - flag outliers
 * Compares each PR against projections from other PRs
 */
export function validatePRConsistency(prs) {
  const issues = [];
  const sortedPRs = Object.entries(prs)
    .filter(([_, time]) => time && time.trim())
    .map(([dist, time]) => ({
      distance: dist,
      time: time,
      timeSeconds: parseTimeToSeconds(time),
      meters: RACE_DISTANCES[dist]
    }))
    .filter(pr => pr.timeSeconds && pr.meters)
    .sort((a, b) => a.meters - b.meters);
  
  if (sortedPRs.length < 2) {
    return issues; // Need at least 2 PRs to check consistency
  }
  
  // Check each PR against projections from other PRs
  sortedPRs.forEach((pr, index) => {
    // Use all other PRs to project this distance
    const otherPRs = sortedPRs.filter((_, i) => i !== index);
    
    let totalVariance = 0;
    let projectionCount = 0;
    
    otherPRs.forEach(otherPR => {
      const projectedTime = convertRaceTime(
        otherPR.timeSeconds,
        otherPR.meters,
        pr.meters
      );
      
      if (projectedTime) {
        // Calculate variance (allow 5% difference)
        const variance = Math.abs(pr.timeSeconds - projectedTime) / projectedTime;
        totalVariance += variance;
        projectionCount++;
      }
    });
    
    if (projectionCount > 0) {
      const avgVariance = totalVariance / projectionCount;
      
      // Flag if variance > 5%
      if (avgVariance > 0.05) {
        // Determine if slower or faster than expected
        const otherPR = sortedPRs.find(p => p.meters < pr.meters);
        if (otherPR) {
          const projectedTime = convertRaceTime(
            otherPR.timeSeconds,
            otherPR.meters,
            pr.meters
          );
          
          issues.push({
            distance: pr.distance,
            actualTime: pr.time,
            actualTimeSeconds: pr.timeSeconds,
            projectedTime: projectedTime,
            variance: avgVariance,
            type: pr.timeSeconds > projectedTime ? 'slower' : 'faster',
            severity: avgVariance > 0.10 ? 'high' : 'medium'
          });
        }
      }
    }
  });
  
  return issues;
}

/**
 * Check if PRs are reasonable (not too fast or too slow)
 * Uses VDOT to validate
 */
export function validatePRReasonableness(prs) {
  const warnings = [];
  
  Object.entries(prs).forEach(([distance, time]) => {
    if (!time || !time.trim()) return;
    
    const timeSeconds = parseTimeToSeconds(time);
    const meters = RACE_DISTANCES[distance];
    
    if (!timeSeconds || !meters) return;
    
    // Find VDOT
    const vdot = findVDOTFromRaceTime(timeSeconds, meters);
    
    // Check if VDOT is in valid range (30-85)
    if (vdot !== null) {
      if (vdot < 30) {
        warnings.push({
          distance,
          time,
          issue: 'very_slow',
          message: 'This time indicates very low fitness. Please verify.'
        });
      } else if (vdot > 85) {
        warnings.push({
          distance,
          time,
          issue: 'very_fast',
          message: 'This time is world-class. Please verify accuracy.'
        });
      }
    }
  });
  
  return warnings;
}
