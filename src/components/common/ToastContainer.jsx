import React from 'react';
import Toast from './Toast';
import { getAdaptiveColors } from '../../data/colors';

/**
 * Toast notification container component
 * Manages multiple toast notifications with proper positioning
 */
const ToastContainer = ({ toasts, onClose }) => {
  const isDark = typeof window !== 'undefined' && localStorage.getItem('dark_mode_enabled') === 'true';
  const uiColors = getAdaptiveColors(isDark);

  return (
    <div
      className="um-fixed um-top-4 right-4 z-50 flex um-flex-col um-items-end"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
          colors={uiColors}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
