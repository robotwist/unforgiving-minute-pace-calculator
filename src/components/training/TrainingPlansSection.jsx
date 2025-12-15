import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Download } from 'lucide-react';

const TrainingPlansSection = ({ 
  colors,
  trainingPlans,
  setSelectedPlan,
  setShowPlanDetails
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold" style={{ color: colors.black }}>Coach-built Training Plans</h2>
        <p className="text-xl" style={{ color: colors.darkGreen }}>
          Use these as a sample of how I structure training—then apply if you want a plan built around you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/apply" className="munich-btn munich-btn-primary um-cta" style={{ textAlign: 'center' }}>
            Apply for coaching
          </Link>
          <Link to="/coach" className="munich-btn munich-btn-outline" style={{ textAlign: 'center' }}>
            Meet the coach
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trainingPlans.map((plan, index) => (
          <div
            key={plan.id}
            className="munich-card overflow-hidden hover:scale-[1.02] transition-all duration-500 um-radius-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.white}E6, ${colors.lightGray}E6)`,
              border: `1px solid ${colors.border}60`,
            }}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>{plan.name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" style={{ color: colors.lightBlue }} />
                      <span style={{ color: colors.darkGreen }}>{plan.duration} weeks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                      <span style={{ color: colors.darkGreen }}>{plan.phase} Phase</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
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
                  className="munich-alert munich-alert-info mb-6 relative p-4 rounded-lg"
                  style={{
                    backgroundColor: `${colors.lightBlue}10`,
                    border: `1px solid ${colors.lightBlue}30`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div
                    className="absolute top-2 right-2 w-4 h-4 geometric-diamond"
                    style={{
                      background: `linear-gradient(135deg, ${colors.lightBlue}, ${colors.lightGreen})`,
                      opacity: 0.6
                    }}
                  ></div>
                  <p className="font-semibold mb-1" style={{ color: colors.black }}>
                    Personalized for Optimal Progress Pace {plan.goldenPaceLevel}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span style={{ color: colors.darkGreen }}>
                      Easy: <span style={{ color: colors.lightBlue, fontMono: true }}>{plan.trainingPaces?.easy}</span>
                    </span>
                    <span style={{ color: colors.darkGreen }}>
                      Threshold: <span style={{ color: colors.lightGreen, fontMono: true }}>{plan.trainingPaces?.threshold}</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
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
};

export default TrainingPlansSection;
