import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Users, Clock, TrendingUp } from 'lucide-react';
import colors, { getAdaptiveColors } from '../data/colors';
import useScrollTheme from '../hooks/useScrollTheme';
import CalendlyModal from '../components/consultation/CalendlyModal';
import Testimonials from '../components/coach/Testimonials';
import CoachBio from '../components/coach/CoachBio';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * Enhanced Coach Page Component
 * Premium design with depth, texture, and visual hierarchy
 */
const Coach = () => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const consultationButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const isDark = localStorage.getItem('dark_mode_enabled') === 'true';
  const uiColors = getAdaptiveColors(isDark);
  const { getThemeClass } = useScrollTheme();

  useEffect(() => {
    document.title = 'Coach | Unforgiving Minute';
    setIsVisible(true);
  }, []);

  const handleCloseModal = () => {
    setIsCalendlyOpen(false);
    setTimeout(() => {
      if (consultationButtonRef.current) {
        consultationButtonRef.current.focus();
      }
    }, 100);
  };

  const credentials = [
    { icon: Trophy, text: '5x State Champion', color: uiColors.yellow },
    { icon: Award, text: 'D1 Collegiate Athlete', color: uiColors.lightBlue },
    { icon: Users, text: 'Coach to Champions', color: uiColors.lightGreen },
    { icon: Clock, text: 'Still-Standing Record', color: uiColors.orange },
  ];

  return (
    <div 
      className={`min-h-screen relative overflow-hidden ${getThemeClass('coaching', true)}`}
      style={{ 
        backgroundColor: uiColors.white
      }}
    >

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div 
          className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 um-glass-pill"
              style={{ 
                backgroundColor: `${colors.lightBlue}20`,
                border: `1px solid ${colors.lightBlue}40`,
              }}
            >
              <Trophy size={18} style={{ color: colors.lightBlue }} />
              <span className="text-sm font-semibold" style={{ color: colors.lightBlue }}>
                Elite Coaching
              </span>
            </div>
            
            <h1 
              className="munich-4xl font-bold mb-4 leading-tight"
              style={{ 
                color: uiColors.black,
                textShadow: `0 2px 4px ${uiColors.black}08`
              }}
            >
              Rob Wistrand
            </h1>
            
            <p 
              className="munich-xl font-medium mb-2"
              style={{ color: uiColors.darkGreen }}
            >
              State Champion • D1 Collegiate Athlete
            </p>
            
            <p 
              className="munich-lg mb-8"
              style={{ color: uiColors.black, opacity: 0.7 }}
            >
              Coach to Champions
            </p>

            {/* Credentials Grid - Glassmorphism */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {credentials.map((cred, index) => {
                const Icon = cred.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl transition-all duration-500 hover:scale-105 um-glass-tile ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      backgroundColor: `${cred.color}15`,
                      border: `1px solid ${cred.color}30`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <Icon 
                      size={24} 
                      className="mx-auto mb-2" 
                      style={{ color: cred.color }}
                    />
                    <p 
                      className="text-xs sm:text-sm font-semibold text-center"
                      style={{ color: uiColors.black }}
                    >
                      {cred.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link
                to="/apply"
                className="munich-btn munich-btn-primary um-cta btn-high-contrast group relative overflow-hidden"
                aria-label="Apply for personalized coaching"
                style={{ background: `linear-gradient(135deg, ${uiColors.lightBlue}, ${uiColors.lightGreen})` }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply for Coaching
                  <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${uiColors.lightGreen}, ${uiColors.lightBlue})` }}
                />
              </Link>

              <button
                ref={consultationButtonRef}
                onClick={() => setIsCalendlyOpen(true)}
                aria-label="Schedule a coaching consultation"
                className="munich-btn munich-btn-outline"
              >
                Book a quick fit call
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Layered Cards */}
        <div className="space-y-8">
          {/* Bio Card - Glassmorphism */}
          <div
            className={`munich-card p-8 sm:p-10 lg:p-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: `linear-gradient(135deg, ${uiColors.white}E6, ${uiColors.lightGray}E6)`,
            }}
          >
            <div className="mb-6">
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ color: uiColors.black }}
              >
                The Story
              </h2>
              <div 
                className="h-1 w-24 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${colors.lightBlue}, ${colors.lightGreen})`
                }}
              />
            </div>
            <CoachBio colors={uiColors} />
          </div>

          {/* Testimonials Card - Glassmorphism */}
          <div
            className={`munich-card p-8 sm:p-10 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: `${uiColors.white}E6`,
            }}
          >
            <Testimonials colors={uiColors} />
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <CalendlyModal 
          isOpen={isCalendlyOpen} 
          onClose={handleCloseModal} 
          colors={uiColors} 
        />
      </ErrorBoundary>
    </div>
  );
};

export default Coach;
