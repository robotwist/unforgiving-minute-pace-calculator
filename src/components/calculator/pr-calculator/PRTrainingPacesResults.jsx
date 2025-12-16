import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, AlertTriangle } from 'lucide-react';
import PRPaceCard from './PRPaceCard';
import { validatePRConsistency } from '../../../utils/prValidation';

const PRTrainingPacesResults = memo(({ trainingPaces, colors, goalDistance, prs }) => {
  // Memoize validation - only runs when prs change (hooks must come before early return)
  const consistencyIssues = useMemo(() => {
    return validatePRConsistency(prs);
  }, [prs]);
  
  // Memoize pace cards data (hooks must come before early return)
  const paceCards = useMemo(() => {
    if (!trainingPaces?.paces) return [];
    return Object.entries(trainingPaces.paces).map(([zone, pace]) => ({
      zone,
      pace,
      sourceDistance: trainingPaces.sources?.[zone],
      isProjected: trainingPaces.projected?.[zone]
    }));
  }, [trainingPaces]);

  // Early return after hooks
  if (!trainingPaces || !trainingPaces.paces || Object.keys(trainingPaces.paces).length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      {/* Consistency Warnings */}
      {consistencyIssues.length > 0 && (
        <div className="munich-card p-4" style={{ borderColor: colors.orange }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: colors.orange }} />
            <div className="flex-1">
              <h4 className="font-semibold mb-2" style={{ color: colors.black }}>
                PR Consistency Check
              </h4>
              <p className="text-sm mb-3" style={{ color: colors.textSecondary || colors.darkGray }}>
                Some of your PRs are inconsistent with others. This may indicate:
              </p>
              <ul className="text-sm space-y-1 mb-3" style={{ color: colors.textSecondary || colors.darkGray }}>
                {consistencyIssues.map((issue, idx) => (
                  <li key={idx}>
                    • <strong style={{ color: colors.text || colors.black }}>{issue.distance}</strong> is {issue.type} than expected based on your other PRs
                  </li>
                ))}
              </ul>
              <p className="text-xs" style={{ color: colors.textSecondary || colors.darkGray }}>
                Training paces use your actual PRs. If a PR seems off, consider retesting that distance.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Training Paces Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.black }}>
          Your Training Paces
        </h3>
        <p className="text-sm mb-6" style={{ color: colors.textSecondary || colors.darkGray }}>
          Based on your actual PRs. These are proven paces you can run—use them directly in training.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {Object.entries(trainingPaces.paces).map(([zone, pace], index) => (
            <PRPaceCard
              key={zone}
              zone={zone}
              pace={pace}
              sourceDistance={trainingPaces.sources[zone]}
              isProjected={trainingPaces.projected[zone]}
              colors={colors}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Key Insight */}
      <div className="munich-card p-6" style={{ borderColor: colors.lightBlue }}>
        <div className="progressive-melange um-melange-overlay um-melange-overlay--05"></div>
        <div className="relative z-10">
          <h4 className="text-lg font-bold mb-3" style={{ color: colors.black }}>
            The PR-Based Approach
          </h4>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.textSecondary || colors.darkGray }}>
            Unlike formula-based systems, these paces come directly from your actual race performances. 
            If you can run a {trainingPaces.sources.marathon || 'marathon'} at a certain pace, that pace 
            is your proven aerobic capacity. Use it. No calculations needed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: colors.textSecondary || colors.darkGray }}>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.black }}>✓ Accurate</p>
              <p>Uses your actual performance, not theoretical calculations</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.black }}>✓ Simple</p>
              <p>No complex formulas—just your proven race paces</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.black }}>✓ Adaptive</p>
              <p>Training paces automatically update as you set new PRs</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.black }}>✓ Multi-Distance</p>
              <p>Maintains fitness across all distances simultaneously</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/apply"
          className="flex-1 px-6 py-4 rounded-lg font-semibold border-2 transition-all duration-200 flex items-center justify-center"
          style={{
            borderColor: colors.lightGreen,
            color: colors.lightGreen,
            backgroundColor: 'transparent'
          }}
          aria-label="Apply for coaching"
        >
          <User className="w-5 h-5 mr-2" />
          Apply for coaching
        </Link>
      </div>
    </div>
  );
});

PRTrainingPacesResults.displayName = 'PRTrainingPacesResults';

export default PRTrainingPacesResults;
