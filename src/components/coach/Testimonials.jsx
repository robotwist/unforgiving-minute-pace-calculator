import React from 'react';
import PropTypes from 'prop-types';

/**
 * Testimonials Component
 * Displays athlete feedback and testimonials
 * 
 * @param {Object} props
 * @param {Object} props.colors - Color palette object from design system
 */
const Testimonials = ({ colors }) => {
  const testimonials = [
    {
      quote: "Rob helped me drop from 22:10 to 19:58 in 10 weeks without getting injured. The right workouts at the right time.",
      author: "A.D., 5K runner",
      borderColor: colors.lightBlue
    },
    {
      quote: "Smart, personalized, and motivating. I PR'd my half marathon by 6 minutes.",
      author: "M.K., half marathoner",
      borderColor: colors.lightGreen
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-3" style={{ color: colors.black }}>
        Athlete Feedback
      </h2>
      <div className="space-y-3">
        {testimonials.map((testimonial, index) => (
          <blockquote
            key={index}
            className="munich-card p-4"
            style={{ borderColor: testimonial.borderColor }}
          >
            <p className="text-sm" style={{ color: colors.black }}>
              "{testimonial.quote}"
            </p>
            <cite className="text-xs" style={{ color: colors.darkGreen }}>
              — {testimonial.author}
            </cite>
          </blockquote>
        ))}
      </div>
    </div>
  );
};

Testimonials.propTypes = {
  colors: PropTypes.shape({
    black: PropTypes.string.isRequired,
    darkGreen: PropTypes.string.isRequired,
    lightBlue: PropTypes.string.isRequired,
    lightGreen: PropTypes.string.isRequired,
  }).isRequired,
};

export default Testimonials;

