import React from 'react';
import { Target, Clock, TrendingUp, BookOpen, BarChart3, X, Info } from 'lucide-react';

/**
 * Enhanced Post-Calculator Explanation Modal
 * Explains what Optimal Progress Pace means and how to use training paces
 * Guides users to next steps
 */
const PostCalculatorModal = ({
  goldenPace,
  trainingPaces,
  raceDistance,
  colors,
  onClose,
  onViewPlans,
  onContinueExploring
}) => {
  return (
    <div
      className="um-modal-overlay um-modal-overlay--dim um-fixed um-inset-0 z-50 flex um-items-center um-justify-center um-p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="munich-card um-modal-panel um-modal-panel--md max-w-2xl um-w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: `linear-gradient(135deg, ${colors.white}E8, ${colors.lightGray}E8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="munich-card-body">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="um-absolute um-top-4 right-4 p-2 um-rounded-full hover:bg-um-opacity-10 transition-colors"
            style={{ color: colors.black }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="um-text-center um-mb-6">
            <div
              className="w-16 um-h-16 um-mx-auto um-mb-4 um-rounded-full flex um-items-center um-justify-center um-icon-badge"
              style={{
                backgroundColor: `${colors.lightGreen}20`,
                border: `1px solid ${colors.lightGreen}40`
              }}
            >
              <Target className="w-8 um-h-8" style={{ color: colors.lightGreen }} />
            </div>

            <h2 id="modal-title" className="um-text-2xl um-sm-text-3xl um-font-bold um-mb-3" style={{ color: colors.black }}>
              Your Optimal Progress Pace: {goldenPace}
            </h2>

            <p className="um-text-base um-sm-text-lg um-mb-2" style={{ color: colors.darkGreen }}>
              Congratulations! You now have personalized training paces based on your {raceDistance} performance.
            </p>
          </div>

          {/* What is Optimal Progress Pace? */}
          <div className="mb-6 um-p-4 um-rounded-lg um-border-2" style={{ borderColor: `${colors.lightBlue}40`, backgroundColor: `${colors.lightBlue}08` }}>
            <div className="um-flex um-items-start um-gap-3 um-mb-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.lightBlue }} />
              <div>
                <h3 className="um-font-bold um-text-lg um-mb-2" style={{ color: colors.black }}>
                  What is Optimal Progress Pace?
                </h3>
                <p className="um-text-sm leading-relaxed" style={{ color: colors.darkGreen }}>
                  Your Optimal Progress Pace (also known as Golden Pace) is the pace that maximizes improvement when run at the right times. 
                  It's based on Jack Daniels' Running Formula and represents the intensity that provides the best training stimulus 
                  without overtraining. This pace is calculated specifically from your {raceDistance} race performance.
                </p>
              </div>
            </div>
          </div>

          {/* How to Use Training Paces */}
          {trainingPaces && (
            <div className="mb-6">
              <h3 className="um-font-bold um-text-lg um-mb-4 flex um-items-center gap-2" style={{ color: colors.black }}>
                <BookOpen className="w-5 h-5" style={{ color: colors.lightBlue }} />
                How to Use Your Training Paces
              </h3>
              
              <div className="space-y-3">
                {trainingPaces.easy && (
                  <div className="p-3 border um-rounded-lg" style={{ borderColor: colors.border }}>
                    <div className="um-flex um-items-center gap-2 mb-1">
                      <Clock className="w-4 h-4" style={{ color: colors.gray }} />
                      <span className="um-font-semibold" style={{ color: colors.black }}>Easy Pace: {trainingPaces.easy}</span>
                    </div>
                    <p className="um-text-xs um-text-left ml-6" style={{ color: colors.darkGreen }}>
                      Use for recovery runs, long runs, and building aerobic base. You should be able to hold a conversation at this pace.
                    </p>
                  </div>
                )}

                {trainingPaces.threshold && (
                  <div className="p-3 border um-rounded-lg" style={{ borderColor: colors.border }}>
                    <div className="um-flex um-items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" style={{ color: colors.lightGreen }} />
                      <span className="um-font-semibold" style={{ color: colors.black }}>Threshold Pace: {trainingPaces.threshold}</span>
                    </div>
                    <p className="um-text-xs um-text-left ml-6" style={{ color: colors.darkGreen }}>
                      Your lactate threshold pace. Use for tempo runs (20-30 minutes) or threshold intervals. Comfortably hard effort.
                    </p>
                  </div>
                )}

                {trainingPaces.interval && (
                  <div className="p-3 border um-rounded-lg" style={{ borderColor: colors.border }}>
                    <div className="um-flex um-items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" style={{ color: colors.darkGreen }} />
                      <span className="um-font-semibold" style={{ color: colors.black }}>Interval Pace: {trainingPaces.interval}</span>
                    </div>
                    <p className="um-text-xs um-text-left ml-6" style={{ color: colors.darkGreen }}>
                      Hard effort for shorter intervals (3-5 minutes) with recovery between. Improves VO2 max and running economy.
                    </p>
                  </div>
                )}

                {trainingPaces.repetition && (
                  <div className="p-3 border um-rounded-lg" style={{ borderColor: colors.border }}>
                    <div className="um-flex um-items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" style={{ color: colors.lightBlue }} />
                      <span className="um-font-semibold" style={{ color: colors.black }}>Repetition Pace: {trainingPaces.repetition}</span>
                    </div>
                    <p className="um-text-xs um-text-left ml-6" style={{ color: colors.darkGreen }}>
                      Very fast pace for short repetitions (200-400m) with full recovery. Develops speed and running form.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-6 um-p-4 um-rounded-lg um-border-2" style={{ borderColor: `${colors.lightGreen}40`, backgroundColor: `${colors.lightGreen}08` }}>
            <h3 className="um-font-bold um-text-lg um-mb-3 flex um-items-center gap-2" style={{ color: colors.black }}>
              <BarChart3 className="w-5 h-5" style={{ color: colors.lightGreen }} />
              What's Next?
            </h3>
            <ul className="space-y-2 um-text-sm" style={{ color: colors.darkGreen }}>
              <li className="um-flex um-items-start gap-2">
                <span className="um-font-bold um-text-base" style={{ color: colors.lightBlue }}>1.</span>
                <span><strong>View Training Plans:</strong> Get a personalized plan that uses these paces at the right times</span>
              </li>
              <li className="um-flex um-items-start gap-2">
                <span className="um-font-bold um-text-base" style={{ color: colors.lightBlue }}>2.</span>
                <span><strong>Track Your Progress:</strong> Log your runs and see how your paces improve over time</span>
              </li>
              <li className="um-flex um-items-start gap-2">
                <span className="um-font-bold um-text-base" style={{ color: colors.lightBlue }}>3.</span>
                <span><strong>Learn More:</strong> Read articles about training philosophy and race strategy</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="um-flex um-flex-col um-sm-flex-row um-gap-3">
            <button
              onClick={() => {
                onViewPlans();
                onClose();
              }}
              className="flex-1 munich-btn munich-btn-primary flex um-items-center um-justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.lightBlue}, ${colors.lightGreen})`,
                color: colors.white,
                border: `2px solid ${colors.darkGreen}`,
                minHeight: '44px' // Touch-friendly
              }}
              aria-label="View training plans"
            >
              <Target className="w-5 h-5" />
              View Training Plans
            </button>
            <button
              onClick={onClose}
              className="flex-1 munich-btn munich-btn-outline flex um-items-center um-justify-center gap-2"
              style={{
                border: `2px solid ${colors.lightBlue}`,
                color: colors.lightBlue,
                minHeight: '44px' // Touch-friendly
              }}
              aria-label="Continue exploring"
            >
              <BarChart3 className="w-5 h-5" />
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCalculatorModal;
