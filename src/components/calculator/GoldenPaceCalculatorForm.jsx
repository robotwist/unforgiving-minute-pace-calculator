import React from 'react';
import { Calculator, Target } from 'lucide-react';

const GoldenPaceCalculatorForm = ({
  colors,
  raceTime,
  setRaceTime,
  raceDistance,
  setRaceDistance,
  handleCalculate,
  parseTimeToSeconds,
  profileError,
  setProfileError,
  savedProfileData
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section - Munich 1972 Style */}
      <div className="text-center space-y-4 sm:space-y-6">
        {/* Track Design */}
        <div className="inline-block relative">
          <div className="relative w-44 h-24 sm:w-52 sm:h-32" style={{ transform: 'rotate(0deg)' }}>
            {/* 8-Lane Oval Track with alternating colors */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((lane) => (
              <div 
                key={lane}
                className={`absolute inset-${lane} border-2 rounded-full`}
                style={{ 
                  borderColor: lane % 2 === 0 ? colors.lightBlue : colors.lightGreen,
                  background: `conic-gradient(from 0deg, ${lane % 2 === 0 ? colors.lightBlue : colors.lightGreen} 0deg, ${lane % 2 === 0 ? colors.lightGreen : colors.lightBlue} 90deg, ${lane % 2 === 0 ? colors.lightBlue : colors.lightGreen} 180deg, ${lane % 2 === 0 ? colors.lightGreen : colors.lightBlue} 270deg, ${lane % 2 === 0 ? colors.lightBlue : colors.lightGreen} 360deg)`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: colors.black }}>
          GoldenPace Calculator
        </h2>
        
        {/* Show helpful message if race data is pre-populated from profile */}
        {savedProfileData && (raceTime || raceDistance !== '5K') && (
          <div className="inline-flex items-center px-4 py-2 bg-opacity-10 rounded-lg mb-4" style={{ 
            backgroundColor: colors.lightBlue,
            color: colors.darkBlue 
          }}>
            <Target className="w-4 h-4 mr-2" />
            <span className="text-sm">Using your goal race from profile: {raceDistance}{raceTime ? ` in ${raceTime}` : ''}</span>
          </div>
        )}
        
        <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4 leading-relaxed" style={{ color: colors.black }}>
          Enter a recent race time to unlock your personalized training paces—used by elite athletes worldwide
        </p>
        
        {/* Value proposition badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
            borderColor: colors.lightBlue, 
            backgroundColor: colors.lightBlue + '10',
            color: colors.black 
          }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
            <span className="text-sm font-medium">Elite-Tested</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
            borderColor: colors.lightGreen, 
            backgroundColor: colors.lightGreen + '10',
            color: colors.black 
          }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
            <span className="text-sm font-medium">Instant Results</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
            borderColor: colors.orange, 
            backgroundColor: colors.orange + '10',
            color: colors.black 
          }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.orange }}></div>
            <span className="text-sm font-medium">Free Training Sample</span>
          </div>
        </div>
      </div>

      {/* Calculator Card - Munich 1972 Geometric Style */}
      <div className="max-w-2xl mx-auto">
        <div className="shadow-sm border relative overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
          {/* Progressive Melange Background */}
          <div className="absolute inset-0 progressive-melange opacity-5"></div>
          
          {/* Subtle geometric corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2" style={{ borderColor: colors.lightBlue }}></div>
          <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2" style={{ borderColor: colors.lightGreen }}></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2" style={{ borderColor: colors.lightGreen }}></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2" style={{ borderColor: colors.lightBlue }}></div>
          
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 relative z-10">
            <h3 className="text-lg sm:text-xl font-bold flex items-center" style={{ color: colors.black }}>
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" style={{ color: colors.lightBlue }} />
              GoldenPace Calculator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Race Time
                </label>
                <input
                  type="text"
                  placeholder="e.g., 22:30 or 1:22:30"
                  value={raceTime}
                  onChange={(e) => {
                    setRaceTime(e.target.value);
                    // Clear error when user starts typing
                    if (profileError && profileError.includes('time')) {
                      setProfileError('');
                    }
                  }}
                  onBlur={(e) => {
                    // Validate time format when field loses focus
                    const time = e.target.value.trim();
                    if (time && !parseTimeToSeconds(time)) {
                      setProfileError('Please enter a valid time format (MM:SS or HH:MM:SS)');
                    }
                  }}
                  aria-label="Race time in minutes and seconds"
                  aria-describedby="race-time-help"
                  className={`w-full px-3 sm:px-4 py-3 border-2 font-mono text-base sm:text-lg text-center transition-colors ${
                    profileError && profileError.includes('time') ? 'border-red-500 bg-red-50' : ''
                  }`}
                  style={{ 
                    borderColor: profileError && profileError.includes('time') ? '#ef4444' : colors.border,
                    color: colors.black,
                    backgroundColor: profileError && profileError.includes('time') ? '#fef2f2' : colors.white
                  }}
                />
                <div id="race-time-help" className="text-xs mt-1" style={{ color: colors.darkGreen }}>
                  Formats: 22:30 (MM:SS) or 1:22:30 (HH:MM:SS). You can also use periods: 22.30
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                  Distance
                </label>
                <select
                  value={raceDistance}
                  onChange={(e) => setRaceDistance(e.target.value)}
                  aria-label="Select race distance"
                  className="w-full px-3 sm:px-4 py-3 border-2 font-medium text-center"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.black,
                    backgroundColor: colors.white
                  }}
                >
                  <option value="1500m">1500m</option>
                  <option value="Mile">Mile</option>
                  <option value="3K">3K</option>
                  <option value="5K">5K</option>
                  <option value="10K">10K</option>
                  <option value="15K">15K</option>
                  <option value="10 Mile">10 Mile</option>
                  <option value="Half Marathon">Half Marathon</option>
                  <option value="Marathon">Marathon</option>
                </select>
              </div>
            </div>

            {/* Error message */}
            {profileError && (
              <div className="p-3 rounded-lg" style={{ 
                backgroundColor: '#fee2e2',
                border: `1px solid #fecaca`,
                color: '#dc2626'
              }}>
                {profileError}
              </div>
            )}
            
            <button
              onClick={handleCalculate}
              aria-label="Calculate training paces from race time"
              className="w-full py-3 px-6 font-medium text-base sm:text-lg transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg relative btn-high-contrast"
              style={{ 
                backgroundColor: colors.lightBlue,
                color: colors.white,
                border: `2px solid ${colors.darkGreen}`
              }}
            >
              Calculate GoldenPace
              {/* Geometric accent on button */}
              <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond" style={{ 
                backgroundColor: colors.lightGreen
              }}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldenPaceCalculatorForm;
