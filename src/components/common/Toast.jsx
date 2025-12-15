import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 5000, onClose, colors }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: colors?.lightGreen || '#2E8B57',
      iconColor: '#FFFFFF',
      borderColor: colors?.darkGreen || '#004225'
    },
    error: {
      icon: XCircle,
      bgColor: '#EF4444',
      iconColor: '#FFFFFF',
      borderColor: '#DC2626'
    },
    warning: {
      icon: AlertCircle,
      bgColor: colors?.orange || '#FF6B35',
      iconColor: '#FFFFFF',
      borderColor: '#C2410C'
    },
    info: {
      icon: Info,
      bgColor: colors?.lightBlue || '#1E6B96',
      iconColor: '#FFFFFF',
      borderColor: '#0F3460'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg shadow-lg border-2 mb-3 animate-slide-in"
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: '#FFFFFF',
        minWidth: '300px',
        maxWidth: '500px'
      }}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: config.iconColor }} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
