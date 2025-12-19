import React from 'react';
import { generatePRProfile } from '../../../utils/prCalculator';
import { RACE_DISTANCES, STANDARD_DISTANCES } from '../../../data/raceDistances';
import { getPacePerMile } from '../../../utils/riegel';

/**
 * Simple PR Profile Graph Component
 * Shows PRs on a distance vs pace chart
 * For now, uses SVG - can be enhanced with Recharts later
 */
const PRProfileGraph = ({ prs, colors }) => {
  const profile = generatePRProfile(prs);
  
  // Filter to standard distances only for cleaner chart
  const chartDistances = STANDARD_DISTANCES.filter(d => 
    ['100m', '400m', '800m', '1500m', 'Mile', '5K', '10K', 'Half Marathon', 'Marathon', '50K', '100K'].includes(d)
  );
  
  // Get pace data for chart
  const dataPoints = chartDistances
    .map(distance => {
      const data = profile[distance];
      if (!data || !data.timeSeconds) return null;
      
      const meters = RACE_DISTANCES[distance];
      const paceSeconds = getPacePerMile(data.timeSeconds, meters);
      
      return {
        distance,
        meters,
        timeSeconds: data.timeSeconds,
        paceSeconds,
        isActual: data.isActual,
        label: distance
      };
    })
    .filter(Boolean);
  
  if (dataPoints.length === 0) {
    return (
      <div className="munich-card um-p-8 um-text-center" style={{ borderColor: colors.border }}>
        <p className="um-text-sm" style={{ color: colors.textSecondary || colors.darkGray }}>
          Enter at least one PR to see your profile graph
        </p>
      </div>
    );
  }
  
  // Calculate chart dimensions
  const chartWidth = 800;
  const chartHeight = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 80 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  
  // Get min/max for axes (log scale for distance, linear for pace)
  const minDistance = Math.min(...dataPoints.map(d => d.meters));
  const maxDistance = Math.max(...dataPoints.map(d => d.meters));
  const minPace = Math.min(...dataPoints.map(d => d.paceSeconds));
  const maxPace = Math.max(...dataPoints.map(d => d.paceSeconds));
  
  // Convert to log scale for X (distance)
  const logMin = Math.log10(minDistance);
  const logMax = Math.log10(maxDistance);
  
  // Scale functions
  const scaleX = (meters) => {
    const logValue = Math.log10(meters);
    return padding.left + ((logValue - logMin) / (logMax - logMin)) * plotWidth;
  };
  
  const scaleY = (paceSeconds) => {
    return padding.top + plotHeight - ((paceSeconds - minPace) / (maxPace - minPace)) * plotHeight;
  };
  
  // Format pace for display
  const formatPace = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format distance label
  const formatDistance = (distance) => {
    if (distance === 'Mile') return '1 Mile';
    return distance;
  };
  
  return (
    <div className="munich-card um-p-6" style={{ borderColor: colors.border }}>
      <h3 className="um-text-lg um-font-bold um-mb-4" style={{ color: colors.black }}>
        Your PR Profile
      </h3>
      <p className="um-text-xs um-mb-4" style={{ color: colors.textSecondary || colors.darkGray }}>
        Pace per mile across race distances. Actual PRs shown in blue, projected times in green.
      </p>
      
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="um-w-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.border} strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
          
          {/* Y-axis (Pace) */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotHeight}
            stroke={colors.black}
            strokeWidth="2"
          />
          
          {/* X-axis (Distance) */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={padding.left + plotWidth}
            y2={padding.top + plotHeight}
            stroke={colors.black}
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const pace = minPace + (maxPace - minPace) * (1 - t);
            const y = padding.top + plotHeight * t;
            return (
              <g key={t}>
                <line
                  x1={padding.left - 5}
                  y1={y}
                  x2={padding.left}
                  y2={y}
                  stroke={colors.black}
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill={colors.black}
                >
                  {formatPace(pace)}
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels (key distances only) */}
          {['Mile', '5K', '10K', 'Half Marathon', 'Marathon'].forEach(distance => {
            const meters = RACE_DISTANCES[distance];
            if (!meters || meters < minDistance || meters > maxDistance) return;
            
            const x = scaleX(meters);
            return (
              <g key={distance}>
                <line
                  x1={x}
                  y1={padding.top + plotHeight}
                  x2={x}
                  y2={padding.top + plotHeight + 5}
                  stroke={colors.black}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill={colors.black}
                >
                  {formatDistance(distance)}
                </text>
              </g>
            );
          })}
          
          {/* Data points and line */}
          <polyline
            points={dataPoints.map(d => `${scaleX(d.meters)},${scaleY(d.paceSeconds)}`).join(' ')}
            fill="none"
            stroke={colors.lightBlue}
            strokeWidth="2"
            strokeDasharray={dataPoints.some(d => !d.isActual) ? "5,5" : "0"}
            opacity="0.5"
          />
          
          {/* Data points */}
          {dataPoints.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={scaleX(point.meters)}
                cy={scaleY(point.paceSeconds)}
                r={point.isActual ? 6 : 4}
                fill={point.isActual ? colors.lightBlue : colors.lightGreen}
                stroke={colors.white}
                strokeWidth="2"
              />
              {/* Tooltip on hover (simple version) */}
              <title>
                {formatDistance(point.label)}: {formatPace(point.paceSeconds)}/mile
                {point.isActual ? ' (Actual PR)' : ' (Projected)'}
              </title>
            </g>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="um-flex um-items-center um-justify-center um-gap-6 um-mt-4 um-text-xs">
        <div className="um-flex um-items-center gap-2">
          <div
            className="w-3 h-3 um-rounded-full"
            style={{ backgroundColor: colors.lightBlue }}
          />
          <span style={{ color: colors.textSecondary || colors.darkGray }}>Actual PR</span>
        </div>
        <div className="um-flex um-items-center gap-2">
          <div
            className="w-3 h-3 um-rounded-full"
            style={{ backgroundColor: colors.lightGreen }}
          />
          <span style={{ color: colors.textSecondary || colors.darkGray }}>Projected</span>
        </div>
      </div>
    </div>
  );
};

export default PRProfileGraph;
