import React from 'react';

const getProgressColor = (colors, percentage) => {
  if (percentage >= 90) return colors.lightGreen;
  if (percentage >= 70) return colors.lightBlue;
  if (percentage >= 50) return colors.orange;
  return colors.violet;
};

const MetricCard = ({ colors, icon: Icon, title, value, subtitle, progress, activeMetric, onActivate }) => (
  <div
    className={`munich-card cursor-pointer transition-all ${
      activeMetric === title.toLowerCase() ? 'ring-2' : ''
    }`}
    style={{
      borderColor: activeMetric === title.toLowerCase() ? colors.lightBlue : 'transparent'
    }}
    onClick={() => onActivate(title.toLowerCase())}
  >
    <div className="munich-card-body">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.lightBlue + '20' }}
        >
          <Icon className="w-5 h-5" style={{ color: colors.lightBlue }} />
        </div>
        {typeof progress === 'number' && (
          <div className="text-right">
            <div
              className="text-xs px-2 py-1 rounded-full"
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
        <div className="text-2xl font-bold mb-1" style={{ color: colors.black }}>
          {value}
        </div>
        <div className="text-sm" style={{ color: colors.darkGreen }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs mt-1" style={{ color: colors.gray }}>
            {subtitle}
          </div>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-3">
          <div
            className="w-full h-1.5 rounded-full"
            style={{ backgroundColor: colors.gray + '30' }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-500"
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


