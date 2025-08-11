import React, { useEffect, useState } from 'react';
import colors from '../data/colors';
import CalendlyModal from '../components/consultation/CalendlyModal';

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
            <div className="max-w-2xl text-base space-y-4" style={{ color: colors.black }}>
              <p className="font-medium">Rob Wistrand — Head Coach, Founder, and Athlete</p>
              <p>I started running as soon as I could walk. My dad mowed a track in our yard after showing me a mechanical stopwatch, and I wanted to see if I could lap the track faster than it ticked once. I did—and then begged my parents to time me, incessantly. The first race I remember was at Meadows Elementary in Madison, Wisconsin. My first win came at Lake Atalanta in second grade. In fourth grade I placed 8th at the National AAU Championships.</p>
              <p>By fifth grade, I ran 4:48 for 1500 and 10:18 for 3000, finishing national runner-up at AAU Nationals in San Antonio, just behind future national-class runner Steve Fein. In seventh grade I broke the 5-minute mile (that’s 1609 meters, not the assumed 1600). In ninth grade I placed 5th in the largest classification at the state cross country meet and top 10 at the Foot Locker Regional freshman–sophomore race. I graduated a five-time individual state champion and still hold my high school’s 800-meter record nearly 30 years later. My letter jacket ran out of room for patches.</p>
              <p>I ran for the winningest team in Division I collegiate sports under one of the most legendary coaches in history. A career-ending injury/illness in the fall of my sophomore year shifted my path. I went on to coach multiple state champions, age-group champions, race winners, athletes who became All-Americans and professionals, and Olympic Trials and national place-winners.</p>
              <p>I love coaching and have an instinct for what truly works. I coach with the relentless desire of someone with unfinished business—who loves the sport with innate passion and loves seeing people grow and succeed. Running and coaching are the vehicles I use to help people grow and transcend physically, mentally, and spiritually. I’m excited to coach you, watch you grow, and help you overcome big obstacles to become a better person.</p>
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


