// Type definitions for the running training app
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  goalRaceDistance: string;
  goalRaceTime?: string;
  weeklyMileage?: number;
  injuryHistory?: string;
  preferredUnits: 'imperial' | 'metric';
  currentVdot?: number;
  createdDate?: string;
  lastUpdated?: string;
}

export interface TrainingSession {
  id: string;
  type: 'Easy Run' | 'Tempo Run' | 'Interval Training' | 'Long Run' | 'Recovery Run' | 'Race' | 'Cross Training' | 'Strength Training';
  distance?: string;
  time?: string;
  feeling: 'Excellent' | 'Good' | 'Average' | 'Tired' | 'Struggled';
  effort: 'Easy' | 'Moderate' | 'Comfortably Hard' | 'Hard' | 'Very Hard' | 'Max Effort';
  notes?: string;
  weather?: string;
  location?: string;
  date: string;
  goldenPace?: number;
}

export interface PersonalBest {
  [distance: string]: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  completedDate: string;
  goldenPaceAtCompletion?: number;
}

export interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  content: string;
  featured: boolean;
  publishedDate?: string;
  author?: string;
}

export interface PremiumPlan {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  priceFrequency?: string;
  duration: string;
  description: string;
  features: string[];
  buttonText: string;
  guarantee?: string;
  isSubscription?: boolean;
}

export interface TrainingPaces {
  easy: string;
  marathon: string;
  threshold: string;
  interval: string;
  repetition: string;
}

export interface MunichColors {
  white: string;
  black: string;
  lightBlue: string;
  lightGreen: string;
  orange: string;
  violet: string;
  yellow: string;
  darkGreen: string;
  silver: string;
  gray: string;
  lightGray: string;
  border: string;
}
