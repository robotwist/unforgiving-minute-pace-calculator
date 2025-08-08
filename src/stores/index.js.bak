import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserProfile, TrainingSession, PersonalBest, TrainingPlan, TrainingPaces } from '../types';
import { ProfileService, TrainingService } from '../services';

interface AppState {
  // Profile State
  profile: UserProfile | null;
  showProfileDashboard: boolean;
  profileError: string;
  
  // Calculator State
  raceTime: string;
  raceDistance: string;
  goldenPace: number | null;
  trainingPaces: TrainingPaces | null;
  
  // Training State
  trainingHistory: TrainingSession[];
  personalBests: PersonalBest;
  completedTrainingPlans: TrainingPlan[];
  showTrainingLogForm: boolean;
  
  // UI State
  activeTab: string;
  selectedArticle: any;
  showAdminPanel: boolean;
  
  // Loading States
  isLoading: boolean;
  isSavingProfile: boolean;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setRaceTime: (time: string) => void;
  setRaceDistance: (distance: string) => void;
  setGoldenPace: (pace: number | null) => void;
  setTrainingPaces: (paces: TrainingPaces | null) => void;
  
  // Profile Actions
  saveProfile: (profileData: UserProfile) => Promise<void>;
  loadProfile: (email?: string) => Promise<void>;
  setShowProfileDashboard: (show: boolean) => void;
  setProfileError: (error: string) => void;
  
  // Training Actions
  addTrainingSession: (session: Omit<TrainingSession, 'id' | 'date'>) => Promise<void>;
  updatePersonalBest: (distance: string, time: string) => Promise<void>;
  completeTrainingPlan: (planName: string) => Promise<void>;
  setShowTrainingLogForm: (show: boolean) => void;
  
  // UI Actions
  setSelectedArticle: (article: any) => void;
  setShowAdminPanel: (show: boolean) => void;
  
  // Initialization
  initializeStore: () => Promise<void>;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial State
      profile: null,
      showProfileDashboard: false,
      profileError: '',
      raceTime: '',
      raceDistance: '5K',
      goldenPace: null,
      trainingPaces: null,
      trainingHistory: [],
      personalBests: {},
      completedTrainingPlans: [],
      showTrainingLogForm: false,
      activeTab: 'calculator',
      selectedArticle: null,
      showAdminPanel: false,
      isLoading: false,
      isSavingProfile: false,

      // Basic Setters
      setActiveTab: (tab) => set({ activeTab: tab }),
      setRaceTime: (time) => set({ raceTime: time }),
      setRaceDistance: (distance) => set({ raceDistance: distance }),
      setGoldenPace: (pace) => set({ goldenPace: pace }),
      setTrainingPaces: (paces) => set({ trainingPaces: paces }),
      setShowProfileDashboard: (show) => set({ showProfileDashboard: show }),
      setProfileError: (error) => set({ profileError: error }),
      setShowTrainingLogForm: (show) => set({ showTrainingLogForm: show }),
      setSelectedArticle: (article) => set({ selectedArticle: article }),
      setShowAdminPanel: (show) => set({ showAdminPanel: show }),

      // Profile Actions
      saveProfile: async (profileData) => {
        set({ isSavingProfile: true, profileError: '' });
        try {
          const profile = await ProfileService.saveProfile({
            ...profileData,
            currentVdot: get().goldenPace || undefined
          });
          
          set({ 
            profile, 
            showProfileDashboard: true,
            isSavingProfile: false 
          });
        } catch (error) {
          set({ 
            profileError: 'Failed to save profile. Please try again.',
            isSavingProfile: false 
          });
        }
      },

      loadProfile: async (email) => {
        set({ isLoading: true });
        try {
          const profile = await ProfileService.loadProfile(email);
          
          if (profile) {
            set({ 
              profile,
              showProfileDashboard: true,
              goldenPace: profile.currentVdot || null
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Training Actions
      addTrainingSession: async (sessionData) => {
        try {
          const session = await TrainingService.saveTrainingSession({
            ...sessionData,
            goldenPace: get().goldenPace || undefined
          });
          
          const updatedHistory = [...get().trainingHistory, session];
          set({ trainingHistory: updatedHistory });

          // Check if this is a new personal best
          if (session.type.includes('Race') && session.distance && session.time) {
            const currentPB = get().personalBests[session.distance];
            if (!currentPB || parseTimeToSeconds(session.time) < parseTimeToSeconds(currentPB)) {
              await get().updatePersonalBest(session.distance, session.time);
            }
          }
        } catch (error) {
          console.error('Failed to save training session:', error);
        }
      },

      updatePersonalBest: async (distance, time) => {
        try {
          const updatedPBs = await TrainingService.updatePersonalBest(distance, time);
          set({ personalBests: updatedPBs });
        } catch (error) {
          console.error('Failed to update personal best:', error);
        }
      },

      completeTrainingPlan: async (planName) => {
        try {
          const completedPlan = await TrainingService.completeTrainingPlan(
            planName, 
            get().goldenPace || undefined
          );
          
          const updatedPlans = [...get().completedTrainingPlans, completedPlan];
          set({ completedTrainingPlans: updatedPlans });
        } catch (error) {
          console.error('Failed to complete training plan:', error);
        }
      },

      // Initialization
      initializeStore: async () => {
        set({ isLoading: true });
        try {
          // Load all data from storage
          const profile = await ProfileService.loadProfile();
          const trainingHistory = TrainingService.getTrainingHistory();
          const personalBests = TrainingService.getPersonalBests();
          const completedTrainingPlans = TrainingService.getCompletedTrainingPlans();

          set({
            profile,
            trainingHistory,
            personalBests,
            completedTrainingPlans,
            goldenPace: profile?.currentVdot || null,
            showProfileDashboard: !!profile
          });
        } catch (error) {
          console.error('Failed to initialize store:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearAllData: () => {
        set({
          profile: null,
          showProfileDashboard: false,
          profileError: '',
          raceTime: '',
          raceDistance: '5K',
          goldenPace: null,
          trainingPaces: null,
          trainingHistory: [],
          personalBests: {},
          completedTrainingPlans: [],
          showTrainingLogForm: false,
          activeTab: 'calculator',
          selectedArticle: null,
          showAdminPanel: false
        });
      }
    }),
    {
      name: 'running-app-store'
    }
  )
);

// Helper function for time parsing
function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  return 0;
}
