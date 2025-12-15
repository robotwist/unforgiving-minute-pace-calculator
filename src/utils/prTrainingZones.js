/**
 * PR-Based Training Zone Mapping
 * Maps training zones to race distances based on primary goal distance
 */

/**
 * Get training zone mapping based on goal distance
 */
export function getTrainingZoneMapping(goalDistance) {
  const mappings = {
    '5K': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    '10K': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    'Half Marathon': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    'Marathon': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    '50K': {
      aerobic: 'Marathon',
      tempo: '50K',
      threshold: 'Half Marathon',
      interval: '10K',
      repetition: '5K'
    },
    '50 Mile': {
      aerobic: 'Marathon',
      tempo: '50 Mile',
      threshold: '50K',
      interval: 'Half Marathon',
      repetition: '10K'
    },
    '100K': {
      aerobic: 'Marathon',
      tempo: '100K',
      threshold: '50 Mile',
      interval: '50K',
      repetition: 'Half Marathon'
    },
    '100 Mile': {
      aerobic: 'Marathon',
      tempo: '100 Mile',
      threshold: '100K',
      interval: '50 Mile',
      repetition: '50K'
    }
  };
  
  return mappings[goalDistance] || mappings['5K'];
}
