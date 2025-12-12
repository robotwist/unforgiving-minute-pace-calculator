import React, { useEffect, useState } from 'react';
import colors from '../data/colors';
import CalendlyModal from '../components/consultation/CalendlyModal';
import { coachBio } from '../content/coachBio';

const Coach = () => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  useEffect(() => {
    document.title = 'Coach | Unforgiving Minute';
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.white }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="munich-card" style={{ background: `linear-gradient(135deg, ${colors.yellow}10, ${colors.lightBlue}10)` }}>
          <div className="munich-card-body">
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.black }}>Coach</h1>
            <p className="text-sm mb-6" style={{ color: colors.darkGreen }}>State Champion • D1 Collegiate Athlete • Coach to Champions</p>
            <div className="mb-6">
              <button
                onClick={() => setIsCalendlyOpen(true)}
                aria-label="Schedule a coaching consultation"
                className="munich-btn munich-btn-primary"
                style={{ backgroundColor: colors.lightBlue, color: colors.white }}
              >
                Schedule Consultation
              </button>
            </div>
            <div className="max-w-2xl text-base space-y-4 leading-relaxed" style={{ color: colors.black }}>
              <p className="font-medium">{coachBio.nameLine}</p>
              {coachBio.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-3" style={{ color: colors.black }}>Athlete Feedback</h2>
              <div className="space-y-3">
                <blockquote className="p-4 rounded-lg border" style={{ borderColor: colors.lightBlue, backgroundColor: 'white' }}>
                  <p className="text-sm" style={{ color: colors.black }}>
                    “Rob helped me drop from 22:10 to 19:58 in 10 weeks without getting injured. The right workouts at the right time.”
                  </p>
                  <cite className="text-xs" style={{ color: colors.darkGreen }}>— A.D., 5K runner</cite>
                </blockquote>
                <blockquote className="p-4 rounded-lg border" style={{ borderColor: colors.lightGreen, backgroundColor: 'white' }}>
                  <p className="text-sm" style={{ color: colors.black }}>
                    “Smart, personalized, and motivating. I PR’d my half marathon by 6 minutes.”
                  </p>
                  <cite className="text-xs" style={{ color: colors.darkGreen }}>— M.K., half marathoner</cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} colors={colors} />
    </div>
  );
};

export default Coach;


