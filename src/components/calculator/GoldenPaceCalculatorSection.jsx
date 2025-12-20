import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Target } from 'lucide-react';
import TimeInput from './pr-calculator/TimeInput';
import { HelpIcon } from '../common/Tooltip';

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
    <div className="space-y-6 sm:space-y-8 um-hero-gradient">
      {/* Hero Section - Munich 1972 Style with Gradient Background */}
      <div className="um-text-center um-space-y-4 sm:space-y-6">
        {/* Track -> Stopwatch -> Calculator Design */}
        <div className="inline-block um-relative">
          {/* 8-Lane Oval Track - Vertical orientation (elongated 10%) */}
          <div className="um-relative w-44 h-24 sm:w-52 sm:h-32" style={{ transform: 'rotate(0deg)' }}>
            {/* Lane 8 (outermost) */}
            <div
              className="um-absolute um-inset-0 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 7 */}
            <div
              className="um-absolute inset-1 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
            {/* Lane 6 */}
            <div
              className="um-absolute inset-2 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 5 */}
            <div
              className="um-absolute inset-3 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
            {/* Lane 4 */}
            <div
              className="um-absolute inset-4 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 3 */}
            <div
              className="um-absolute inset-5 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
            {/* Lane 2 */}
            <div
              className="um-absolute inset-6 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightBlue,
                background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`,
              }}
            />
            {/* Lane 1 (innermost) */}
            <div
              className="um-absolute inset-7 um-border-2 um-rounded-full"
              style={{
                borderColor: colors.lightGreen,
                background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`,
              }}
            />
          </div>
        </div>

        <h2 className="um-text-4xl um-sm-text-5xl um-lg-text-6xl um-font-black tracking-tight um-mb-6 flex um-items-center um-justify-center um-gap-3" style={{ color: colors.black, lineHeight: '1.1' }}>
          <span>Optimal Progress Pace Calculator</span>
          <HelpIcon 
            content="Optimal Progress Pace is the pace that gives you maximum improvement when run at the right times. Based on Jack Daniels' Running Formula."
            colors={colors}
          />
        </h2>

        {/* Show helpful message if race data is pre-populated from profile */}
        {savedProfileData && (raceTime || raceDistance !== '5K') && (
          <div
            className="inline-flex um-items-center um-px-4 um-py-2 bg-um-opacity-10 um-rounded-lg um-mb-6"
            style={{
              backgroundColor: colors.lightBlue,
              color: colors.darkBlue,
            }}
          >
            <Target className="w-4 h-4 mr-2" />
            <span className="um-text-sm">
              Using your goal race from profile: {raceDistance}
              {raceTime ? ` in ${raceTime}` : ''}
            </span>
          </div>
        )}

        <p className="um-text-lg um-sm-text-xl um-lg-text-2xl max-w-3xl um-mx-auto um-px-4 um-leading-relaxed um-font-medium um-mb-8" style={{ color: colors.black }}>
          Enter a recent race time to get coach-grade training paces. These are the same inputs I use when I build personalized plans.
        </p>

        {/* Value proposition badges */}
        <div className="um-flex um-flex-wrap um-justify-center um-gap-3 mt-6 um-px-4">
          <div
            className="um-flex um-items-center gap-2 px-3 um-py-2 um-rounded-full border"
            style={{
              borderColor: colors.lightBlue,
              backgroundColor: colors.lightBlue + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.lightBlue }} />
            <span className="um-text-sm um-font-medium">Elite-Tested</span>
          </div>
          <div
            className="um-flex um-items-center gap-2 px-3 um-py-2 um-rounded-full border"
            style={{
              borderColor: colors.lightGreen,
              backgroundColor: colors.lightGreen + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.lightGreen }} />
            <span className="um-text-sm um-font-medium">Instant Results</span>
          </div>
          <div
            className="um-flex um-items-center gap-2 px-3 um-py-2 um-rounded-full border"
            style={{
              borderColor: colors.orange,
              backgroundColor: colors.orange + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.orange }} />
            <span className="um-text-sm um-font-medium">Coach-built sample</span>
          </div>
        </div>

        <div className="mt-6 flex um-flex-col um-sm-flex-row um-gap-3 um-justify-center um-px-4">
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
        
        <div className="mt-4 um-text-center">
          <Link
            to="/calculator/pr"
            className="um-text-sm um-font-medium underline"
            style={{ color: colors.lightBlue }}
            aria-label="Try Race Pace Training Plan"
          >
            Or try the Race Pace Training Plan →
          </Link>
        </div>
      </div>

      {/* Calculator Card - Munich 1972 Geometric Style */}
      <div className="max-w-2xl um-mx-auto">
        <div className="shadow-sm border um-relative um-overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
          {/* Olympic Runner Background */}
          <div className="um-olympic-overlay um-olympic-overlay--light"></div>

          {/* Subtle geometric corner accents */}
          <div className="um-absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 um-border-t-2" style={{ borderColor: colors.lightBlue }} />
          <div className="um-absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 um-border-t-2" style={{ borderColor: colors.lightGreen }} />
          <div className="um-absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 um-border-b-2" style={{ borderColor: colors.lightGreen }} />
          <div className="um-absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 um-border-b-2" style={{ borderColor: colors.lightBlue }} />

          <div className="um-p-4 um-sm-p-8 um-space-y-4 sm:space-y-6 um-relative um-z-10">
            <h3 className="um-text-lg um-sm-text-xl um-font-bold flex um-items-center" style={{ color: colors.black }}>
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" style={{ color: colors.lightBlue }} />
              Optimal Progress Pace Calculator
            </h3>

            <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-gap-4 sm:um-gap-6">
              <div>
                <label className="um-label" style={{ color: colors.black }}>
                  Race Time
                </label>
                <TimeInput
                  value={raceTime}
                  onChange={(formattedTime) => {
                    setRaceTime(formattedTime);
                    if (profileError && profileError.includes('time')) {
                      setProfileError('');
                    }
                  }}
                  onBlur={(formattedTime) => {
                    const time = formattedTime.trim();
                    if (time && !parseTimeToSeconds(time)) {
                      setProfileError('Please enter a valid time');
                    }
                  }}
                  distance={raceDistance}
                  colors={colors}
                  error={profileError && profileError.includes('time') ? profileError : undefined}
                />
              </div>

              <div>
                <label className="um-label" style={{ color: colors.black }}>
                  Distance
                </label>
                <select
                  value={raceDistance}
                  onChange={(e) => setRaceDistance(e.target.value)}
                  aria-label="Select race distance"
                  className="um-w-full px-3 um-sm-px-4 py-3 um-border-2 um-font-medium um-text-center"
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
              <div className="mb-4 p-3 bg-red-50 border border-red-200 um-rounded-lg">
                <p className="um-text-sm text-red-700 flex um-items-center">
                  <span className="inline-block w-4 h-4 mr-2 text-red-500">⚠</span>
                  {profileError}
                </p>
              </div>
            )}

            <button
              onClick={handleCalculate}
              title="Calculate GoldenPace"
              aria-label="Calculate training paces from race time"
              className="um-w-full py-3 um-px-6 um-font-semibold munich-base transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg um-relative btn-high-contrast"
              style={{
                backgroundColor: colors.lightBlue,
                color: colors.white,
                border: `2px solid ${colors.darkGreen}`,
              }}
            >
              Calculate Optimal Progress Pace
              {/* Geometric accent on button */}
              <div
                className="um-absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond"
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

