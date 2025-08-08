import { UserProfile, TrainingSession, PersonalBest, TrainingPlan } from '../types';
import { STORAGE_KEYS } from '../constants';

export class StorageService {
  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save to localStorage:`, error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to read from localStorage:`, error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage:`, error);
    }
  }

  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error(`Failed to clear localStorage:`, error);
    }
  }
}

export class ProfileService {
  static async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const profileData = {
      ...profile,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdDate: profile.createdDate || new Date().toISOString().split('T')[0]
    };

    // TODO: Replace with API call when backend is connected
    StorageService.setItem(STORAGE_KEYS.PROFILE, profileData);
    
    return profileData;
  }

  static async loadProfile(email?: string): Promise<UserProfile | null> {
    // TODO: Replace with API call when backend is connected
    const profile = StorageService.getItem<UserProfile>(STORAGE_KEYS.PROFILE);
    
    if (email && profile && profile.email !== email) {
      return null;
    }
    
    return profile;
  }

  static async deleteProfile(): Promise<void> {
    // TODO: Replace with API call when backend is connected
    StorageService.removeItem(STORAGE_KEYS.PROFILE);
  }
}

export class TrainingService {
  static async saveTrainingSession(session: Omit<TrainingSession, 'id' | 'date'>): Promise<TrainingSession> {
    const newSession: TrainingSession = {
      ...session,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };

    const history = this.getTrainingHistory();
    const updatedHistory = [...history, newSession];
    
    // TODO: Replace with API call when backend is connected  
    StorageService.setItem(STORAGE_KEYS.TRAINING_HISTORY, updatedHistory);
    
    return newSession;
  }

  static getTrainingHistory(): TrainingSession[] {
    return StorageService.getItem<TrainingSession[]>(STORAGE_KEYS.TRAINING_HISTORY) || [];
  }

  static async updatePersonalBest(distance: string, time: string): Promise<PersonalBest> {
    const personalBests = StorageService.getItem<PersonalBest>(STORAGE_KEYS.PERSONAL_BESTS) || {};
    
    const updatedPBs = {
      ...personalBests,
      [distance]: time
    };

    // TODO: Replace with API call when backend is connected
    StorageService.setItem(STORAGE_KEYS.PERSONAL_BESTS, updatedPBs);
    
    return updatedPBs;
  }

  static getPersonalBests(): PersonalBest {
    return StorageService.getItem<PersonalBest>(STORAGE_KEYS.PERSONAL_BESTS) || {};
  }

  static async completeTrainingPlan(planName: string, goldenPace?: number): Promise<TrainingPlan> {
    const completedPlan: TrainingPlan = {
      id: Date.now().toString(),
      name: planName,
      completedDate: new Date().toISOString().split('T')[0],
      goldenPaceAtCompletion: goldenPace
    };

    const completedPlans = StorageService.getItem<TrainingPlan[]>(STORAGE_KEYS.COMPLETED_PLANS) || [];
    const updatedPlans = [...completedPlans, completedPlan];

    // TODO: Replace with API call when backend is connected
    StorageService.setItem(STORAGE_KEYS.COMPLETED_PLANS, updatedPlans);
    
    return completedPlan;
  }

  static getCompletedTrainingPlans(): TrainingPlan[] {
    return StorageService.getItem<TrainingPlan[]>(STORAGE_KEYS.COMPLETED_PLANS) || [];
  }
}
