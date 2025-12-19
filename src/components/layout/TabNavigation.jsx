import React from 'react';
import { Calculator, Target, BookOpen, Star, User } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab, colors, setShowAdminPanel, darkMode, setDarkMode }) => {
  const tabs = [
    { id: 'calculator', label: 'Optimal Progress Pace', icon: Calculator },
    { id: 'plans', label: 'Training Plans', icon: Target },
    { id: 'blog', label: 'Articles', icon: BookOpen },
    { id: 'premium', label: 'Premium Plans', icon: Star },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="um-relative">
      {/* Header Section with Olympic-inspired design */}
      <div className="um-text-center um-py-4 um-sm-py-8 um-relative um-overflow-hidden">
        {/* Geometric background elements */}
        <div className="um-absolute um-inset-0 opacity-5">
          <div className="um-absolute toum-p-4 left-4 um-w-8 um-h-8 geometric-diamond" style={{ backgroundColor: colors.lightBlue }}></div>
          <div className="um-absolute toum-p-8 right-8 w-6 h-6 geometric-octagon" style={{ backgroundColor: colors.lightGreen }}></div>
          <div className="um-absolute bottom-4 left-8 w-10 um-h-10 geometric-square" style={{ backgroundColor: colors.orange }}></div>
          <div className="um-absolute bottom-8 right-4 w-7 h-7 geometric-diamond" style={{ backgroundColor: colors.violet }}></div>
        </div>
        
        <h1 className="um-text-2xl um-sm-text-4xl um-font-bold um-mb-2 sm:mb-4 tracking-tight um-relative um-z-10" style={{ color: colors.black }}>
          Unforgiving Minute
        </h1>
        <p className="um-text-sm um-sm-text-lg um-mb-4 sm:mb-8 max-w-2xl um-mx-auto um-relative um-z-10" style={{ color: colors.darkGreen }}>
          Professional pace calculation and training plans based on Jack Daniels Running Formula
        </p>
      </div>

      {/* Navigation */}
      <div className="um-flex um-flex-wrap um-justify-center gap-2 sm:gaum-p-4 px-2 um-sm-px-4 um-relative">
        <div className="um-flex um-flex-wrap um-justify-center gap-1 sm:gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={(e) => {
                // Secret admin access: Shift + Click on Articles
                if (id === 'blog' && e.shiftKey) {
                  setShowAdminPanel(true);
                } else {
                  setActiveTab(id);
                }
              }}
              aria-label={`Switch to ${label} tab`}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`flex um-items-center space-x-1 sm:space-x-2 px-2 um-sm-px-4 um-py-2 um-font-medium um-text-xs um-sm-text-sm transition-all duration-200 ${
                activeTab === id
                  ? 'transform translate-y-[-2px] shadow-lg'
                  : 'hover:transform hover:translate-y-[-1px] hover:shadow-md'
              }`}
              style={{
                backgroundColor: activeTab === id ? colors.lightBlue : 'white',
                color: activeTab === id ? 'white' : colors.lightBlue,
                border: `2px solid ${colors.lightBlue}`,
              }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden um-sm\:inline">{label}</span>
              <span className="um-sm\:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 p-2 um-um-rounded-full transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: darkMode ? colors.yellow : colors.gray,
            color: darkMode ? colors.black : colors.lightBlue,
            border: `2px solid ${darkMode ? colors.yellow : colors.lightBlue}`
          }}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
