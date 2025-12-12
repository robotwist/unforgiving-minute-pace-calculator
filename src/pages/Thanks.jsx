import React from 'react';
import { getAdaptiveColors } from '../data/colors';

const Thanks = () => {
  const isDark = localStorage.getItem('dark_mode_enabled') === 'true';
  const uiColors = getAdaptiveColors(isDark);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
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
