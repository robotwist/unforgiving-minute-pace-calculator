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
            <h1 className="text-3xl font-bold mb-4" style={{ color: colors.black }}>Coach</h1>
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
            <div className="max-w-2xl text-base" style={{ color: colors.black }}>
              <p className="mb-2 font-medium">Rob Wistrand — Head Coach, Founder, and Athlete</p>
              <p className="mb-2">
                I started running as soon as I could walk, and my dad mowed a track in our yard right after he showed me a mechanical stopwatch, and I wanted to see if I could run around the track faster than it could mechanically tick around once. I did it, and I asked my parents to time me incessantly. It was a mild obsession, but I had a bunch of them. The first race I remember had more to do with falling than anything at Meadows Elementary in Madison, Wisconsin. My first win was a race at Lake Atalanta when I was in second grade. After that, I placed 8th in the National AAU Championships as a fourth grader. As a fifth grader I ran 4:48 for the 1500 and 10:18 for the 3000, which got me a national champion runner-up at the AAU Nationals in San Antonio, right behind future national-class runner Steve Fein. In 7th grade I broke the 5-minute mile, which is 1609 meters, not the assumed 1600 meters. In 9th grade, I finished in 5th place for the largest classification in the state meet for cross country. I finished in the top 10 for the freshman-sophomore race at the Foot Locker Regional XC Champs. I ended up being a five-time individual state champion by the time I graduated high school and still hold the 800-meter record for my high school almost 30 years later. My letter jacket ran out of room for patches. I ran for the winningest team in all of D1 collegiate sports under the most legendary coach in all of coaching history. I suffered a career-ending injury/illness in the fall of my sophomore year. I went on to coach multiple state champions, age-group champions, race winners, a few who went on to be All-Americans, professionals, and Olympic Trials and national place-winners. I love coaching and have an instinctual knack for what really works. I coach with that uncanny desire that those who have unfinished business do, who love the sport with an innate passion, and who generally enjoy and love seeing people grow and succeed. Running and coaching are the vehicles through which I see people growing and transcending physically, mentally, and spiritually. I really look forward to coaching you and watching you grow and overcome big obstacles to become a better person.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} colors={colors} />
    </div>
  );
};

export default Coach;


