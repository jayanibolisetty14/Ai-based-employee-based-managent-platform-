export type MoodLevel = 'Great' | 'Good' | 'Calm' | 'Happy' | 'Excited' | 'Okay' | 'Tired' | 'Sad' | 'Anxious' | 'Frustrated' | 'Lonely' | 'Stressed';

export interface MoodCheckIn {
  id: string;
  timestamp: string;
  mood: MoodLevel;
  energyLevel: number;
  stressLevel: number;
  sleepDuration: number;
  note: string;
  tags: string[];
}

export interface WellnessActivity {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  icon: string;
  completed?: boolean;
  completedAt?: string;
  benefits?: string[];
  steps?: Array<{ title: string; desc: string }>;
  safetyNote?: string;
  favorite?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  deadline: string;
  frequency?: 'Daily' | 'Weekly';
  createdAt?: string;
  completedAt?: string;
  lastProgressDate?: string;
  xpReward?: number;
}

export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  category: string;
  rarity: Rarity;
  rewardXP: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'goal' | 'activity' | 'wellness' | 'system' | 'streak' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedFeature?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodLevel;
  tags: string[];
  date: string;
  time?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  currentStreak: number;
  bestStreak: number;
  lastActive: string;
  createdAt?: string;
  loginDates?: string[];
}


export interface JokeHistoryItem {
  id: string;
  jokeId: string;
  timestamp: string;
  language: string;
  category: string;
  moodContext?: string;
}

export interface SmileBreakStats {
  jokesViewed: number;
  favoriteJokes: string[];
  smileBreaksCompleted: number;
  lastSmileBreakDate: string | null;
  dailyXp: number;
  mostUsedLanguage: string;
  mostUsedCategory: string;
  history?: JokeHistoryItem[];
  usedLanguages?: string[];
  usedMoods?: string[];
}

export interface MindGymSession {
  id: string;
  gameId: string;
  title: string;
  score: number;
  accuracy: number;
  difficulty: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master';
  timeTaken: number; // in seconds
  xpEarned: number;
  date: string;
  completed: boolean;
}

export interface MindGymDailyChallenge {
  date: string;
  completedGames: string[];
  claimed: boolean;
}

export interface MindGymStats {
  gamesCompleted: number;
  totalMinutes: number;
  totalSeconds?: number;
  focusAccuracy: number;
  totalCorrectAttempts?: number;
  totalAttempts?: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  totalXP: number;
  bestScore: number;
  bestScoresByGame?: Record<string, number>;
  dailyChallenge?: MindGymDailyChallenge;
  history?: MindGymSession[];
}

export interface NotificationPreferences {
  wellnessReminders: boolean;
  moodCheckinReminders: boolean;
  goalReminders: boolean;
  achievementNotifications: boolean;
  aiMentorInsights: boolean;
}

export interface HydrationLog {
  id: string;
  timestamp: string;
  amount: number; // in glasses
}

export interface HydrationData {
  dailyGoal: number;
  logs: HydrationLog[];
}

export interface SleepLog {
  id: string;
  timestamp: string;
  hours: number;
  quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export interface SleepData {
  logs: SleepLog[];
}

export interface MusicStats {
  favorites: string[];
  recentlyPlayed: string[];
  lastPlayedDate: string | null;
  totalListenedMinutes: number;
}

export interface UserData {
  profile: UserProfile;
  moodHistory: MoodCheckIn[];
  activities: WellnessActivity[];
  goals: Goal[];
  achievements: Achievement[];
  notifications: AppNotification[];
  journal: JournalEntry[];
  puzzleScores: Record<string, number>;
  smileBreakStats: SmileBreakStats;
  mindGymStats: MindGymStats;
  musicStats: MusicStats;
  notificationPreferences?: NotificationPreferences;
  themePreference?: 'light' | 'dark' | 'system';
  languagePreference?: 'en' | 'te' | 'hi' | 'ta' | 'kn';
  hydration: HydrationData;
  sleep: SleepData;
}
