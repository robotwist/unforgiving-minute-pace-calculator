import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getAdaptiveColors } from '../data/colors';
import useScrollTheme from '../hooks/useScrollTheme';

export default function ApplyThanks() {
  const isDark = localStorage.getItem('dark_mode_enabled') === 'true';
  const uiColors = useMemo(() => getAdaptiveColors(isDark), [isDark]);
  const { getThemeClass } = useScrollTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden ${getThemeClass('coaching', true)}`} style={{ backgroundColor: uiColors.white }}>
      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        <div className="munich-card">
          <div className="munich-card-body text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="um-icon-badge" style={{ background: `${uiColors.lightGreen}18`, color: uiColors.lightGreen, border: `1px solid ${uiColors.lightGreen}35` }}>
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: uiColors.black }}>
              Application received
            </h1>
            <p className="mb-5" style={{ color: uiColors.darkGreen }}>
              I'll review your intake and get back to you soon. If it's a fit, I'll invite you to a quick call.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/coach" className="munich-btn munich-btn-primary um-cta" style={{ textAlign: 'center' }}>
                Back to Coach
              </Link>
              <Link to="/" className="munich-btn munich-btn-outline" style={{ textAlign: 'center' }}>
                Explore the app
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
