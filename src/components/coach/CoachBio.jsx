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
    "Rob Wistrand — Head Coach, Founder, and Athlete",
    "I was running before I knew running was something you could measure. One afternoon, my dad showed me a mechanical stopwatch. I didn't even understand what it did, only that its ticking hand moved with the stubborn precision of a tiny machine. I turned it over in my hands, felt the weight of it, clicked the button just to hear the sound.",
    "Not long after, I asked him to mow an oval into our yard. I wanted a place to run, and I wanted to see if I could make it around that loop before the watch's hand swept all the way around. The first time I tried, the grass was still slick from the mower's path, the smell of cut clover in the air. I beat the hand. Then I wanted to do it again. And again. My parents couldn't finish a meal without me asking them to time me \"just once more.\"",
    "The first race I remember wasn't a win but a fall—Meadows Elementary in Madison, Wisconsin, the taste of dirt in my mouth. My first victory came later, second grade, at Lake Atalanta, legs pumping like I was chasing something invisible but urgent. By fourth grade, I was eighth in the National AAU Championships; a year later, in San Antonio, I was second only to a future national class collegiate runner.",
    "Seventh grade, I cracked five minutes for the mile—1609 meters, not the imposter 1600. Ninth grade, I was fifth at the state's largest cross-country classification and top ten at the Foot Locker freshman–sophomore race. Five state titles and a still-standing 800-meter record followed. My letter jacket ran out of space for patches.",
    "In college, I ran for the winningest team in Division I history, under the sport's most legendary coach. Then, a career‑ending injury and illness shut it down.",
    "I started coaching instead. State champions, national contenders, future pros. I coached with the hunger of unfinished business, the instinct that comes from knowing exactly what it feels like to chase the clock.",
    "Running and coaching have always been the same to me—ways of testing where the line is, and then stepping over it, repeatedly. The stopwatch just made it measurable."
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

