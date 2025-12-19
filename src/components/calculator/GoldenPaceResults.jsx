import React, { useState, memo, useMemo } from 'react';
import { Clock, TrendingUp, Star, Target, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const GoldenPaceResults = memo(({
  colors,
  goldenPace,
  trainingPaces,
  setActiveTab,
  savedProfileData
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadError, setLeadError] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);

  const submitLead = async (e) => {
    e.preventDefault();
    setLeadError('');
    if (!leadEmail || !/^\S+@\S+\.\S+$/.test(leadEmail)) {
      setLeadError('Please enter a valid email');
      return;
    }
    setLeadLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: leadEmail, name: leadName, source: 'calculator_result' })
      });
      if (window.gtag) {
        window.gtag('event', 'lead_submit', { source: 'calculator_result' });
      }
      showToast('Email submitted successfully!', 'success');
      navigate('/thanks');
    } catch (err) {
      const errorMsg = 'Could not submit. Please try again.';
      setLeadError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLeadLoading(false);
    }
  };

  // Memoize expensive computations
  const paceCardsData = useMemo(() => {
    if (!trainingPaces) return [];
    return [
      { name: 'Easy', pace: trainingPaces.easy, icon: Clock, description: 'Recovery runs, long runs' },
      { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, description: 'Tempo runs, lactate threshold' },
      { name: 'Interval', pace: trainingPaces.interval, icon: Clock, description: 'VO2 max workouts' },
      { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, description: 'Speed workouts' }
    ];
  }, [trainingPaces]);

  return (
    <div className="space-y-8">
      {/* GoldenPace Display - Enhanced Glassmorphism */}
      <div
        className="munich-card um-card-accent um-text-center um-p-8 sm:p-10 lg:p-12 um-relative um-overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.white}E6, ${colors.lightGray}E6)`,
          borderColor: `${colors.lightBlue}40`,
        }}
      >
        {/* Progressive Melange Background */}
        <div className="progressive-melange um-melange-overlay um-melange-overlay--05"></div>

        {/* Enhanced geometric border accents */}
        <div className="um-absolute top-0 left-1/2 transform -translate-x-1/2 um-w-12 h-2 um-sm-w-16 sm:h-2 um-rounded-full"
             style={{
               background: `linear-gradient(90deg, ${colors.lightBlue}, ${colors.lightGreen})`,
               boxShadow: `0 2px 8px ${colors.lightBlue}30`
             }}></div>
        <div className="um-absolute bottom-0 left-1/2 transform -translate-x-1/2 um-w-12 h-2 um-sm-w-16 sm:h-2 um-rounded-full"
             style={{
               background: `linear-gradient(90deg, ${colors.lightGreen}, ${colors.lightBlue})`,
               boxShadow: `0 2px 8px ${colors.lightGreen}30`
             }}></div>

        <div className="um-relative um-z-10">
          <div className="munich-4xl um-font-bold um-mb-4" style={{
            color: colors.lightBlue,
            textShadow: `0 2px 4px ${colors.lightBlue}08`
          }}>
            {goldenPace}
          </div>
          <div className="munich-xl um-font-medium um-mb-2" style={{ color: colors.black }}>
            Optimal Progress Pace
          </div>
          <div className="mt-4 um-p-4 um-rounded-lg" style={{
            backgroundColor: `${colors.lightBlue}10`,
            border: `1px solid ${colors.lightBlue}30`
          }}>
            <p className="um-text-sm um-sm-text-base um-font-medium um-mb-2" style={{ color: colors.black }}>
              What is Optimal Progress Pace?
            </p>
            <p className="um-text-xs um-sm-text-sm" style={{ color: colors.darkGreen }}>
              The pace that gives you maximum improvement when run at the right times in your training. 
              This is the target pace that drives progress—use it in specific workouts to accelerate your fitness gains.
            </p>
          </div>
          <div
            className="inline-flex um-items-center gap-2 um-mt-4 um-px-4 um-py-2 um-rounded-full um-glass-pill"
            style={{
              backgroundColor: `${colors.lightBlue}20`,
              border: `1px solid ${colors.lightBlue}40`,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
            <span className="um-text-sm um-font-medium" style={{ color: colors.black }}>
              Scientifically validated
            </span>
          </div>
        </div>
      </div>

      {/* Training Paces Grid - Enhanced Glassmorphism */}
      <div className="um-grid um-grid-cols-1 um-sm-grid-cols-2 um-lg-grid-cols-4 um-gap-4 sm:um-gap-6">
        {[
          { name: 'Easy', pace: trainingPaces.easy, icon: Clock, color: colors.gray, desc: 'Recovery & long runs' },
          { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, color: colors.lightGreen, desc: 'Tempo & steady runs' },
          { name: 'Interval', pace: trainingPaces.interval, icon: Clock, color: colors.darkGreen, desc: 'High-intensity work' },
          { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, color: colors.lightBlue, desc: 'Speed development' }
        ].map(({ name, pace, icon: Icon, color, desc }, index) => (
          <div
            key={name}
            className="munich-card um-p-6 um-text-center um-relative um-overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              borderColor: `${color}30`,
            }}
          >
            {/* Progressive Melange Background */}
            <div className="progressive-melange um-melange-overlay um-melange-overlay--03"></div>

            {/* Enhanced geometric corner accent */}
            <div
              className="um-absolute top-3 right-3 w-6 h-6 geometric-diamond geometric-float-counterclockwise"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                opacity: 0.4,
                animationDelay: `${index * 0.5}s`
              }}
            ></div>

            <div className="um-relative um-z-10">
              <div
                className="w-14 h-14 um-mx-auto um-mb-4 um-rounded-full flex um-items-center um-justify-center um-icon-badge"
                style={{
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}40`
                }}
              >
                <Icon className="w-7 h-7" style={{ color: color }} />
              </div>
              <h4 className="um-text-lg um-font-bold mb-1" style={{ color: colors.black }}>
                {name}
              </h4>
              <p className="um-text-sm um-mb-3" style={{ color: colors.darkGreen }}>
                {desc}
              </p>
              <div className="um-text-xl um-sm-text-2xl um-font-bold font-mono px-3 um-py-2 um-rounded-lg" style={{
                color: color,
                backgroundColor: `${color}15`,
                border: `1px solid ${color}30`
              }}>
                {pace}
              </div>
              <p className="um-text-xs um-mt-2 um-font-medium" style={{ color: colors.lightBlue }}>
                per mile
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Freemium Flow - Post-Calculation User Journey */}
      <div className="space-y-6">
        {/* Lead capture: 7-day PDF */}
        <div className="munich-card" style={{ borderColor: colors.lightBlue }}>
          <div className="munich-card-body">
          <h3 className="um-text-xl um-font-bold um-mb-2" style={{ color: colors.black }}>Get Your Free 7‑Day Personalized Training Week</h3>
          <p className="um-text-sm um-mb-4" style={{ color: colors.darkGreen }}>Enter your email to receive a downloadable 7‑day plan tailored to your Optimal Progress Pace.</p>
          <form onSubmit={submitLead} className="um-grid um-grid-cols-1 um-md-grid-cols-3 um-gap-3">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="px-3 um-py-2 um-border-2 um-rounded"
              style={{ borderColor: colors.border, color: colors.black, backgroundColor: colors.white }}
              aria-label="Your name"
            />
            <input
              type="email"
              placeholder="Your email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              className={`px-3 um-py-2 um-border-2 um-rounded ${leadError ? 'border-red-500' : ''}`}
              style={{ borderColor: leadError ? '#ef4444' : colors.border, color: colors.black, backgroundColor: colors.white }}
              aria-label="Your email"
              required
            />
            <button
              type="submit"
              disabled={leadLoading}
              className="um-px-4 um-py-2 um-font-semibold um-border-2 um-rounded"
              style={{ borderColor: colors.lightGreen, color: 'white', backgroundColor: colors.lightGreen }}
              aria-label="Send my 7-day personalized week"
            >
              {leadLoading ? 'Sending…' : 'Send My 7‑Day Week'}
            </button>
          </form>
          {leadError && <div className="um-text-sm um-mt-2" style={{ color: '#dc2626' }}>{leadError}</div>}
          </div>
        </div>
        {/* Free Training Week Sample */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 um-border-2 um-rounded-lg um-p-6 um-relative um-overflow-hidden" style={{ 
          borderColor: colors.lightBlue,
          boxShadow: '0 10px 25px rgba(30, 107, 150, 0.15)'
        }}>
          <div className="um-absolute top-0 right-0 w-24 h-24 geometric-diamond" style={{ 
            backgroundColor: colors.orange,
            opacity: 0.08
          }}></div>
          
          <div className="um-relative um-z-10">
            <div className="um-flex um-items-center um-justify-between um-mb-6">
              <div>
                <h3 className="um-text-2xl um-font-bold um-mb-2" style={{ color: colors.black }}>
                  Your Personalized Training Week
                </h3>
                <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                  Based on your {goldenPace} GoldenPace • Elite-tested training system
                </p>
              </div>
              <div className="um-flex um-items-center gap-2">
                <span className="um-px-4 um-py-2 um-rounded-full um-text-sm um-font-bold um-border-2" style={{ 
                  backgroundColor: colors.lightGreen,
                  borderColor: colors.darkGreen,
                  color: 'white'
                }}>
                  FREE SAMPLE
                </span>
              </div>
            </div>
            
            <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-gap-4 mb-8">
              <div className="space-y-3">
                <div className="um-flex um-justify-between um-items-center um-p-4 bg-white um-rounded-lg um-border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                  <div className="um-flex um-items-center um-gap-3">
                    <div className="w-3 h-3 um-rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                    <span className="um-font-medium" style={{ color: colors.black }}>Monday - Recovery Run</span>
                  </div>
                  <span className="font-mono um-font-bold px-2 py-1 um-rounded" style={{ 
                    color: colors.lightBlue,
                    backgroundColor: colors.lightBlue + '15'
                  }}>{trainingPaces.easy}</span>
                </div>
                <div className="um-flex um-justify-between um-items-center um-p-4 bg-white um-rounded-lg um-border-2 shadow-sm" style={{ borderColor: colors.lightGreen + '40' }}>
                  <div className="um-flex um-items-center um-gap-3">
                    <div className="w-3 h-3 um-rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                    <span className="um-font-medium" style={{ color: colors.black }}>Wednesday - Threshold Run</span>
                  </div>
                  <span className="font-mono um-font-bold px-2 py-1 um-rounded" style={{ 
                    color: colors.lightGreen,
                    backgroundColor: colors.lightGreen + '15'
                  }}>{trainingPaces.threshold}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="um-flex um-justify-between um-items-center um-p-4 bg-white um-rounded-lg um-border-2 shadow-sm" style={{ borderColor: colors.darkGreen + '40' }}>
                  <div className="um-flex um-items-center um-gap-3">
                    <div className="w-3 h-3 um-rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                    <span className="um-font-medium" style={{ color: colors.black }}>Friday - Interval Session</span>
                  </div>
                  <span className="font-mono um-font-bold px-2 py-1 um-rounded" style={{ 
                    color: colors.darkGreen,
                    backgroundColor: colors.darkGreen + '15'
                  }}>{trainingPaces.interval}</span>
                </div>
                <div className="um-flex um-justify-between um-items-center um-p-4 bg-white um-rounded-lg um-border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                  <div className="um-flex um-items-center um-gap-3">
                    <div className="w-3 h-3 um-rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                    <span className="um-font-medium" style={{ color: colors.black }}>Sunday - Long Run</span>
                  </div>
                  <span className="font-mono um-font-bold px-2 py-1 um-rounded" style={{ 
                    color: colors.lightBlue,
                    backgroundColor: colors.lightBlue + '15'
                  }}>{trainingPaces.easy}</span>
                </div>
              </div>
            </div>
            
            {/* Value proposition with urgency */}
            <div className="bg-white um-rounded-lg um-p-4 um-mb-6 border" style={{ borderColor: colors.orange + '30' }}>
              <div className="um-flex um-items-start um-gap-3">
                <div className="w-5 h-5 um-rounded-full flex um-items-center um-justify-center" style={{ backgroundColor: colors.orange }}>
                  <Star className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="um-text-sm um-font-medium mb-1" style={{ color: colors.black }}>
                    This is just week 1 of a 12-week journey to your race goal
                  </p>
                  <p className="um-text-xs" style={{ color: colors.darkGreen }}>
                    Full programs include progressive build phases, peak training, and race-specific workouts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="um-flex um-flex-col um-sm-flex-row um-gap-3">
              <button 
                onClick={() => setActiveTab('premium')}
                className="flex-1 um-px-8 um-py-4 um-rounded-lg um-font-bold um-text-lg transition-all duration-200 flex um-items-center um-justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                className="flex-1 um-px-6 um-py-4 um-rounded-lg um-font-medium um-border-2 transition-all duration-200 flex um-items-center um-justify-center"
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
              <a
                href="/apply"
                className="flex-1 um-px-6 um-py-4 um-rounded-lg um-font-semibold um-border-2 transition-all duration-200 flex um-items-center um-justify-center"
                style={{
                  borderColor: colors.lightGreen,
                  color: colors.lightGreen,
                  backgroundColor: 'transparent'
                }}
                aria-label="Apply for coaching"
              >
                <User className="w-5 h-5 mr-2" />
                Apply for coaching
              </a>
            </div>
          </div>
        </div>

        {/* Profile Creation Prompt */}
        {!savedProfileData && (
          <div className="um-border-2 um-rounded-lg um-p-6 um-relative um-overflow-hidden" style={{ 
            borderColor: colors.lightGreen + '60',
            backgroundColor: 'white',
            boxShadow: '0 8px 25px rgba(46, 139, 87, 0.12)'
          }}>
            <div className="um-absolute top-0 left-0 w-32 h-32 geometric-octagon" style={{ 
              backgroundColor: colors.lightGreen,
              opacity: 0.06
            }}></div>
            
            <div className="um-relative um-z-10">
              <div className="um-flex um-items-start um-gap-4 um-mb-4">
                <div className="w-12 um-h-12 um-rounded-full flex um-items-center um-justify-center" style={{ 
                  backgroundColor: colors.lightGreen + '20'
                }}>
                  <User className="w-6 h-6" style={{ color: colors.lightGreen }} />
                </div>
                <div className="flex-1">
                  <h3 className="um-text-xl um-font-bold um-mb-2" style={{ color: colors.black }}>
                    Save Your Progress & Get Personalized Coaching
                  </h3>
                  <p className="um-text-sm um-mb-4" style={{ color: colors.darkGreen }}>
                    Create a free profile to unlock AI-powered training recommendations, track your progress, and get access to our community of elite runners.
                  </p>
                </div>
              </div>
              
              {/* Benefits list */}
              <div className="um-grid um-grid-cols-1 um-sm-grid-cols-2 um-gap-3 um-mb-6">
                <div className="um-flex um-items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="um-text-sm" style={{ color: colors.black }}>Save your Optimal Progress Pace & training paces</span>
                </div>
                <div className="um-flex um-items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="um-text-sm" style={{ color: colors.black }}>Personal training log & progress tracking</span>
                </div>
                <div className="um-flex um-items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="um-text-sm" style={{ color: colors.black }}>AI-powered workout recommendations</span>
                </div>
                <div className="um-flex um-items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                  <span className="um-text-sm" style={{ color: colors.black }}>Access to elite coaching insights</span>
                </div>
              </div>
              
              <div className="um-flex um-flex-col um-sm-flex-row um-gap-3 um-items-center">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="flex-1 um-px-8 um-py-4 um-rounded-lg um-font-bold um-text-lg transition-all duration-200 flex um-items-center um-justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{ 
                    backgroundColor: colors.lightGreen,
                    color: 'white'
                  }}
                  aria-label="Create free running profile to track progress"
                >
                  <User className="w-6 h-6 mr-3" />
                  Create Free Profile Now
                </button>
                <div className="um-flex um-items-center gap-2 um-text-sm" style={{ color: colors.darkGreen }}>
                  <div className="w-4 h-4 um-rounded-full um-border-2" style={{ borderColor: colors.lightGreen }}>
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
});

GoldenPaceResults.displayName = 'GoldenPaceResults';

export default GoldenPaceResults;
