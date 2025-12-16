import React from 'react';

/**
 * Skip Links for Accessibility
 * Allows keyboard users to skip navigation and jump to main content
 * Best practice for WCAG 2.1 compliance
 */
const SkipLinks = () => {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="skip-link"
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;
