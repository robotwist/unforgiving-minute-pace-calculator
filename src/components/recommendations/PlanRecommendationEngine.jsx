// Plan Recommendation Engine
import React, { useState, useMemo } from 'react';
import { Target, Clock, TrendingUp, Star } from 'lucide-react';

const PlanRecommendationEngine = ({ 
  colors, 
  userGoal, 
  experience, 
  goldenPace, 
  trainingPlans,
  onPlanSelect 
}) => {
  const [showAllPlans, setShowAllPlans] = useState(false);

  // Smart recommendation algorithm
  const getRecommendations = useMemo(() => {
    if (!goldenPace || !userGoal || !experience) return [];

    const getMatchReason = (plan) => {
      const reasons = [];
      
      if (userGoal === '5k-pr' && plan.distance === '5K') {
        reasons.push('Perfect for your 5K goal');
      }
      if (userGoal === 'marathon' && plan.distance === 'Marathon') {
        reasons.push('Designed for marathon success');
      }
      if (experience === 'beginner' && plan.weeklyMileage <= 35) {
        reasons.push('Beginner-friendly mileage');
      }
      if (experience === 'advanced' && plan.weeklyMileage >= 45) {
        reasons.push('Matches your experience level');
      }
      
      return reasons[0] || 'Good training structure';
    };

    const scorePlan = (plan) => {
      let score = 0;
      
      // Goal alignment (40% of score)
      if (userGoal === '5k-pr' && plan.distance === '5K') score += 40;
      if (userGoal === 'marathon' && plan.distance === 'Marathon') score += 40;
      if (userGoal === 'general-fitness' && ['5K', '10K'].includes(plan.distance)) score += 35;
      
      // Experience level alignment (30% of score)
      const weeklyMileage = plan.weeklyMileage;
      if (experience === 'beginner' && weeklyMileage <= 35) score += 30;
      if (experience === 'intermediate' && weeklyMileage >= 30 && weeklyMileage <= 50) score += 30;
      if (experience === 'advanced' && weeklyMileage >= 45) score += 30;
      
      // GoldenPace appropriateness (20% of score)
      if (goldenPace >= 30 && goldenPace <= 45 && plan.phase === 'Base') score += 20;
      if (goldenPace >= 45 && goldenPace <= 60 && plan.phase === 'Build') score += 20;
      if (goldenPace >= 60 && plan.phase === 'Peak') score += 20;
      
      // Plan quality and completeness (10% of score)
      if (plan.duration >= 8) score += 5;
      if (plan.workouts?.length > 0) score += 5;
      
      return score;
    };

    const scoredPlans = trainingPlans
      .map(plan => ({
        ...plan,
        score: scorePlan(plan),
        matchReason: getMatchReason(plan)
      }))
      .sort((a, b) => b.score - a.score);

    return scoredPlans;
  }, [goldenPace, userGoal, experience, trainingPlans]);

  const topRecommendation = getRecommendations[0];
  const otherRecommendations = getRecommendations.slice(1, 4);

  const getPlanIcon = (plan) => {
    if (plan.distance === 'Marathon') return Target;
    if (plan.phase === 'Peak') return TrendingUp;
    if (plan.weeklyMileage >= 50) return Star;
    return Clock;
  };

  const getConfidenceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: colors.lightGreen, percentage: 95 };
    if (score >= 60) return { level: 'Great', color: colors.lightBlue, percentage: 85 };
    if (score >= 40) return { level: 'Good', color: colors.orange, percentage: 70 };
    return { level: 'Fair', color: colors.silver, percentage: 55 };
  };

  if (!topRecommendation) {
    return (
      <div className="munich-card">
        <div className="munich-card-body um-text-center">
          <p style={{ color: colors.darkGreen }}>
            Complete your profile to get personalized plan recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Recommendation - Featured */}
      <div className="munich-card um-relative um-overflow-hidden" style={{ 
        border: `3px solid ${colors.lightGreen}`,
        background: `linear-gradient(135deg, ${colors.lightGreen}05, ${colors.lightBlue}05)`
      }}>
        <div 
          className="um-absolute toum-p-4 right-4"
          style={{ 
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          <div 
            className="px-3 py-1 um-um-rounded-full um-text-xs um-font-bold"
            style={{ 
              backgroundColor: colors.lightGreen,
              color: colors.white
            }}
          >
            BEST MATCH
          </div>
        </div>

        <div className="munich-card-body">
          <div className="um-grid um-md-grid-cols-3 gaum-p-6">
            {/* Plan Overview */}
            <div className="md:col-span-2">
              <div className="um-flex um-items-start space-x-4">
                <div 
                  className="w-16 um-h-16 um-um-rounded-full flex um-items-center um-justify-center"
                  style={{ backgroundColor: colors.lightGreen + '20' }}
                >
                  {React.createElement(getPlanIcon(topRecommendation), {
                    className: "w-8 um-h-8",
                    style: { color: colors.lightGreen }
                  })}
                </div>
                <div className="flex-1">
                  <h3 className="um-text-xl um-font-bold um-mb-2" style={{ color: colors.black }}>
                    {topRecommendation.name}
                  </h3>
                  <p className="mb-3" style={{ color: colors.darkGreen }}>
                    {topRecommendation.description}
                  </p>
                  
                  <div className="um-flex um-flex-wrap gaum-p-4 um-text-sm">
                    <div className="um-flex um-items-center space-x-1">
                      <Clock className="w-4 h-4" style={{ color: colors.lightBlue }} />
                      <span style={{ color: colors.black }}>{topRecommendation.duration} weeks</span>
                    </div>
                    <div className="um-flex um-items-center space-x-1">
                      <Target className="w-4 h-4" style={{ color: colors.orange }} />
                      <span style={{ color: colors.black }}>{topRecommendation.weeklyMileage} miles/week</span>
                    </div>
                    <div className="um-flex um-items-center space-x-1">
                      <TrendingUp className="w-4 h-4" style={{ color: colors.violet }} />
                      <span style={{ color: colors.black }}>{topRecommendation.phase} Phase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Confidence */}
            <div className="um-space-y-4">
              <div>
                <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>
                  Match Confidence
                </h4>
                {(() => {
                  const confidence = getConfidenceLevel(topRecommendation.score);
                  return (
                    <div>
                      <div className="um-flex um-justify-between um-text-sm mb-1">
                        <span style={{ color: colors.darkGreen }}>Compatibility</span>
                        <span style={{ color: confidence.color }}>{confidence.level}</span>
                      </div>
                      <div 
                        className="um-w-full h-2 um-um-rounded-full"
                        style={{ backgroundColor: colors.gray + '30' }}
                      >
                        <div 
                          className="h-2 um-um-rounded-full transition-all duration-1000"
                          style={{ 
                            backgroundColor: confidence.color,
                            width: `${confidence.percentage}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="um-text-sm" style={{ color: colors.darkGreen }}>
                <strong>Why this matches:</strong><br />
                {topRecommendation.matchReason}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onPlanSelect && topRecommendation) {
                    onPlanSelect(topRecommendation, 'recommended');
                  } else {
                    console.error('Missing onPlanSelect or topRecommendation', { onPlanSelect, topRecommendation });
                  }
                }}
                className="um-w-full munich-btn munich-btn-primary"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  color: colors.white,
                  border: `2px solid ${colors.darkGreen}`,
                }}
                type="button"
                aria-label="Start this training plan"
              >
                Start This Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Good Options */}
      <div>
        <h3 className="um-text-lg um-font-bold um-mb-4" style={{ color: colors.black }}>
          Other Great Options
        </h3>
        
        <div className="um-grid um-md-grid-cols-3 gaum-p-4">
          {otherRecommendations.map((plan, index) => {
            const IconComponent = getPlanIcon(plan);
            const confidence = getConfidenceLevel(plan.score);
            
            return (
              <div key={index} className="munich-card hover:shadow-lg transition-all">
                <div className="munich-card-body">
                  <div className="um-flex um-items-start um-space-x-3 um-mb-4">
                    <div 
                      className="w-10 um-h-10 um-um-rounded-full flex um-items-center um-justify-center"
                      style={{ backgroundColor: confidence.color + '20' }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: confidence.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="um-font-bold um-text-sm mb-1 truncate" style={{ color: colors.black }}>
                        {plan.name}
                      </h4>
                      <p className="um-text-xs um-mb-2" style={{ color: colors.darkGreen }}>
                        {plan.matchReason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 um-text-xs">
                    <div className="um-flex um-justify-between">
                      <span style={{ color: colors.darkGreen }}>Duration:</span>
                      <span style={{ color: colors.black }}>{plan.duration} weeks</span>
                    </div>
                    <div className="um-flex um-justify-between">
                      <span style={{ color: colors.darkGreen }}>Miles/week:</span>
                      <span style={{ color: colors.black }}>{plan.weeklyMileage}</span>
                    </div>
                    <div className="um-flex um-justify-between">
                      <span style={{ color: colors.darkGreen }}>Match:</span>
                      <span style={{ color: confidence.color }}>{confidence.level}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onPlanSelect && plan) {
                        onPlanSelect(plan, 'alternative');
                      }
                    }}
                    className="um-w-full um-mt-4 munich-btn munich-btn-outline um-text-sm"
                    style={{ 
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                    type="button"
                  >
                    View Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show All Plans Option */}
      <div className="um-text-center">
        <button
          type="button"
          onClick={() => setShowAllPlans(!showAllPlans)}
          className="munich-btn munich-btn-outline"
          style={{ color: colors.lightBlue }}
        >
          {showAllPlans ? 'Show Recommendations Only' : 'Browse All Training Plans'}
        </button>
      </div>

      {/* All Plans Grid (when expanded) */}
      {showAllPlans && (
        <div className="mt-6">
          <h3 className="um-text-lg um-font-bold um-mb-4" style={{ color: colors.black }}>
            All Available Plans
          </h3>
          <div className="um-grid um-md-grid-cols-2 um-lg-grid-cols-3 gaum-p-4">
            {getRecommendations.slice(4).map((plan, index) => (
              <div key={index} className="munich-card">
                <div className="munich-card-body">
                  <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>
                    {plan.name}
                  </h4>
                  <p className="um-text-sm um-mb-3" style={{ color: colors.darkGreen }}>
                    {plan.distance} • {plan.duration} weeks • {plan.phase}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onPlanSelect && plan) {
                        onPlanSelect(plan, 'browse');
                      }
                    }}
                    className="um-w-full munich-btn munich-btn-outline um-text-sm"
                    style={{ 
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                    type="button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanRecommendationEngine;
