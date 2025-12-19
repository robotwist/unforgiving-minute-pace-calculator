import React from 'react';
import PropTypes from 'prop-types';

/**
 * CoachBio Component
 * Displays the coach's biography and background
 * 
 * @param {Object} props
 * @param {Object} props.colors - Color palette object from design system
 */
const CoachBio = ({ colors }) => {
  const bioParagraphs = [
    "Rob Wistrand — Head Coach, Founder, Athlete",
    `I took my very first step and it was a run. Running is the natural state of the creature that we are. One day, my dad pulled out of a tobacco box this old mechanical stopwatch with two metal buttons at the top. My dad hit the button and I knew this loudly ticking mechanical oval had a sacred purpose. I just remember holding it, feeling how solid it was in my hands, and clicking that button over and over just to hear it tick. Something about that sound captured me at the level of my soul.`,
    `My dad told me that the purpose was to measure out the time it took to run around a large oval track called something strange a quarter mile. He said you needed to make it around the track before the hand of the watch could make it around once. I asked if there was a man who could do the task who could fill the unforgiving minute with sixty seconds full of distance run. He laughed and said that plenty of men could do this and that he had done this task. He ran around twice at this pace. Certainly, he was my hero. Then, he told me the story of a man, who set it in his mind and then in his body that he would run around the track four times and run a full mile in less than four minutes. Roger Bannister broke that barrier. He ran the sub-4 minute mile.`,
    `Soon after, I asked my dad if he'd mow an oval into our backyard. I wanted a track so I could see if I could race that stopwatch. I would find the stopwatch and wander around asking my parents to time me. "Time me." "Did I beat my time?" I would ask this every time.`,
    `The first time I remember hearing, "On your marks!" was at an elementary school field day race when I was in kindergarten. I at dust. I remember winning a race at a track meet in third grade and I would run four races and the long jump just to see if I could win them all. It was all just very organized play. By fourth grade, I placed eighth at the National AAU Championships. A year later in San Antonio, I placed runner-up to a kid who'd I go on to race against in college.`,
    "In seventh grade, I broke five minutes in the mile. By ninth grade, I was fifth at our state's biggest cross-country meet and top ten at Foot Locker's freshman-sophomore race. Five state titles followed, plus an 800-meter record that still stands. I ran out of room on my letter jacket for patches.",
    "College brought me to the winningest program in Division I history, training under one of the sport's most legendary coaches. Then it all ended. Injury and illness made that decision for me.",
    "So, I became a coach. State champions, national contenders, athletes who went on to run professionally. I coach with the same wonder and drive that I had initially. I can see the path to get people where they want to go. That is my talent. I can see the path. I can take it. I can tell you how to take the path.",
    "For me, running is all about that feeling where you get lost completely in the activity. Running is where you get to make peace with yourself and with God. Running is where you grow a soul. The watch just gives it a beautiful, unrelenting rhythm. It is the sound of you becoming yourself."
  ];

  return (
    <div className="max-w-2xl um-text-base um-space-y-4 leading-relaxed" style={{ color: colors.black }}>
      {bioParagraphs.map((paragraph, index) => (
        <p key={index} className={index === 0 ? 'um-font-medium' : ''}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

CoachBio.propTypes = {
  colors: PropTypes.shape({
    black: PropTypes.string.isRequired,
  }).isRequired,
};

export default CoachBio;
