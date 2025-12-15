import React, { useState, useEffect, useRef } from 'react';
import { parseTimeToSeconds } from '../../../utils/riegel';

/**
 * User-friendly time input component with separate hour, minute, and second fields
 * Best practices:
 * - Separate fields are more intuitive than formatted strings
 * - Reduces parsing errors
 * - Better mobile experience (numeric keyboard)
 * - Auto-advances between fields
 * - Shows/hides hours based on distance
 */
const TimeInput = ({ value, onChange, onBlur, distance, colors, error }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [showHours, setShowHours] = useState(false);
  
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);
  
  // Parse initial value
  useEffect(() => {
    if (value && value.trim()) {
      const timeSeconds = parseTimeToSeconds(value);
      if (timeSeconds !== null) {
        const h = Math.floor(timeSeconds / 3600);
        const m = Math.floor((timeSeconds % 3600) / 60);
        const s = timeSeconds % 60;
        
        setHours(h > 0 ? h.toString() : '');
        setMinutes(m.toString());
        setSeconds(s.toString().padStart(2, '0'));
        setShowHours(h > 0);
      }
    } else {
      setHours('');
      setMinutes('');
      setSeconds('');
      setShowHours(false);
    }
  }, [value]);
  
  // Determine if hours field should be shown based on distance
  useEffect(() => {
    const longDistances = ['Marathon', 'Half Marathon', '50K', '50 Mile', '100K', '100 Mile'];
    setShowHours(showHours || longDistances.includes(distance));
  }, [distance, showHours]);
  
  const formatTime = (h, m, s) => {
    const hours = parseInt(h) || 0;
    const minutes = parseInt(m) || 0;
    const seconds = parseInt(s) || 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };
  
  const handleChange = (field, newValue) => {
    // Only allow numbers
    const numericValue = newValue.replace(/[^0-9]/g, '');
    
    // Enforce max values
    let validatedValue = numericValue;
    if (field === 'hours' && numericValue.length > 0) {
      validatedValue = Math.min(parseInt(numericValue) || 0, 23).toString();
    } else if (field === 'minutes' && numericValue.length > 0) {
      validatedValue = Math.min(parseInt(numericValue) || 0, 59).toString();
    } else if (field === 'seconds' && numericValue.length > 0) {
      validatedValue = Math.min(parseInt(numericValue) || 0, 59).toString();
    }
    
    // Update state
    if (field === 'hours') {
      setHours(validatedValue);
      if (validatedValue) setShowHours(true);
    } else if (field === 'minutes') {
      setMinutes(validatedValue);
    } else if (field === 'seconds') {
      setSeconds(validatedValue);
    }
    
    // Format and notify parent
    let h = field === 'hours' ? validatedValue : hours;
    let m = field === 'minutes' ? validatedValue : minutes;
    let s = field === 'seconds' ? validatedValue : seconds;
    
    const formatted = formatTime(h, m, s);
    onChange(formatted);
  };
  
  const handleBlurInternal = () => {
    // Pad seconds to 2 digits if needed
    if (seconds && seconds.length === 1) {
      const paddedSeconds = seconds.padStart(2, '0');
      setSeconds(paddedSeconds);
      const formatted = formatTime(hours, minutes, paddedSeconds);
      onChange(formatted);
    }
    
    if (onBlur) {
      const formatted = formatTime(hours, minutes, seconds);
      onBlur(formatted);
    }
  };
  
  const handleKeyDown = (e, field) => {
    // Auto-advance on Enter or when field is full
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (field === 'hours' && minutesRef.current) {
        minutesRef.current.focus();
      } else if (field === 'minutes' && secondsRef.current) {
        secondsRef.current.focus();
      } else if (field === 'seconds') {
        e.target.blur();
      }
    }
    
    // Auto-advance when max length reached
    if (field === 'hours' && hours.length >= 2 && e.key !== 'Backspace') {
      setTimeout(() => minutesRef.current?.focus(), 0);
    } else if (field === 'minutes' && minutes.length >= 2 && e.key !== 'Backspace') {
      setTimeout(() => secondsRef.current?.focus(), 0);
    } else if (field === 'seconds' && seconds.length >= 2 && e.key !== 'Backspace') {
      setTimeout(() => e.target.blur(), 0);
    }
  };
  
  const inputStyle = {
    borderColor: error ? '#ef4444' : colors.border,
    color: colors.black,
    backgroundColor: error ? '#fef2f2' : colors.white,
    fontFamily: 'monospace',
    fontSize: '1rem',
    textAlign: 'center',
    padding: '0.5rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.25rem',
    width: '100%',
    transition: 'border-color 0.2s ease, background-color 0.2s ease'
  };
  
  return (
    <div className="flex items-center gap-2">
      {showHours && (
        <>
          <input
            ref={hoursRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={hours}
            onChange={(e) => handleChange('hours', e.target.value)}
            onBlur={handleBlurInternal}
            onKeyDown={(e) => handleKeyDown(e, 'hours')}
            placeholder="0"
            maxLength={2}
            style={inputStyle}
            aria-label={`${distance} PR hours`}
            aria-invalid={error ? 'true' : 'false'}
            className="flex-1"
          />
          <span className="text-sm font-semibold" style={{ color: colors.textSecondary || colors.darkGray }}>
            :
          </span>
        </>
      )}
      <input
        ref={minutesRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={minutes}
        onChange={(e) => handleChange('minutes', e.target.value)}
        onBlur={handleBlurInternal}
        onKeyDown={(e) => handleKeyDown(e, 'minutes')}
        placeholder="00"
        maxLength={2}
        style={inputStyle}
        aria-label={`${distance} PR minutes`}
        aria-invalid={error ? 'true' : 'false'}
        className="flex-1"
      />
      <span className="text-sm font-semibold" style={{ color: colors.textSecondary || colors.darkGray }}>
        :
      </span>
      <input
        ref={secondsRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={seconds}
        onChange={(e) => handleChange('seconds', e.target.value)}
        onBlur={handleBlurInternal}
        onKeyDown={(e) => handleKeyDown(e, 'seconds')}
        placeholder="00"
        maxLength={2}
        style={inputStyle}
        aria-label={`${distance} PR seconds`}
        aria-invalid={error ? 'true' : 'false'}
        className="flex-1"
      />
    </div>
  );
};

export default TimeInput;
