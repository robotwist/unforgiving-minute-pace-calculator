// Mobile-First Bottom Navigation
import React from 'react';
import { Calculator, Target, BookOpen, Star, BarChart3 } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange, colors, userHasNewFeatures = false }) => {
  const tabs = [
    { 
      id: 'calculator', 
      label: 'Calculator', 
      icon: Calculator,
      shortLabel: 'Calc'
    },
    { 
      id: 'plans', 
      label: 'Training', 
      icon: Target,
      shortLabel: 'Plans'
    },
    { 
      id: 'progress', 
      label: 'Progress', 
      icon: BarChart3,
      shortLabel: 'Stats',
      badge: userHasNewFeatures
    },
    { 
      id: 'blog', 
      label: 'Learn', 
      icon: BookOpen,
      shortLabel: 'Learn'
    },
    { 
      id: 'premium', 
      label: 'Premium', 
      icon: Star,
      shortLabel: 'Pro'
    }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation - Fixed Position */}
      {/* Safe area padding for devices with home indicator (iPhone X+) */}
      <div className="um-fixed bottom-0 left-0 right-0 um-z-40 um-md-hidden pb-safe">
        <div 
          className="um-flex um-items-center um-justify-around um-border-t-2 backdrop-blur-sm"
          style={{ 
            backgroundColor: colors.white + 'f0', // Semi-transparent
            borderTopColor: colors.lightBlue + '40',
            paddingTop: '4px',
            paddingBottom: 'max(4px, env(safe-area-inset-bottom))' // Safe area for notch devices
          }}
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="um-flex um-flex-col um-items-center um-justify-center min-w-0 flex-1 um-relative transition-all duration-200 touch-manipulation"
                style={{
                  minHeight: '60px', // Touch-friendly: 60px total height (44px minimum + padding)
                  padding: '8px 4px'
                }}
                aria-label={`Switch to ${tab.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Badge for new features */}
                {tab.badge && (
                  <div 
                    className="um-absolute -top-1 right-2 w-3 h-3 um-rounded-full um-z-10"
                    style={{ backgroundColor: colors.orange }}
                    aria-label="New features available"
                  />
                )}
                
                {/* Icon with active state - larger for better touch targets */}
                <div 
                  className="um-rounded-lg transition-all duration-200 flex um-items-center um-justify-center"
                  style={{
                    backgroundColor: isActive ? colors.lightBlue + '20' : 'transparent',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    padding: '6px',
                    minWidth: '44px', // Touch-friendly icon area
                    minHeight: '44px'
                  }}
                >
                  <IconComponent 
                    className="w-6 h-6" // Larger icon (24px instead of 20px) for better visibility
                    style={{ 
                      color: isActive ? colors.lightBlue : colors.darkGreen 
                    }} 
                  />
                </div>
                
                {/* Label - improved readability */}
                <span 
                  className="um-text-xs um-font-medium um-mt-1 truncate um-w-full um-text-center transition-colors duration-200"
                  style={{ 
                    color: isActive ? colors.lightBlue : colors.darkGreen,
                    fontSize: '11px', // Slightly larger for readability
                    lineHeight: '1.2'
                  }}
                >
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Top Navigation - Enhanced */}
      <div className="hidden um-md-flex um-items-center um-justify-center space-x-6 mb-8">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group flex um-items-center um-space-x-3 um-px-6 py-3 um-rounded-lg um-font-medium transition-all duration-300 um-relative um-overflow-hidden ${
                isActive ? 'um-shadow-active' : ''
              }`}
              style={{
                backgroundColor: isActive ? colors.lightBlue : 'transparent',
                color: isActive ? colors.white : colors.darkGreen,
                border: `2px solid ${isActive ? colors.lightBlue : 'transparent'}`,
              }}
              aria-label={`Switch to ${tab.label}`}
            >
              {/* Background Animation */}
              <div 
                className="um-absolute um-inset-0 transition-transform duration-300 transform translate-x-full group-hover:translate-x-0"
                style={{ 
                  background: `linear-gradient(90deg, ${colors.lightBlue}20, ${colors.lightGreen}20)`,
                  opacity: isActive ? 0 : 1
                }}
              />
              
              {/* Badge for new features */}
              {tab.badge && (
                <div 
                  className="um-absolute -top-2 -right-2 w-4 h-4 um-rounded-full flex um-items-center um-justify-center"
                  style={{ backgroundColor: colors.orange }}
                >
                  <span className="um-text-xs um-font-bold" style={{ color: colors.white }}>!</span>
                </div>
              )}
              
              {/* Content */}
              <div className="um-relative um-z-10 flex um-items-center um-space-x-3">
                <IconComponent className="w-5 h-5" />
                <span className="um-font-semibold tracking-wide">{tab.label}</span>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <div 
                  className="um-absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: colors.orange }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Add padding to content when mobile nav is present */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          main {
            padding-bottom: 80px !important;
          }
        }
      `}} />
    </>
  );
};

// Progress Tab Component - New consolidated view
const ProgressTab = ({ colors, userProfile, trainingHistory, personalBests }) => {
  const stats = [
    {
      label: 'Current Optimal Progress Pace',
      value: userProfile?.goldenPace || '--',
      change: '+2 vs last month',
      positive: true
    },
    {
      label: 'Training Sessions',
      value: trainingHistory?.length || 0,
      change: 'This month',
      positive: true
    },
    {
      label: 'Total Miles',
      value: trainingHistory?.reduce((sum, session) => sum + (session.distance || 0), 0) || 0,
      change: 'All time',
      positive: true
    },
    {
      label: 'Best 5K',
      value: personalBests?.['5K'] || '--',
      change: personalBests?.['5K'] ? 'Personal record' : 'Not set',
      positive: !!personalBests?.['5K']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="um-text-center">
        <h2 className="um-text-3xl um-font-bold um-mb-2" style={{ color: colors.black }}>
          Your Progress
        </h2>
        <p className="um-text-lg" style={{ color: colors.darkGreen }}>
          Track your training journey and improvements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="um-grid um-grid-cols-2 um-lg-grid-cols-4 um-gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="munich-card">
            <div className="munich-card-body um-text-center">
              <div className="um-text-2xl um-font-bold mb-1" style={{ color: colors.black }}>
                {stat.value}
              </div>
              <div className="um-text-sm um-font-medium mb-1" style={{ color: colors.darkGreen }}>
                {stat.label}
              </div>
              <div 
                className="um-text-xs"
                style={{ 
                  color: stat.positive ? colors.lightGreen : colors.silver 
                }}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="munich-card">
        <div className="munich-card-body">
          <h3 className="um-font-bold um-mb-4" style={{ color: colors.black }}>
            Quick Actions
          </h3>
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-3 um-gap-4">
            <button className="munich-btn munich-btn-primary">
              Log Workout
            </button>
            <button className="munich-btn munich-btn-outline">
              Update Profile
            </button>
            <button className="munich-btn munich-btn-secondary">
              View Training Plans
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {trainingHistory && trainingHistory.length > 0 && (
        <div className="munich-card">
          <div className="munich-card-body">
            <h3 className="um-font-bold um-mb-4" style={{ color: colors.black }}>
              Recent Training
            </h3>
            <div className="space-y-3">
              {trainingHistory.slice(-3).reverse().map((session, index) => (
                <div key={index} className="um-flex um-justify-between um-items-center um-py-2 um-border-b" style={{ borderColor: colors.gray + '30' }}>
                  <div>
                    <div className="um-font-medium" style={{ color: colors.black }}>
                      {session.type}
                    </div>
                    <div className="um-text-sm" style={{ color: colors.darkGreen }}>
                      {session.distance} miles • {session.feeling}
                    </div>
                  </div>
                  <div className="um-text-sm" style={{ color: colors.silver }}>
                    {session.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { BottomNavigation, ProgressTab };
