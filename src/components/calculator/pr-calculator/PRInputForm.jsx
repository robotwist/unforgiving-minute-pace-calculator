import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { DEFAULT_DISTANCES, ADVANCED_DISTANCES } from '../../../data/raceDistances';
import { parseTimeToSeconds } from '../../../utils/riegel';
import TimeInput from './TimeInput';

const PRInputForm = ({ prs, setPRs, goalDistance, setGoalDistance, colors, errors, setErrors }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handlePRChange = (distance, value) => {
    setPRs(prev => ({
      ...prev,
      [distance]: value
    }));
    
    // Clear error for this distance
    if (errors && errors[distance]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[distance];
        return newErrors;
      });
    }
  };
  
  const validateTime = (distance, time) => {
    if (!time || !time.trim()) return true; // Empty is OK
    
    const timeSeconds = parseTimeToSeconds(time);
    if (!timeSeconds || timeSeconds <= 0) {
      if (setErrors) {
        setErrors(prev => ({
          ...prev,
          [distance]: 'Please enter a valid time'
        }));
      }
      return false;
    }
    
    return true;
  };
  
  const handleBlur = (distance, value) => {
    validateTime(distance, value);
  };
  
  const renderDistanceInput = (distance) => {
    const value = prs[distance] || '';
    const error = errors && errors[distance];
    
    return (
      <div key={distance} className="space-y-2">
        <label className="um-label text-sm font-medium" style={{ color: colors.black }}>
          {distance}
        </label>
        <div className="relative">
          <TimeInput
            value={value}
            onChange={(formattedTime) => handlePRChange(distance, formattedTime)}
            onBlur={(formattedTime) => handleBlur(distance, formattedTime)}
            distance={distance}
            colors={colors}
            error={error}
          />
          {error && (
            <div id={`${distance}-error`} className="text-xs mt-2 text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Goal Distance Selector */}
      <div>
        <label className="um-label font-semibold" style={{ color: colors.black }}>
          Primary Goal Distance
        </label>
        <select
          value={goalDistance}
          onChange={(e) => setGoalDistance(e.target.value)}
          className="w-full px-4 py-3 border-2 font-medium text-center"
          style={{
            borderColor: colors.border,
            color: colors.black,
            backgroundColor: colors.white,
          }}
          aria-label="Select primary goal distance"
        >
          <option value="5K">5K</option>
          <option value="10K">10K</option>
          <option value="Half Marathon">Half Marathon</option>
          <option value="Marathon">Marathon</option>
          <option value="50K">50K</option>
          <option value="50 Mile">50 Mile</option>
        </select>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary || colors.darkGray }}>
          Training zones will be mapped based on this goal distance
        </p>
      </div>
      
      {/* Default Distances */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.black }}>
          Personal Records
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_DISTANCES.map(distance => renderDistanceInput(distance))}
        </div>
      </div>
      
      {/* Advanced Distances */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-4 py-2 border-2 rounded"
          style={{
            borderColor: colors.border,
            color: colors.lightBlue,
            backgroundColor: 'transparent'
          }}
          aria-expanded={showAdvanced}
          aria-label={showAdvanced ? 'Hide advanced distances' : 'Show advanced distances'}
        >
          <span className="font-medium">Add More Distances</span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADVANCED_DISTANCES.map(distance => renderDistanceInput(distance))}
          </div>
        )}
      </div>
      
      {/* Help Text */}
      <div className="p-3 rounded" style={{ backgroundColor: `${colors.lightBlue}10`, border: `1px solid ${colors.lightBlue}30` }}>
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 mt-0.5" style={{ color: colors.lightBlue }} />
          <div className="text-xs" style={{ color: colors.textSecondary || colors.darkGray }}>
            <p className="font-medium mb-1">Time Entry:</p>
            <p>Enter your race time using the separate hour, minute, and second fields. Hours field will appear automatically for longer distances.</p>
            <p className="mt-2">You only need one PR to get started. Additional PRs improve accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRInputForm;
