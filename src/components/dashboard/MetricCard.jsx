import React from 'react';

const getProgressColor = (colors, percentage) => {
  if (percentage >= 90) return colors.lightGreen;
  if (percentage >= 70) return colors.lightBlue;
  if (percentage >= 50) return colors.orange;
  return colors.violet;
};

const MetricCard = ({ colors, icon: Icon, title, value, subtitle, progress, activeMetric, onActivate }) => (
  <div
    className={`munich-card um-cursor-pointer transition-all ${
      activeMetric === title.toLowerCase() ? 'ring-2' : ''
    }`}
    style={{
      borderColor: activeMetric === title.toLowerCase() ? colors.lightBlue : 'transparent'
    }}
    onClick={() => onActivate(title.toLowerCase())}
  >
    <div className="munich-card-body">
      <div className="um-flex um-items-center um-justify-between um-mb-3">
        <div
          className="w-10 um-h-10 um-rounded-full flex um-items-center um-justify-center"
          style={{ backgroundColor: colors.lightBlue + '20' }}
        >
          <Icon className="w-5 h-5" style={{ color: colors.lightBlue }} />
        </div>
        {typeof progress === 'number' && (
          <div className="um-text-right">
            <div
              className="um-text-xs px-2 py-1 um-rounded-full"
              style={{
                backgroundColor: getProgressColor(colors, progress) + '20',
                color: getProgressColor(colors, progress)
              }}
            >
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="um-text-2xl um-font-bold mb-1" style={{ color: colors.black }}>
          {value}
        </div>
        <div className="um-text-sm" style={{ color: colors.darkGreen }}>
          {title}
        </div>
        {subtitle && (
          <div className="um-text-xs um-mt-1" style={{ color: colors.gray }}>
            {subtitle}
          </div>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-3">
          <div
            className="um-w-full h-1.5 um-rounded-full"
            style={{ backgroundColor: colors.gray + '30' }}
          >
            <div
              className="h-1.5 um-rounded-full transition-all duration-500"
              style={{
                backgroundColor: getProgressColor(colors, progress),
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default MetricCard;


