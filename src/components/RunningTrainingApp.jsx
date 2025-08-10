import React, { useState, useEffect } from 'react';
import { Calculator, Target, Clock, TrendingUp, User, BookOpen, Star, Calendar, Activity, Trophy, CheckCircle } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import StripePaymentForm from './StripePaymentForm';
import BlogTabSection from './blog/BlogTabSection';
import PremiumPlansSection from './premium/PremiumPlansSection';
import TrainingPlansSection from './training/TrainingPlansSection';
import WelcomeFlow from './onboarding/WelcomeFlow';
import { BottomNavigation } from './navigation/MobileNavigation';
import PlanRecommendationEngine from './recommendations/PlanRecommendationEngine';
import ProgressDashboard from './dashboard/ProgressDashboard';
import { 
  goldenPaceFrom5K, 
  trainingPacesByVDOT, 
  baseTrainingPlans,
  generatePersonalizedPlan
} from '../data/trainingPlans';
import { articles, getFeaturedArticles } from '../content/articles';
import { 
  trackEvent, 
  trackCalculatorUsage, 
  trackProfileCreation,
  trackPurchaseAttempt,
  trackPurchaseSuccess,
  trackTabNavigation
} from '../utils/analytics';

const RunningTrainingApp = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [raceTime, setRaceTime] = useState('');
  const [raceDistance, setRaceDistance] = useState('5K');
  const [goldenPace, setGoldenPace] = useState(null);
  const [trainingPaces, setTrainingPaces] = useState(null);
  
  // Welcome Flow and Mobile Navigation State
  const [showWelcome, setShowWelcome] = useState(false);
  const [userOnboarded, setUserOnboarded] = useState(
    localStorage.getItem('user_onboarded') === 'true'
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPostCalculatorModal, setShowPostCalculatorModal] = useState(false);
  
  const [userProfile, setUserProfile] = useState({ 
    name: '', 
    email: '', 
    experience: 'beginner',
    goal: '', // New: user's primary goal from onboarding
    weeklyMiles: '', // New: from onboarding
    goalRaceDistance: '5K',
    goalRaceTime: '',
    weeklyMileage: '',
    injuryHistory: '',
    preferredUnits: 'imperial',
    currentGoldenPace: null,
    goldenPaceHistory: [],
    projectedGoldenPace: null,
    trainingStartDate: null,
    onboardingComplete: false, // New: track onboarding completion
    hasSeenPlans: false, // New: track plan viewing
    hasSelectedPlan: false // New: track plan selection
  });
  const [profileError, setProfileError] = useState('');
  const [showProfileDashboard, setShowProfileDashboard] = useState(false);
  const [savedProfileData, setSavedProfileData] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [personalBests, setPersonalBests] = useState({});
  const [trainingPlansCompleted, setTrainingPlansCompleted] = useState([]);
  
  // User activities for progress dashboard (ready for future enhancements)
  const [userActivities] = useState(
    JSON.parse(localStorage.getItem('user_activities') || '[]')
  );
  // const setUserActivities - available for future activity tracking
  
  // Purchase and premium plan state
  const [purchasedPlans, setPurchasedPlans] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Training log form state
  const [showTrainingLogForm, setShowTrainingLogForm] = useState(false);
  const [trainingLogData, setTrainingLogData] = useState({
    type: 'Easy Run',
    distance: '',
    time: '',
    feeling: 'Good',
    effort: 'Easy',
    notes: '',
    weather: '',
    location: ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('runningProfile');
    const savedHistory = localStorage.getItem('trainingHistory');
    const savedPBs = localStorage.getItem('personalBests');
    const savedPlans = localStorage.getItem('completedPlans');
    const savedPurchases = localStorage.getItem('purchasedPlans');
    
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setSavedProfileData(profileData);
      setUserProfile(profileData);
      
      // If profile exists, show dashboard by default
      setShowProfileDashboard(true);
    }
    
    if (savedHistory) {
      setTrainingHistory(JSON.parse(savedHistory));
    }
    
    if (savedPBs) {
      setPersonalBests(JSON.parse(savedPBs));
    }
    
    if (savedPlans) {
      setTrainingPlansCompleted(JSON.parse(savedPlans));
    }
    
    if (savedPurchases) {
      setPurchasedPlans(JSON.parse(savedPurchases));
    }
  }, []);

  // Check for new users and show welcome flow
  useEffect(() => {
    if (!userOnboarded && !savedProfileData) {
      setShowWelcome(true);
    }
  }, [userOnboarded, savedProfileData]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save profile data to localStorage
  const saveProfileData = (profileData) => {
    localStorage.setItem('runningProfile', JSON.stringify(profileData));
    setSavedProfileData(profileData);
  };

  // Add training session to history
  const addTrainingSession = (session) => {
    const newSession = {
      ...session,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      goldenPace: goldenPace
    };
    
    const updatedHistory = [...trainingHistory, newSession];
    setTrainingHistory(updatedHistory);
    localStorage.setItem('trainingHistory', JSON.stringify(updatedHistory));
  };

  // Update personal best
  const updatePersonalBest = (distance, time) => {
    const updatedPBs = {
      ...personalBests,
      [distance]: time
    };
    setPersonalBests(updatedPBs);
    localStorage.setItem('personalBests', JSON.stringify(updatedPBs));
  };

  // Mark training plan as completed
  const completeTrainingPlan = (planName) => {
    const completedPlan = {
      name: planName,
      completedDate: new Date().toISOString().split('T')[0],
      goldenPaceAtCompletion: goldenPace
    };
    
    const updatedPlans = [...trainingPlansCompleted, completedPlan];
    setTrainingPlansCompleted(updatedPlans);
    localStorage.setItem('completedPlans', JSON.stringify(updatedPlans));
  };

  // Handle welcome flow completion
  const handleWelcomeComplete = (userData) => {
    const updatedProfile = {
      ...userProfile,
      goal: userData.goal,
      experience: userData.experience,
      weeklyMiles: userData.weeklyMiles,
      onboardingComplete: true,
      name: userData.name || userProfile.name,
      email: userData.email || userProfile.email
    };
    
    setUserProfile(updatedProfile);
    localStorage.setItem('user_onboarded', 'true');
    localStorage.setItem('runningProfile', JSON.stringify(updatedProfile));
    
    setUserOnboarded(true);
    setShowWelcome(false);
    
    // Track onboarding completion
    trackEvent('User', 'Onboarding Complete', userData.goal);
    trackProfileCreation();
  };

  // Enhanced calculator completion handler
  const handleCalculatorComplete = (results) => {
    const currentCalculatorUses = parseInt(localStorage.getItem('calculator_uses') || '0') + 1;
    localStorage.setItem('calculator_uses', currentCalculatorUses.toString());
    
    setGoldenPace(results.goldenPace);
    setTrainingPaces(results.trainingPaces);
    
    // Update user profile with current golden pace
    const updatedProfile = {
      ...userProfile,
      currentGoldenPace: results.goldenPace,
      goldenPaceHistory: [...(userProfile.goldenPaceHistory || []), {
        pace: results.goldenPace,
        date: new Date().toISOString(),
        raceTime,
        raceDistance
      }]
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('runningProfile', JSON.stringify(updatedProfile));
    
    // Show post-calculator explanation modal
    setShowPostCalculatorModal(true);
    
    // Track calculator completion
    trackCalculatorUsage(raceDistance, raceTime, results.goldenPace);
    trackEvent('Calculator', 'Completed', results.goldenPace.toString());
    
    // Auto-progress to plans if user hasn't seen them yet
    setTimeout(() => {
      if (!updatedProfile.hasSeenPlans) {
        setActiveTab('plans');
        trackEvent('Navigation', 'Auto Progress', 'Calculator to Plans');
        
        // Mark that user has seen plans
        const profileWithPlansSeen = { ...updatedProfile, hasSeenPlans: true };
        setUserProfile(profileWithPlansSeen);
        localStorage.setItem('runningProfile', JSON.stringify(profileWithPlansSeen));
      }
    }, 3000); // 3 second delay to let them see the result
  };

  // Enhanced plan selection handler
  const handlePlanSelect = (plan, source) => {
    setSelectedPlan(plan);
    
    // Track plan selection with source context
    trackEvent('Plan', 'Selected', plan.name, { 
      source,
      goldenPace: goldenPace,
      userGoal: userProfile.goal,
      experience: userProfile.experience 
    });
    
    // Update user profile with plan selection
    const updatedProfile = {
      ...userProfile,
      currentPlan: plan,
      planStartDate: new Date().toISOString(),
      hasSelectedPlan: true
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('runningProfile', JSON.stringify(updatedProfile));
    
    // Show plan details
    setShowPlanDetails(true);
    
    // For premium plans, show purchase modal
    if (plan.premium && !userProfile.isPremium) {
      setSelectedPlanForPurchase(plan);
      setShowPurchaseModal(true);
    }
  };

  // Use global Munich 1972 CSS variables for consistent design system
  const colors = {
    lightBlue: '#1E6B96',      // Munich light blue (primary)
    darkBlue: '#0F3460',       // Darker blue for text/accents
    lightGreen: '#2E8B57',     // Munich green 
    silver: '#C0C0C0',         // Munich silver
    violet: '#8B7FC7',         // Munich violet
    darkGreen: '#004225',      // Munich dark green
    orange: '#FF6B35',         // Munich orange (energy)
    yellow: '#F7931E',         // Munich yellow
    darkGray: '#666666',       // For muted text
    white: darkMode ? '#1A1A1A' : '#FFFFFF',          // Adaptive white/dark
    black: darkMode ? '#E5E5E5' : '#1A1A1A',          // Adaptive black/light
    gray: darkMode ? '#2D2D2D' : '#F5F5F5',           // Adaptive background
    border: darkMode ? '#404040' : '#E1E5E9'          // Adaptive border
  };

  // Get featured articles from imported data
  const featuredArticles = getFeaturedArticles();

  // GoldenPace calculation based on Daniels Running Formula
  const calculateGoldenPace = (time, distance) => {
    const timeInSeconds = parseTimeToSeconds(time);
    if (!timeInSeconds) return null;

    // Validate input
    if (timeInSeconds <= 0) return null;
    
    let distanceInMeters;
    switch(distance) {
      case '5K': distanceInMeters = 5000; break;
      case '10K': distanceInMeters = 10000; break;
      case '15K': distanceInMeters = 15000; break;
      case 'Half Marathon': distanceInMeters = 21097; break;
      case 'Marathon': distanceInMeters = 42195; break;
      default: distanceInMeters = 5000;
    }

    // Convert to equivalent 5K time for GoldenPace lookup
    // Using Daniels Running Formula race time conversion (Riegel formula)
    const equivalent5KTime = timeInSeconds * Math.pow(5000 / distanceInMeters, 1.06);
    
    // Official Daniels GoldenPace table based on 5K times (30-85 range)
    // Now imported from '../data/trainingPlans'

    // Find closest 5K time and interpolate if needed
    const timeKeys = Object.keys(goldenPaceFrom5K).map(Number).sort((a, b) => a - b);
    
    // Handle edge cases
    if (equivalent5KTime <= timeKeys[0]) return goldenPaceFrom5K[timeKeys[0]];
    if (equivalent5KTime >= timeKeys[timeKeys.length - 1]) return goldenPaceFrom5K[timeKeys[timeKeys.length - 1]];
    
    // Find the two closest times for interpolation
    let lowerTime = timeKeys[0];
    let upperTime = timeKeys[timeKeys.length - 1];
    
    for (let i = 0; i < timeKeys.length - 1; i++) {
      if (equivalent5KTime >= timeKeys[i] && equivalent5KTime <= timeKeys[i + 1]) {
        lowerTime = timeKeys[i];
        upperTime = timeKeys[i + 1];
        break;
      }
    }
    
    // Interpolate GoldenPace value
    const lowerGoldenPace = goldenPaceFrom5K[lowerTime];
    const upperGoldenPace = goldenPaceFrom5K[upperTime];
    
    const interpolationFactor = (equivalent5KTime - lowerTime) / (upperTime - lowerTime);
    const interpolatedGoldenPace = lowerGoldenPace + (upperGoldenPace - lowerGoldenPace) * interpolationFactor;
    
    return Math.round(interpolatedGoldenPace * 10) / 10; // Round to 1 decimal place
  };

  // Calculate projected GoldenPace improvement (1 VDOT point per 6 weeks average)
  const calculateProjectedGoldenPace = (currentGoldenPace, trainingStartDate, weeklyMileage = 20) => {
    if (!currentGoldenPace || !trainingStartDate) return null;
    
    const startDate = new Date(trainingStartDate);
    const currentDate = new Date();
    const weeksTraining = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 7));
    
    // Base improvement rate: 1 VDOT point per 6 weeks
    // Adjusted by training volume and consistency
    const baseImprovementRate = 1 / 6; // VDOT points per week
    
    // Mileage factor (optimal around 30-50 mpw for most runners)
    const mileageFactor = Math.min(1.2, Math.max(0.7, weeklyMileage / 40));
    
    // Diminishing returns factor (improvement slows at higher VDOT levels)
    const diminishingFactor = Math.max(0.5, 1 - (currentGoldenPace - 40) * 0.01);
    
    const adjustedImprovementRate = baseImprovementRate * mileageFactor * diminishingFactor;
    const projectedImprovement = weeksTraining * adjustedImprovementRate;
    
    return Math.round((currentGoldenPace + projectedImprovement) * 10) / 10;
  };

  // Generate GoldenPace progression graph data
  const generateGoldenPaceProgression = (startingGoldenPace, trainingStartDate, weeklyMileage = 20, weeksToProject = 52) => {
    if (!startingGoldenPace || !trainingStartDate) return [];
    
    const progression = [];
    const startDate = new Date(trainingStartDate);
    
    for (let week = 0; week <= weeksToProject; week += 2) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7));
      
      // Calculate projected VDOT for this week
      const baseImprovementRate = 1 / 6; // 1 VDOT per 6 weeks
      const mileageFactor = Math.min(1.2, Math.max(0.7, weeklyMileage / 40));
      const diminishingFactor = Math.max(0.5, 1 - (startingGoldenPace - 40) * 0.01);
      const adjustedImprovementRate = baseImprovementRate * mileageFactor * diminishingFactor;
      
      const projectedGoldenPace = startingGoldenPace + (week * adjustedImprovementRate);
      
      progression.push({
        week,
        date: currentDate.toISOString().split('T')[0],
        goldenPace: Math.round(projectedGoldenPace * 10) / 10,
        weeklyMileage: weeklyMileage
      });
    }
    
    return progression;
  };

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') return null;
    
    // Remove any spaces and validate format
    const cleanTime = timeStr.trim();
    
    // Handle formats like "22:30", "1:22:30", "22.30", "1.22.30"
    const parts = cleanTime.split(/[:.]/).map(part => {
      const num = parseInt(part, 10);
      return isNaN(num) ? null : num;
    }).filter(part => part !== null);
    
    if (parts.length === 2) {
      // MM:SS format
      const [minutes, seconds] = parts;
      if (seconds >= 60) return null; // Invalid seconds
      return minutes * 60 + seconds;
    }
    
    if (parts.length === 3) {
      // HH:MM:SS format
      const [hours, minutes, seconds] = parts;
      if (minutes >= 60 || seconds >= 60) return null; // Invalid minutes/seconds
      return hours * 3600 + minutes * 60 + seconds;
    }
    
    return null;
  };



  const calculateTrainingPaces = (goldenPaceValue) => {
    if (!goldenPaceValue) return null;

    // Validate GoldenPace range
    if (goldenPaceValue < 30 || goldenPaceValue > 85) {
      console.warn(`GoldenPace value ${goldenPaceValue} is outside valid range (30-85)`);
      goldenPaceValue = Math.max(30, Math.min(85, goldenPaceValue));
    }

    // Official Daniels training pace table (minutes:seconds per mile)
    // Now using imported data from trainingPlans.js
    const paceTable = trainingPacesByVDOT;

    // Find closest GoldenPace values for interpolation
    const goldenPaceKeys = Object.keys(paceTable).map(Number).sort((a, b) => a - b);
    
    // Handle edge cases
    if (goldenPaceValue <= goldenPaceKeys[0]) return paceTable[goldenPaceKeys[0]];
    if (goldenPaceValue >= goldenPaceKeys[goldenPaceKeys.length - 1]) return paceTable[goldenPaceKeys[goldenPaceKeys.length - 1]];
    
    // Find the two closest GoldenPace values for interpolation
    let lowerGoldenPace = goldenPaceKeys[0];
    let upperGoldenPace = goldenPaceKeys[goldenPaceKeys.length - 1];
    
    for (let i = 0; i < goldenPaceKeys.length - 1; i++) {
      if (goldenPaceValue >= goldenPaceKeys[i] && goldenPaceValue <= goldenPaceKeys[i + 1]) {
        lowerGoldenPace = goldenPaceKeys[i];
        upperGoldenPace = goldenPaceKeys[i + 1];
        break;
      }
    }
    
    // Interpolate training paces
    const lowerPaces = paceTable[lowerGoldenPace];
    const upperPaces = paceTable[upperGoldenPace];
    
    const interpolationFactor = (goldenPaceValue - lowerGoldenPace) / (upperGoldenPace - lowerGoldenPace);
    
    // Helper function to interpolate pace strings
    const interpolatePace = (lowerPace, upperPace) => {
      // Handle range paces (e.g., "7:38-8:39")
      if (lowerPace.includes('-') && upperPace.includes('-')) {
        const [lowerStart, lowerEnd] = lowerPace.split('-').map(p => parseTimeToSeconds(p));
        const [upperStart, upperEnd] = upperPace.split('-').map(p => parseTimeToSeconds(p));
        
        const interpolatedStart = lowerStart + (upperStart - lowerStart) * interpolationFactor;
        const interpolatedEnd = lowerEnd + (upperEnd - lowerEnd) * interpolationFactor;
        
        return `${formatTimeFromSeconds(interpolatedStart)}-${formatTimeFromSeconds(interpolatedEnd)}`;
      }
      
      // Handle single paces
      const lowerSeconds = parseTimeToSeconds(lowerPace);
      const upperSeconds = parseTimeToSeconds(upperPace);
      const interpolatedSeconds = lowerSeconds + (upperSeconds - lowerSeconds) * interpolationFactor;
      
      return formatTimeFromSeconds(interpolatedSeconds);
    };
    
    return {
      easy: interpolatePace(lowerPaces.easy, upperPaces.easy),
      threshold: interpolatePace(lowerPaces.threshold, upperPaces.threshold),
      interval: interpolatePace(lowerPaces.interval, upperPaces.interval),
      repetition: interpolatePace(lowerPaces.repetition, upperPaces.repetition)
    };
  };

  const formatTimeFromSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveProfile = () => {
    try {
      setProfileError('');
      
      // Validation
      if (!userProfile.name || !userProfile.email) {
        setProfileError('Please fill in your name and email');
        return;
      }
      
      const currentDate = new Date().toISOString().split('T')[0];
      const currentGoldenPace = goldenPace || null;
      
      // Initialize GoldenPace history if first time
      let goldenPaceHistory = [];
      if (currentGoldenPace) {
        goldenPaceHistory = [{
          date: currentDate,
          goldenPace: currentGoldenPace,
          raceDistance: raceDistance,
          raceTime: raceTime,
          weeklyMileage: parseInt(userProfile.weeklyMileage) || 20
        }];
      }
      
      // Calculate projected GoldenPace
      const projectedGoldenPace = currentGoldenPace 
        ? calculateProjectedGoldenPace(currentGoldenPace, currentDate, parseInt(userProfile.weeklyMileage) || 20)
        : null;
      
      // Create profile data with GoldenPace tracking
      const profileData = {
        ...userProfile,
        current_vdot: currentGoldenPace,
        currentGoldenPace: currentGoldenPace,
        goldenPaceHistory: goldenPaceHistory,
        projectedGoldenPace: projectedGoldenPace,
        trainingStartDate: currentDate,
        weekly_mileage: parseInt(userProfile.weeklyMileage) || null,
        created_date: currentDate,
        last_updated: currentDate
      };
      
      // Save to localStorage
      saveProfileData(profileData);
      setShowProfileDashboard(true);
      
      // Add this calculation to training history
      if (currentGoldenPace && raceTime && raceDistance) {
        addTrainingSession({
          type: 'GoldenPace Calculation',
          distance: raceDistance,
          time: raceTime,
          goldenPace: currentGoldenPace,
          notes: `Initial GoldenPace calculation: ${currentGoldenPace}. Projected in 6 weeks: ${projectedGoldenPace || 'N/A'}`
        });
        
        // Update personal best if this is better
        const currentPB = personalBests[raceDistance];
        if (!currentPB || parseTimeToSeconds(raceTime) < parseTimeToSeconds(currentPB)) {
          updatePersonalBest(raceDistance, raceTime);
        }
      }
      
      console.log('Profile saved successfully with GoldenPace tracking');
    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileError('Error saving profile. Please try again.');
    }
  };

  const loadProfile = (email) => {
    try {
      // Since we're using localStorage, just load the saved data
      const savedProfile = localStorage.getItem('runningProfile');
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        if (data.email === email) {
          setSavedProfileData(data);
          setShowProfileDashboard(true);
          
          // Update the form with existing data
          setUserProfile({
            name: data.name || '',
            email: data.email || '',
            experience: data.experience || 'beginner',
            goalRaceDistance: data.goalRaceDistance || '5K',
            goalRaceTime: data.goalRaceTime || '',
            weeklyMileage: data.weekly_mileage?.toString() || '',
            injuryHistory: data.injuryHistory || '',
            preferredUnits: 'imperial'
          });
          
          if (data.current_vdot) {
            setGoldenPace(data.current_vdot);
          }
          
          console.log('Profile loaded successfully from localStorage');
        } else {
          console.log('No saved profile found for this email');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = () => {
    try {
      setProfileError('');
      
      // Validation
      if (!userProfile.name || !userProfile.email) {
        setProfileError('Please fill in your name and email');
        return;
      }
      
      const currentDate = new Date().toISOString().split('T')[0];
      const currentGoldenPace = goldenPace || savedProfileData?.currentGoldenPace || null;
      
      // Update GoldenPace history if there's a new GoldenPace
      let updatedGoldenPaceHistory = savedProfileData?.goldenPaceHistory || [];
      if (currentGoldenPace && goldenPace && goldenPace !== savedProfileData?.currentGoldenPace) {
        const newEntry = {
          date: currentDate,
          goldenPace: currentGoldenPace,
          raceDistance: raceDistance,
          raceTime: raceTime,
          weeklyMileage: parseInt(userProfile.weeklyMileage) || 20
        };
        updatedGoldenPaceHistory = [...updatedGoldenPaceHistory, newEntry];
      }
      
      // Recalculate projected GoldenPace
      const projectedGoldenPace = currentGoldenPace 
        ? calculateProjectedGoldenPace(
            currentGoldenPace, 
            savedProfileData?.trainingStartDate || currentDate, 
            parseInt(userProfile.weeklyMileage) || 20
          )
        : null;
      
      // Create updated profile data with enhanced GoldenPace tracking
      const updatedProfileData = {
        ...savedProfileData,
        ...userProfile,
        current_vdot: currentGoldenPace,
        currentGoldenPace: currentGoldenPace,
        goldenPaceHistory: updatedGoldenPaceHistory,
        projectedGoldenPace: projectedGoldenPace,
        trainingStartDate: savedProfileData?.trainingStartDate || currentDate,
        weekly_mileage: parseInt(userProfile.weeklyMileage) || null,
        last_updated: currentDate
      };
      
      // Save to localStorage
      saveProfileData(updatedProfileData);
      setSavedProfileData(updatedProfileData);
      
      console.log('Profile updated successfully with GoldenPace tracking');
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Error updating profile. Please try again.');
    }
  };

  const handleCalculate = () => {
    // Clear any previous errors
    setProfileError('');
    
    // Validate inputs
    if (!raceTime || raceTime.trim() === '') {
      setProfileError('Please enter a race time (e.g., 22:30 or 1:22:30)');
      return;
    }
    
    if (!raceDistance) {
      setProfileError('Please select a race distance');
      return;
    }
    
    // Validate time format
    const timeInSeconds = parseTimeToSeconds(raceTime);
    if (!timeInSeconds || timeInSeconds <= 0) {
      setProfileError('Please enter a valid time format (MM:SS or HH:MM:SS)');
      return;
    }
    
    // Validate reasonable time ranges
    let minTime, maxTime, distanceName;
    switch(raceDistance) {
      case '5K':
        minTime = 10 * 60; // 10:00
        maxTime = 60 * 60; // 60:00
        distanceName = '5K';
        break;
      case '10K':
        minTime = 20 * 60; // 20:00
        maxTime = 2 * 3600; // 2:00:00
        distanceName = '10K';
        break;
      case '15K':
        minTime = 30 * 60; // 30:00
        maxTime = 3 * 3600; // 3:00:00
        distanceName = '15K';
        break;
      case 'Half Marathon':
        minTime = 60 * 60; // 1:00:00
        maxTime = 4 * 3600; // 4:00:00
        distanceName = 'Half Marathon';
        break;
      case 'Marathon':
        minTime = 2 * 3600; // 2:00:00
        maxTime = 8 * 3600; // 8:00:00
        distanceName = 'Marathon';
        break;
      default:
        minTime = 0;
        maxTime = 8 * 3600;
        distanceName = raceDistance;
    }
    
    if (timeInSeconds < minTime || timeInSeconds > maxTime) {
      const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
      };
      setProfileError(`${distanceName} time should be between ${formatTime(minTime)} and ${formatTime(maxTime)}`);
      return;
    }
    
    try {
      const calculatedGoldenPace = calculateGoldenPace(raceTime, raceDistance);
      
      if (!calculatedGoldenPace) {
        setProfileError('Unable to calculate GoldenPace. Please check your inputs and try again.');
        return;
      }
      
      const calculatedTrainingPaces = calculateTrainingPaces(calculatedGoldenPace);
      
      // Use enhanced calculator completion handler
      handleCalculatorComplete({
        goldenPace: calculatedGoldenPace,
        trainingPaces: calculatedTrainingPaces
      });
      
      // Auto-save to profile if profile exists
      if (savedProfileData && calculatedGoldenPace) {
        const updatedProfile = {
          ...savedProfileData,
          currentGoldenPace: calculatedGoldenPace,
          goalRaceTime: raceTime,
          goalRaceDistance: raceDistance,
          lastCalculated: new Date().toISOString()
        };
        saveProfileData(updatedProfile);
      }
      
      // Success feedback
      console.log(`GoldenPace calculated successfully: ${calculatedGoldenPace} for ${raceDistance} in ${raceTime}`);
      
    } catch (error) {
      console.error('Error calculating GoldenPace:', error);
      setProfileError('An error occurred while calculating. Please try again.');
    }
  };

  // Generate personalized training plans based on user's GoldenPace
  const trainingPlans = goldenPace ? 
    baseTrainingPlans.map(plan => generatePersonalizedPlan(plan, Math.round(goldenPace))) :
    baseTrainingPlans;

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // Purchase handlers
  const handlePurchaseClick = (planId, planName, price) => {
    setSelectedPlanForPurchase({ id: planId, name: planName, price });
    setShowPurchaseModal(true);
    // Track purchase attempt
    trackPurchaseAttempt(planId, planName, price);
  };

  // Subscription purchase handler
  const handleSubscriptionPurchase = (tier, tierDetails) => {
    const subscriptionProduct = {
      id: `blog-subscription-${tier}`,
      name: `Blog Subscription - ${tierDetails.name}`,
      price: tierDetails.price
    };
    
    setSelectedPlanForPurchase(subscriptionProduct);
    setShowPurchaseModal(true);
    
    // Track subscription attempt
    trackPurchaseAttempt(subscriptionProduct.id, subscriptionProduct.name, subscriptionProduct.price);
  };

  const handlePaymentSuccess = (paymentResult) => {
    if (!selectedPlanForPurchase) return;
    
    // Handle subscription vs one-time purchase
    if (selectedPlanForPurchase.id.includes('blog-subscription')) {
      // Update user profile with subscription
      const subscriptionTier = selectedPlanForPurchase.id.replace('blog-subscription-', '');
      const updatedProfile = {
        ...userProfile,
        subscription: {
          tier: subscriptionTier,
          status: 'active',
          startDate: new Date().toISOString(),
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          stripeSubscriptionId: paymentResult.subscription?.id || 'mock_sub_' + Date.now()
        }
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } else {
      // Handle training plan purchase
      const newPurchase = {
        id: selectedPlanForPurchase.id,
        name: selectedPlanForPurchase.name,
        price: selectedPlanForPurchase.price,
        purchaseDate: new Date().toISOString(),
        status: 'active',
        stripePaymentId: paymentResult.paymentIntent?.id || 'mock_payment_' + Date.now(),
        transactionId: paymentResult.paymentIntent?.id || 'mock_' + Date.now()
      };
      
      const updatedPurchases = [...purchasedPlans, newPurchase];
      setPurchasedPlans(updatedPurchases);
      localStorage.setItem('purchasedPlans', JSON.stringify(updatedPurchases));
    }
    
    // Track successful purchase
    trackPurchaseSuccess(
      selectedPlanForPurchase.id,
      selectedPlanForPurchase.name,
      selectedPlanForPurchase.price,
      paymentResult.paymentIntent?.id || paymentResult.subscription?.id || 'mock_' + Date.now()
    );
    
    setPurchaseLoading(false);
    setPurchaseSuccess(true);
    setShowPurchaseModal(false);
    setSelectedPlanForPurchase(null);
    
    // Reset success state after 3 seconds
    setTimeout(() => setPurchaseSuccess(false), 3000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPurchaseLoading(false);
    // Could add error state here for user feedback
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedPlanForPurchase(null);
    setPurchaseLoading(false);
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.white }}>
      {/* Welcome Flow Modal */}
      {showWelcome && (
        <WelcomeFlow 
          colors={colors}
          onComplete={handleWelcomeComplete}
          onSkip={() => {
            setShowWelcome(false);
            setUserOnboarded(true);
            localStorage.setItem('user_onboarded', 'true');
            trackEvent('User', 'Onboarding Skipped');
          }}
        />
      )}

      {/* Post-Calculator Explanation Modal */}
      {showPostCalculatorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="munich-card max-w-md w-full">
            <div className="munich-card-body text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: colors.lightGreen + '20' }}>
                <Target className="w-8 h-8" style={{ color: colors.lightGreen }} />
              </div>
              
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.black }}>
                Your Golden Pace: {goldenPace}
              </h3>
              
              <p className="mb-4" style={{ color: colors.darkGreen }}>
                This is your optimal training intensity! Now let's find the perfect training plan 
                to help you reach your {userProfile.goal || 'running'} goals.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPostCalculatorModal(false);
                    setActiveTab('plans');
                    trackEvent('Navigation', 'Modal to Plans');
                  }}
                  className="flex-1 munich-btn munich-btn-primary"
                >
                  View Training Plans
                </button>
                <button
                  onClick={() => setShowPostCalculatorModal(false)}
                  className="flex-1 munich-btn munich-btn-outline"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-2 h-2" style={{ 
          backgroundColor: colors.lightBlue,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}></div>
        <div className="absolute top-40 right-20 w-3 h-3" style={{ 
          backgroundColor: colors.lightGreen,
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
        }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2" style={{ 
          backgroundColor: colors.lightBlue,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
        }}></div>
      </div>
      {/* Header - Munich 1972 Geometric Style with Running Pictogram */}
      <header className="shadow-sm border-b relative overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.gray }}>
        {/* Progressive Melange Background */}
        <div className="absolute inset-0 progressive-melange opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            {/* Brand Logo - Enhanced Prominence */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Geometric logo background */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 geometric-octagon flex items-center justify-center" style={{ 
                  backgroundColor: colors.lightBlue,
                  boxShadow: '0 6px 12px rgba(30,107,150,0.3)'
                }}>
                  {/* Olympic Runner Icon */}
                  <img 
                    src="/olympicrunner72icon.png" 
                    alt="Olympic Runner" 
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain running-pictogram"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                {/* Geometric accent */}
                <div className="absolute -top-1 -right-1 w-4 h-4 geometric-diamond" style={{ 
                  backgroundColor: colors.orange
                }}></div>
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-3xl font-black tracking-wide leading-tight" style={{ 
                  color: colors.black,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  UNFORGIVING MINUTE
                </h1>
                <p className="text-sm sm:text-lg font-bold tracking-wider" style={{ 
                  color: colors.lightBlue,
                  letterSpacing: '0.15em'
                }}>
                  DISTANCE RUNNING
                </p>
                <div className="hidden sm:block mt-1">
                  <div className="h-0.5 w-20 bg-gradient-to-r" style={{ 
                    backgroundImage: `linear-gradient(90deg, ${colors.lightBlue} 0%, ${colors.orange} 50%, ${colors.lightGreen} 100%)`
                  }}></div>
                </div>
              </div>
            </div>
            
            {/* Navigation - Conditional Mobile/Desktop */}
            {!isMobile ? (
              /* Desktop Navigation - Munich 1972 Style */
              <nav className="flex flex-wrap justify-center sm:justify-end space-x-1">
                {[
                  { id: 'calculator', label: 'GoldenPace Calculator', icon: Calculator },
                  { id: 'plans', label: 'Training Plans', icon: Target },
                  { id: 'blog', label: 'Articles', icon: BookOpen },
                  { id: 'premium', label: 'Premium Plans', icon: Star },
                  { id: 'profile', label: 'Profile', icon: User }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={(e) => {
                      // Secret admin access: Shift + Click on Articles
                      if (id === 'blog' && e.shiftKey) {
                        setShowAdminPanel(true);
                      } else {
                        setActiveTab(id);
                        trackTabNavigation(id);
                      }
                    }}
                    aria-label={`Switch to ${label} tab`}
                    aria-current={activeTab === id ? 'page' : undefined}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm transition-all duration-200 ${
                      activeTab === id
                        ? 'text-white shadow-sm'
                        : 'text-gray-600 hover:text-white hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: activeTab === id ? colors.lightBlue : 'transparent',
                      borderBottom: activeTab === id ? `2px solid ${colors.lightGreen}` : 'none'
                    }}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                  </button>
                ))}
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="ml-4 p-2 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: darkMode ? colors.yellow : colors.gray,
                    color: darkMode ? colors.black : colors.lightBlue,
                    border: `2px solid ${darkMode ? colors.yellow : colors.lightBlue}`
                  }}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? (
                    <span className="text-lg">☀️</span>
                  ) : (
                    <span className="text-lg">🌙</span>
                  )}
                </button>
              </nav>
            ) : (
              /* Mobile - Show only brand, navigation will be at bottom */
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: darkMode ? colors.yellow : colors.gray,
                    color: darkMode ? colors.black : colors.lightBlue,
                    border: `2px solid ${darkMode ? colors.yellow : colors.lightBlue}`
                  }}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? (
                    <span className="text-lg">☀️</span>
                  ) : (
                    <span className="text-lg">🌙</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative" style={{ backgroundColor: colors.white, color: colors.black }}>
        {/* Floating runner elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 w-12 h-12 geometric-float-counterclockwise">
          {/* Olympic Runner Icon */}
          <img 
            src="/olympicrunner72icon.png" 
            alt="Olympic Runner" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>
        
        <div className="hidden sm:block absolute top-40 right-20 w-16 h-16 geometric-float-counterclockwise" style={{ animationDelay: '2s' }}>
          {/* Olympic Runner Icon */}
          <img 
            src="/olympicrunner72icon.png" 
            alt="Olympic Runner" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>
        
        <div className="hidden sm:block absolute bottom-40 left-1/4 w-8 h-8 geometric-float-counterclockwise" style={{ animationDelay: '4s' }}>
          {/* Olympic Runner Icon */}
          <img 
            src="/olympicrunner72icon.png" 
            alt="Olympic Runner" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>
        
        {activeTab === 'calculator' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Section - Munich 1972 Style */}
            <div className="text-center space-y-4 sm:space-y-6">
              {/* Track -> Stopwatch -> Calculator Design */}
              <div className="inline-block relative">
                {/* 8-Lane Oval Track - Vertical orientation (elongated 10%) */}
                <div className="relative w-44 h-24 sm:w-52 sm:h-32" style={{ transform: 'rotate(0deg)' }}>
                  {/* Lane 8 (outermost) */}
                  <div className="absolute inset-0 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 7 */}
                  <div className="absolute inset-1 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                  {/* Lane 6 */}
                  <div className="absolute inset-2 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 5 */}
                  <div className="absolute inset-3 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                  {/* Lane 4 */}
                  <div className="absolute inset-4 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 3 */}
                  <div className="absolute inset-5 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                  {/* Lane 2 */}
                  <div className="absolute inset-6 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 1 (innermost) */}
                  <div className="absolute inset-7 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                </div>
                
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: colors.black }}>
                GoldenPace Calculator
              </h2>
              
              {/* Show helpful message if race data is pre-populated from profile */}
              {savedProfileData && (raceTime || raceDistance !== '5K') && (
                <div className="inline-flex items-center px-4 py-2 bg-opacity-10 rounded-lg mb-4" style={{ 
                  backgroundColor: colors.lightBlue,
                  color: colors.darkBlue 
                }}>
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">Using your goal race from profile: {raceDistance}{raceTime ? ` in ${raceTime}` : ''}</span>
                </div>
              )}
              <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4 leading-relaxed" style={{ color: colors.black }}>
                Enter a recent race time to unlock your personalized training paces—used by elite athletes worldwide
              </p>
              
              {/* Value proposition badges */}
              <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
                  borderColor: colors.lightBlue, 
                  backgroundColor: colors.lightBlue + '10',
                  color: colors.black 
                }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                  <span className="text-sm font-medium">Elite-Tested</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
                  borderColor: colors.lightGreen, 
                  backgroundColor: colors.lightGreen + '10',
                  color: colors.black 
                }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                  <span className="text-sm font-medium">Instant Results</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
                  borderColor: colors.orange, 
                  backgroundColor: colors.orange + '10',
                  color: colors.black 
                }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.orange }}></div>
                  <span className="text-sm font-medium">Free Training Sample</span>
                </div>
              </div>
            </div>

            {/* Calculator Card - Munich 1972 Geometric Style */}
            <div className="max-w-2xl mx-auto">
              <div className="shadow-sm border relative overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
                {/* Progressive Melange Background */}
                <div className="absolute inset-0 progressive-melange opacity-5"></div>
                
                {/* Subtle geometric corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2" style={{ borderColor: colors.lightBlue }}></div>
                <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2" style={{ borderColor: colors.lightGreen }}></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2" style={{ borderColor: colors.lightGreen }}></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2" style={{ borderColor: colors.lightBlue }}></div>
                
                <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center" style={{ color: colors.black }}>
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" style={{ color: colors.lightBlue }} />
                    GoldenPace Calculator
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                        Race Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 22:30 or 1:22:30"
                        value={raceTime}
                        onChange={(e) => {
                          setRaceTime(e.target.value);
                          // Clear error when user starts typing
                          if (profileError && profileError.includes('time')) {
                            setProfileError('');
                          }
                        }}
                        onBlur={(e) => {
                          // Validate time format when field loses focus
                          const time = e.target.value.trim();
                          if (time && !parseTimeToSeconds(time)) {
                            setProfileError('Please enter a valid time format (MM:SS or HH:MM:SS)');
                          }
                        }}
                        aria-label="Race time in minutes and seconds"
                        aria-describedby="race-time-help"
                        className={`w-full px-3 sm:px-4 py-3 border-2 font-mono text-base sm:text-lg text-center transition-colors ${
                          profileError && profileError.includes('time') ? 'border-red-500 bg-red-50' : ''
                        }`}
                        style={{ 
                          borderColor: profileError && profileError.includes('time') ? '#ef4444' : colors.border,
                          color: colors.black,
                          backgroundColor: profileError && profileError.includes('time') ? '#fef2f2' : colors.white
                        }}
                      />
                      <div id="race-time-help" className="text-xs mt-1" style={{ color: colors.darkGreen }}>
                        Formats: 22:30 (MM:SS) or 1:22:30 (HH:MM:SS). You can also use periods: 22.30
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                        Distance
                      </label>
                      <select
                        value={raceDistance}
                        onChange={(e) => setRaceDistance(e.target.value)}
                        aria-label="Select race distance"
                        className="w-full px-3 sm:px-4 py-3 border-2 font-medium text-center"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.black,
                          backgroundColor: colors.white
                        }}
                      >
                        <option value="5K">5K</option>
                        <option value="10K">10K</option>
                        <option value="15K">15K</option>
                        <option value="Half Marathon">Half Marathon</option>
                        <option value="Marathon">Marathon</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Error Display */}
                  {profileError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 flex items-center">
                        <span className="inline-block w-4 h-4 mr-2 text-red-500">⚠</span>
                        {profileError}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCalculate}
                    aria-label="Calculate training paces from race time"
                    className="w-full py-3 px-6 font-medium text-base sm:text-lg transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg relative btn-high-contrast"
                    style={{ 
                      backgroundColor: colors.lightBlue,
                      color: colors.white,
                      border: `2px solid ${colors.darkGreen}`
                    }}
                  >
                    Calculate GoldenPace
                    {/* Geometric accent on button */}
                    <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond" style={{ 
                      backgroundColor: colors.lightGreen
                    }}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section - Munich 1972 Geometric Style */}
            {goldenPace && trainingPaces && (
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                {/* GoldenPace Display */}
                <div className="text-center p-4 sm:p-6 bg-white shadow-sm border relative overflow-hidden" style={{ borderColor: colors.border }}>
                  {/* Progressive Melange Background */}
                  <div className="absolute inset-0 progressive-melange opacity-5"></div>
                  
                  {/* Geometric border accents */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-2" style={{ backgroundColor: colors.lightBlue }}></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-2" style={{ backgroundColor: colors.lightGreen }}></div>
                  
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.lightBlue }}>
                      {goldenPace}
                    </div>
                    <div className="text-base sm:text-lg font-medium" style={{ color: colors.black }}>
                      GoldenPace
                    </div>
                    <p className="text-xs sm:text-sm mt-2" style={{ color: colors.lightBlue }}>
                      Your training fitness level
                    </p>
                  </div>
                </div>

                {/* Training Paces Grid - Munich 1972 Geometric Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { name: 'Easy', pace: trainingPaces.easy, icon: Clock, color: colors.gray },
                    { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, color: colors.lightGreen },
                    { name: 'Interval', pace: trainingPaces.interval, icon: Clock, color: colors.darkGreen },
                    { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, color: colors.lightBlue }
                  ].map(({ name, pace, icon: Icon, color }, index) => (
                    <div key={name} className="bg-white shadow-sm border p-3 sm:p-4 text-center relative overflow-hidden" style={{ borderColor: colors.border }}>
                      {/* Progressive Melange Background */}
                      <div className="absolute inset-0 progressive-melange opacity-3"></div>
                      
                      {/* Geometric corner accent */}
                      <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-diamond geometric-float-counterclockwise" style={{ 
                        backgroundColor: color,
                        opacity: 0.3,
                        animationDelay: `${index * 0.5}s`
                      }}></div>
                      
                      <div className="relative z-10">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: color }} />
                        <h4 className="text-sm sm:text-md font-medium mb-1" style={{ color: colors.black }}>
                          {name}
                        </h4>
                        <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: color }}>
                          {pace}
                        </div>
                        <p className="text-xs mt-1" style={{ color: colors.lightBlue }}>
                          per mile
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Freemium Flow - Post-Calculation User Journey */}
                <div className="mt-8 space-y-6">
                  {/* Free Training Week Sample */}
                  <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 rounded-lg p-6 relative overflow-hidden" style={{ 
                    borderColor: colors.lightBlue,
                    boxShadow: '0 10px 25px rgba(30, 107, 150, 0.15)'
                  }}>
                    <div className="absolute top-0 right-0 w-24 h-24 geometric-diamond" style={{ 
                      backgroundColor: colors.orange,
                      opacity: 0.08
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
                            Your Personalized Training Week
                          </h3>
                          <p className="text-sm" style={{ color: colors.darkGreen }}>
                            Based on your {goldenPace} GoldenPace • Elite-tested training system
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-4 py-2 rounded-full text-sm font-bold border-2" style={{ 
                            backgroundColor: colors.lightGreen,
                            borderColor: colors.darkGreen,
                            color: 'white'
                          }}>
                            FREE SAMPLE
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Monday - Recovery Run</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.lightBlue,
                              backgroundColor: colors.lightBlue + '15'
                            }}>{trainingPaces.easy}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightGreen + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Wednesday - Threshold Run</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.lightGreen,
                              backgroundColor: colors.lightGreen + '15'
                            }}>{trainingPaces.threshold}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.darkGreen + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Friday - Interval Session</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.darkGreen,
                              backgroundColor: colors.darkGreen + '15'
                            }}>{trainingPaces.interval}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Sunday - Long Run</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.lightBlue,
                              backgroundColor: colors.lightBlue + '15'
                            }}>{trainingPaces.easy}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Value proposition with urgency */}
                      <div className="bg-white rounded-lg p-4 mb-6 border" style={{ borderColor: colors.orange + '30' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.orange }}>
                            <Star className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1" style={{ color: colors.black }}>
                              This is just week 1 of a 12-week journey to your race goal
                            </p>
                            <p className="text-xs" style={{ color: colors.darkGreen }}>
                              Full programs include progressive build phases, peak training, and race-specific workouts
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => setActiveTab('premium')}
                          className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          style={{ 
                            backgroundColor: colors.orange,
                            color: 'white'
                          }}
                          aria-label="View premium 12-week training programs"
                        >
                          <TrendingUp className="w-6 h-6 mr-3" />
                          Get Complete 12-Week Program
                        </button>
                        <button 
                          onClick={() => setActiveTab('plans')}
                          className="flex-1 px-6 py-4 rounded-lg font-medium border-2 transition-all duration-200 flex items-center justify-center"
                          style={{ 
                            borderColor: colors.lightBlue,
                            color: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                          aria-label="Browse all training programs"
                        >
                          <Target className="w-5 h-5 mr-2" />
                          Browse All Programs
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Creation Prompt */}
                  {!savedProfileData && (
                    <div className="border-2 rounded-lg p-6 relative overflow-hidden" style={{ 
                      borderColor: colors.lightGreen + '60',
                      backgroundColor: 'white',
                      boxShadow: '0 8px 25px rgba(46, 139, 87, 0.12)'
                    }}>
                      <div className="absolute top-0 left-0 w-32 h-32 geometric-octagon" style={{ 
                        backgroundColor: colors.lightGreen,
                        opacity: 0.06
                      }}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                            backgroundColor: colors.lightGreen + '20'
                          }}>
                            <User className="w-6 h-6" style={{ color: colors.lightGreen }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2" style={{ color: colors.black }}>
                              Save Your Progress & Get Personalized Coaching
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                              Create a free profile to unlock AI-powered training recommendations, track your progress, and get access to our community of elite runners.
                            </p>
                          </div>
                        </div>
                        
                        {/* Benefits list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>Save your GoldenPace & training paces</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>Personal training log & progress tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>AI-powered workout recommendations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>Access to elite coaching insights</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <button 
                            onClick={() => setActiveTab('profile')}
                            className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            style={{ 
                              backgroundColor: colors.lightGreen,
                              color: 'white'
                            }}
                            aria-label="Create free running profile to track progress"
                          >
                            <User className="w-6 h-6 mr-3" />
                            Create Free Profile Now
                          </button>
                          <div className="flex items-center gap-2 text-sm" style={{ color: colors.darkGreen }}>
                            <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: colors.lightGreen }}>
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            No credit card • Always free
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Smart Plan Recommendations */}
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
                {goldenPace ? 'Personalized Training Plans' : 'Training Plans'}
              </h2>
              {goldenPace && userProfile.goal && (
                <p style={{ color: colors.darkGreen }}>
                  Based on your Golden Pace of {goldenPace} and {userProfile.goal === '5k-pr' ? '5K goal' : 
                  userProfile.goal === 'marathon' ? 'marathon goal' : 'fitness goal'}
                </p>
              )}
            </div>

            {/* Recommendation Engine or Fallback */}
            {goldenPace && userProfile.goal ? (
              <PlanRecommendationEngine
                colors={colors}
                userGoal={userProfile.goal}
                experience={userProfile.experience}
                goldenPace={goldenPace}
                trainingPlans={trainingPlans}
                onPlanSelect={handlePlanSelect}
              />
            ) : (
              /* Fallback to original TrainingPlansSection for users without complete profile */
              <div className="space-y-6">
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: colors.gray + '20' }}>
                  <h3 className="font-bold mb-2" style={{ color: colors.black }}>
                    Get Personalized Recommendations
                  </h3>
                  <p className="mb-4" style={{ color: colors.darkGreen }}>
                    {!goldenPace ? 'Calculate your Golden Pace first to see personalized plan recommendations' : 
                     'Complete your profile to get smart plan matching'}
                  </p>
                  <button
                    onClick={() => setActiveTab(!goldenPace ? 'calculator' : 'profile')}
                    className="munich-btn munich-btn-primary"
                  >
                    {!goldenPace ? 'Calculate Golden Pace' : 'Complete Profile'}
                  </button>
                </div>
                
                <TrainingPlansSection 
                  colors={colors}
                  trainingPlans={trainingPlans}
                  setSelectedPlan={setSelectedPlan}
                  setShowPlanDetails={setShowPlanDetails}
                  showPlanDetails={showPlanDetails}
                  selectedPlan={selectedPlan}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Enhanced Progress Dashboard */}
            <ProgressDashboard
              colors={colors}
              userProfile={userProfile}
              currentPlan={selectedPlan}
              recentActivities={userActivities}
            />
            
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="munich-card">
                <div className="munich-card-body text-center">
                  <h3 className="font-bold mb-2" style={{ color: colors.black }}>
                    Log a Run
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                    Track your training progress
                  </p>
                  <button
                    onClick={() => setShowTrainingLogForm(true)}
                    className="munich-btn munich-btn-primary w-full"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
              
              <div className="munich-card">
                <div className="munich-card-body text-center">
                  <h3 className="font-bold mb-2" style={{ color: colors.black }}>
                    Update Golden Pace
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                    Recalculate based on recent race
                  </p>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="munich-btn munich-btn-outline w-full"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
              
              <div className="munich-card">
                <div className="munich-card-body text-center">
                  <h3 className="font-bold mb-2" style={{ color: colors.black }}>
                    Browse Plans
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                    Find your next training goal
                  </p>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="munich-btn munich-btn-outline w-full"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
          <div className="space-y-8">
            <div className="text-center space-y-4 relative">
              {/* Geometric background elements */}
              <div className="absolute inset-0 progressive-melange opacity-5"></div>
              
              <div className="relative z-10">
                <h2 className="font-bold" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-4xl)'
                }}>Your Profile</h2>
                <p style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-xl)'
                }}>Customize your training experience</p>
              </div>
            </div>

            {!showProfileDashboard ? (
              // Profile Creation Form
              <div className="munich-card max-w-3xl mx-auto">
                <div className="munich-card-header relative overflow-hidden" style={{ 
                  backgroundColor: colors.lightBlue 
                }}>
                  {/* Progressive Melange Background */}
                  <div className="absolute inset-0 progressive-melange opacity-20"></div>
                  
                  {/* Geometric corner accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                    backgroundColor: colors.lightGreen,
                    opacity: 0.8
                  }}></div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold flex items-center" style={{ 
                      color: colors.white,
                      fontSize: 'var(--text-2xl)'
                    }}>
                      <User className="w-6 h-6 mr-3" />
                      Create Your Running Profile
                    </h3>
                  </div>
                </div>
                
                <div className="munich-card-body space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        className="munich-input"
                        placeholder="Enter your name"
                        aria-label="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        className="munich-input"
                        placeholder="your@email.com"
                        aria-label="Your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Experience Level</label>
                      <select
                        value={userProfile.experience}
                        onChange={(e) => setUserProfile({...userProfile, experience: e.target.value})}
                        className="munich-input"
                      >
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3+ years)</option>
                        <option value="elite">Elite/Competitive</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Goal Race Distance</label>
                      <select
                        value={userProfile.goalRaceDistance}
                        onChange={(e) => setUserProfile({...userProfile, goalRaceDistance: e.target.value})}
                        className="munich-input"
                      >
                        <option value="5K">5K</option>
                        <option value="10K">10K</option>
                        <option value="Half Marathon">Half Marathon</option>
                        <option value="Marathon">Marathon</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Goal Race Time (optional)</label>
                      <input
                        type="text"
                        value={userProfile.goalRaceTime}
                        onChange={(e) => setUserProfile({...userProfile, goalRaceTime: e.target.value})}
                        className="munich-input"
                        placeholder="e.g., 20:00 for 5K"
                        aria-label="Goal race time in minutes and seconds"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Current Weekly Mileage</label>
                      <input
                        type="number"
                        value={userProfile.weeklyMileage}
                        onChange={(e) => setUserProfile({...userProfile, weeklyMileage: e.target.value})}
                        className="munich-input"
                        placeholder="e.g., 25"
                        aria-label="Current weekly mileage in miles or kilometers"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>Injury History (optional)</label>
                    <textarea
                      value={userProfile.injuryHistory}
                      onChange={(e) => setUserProfile({...userProfile, injuryHistory: e.target.value})}
                      className="munich-input"
                      placeholder="Any injuries or health considerations we should know about?"
                      rows="3"
                      aria-label="Injury history and health considerations"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={savedProfileData ? updateProfile : saveProfile}
                      className="munich-btn munich-btn-primary flex-1 relative"
                      aria-label={savedProfileData ? 'Update your training profile' : 'Create your training profile'}
                    >
                      {savedProfileData ? 'Update Profile' : 'Create Profile'}
                      {/* Geometric accent on button */}
                      <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                        backgroundColor: colors.lightGreen
                      }}></div>
                    </button>
                    
                    {!savedProfileData && (
                      <button 
                        onClick={() => userProfile.email && loadProfile(userProfile.email)}
                        disabled={!userProfile.email}
                        className="munich-btn munich-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Check for existing profile with this email"
                      >
                        Check Existing
                      </button>
                    )}
                  </div>
                  
                  {profileError && (
                    <div className="munich-alert munich-alert-error">
                      {profileError}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Profile Dashboard
              <div className="space-y-6">
                <div className="munich-card">
                  <div className="munich-card-header relative overflow-hidden" style={{ 
                    backgroundColor: colors.lightGreen 
                  }}>
                    {/* Progressive Melange Background */}
                    <div className="absolute inset-0 progressive-melange opacity-20"></div>
                    
                    {/* Geometric corner accent */}
                    <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                      backgroundColor: colors.violet,
                      opacity: 0.8
                    }}></div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold flex items-center" style={{ 
                        color: colors.white,
                        fontSize: 'var(--text-2xl)'
                      }}>
                        <User className="w-6 h-6 mr-3" />
                        Welcome, {savedProfileData?.name || userProfile.name}!
                      </h3>
                      <p className="mt-2" style={{ 
                        color: colors.white,
                        opacity: 0.9,
                        fontSize: 'var(--text-base)'
                      }}>Your profile has been created successfully</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="munich-card relative overflow-hidden">
                        {/* Progressive Melange Background */}
                        <div className="absolute inset-0 progressive-melange opacity-3"></div>
                        
                        {/* Geometric corner accent */}
                        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-diamond geometric-float-counterclockwise" style={{ 
                          backgroundColor: colors.lightBlue,
                          opacity: 0.3
                        }}></div>
                        
                        <div className="munich-card-body relative z-10">
                          <h4 className="font-medium mb-4" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-lg)'
                          }}>Personal Info</h4>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Name: {savedProfileData?.name || userProfile.name}</p>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Email: {savedProfileData?.email || userProfile.email}</p>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Experience: {savedProfileData?.experience || userProfile.experience}</p>
                          <p style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>
                            Member since: {savedProfileData?.created_date ? 
                              new Date(savedProfileData.created_date).toLocaleDateString() : 
                              <span className="text-gray-500">Profile created today</span>
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="munich-card relative overflow-hidden">
                        {/* Progressive Melange Background */}
                        <div className="absolute inset-0 progressive-melange opacity-3"></div>
                        
                        {/* Geometric corner accent */}
                        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-octagon geometric-float-counterclockwise" style={{ 
                          backgroundColor: colors.lightGreen,
                          opacity: 0.3,
                          animationDelay: '1s'
                        }}></div>
                        
                        <div className="munich-card-body relative z-10">
                          <h4 className="font-medium mb-4" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-lg)'
                          }}>Running Goals</h4>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Goal Race: {savedProfileData?.goalRaceDistance || userProfile.goalRaceDistance}</p>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Goal Time: {savedProfileData?.goalRaceTime || userProfile.goalRaceTime || <span className="text-gray-500">Not set</span>}</p>
                          <p style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>
                            Weekly Mileage: {savedProfileData?.weekly_mileage || userProfile.weeklyMileage ? 
                              `${savedProfileData?.weekly_mileage || userProfile.weeklyMileage} miles` : 
                              <span className="text-gray-500">Not set</span>
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="munich-card relative overflow-hidden">
                        {/* Progressive Melange Background */}
                        <div className="absolute inset-0 progressive-melange opacity-3"></div>
                        
                        {/* Geometric corner accent */}
                        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-square geometric-float-counterclockwise" style={{ 
                          backgroundColor: colors.violet,
                          opacity: 0.3,
                          animationDelay: '2s'
                        }}></div>
                        
                        <div className="munich-card-body relative z-10">
                          <h4 className="font-medium mb-4 flex items-center" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-lg)'
                          }}>
                            <Activity className="w-4 h-4 mr-2" />
                            GoldenPace Progress
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span style={{ 
                                color: colors.black,
                                fontSize: 'var(--text-sm)'
                              }}>Current GoldenPace:</span>
                              {savedProfileData?.currentGoldenPace || goldenPace ? (
                                <span className="font-bold" style={{ 
                                  color: colors.violet,
                                  fontSize: 'var(--text-lg)'
                                }}>
                                  {savedProfileData?.currentGoldenPace || goldenPace}
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span style={{ 
                                    color: colors.darkGray,
                                    fontSize: 'var(--text-sm)'
                                  }}>Not calculated</span>
                                  {savedProfileData?.goalRaceTime && savedProfileData?.goalRaceDistance && (
                                    <button
                                      onClick={() => {
                                        setRaceTime(savedProfileData.goalRaceTime);
                                        setRaceDistance(savedProfileData.goalRaceDistance);
                                        setActiveTab('calculator');
                                      }}
                                      className="px-2 py-1 text-xs rounded-md hover:opacity-80 transition-opacity"
                                      style={{ 
                                        backgroundColor: colors.lightBlue,
                                        color: colors.white
                                      }}
                                      title="Calculate using your goal race"
                                    >
                                      Calculate
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {savedProfileData?.projectedGoldenPace && (
                              <div className="flex justify-between items-center">
                                <span style={{ 
                                  color: colors.black,
                                  fontSize: 'var(--text-sm)'
                                }}>6-Week Projection:</span>
                                <span className="font-bold" style={{ 
                                  color: colors.lightGreen,
                                  fontSize: 'var(--text-lg)'
                                }}>
                                  {savedProfileData.projectedGoldenPace}
                                </span>
                              </div>
                            )}
                            
                            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.gray}` }}>
                              <div className="flex justify-between text-xs">
                                <span style={{ color: colors.black }}>Training Sessions: {trainingHistory.length}</span>
                                <span style={{ color: colors.black }}>Personal Bests: {Object.keys(personalBests).length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GoldenPace Progression Chart */}
                    {savedProfileData?.currentGoldenPace && savedProfileData?.trainingStartDate && (
                      <div className="mt-8">
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                            backgroundColor: colors.lightBlue,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-6 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-xl)'
                            }}>
                              <TrendingUp className="w-5 h-5 mr-2" style={{ color: colors.lightBlue }} />
                              GoldenPace Progression Forecast
                            </h4>
                            
                            <div className="mb-4 text-sm" style={{ color: colors.darkGreen }}>
                              <p>Projected improvement: +1 VDOT point every 6 weeks (average training consistency)</p>
                              <p>Based on {savedProfileData.weekly_mileage || 20} miles/week at your experience level</p>
                            </div>
                            
                            {/* Simple ASCII-style progression chart */}
                            <div className="bg-white p-6 rounded-lg border" style={{ borderColor: colors.gray }}>
                              <div className="space-y-2">
                                {(() => {
                                  const progression = generateGoldenPaceProgression(
                                    savedProfileData.currentGoldenPace, 
                                    savedProfileData.trainingStartDate, 
                                    savedProfileData.weekly_mileage || 20,
                                    26 // 6 months
                                  );
                                  
                                  return progression.filter((_, index) => index % 2 === 0).slice(0, 7).map((point, index) => {
                                    const isCurrentWeek = point.week === 0;
                                    const barWidth = Math.min(100, ((point.goldenPace - savedProfileData.currentGoldenPace) / 6) * 100 + 20);
                                    
                                    return (
                                      <div key={point.week} className="flex items-center space-x-3">
                                        <div className="w-20 text-xs font-medium" style={{ color: colors.black }}>
                                          {point.week === 0 ? 'Current' : `Week ${point.week}`}
                                        </div>
                                        <div className="flex-1 relative">
                                          <div className="h-6 rounded" style={{ 
                                            backgroundColor: colors.lightGray,
                                            border: `1px solid ${colors.gray}`
                                          }}>
                                            <div 
                                              className="h-full rounded transition-all duration-500"
                                              style={{ 
                                                width: `${barWidth}%`,
                                                backgroundColor: isCurrentWeek ? colors.violet : colors.lightBlue,
                                                backgroundImage: isCurrentWeek ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)' : 'none'
                                              }}
                                            />
                                          </div>
                                          <div className="absolute right-2 top-0 h-6 flex items-center">
                                            <span className="text-xs font-bold" style={{ 
                                              color: colors.black,
                                              textShadow: '0 0 3px white'
                                            }}>
                                              {point.goldenPace}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="w-16 text-xs" style={{ color: colors.darkGreen }}>
                                          {point.week === 0 ? 'Current' : 
                                            point.goldenPace > savedProfileData.currentGoldenPace ? 
                                            `+${(point.goldenPace - savedProfileData.currentGoldenPace).toFixed(1)}` : '---'}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                              
                              <div className="mt-4 pt-4 text-xs" style={{ 
                                borderTop: `1px solid ${colors.gray}`,
                                color: colors.darkGreen
                              }}>
                                <p>💡 <strong>Pro Tip:</strong> Consistency is key! Maintain your weekly mileage and training intensity for steady progression.</p>
                                <p>📈 Your projected GoldenPace in 6 months: <strong>{savedProfileData.projectedGoldenPace || 'N/A'}</strong></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Training Data Section */}
                    <div className="mt-8 space-y-6">
                      {/* Personal Bests Section */}
                      {Object.keys(personalBests).length > 0 && (
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                            backgroundColor: colors.orange,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-4 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-lg)'
                            }}>
                              <Trophy className="w-5 h-5 mr-2" style={{ color: colors.orange }} />
                              Personal Bests
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(personalBests).map(([distance, time]) => (
                                <div key={distance} className="text-center p-3 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <div className="font-medium" style={{ 
                                    color: colors.black,
                                    fontSize: 'var(--text-sm)'
                                  }}>{distance}</div>
                                  <div className="font-bold" style={{ 
                                    color: colors.orange,
                                    fontSize: 'var(--text-lg)'
                                  }}>{time}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recent Training History */}
                      {trainingHistory.length > 0 && (
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                            backgroundColor: colors.lightBlue,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-4 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-lg)'
                            }}>
                              <Calendar className="w-5 h-5 mr-2" style={{ color: colors.lightBlue }} />
                              Recent Training History
                            </h4>
                            <div className="space-y-3">
                              {trainingHistory.slice(-5).reverse().map((session, index) => (
                                <div key={index} className="p-4 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium" style={{ 
                                      color: colors.black,
                                      fontSize: 'var(--text-sm)'
                                    }}>{session.type}</span>
                                    <span style={{ 
                                      color: colors.gray,
                                      fontSize: 'var(--text-xs)'
                                    }}>{session.date}</span>
                                  </div>
                                  {session.distance && (
                                    <div style={{ 
                                      color: colors.black,
                                      fontSize: 'var(--text-sm)'
                                    }}>
                                      Distance: {session.distance} • Time: {session.time}
                                    </div>
                                  )}
                                  {(session.feeling || session.effort) && (
                                    <div style={{ 
                                      color: colors.lightBlue,
                                      fontSize: 'var(--text-sm)'
                                    }}>
                                      Felt: {session.feeling} • Effort: {session.effort}
                                    </div>
                                  )}
                                  {session.location && (
                                    <div style={{ 
                                      color: colors.black,
                                      fontSize: 'var(--text-xs)',
                                      opacity: 0.8
                                    }}>
                                      {session.location}
                                      {session.weather && ` • ${session.weather}`}
                                    </div>
                                  )}
                                  {session.goldenPace && (
                                    <div style={{ 
                                      color: colors.orange,
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: '500'
                                    }}>
                                      GoldenPace: {session.goldenPace}
                                    </div>
                                  )}
                                  {session.notes && (
                                    <div className="mt-2" style={{ 
                                      color: colors.gray,
                                      fontSize: 'var(--text-xs)',
                                      fontStyle: 'italic'
                                    }}>
                                      "{session.notes}"
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Completed Training Plans */}
                      {trainingPlansCompleted.length > 0 && (
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-square" style={{ 
                            backgroundColor: colors.violet,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-4 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-lg)'
                            }}>
                              <CheckCircle className="w-5 h-5 mr-2" style={{ color: colors.violet }} />
                              Completed Training Plans
                            </h4>
                            <div className="space-y-2">
                              {trainingPlansCompleted.map((plan, index) => (
                                <div key={index} className="flex justify-between items-center p-3 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <span style={{ 
                                    color: colors.black,
                                    fontSize: 'var(--text-sm)'
                                  }}>{plan.name}</span>
                                  <span style={{ 
                                    color: colors.gray,
                                    fontSize: 'var(--text-xs)'
                                  }}>{plan.completedDate}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8 flex flex-wrap gap-4">
                      <button
                        onClick={() => {
                          // Transfer profile data to calculator
                          if (savedProfileData?.goalRaceTime) {
                            setRaceTime(savedProfileData.goalRaceTime);
                          }
                          if (savedProfileData?.goalRaceDistance) {
                            setRaceDistance(savedProfileData.goalRaceDistance);
                          }
                          setActiveTab('calculator');
                        }}
                        className="munich-btn munich-btn-primary relative"
                        aria-label="Go to pace calculator with your goal race"
                      >
                        Calculate GoldenPace
                        {/* Geometric accent on button */}
                        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond" style={{ 
                          backgroundColor: colors.lightGreen
                        }}></div>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('plans')}
                        className="munich-btn munich-btn-secondary relative"
                        aria-label="View training plans"
                      >
                        Get Training Plans
                        {/* Geometric accent on button */}
                        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-octagon" style={{ 
                          backgroundColor: colors.violet
                        }}></div>
                      </button>
                      
                      <button
                        onClick={() => setShowProfileDashboard(false)}
                        className="munich-btn munich-btn-outline"
                        aria-label="Close profile dashboard"
                      >
                        Edit Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowTrainingLogForm(true);
                        }}
                        className="munich-btn munich-btn-outline relative"
                        style={{ color: colors.lightBlue, borderColor: colors.lightBlue }}
                      >
                        Log Training Session
                        <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                          backgroundColor: colors.lightBlue,
                          opacity: 0.3
                        }}></div>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Add demo data to showcase the full profile functionality
                          updatePersonalBest('5K', '24:30');
                          updatePersonalBest('10K', '51:45');
                          updatePersonalBest('Half Marathon', '1:54:20');
                          
                          addTrainingSession({
                            type: 'Tempo Run',
                            distance: '6 miles',
                            time: '42:00',
                            notes: 'Comfortably hard pace, felt strong'
                          });
                          
                          addTrainingSession({
                            type: 'Long Run',
                            distance: '12 miles',
                            time: '1:32:00',
                            notes: 'Progressive long run, negative split'
                          });
                          
                          completeTrainingPlan('5K Training Plan - Beginner');
                        }}
                        className="munich-btn munich-btn-outline relative"
                        style={{ color: colors.orange, borderColor: colors.orange }}
                      >
                        Add Demo Data
                        <div className="absolute top-0 right-0 w-3 h-3 geometric-octagon" style={{ 
                          backgroundColor: colors.orange,
                          opacity: 0.3
                        }}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Training Log Form Modal */}
        {showTrainingLogForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="munich-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="munich-card-header relative overflow-hidden" style={{ 
                backgroundColor: colors.lightBlue 
              }}>
                <div className="absolute inset-0 progressive-melange opacity-20"></div>
                <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                  backgroundColor: colors.orange,
                  opacity: 0.8
                }}></div>
                
                <div className="relative z-10">
                  <h3 className="font-bold flex items-center" style={{ 
                    color: colors.white,
                    fontSize: 'var(--text-2xl)'
                  }}>
                    <Activity className="w-6 h-6 mr-3" />
                    Log Training Session
                  </h3>
                  <p className="mt-2" style={{ 
                    color: colors.white,
                    opacity: 0.9,
                    fontSize: 'var(--text-base)'
                  }}>Track your workout details and how you felt</p>
                </div>
              </div>
              
              <div className="p-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Add the training session
                  addTrainingSession({
                    type: trainingLogData.type,
                    distance: trainingLogData.distance,
                    time: trainingLogData.time,
                    feeling: trainingLogData.feeling,
                    effort: trainingLogData.effort,
                    notes: trainingLogData.notes,
                    weather: trainingLogData.weather,
                    location: trainingLogData.location
                  });
                  
                  // Check if this is a race/PR
                  if (trainingLogData.type.includes('Race') && trainingLogData.distance && trainingLogData.time) {
                    const currentPB = personalBests[trainingLogData.distance];
                    if (!currentPB || parseTimeToSeconds(trainingLogData.time) < parseTimeToSeconds(currentPB)) {
                      updatePersonalBest(trainingLogData.distance, trainingLogData.time);
                    }
                  }
                  
                  // Reset form and close
                  setTrainingLogData({
                    type: 'Easy Run',
                    distance: '',
                    time: '',
                    feeling: 'Good',
                    effort: 'Easy',
                    notes: '',
                    weather: '',
                    location: ''
                  });
                  setShowTrainingLogForm(false);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Workout Type
                      </label>
                      <select
                        value={trainingLogData.type}
                        onChange={(e) => setTrainingLogData({...trainingLogData, type: e.target.value})}
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Easy Run">Easy Run</option>
                        <option value="Tempo Run">Tempo Run</option>
                        <option value="Interval Training">Interval Training</option>
                        <option value="Long Run">Long Run</option>
                        <option value="Recovery Run">Recovery Run</option>
                        <option value="Race">Race</option>
                        <option value="Cross Training">Cross Training</option>
                        <option value="Strength Training">Strength Training</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Distance
                      </label>
                      <input
                        type="text"
                        value={trainingLogData.distance}
                        onChange={(e) => setTrainingLogData({...trainingLogData, distance: e.target.value})}
                        placeholder="e.g., 5K, 6 miles, 10K"
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Time
                      </label>
                      <input
                        type="text"
                        value={trainingLogData.time}
                        onChange={(e) => setTrainingLogData({...trainingLogData, time: e.target.value})}
                        placeholder="e.g., 25:00, 1:30:45"
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        How did you feel?
                      </label>
                      <select
                        value={trainingLogData.feeling}
                        onChange={(e) => setTrainingLogData({...trainingLogData, feeling: e.target.value})}
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Tired">Tired</option>
                        <option value="Struggled">Struggled</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Effort Level
                      </label>
                      <select
                        value={trainingLogData.effort}
                        onChange={(e) => setTrainingLogData({...trainingLogData, effort: e.target.value})}
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Comfortably Hard">Comfortably Hard</option>
                        <option value="Hard">Hard</option>
                        <option value="Very Hard">Very Hard</option>
                        <option value="Max Effort">Max Effort</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={trainingLogData.location}
                        onChange={(e) => setTrainingLogData({...trainingLogData, location: e.target.value})}
                        placeholder="e.g., Local park, Track, Treadmill"
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block font-medium mb-3" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>
                      Weather
                    </label>
                    <input
                      type="text"
                      value={trainingLogData.weather}
                      onChange={(e) => setTrainingLogData({...trainingLogData, weather: e.target.value})}
                      placeholder="e.g., Sunny 70°F, Rainy, Hot and humid"
                      className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                      style={{ 
                        borderColor: colors.gray,
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="block font-medium mb-3" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>
                      Notes
                    </label>
                    <textarea
                      value={trainingLogData.notes}
                      onChange={(e) => setTrainingLogData({...trainingLogData, notes: e.target.value})}
                      placeholder="How did the workout go? Any observations, goals achieved, etc."
                      rows={4}
                      className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                      style={{ 
                        borderColor: colors.gray,
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      type="submit"
                      className="munich-btn munich-btn-primary relative"
                    >
                      Save Training Session
                      <div className="absolute top-0 right-0 w-4 h-4 geometric-diamond" style={{ 
                        backgroundColor: colors.lightGreen
                      }}></div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowTrainingLogForm(false)}
                      className="munich-btn munich-btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Blog/Articles Section - Munich 1972 Design */}
        {activeTab === 'blog' && (
          <BlogTabSection 
            colors={colors}
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
            articles={articles}
            featuredArticles={featuredArticles}
            userSubscription={userProfile.subscription}
            onSubscribe={handleSubscriptionPurchase}
          />
        )}

        {/* Premium Training Plans Section - Munich 1972 Design */}
        {activeTab === 'premium' && (
          <PremiumPlansSection 
            colors={colors}
            handlePurchaseClick={handlePurchaseClick}
            purchasedPlans={purchasedPlans}
          />
        )}
      </main>

      {/* Footer - Munich 1972 Geometric Style */}
      <footer className="py-6 sm:py-8 relative overflow-hidden" style={{ backgroundColor: colors.gray }}>
        {/* Progressive Melange Background */}
        <div className="absolute inset-0 progressive-melange opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3" style={{ color: colors.black }}>
                Unforgiving Minute Distance Running
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: colors.darkGreen }}>
                Professional distance running training with scientifically-based GoldenPace calculations.
              </p>
            </div>
            <div>
              <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3" style={{ color: colors.black }}>
                Quick Links
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <button 
                    onClick={() => setActiveTab('calculator')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    GoldenPace Calculator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('plans')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Training Plans
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('blog')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Articles
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('premium')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Premium Plans
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Profile
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3" style={{ color: colors.black }}>
                Get Started
              </h4>
              <button
                onClick={() => setActiveTab('calculator')}
                className="munich-btn munich-btn-primary"
              >
                Calculate Your GoldenPace
              </button>
            </div>
          </div>
          <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6 text-center text-xs sm:text-sm" style={{ borderColor: colors.border }}>
            <p style={{ color: colors.darkGreen }}>
              &copy; 2024 Unforgiving Minute Distance Running. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="munich-card max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="munich-card-header relative overflow-hidden" style={{ 
              backgroundColor: colors.violet 
            }}>
              <div className="absolute inset-0 progressive-melange opacity-20"></div>
              <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                backgroundColor: colors.orange,
                opacity: 0.8
              }}></div>
              
              <div className="relative z-10">
                <h3 className="font-bold flex items-center justify-between" style={{ 
                  color: colors.white,
                  fontSize: 'var(--text-2xl)'
                }}>
                  <span className="flex items-center">
                    <BookOpen className="w-6 h-6 mr-3" />
                    Content Management Admin Panel
                  </span>
                  <button
                    onClick={() => setShowAdminPanel(false)}
                    className="text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </h3>
                <p className="mt-2" style={{ 
                  color: colors.white,
                  opacity: 0.9,
                  fontSize: 'var(--text-base)'
                }}>Manage blog posts, premium training plans, and coaching services</p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-8">
                {/* Blog Posts Management */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                    backgroundColor: colors.lightBlue,
                    opacity: 0.4
                  }}></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>Articles & Training Insights</h4>
                    
                    <div className="space-y-4">
                      <p style={{ color: colors.darkGreen, fontSize: 'var(--text-sm)' }}>
                        <strong>Current Location:</strong> Lines 2500-2650 in RunningTrainingApp.jsx
                      </p>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGray }}>
                        <h5 className="font-medium mb-2" style={{ color: colors.black }}>How to Add Blog Posts:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: colors.black }}>
                          <li>Find the "Featured Articles" section around line 2510</li>
                          <li>Copy the existing article card structure</li>
                          <li>Replace the content with your article details:</li>
                        </ol>
                        
                        <div className="mt-4 p-3 bg-gray-800 rounded text-green-400 font-mono text-xs overflow-x-auto">
{`<div className="munich-card relative overflow-hidden group">
  <div className="munich-card-body">
    <div className="mb-4">
      <span className="text-xs font-medium px-3 py-1" style={{ 
        backgroundColor: colors.lightBlue,
        color: colors.white 
      }}>
        YOUR_CATEGORY
      </span>
    </div>
    
    <h4 className="text-lg font-bold mb-3" style={{ color: colors.black }}>
      Your Article Title
    </h4>
    
    <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
      Your article description and preview text...
    </p>
    
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: colors.silver }}>
        X min read
      </span>
      <button className="munich-btn munich-btn-outline text-xs px-3 py-1">
        Read Article
      </button>
    </div>
  </div>
</div>`}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGreen, color: colors.white }}>
                        <h5 className="font-medium mb-2">💡 Pro Tip:</h5>
                        <p className="text-sm">Use categories like: TRAINING SCIENCE, NUTRITION, RACE STRATEGY, INJURY PREVENTION</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Training Plans Management */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-square" style={{ 
                    backgroundColor: colors.orange,
                    opacity: 0.4
                  }}></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>⭐ Premium Training Plans</h4>
                    
                    <div className="space-y-4">
                      <p style={{ color: colors.darkGreen, fontSize: 'var(--text-sm)' }}>
                        <strong>Current Location:</strong> Lines 2700-2850 in RunningTrainingApp.jsx
                      </p>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGray }}>
                        <h5 className="font-medium mb-2" style={{ color: colors.black }}>How to Add Premium Plans:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: colors.black }}>
                          <li>Find the "Premium Plans Grid" section around line 2700</li>
                          <li>Copy an existing plan card (like the "5K Mastery Program")</li>
                          <li>Customize the pricing, features, and benefits</li>
                          <li>Add payment integration to the button</li>
                        </ol>
                        
                        <div className="mt-4 p-3 bg-gray-800 rounded text-green-400 font-mono text-xs overflow-x-auto">
{`<div className="munich-card relative overflow-hidden group">
  <div className="munich-card-header">
    <div className="flex items-center justify-between">
      <h4 className="text-xl font-bold" style={{ color: colors.black }}>
        Your Plan Name
      </h4>
      <span className="text-xs font-medium px-2 py-1" style={{ 
        backgroundColor: colors.orange,
        color: colors.white 
      }}>
        BESTSELLER
      </span>
    </div>
  </div>
  
  <div className="munich-card-body">
    <div className="mb-4">
      <div className="flex items-baseline">
        <span className="text-3xl font-bold" style={{ color: colors.black }}>$XX</span>
        <span className="text-lg line-through ml-2" style={{ color: colors.silver }}>$XX</span>
      </div>
      <p className="text-sm" style={{ color: colors.darkGreen }}>XX-week program</p>
    </div>
    
    <ul className="space-y-2 mb-6 text-sm">
      <li className="flex items-start">
        <span style={{ color: colors.lightBlue }}>✓</span>
        <span className="ml-2" style={{ color: colors.black }}>Feature 1</span>
      </li>
      <!-- Add more features -->
    </ul>
    
    <button className="munich-btn munich-btn-primary w-full">
      Get Plan Name
    </button>
  </div>
</div>`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Coaching Management */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                    backgroundColor: colors.yellow,
                    opacity: 0.4
                  }}></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>Personal Coaching Services</h4>
                    
                    <div className="space-y-4">
                      <p style={{ color: colors.darkGreen, fontSize: 'var(--text-sm)' }}>
                        <strong>Current Location:</strong> Lines 2825-2870 in RunningTrainingApp.jsx
                      </p>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGray }}>
                        <h5 className="font-medium mb-2" style={{ color: colors.black }}>Personal Coaching Features:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: colors.black }}>
                          <li>Monthly pricing: $297/month (currently set)</li>
                          <li>Features: Weekly sessions, custom plans, 24/7 support</li>
                          <li>Call-to-action: "Schedule Consultation" button</li>
                        </ul>
                        
                        <div className="mt-3 p-3" style={{ backgroundColor: colors.yellow, color: colors.black }}>
                          <h6 className="font-medium">💰 Payment Integration Needed:</h6>
                          <p className="text-sm mt-1">Add Stripe/PayPal integration to the coaching consultation button</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>Quick Actions</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium" style={{ color: colors.black }}>Development Tasks:</h5>
                        <ul className="space-y-2 text-sm" style={{ color: colors.darkGreen }}>
                          <li>• Set up Django backend for dynamic content</li>
                          <li>• Add Stripe payment integration</li>
                          <li>• Create content upload interface</li>
                          <li>• Add user authentication system</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium" style={{ color: colors.black }}>Content Strategy:</h5>
                        <ul className="space-y-2 text-sm" style={{ color: colors.darkGreen }}>
                          <li>• Write 5-10 foundational articles</li>
                          <li>• Create 3-5 premium training plans</li>
                          <li>• Set up coaching intake form</li>
                          <li>• Add testimonials and success stories</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="munich-btn munich-btn-primary"
                >
                  Close Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPlanForPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="munich-card w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closePurchaseModal}
                className="text-2xl font-bold leading-none hover:opacity-70 transition-opacity"
                style={{ color: colors.silver }}
                disabled={purchaseLoading}
              >
                ×
              </button>
            </div>
            
            <div className="munich-card-header">
              <h3 className="text-xl font-bold pr-8" style={{ color: colors.black }}>
                Purchase {selectedPlanForPurchase.name}
              </h3>
            </div>
            
            <div className="munich-card-body">
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  selectedPlan={selectedPlanForPurchase}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  loading={purchaseLoading}
                  userProfile={userProfile}
                  colors={colors}
                />
              </Elements>
              
              <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.gray }}>
                <button
                  onClick={closePurchaseModal}
                  className="munich-btn munich-btn-outline w-full"
                  disabled={purchaseLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Success Message */}
      {purchaseSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="munich-card" style={{ backgroundColor: colors.darkGreen }}>
            <div className="p-4 text-center">
              <p className="font-bold text-white flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Purchase Successful!
              </p>
              <p className="text-sm text-white opacity-90 mt-1">
                Check your profile for access
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobile && !showWelcome && (
        <BottomNavigation 
          activeTab={activeTab === 'profile' ? 'progress' : activeTab}
          onTabChange={(view) => {
            // Map progress back to profile for our state management
            const mappedView = view === 'progress' ? 'profile' : view;
            setActiveTab(mappedView);
            trackTabNavigation(mappedView);
          }}
          colors={colors}
          userHasNewFeatures={!!goldenPace || userProfile.hasSeenPlans}
        />
      )}
    </div>
  );
};

export default RunningTrainingApp;