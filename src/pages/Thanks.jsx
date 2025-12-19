import React from 'react';
import { getAdaptiveColors } from '../data/colors';
import useScrollTheme from '../hooks/useScrollTheme';

const Thanks = () => {
  const isDark = localStorage.getItem('dark_mode_enabled') === 'true';
  const uiColors = getAdaptiveColors(isDark);
  const { getThemeClass } = useScrollTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden ${getThemeClass('coaching', true)}`} style={{ backgroundColor: uiColors.white }}>
      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        <div className="munich-card">
          <div className="munich-card-body text-center">
            <h1 className="text-3xl font-bold mb-3" style={{ color: uiColors.black }}>Check Your Email</h1>
            <p className="mb-4" style={{ color: uiColors.darkGreen }}>Your free 7‑day personalized training week is on its way.</p>
            <div className="space-x-3">
              <a href="/7-day-plan.html" className="inline-block px-4 py-2 font-semibold border-2 rounded" style={{ borderColor: uiColors.lightBlue, color: uiColors.lightBlue }}>Download 7‑Day Plan</a>
              <a href="/apply" className="inline-block px-4 py-2 font-semibold border-2 rounded" style={{ borderColor: uiColors.lightGreen, color: uiColors.lightGreen }}>Apply for coaching</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
