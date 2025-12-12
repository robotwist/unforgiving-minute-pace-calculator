import React, { Component } from 'react';
import colors from '../../data/colors';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * 
 * @class ErrorBoundary
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    // Could send to error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="munich-card p-8 text-center" style={{ backgroundColor: colors.white }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
            Something went wrong
          </h2>
          <p className="mb-4" style={{ color: colors.darkGreen }}>
            We apologize for the inconvenience. Please refresh the page and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="munich-btn munich-btn-primary"
            style={{ backgroundColor: colors.lightBlue, color: colors.white }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

