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
      goal: selectedGoal,
      experience: experience,
      personalizedMessage: generatePersonalizedMessage()
    });
  };

  const generatePersonalizedMessage = () => {
    const goalMessages = {
      '5k-pr': 'Let\'s calculate your optimal training paces for 5K speed',
      'marathon': 'Let\'s build your marathon training foundation with proper pacing',
      'general-fitness': 'Let\'s find your training zones for consistent improvement'
    };
    return goalMessages[selectedGoal.id];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="munich-card max-w-2xl w-full">
        <div className="munich-card-header" style={{ backgroundColor: colors.lightBlue }}>
          <div className="relative">
            <div className="absolute top-0 right-0 w-8 h-8 geometric-diamond" style={{ 
              backgroundColor: colors.orange,
              opacity: 0.8
            }}></div>
            <div className="text-center">
              <h2 className="text-2xl font-bold" style={{ color: colors.white }}>
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
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="w-3 h-3 rounded-full transition-all"
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
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.black }}>
                  What's your main running goal?
                </h3>
                <p style={{ color: colors.darkGreen }}>
                  This helps us personalize your experience
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {goals.map((goal) => {
                  const IconComponent = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal)}
                      className="munich-card text-left hover:shadow-lg transition-all group"
                      style={{ border: `2px solid ${goal.color}20` }}
                    >
                      <div className="munich-card-body">
                        <div className="flex items-start space-x-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: goal.color + '20' }}
                          >
                            <IconComponent className="w-6 h-6" style={{ color: goal.color }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold mb-1" style={{ color: colors.black }}>
                              {goal.title}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: colors.darkGreen }}>
                              {goal.description}
                            </p>
                            <p className="text-xs" style={{ color: colors.silver }}>
                              {goal.targetUsers}
                            </p>
                          </div>
                          <div className="text-right">
                            <span 
                              className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.black }}>
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
                    className="w-full munich-card text-left hover:shadow-lg transition-all"
                    style={{ border: `2px solid ${colors.lightBlue}20` }}
                  >
                    <div className="munich-card-body">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold mb-1" style={{ color: colors.black }}>
                            {level.title}
                          </h4>
                          <p className="text-sm mb-1" style={{ color: colors.darkGreen }}>
                            {level.description}
                          </p>
                          <p className="text-xs" style={{ color: colors.silver }}>
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
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 mx-auto geometric-octagon" style={{ 
                backgroundColor: colors.lightGreen 
              }}></div>
              
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.black }}>
                  Perfect! Let's Get Started
                </h3>
                <p style={{ color: colors.darkGreen }}>
                  {generatePersonalizedMessage()}
                </p>
              </div>

              <div className="munich-card" style={{ backgroundColor: colors.lightBlue + '10' }}>
                <div className="munich-card-body">
                  <h4 className="font-bold mb-2" style={{ color: colors.black }}>
                    Your Personalized Setup:
                  </h4>
                  <div className="text-left space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: colors.darkGreen }}>Goal:</span>
                      <span style={{ color: colors.black }}>{selectedGoal?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.darkGreen }}>Experience:</span>
                      <span style={{ color: colors.black }}>{experience?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.darkGreen }}>Approach:</span>
                      <span style={{ color: colors.black }}>Individual Factor Training</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="munich-btn munich-btn-primary w-full text-lg"
              >
                Start My Personalized Calculator
              </button>

              <p className="text-xs" style={{ color: colors.silver }}>
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
