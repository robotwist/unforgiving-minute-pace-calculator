/**
 * PR-Based Training Pace Calculator
 * Main calculation logic for PR-based training zones
 */

import { RACE_DISTANCES } from '../data/raceDistances';
import { getTrainingZoneMapping } from './prTrainingZones';
import { 
  parseTimeToSeconds, 
  getPacePerMile, 
  formatPacePerMile,
  convertRaceTime 
} from './riegel';

/**
 * Calculate training paces from PRs
 * Returns object with training zones and their paces
 */
export function calculatePRTrainingPaces(prs, goalDistance = '5K') {
  const mapping = getTrainingZoneMapping(goalDistance);
  const trainingPaces = {};
  const paceSources = {}; // Track which PR each pace comes from
  const isProjected = {}; // Track if pace is projected or actual
  
  // Map each zone to its corresponding PR pace
  Object.entries(mapping).forEach(([zone, sourceDistance]) => {
    if (prs[sourceDistance] && prs[sourceDistance].trim()) {
      // Use actual PR
      const timeSeconds = parseTimeToSeconds(prs[sourceDistance]);
      if (timeSeconds && RACE_DISTANCES[sourceDistance]) {
        const paceSeconds = getPacePerMile(timeSeconds, RACE_DISTANCES[sourceDistance]);
        trainingPaces[zone] = formatPacePerMile(paceSeconds);
        paceSources[zone] = sourceDistance;
        isProjected[zone] = false;
      }
    } else {
      // Project missing PR from available PRs
      const projectedPace = projectPRPace(prs, sourceDistance);
      if (projectedPace) {
        trainingPaces[zone] = projectedPace.pace;
        paceSources[zone] = sourceDistance;
        isProjected[zone] = true;
      }
    }
  });
  
  return {
    paces: trainingPaces,
    sources: paceSources,
    projected: isProjected
  };
}

/**
 * Project pace for a missing distance from available PRs
 */
function projectPRPace(prs, targetDistance) {
  // Find all available PRs
  const availablePRs = Object.entries(prs)
    .filter(([_, time]) => time && time.trim())
    .map(([dist, time]) => ({
      distance: dist,
      time: time,
      timeSeconds: parseTimeToSeconds(time),
      meters: RACE_DISTANCES[dist]
    }))
    .filter(pr => pr.timeSeconds && pr.meters)
    .sort((a, b) => b.meters - a.meters); // Sort by distance, longest first (most reliable)
  
  if (availablePRs.length === 0) return null;
  
  // Use the longest available PR as base (most reliable for projections)
  const basePR = availablePRs[0];
  const targetMeters = RACE_DISTANCES[targetDistance];
  
  if (!targetMeters) return null;
  
  // Project target distance time
  const projectedTime = convertRaceTime(
    basePR.timeSeconds,
    basePR.meters,
    targetMeters
  );
  
  if (!projectedTime) return null;
  
  // Calculate pace
  const paceSeconds = getPacePerMile(projectedTime, targetMeters);
  const pace = formatPacePerMile(paceSeconds);
  
  return {
    pace,
    projectedTime,
    basedOn: basePR.distance
  };
}

/**
 * Generate complete PR profile (actual + projected times for all distances)
 */
export function generatePRProfile(prs) {
  const profile = {};
  const standardDistances = Object.keys(RACE_DISTANCES);
  
  standardDistances.forEach(distance => {
    if (prs[distance] && prs[distance].trim()) {
      // Has actual PR
      profile[distance] = {
        time: prs[distance],
        timeSeconds: parseTimeToSeconds(prs[distance]),
        isActual: true
      };
    } else {
      // Project from available PRs
      const projection = projectPRPace(prs, distance);
      if (projection) {
        profile[distance] = {
          time: null, // No actual time string
          timeSeconds: projection.projectedTime,
          isActual: false,
          basedOn: projection.basedOn
        };
      }
    }
  });
  
  return profile;
}
