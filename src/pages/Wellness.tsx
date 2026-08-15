import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Zap,
  Search,
  Heart,
  Activity as ActivityIcon,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { useWellness } from '@/context/WellnessContext';
import { cn } from '@/lib/utils';
import { WellnessActivity } from '@/types';
import { generateRecommendations } from '@/lib/recommendationEngine';

const CATEGORIES = [
  'All',
  'Meditation',
  'Breathing',
  'Yoga',
  'Stretching',
  'Focus',
  'Relaxation',
  'Sleep',
  'Energy',
  'Stress Relief'
];

const NEED_CARDS = [
  { label: 'Calm my mind', icon: '🧘', category: 'Meditation', desc: 'Settle mental chatter and find inner stillness.' },
  { label: 'Reduce stress', icon: '🫁', category: 'Breathing', desc: 'Slow your breathing and calm your nervous system.' },
  { label: 'Improve focus', icon: '🎯', category: 'Focus', desc: 'Sharpen concentration and eliminate mental fog.' },
  { label: 'Sleep better', icon: '😴', category: 'Sleep', desc: 'Gentle wind-down practices for restorative rest.' },
  { label: 'Increase energy', icon: '⚡', category: 'Energy', desc: 'Revitalize your body and spark morning alertness.' },
  { label: 'Feel happier', icon: '💜', category: 'Meditation', desc: 'Cultivate gratitude, warmth, and inner joy.' },
  { label: 'Control my breathing', icon: '🌬️', category: 'Breathing', desc: 'Box breathing and rhythmic breath control.' },
  { label: 'Stretch my body', icon: '🧘‍♀️', category: 'Stretching', desc: 'Release physical tension and improve mobility.' }
];

export default function Wellness() {
  const { userData, completeActivity, toggleFavorite } = useWellness();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<WellnessActivity | null>(null);
  const [activeSession, setActiveSession] = useState<WellnessActivity | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'favorites' | 'recent' | 'progress'>('catalog');

  const resetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSelectedNeed(null);
    setActiveTab('catalog');
  };

  const isFiltered = activeCategory !== 'All' || searchQuery !== '' || selectedNeed !== null || activeTab !== 'catalog';

  const recommendations = useMemo(() => generateRecommendations(userData), [userData]);
  
  const recommendation = recommendations[0] || { 
    title: 'Box Breathing', 
    description: 'Start with a simple breathing exercise to center yourself.', 
    id: 'breath-1' 
  };
  
  const recommendedActivity = userData.activities.find(a => a.id === (recommendation as any).id) || userData.activities[0];

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return userData.activities.filter(a => {
      // Category AND Filter (if on catalog tab)
      const matchesCat = activeTab !== 'catalog' || activeCategory === 'All' || a.category.toLowerCase() === activeCategory.toLowerCase();
      
      // Need Filter (if on catalog tab)
      const matchesNeed = activeTab !== 'catalog' || !selectedNeed || a.category.toLowerCase() === selectedNeed.toLowerCase() || a.title.toLowerCase().includes(selectedNeed.toLowerCase());

      // Search Filter
      const matchesSearch = !query || 
                            a.title.toLowerCase().includes(query) || 
                            a.description.toLowerCase().includes(query) ||
                            a.category.toLowerCase().includes(query) ||
                            (a.benefits && a.benefits.some(b => b.toLowerCase().includes(query))) ||
                            (a.steps && a.steps.some(s => s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)));

      // Tab Filtering
      let matchesTab = true;
      if (activeTab === 'favorites') matchesTab = !!a.favorite;
      if (activeTab === 'recent') matchesTab = !!a.completed;
      
      return matchesCat && matchesSearch && matchesNeed && matchesTab;
    });
  }, [userData.activities, activeCategory, searchQuery, selectedNeed, activeTab]);

  // Dynamic category counts based on search
  const categoryCounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const counts: Record<string, number> = { 'All': 0 };
    
    userData.activities.forEach(a => {
      const matchesSearch = !query || 
                            a.title.toLowerCase().includes(query) || 
                            a.description.toLowerCase().includes(query) ||
                            a.category.toLowerCase().includes(query) ||
                            (a.benefits && a.benefits.some(b => b.toLowerCase().includes(query)));
      
      if (matchesSearch) {
        counts['All']++;
        counts[a.category] = (counts[a.category] || 0) + 1;
      }
    });
    return counts;
  }, [userData.activities, searchQuery]);

  const displayActivities = filteredActivities;
  
  const recentlyCompleted = userData.activities
    .filter(a => a.completed)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());

  // Progress stats
  const totalCompletedCount = userData.activities.filter(a => a.completed).length;
  const weeklySessions = recentlyCompleted.filter(a => {
    if (!a.completedAt) return false;
    const diff = Date.now() - new Date(a.completedAt).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const totalXP = userData.profile.xp;
  const currentStreak = userData.profile.currentStreak;

  return (
    <div className="space-y-8 pb-24 text-primary-text">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        {isFiltered ? (
          <BackButton label="Back to Wellness Hub" onClick={resetFilters} />
        ) : (
          <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Wellness Activity Center
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">WELLNESS HUB</h2>
          <p className="text-muted font-bold tracking-tight">Small activities for a calmer, healthier mind.</p>
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search breathing, meditation, yoga..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-card/90 border border-border/80 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl pl-12 pr-6 text-sm font-medium focus:outline-none transition-all text-primary-text placeholder:text-muted/70"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0", activeTab === 'catalog' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          Activity Catalog
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0 flex items-center gap-2", activeTab === 'favorites' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          <Heart size={14} /> My Favorites ({userData.activities.filter(a => a.favorite).length})
        </button>
        <button 
          onClick={() => setActiveTab('recent')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0 flex items-center gap-2", activeTab === 'recent' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          <Clock size={14} /> Recently Completed ({userData.activities.filter(a => a.completed).length})
        </button>
        <button 
          onClick={() => setActiveTab('progress')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0 flex items-center gap-2", activeTab === 'progress' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          <ActivityIcon size={14} /> Your Progress
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-12">
          {/* Today's Recommendation Banner */}
          <GlassCard className="p-8 border border-primary/30 relative overflow-hidden bg-gradient-to-r from-primary/15 via-accent/10 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Today's Wellness Recommendation</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{recommendation.title}</h3>
                <p className="text-sm text-muted font-medium">{recommendation.description}</p>
                {recommendation.why && (
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles size={12} className="text-primary/60" />
                    <p className="text-[10px] font-bold text-primary/60 italic">{recommendation.why}</p>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setSelectedActivity(recommendedActivity)}
                className="h-14 px-8 rounded-2xl bg-primary text-background font-black text-xs uppercase tracking-widest shadow-glow-primary shrink-0"
              >
                <Play size={16} className="mr-2" /> Start Recommended
              </Button>
            </div>
          </GlassCard>

          {/* Personalized "What do you need right now?" */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black tracking-tight mb-1">What do you need right now?</h3>
              <p className="text-xs text-muted font-bold">Select your immediate intention to filter tailored practices.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {NEED_CARDS.map((need, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedNeed(selectedNeed === need.category ? null : need.category);
                    setActiveCategory('All');
                  }}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all flex flex-col justify-between group",
                    selectedNeed === need.category ? "bg-primary/20 border-primary shadow-glow-primary" : "bg-card border-border hover:bg-primary-text/10 hover:border-white/20"
                  )}
                >
                  <span className="text-3xl mb-4 group-hover:scale-110 transition-transform block">{need.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs tracking-tight mb-1">{need.label}</h4>
                    <p className="text-[9px] text-muted line-clamp-2">{need.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-xs font-black uppercase tracking-widest text-muted mr-2 shrink-0">Categories:</span>
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat] || 0;
              // If we are searching and this category has no results, don't show it (unless it's 'All')
              if (cat !== 'All' && count === 0 && searchQuery) return null;
              
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedNeed(null);
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 border flex items-center gap-2",
                    activeCategory === cat ? "bg-primary text-background border-primary shadow-glow-primary" : "bg-card border-border text-muted hover:bg-primary-text/10 hover:text-primary-text"
                  )}
                >
                  {cat} {searchQuery && <span className="opacity-60">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayActivities.map((activity) => (
              <GlassCard key={activity.id} className="p-6 flex flex-col justify-between group border border-border hover:border-primary/40 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform border border-border">
                      {activity.icon}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleFavorite(activity.id)}
                        className={cn("p-2 rounded-xl transition-all", activity.favorite ? "text-accent bg-accent/20" : "text-muted hover:text-primary-text bg-card")}
                      >
                        <Heart size={16} fill={activity.favorite ? 'currentColor' : 'none'} />
                      </button>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">{activity.difficulty}</span>
                        <span className="text-xs font-black">{activity.duration} MIN</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 block">{activity.category}</span>
                  <h4 className="text-lg font-black tracking-tight mb-2">{activity.title}</h4>
                  <p className="text-xs text-muted font-medium mb-4 line-clamp-2">{activity.description}</p>

                  {activity.benefits && activity.benefits.length > 0 && (
                    <div className="space-y-1 mb-6">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted/70">Key Benefits:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activity.benefits.slice(0, 3).map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-card text-[10px] text-muted font-bold">
                            • {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted">
                    <Zap size={14} className="text-accent" /> +{activity.xpReward} XP
                  </div>

                  <div className="flex items-center gap-3">
                    {activity.completed && (
                      <span className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Done
                      </span>
                    )}
                    <Button 
                      onClick={() => setSelectedActivity(activity)}
                      className="h-10 px-5 rounded-xl bg-primary-text/10 hover:bg-primary hover:text-background text-xs font-black uppercase tracking-wider transition-all"
                    >
                      View & Start
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {displayActivities.length === 0 && (
            <div className="text-center py-20 space-y-6">
              <div className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center mx-auto border border-border shadow-lg">
                <Search size={32} className="text-muted/50" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight">No activities found</h4>
                <p className="text-sm text-muted font-medium max-w-xs mx-auto">Try a different search term or category filter.</p>
              </div>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchQuery('')}
                  className="rounded-xl border-white/10"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight">My Favorite Activities</h3>
            {searchQuery && <p className="text-xs text-muted font-bold tracking-tight">Filtering by: "{searchQuery}"</p>}
          </div>
          {displayActivities.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto border border-border">
                {searchQuery ? <Search size={32} className="text-muted/50" /> : <Heart size={32} className="text-muted" />}
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">{searchQuery ? 'No matching favorites' : 'No favorites saved yet'}</h4>
                <p className="text-xs text-muted">{searchQuery ? 'Try a different search term.' : 'Click the heart icon on any activity card to save it to your favorites.'}</p>
              </div>
              {searchQuery && (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="rounded-xl">
                  Clear Search
                </Button>
              )}
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayActivities.map(activity => (
                <GlassCard key={activity.id} className="p-6 flex flex-col justify-between group border border-border">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-3xl border border-border">
                        {activity.icon}
                      </div>
                      <button onClick={() => toggleFavorite(activity.id)} className="p-2 rounded-xl text-accent bg-accent/20">
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 block">{activity.category}</span>
                    <h4 className="text-lg font-black tracking-tight mb-2">{activity.title}</h4>
                    <p className="text-xs text-muted font-medium mb-4">{activity.description}</p>
                  </div>
                  <Button onClick={() => setSelectedActivity(activity)} className="w-full h-10 rounded-xl bg-primary text-background font-black text-xs uppercase tracking-wider">
                    Start Activity
                  </Button>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight">Recently Completed</h3>
            {searchQuery && <p className="text-xs text-muted font-bold tracking-tight">Filtering by: "{searchQuery}"</p>}
          </div>
          {displayActivities.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto border border-border">
                {searchQuery ? <Search size={32} className="text-muted/50" /> : <Clock size={32} className="text-muted" />}
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">{searchQuery ? 'No matching history' : 'No wellness activities completed yet'}</h4>
                <p className="text-xs text-muted">{searchQuery ? 'Try a different search term.' : 'Complete an activity to see your history here.'}</p>
              </div>
              {searchQuery && (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="rounded-xl">
                  Clear Search
                </Button>
              )}
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {displayActivities.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()).map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl text-primary">
                      {activity.icon}
                    </div>
                    <div>
                      <h4 className="font-bold tracking-tight">{activity.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                        Completed {activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'recently'} • {activity.duration} min • +{activity.xpReward} XP
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="text-primary" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-black tracking-tight">Your Wellness Progress</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-primary">{totalCompletedCount}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Sessions</p>
            </GlassCard>
            <GlassCard className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-accent">{weeklySessions}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Weekly Sessions</p>
            </GlassCard>
            <GlassCard className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-yellow-400">{currentStreak}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Current Streak (Days)</p>
            </GlassCard>
            <GlassCard className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-green-400">{totalXP}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Mind XP</p>
            </GlassCard>
          </div>


        </div>
      )}

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-3xl bg-background/80 overflow-y-auto"
          >
            <GlassCard className="w-full max-w-2xl p-6 sm:p-10 relative space-y-8 border border-primary/30 shadow-2xl my-auto">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 p-3 bg-card hover:bg-primary-text/10 rounded-full text-primary-text transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-4xl border border-primary/30 shadow-glow-primary shrink-0">
                  {selectedActivity.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                    {selectedActivity.category} • {selectedActivity.difficulty} • {selectedActivity.duration} min
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{selectedActivity.title}</h3>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed">{selectedActivity.description}</p>

              {selectedActivity.benefits && selectedActivity.benefits.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-accent">Benefits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedActivity.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border text-xs font-bold">
                        <CheckCircle2 size={16} className="text-primary shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedActivity.steps && selectedActivity.steps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary">How To Do It (Step-by-Step)</h4>
                  <div className="space-y-3">
                    {selectedActivity.steps.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-card border border-border flex items-start gap-4">
                        <span className="w-7 h-7 rounded-xl bg-primary/20 text-primary font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="font-bold text-sm text-primary-text mb-1">{step.title}</h5>
                          <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}



              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border">
                <Button 
                  onClick={() => {
                    const act = selectedActivity;
                    setSelectedActivity(null);
                    setActiveSession(act);
                  }}
                  className="w-full sm:flex-1 h-14 bg-primary text-background font-black text-xs uppercase tracking-widest rounded-2xl shadow-glow-primary hover:opacity-90 transition-all"
                >
                  <Play size={18} className="mr-2" /> Start Guided Session (+{selectedActivity.xpReward} XP)
                </Button>
                <button
                  onClick={() => toggleFavorite(selectedActivity.id)}
                  className="w-full sm:w-auto px-6 h-14 rounded-2xl bg-card hover:bg-primary-text/10 border border-border font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Heart size={16} fill={selectedActivity.favorite ? 'currentColor' : 'none'} className={selectedActivity.favorite ? 'text-accent' : ''} />
                  {selectedActivity.favorite ? 'Favorited' : 'Save'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Session Modal with Functional Timer / Breathing Visual */}
      <AnimatePresence>
        {activeSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-background/90"
          >
            <ActiveSessionPlayer 
              activity={activeSession} 
              onClose={() => setActiveSession(null)} 
              onComplete={(id) => {
                completeActivity(id);
                setActiveSession(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActiveSessionPlayer({ activity, onClose, onComplete }: { activity: WellnessActivity; onClose: () => void; onComplete: (id: string) => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(activity.duration * 60);
  const [completed, setCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Breathing phase simulation if breathing category
  const isBreathing = activity.category.toLowerCase().includes('breathing');
  const [bPhase, setBPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [bCount, setBCount] = useState(4);

  useEffect(() => {
    if (!isPlaying || completed || showExitConfirm) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setCompleted(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, completed, showExitConfirm]);

  // Breathing circle timer
  useEffect(() => {
    if (!isBreathing || !isPlaying || completed || showExitConfirm) return;
    const bInterval = setInterval(() => {
      setBCount(prev => {
        if (prev <= 1) {
          if (bPhase === 'Inhale') { setBPhase('Hold'); return 4; }
          if (bPhase === 'Hold') { setBPhase('Exhale'); return 4; }
          if (bPhase === 'Exhale') { setBPhase('Hold (Empty)'); return 4; }
          if (bPhase === 'Hold (Empty)') { setBPhase('Inhale'); return 4; }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(bInterval);
  }, [isBreathing, isPlaying, completed, bPhase, showExitConfirm]);

  const handleExitClick = () => {
    if (!completed && secondsLeft < activity.duration * 60 - 5) {
      setIsPlaying(false);
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <GlassCard className="w-full max-w-lg p-8 sm:p-12 text-center relative space-y-8 border border-primary/30 shadow-2xl">
      {/* Top bar with Exit Session button */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <button
          type="button"
          onClick={handleExitClick}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card hover:bg-primary-text/10 border border-border text-xs font-bold text-muted hover:text-primary-text transition-all"
        >
          <X size={14} /> Exit Session
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{activity.category}</span>
      </div>

      <div>
        <h3 className="text-3xl font-black tracking-tight mb-2">{activity.title}</h3>
        <p className="text-xs text-muted font-bold">{activity.description}</p>
      </div>

      {!completed ? (
        <div className="space-y-10 py-6">
          {isBreathing ? (
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full transition-all duration-1000 blur-2xl opacity-40",
                bPhase === 'Inhale' ? 'scale-125 bg-primary' : bPhase === 'Exhale' ? 'scale-75 bg-accent' : 'scale-100 bg-secondary'
              )} />
              <div className="relative w-48 h-48 rounded-full border-2 border-primary/40 bg-card flex flex-col items-center justify-center shadow-glow-primary">
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">{bPhase}</p>
                <p className="text-5xl font-black tracking-tight">{bCount}</p>
              </div>
            </div>
          ) : (
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-card rounded-full border border-border shadow-glow-primary">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="relative z-10">
                <p className="text-5xl font-black tracking-tight mb-1">{formatTime(secondsLeft)}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Remaining</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => {
                setSecondsLeft(activity.duration * 60);
                setCompleted(false);
                setIsPlaying(true);
              }}
              className="p-4 rounded-2xl bg-card hover:bg-primary-text/10 text-muted hover:text-primary-text transition-colors"
              title="Restart"
            >
              <RotateCcw size={20} />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-primary text-background flex items-center justify-center shadow-glow-primary hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-8">
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto shadow-glow-primary animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <div>
            <h4 className="text-2xl font-black tracking-tight mb-1">Session Completed!</h4>
            <p className="text-xs text-muted font-bold">Earned +{activity.xpReward} Mind XP & updated your wellness streak.</p>
          </div>
          <Button 
            onClick={() => onComplete(activity.id)}
            className="w-full h-14 bg-primary text-background font-black text-xs uppercase tracking-widest rounded-2xl shadow-glow-primary"
          >
            Collect Reward & Finish
          </Button>
        </div>
      )}

      {/* Confirmation Exit Modal */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-primary-text mb-1">Exit this {activity.category.toLowerCase()} session?</h4>
            <p className="text-xs text-muted max-w-xs mx-auto">Your progress for this session won't be saved if you leave now.</p>
          </div>
          <div className="flex items-center gap-3 w-full max-w-xs">
            <Button
              variant="outline"
              onClick={() => {
                setShowExitConfirm(false);
                setIsPlaying(true);
              }}
              className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Continue
            </Button>
            <Button
              onClick={() => {
                setShowExitConfirm(false);
                onClose();
              }}
              className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest"
            >
              Exit
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
