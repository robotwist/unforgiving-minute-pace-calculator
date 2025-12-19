// Welcome Flow Component - First Use Experience
import React, { useState } from 'react';
import { Target, Trophy, Zap } from 'lucide-react';

const WelcomeFlow = ({ colors, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [experience, setExperience] = useState(null);

  const goals = [
    {
      id: '5k-pr',
      title: 'Break My 5K PR',
      description: 'Get faster at 5K with personalized training paces',
      icon: Zap,
      color: colors.lightBlue,
      targetUsers: 'Most popular for runners under 30 minutes'
    },
    {
      id: 'marathon',
      title: 'Train for Marathon',
      description: 'Build endurance and pace strategy for 26.2 miles',
      icon: Target,
      color: colors.lightGreen,
      targetUsers: 'Perfect for first-timers or PR seekers'
    },
    {
      id: 'general-fitness',
      title: 'Just Get Faster',
      description: 'Improve overall running fitness and consistency',
      icon: Trophy,
      color: colors.orange,
      targetUsers: 'Great for building a training foundation'
    }
  ];

  const experienceLevels = [
    {
      id: 'beginner',
      title: 'New to Structured Training',
      description: 'I run regularly but haven\'t followed a specific training plan',
      weeklyMiles: '10-25 miles/week'
    },
    {
      id: 'intermediate',
      title: 'Some Training Experience',
      description: 'I\'ve done tempo runs and intervals before',
      weeklyMiles: '25-45 miles/week'
    },
    {
      id: 'advanced',
      title: 'Experienced Runner',
      description: 'I\'ve followed structured plans and understand training zones',
      weeklyMiles: '45+ miles/week'
    }
  ];

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setCurrentStep(2);
  };

  const handleExperienceSelect = (level) => {
    setExperience(level);
    setCurrentStep(3);
  };

  const handleComplete = () => {
    onComplete({
      goal: selectedGoal?.id || '',
      experience: experience?.id || '',
      weeklyMiles: experience?.weeklyMiles || '',
      personalizedMessage: generatePersonalizedMessage()
    });
  };

  const generatePersonalizedMessage = () => {
    const goalMessages = {
      '5k-pr': 'Let\'s calculate your optimal training paces for 5K speed',
      'marathon': 'Let\'s build your marathon training foundation with proper pacing',
      'general-fitness': 'Let\'s find your training zones for consistent improvement'
    };
    return selectedGoal && selectedGoal.id ? goalMessages[selectedGoal.id] : '';
  };

  return (
    <div className="um-modal-overlay um-modal-overlay--dim">
      <div className="munich-card um-modal-panel um-modal-panel--2xl">
        <div className="munich-card-header" style={{ backgroundColor: colors.lightBlue }}>
          <div className="um-relative">
            <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-diamond" style={{ 
              backgroundColor: colors.orange,
              opacity: 0.8
            }}></div>
            <div className="um-text-center">
              <h2 className="um-text-2xl um-font-bold" style={{ color: colors.white }}>
                Welcome to Unforgiving Minute
              </h2>
              <p className="mt-2" style={{ color: colors.white, opacity: 0.9 }}>
                Personalized training that goes beyond generic pace charts
              </p>
            </div>
          </div>
        </div>

        <div className="munich-card-body space-y-6">
          {/* Progress Indicator */}
          <div className="um-flex um-justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="w-3 h-3 um-rounded-full transition-all"
                style={{
                  backgroundColor: currentStep >= step ? colors.lightBlue : colors.gray,
                  opacity: currentStep >= step ? 1 : 0.3
                }}
              />
            ))}
          </div>

          {/* Step 1: Goal Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="um-text-center">
                <h3 className="um-text-xl um-font-bold um-mb-2" style={{ color: colors.black }}>
                  What's your main running goal?
                </h3>
                <p style={{ color: colors.darkGreen }}>
                  This helps us personalize your experience
                </p>
              </div>

              <div className="um-grid um-grid-cols-1 um-gap-4">
                {goals.map((goal) => {
                  const IconComponent = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal)}
                      className="munich-card um-text-left hover:shadow-lg transition-all group"
                      style={{ border: `2px solid ${goal.color}20` }}
                    >
                      <div className="munich-card-body">
                        <div className="um-flex um-items-start space-x-4">
                          <div 
                            className="w-12 um-h-12 um-rounded-full flex um-items-center um-justify-center"
                            style={{ backgroundColor: goal.color + '20' }}
                          >
                            <IconComponent className="w-6 h-6" style={{ color: goal.color }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="um-font-bold mb-1" style={{ color: colors.black }}>
                              {goal.title}
                            </h4>
                            <p className="um-text-sm um-mb-2" style={{ color: colors.darkGreen }}>
                              {goal.description}
                            </p>
                            <p className="um-text-xs" style={{ color: colors.silver }}>
                              {goal.targetUsers}
                            </p>
                          </div>
                          <div className="um-text-right">
                            <span 
                              className="um-text-2xl opacity-0 group-hover:um-opacity-100 transition-opacity"
                              style={{ color: goal.color }}
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Experience Level */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="um-text-center">
                <h3 className="um-text-xl um-font-bold um-mb-2" style={{ color: colors.black }}>
                  What's your training experience?
                </h3>
                <p style={{ color: colors.darkGreen }}>
                  This helps us set the right training intensity for you
                </p>
              </div>

              <div className="space-y-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleExperienceSelect(level)}
                    className="um-w-full munich-card um-text-left hover:shadow-lg transition-all"
                    style={{ border: `2px solid ${colors.lightBlue}20` }}
                  >
                    <div className="munich-card-body">
                      <div className="um-flex um-justify-between um-items-start">
                        <div>
                          <h4 className="um-font-bold mb-1" style={{ color: colors.black }}>
                            {level.title}
                          </h4>
                          <p className="um-text-sm mb-1" style={{ color: colors.darkGreen }}>
                            {level.description}
                          </p>
                          <p className="um-text-xs" style={{ color: colors.silver }}>
                            Typically {level.weeklyMiles}
                          </p>
                        </div>
                        <span style={{ color: colors.lightBlue }}>→</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Ready to Start */}
          {currentStep === 3 && (
            <div className="space-y-6 um-text-center">
              <div className="w-16 um-h-16 um-mx-auto geometric-octagon" style={{ 
                backgroundColor: colors.lightGreen 
              }}></div>
              
              <div>
                <h3 className="um-text-xl um-font-bold um-mb-2" style={{ color: colors.black }}>
                  Perfect! Let's Get Started
                </h3>
                <p style={{ color: colors.darkGreen }}>
                  {generatePersonalizedMessage()}
                </p>
              </div>

              <div className="munich-card" style={{ backgroundColor: colors.lightBlue + '10' }}>
                <div className="munich-card-body">
                  <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>
                    Your Personalized Setup:
                  </h4>
                  <div className="um-text-left space-y-2">
                    <div className="um-flex um-justify-between">
                      <span style={{ color: colors.darkGreen }}>Goal:</span>
                      <span style={{ color: colors.black }}>{selectedGoal?.title}</span>
                    </div>
                    <div className="um-flex um-justify-between">
                      <span style={{ color: colors.darkGreen }}>Experience:</span>
                      <span style={{ color: colors.black }}>{experience?.title}</span>
                    </div>
                    <div className="um-flex um-justify-between">
                      <span style={{ color: colors.darkGreen }}>Approach:</span>
                      <span style={{ color: colors.black }}>Individual Factor Training</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="munich-btn munich-btn-primary um-w-full um-text-lg"
              >
                Start My Personalized Calculator
              </button>

              <p className="um-text-xs" style={{ color: colors.silver }}>
                We'll remember your preferences for future visits
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeFlow;
