import React from 'react';
import colors from '../data/colors';

const Thanks = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.white }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="munich-card">
          <div className="munich-card-body text-center">
            <h1 className="text-3xl font-bold mb-3" style={{ color: colors.black }}>Check Your Email</h1>
            <p className="mb-4" style={{ color: colors.darkGreen }}>Your free 7‑day personalized training week is on its way.</p>
            <div className="space-x-3">
              <a href="/7-day-plan.html" className="inline-block px-4 py-2 font-semibold border-2 rounded" style={{ borderColor: colors.lightBlue, color: colors.lightBlue }}>Download 7‑Day Plan</a>
              <a href="/coach" className="inline-block px-4 py-2 font-semibold border-2 rounded" style={{ borderColor: colors.lightGreen, color: colors.lightGreen }}>Book a Free 15‑min Consult</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thanks;


