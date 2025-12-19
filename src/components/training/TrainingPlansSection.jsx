import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Download } from 'lucide-react';

const TrainingPlansSection = memo(({ 
  colors,
  trainingPlans,
  setSelectedPlan,
  setShowPlanDetails
}) => {
  return (
    <div className="space-y-8">
      <div className="um-text-center um-space-y-4">
        <h2 className="um-text-4xl um-font-bold" style={{ color: colors.black }}>Coach-built Training Plans</h2>
        <p className="um-text-xl" style={{ color: colors.darkGreen }}>
          Use these as a sample of how I structure training—then apply if you want a plan built around you.
        </p>
        <div className="um-flex um-flex-col um-sm-flex-row um-gap-3 um-justify-center pt-2">
          <Link to="/apply" className="munich-btn munich-btn-primary um-cta" style={{ textAlign: 'center' }}>
            Apply for coaching
          </Link>
          <Link to="/coach" className="munich-btn munich-btn-outline" style={{ textAlign: 'center' }}>
            Meet the coach
          </Link>
        </div>
      </div>

      <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 gaum-p-8">
        {trainingPlans.map((plan, index) => (
          <div
            key={plan.id}
            className="munich-card um-overflow-hidden hover:scale-[1.02] transition-all duration-500 um-radius-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.white}E6, ${colors.lightGray}E6)`,
              border: `1px solid ${colors.border}60`,
            }}
          >
            <div className="um-p-8">
              <div className="um-flex um-items-start um-justify-between um-mb-6">
                <div className="flex-1">
                  <h3 className="um-text-2xl um-font-bold um-mb-2" style={{ color: colors.black }}>{plan.name}</h3>
                  <div className="um-flex um-items-center gaum-p-4 um-text-sm">
                    <div className="um-flex um-items-center gap-1">
                      <Clock className="w-4 h-4" style={{ color: colors.lightBlue }} />
                      <span style={{ color: colors.darkGreen }}>{plan.duration} weeks</span>
                    </div>
                    <div className="um-flex um-items-center gap-1">
                      <div className="w-2 h-2 um-um-rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                      <span style={{ color: colors.darkGreen }}>{plan.phase} Phase</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div
                    className="w-12 um-h-12 um-um-rounded-full flex um-items-center um-justify-center"
                    style={{
                      backgroundColor: `${colors.lightBlue}20`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.lightBlue}40`
                    }}
                  >
                    <Download className="w-5 h-5" style={{ color: colors.lightBlue }} />
                  </div>
                </div>
              </div>

              <p className="mb-4 leading-relaxed" style={{ color: colors.darkGreen }}>{plan.description}</p>

              {plan.goldenPaceLevel && (
                <div
                  className="munich-alert munich-alert-info um-mb-6 um-relative um-p-4 um-um-rounded-lg"
                  style={{
                    backgroundColor: `${colors.lightBlue}10`,
                    border: `1px solid ${colors.lightBlue}30`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div
                    className="um-absolute top-2 right-2 w-4 h-4 geometric-diamond"
                    style={{
                      background: `linear-gradient(135deg, ${colors.lightBlue}, ${colors.lightGreen})`,
                      opacity: 0.6
                    }}
                  ></div>
                  <p className="um-font-semibold mb-1" style={{ color: colors.black }}>
                    Personalized for Optimal Progress Pace {plan.goldenPaceLevel}
                  </p>
                  <div className="um-flex gaum-p-4 um-text-sm">
                    <span style={{ color: colors.darkGreen }}>
                      Easy: <span style={{ color: colors.lightBlue, fontMono: true }}>{plan.trainingPaces?.easy}</span>
                    </span>
                    <span style={{ color: colors.darkGreen }}>
                      Threshold: <span style={{ color: colors.lightGreen, fontMono: true }}>{plan.trainingPaces?.threshold}</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="um-flex um-gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowPlanDetails(true);
                  }}
                  className="munich-btn munich-btn-primary flex-1"
                  style={{
                    background: `linear-gradient(135deg, ${colors.lightBlue}, ${colors.lightGreen})`,
                    color: colors.white,
                    border: `2px solid ${colors.darkGreen}`,
                  }}
                  aria-label={`View ${plan.name} plan details`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  View plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TrainingPlansSection.displayName = 'TrainingPlansSection';

export default TrainingPlansSection;
