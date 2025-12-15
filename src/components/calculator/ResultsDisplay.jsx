import React from 'react';
import { Clock, TrendingUp, Target, Trophy } from 'lucide-react';

const ResultsDisplay = ({ 
  goldenPace, 
  trainingPaces, 
  colors,
  selectedDistance,
  raceTime 
}) => {
  if (!goldenPace || !trainingPaces || Object.keys(trainingPaces).length === 0) {
    return null;
  }

  const paceData = [
    { name: 'Easy', pace: trainingPaces.easy, icon: Clock, color: colors.gray, description: 'Conversational pace, aerobic base building' },
    { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, color: colors.lightGreen, description: 'Tempo pace, lactate threshold training' },
    { name: 'Interval', pace: trainingPaces.interval, icon: Clock, color: colors.darkGreen, description: 'VO2 max intervals, 3-5 minute efforts' },
    { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, color: colors.lightBlue, description: 'Speed work, 30 seconds to 2 minutes' }
  ];

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      {/* GoldenPace Display */}
      <div className="munich-card text-center relative overflow-hidden">
        {/* Olympic rings background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            {/* Track lanes effect */}
            <div className="relative w-32 h-32">
              {/* Lane 4 (outermost) */}
              <div className="absolute inset-0 border-2 rounded-full" style={{ 
                borderColor: colors.orange,
                background: `conic-gradient(from 0deg, ${colors.orange} 0deg, ${colors.violet} 90deg, ${colors.orange} 180deg, ${colors.violet} 270deg, ${colors.orange} 360deg)`
              }}></div>
              {/* Lane 3 */}
              <div className="absolute inset-3 border-2 rounded-full" style={{ 
                borderColor: colors.violet,
                background: `conic-gradient(from 0deg, ${colors.violet} 0deg, ${colors.orange} 90deg, ${colors.violet} 180deg, ${colors.orange} 270deg, ${colors.violet} 360deg)`
              }}></div>
              {/* Lane 2 */}
              <div className="absolute inset-5 border-2 rounded-full" style={{ 
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
              }}></div>
              {/* Lane 1 (innermost) */}
              <div className="absolute inset-7 border-2 rounded-full" style={{ 
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
              }}></div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2" style={{ color: colors.orange }} />
            <span className="text-sm sm:text-base font-medium" style={{ color: colors.black }}>Your Optimal Progress Pace</span>
          </div>
          <div className="text-4xl sm:text-6xl font-bold mb-2" style={{ color: colors.lightBlue }}>
            {goldenPace}
          </div>
          <p className="text-xs sm:text-sm mt-2" style={{ color: colors.lightBlue }}>
            Your training fitness level
          </p>
          {selectedDistance && raceTime && (
            <p className="text-xs mt-2" style={{ color: colors.darkGreen }}>
              Based on {selectedDistance} time: {raceTime}
            </p>
          )}
        </div>
      </div>

      {/* Training Paces Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {paceData.map(({ name, pace, icon: Icon, color, description }, index) => (
          <div key={name} className="munich-card hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
            {/* Geometric accent */}
            <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
              backgroundColor: color,
              opacity: 0.6
            }}></div>
            
            <div className="p-3 sm:p-4">
              <div className="flex items-center mb-2">
                <Icon className="w-4 h-4 mr-2" style={{ color }} />
                <span className="font-medium text-sm sm:text-base" style={{ color: colors.black }}>
                  {name}
                </span>
              </div>
              
              <div className="text-lg sm:text-xl font-bold mb-2" style={{ color }}>
                {pace}
              </div>
              
              <p className="text-xs text-gray-600 leading-tight">
                {description}
              </p>
            </div>
            
            {/* Progress indicator for visual appeal */}
            <div className="h-1 w-full" style={{ backgroundColor: `${color}20` }}>
              <div 
                className="h-full transition-all duration-1000 ease-out" 
                style={{ 
                  backgroundColor: color,
                  width: `${25 + index * 25}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="munich-card">
        <div className="p-4">
          <h4 className="font-medium mb-3 flex items-center" style={{ color: colors.black }}>
            <Target className="w-4 h-4 mr-2" style={{ color: colors.lightBlue }} />
            How to Use Your Training Paces
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: colors.darkGreen }}>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: colors.gray }}></span>
              <span><strong>Easy:</strong> 70-80% of your weekly mileage should be at this comfortable, conversational pace</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: colors.lightGreen }}></span>
              <span><strong>Threshold:</strong> Sustained efforts of 20-40 minutes to improve lactate clearance</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: colors.darkGreen }}></span>
              <span><strong>Interval:</strong> Hard efforts with equal rest periods to boost VO2 max</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: colors.lightBlue }}></span>
              <span><strong>Repetition:</strong> Short, fast efforts with full recovery for speed and economy</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
