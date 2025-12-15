import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Enhanced form field component with real-time validation feedback
 * Shows success state, error state, and help text
 */
const FormField = ({
  label,
  error,
  success,
  helpText,
  required = false,
  children,
  colors,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="um-label flex items-center gap-2" style={{ color: colors.black }}>
          <span>{label}</span>
          {required && <span className="text-red-500" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {children}
        
        {/* Success indicator */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="w-5 h-5" style={{ color: colors.lightGreen }} aria-label="Valid" />
          </div>
        )}
        
        {/* Error indicator */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" aria-label="Error" />
          </div>
        )}
      </div>
      
      {/* Help text or error message */}
      {error ? (
        <p className="text-xs text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      ) : helpText ? (
        <p className="text-xs" style={{ color: colors.textSecondary || colors.darkGray }}>
          {helpText}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
