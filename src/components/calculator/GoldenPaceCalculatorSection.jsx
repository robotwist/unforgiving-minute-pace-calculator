import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Target } from 'lucide-react';

export default function GoldenPaceCalculatorSection({
  colors,
  savedProfileData,
  raceTime,
  raceDistance,
  setRaceTime,
  setRaceDistance,
  parseTimeToSeconds,
  profileError,
  setProfileError,
  handleCalculate,
}) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section - Munich 1972 Style */}
      <div className="text-center space-y-4 sm:space-y-6">
        {/* Track -> Stopwatch -> Calculator Design */}
        <div className="inline-block relative">
          {/* 8-Lane Oval Track - Vertical orientation (elongated 10%) */}
          <div className="relative w-44 h-24 sm:w-52 sm:h-32" style={{ transform: 'rotate(0deg)' }}>
            {/* Lane 8 (outermost) */}
            <div
              className="absolute inset-0 border-2 rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 7 */}
            <div
              className="absolute inset-1 border-2 rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
            {/* Lane 6 */}
            <div
              className="absolute inset-2 border-2 rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 5 */}
            <div
              className="absolute inset-3 border-2 rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
            {/* Lane 4 */}
            <div
              className="absolute inset-4 border-2 rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 3 */}
            <div
              className="absolute inset-5 border-2 rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
            {/* Lane 2 */}
            <div
              className="absolute inset-6 border-2 rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 1 (innermost) */}
            <div
              className="absolute inset-7 border-2 rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
          </div>
        </div>

        <h2 className="munich-3xl font-bold tracking-tight mb-4" style={{ color: colors.black }}>
          Optimal Progress Pace Calculator
        </h2>

        {/* Show helpful message if race data is pre-populated from profile */}
        {savedProfileData && (raceTime || raceDistance !== '5K') && (
          <div
            className="inline-flex items-center px-4 py-2 bg-opacity-10 rounded-lg mb-4"
            style={{
              backgroundColor: colors.lightBlue,
              color: colors.darkBlue,
            }}
          >
            <Target className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Using your goal race from profile: {raceDistance}
              {raceTime ? ` in ${raceTime}` : ''}
            </span>
          </div>
        )}

        <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4 leading-relaxed" style={{ color: colors.black }}>
          Enter a recent race time to get coach-grade training paces. These are the same inputs I use when I build personalized plans.
        </p>

        {/* Value proposition badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full border"
            style={{
              borderColor: colors.lightBlue,
              backgroundColor: colors.lightBlue + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightBlue }} />
            <span className="text-sm font-medium">Elite-Tested</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full border"
            style={{
              borderColor: colors.lightGreen,
              backgroundColor: colors.lightGreen + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightGreen }} />
            <span className="text-sm font-medium">Instant Results</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full border"
            style={{
              borderColor: colors.orange,
              backgroundColor: colors.orange + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.orange }} />
            <span className="text-sm font-medium">Coach-built sample</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center px-4">
          <Link
            to="/apply"
            className="munich-btn munich-btn-primary um-cta"
            style={{ textAlign: 'center' }}
            aria-label="Apply for personalized coaching"
          >
            Apply for personalized coaching
          </Link>
          <Link
            to="/coach"
            className="munich-btn munich-btn-outline"
            style={{ textAlign: 'center' }}
            aria-label="Meet the coach behind GoldenPace"
          >
            Meet the coach
          </Link>
        </div>
      </div>

      {/* Calculator Card - Munich 1972 Geometric Style */}
      <div className="max-w-2xl mx-auto">
        <div className="shadow-sm border relative overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
          {/* Progressive Melange Background */}
          <div className="absolute inset-0 progressive-melange opacity-5" />

          {/* Subtle geometric corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2" style={{ borderColor: colors.lightBlue }} />
          <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2" style={{ borderColor: colors.lightGreen }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2" style={{ borderColor: colors.lightGreen }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2" style={{ borderColor: colors.lightBlue }} />

          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 relative z-10">
            <h3 className="text-lg sm:text-xl font-bold flex items-center" style={{ color: colors.black }}>
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" style={{ color: colors.lightBlue }} />
              Optimal Progress Pace Calculator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="um-label" style={{ color: colors.black }}>
                  Race Time
                </label>
                <input
                  type="text"
                  placeholder="e.g., 22:30 or 1:22:30"
                  value={raceTime}
                  onChange={(e) => {
                    setRaceTime(e.target.value);
                    if (profileError && profileError.includes('time')) {
                      setProfileError('');
                    }
                  }}
                  onBlur={(e) => {
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
                    backgroundColor: profileError && profileError.includes('time') ? '#fef2f2' : colors.white,
                  }}
                />
                <div id="race-time-help" className="text-xs mt-1" style={{ color: colors.darkGreen }}>
                  Formats: 22:30 (MM:SS) or 1:22:30 (HH:MM:SS). You can also use periods: 22.30
                </div>
              </div>

              <div>
                <label className="um-label" style={{ color: colors.black }}>
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
                    backgroundColor: colors.white,
                  }}
                >
                  <option value="5K">5K</option>
                  <option value="10K">10K</option>
                  <option value="15K">15K</option>
                  <option value="Half Marathon">Half Marathon</option>
                  <option value="Marathon">Marathon</option>
                </select>
              </div>
            </div>

            {/* Error Display */}
            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center">
                  <span className="inline-block w-4 h-4 mr-2 text-red-500">⚠</span>
                  {profileError}
                </p>
              </div>
            )}

            <button
              onClick={handleCalculate}
              title="Calculate GoldenPace"
              aria-label="Calculate training paces from race time"
              className="w-full py-3 px-6 font-semibold munich-base transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg relative btn-high-contrast"
              style={{
                backgroundColor: colors.lightBlue,
                color: colors.white,
                border: `2px solid ${colors.darkGreen}`,
              }}
            >
              Calculate Optimal Progress Pace
              {/* Geometric accent on button */}
              <div
                className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond"
                style={{
                  backgroundColor: colors.lightGreen,
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

