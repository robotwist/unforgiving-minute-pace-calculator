import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

/**
 * Simple tooltip component for help text
 * Usage:
 *   <Tooltip content="Helpful explanation text">
 *     <button>Hover me</button>
 *   </Tooltip>
 */
const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  icon: Icon = Info,
  colors 
}) => {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && content && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg max-w-xs ${positionClasses[position]}`}
          style={{
            backgroundColor: colors?.black || '#1A1A1A',
            color: colors?.white || '#FFFFFF',
            border: `1px solid ${colors?.border || '#E1E5E9'}`
          }}
          role="tooltip"
        >
          <div className="whitespace-normal">{content}</div>
          {/* Arrow */}
          <div
            className="absolute w-2 h-2 transform rotate-45"
            style={{
              backgroundColor: colors?.black || '#1A1A1A',
              [position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left']: '-4px',
              left: position === 'top' || position === 'bottom' ? '50%' : 'auto',
              top: position === 'left' || position === 'right' ? '50%' : 'auto',
              transform: `rotate(45deg) ${position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)'}`
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Inline help icon with tooltip
 */
export const HelpIcon = ({ content, colors, className = '' }) => {
  return (
    <Tooltip content={content} colors={colors}>
      <button
        type="button"
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${className}`}
        style={{
          backgroundColor: `${colors?.lightBlue || '#1E6B96'}20`,
          color: colors?.lightBlue || '#1E6B96'
        }}
        aria-label="Help"
      >
        <HelpCircle className="w-3 h-3" />
      </button>
    </Tooltip>
  );
};

export default Tooltip;
