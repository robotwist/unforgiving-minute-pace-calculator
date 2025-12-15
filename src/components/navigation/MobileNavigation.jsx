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
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div 
          className="flex items-center justify-around py-2 border-t-2 backdrop-blur-sm"
          style={{ 
            backgroundColor: colors.white + 'f0', // Semi-transparent
            borderTopColor: colors.lightBlue + '40'
          }}
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 relative transition-all duration-200"
                aria-label={`Switch to ${tab.label}`}
              >
                {/* Badge for new features */}
                {tab.badge && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.orange }}
                  />
                )}
                
                {/* Icon with active state */}
                <div 
                  className="p-1 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? colors.lightBlue + '20' : 'transparent',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <IconComponent 
                    className="w-5 h-5" 
                    style={{ 
                      color: isActive ? colors.lightBlue : colors.darkGreen 
                    }} 
                  />
                </div>
                
                {/* Label */}
                <span 
                  className="text-xs font-medium mt-1 truncate w-full text-center transition-colors duration-200"
                  style={{ 
                    color: isActive ? colors.lightBlue : colors.darkGreen,
                    fontSize: '10px'
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
      <div className="hidden md:flex items-center justify-center space-x-6 mb-8">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
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
                className="absolute inset-0 transition-transform duration-300 transform translate-x-full group-hover:translate-x-0"
                style={{ 
                  background: `linear-gradient(90deg, ${colors.lightBlue}20, ${colors.lightGreen}20)`,
                  opacity: isActive ? 0 : 1
                }}
              />
              
              {/* Badge for new features */}
              {tab.badge && (
                <div 
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.orange }}
                >
                  <span className="text-xs font-bold" style={{ color: colors.white }}>!</span>
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10 flex items-center space-x-3">
                <IconComponent className="w-5 h-5" />
                <span className="font-semibold tracking-wide">{tab.label}</span>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1"
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
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: colors.black }}>
          Your Progress
        </h2>
        <p className="text-lg" style={{ color: colors.darkGreen }}>
          Track your training journey and improvements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="munich-card">
            <div className="munich-card-body text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: colors.black }}>
                {stat.value}
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: colors.darkGreen }}>
                {stat.label}
              </div>
              <div 
                className="text-xs"
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
          <h3 className="font-bold mb-4" style={{ color: colors.black }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <h3 className="font-bold mb-4" style={{ color: colors.black }}>
              Recent Training
            </h3>
            <div className="space-y-3">
              {trainingHistory.slice(-3).reverse().map((session, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.gray + '30' }}>
                  <div>
                    <div className="font-medium" style={{ color: colors.black }}>
                      {session.type}
                    </div>
                    <div className="text-sm" style={{ color: colors.darkGreen }}>
                      {session.distance} miles • {session.feeling}
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: colors.silver }}>
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
