import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * CalendlyModal Component
 * Displays a modal with Calendly scheduling widget
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Object} props.colors - Color palette object from design system
 */
const CalendlyModal = ({ isOpen, onClose, colors }) => {
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Check if Calendly is already loaded globally
    if (window.Calendly) {
      setIsCalendlyLoaded(true);
      // Initialize widget if DOM element exists
      const widgetElement = document.getElementById('calendly-inline-widget');
      if (widgetElement) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/robwistrand',
          parentElement: widgetElement,
          prefill: {},
          utm: {}
        });
      }
      return;
    }

    // Only load if not already in the document
    const existingScript = document.querySelector('script[src*="calendly"]');
    if (existingScript) {
      setIsCalendlyLoaded(true);
      return;
    }

    // Load Calendly widget script dynamically
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    script.onload = () => {
      setIsCalendlyLoaded(true);
      // Initialize Calendly widget
      const widgetElement = document.getElementById('calendly-inline-widget');
      if (window.Calendly && widgetElement) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/robwistrand',
          parentElement: widgetElement,
          prefill: {},
          utm: {}
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load Calendly widget script');
      setLoadError(true);
      setIsCalendlyLoaded(false);
    };

    document.head.appendChild(script);

    // Load Calendly CSS only if not already present
    const existingLink = document.querySelector('link[href*="calendly"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [isOpen, isCalendlyLoaded]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when modal opens
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trap - keep focus within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="um-modal-overlay um-modal-overlay--dim"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendly-modal-title"
      aria-describedby="calendly-modal-description"
    >
      <div 
        ref={modalRef}
        className="munich-card um-modal-panel um-modal-panel--4xl um-relative um-overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.white}E8, ${colors.lightGray}E8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Glassmorphism */}
        <div 
          className="um-p-4 um-border-b" 
          style={{ 
            backgroundColor: `${colors.lightGray}80`,
            borderColor: `${colors.border}60`,
          }}
        >
          <div className="um-flex um-items-center um-justify-between">
            <h2 
              id="calendly-modal-title"
              className="um-text-xl um-font-bold" 
              style={{ color: colors.black }}
            >
              Schedule Your Personal Coaching Consultation
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 um-text-2xl um-font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 um-rounded"
              style={{ 
                focusRingColor: colors.lightBlue,
                padding: '0.25rem'
              }}
              aria-label="Close consultation scheduling modal"
            >
              ×
            </button>
          </div>
          <p 
            id="calendly-modal-description"
            className="um-text-sm um-mt-2" 
            style={{ color: colors.darkGreen }}
          >
            Book a 45-minute consultation to discuss your training goals and get personalized recommendations.
          </p>
        </div>

        {/* Calendly Widget Container */}
        <div className="um-p-4">
          {loadError ? (
            <div className="um-text-center py-12" role="alert">
              <p className="um-text-lg um-font-semibold um-mb-2" style={{ color: colors.black }}>
                Unable to load scheduling calendar
              </p>
              <p className="um-text-sm um-mb-4" style={{ color: colors.darkGreen }}>
                Please try the direct link below or refresh the page.
              </p>
              <a 
                href="https://calendly.com/robwistrand" 
                target="_blank" 
                rel="noopener noreferrer"
                className="munich-btn munich-btn-primary inline-block"
                style={{ backgroundColor: colors.lightBlue, color: colors.white }}
              >
                Schedule on Calendly
              </a>
            </div>
          ) : !isCalendlyLoaded ? (
            <div className="um-text-center py-12" aria-live="polite" aria-busy="true">
              <div 
                className="inline-block animate-spin um-rounded-full um-h-8 um-w-8 um-border-b-2" 
                style={{ borderColor: colors.lightBlue }}
                role="status"
                aria-label="Loading"
              ></div>
              <p className="mt-4" style={{ color: colors.darkGreen }}>
                Loading scheduling calendar...
              </p>
            </div>
          ) : (
            <div
              id="calendly-inline-widget"
              style={{ minWidth: '320px', height: '500px' }}
              aria-label="Calendly scheduling widget"
            ></div>
          )}
          
          {/* Fallback link if widget doesn't load */}
          {isCalendlyLoaded && !loadError && (
            <div className="um-text-center um-mt-4 pt-4 um-border-t">
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Having trouble with the calendar? 
                <a 
                  href="https://calendly.com/robwistrand" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline um-font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 um-rounded"
                  style={{ 
                    color: colors.lightBlue,
                    focusRingColor: colors.lightBlue
                  }}
                >
                  Click here to schedule directly
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CalendlyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  colors: PropTypes.shape({
    black: PropTypes.string.isRequired,
    darkGreen: PropTypes.string.isRequired,
    lightBlue: PropTypes.string.isRequired,
    lightGray: PropTypes.string.isRequired,
    white: PropTypes.string.isRequired,
  }).isRequired,
};

export default CalendlyModal;
