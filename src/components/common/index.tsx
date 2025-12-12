import React, { Component } from 'react';
import { MUNICH_COLORS } from '../../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: keyof typeof MUNICH_COLORS;
  className?: string;
}

export const LoadingSpinner = ({
  size = 'md',
  color = 'lightBlue',
  className = ''
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: MUNICH_COLORS[color],
        borderTopColor: 'transparent'
      }}
    />
  );
};

interface ButtonProps {
  children: any;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'munich-btn relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'munich-btn-primary',
    secondary: 'munich-btn-secondary', 
    outline: 'munich-btn-outline'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </button>
  );
};

interface CardProps {
  children: any;
  className?: string;
  variant?: 'default' | 'header' | 'body';
}

export const Card = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'munich-card',
    header: 'munich-card-header',
    body: 'munich-card-body'
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'number' | 'password';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="um-label" style={{ color: MUNICH_COLORS.black }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`um-field ${error ? 'um-field--error' : ''}`}
        style={{
          borderColor: error ? '#ef4444' : MUNICH_COLORS.gray,
          fontSize: 'var(--text-base)'
        }}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  error,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="um-label" style={{ color: MUNICH_COLORS.black }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`um-field ${error ? 'um-field--error' : ''}`}
        style={{
          borderColor: error ? '#ef4444' : MUNICH_COLORS.gray,
          fontSize: 'var(--text-base)'
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: MUNICH_COLORS.black }}>
            Something went wrong
          </h2>
          <p className="mb-4" style={{ color: MUNICH_COLORS.darkGreen }}>
            We apologize for the inconvenience. Please refresh the page and try again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
          >
            Refresh Page
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
