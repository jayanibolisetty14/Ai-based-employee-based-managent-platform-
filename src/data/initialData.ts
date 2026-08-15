import { UserData, UserProfile, Rarity } from '../types';
import { WELLNESS_CATALOG } from './wellnessCatalog';

const INITIAL_PROFILE: UserProfile = {
  name: 'Explorer',
  email: 'explorer@moodmentor.ai',
  avatar: '👤',
  level: 1,
  xp: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActive: new Date().toISOString()
};

export const INITIAL_DATA: UserData = {
  profile: INITIAL_PROFILE,
  moodHistory: [],
  activities: WELLNESS_CATALOG,
  goals: [],
  achievements: [
    { id: 'first-step', title: 'First Step', description: 'Complete your first activity or game.', icon: '🌱', progress: 0, category: 'Milestone', rarity: Rarity.COMMON, rewardXP: 50 },
    { id: 'memory-master', title: 'Memory Master', description: 'Complete Memory Match successfully.', icon: '🧠', progress: 0, category: 'Memory', rarity: Rarity.RARE, rewardXP: 100 },
    { id: 'focus-mode', title: 'Focus Mode', description: 'Get a high Focus Tap score.', icon: '🎯', progress: 0, category: 'Focus', rarity: Rarity.RARE, rewardXP: 100 },
    { id: 'calm-mind', title: 'Calm Mind', description: 'Complete a breathing session.', icon: '🧘', progress: 0, category: 'Calm', rarity: Rarity.RARE, rewardXP: 100 },
    { id: 'streak-3', title: '3-Day Streak', description: 'Maintain a 3-day streak.', icon: '🔥', progress: 0, category: 'Streak', rarity: Rarity.RARE, rewardXP: 100 },
    { id: 'perfect-round', title: 'Perfect Round', description: 'Complete a game without mistakes.', icon: '⭐', progress: 0, category: 'Skill', rarity: Rarity.EPIC, rewardXP: 250 },
    { id: 'first-meditation', title: 'First Meditation', description: 'Complete your first meditation session.', icon: '🧘', progress: 0, category: 'Wellness', rarity: Rarity.COMMON, rewardXP: 50 },
    { id: 'first-breathing', title: 'First Breathing Session', description: 'Complete your first breathing exercise.', icon: '🫁', progress: 0, category: 'Wellness', rarity: Rarity.COMMON, rewardXP: 50 },
    { id: '7-wellness', title: '7 Wellness Activities', description: 'Complete 7 wellness activities.', icon: '🌱', progress: 0, category: 'Wellness', rarity: Rarity.RARE, rewardXP: 100 },
    { id: '10-meditation', title: '10 Meditation Sessions', description: 'Complete 10 meditation sessions.', icon: '💜', progress: 0, category: 'Wellness', rarity: Rarity.EPIC, rewardXP: 250 },
    { id: '25-wellness', title: '25 Wellness Sessions', description: 'Complete 25 total wellness sessions.', icon: '🧘', progress: 0, category: 'Wellness', rarity: Rarity.LEGENDARY, rewardXP: 500 },
    { id: 'streak-7', title: '7-Day Wellness Streak', description: 'Maintain a 7-day wellness streak.', icon: '🔥', progress: 0, category: 'Streak', rarity: Rarity.EPIC, rewardXP: 250 },
    { id: 'explorer', title: 'Wellness Explorer', description: 'Explore activities across multiple categories.', icon: '🌿', progress: 0, category: 'Milestone', rarity: Rarity.RARE, rewardXP: 100 },
    { id: 'gardener', title: 'Wellness Gardener', description: 'Complete 30 total wellness activities.', icon: '🪴', progress: 0, category: 'Wellness', rarity: Rarity.LEGENDARY, rewardXP: 500 },
    { id: 'smile-starter', title: 'Smile Starter', description: 'Complete your first Smile Break.', icon: '😂', progress: 0, category: 'Smile Break', rarity: Rarity.COMMON, rewardXP: 50 },
    { id: 'laugh-lover', title: 'Laugh Lover', description: 'Complete 10 Smile Breaks.', icon: '😆', progress: 0, category: 'Smile Break', rarity: Rarity.EPIC, rewardXP: 250 },
    { id: 'joke-collector', title: 'Joke Collector', description: 'Save 10 favorite jokes.', icon: '❤️', progress: 0, category: 'Smile Break', rarity: Rarity.RARE, rewardXP: 100 },
    { id: 'multilingual-smiler', title: 'Multilingual Smiler', description: 'Use Smile Break in 3 different languages.', icon: '🌈', progress: 0, category: 'Smile Break', rarity: Rarity.EPIC, rewardXP: 250 },
    { id: 'mood-humor-explorer', title: 'Mood Humor Explorer', description: 'Try jokes recommended for 5 different moods.', icon: '🎭', progress: 0, category: 'Smile Break', rarity: Rarity.LEGENDARY, rewardXP: 500 }
  ],
  notifications: [],
  journal: [],
  puzzleScores: {},
  smileBreakStats: {
    jokesViewed: 0,
    favoriteJokes: [],
    smileBreaksCompleted: 0,
    lastSmileBreakDate: null,
    dailyXp: 0,
    mostUsedLanguage: "en",
    mostUsedCategory: "All",
    history: [],
    usedLanguages: ["en"],
    usedMoods: []
  },
  mindGymStats: {
    gamesCompleted: 0,
    totalMinutes: 0,
    focusAccuracy: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastActivityDate: null,
    totalXP: 0,
    bestScore: 0
  },
  musicStats: {
    favorites: [],
    recentlyPlayed: [],
    lastPlayedDate: null,
    totalListenedMinutes: 0
  },
  notificationPreferences: {
    wellnessReminders: true,
    moodCheckinReminders: true,
    goalReminders: true,
    achievementNotifications: true,
    aiMentorInsights: true
  },
  themePreference: 'dark',
  languagePreference: 'en',
  hydration: {
    dailyGoal: 8,
    logs: []
  },
  sleep: {
    logs: []
  }
};
