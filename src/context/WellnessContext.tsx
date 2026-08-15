import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, MoodCheckIn, JournalEntry, Goal, AppNotification, MoodLevel } from '../types';
import { INITIAL_DATA } from '../data/initialData';
import { WELLNESS_CATALOG } from '../data/wellnessCatalog';
import { useAuth } from './AuthContext';
import { getUserRarity } from '../lib/progression';

interface WellnessContextType {
  userData: UserData;
  addMoodCheckIn: (checkIn: Omit<MoodCheckIn, 'id' | 'timestamp'>) => void;
  deleteMoodCheckIn: (id: string) => void;
  completeActivity: (activityId: string) => void;
  toggleFavorite: (activityId: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateJournalEntry: (id: string, entry: { title: string; content: string; mood: MoodLevel; tags?: string[] }) => void;
  deleteJournalEntry: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed' | 'currentValue'>) => void;
  updateGoal: (goalId: string, value: number) => void;
  editGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addNotification: (notification: Partial<AppNotification> & { title: string; message: string; type: AppNotification['type'] }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  updateXP: (amount: number) => void;
  updateProfile: (updates: Partial<UserData['profile']>) => void;
  updateSmileBreakStats: (updates: Partial<UserData['smileBreakStats']>) => void;
  toggleJokeFavorite: (jokeId: string) => void;
  logJokeView: (jokeId: string, language: string, category: string, moodContext?: string) => void;
  updateMindGymStats: (
    updates: Partial<UserData['mindGymStats']>, 
    xpEarned?: number, 
    gameId?: string, 
    score?: number,
    sessionData?: {
      title: string;
      accuracy: number;
      difficulty: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master';
      timeTaken: number;
      correctAttempts?: number;
      totalAttempts?: number;
    }
  ) => { dailyBonusClaimed: boolean; totalXpAwarded: number };
  updateMusicStats: (updates: Partial<UserData['musicStats']>) => void;
  updateNotificationPreferences: (updates: Partial<import('../types').NotificationPreferences>) => void;
  updateLanguage: (language: 'en' | 'te' | 'hi' | 'ta' | 'kn') => void;
  addHydration: (amount: number) => void;
  addSleepLog: (log: Omit<import('../types').SleepLog, 'id' | 'timestamp'>) => void;
  resetData: () => void;
}

const loadUserData = (key: string, currentUser: { name: string; email: string; createdAt?: string } | null): UserData => {
  const saved = localStorage.getItem(key);
  let data: UserData;
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch {
      data = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  } else {
    data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  if (currentUser) {
    data.profile = {
      ...data.profile,
      name: currentUser.name || data.profile.name,
      email: currentUser.email || data.profile.email,
      createdAt: currentUser.createdAt || data.profile.createdAt,
    };
  }

  if (data && data.activities) {
    const existingIds = new Set(data.activities.map((a: any) => a.id));
    const missing = WELLNESS_CATALOG.filter(a => !existingIds.has(a.id));
    data.activities = [...data.activities, ...missing];
  } else {
    data.activities = WELLNESS_CATALOG;
  }

  if (!data.smileBreakStats) {
    data.smileBreakStats = INITIAL_DATA.smileBreakStats;
  } else {
    data.smileBreakStats = {
      ...INITIAL_DATA.smileBreakStats,
      ...data.smileBreakStats,
    };
  }

  if (!data.mindGymStats) {
    data.mindGymStats = INITIAL_DATA.mindGymStats;
  } else {
    data.mindGymStats = {
      ...INITIAL_DATA.mindGymStats,
      ...data.mindGymStats,
    };
  }

  const defaultPrefs = {
    wellnessReminders: true,
    moodCheckinReminders: true,
    goalReminders: true,
    achievementNotifications: true,
    aiMentorInsights: true
  };

  data.notificationPreferences = {
    ...defaultPrefs,
    ...(data.notificationPreferences || {})
  };

  if (!data.hydration) {
    data.hydration = INITIAL_DATA.hydration;
  }
  if (!data.sleep) {
    data.sleep = INITIAL_DATA.sleep;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  let loginDates = data.profile.loginDates || [];
  if (!loginDates.includes(todayStr)) {
    loginDates = [...loginDates, todayStr];
  }

  const loginXp = loginDates.length * 100;
  const activityXp = (data.activities || []).filter((a: any) => a.completed).length * 40;
  const goalXp = (data.goals || []).filter((g: any) => g.completed).reduce((acc: number, g: any) => acc + (g.xpReward || 50), 0);
  const moodXp = (data.moodHistory || []).length * 25;
  const journalXp = (data.journal || []).length * 30;
  const mindGymXp = (data.mindGymStats?.totalXP || 0);
  const totalDynamicXP = loginXp + activityXp + goalXp + moodXp + journalXp + mindGymXp + 50;
  const computedLevel = Math.floor(totalDynamicXP / 100) + 1;

  data.profile = {
    ...data.profile,
    loginDates,
    xp: totalDynamicXP,
    level: computedLevel,
    lastActive: new Date().toISOString()
  };

  return data;
};

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `mood_mentor_v2_data_${user.email.toLowerCase()}` : 'mood_mentor_v2_data_guest';
  const [loadedKey, setLoadedKey] = useState<string | null>(storageKey);

  const [userData, setUserData] = useState<UserData>(() => loadUserData(storageKey, user));

  useEffect(() => {
    const fresh = loadUserData(storageKey, user);
    setUserData(fresh);
    setLoadedKey(storageKey);
  }, [storageKey, user]);

  useEffect(() => {
    if (storageKey && loadedKey === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(userData));
    }
  }, [userData, storageKey, loadedKey]);

  const addNotification = (notif: Partial<AppNotification> & { title: string; message: string; type: AppNotification['type'] }) => {
    setUserData(prev => {
      const prefs = prev.notificationPreferences || {
        wellnessReminders: true,
        moodCheckinReminders: true,
        goalReminders: true,
        achievementNotifications: true,
        aiMentorInsights: true
      };

      if (notif.type === 'reminder' && !prefs.moodCheckinReminders) return prev;
      if (notif.type === 'goal' && !prefs.goalReminders) return prev;
      if (notif.type === 'achievement' && !prefs.achievementNotifications) return prev;
      if (notif.type === 'wellness' && !prefs.wellnessReminders) return prev;
      if (notif.type === 'info' && notif.relatedFeature === 'ai-mentor' && !prefs.aiMentorInsights) return prev;

      const id = notif.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const exists = prev.notifications.some(n => n.id === id);
      if (exists) return prev;

      const newNotif: AppNotification = {
        id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.timestamp || new Date().toISOString(),
        read: notif.read ?? false,
        actionUrl: notif.actionUrl,
        relatedFeature: notif.relatedFeature
      };
      return {
        ...prev,
        notifications: [newNotif, ...prev.notifications]
      };
    });
  };

  const updateNotificationPreferences = (updates: Partial<import('../types').NotificationPreferences>) => {
    setUserData(prev => ({
      ...prev,
      notificationPreferences: {
        ...(prev.notificationPreferences || {
          wellnessReminders: true,
          moodCheckinReminders: true,
          goalReminders: true,
          achievementNotifications: true,
          aiMentorInsights: true
        }),
        ...updates
      }
    }));
  };

  const updateMusicStats = (updates: Partial<UserData['musicStats']>) => {
    setUserData(prev => {
      const currentStats = prev.musicStats || {
        favorites: [],
        recentlyPlayed: [],
        lastPlayedDate: null,
        totalListenedMinutes: 0
      };
      return {
        ...prev,
        musicStats: { ...currentStats, ...updates }
      };
    });
  };

  const updateLanguage = (language: 'en' | 'te' | 'hi' | 'ta' | 'kn') => {
    setUserData(prev => ({
      ...prev,
      languagePreference: language
    }));
  };

  const addHydration = (amount: number) => {
    setUserData(prev => {
      const today = new Date().toDateString();
      const logs = [...prev.hydration.logs];
      const todayLogIndex = logs.findIndex(l => new Date(l.timestamp).toDateString() === today);
      
      if (todayLogIndex > -1) {
        logs[todayLogIndex] = {
          ...logs[todayLogIndex],
          amount: logs[todayLogIndex].amount + amount
        };
      } else {
        logs.push({
          id: `hyd-${Date.now()}`,
          timestamp: new Date().toISOString(),
          amount
        });
      }

      return {
        ...prev,
        hydration: { ...prev.hydration, logs }
      };
    });
    updateXP(5);
  };

  const addSleepLog = (log: Omit<import('../types').SleepLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: `sleep-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setUserData(prev => ({
      ...prev,
      sleep: { ...prev.sleep, logs: [newLog, ...prev.sleep.logs] }
    }));
    updateXP(20);
  };

  const markNotificationRead = (id: string) => {
    setUserData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsRead = () => {
    setUserData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const deleteNotification = (id: string) => {
    setUserData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const clearNotifications = () => {
    setUserData(prev => ({ ...prev, notifications: [] }));
  };

  // Dynamic notification evaluator based on actual user state
  useEffect(() => {
    if (!userData) return;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const hasCheckedInToday = (userData.moodHistory || []).some(m => {
      const d = new Date(m.timestamp);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return mStr === todayStr;
    });

    setUserData(prev => {
      let updatedNotifs = [...(prev.notifications || [])];
      let changed = false;

      // 1. Missing Check-in condition
      const checkinNotifId = `missing-checkin-${todayStr}`;
      const existingCheckinNotif = updatedNotifs.find(n => n.id === checkinNotifId);

      if (!hasCheckedInToday) {
        if (!existingCheckinNotif) {
          updatedNotifs = [
            {
              id: checkinNotifId,
              title: 'Daily Check-In',
              message: "You haven't checked in today. Log your mood to track your wellbeing.",
              type: 'reminder',
              timestamp: new Date().toISOString(),
              read: false,
              relatedFeature: 'check-in'
            },
            ...updatedNotifs
          ];
          changed = true;
        }
      } else {
        // User has checked in today! Automatically mark the check-in reminder as read
        if (existingCheckinNotif && !existingCheckinNotif.read) {
          updatedNotifs = updatedNotifs.map(n => n.id === checkinNotifId ? { ...n, read: true } : n);
          changed = true;
        }
      }

      // 2. Goal completion check
      (prev.goals || []).forEach(goal => {
        const goalIncompleteId = `goal-incomplete-${goal.id}-${todayStr}`;
        const goalCompleteId = `goal-completed-${goal.id}-${todayStr}`;
        const existingInc = updatedNotifs.find(n => n.id === goalIncompleteId);
        const existingComp = updatedNotifs.find(n => n.id === goalCompleteId);

        if (goal.currentValue < goal.targetValue) {
          if (!existingInc && !existingComp) {
            updatedNotifs = [
              {
                id: goalIncompleteId,
                title: 'Goal Reminder',
                message: `Your "${goal.title}" goal is still incomplete (${goal.currentValue}/${goal.targetValue} ${goal.unit}).`,
                type: 'goal',
                timestamp: new Date().toISOString(),
                read: false,
                relatedFeature: 'goals'
              },
              ...updatedNotifs
            ];
            changed = true;
          }
        } else {
          if (existingInc && !existingInc.read) {
            updatedNotifs = updatedNotifs.map(n => n.id === goalIncompleteId ? { ...n, read: true } : n);
            changed = true;
          }
          if (!existingComp) {
            updatedNotifs = [
              {
                id: goalCompleteId,
                title: 'Goal Completed 🎉',
                message: `Nice work! You completed your "${goal.title}" goal today.`,
                type: 'goal',
                timestamp: new Date().toISOString(),
                read: false,
                relatedFeature: 'goals'
              },
              ...updatedNotifs
            ];
            changed = true;
          }
        }
      });

      if (!changed) return prev;
      return { ...prev, notifications: updatedNotifs };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.moodHistory, userData.goals]);

  const updateXP = (amount: number) => {
    setUserData(prev => {
      const oldXP = prev.profile.xp;
      const newXP = oldXP + amount;
      const xpNeeded = prev.profile.level * 100;
      let newLevel = prev.profile.level;
      
      const oldRarity = getUserRarity(oldXP);
      const newRarity = getUserRarity(newXP);

      if (newXP >= xpNeeded) {
        newLevel += 1;
        addNotification({
          title: 'Level Up!',
          message: `Congratulations! You reached Level ${newLevel}`,
          type: 'achievement'
        });
      }

      if (newRarity !== oldRarity) {
        addNotification({
          title: 'Rarity Upgraded!',
          message: `Your Wellness Rank is now ${newRarity}!`,
          type: 'achievement'
        });
      }

      return {
        ...prev,
        profile: { ...prev.profile, xp: newXP, level: newLevel }
      };
    });
  };

  const addMoodCheckIn = (checkIn: Omit<MoodCheckIn, 'id' | 'timestamp'>) => {
    const newCheckIn: MoodCheckIn = {
      ...checkIn,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    
    setUserData(prev => {
      const history = [newCheckIn, ...prev.moodHistory];
      
      // Calculate Streak
      const today = new Date().toDateString();
      const lastActive = new Date(prev.profile.lastActive).toDateString();
      let currentStreak = prev.profile.currentStreak;
      
      if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActive === yesterday.toDateString()) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      }

      const bestStreak = Math.max(currentStreak, prev.profile.bestStreak);

      return {
        ...prev,
        moodHistory: history,
        profile: { 
          ...prev.profile, 
          currentStreak, 
          bestStreak, 
          lastActive: new Date().toISOString() 
        }
      };
    });

    updateXP(10);
    addNotification({
      title: 'Mood Logged',
      message: 'Great job tracking your mood!',
      type: 'success'
    });
  };

  const deleteMoodCheckIn = (id: string) => {
    setUserData(prev => {
      const newHistory = prev.moodHistory.filter(entry => entry.id !== id);
      
      // Recalculate Streak and Last Active
      let currentStreak = 0;
      let lastActive = prev.profile.lastActive;
      
      if (newHistory.length > 0) {
        // Sort by date descending
        const sorted = [...newHistory].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        lastActive = sorted[0].timestamp;
        
        // Calculate streak from sorted history
        const uniqueDays = new Set<string>();
        for (const entry of sorted) {
          uniqueDays.add(new Date(entry.timestamp).toDateString());
        }
        
        const dayArray = Array.from(uniqueDays).map(d => new Date(d));
        dayArray.sort((a, b) => b.getTime() - a.getTime());
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const latestCheckinDay = new Date(dayArray[0]);
        latestCheckinDay.setHours(0, 0, 0, 0);
        const diffToToday = Math.floor((today.getTime() - latestCheckinDay.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffToToday <= 1) {
          currentStreak = 1;
          for (let i = 1; i < dayArray.length; i++) {
            const prevDate = dayArray[i-1];
            const currDate = dayArray[i];
            const gap = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (gap === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      } else {
        // Reset if no history
        currentStreak = 0;
        // Keep lastActive as is or reset to createdAt if preferred, but usually keeping it is fine
      }

      return {
        ...prev,
        moodHistory: newHistory,
        profile: {
          ...prev.profile,
          currentStreak,
          lastActive
        }
      };
    });
  };

  const completeActivity = (activityId: string) => {
    setUserData(prev => {
      const activity = prev.activities.find(a => a.id === activityId);
      if (!activity) return prev;

      const updatedActivities = prev.activities.map(a => 
        a.id === activityId ? { ...a, completed: true, completedAt: new Date().toISOString() } : a
      );

      // Update Goals
      const updatedGoals = prev.goals.map(g => {
        if (!g.completed) {
          const newVal = g.currentValue + 1;
          const isCompleted = newVal >= g.targetValue;
          if (isCompleted) {
            addNotification({
              title: 'Goal Achieved!',
              message: `You completed: ${g.title}`,
              type: 'success'
            });
          }
          return { ...g, currentValue: newVal, completed: isCompleted };
        }
        return g;
      });

      const completedCount = updatedActivities.filter(a => a.completed).length;
      const meditationCount = updatedActivities.filter(a => a.completed && a.category === 'Meditation').length;
      const breathingCount = updatedActivities.filter(a => a.completed && a.category === 'Breathing').length;

      const newAchievements = prev.achievements.map(ach => {
        let progress = ach.progress;
        let unlockedAt = ach.unlockedAt;
        const alreadyUnlocked = !!unlockedAt;

        if (ach.id === 'first-step' && completedCount >= 1 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === 'first-meditation' && meditationCount >= 1 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === 'first-breathing' && breathingCount >= 1 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === '7-wellness' && completedCount >= 7 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === '10-meditation' && meditationCount >= 10 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === '25-wellness' && completedCount >= 25 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === 'explorer' && completedCount >= 5 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }
        if (ach.id === 'gardener' && completedCount >= 30 && !alreadyUnlocked) {
          unlockedAt = new Date().toISOString();
          progress = 100;
        }

        if (progress === 100 && !alreadyUnlocked) {
          addNotification({
            title: 'Achievement Unlocked!',
            message: `${ach.title} (${ach.rarity})`,
            type: 'achievement'
          });
          // Award XP based on rarity
          updateXP(ach.rewardXP);
        }

        return { ...ach, progress, unlockedAt };
      });

      return {
        ...prev,
        activities: updatedActivities,
        goals: updatedGoals,
        achievements: newAchievements
      };
    });

    const activity = userData.activities.find(a => a.id === activityId);
    if (activity) {
      updateXP(activity.xpReward);
      addNotification({
        title: 'Activity Completed',
        message: `Earned +${activity.xpReward} XP! Keep nurturing your mind.`,
        type: 'success'
      });
    }
  };

  const toggleFavorite = (activityId: string) => {
    setUserData(prev => ({
      ...prev,
      activities: prev.activities.map(a => 
        a.id === activityId ? { ...a, favorite: !a.favorite } : a
      )
    }));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const now = new Date();
    const newEntry: JournalEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      date: now.toISOString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      tags: entry.tags || []
    };
    setUserData(prev => ({
      ...prev,
      journal: [newEntry, ...prev.journal]
    }));
    updateXP(10);
  };

  const updateJournalEntry = (id: string, entry: { title: string; content: string; mood: MoodLevel; tags?: string[] }) => {
    const now = new Date();
    setUserData(prev => ({
      ...prev,
      journal: prev.journal.map(j => 
        j.id === id ? {
          ...j,
          ...entry,
          tags: entry.tags || j.tags || [],
          updatedAt: now.toISOString()
        } : j
      )
    }));
  };

  const deleteJournalEntry = (id: string) => {
    setUserData(prev => ({
      ...prev,
      journal: prev.journal.filter(j => j.id !== id)
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'completed' | 'currentValue'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      currentValue: 0
    };
    setUserData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const deleteGoal = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
  };

  const editGoal = (goalId: string, updates: Partial<Goal>) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id === goalId) {
          const updated = { ...g, ...updates };
          const isCompleted = updated.currentValue >= updated.targetValue;
          return { ...updated, completed: isCompleted };
        }
        return g;
      })
    }));
  };

  const updateGoal = (goalId: string, value: number) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id === goalId) {
          const newVal = g.currentValue + value;
          const isCompleted = newVal >= g.targetValue;
          if (isCompleted && !g.completed) {
            updateXP(50);
            addNotification({
              title: 'Goal Achieved!',
              message: `You completed: ${g.title}`,
              type: 'success'
            });
          }
          return { ...g, currentValue: newVal, completed: isCompleted };
        }
        return g;
      })
    }));
  };

  const updateProfile = (updates: Partial<UserData['profile']>) => {
    setUserData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  };

  const unlockAchievement = (id: string, title: string) => {
    setUserData(prev => {
      const alreadyUnlocked = prev.achievements.some(a => a.id === id && a.unlockedAt);
      if (alreadyUnlocked) return prev;

      addNotification({
        title: 'Achievement Unlocked!',
        message: title,
        type: 'achievement'
      });

      return {
        ...prev,
        achievements: prev.achievements.map(a => 
          a.id === id ? { ...a, unlockedAt: new Date().toISOString(), progress: 100 } : a
        )
      };
    });
  };

  
  const updateSmileBreakStats = (updates: Partial<UserData['smileBreakStats']>) => {
    setUserData(prev => {
      const today = new Date().toDateString();
      const lastDate = prev.smileBreakStats.lastSmileBreakDate;
      const isNewDay = lastDate !== today;
      
      const statsToMerge = { ...prev.smileBreakStats };
      if (isNewDay) {
        statsToMerge.dailyXp = 0;
      }
      
      const newStats = { ...statsToMerge, ...updates };

      // Check achievements
      const updatedAchievements = prev.achievements.map(a => {
        const alreadyUnlocked = !!a.unlockedAt;
        let unlocked = alreadyUnlocked;

        if (a.id === 'smile-starter' && !alreadyUnlocked && (newStats.smileBreaksCompleted >= 1 || newStats.jokesViewed >= 1)) {
          unlocked = true;
        }
        if (a.id === 'laugh-lover' && !alreadyUnlocked && (newStats.smileBreaksCompleted >= 10 || newStats.jokesViewed >= 10)) {
          unlocked = true;
        }
        if (a.id === 'joke-collector' && !alreadyUnlocked && newStats.favoriteJokes.length >= 5) {
          unlocked = true;
        }
        if (a.id === 'multilingual-smiler' && !alreadyUnlocked && (newStats.usedLanguages || []).length >= 3) {
          unlocked = true;
        }
        if (a.id === 'comedy-explorer' && !alreadyUnlocked && newStats.jokesViewed >= 10) {
          unlocked = true;
        }
        if (a.id === 'mood-humor-explorer' && !alreadyUnlocked && (newStats.usedMoods || []).length >= 5) {
          unlocked = true;
        }

        if (unlocked && !alreadyUnlocked) {
          addNotification({ 
            title: 'Achievement Unlocked!', 
            message: `${a.title} (${a.rarity})`, 
            type: 'achievement' 
          });
          // Reward XP
          updateXP(a.rewardXP);
          return { ...a, unlockedAt: new Date().toISOString(), progress: 100 };
        }

        return a;
      });

      return {
        ...prev,
        smileBreakStats: newStats,
        achievements: updatedAchievements
      };
    });
  };

  const toggleJokeFavorite = (jokeId: string) => {
    setUserData(prev => {
      const isLiked = prev.smileBreakStats.favoriteJokes.includes(jokeId);
      let newFavorites = [...prev.smileBreakStats.favoriteJokes];
      
      if (isLiked) {
        newFavorites = newFavorites.filter(id => id !== jokeId);
      } else {
        newFavorites.push(jokeId);
      }
      
      return {
        ...prev,
        smileBreakStats: {
          ...prev.smileBreakStats,
          favoriteJokes: newFavorites
        }
      };
    });
  };

  const logJokeView = (jokeId: string, language: string, category: string, moodContext?: string) => {
    setUserData(prev => {
      const stats = prev.smileBreakStats;
      const historyItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        jokeId,
        timestamp: new Date().toISOString(),
        language,
        category,
        moodContext
      };
      
      const updatedHistory = [historyItem, ...(stats.history || [])].slice(0, 30);
      const updatedLanguages = Array.from(new Set([...(stats.usedLanguages || []), language]));
      const updatedMoods = moodContext 
        ? Array.from(new Set([...(stats.usedMoods || []), moodContext])) 
        : (stats.usedMoods || []);
        
      return {
        ...prev,
        smileBreakStats: {
          ...stats,
          jokesViewed: stats.jokesViewed + 1,
          history: updatedHistory,
          usedLanguages: updatedLanguages,
          usedMoods: updatedMoods,
          mostUsedLanguage: language,
          mostUsedCategory: category
        }
      };
    });
  };

  const updateMindGymStats = (
    updates: Partial<UserData['mindGymStats']>, 
    xpEarned: number = 0, 
    gameId?: string, 
    score?: number,
    sessionData?: {
      title: string;
      accuracy: number;
      difficulty: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master';
      timeTaken: number;
      correctAttempts?: number;
      totalAttempts?: number;
    }
  ) => {
    let dailyBonusClaimed = false;
    let finalXpAwarded = xpEarned;

    setUserData(prev => {
      const currentMindStats = prev.mindGymStats || {
        gamesCompleted: 0,
        totalMinutes: 0,
        totalSeconds: 0,
        focusAccuracy: 0,
        totalCorrectAttempts: 0,
        totalAttempts: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        totalXP: 0,
        bestScore: 0,
        bestScoresByGame: {},
        dailyChallenge: {
          date: new Date().toISOString().split('T')[0],
          completedGames: [],
          claimed: false
        },
        history: []
      };

      const newStats = { ...currentMindStats, ...updates };

      // Update High Scores (Global & Per-Game)
      if (score !== undefined) {
        newStats.bestScore = Math.max(newStats.bestScore || 0, score);
        if (gameId) {
          const gameScores = { ...(newStats.bestScoresByGame || {}) };
          gameScores[gameId] = Math.max(gameScores[gameId] || 0, score);
          newStats.bestScoresByGame = gameScores;
        }
      }

      // Update Daily Challenge (Play any 2 games)
      const todayStr = new Date().toISOString().split('T')[0];
      let dailyChallenge = newStats.dailyChallenge;
      if (!dailyChallenge || dailyChallenge.date !== todayStr) {
        dailyChallenge = {
          date: todayStr,
          completedGames: [],
          claimed: false
        };
      }

      if (gameId) {
        if (!dailyChallenge.completedGames.includes(gameId)) {
          dailyChallenge.completedGames = [...dailyChallenge.completedGames, gameId];
        }
        if (dailyChallenge.completedGames.length >= 2 && !dailyChallenge.claimed) {
          dailyChallenge.claimed = true;
          dailyBonusClaimed = true;
          finalXpAwarded += 50; // Daily Challenge reward +50 XP
        }
      }
      newStats.dailyChallenge = dailyChallenge;

      // Track Session History
      if (gameId && sessionData) {
        const newSession: import('../types').MindGymSession = {
          id: `mgs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          gameId,
          title: sessionData.title || gameId,
          score: score || 0,
          accuracy: sessionData.accuracy !== undefined ? sessionData.accuracy : 100,
          difficulty: sessionData.difficulty || 'Beginner',
          timeTaken: sessionData.timeTaken || 60,
          xpEarned: xpEarned,
          date: new Date().toISOString(),
          completed: true
        };
        newStats.history = [newSession, ...(newStats.history || [])].slice(0, 50);

        // Update timing in seconds & minutes
        const prevSeconds = newStats.totalSeconds || (newStats.totalMinutes || 0) * 60;
        newStats.totalSeconds = prevSeconds + sessionData.timeTaken;
        newStats.totalMinutes = Math.max(newStats.gamesCompleted || 1, Math.ceil(newStats.totalSeconds / 60));

        // Update overall accuracy
        if (sessionData.correctAttempts !== undefined && sessionData.totalAttempts !== undefined && sessionData.totalAttempts > 0) {
          newStats.totalCorrectAttempts = (newStats.totalCorrectAttempts || 0) + sessionData.correctAttempts;
          newStats.totalAttempts = (newStats.totalAttempts || 0) + sessionData.totalAttempts;
          newStats.focusAccuracy = Math.round((newStats.totalCorrectAttempts / newStats.totalAttempts) * 100);
        } else {
          const completedSessions = (newStats.history || []).filter(s => s.completed && s.accuracy !== undefined);
          if (completedSessions.length > 0) {
            const sumAcc = completedSessions.reduce((sum, s) => sum + s.accuracy, 0);
            newStats.focusAccuracy = Math.round(sumAcc / completedSessions.length);
          }
        }
      }

      // Handle Streak tracking
      const todayDate = new Date().toDateString();
      const lastActive = currentMindStats.lastActivityDate 
        ? new Date(currentMindStats.lastActivityDate).toDateString() 
        : null;

      if (lastActive !== todayDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActive === yesterday.toDateString()) {
          newStats.currentStreak = (currentMindStats.currentStreak || 0) + 1;
        } else {
          newStats.currentStreak = 1;
        }
        newStats.lastActivityDate = new Date().toISOString();
      } else {
        newStats.currentStreak = Math.max(1, currentMindStats.currentStreak || 1);
      }

      newStats.bestStreak = Math.max(newStats.currentStreak, currentMindStats.bestStreak || 0, newStats.bestStreak || 0);
      newStats.totalXP = (currentMindStats.totalXP || 0) + finalXpAwarded;

      // Unlock Cognitive Achievements
      if (newStats.gamesCompleted === 1) {
        unlockAchievement('first-step', '🌱 First Step');
      }
      if (gameId === 'memory-match') {
        unlockAchievement('memory-master', '🧠 Memory Master');
      }
      if (gameId === 'focus-tap') {
        unlockAchievement('focus-mode', '🎯 Focus Mode');
      }
      if (gameId === 'breathing') {
        unlockAchievement('calm-mind', '🧘 Calm Mind');
      }
      if (newStats.currentStreak >= 3) {
        unlockAchievement('streak-3', '🔥 3-Day Streak');
      }
      if (newStats.totalXP >= 500) {
        unlockAchievement('mind-scholar', '✨ Focus Explorer');
      }

      return {
        ...prev,
        mindGymStats: newStats
      };
    });

    if (finalXpAwarded > 0) {
      updateXP(finalXpAwarded);
    }

    return { dailyBonusClaimed, totalXpAwarded: finalXpAwarded };
  };

  const resetData = () => {
    const freshData = {
      ...INITIAL_DATA,
      profile: {
        ...INITIAL_DATA.profile,
        name: user?.name || INITIAL_DATA.profile.name,
        email: user?.email || INITIAL_DATA.profile.email,
      }
    };
    setUserData(freshData);
    localStorage.removeItem(storageKey);
  };

  return (
    <WellnessContext.Provider value={{
      userData, addMoodCheckIn, deleteMoodCheckIn, completeActivity, toggleFavorite, addJournalEntry, updateJournalEntry, deleteJournalEntry,
      addGoal, updateGoal, editGoal, deleteGoal, addNotification, markNotificationRead,
      markAllNotificationsRead, deleteNotification, clearNotifications, updateXP,
      updateProfile, updateSmileBreakStats, toggleJokeFavorite, logJokeView, updateMindGymStats, updateMusicStats, updateNotificationPreferences, updateLanguage, 
      addHydration, addSleepLog, resetData
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) throw new Error('useWellness must be used within WellnessProvider');
  return context;
};
