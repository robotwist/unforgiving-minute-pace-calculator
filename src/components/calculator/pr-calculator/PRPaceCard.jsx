import React from 'react';
import { Clock, TrendingUp, Target, Zap, Gauge } from 'lucide-react';

const PRPaceCard = ({ zone, pace, sourceDistance, isProjected, description, colors, index }) => {
  const zoneConfig = {
    aerobic: {
      name: 'Aerobic',
      icon: Clock,
      color: colors.gray || colors.lightBlue,
      desc: 'Aerobic base building, recovery runs, long runs'
    },
    tempo: {
      name: 'Tempo',
      icon: TrendingUp,
      color: colors.lightGreen,
      desc: 'Lactate threshold, sustainable hard pace'
    },
    threshold: {
      name: 'Threshold',
      icon: Target,
      color: colors.darkGreen,
      desc: 'Hard threshold, comfortably hard pace'
    },
    interval: {
      name: 'Interval',
      icon: Zap,
      color: colors.orange,
      desc: 'VO2max intervals, 3-5 minute efforts'
    },
    repetition: {
      name: 'Repetition',
      icon: Gauge,
      color: colors.lightBlue,
      desc: 'Speed work, 30 seconds to 2 minutes'
    }
  };
  
  const config = zoneConfig[zone] || zoneConfig.aerobic;
  const Icon = config.icon;
  
  return (
    <div
      className="munich-card p-6 text-center relative overflow-hidden transition-all duration-300 hover:scale-105"
      style={{
        borderColor: `${config.color}30`,
      }}
    >
      {/* Progressive Melange Background */}
      <div className="progressive-melange um-melange-overlay um-melange-overlay--03"></div>

      {/* Projected badge */}
      {isProjected && (
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: `${colors.orange}20`,
            color: colors.orange,
            border: `1px solid ${colors.orange}40`
          }}
        >
          Projected
        </div>
      )}

      {/* Enhanced geometric corner accent */}
      <div
        className="absolute top-3 right-3 w-6 h-6 geometric-diamond geometric-float-counterclockwise"
        style={{
          background: `linear-gradient(135deg, ${config.color}, ${config.color}80)`,
          opacity: 0.4,
          animationDelay: `${index * 0.5}s`
        }}
      ></div>

      <div className="relative z-10">
        <div
          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center um-icon-badge"
          style={{
            backgroundColor: `${config.color}20`,
            border: `1px solid ${config.color}40`
          }}
        >
          <Icon className="w-7 h-7" style={{ color: config.color }} />
        </div>
        
        <h4 className="text-lg font-bold mb-1" style={{ color: colors.black }}>
          {config.name}
        </h4>
        
        <p className="text-xs mb-3" style={{ color: colors.textSecondary || colors.darkGray }}>
          {description || config.desc}
        </p>
        
        <div className="text-xl sm:text-2xl font-bold font-mono px-3 py-2 rounded-lg mb-2" style={{
          color: config.color,
          backgroundColor: `${config.color}15`,
          border: `1px solid ${config.color}30`
        }}>
          {pace || 'N/A'}
        </div>
        
        <p className="text-xs mt-2 font-medium" style={{ color: colors.lightBlue }}>
          per mile
        </p>
        
        {sourceDistance && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs" style={{ color: colors.textSecondary || colors.darkGray }}>
              {isProjected ? 'Based on your ' : 'Your '}
              <span className="font-semibold" style={{ color: colors.text || colors.black }}>{sourceDistance}</span>
              {isProjected ? ' PR (projected)' : ' PR pace'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRPaceCard;
