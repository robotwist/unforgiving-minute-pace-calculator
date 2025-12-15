import React, { useState, useEffect } from 'react';
import { parseTimeToSeconds } from '../../../utils/riegel';

/**
 * User-friendly time input component with separate hour/minute/second fields
 * Better UX than single text input for race times
 */
const TimeInput = ({ value, onChange, onBlur, distance, colors, error }) => {
  // Helper to format time parts into string
  const formatTime = (parts) => {
    const h = parseInt(parts.hours) || 0;
    const m = parseInt(parts.minutes) || 0;
    const s = parseInt(parts.seconds) || 0;
    
    if (h === 0 && m === 0 && s === 0) return '';
    
    const minutesStr = (parts.minutes || '0').padStart(2, '0');
    const secondsStr = (parts.seconds || '0').padStart(2, '0');
    
    if (h > 0) {
      return `${h}:${minutesStr}:${secondsStr}`;
    }
    return `${minutesStr}:${secondsStr}`;
  };
  
  // Parse initial value into hours, minutes, seconds
  const parseValue = (timeStr) => {
    if (!timeStr || !timeStr.trim()) {
      return { hours: '', minutes: '', seconds: '' };
    }
    
    const timeSeconds = parseTimeToSeconds(timeStr);
    if (!timeSeconds) {
      return { hours: '', minutes: '', seconds: '' };
    }
    
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600) / 60);
    const seconds = Math.round(timeSeconds % 60);
    
    return {
      hours: hours > 0 ? hours.toString() : '',
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };
  
  const [timeParts, setTimeParts] = useState(() => parseValue(value));
  
  // Update when value prop changes (e.g., from saved profile)
  useEffect(() => {
    if (!value || value.trim() === '') {
      setTimeParts({ hours: '', minutes: '', seconds: '' });
      return;
    }
    
    const newParts = parseValue(value);
    setTimeParts((prevParts) => {
      const prevFormatted = formatTime(prevParts);
      const newFormatted = formatTime(newParts);
      // Only update if the value actually changed
      if (value !== prevFormatted && value === newFormatted) {
        return newParts;
      }
      return prevParts;
    });
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handlePartChange = (part, newValue) => {
    // Only allow digits
    const numericValue = newValue.replace(/\D/g, '');
    
    // Enforce max values
    let sanitized = numericValue;
    if (part === 'hours' && numericValue.length > 0) {
      sanitized = Math.min(parseInt(numericValue) || 0, 23).toString();
    } else if (part === 'minutes' && numericValue.length > 0) {
      sanitized = Math.min(parseInt(numericValue) || 0, 59).toString();
    } else if (part === 'seconds' && numericValue.length > 0) {
      sanitized = Math.min(parseInt(numericValue) || 0, 59).toString();
    }
    
    const updated = {
      ...timeParts,
      [part]: sanitized
    };
    
    setTimeParts(updated);
    
    // Call onChange with formatted time string
    const formatted = formatTime(updated);
    if (onChange) {
      onChange(formatted);
    }
  };
  
  const handleBlur = () => {
    // Ensure minutes and seconds are 2 digits
    const normalized = {
      hours: timeParts.hours,
      minutes: (timeParts.minutes || '0').padStart(2, '0'),
      seconds: (timeParts.seconds || '0').padStart(2, '0')
    };
    
    // Only pad if there's a value
    if (timeParts.minutes && normalized.minutes.length === 1) {
      normalized.minutes = normalized.minutes.padStart(2, '0');
    }
    if (timeParts.seconds && normalized.seconds.length === 1) {
      normalized.seconds = normalized.seconds.padStart(2, '0');
    }
    
    setTimeParts(normalized);
    const formatted = formatTime(normalized);
    
    if (onChange) {
      onChange(formatted);
    }
    
    if (onBlur) {
      onBlur(formatted);
    }
  };
  
  const handleKeyDown = (e, part) => {
    // Allow arrow keys for navigation
    if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      if (part === 'minutes') {
        document.querySelector(`#${distance}-hours`)?.focus();
      } else if (part === 'seconds') {
        document.querySelector(`#${distance}-minutes`)?.focus();
      }
    }
    
    if (e.key === 'ArrowRight' && e.currentTarget.selectionEnd === e.currentTarget.value.length) {
      e.preventDefault();
      if (part === 'hours') {
        document.querySelector(`#${distance}-minutes`)?.focus();
      } else if (part === 'minutes') {
        document.querySelector(`#${distance}-seconds`)?.focus();
      }
    }
    
    // Allow Tab, Backspace, Delete, Arrow keys
    if (['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }
    
    // Only allow digits
    if (!/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };
  
  const inputStyle = {
    borderColor: error ? '#ef4444' : colors.border,
    color: colors.black,
    backgroundColor: error ? '#fef2f2' : colors.white,
  };
  
  // Determine if hours field should be shown
  const showHours = parseInt(timeParts.hours) > 0 || 
    distance === 'Marathon' || 
    distance === 'Half Marathon' || 
    distance.includes('50') || 
    distance.includes('100');
  
  return (
    <div className="flex items-center gap-2">
      {/* Hours - only show for longer distances or when hours > 0 */}
      {showHours && (
        <>
          <div className="flex flex-col items-center flex-1">
            <label className="text-xs mb-1 font-medium" style={{ color: colors.textSecondary || colors.darkGray }}>
              Hrs
            </label>
            <input
              id={`${distance}-hours`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={timeParts.hours}
              onChange={(e) => handlePartChange('hours', e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, 'hours')}
              placeholder="0"
              className="w-full px-2 py-2 border-2 font-mono text-center text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                ...inputStyle,
                focusRingColor: colors.lightBlue,
              }}
              aria-label={`${distance} hours`}
              maxLength={2}
            />
          </div>
          <span className="text-xl font-bold mt-6" style={{ color: colors.black }}>:</span>
        </>
      )}
      
      {/* Minutes */}
      <div className="flex flex-col items-center flex-1">
        <label className="text-xs mb-1 font-medium" style={{ color: colors.textSecondary || colors.darkGray }}>
          Min
        </label>
        <input
          id={`${distance}-minutes`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={timeParts.minutes}
          onChange={(e) => handlePartChange('minutes', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(e, 'minutes')}
          placeholder="00"
          className="w-full px-2 py-2 border-2 font-mono text-center text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{
            ...inputStyle,
            focusRingColor: colors.lightBlue,
          }}
          aria-label={`${distance} minutes`}
          maxLength={2}
        />
      </div>
      <span className="text-xl font-bold mt-6" style={{ color: colors.black }}>:</span>
      
      {/* Seconds */}
      <div className="flex flex-col items-center flex-1">
        <label className="text-xs mb-1 font-medium" style={{ color: colors.textSecondary || colors.darkGray }}>
          Sec
        </label>
        <input
          id={`${distance}-seconds`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={timeParts.seconds}
          onChange={(e) => handlePartChange('seconds', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(e, 'seconds')}
          placeholder="00"
          className="w-full px-2 py-2 border-2 font-mono text-center text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{
            ...inputStyle,
            focusRingColor: colors.lightBlue,
          }}
          aria-label={`${distance} seconds`}
          maxLength={2}
        />
      </div>
    </div>
  );
};

export default TimeInput;
