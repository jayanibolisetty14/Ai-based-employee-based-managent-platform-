import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Calendar, Moon, Sun, X, CheckCircle2 } from 'lucide-react';
import { useWellness } from '@/context/WellnessContext';
import { useTheme } from '@/context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getAvatarByEmojiOrId } from '@/data/avatars';
import { AvatarImage } from '@/components/common/AvatarImage';
import { WELLNESS_CATALOG } from '@/data/wellnessCatalog';
import { MUSIC_CATALOG } from '@/data/musicCatalog';
import { cn } from '@/lib/utils';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  path: string;
  icon: string;
  keywords?: string[];
}

export const TopNav = () => {
  const { userData, markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications } = useWellness();
  const { setTheme, actualTheme } = useTheme();
  const navigate = useNavigate();
  const unreadCount = (userData.notifications || []).filter(n => !n.read).length;
  const today = new Date();
  
  const avatarData = getAvatarByEmojiOrId(userData.profile.avatar);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  // Popular suggestions when search query is empty
  const popularSuggestions: SearchItem[] = [
    { id: 'suggest-med', title: 'Meditation', category: 'Wellness', description: '5-minute calming mindfulness sessions', path: '/wellness', icon: '🧘', keywords: ['meditate', 'calm', 'mindful'] },
    { id: 'suggest-breath', title: 'Breathing Exercises', category: 'Wellness', description: 'Deep exhale & anxiety relief techniques', path: '/wellness', icon: '🫁', keywords: ['breath', 'exhale', 'inhale', 'anxiety'] },
    { id: 'suggest-mind', title: 'Mind Gym', category: 'Brain', description: 'Interactive focus & cognitive memory games', path: '/mind-gym', icon: '🧩', keywords: ['brain', 'focus', 'word', 'puzzle'] },
    { id: 'suggest-smile', title: 'Smile Break', category: 'Positivity', description: 'Quick jokes, humor, and positivity boosts', path: '/smile-break', icon: '😂', keywords: ['joke', 'jokes', 'laugh', 'humor', 'fun'] },
    { id: 'suggest-music', title: 'Music & Ambience', category: 'Audio', description: 'Calming lo-fi, rain, and focus soundscapes', path: '/music', icon: '🎵', keywords: ['sound', 'song', 'rain', 'lofi'] },
    { id: 'suggest-mentor', title: 'AI Mentor', category: 'AI', description: 'Talk with your personalized AI wellness coach', path: '/ai-mentor', icon: '🤖', keywords: ['ai', 'chat', 'bot', 'guidance'] },
    { id: 'suggest-mood', title: 'Mood Check-In', category: 'Mood', description: 'Log your current emotional state & stress level', path: '/mood-checkin', icon: '😄', keywords: ['log', 'feeling', 'stress', 'energy'] },
  ];

  // Comprehensive searchable items list
  const searchItems: SearchItem[] = [
    { id: 'dash', title: 'Dashboard', category: 'Navigation', description: 'Your wellbeing overview and quick actions', path: '/dashboard', icon: '📊', keywords: ['home', 'overview', 'main', 'stats'] },
    { id: 'mood', title: 'Mood Check-In', category: 'Mood', description: 'Log your current mood, stress, and energy levels', path: '/mood-checkin', icon: '😄', keywords: ['log', 'feeling', 'emotion', 'stress', 'energy', 'checkin', 'check-in'] },
    { id: 'history', title: 'Mood History', category: 'History', description: 'Review your past check-ins and emotional trends', path: '/mood-history', icon: '📈', keywords: ['trends', 'past', 'logs', 'analytics', 'history'] },
    { id: 'wellness', title: 'Wellness Hub', category: 'Wellness', description: 'Explore meditation, breathing, and yoga sessions', path: '/wellness', icon: '🧘', keywords: ['exercises', 'practice', 'meditation', 'breathing', 'yoga', 'stress', 'sleep', 'rest', 'hydration'] },
    { id: 'mindgym', title: 'Mind Gym', category: 'Brain', description: 'Interactive focus and cognitive wellness games', path: '/mind-gym', icon: '🧠', keywords: ['brain', 'cognitive', 'focus', 'memory', 'word', 'puzzle', 'game'] },
    { id: 'journal', title: 'Reflective Journal', category: 'Journal', description: 'Write down your thoughts and reflections', path: '/journal', icon: '📖', keywords: ['diary', 'write', 'notes', 'entry', 'reflection'] },
    { id: 'goals', title: 'Active Goals', category: 'Goals', description: 'Set and track your daily wellness targets', path: '/goals', icon: '🎯', keywords: ['target', 'habit', 'streak', 'progress'] },
    { id: 'achievements', title: 'Achievements & Badges', category: 'Badges', description: 'View your unlocked milestones and streaks', path: '/achievements', icon: '🏆', keywords: ['rewards', 'xp', 'level', 'milestones', 'streak', 'badges'] },
    { id: 'music', title: 'Music & Ambience', category: 'Audio', description: 'Calming sounds, binaural beats, and focus soundscapes', path: '/music', icon: '🎵', keywords: ['audio', 'song', 'rain', 'relax', 'soundscape', 'lofi', 'binaural'] },
    { id: 'reports', title: 'Wellness Reports', category: 'Analytics', description: 'Detailed insights and wellness statistics', path: '/reports', icon: '📊', keywords: ['charts', 'stats', 'analytics', 'insights'] },
    { id: 'mentor', title: 'AI Mentor', category: 'AI', description: 'Talk to your personalized AI wellness companion', path: '/ai-mentor', icon: '🤖', keywords: ['chat', 'bot', 'guidance', 'advice', 'support', 'coach'] },
    { id: 'smile', title: 'Smile Break', category: 'Positivity', description: 'Quick jokes, positivity boosts, and humor', path: '/smile-break', icon: '😂', keywords: ['joke', 'jokes', 'laugh', 'humor', 'fun', 'positivity', 'smile'] },
    { id: 'profile', title: 'User Profile', category: 'Account', description: 'Manage your bio, avatar, and identity', path: '/profile', icon: '👤', keywords: ['account', 'avatar', 'name', 'user'] },
    { id: 'settings', title: 'Settings', category: 'Settings', description: 'Appearance, notifications, and data vault', path: '/settings', icon: '⚙️', keywords: ['theme', 'dark', 'light', 'notifications', 'export', 'delete', 'settings'] },
    ...WELLNESS_CATALOG.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      description: a.description,
      path: '/wellness',
      icon: a.icon || '🧘',
      keywords: [a.category.toLowerCase(), a.difficulty.toLowerCase(), ...(a.benefits || []).map(b => b.toLowerCase())]
    })),
    ...MUSIC_CATALOG.map(s => ({
      id: s.id,
      title: s.title,
      category: 'Music',
      description: `By ${s.artist} • ${s.mood}`,
      path: '/music',
      icon: '🎵',
      keywords: [s.artist.toLowerCase(), s.mood.toLowerCase(), s.album.toLowerCase(), s.language.toLowerCase(), 'music']
    }))
  ];

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredResults = trimmedQuery === '' ? [] : searchItems.filter(item => {
    const matchTitle = item.title.toLowerCase().includes(trimmedQuery);
    const matchDesc = item.description.toLowerCase().includes(trimmedQuery);
    const matchCat = item.category.toLowerCase().includes(trimmedQuery);
    const matchKeywords = item.keywords?.some(k => k.toLowerCase().includes(trimmedQuery));
    return matchTitle || matchDesc || matchCat || matchKeywords;
  });

  const displayedList = trimmedQuery === '' ? popularSuggestions : filteredResults;

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isSearchOpen) {
      setIsSearchOpen(true);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (displayedList.length > 0) {
        setSelectedIndex(prev => (prev + 1) % displayedList.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (displayedList.length > 0) {
        setSelectedIndex(prev => (prev - 1 + displayedList.length) % displayedList.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayedList.length > 0) {
        const targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
        const selectedItem = displayedList[targetIndex];
        if (selectedItem) {
          navigate(selectedItem.path);
          setSearchQuery('');
          setIsSearchOpen(false);
        }
      }
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedIndex(-1);
    setIsSearchOpen(true);
    inputRef.current?.focus();
  };

  const handleSelectResult = (item: SearchItem) => {
    navigate(item.path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="h-24 px-6 sm:px-10 flex items-center justify-between border-b border-border-subtle bg-background/60 backdrop-blur-xl z-[100] relative">
      <div className="flex items-center gap-8 flex-1 max-w-2xl">
        <div className="relative group flex-1 z-[100]" ref={searchRef}>
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 pointer-events-none text-muted group-focus-within:text-cyan-400" 
            size={20} 
          />
          <input 
            ref={inputRef}
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search wellness activities, music, jokes..."
            className="w-full h-12 sm:h-14 bg-card/90 text-primary-text placeholder:text-muted/70 border border-border/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl pl-12 pr-10 text-sm font-medium focus:outline-none transition-all dark:bg-[#101735]/90"
          />

          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-primary-text rounded-lg hover:bg-white/10 transition-colors z-10"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

          {isSearchOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] max-h-[75vh] sm:max-h-[420px] overflow-y-auto z-[100] p-3 space-y-2 text-slate-900">
              {trimmedQuery === '' ? (
                <div>
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-cyan-600 flex items-center gap-1.5">
                      Popular Wellness
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Quick Suggestions</span>
                  </div>
                  <div className="space-y-1">
                    {popularSuggestions.map((item, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3.5 group cursor-pointer ${
                            isSelected 
                              ? 'bg-cyan-50 border border-cyan-300 text-slate-900 shadow-sm' 
                              : 'hover:bg-slate-100 border border-transparent text-slate-800'
                          }`}
                        >
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black truncate text-slate-900 group-hover:text-cyan-700 transition-colors">{item.title}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-2 py-0.5 bg-slate-100 rounded-md">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                <div>
                  <div className="px-3 py-2 border-b border-slate-100 mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-cyan-600 font-bold">
                      Search Results ({filteredResults.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Use ↑ ↓ to navigate, Enter to select</span>
                  </div>
                  <div className="space-y-1">
                    {filteredResults.map((item, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={`${item.category}-${item.id}-${idx}`}
                          onClick={() => handleSelectResult(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3.5 group cursor-pointer ${
                            isSelected 
                              ? 'bg-cyan-50 border border-cyan-300 text-slate-900 shadow-sm' 
                              : 'hover:bg-slate-100 border border-transparent text-slate-800'
                          }`}
                        >
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black truncate text-slate-900 group-hover:text-cyan-700 transition-colors">{item.title}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-2 py-0.5 bg-slate-100 rounded-md">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto border border-cyan-100">
                    <Search size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">No matching wellness resources found.</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      We couldn't find anything matching: <span className="font-bold text-slate-800">"{searchQuery}"</span>
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Meditation', 'Breathing', 'Yoga', 'Music', 'Mind Gym', 'Smile Break', 'Stress', 'Sleep'].map(term => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            setIsSearchOpen(true);
                            inputRef.current?.focus();
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-cyan-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-2xl text-muted whitespace-nowrap">
          <Calendar size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">{format(today, 'EEEE, MMM do')}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="flex flex-col items-end hidden sm:flex">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Wellness Level</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">LVL {userData.profile.level}</span>
            <div className="w-32 h-2 bg-primary-text/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-neon shadow-glow-primary transition-all duration-1000"
                style={{ width: `${Math.min(100, (userData.profile.xp / (userData.profile.level * 100)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <button onClick={toggleTheme} className="p-3 bg-card hover:bg-primary-text/10 rounded-2xl border border-border transition-all text-muted hover:text-primary-text">
          {actualTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <div className="relative" ref={notificationRef}>
          <button 
            type="button"
            onClick={() => setIsNotificationOpen(prev => !prev)} 
            className="relative p-3 bg-card hover:bg-primary-text/10 rounded-2xl border border-border transition-all text-primary-text cursor-pointer"
            aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
          >
            <Bell size={22} className="text-primary-text" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-text animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-slate-900 tracking-tight">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-100 border border-cyan-200 text-cyan-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      type="button"
                      onClick={() => markAllNotificationsRead()}
                      className="text-[10px] font-bold text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      Mark all read
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-1.5 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                    aria-label="Close notifications"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2 scrollbar-hide bg-white">
                {(userData.notifications || []).length > 0 ? (
                  userData.notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={cn(
                        "p-3 rounded-2xl flex items-start gap-3 transition-all relative group my-1",
                        !notif.read ? "bg-cyan-50/50 border border-cyan-100" : "opacity-75 hover:opacity-100 hover:bg-slate-50"
                      )}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        {notif.type === 'achievement' ? '🏆' : notif.type === 'streak' ? '🔥' : notif.type === 'goal' ? '🎯' : '🔔'}
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-black text-slate-900 truncate">{notif.title}</h5>
                          <span className="text-[9px] font-bold text-slate-400 shrink-0">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-snug">{notif.message}</p>
                      </div>

                      <div className="absolute right-2 top-2 flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete notification"
                          title="Delete notification"
                        >
                          <X size={14} />
                        </button>
                        {!notif.read && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationRead(notif.id);
                            }}
                            className="p-1 text-cyan-500 hover:bg-cyan-100/50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Mark as read"
                            title="Mark as read"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center px-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                      <Bell size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Silence is golden ✨</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">You're all caught up with your updates.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <Link 
                  to="/notifications" 
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-[11px] font-bold text-cyan-600 hover:underline"
                >
                  View All Notifications →
                </Link>
                {(userData.notifications || []).length > 0 && (
                  <button 
                    type="button"
                    onClick={() => clearNotifications()}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <Link to="/profile" className="flex items-center gap-4 p-2 pl-4 pr-3 bg-card hover:bg-primary-text/10 rounded-2xl border border-border transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black tracking-tight">{userData.profile.name}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter italic">Mood Mentor</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform overflow-hidden p-0.5">
            <div className="w-full h-full bg-background rounded-[10px] overflow-hidden">
              <AvatarImage src={avatarData.image} alt={avatarData.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

