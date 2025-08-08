import { useEffect } from 'react';
import { useAppStore } from '../stores';
import { calculateVDOT, calculateTrainingPaces, getDistanceInMeters, parseTimeToSeconds } from '../utils';

/**
 * Custom hook for VDOT calculations and training pace generation
 */
export function useGoldenPaceCalculator() {
  const {
    raceTime,
    raceDistance,
    goldenPace,
    trainingPaces,
    setGoldenPace,
    setTrainingPaces
  } = useAppStore();

  const calculatePaces = () => {
    if (!raceTime || !raceDistance) {
      setGoldenPace(null);
      setTrainingPaces(null);
      return;
    }

    try {
      const timeInSeconds = parseTimeToSeconds(raceTime);
      const distanceInMeters = getDistanceInMeters(raceDistance);
      
      if (timeInSeconds <= 0 || distanceInMeters <= 0) {
        throw new Error('Invalid time or distance');
      }

      const vdot = calculateVDOT(timeInSeconds, distanceInMeters);
      const paces = calculateTrainingPaces(vdot);

      setGoldenPace(vdot);
      setTrainingPaces(paces);
    } catch (error) {
      console.error('Error calculating paces:', error);
      setGoldenPace(null);
      setTrainingPaces(null);
    }
  };

  return {
    raceTime,
    raceDistance,
    goldenPace,
    trainingPaces,
    calculatePaces,
    isValid: !!(raceTime && raceDistance)
  };
}

/**
 * Custom hook for profile management
 */
export function useProfile() {
  const {
    profile,
    showProfileDashboard,
    profileError,
    isSavingProfile,
    saveProfile,
    loadProfile,
    setShowProfileDashboard,
    setProfileError
  } = useAppStore();

  const createProfile = async (profileData: any) => {
    setProfileError('');
    
    // Validation
    if (!profileData.name?.trim()) {
      setProfileError('Name is required');
      return false;
    }
    
    if (!profileData.email?.trim()) {
      setProfileError('Email is required');
      return false;
    }
    
    try {
      await saveProfile(profileData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (updates: Partial<any>) => {
    if (!profile) return false;
    
    try {
      await saveProfile({ ...profile, ...updates });
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    profile,
    showProfileDashboard,
    profileError,
    isSavingProfile,
    createProfile,
    updateProfile,
    loadProfile,
    setShowProfileDashboard,
    isProfileComplete: !!(profile?.name && profile?.email)
  };
}

/**
 * Custom hook for training session management
 */
export function useTrainingLog() {
  const {
    trainingHistory,
    personalBests,
    completedTrainingPlans,
    showTrainingLogForm,
    addTrainingSession,
    updatePersonalBest,
    completeTrainingPlan,
    setShowTrainingLogForm
  } = useAppStore();

  const logTrainingSession = async (sessionData: any) => {
    try {
      await addTrainingSession(sessionData);
      setShowTrainingLogForm(false);
      return true;
    } catch (error) {
      console.error('Failed to log training session:', error);
      return false;
    }
  };

  const getRecentSessions = (count: number = 5) => {
    return trainingHistory
      .slice(-count)
      .reverse();
  };

  const getSessionsByType = (type: string) => {
    return trainingHistory.filter(session => session.type === type);
  };

  const getTotalSessions = () => trainingHistory.length;
  
  const getTotalDistance = () => {
    return trainingHistory.reduce((total, session) => {
      if (session.distance) {
        // Simple distance parsing - could be improved
        const distance = parseFloat(session.distance.replace(/[^\d.]/g, ''));
        return total + (isNaN(distance) ? 0 : distance);
      }
      return total;
    }, 0);
  };

  return {
    trainingHistory,
    personalBests,
    completedTrainingPlans,
    showTrainingLogForm,
    logTrainingSession,
    getRecentSessions,
    getSessionsByType,
    getTotalSessions,
    getTotalDistance,
    updatePersonalBest,
    completeTrainingPlan,
    setShowTrainingLogForm
  };
}

/**
 * Custom hook for app initialization
 */
export function useAppInitialization() {
  const { initializeStore, isLoading } = useAppStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return {
    isLoading,
    isInitialized: !isLoading
  };
}

/**
 * Custom hook for navigation and UI state
 */
export function useNavigation() {
  const {
    activeTab,
    selectedArticle,
    showAdminPanel,
    setActiveTab,
    setSelectedArticle,
    setShowAdminPanel
  } = useAppStore();

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    // Close any open modals when navigating
    setSelectedArticle(null);
    setShowAdminPanel(false);
  };

  return {
    activeTab,
    selectedArticle,
    showAdminPanel,
    navigateTo,
    setSelectedArticle,
    setShowAdminPanel
  };
}
