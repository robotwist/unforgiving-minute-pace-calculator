import React, { useState, useEffect } from 'react';

const CalendlyModal = ({ isOpen, onClose, colors }) => {
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isCalendlyLoaded) {
      // Load Calendly widget script dynamically
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setIsCalendlyLoaded(true);
        // Initialize Calendly widget
        if (window.Calendly) {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/your-calendly-username/consultation',
            parentElement: document.getElementById('calendly-inline-widget'),
            prefill: {},
            utm: {}
          });
        }
      };
      document.head.appendChild(script);

      // Load Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        // Cleanup scripts when modal closes
        const scripts = document.querySelectorAll('script[src*="calendly"]');
        const links = document.querySelectorAll('link[href*="calendly"]');
        scripts.forEach(script => script.remove());
        links.forEach(link => link.remove());
      };
    }
  }, [isOpen, isCalendlyLoaded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b" style={{ backgroundColor: colors.lightGray }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.black }}>
              Schedule Your Personal Coaching Consultation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-sm mt-2" style={{ color: colors.darkGreen }}>
            Book a 45-minute consultation to discuss your training goals and get personalized recommendations.
          </p>
        </div>

        {/* Calendly Widget Container */}
        <div className="p-4">
          {!isCalendlyLoaded ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.lightBlue }}></div>
              <p className="mt-4" style={{ color: colors.darkGreen }}>Loading scheduling calendar...</p>
            </div>
          ) : (
            <div
              id="calendly-inline-widget"
              style={{ minWidth: '320px', height: '500px' }}
            ></div>
          )}
          
          {/* Fallback link if widget doesn't load */}
          <div className="text-center mt-4 pt-4 border-t">
            <p className="text-sm" style={{ color: colors.darkGreen }}>
              Having trouble with the calendar? 
              <a 
                href="https://calendly.com/your-calendly-username/consultation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 underline font-semibold"
                style={{ color: colors.lightBlue }}
              >
                Click here to schedule directly
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyModal;
