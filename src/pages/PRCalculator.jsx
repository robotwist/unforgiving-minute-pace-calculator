import React, { useState, useEffect } from 'react';
import PRCalculatorSection from '../components/calculator/pr-calculator/PRCalculatorSection';

const PRCalculator = () => {
  const [darkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode_enabled');
    return saved === 'true';
  });
  
  const [savedProfileData, setSavedProfileData] = useState(null);
  
  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('runningProfile');
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setSavedProfileData(profileData);
      } catch (err) {
        console.error('Error parsing saved profile:', err);
      }
    }
  }, []);
  
  // Use global Munich 1972 CSS variables for consistent design system
  const colors = {
    lightBlue: '#1E6B96',
    darkBlue: '#0F3460',
    lightGreen: '#2E8B57',
    silver: '#C0C0C0',
    violet: '#8B7FC7',
    darkGreen: '#004225',
    orange: '#FF6B35',
    yellow: '#F7931E',
    darkGray: '#666666',
    white: darkMode ? '#1A1A1A' : '#FFFFFF',
    black: darkMode ? '#E5E5E5' : '#1A1A1A',
    gray: darkMode ? '#2D2D2D' : '#F5F5F5',
    border: darkMode ? '#404040' : '#E1E5E9',
    cardBg: darkMode ? '#2D2D2D' : '#FFFFFF',
    text: darkMode ? '#E5E5E5' : '#1A1A1A',
    textSecondary: darkMode ? '#9CA3AF' : '#666666',
    inputBg: darkMode ? '#2D2D2D' : '#FFFFFF',
    buttonSecondary: darkMode ? '#404040' : '#F5F5F5'
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.white }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PRCalculatorSection colors={colors} savedProfileData={savedProfileData} />
      </div>
    </div>
  );
};

export default PRCalculator;
