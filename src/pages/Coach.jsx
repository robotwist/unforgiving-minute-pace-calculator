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
            <div className="max-w-2xl text-base space-y-4 leading-relaxed" style={{ color: colors.black }}>
              <p className="font-medium">Rob Wistrand — Head Coach, Founder, and Athlete</p>
              <p>I was running before I knew running was something you could measure. One afternoon, my dad showed me a mechanical stopwatch. I didn’t even understand what it did, only that its ticking hand moved with the stubborn precision of a tiny machine. I turned it over in my hands, felt the weight of it, clicked the button just to hear the sound.</p>
              <p>Not long after, I asked him to mow an oval into our yard. I wanted a place to run, and I wanted to see if I could make it around that loop before the watch’s hand swept all the way around. The first time I tried, the grass was still slick from the mower’s path, the smell of cut clover in the air. I beat the hand. Then I wanted to do it again. And again. My parents couldn’t finish a meal without me asking them to time me “just once more.”</p>
              <p>The first race I remember wasn’t a win but a fall—Meadows Elementary in Madison, Wisconsin, the taste of dirt in my mouth. My first victory came later, second grade, at Lake Atalanta, legs pumping like I was chasing something invisible but urgent. By fourth grade, I was eighth in the National AAU Championships; a year later, in San Antonio, I was second only to a future national class collegiate runner.</p>
              <p>Seventh grade, I cracked five minutes for the mile—1609 meters, not the imposter 1600. Ninth grade, I was fifth at the state’s largest cross-country classification and top ten at the Foot Locker freshman–sophomore race. Five state titles and a still-standing 800-meter record followed. My letter jacket ran out of space for patches.</p>
              <p>In college, I ran for the winningest team in Division I history, under the sport’s most legendary coach. Then, a career‑ending injury and illness shut it down.</p>
              <p>I started coaching instead. State champions, national contenders, future pros. I coached with the hunger of unfinished business, the instinct that comes from knowing exactly what it feels like to chase the clock.</p>
              <p>Running and coaching have always been the same to me—ways of testing where the line is, and then stepping over it, repeatedly. The stopwatch just made it measurable.</p>
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


