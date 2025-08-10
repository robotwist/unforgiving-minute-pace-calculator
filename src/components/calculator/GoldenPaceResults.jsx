import React from 'react';
import { Clock, TrendingUp, Star, Target, User, CheckCircle } from 'lucide-react';

const GoldenPaceResults = ({
  colors,
  goldenPace,
  trainingPaces,
  setActiveTab,
  savedProfileData
}) => {
  return (
    <div className="space-y-8">
      {/* GoldenPace Display - Central Hero Result */}
      <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 relative overflow-hidden" style={{ 
        borderColor: colors.lightBlue,
        boxShadow: '0 20px 40px rgba(30, 107, 150, 0.15)' 
      }}>
        {/* Progressive Melange Background */}
        <div className="absolute inset-0 progressive-melange opacity-5"></div>
        
        {/* Geometric border accents */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-2" style={{ backgroundColor: colors.lightBlue }}></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-2" style={{ backgroundColor: colors.lightGreen }}></div>
        
        <div className="relative z-10">
          <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.lightBlue }}>
            {goldenPace}
          </div>
          <div className="text-base sm:text-lg font-medium" style={{ color: colors.black }}>
            GoldenPace
          </div>
          <p className="text-xs sm:text-sm mt-2" style={{ color: colors.lightBlue }}>
            Your training fitness level
          </p>
        </div>
      </div>

      {/* Training Paces Grid - Munich 1972 Geometric Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { name: 'Easy', pace: trainingPaces.easy, icon: Clock, color: colors.gray },
          { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, color: colors.lightGreen },
          { name: 'Interval', pace: trainingPaces.interval, icon: Clock, color: colors.darkGreen },
          { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, color: colors.lightBlue }
        ].map(({ name, pace, icon: Icon, color }, index) => (
          <div key={name} className="bg-white shadow-sm border p-3 sm:p-4 text-center relative overflow-hidden" style={{ borderColor: colors.border }}>
            {/* Progressive Melange Background */}
            <div className="absolute inset-0 progressive-melange opacity-3"></div>
            
            {/* Geometric corner accent */}
            <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-diamond geometric-float-counterclockwise" style={{ 
              backgroundColor: color,
              opacity: 0.3,
              animationDelay: `${index * 0.5}s`
            }}></div>
            
            <div className="relative z-10">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: color }} />
              <h4 className="text-sm sm:text-md font-medium mb-1" style={{ color: colors.black }}>
                {name}
              </h4>
              <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: color }}>
                {pace}
              </div>
              <p className="text-xs mt-1" style={{ color: colors.lightBlue }}>
                per mile
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Freemium Flow - Post-Calculation User Journey */}
      <div className="space-y-6">
        {/* Free Training Week Sample */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 rounded-lg p-6 relative overflow-hidden" style={{ 
          borderColor: colors.lightBlue,
          boxShadow: '0 10px 25px rgba(30, 107, 150, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-24 h-24 geometric-diamond" style={{ 
            backgroundColor: colors.orange,
            opacity: 0.08
          }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
                  Your Personalized Training Week
                </h3>
                <p className="text-sm" style={{ color: colors.darkGreen }}>
                  Based on your {goldenPace} GoldenPace • Elite-tested training system
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-bold border-2" style={{ 
                  backgroundColor: colors.lightGreen,
                  borderColor: colors.darkGreen,
                  color: 'white'
                }}>
                  FREE SAMPLE
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                    <span className="font-medium" style={{ color: colors.black }}>Monday - Recovery Run</span>
                  </div>
                  <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                    color: colors.lightBlue,
                    backgroundColor: colors.lightBlue + '15'
                  }}>{trainingPaces.easy}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightGreen + '40' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                    <span className="font-medium" style={{ color: colors.black }}>Wednesday - Threshold Run</span>
                  </div>
                  <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                    color: colors.lightGreen,
                    backgroundColor: colors.lightGreen + '15'
                  }}>{trainingPaces.threshold}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.darkGreen + '40' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                    <span className="font-medium" style={{ color: colors.black }}>Friday - Interval Session</span>
                  </div>
                  <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                    color: colors.darkGreen,
                    backgroundColor: colors.darkGreen + '15'
                  }}>{trainingPaces.interval}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                    <span className="font-medium" style={{ color: colors.black }}>Sunday - Long Run</span>
                  </div>
                  <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                    color: colors.lightBlue,
                    backgroundColor: colors.lightBlue + '15'
                  }}>{trainingPaces.easy}</span>
                </div>
              </div>
            </div>
            
            {/* Value proposition with urgency */}
            <div className="bg-white rounded-lg p-4 mb-6 border" style={{ borderColor: colors.orange + '30' }}>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.orange }}>
                  <Star className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: colors.black }}>
                    This is just week 1 of a 12-week journey to your race goal
                  </p>
                  <p className="text-xs" style={{ color: colors.darkGreen }}>
                    Full programs include progressive build phases, peak training, and race-specific workouts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setActiveTab('premium')}
                className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{ 
                  backgroundColor: colors.orange,
                  color: 'white'
                }}
                aria-label="View premium 12-week training programs"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                Get Complete 12-Week Program
              </button>
              <button 
                onClick={() => setActiveTab('plans')}
                className="flex-1 px-6 py-4 rounded-lg font-medium border-2 transition-all duration-200 flex items-center justify-center"
                style={{ 
                  borderColor: colors.lightBlue,
                  color: colors.lightBlue,
                  backgroundColor: 'white'
                }}
                aria-label="Browse all training programs"
              >
                <Target className="w-5 h-5 mr-2" />
                Browse All Programs
              </button>
            </div>
          </div>
        </div>

        {/* Profile Creation Prompt */}
        {!savedProfileData && (
          <div className="border-2 rounded-lg p-6 relative overflow-hidden" style={{ 
            borderColor: colors.lightGreen + '60',
            backgroundColor: 'white',
            boxShadow: '0 8px 25px rgba(46, 139, 87, 0.12)'
          }}>
            <div className="absolute top-0 left-0 w-32 h-32 geometric-octagon" style={{ 
              backgroundColor: colors.lightGreen,
              opacity: 0.06
            }}></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                  backgroundColor: colors.lightGreen + '20'
                }}>
                  <User className="w-6 h-6" style={{ color: colors.lightGreen }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.black }}>
                    Save Your Progress & Get Personalized Coaching
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                    Create a free profile to unlock AI-powered training recommendations, track your progress, and get access to our community of elite runners.
                  </p>
                </div>
              </div>
              
              {/* Benefits list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="text-sm" style={{ color: colors.black }}>Save your GoldenPace & training paces</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="text-sm" style={{ color: colors.black }}>Personal training log & progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="text-sm" style={{ color: colors.black }}>AI-powered workout recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="text-sm" style={{ color: colors.black }}>Access to elite coaching insights</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{ 
                    backgroundColor: colors.lightGreen,
                    color: 'white'
                  }}
                  aria-label="Create free running profile to track progress"
                >
                  <User className="w-6 h-6 mr-3" />
                  Create Free Profile Now
                </button>
                <div className="flex items-center gap-2 text-sm" style={{ color: colors.darkGreen }}>
                  <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: colors.lightGreen }}>
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  No credit card • Always free
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoldenPaceResults;
