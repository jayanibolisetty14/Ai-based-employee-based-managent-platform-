import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  RefreshCw, 
  Heart, 
  Globe, 
  LayoutGrid, 
  
  Eye, 
  Trash2, 
  History, 
  Check, 
  Zap,
  Bookmark
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { useWellness } from '@/context/WellnessContext';
import { JOKES, Joke } from '@/data/jokes';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
];

const CATEGORIES = [
  { id: 'All', label: '😂 All', icon: '😂' },
  { id: 'coding', label: '💻 Coding', icon: '💻' },
  { id: 'college', label: '🎓 College', icon: '🎓' },
  { id: 'technology', label: '📱 Tech', icon: '📱' },
  { id: 'daily-life', label: '🏠 Daily Life', icon: '🏠' },
  { id: 'friendship', label: '👯 Friends', icon: '👯' },
  { id: 'family', label: '👪 Family', icon: '👪' },
  { id: 'food', label: '🍱 Food', icon: '🍱' },
  { id: 'sleep', label: '😴 Sleep', icon: '😴' },
  { id: 'exam', label: '📝 Exams', icon: '📝' },
  { id: 'AI', label: '🤖 AI', icon: '🤖' },
  { id: 'work', label: '🏢 Work', icon: '🏢' },
  { id: 'one-liner', label: '⚡ One-Liners', icon: '⚡' },
  { id: 'wordplay', label: '🧠 Wordplay', icon: '🧠' },
  { id: 'silly', label: '🤪 Silly', icon: '🤪' }
];

export default function SmileBreak() {
  const { userData, updateSmileBreakStats, updateLanguage, toggleJokeFavorite, logJokeView } = useWellness();
  const stats = userData.smileBreakStats;
  const recentMood = userData.moodHistory.length > 0 ? userData.moodHistory[0].mood : null;

  const [language, setLanguage] = useState<string>(userData.languagePreference || stats.mostUsedLanguage || 'en');
  const [category, setCategory] = useState<string>(stats.mostUsedCategory || 'All');
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [isPunchlineRevealed, setIsPunchlineRevealed] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'joke' | 'saved' | 'history'>('joke');
  const [seenJokeIds, setSeenJokeIds] = useState<string[]>([]);
  const [savedPunchlineRevealed, setSavedPunchlineRevealed] = useState<Record<string, boolean>>({});

  // Mood filter mapping helper
  const moodToFilter = (mood: string | null) => {
    if (!mood) return ['happy', 'calm', 'neutral'];
    const m = mood.toLowerCase();
    switch (m) {
      case 'excellent':
      case 'happy':
      case 'excited':
      case 'great':
        return ['happy', 'energetic', 'neutral'];
      case 'good':
      case 'calm':
        return ['calm', 'happy', 'neutral'];
      case 'okay':
      case 'tired':
        return ['tired', 'bored', 'calm', 'neutral'];
      case 'bored':
        return ['bored', 'happy', 'silly'];
      case 'stressed':
      case 'anxious':
      case 'frustrated':
        return ['stressed', 'anxious', 'frustrated', 'calm'];
      case 'sad':
      case 'lonely':
      case 'low':
        return ['low', 'sad', 'lonely', 'happy'];
      default:
        return ['neutral', 'happy'];
    }
  };

  const getNextJoke = (targetLang?: string, targetCat?: string) => {
    setIsTransitioning(true);
    setIsPunchlineRevealed(false);

    const langToUse = targetLang || language;
    const catToUse = targetCat !== undefined ? targetCat : category;

    setTimeout(() => {
      let pool = JOKES.filter(j => j.language === langToUse);

      // Category filter
      if (catToUse !== 'All') {
        const catFiltered = pool.filter(j => j.category === catToUse);
        if (catFiltered.length > 0) {
          pool = catFiltered;
        }
      }

      // Mood filter preference - only if not explicitly picking a category other than All
      if (catToUse === 'All' || catToUse === 'Random') {
        const allowedMoods = moodToFilter(recentMood);
        const moodPool = pool.filter(j => j.moodTags && j.moodTags.some(m => allowedMoods.includes(m)));
        if (moodPool.length > 0) {
          pool = moodPool;
        }
      }

      // Exclude recent seen jokes in session
      let candidateList = pool.filter(j => !seenJokeIds.includes(j.id));
      
      // Also avoid immediate history from global stats
      const globalHistoryIds = (stats.history || []).map(h => h.jokeId);
      candidateList = candidateList.filter(j => !globalHistoryIds.slice(0, 10).includes(j.id));

      if (currentJoke && candidateList.length > 1) {
        candidateList = candidateList.filter(j => j.id !== currentJoke.id);
      }

      // Cycle reset if all pool jokes have been seen
      if (candidateList.length === 0) {
        candidateList = pool;
        setSeenJokeIds([]);
      }

      // Absolute fallback
      if (candidateList.length === 0) {
        candidateList = JOKES.filter(j => j.language === 'en');
      }

      const selected = candidateList[Math.floor(Math.random() * candidateList.length)];
      setCurrentJoke(selected);
      if (selected) {
        setSeenJokeIds(prev => [...prev, selected.id]);
        logJokeView(selected.id, langToUse, selected.category, recentMood || undefined);
        
        // Award XP only if daily cap not reached
        const today = new Date().toDateString();
        const isNewDay = stats.lastSmileBreakDate !== today;
        const currentDailyXp = isNewDay ? 0 : stats.dailyXp;
        
        if (currentDailyXp < 30) {
          updateSmileBreakStats({ lastSmileBreakDate: today });
        }
      }

      setIsTransitioning(false);
    }, 350);
  };

  // Initial joke load
  useEffect(() => {
    if (!currentJoke) {
      getNextJoke();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    updateLanguage(newLang as any);
    getNextJoke(newLang, category);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    getNextJoke(language, newCat);
  };

  const handleToggleFavorite = (jokeId?: string) => {
    const idToToggle = jokeId || (currentJoke ? currentJoke.id : null);
    if (!idToToggle) return;

    const isLiked = stats.favoriteJokes.includes(idToToggle);
    toggleJokeFavorite(idToToggle);

    if (!isLiked) {
      const today = new Date().toDateString();
      const isNewDay = stats.lastSmileBreakDate !== today;
      const currentDailyXp = isNewDay ? 0 : stats.dailyXp;
      
      if (currentDailyXp < 30) {
        updateSmileBreakStats({ lastSmileBreakDate: today });
      }
    }
  };

  const handleDailySmileBreak = () => {
    const today = new Date().toDateString();
    if (stats.lastSmileBreakDate !== today || stats.smileBreaksCompleted === 0) {
      updateSmileBreakStats({
        smileBreaksCompleted: stats.smileBreaksCompleted + 1,
        lastSmileBreakDate: today
      });
    }
  };

  const savedJokesList = JOKES.filter(j => stats.favoriteJokes.includes(j.id));
  const isCurrentLiked = currentJoke ? stats.favoriteJokes.includes(currentJoke.id) : false;
  const isDailyCompletedToday = stats.lastSmileBreakDate === new Date().toDateString() && stats.smileBreaksCompleted > 0;

  return (
    <div className="space-y-6 pb-24 text-primary-text">
      {/* Top Navigation */}
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      {/* Header Banner */}
      <GlassCard className="bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-purple-500/10 border-yellow-500/30 relative overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 flex items-center justify-center text-3xl shadow-glow-primary shrink-0">
              😂
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">Smile Break</h1>
              <p className="text-xs sm:text-sm font-bold text-yellow-300/90">Here's something light to make you smile.</p>
              {recentMood ? (
                <div className="mt-2 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold text-yellow-200">
                  <span>Based on your latest mood:</span>
                  <span className="text-white underline decoration-yellow-400 font-extrabold">{recentMood}</span>
                </div>
              ) : (
                <p className="text-xs text-white/50 mt-1 font-medium">Check in your mood on the Dashboard for tailored humor!</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-2xl border border-white/10 text-xs font-bold text-white">
              <Globe size={16} className="text-cyan-400 ml-1" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white border-none focus:ring-0 outline-none pr-3 cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-[#080d26] text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Break Button */}
            <Button
              onClick={handleDailySmileBreak}
              variant="primary"
              disabled={isDailyCompletedToday}
              className={`h-11 px-5 rounded-2xl text-xs font-black shadow-glow-primary transition-all ${
                isDailyCompletedToday 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default' 
                  : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black'
              }`}
            >
              {isDailyCompletedToday ? (
                <>
                  <Check size={16} className="mr-1.5 text-emerald-400" /> Daily Break Completed (+10 XP)
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-1.5" /> Complete Daily Break (+10 XP)
                </>
              )}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('joke')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'joke'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-primary'
              : 'text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <Smile size={16} /> Smile Break
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-glow-primary'
              : 'text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <Heart size={16} className={stats.favoriteJokes.length > 0 ? 'fill-pink-400 text-pink-400' : ''} />
          Saved Jokes ({stats.favoriteJokes.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-glow-primary'
              : 'text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          <History size={16} /> Recent History
        </button>
      </div>

      {/* MAIN TAB: JOKE DISPLAY */}
      {activeTab === 'joke' && (
        <>
          {/* Category Pills */}
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid size={16} className="text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-cyan-500 text-black shadow-glow-primary font-black scale-105'
                      : 'bg-black/30 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* JOKE DISPLAY CARD */}
          <GlassCard className="p-8 sm:p-12 text-center relative border-cyan-500/20 bg-gradient-to-b from-card/90 via-card/95 to-[#04081c]">
            <AnimatePresence mode="wait">
              {!isTransitioning && currentJoke ? (
                <motion.div
                  key={currentJoke.id}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.04, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 max-w-3xl mx-auto"
                >
                  {/* Badge & Emoji */}
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="text-5xl sm:text-6xl animate-bounce">{currentJoke.emoji || '😂'}</div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-black uppercase tracking-widest text-cyan-300">
                      <span>{currentJoke.category}</span>
                    </div>
                  </div>

                  {/* SETUP */}
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-relaxed tracking-tight">
                      "{currentJoke.setup}"
                    </h2>
                  </div>

                  {/* REVEAL PUNCHLINE AREA */}
                  <div className="pt-4">
                    {!isPunchlineRevealed ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsPunchlineRevealed(true)}
                        className="w-full max-w-md mx-auto py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-yellow-500/20 border border-cyan-500/40 text-cyan-300 font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg hover:border-cyan-400 hover:text-white transition-all cursor-pointer group"
                      >
                        <Eye size={18} className="group-hover:animate-bounce text-cyan-400" />
                        <span>Tap to reveal the punchline 👀</span>
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-purple-950/40 border border-cyan-500/50 text-center shadow-glow-primary relative overflow-hidden"
                      >
                        <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 mb-2">Punchline</div>
                        <p className="text-2xl sm:text-3xl font-black text-yellow-300 leading-snug">
                          {currentJoke.punchline}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : !isTransitioning && !currentJoke ? (
                <div className="py-12 space-y-4">
                  <p className="text-lg font-bold text-white/80">Couldn't find a joke in this category right now.</p>
                  <Button variant="primary" onClick={() => handleCategoryChange('All')} className="h-10 px-6 rounded-xl">
                    Show All Categories
                  </Button>
                </div>
              ) : (
                <div className="h-[220px] flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="text-cyan-400" size={36} />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={!currentJoke}
                onClick={() => handleToggleFavorite()}
                className={`h-13 px-7 rounded-2xl text-sm font-bold transition-all ${
                  isCurrentLiked 
                    ? 'border-pink-500/60 bg-pink-500/20 text-pink-300 shadow-glow-primary' 
                    : 'border-white/10 hover:bg-white/5 text-white/80'
                }`}
              >
                <Heart size={18} className={`mr-2 ${isCurrentLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
                {isCurrentLiked ? 'Saved' : 'Save Joke'}
              </Button>

              <Button
                variant="primary"
                onClick={() => getNextJoke()}
                className="h-13 px-8 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-sm shadow-glow-primary transition-all"
              >
                <RefreshCw size={18} className="mr-2" /> Another Joke
              </Button>
            </div>
          </GlassCard>
        </>
      )}

      {/* TAB 2: SAVED JOKES */}
      {activeTab === 'saved' && (
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Heart size={20} className="text-pink-400 fill-pink-400" /> Saved Jokes
              </h2>
              <p className="text-xs text-muted font-medium mt-1">Your personal collection of laughter.</p>
            </div>
            <span className="text-xs font-black px-3 py-1 bg-pink-500/20 border border-pink-500/40 text-pink-300 rounded-full">
              {savedJokesList.length} Jokes
            </span>
          </div>

          {savedJokesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJokesList.map(j => {
                const isRevealed = savedPunchlineRevealed[j.id];
                return (
                  <div 
                    key={j.id} 
                    className="p-5 rounded-2xl bg-card/80 border border-white/10 flex flex-col justify-between gap-4 hover:border-pink-500/30 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                          {j.emoji || '😂'} {j.category}
                        </span>
                        <button
                          onClick={() => handleToggleFavorite(j.id)}
                          className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>

                      <p className="text-sm font-bold text-white leading-relaxed">
                        "{j.setup}"
                      </p>

                      {isRevealed ? (
                        <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-yellow-300 text-sm font-black text-center animate-fadeIn">
                          {j.punchline}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSavedPunchlineRevealed(prev => ({ ...prev, [j.id]: true }))}
                          className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
                        >
                          Show Punchline 👀
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-4">
              <Bookmark size={40} className="mx-auto text-white/20" />
              <p className="text-base font-bold text-white/70">No saved jokes yet!</p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Whenever you read a joke you love, click the <span className="text-pink-400 font-bold">Save Joke</span> button to keep it here.
              </p>
              <Button variant="primary" onClick={() => setActiveTab('joke')} className="h-10 px-6 rounded-xl">
                Browse Jokes Now
              </Button>
            </div>
          )}
        </GlassCard>
      )}

      {/* TAB 3: RECENT HISTORY */}
      {activeTab === 'history' && (
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <History size={20} className="text-yellow-400" /> Recent Smile Breaks
              </h2>
              <p className="text-xs text-muted font-medium mt-1">Tracks your recent interactions to avoid joke repeats.</p>
            </div>
            <span className="text-xs font-black px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-full">
              {(stats.history || []).length} Records
            </span>
          </div>

          {(stats.history || []).length > 0 ? (
            <div className="space-y-3">
              {(stats.history || []).map((h) => {
                const matchedJoke = JOKES.find(j => j.id === h.jokeId);
                return (
                  <div 
                    key={h.id}
                    className="p-4 rounded-xl bg-card/60 border border-white/5 flex items-center justify-between text-xs font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{matchedJoke?.emoji || '😂'}</span>
                      <div>
                        <p className="font-bold text-white text-sm">
                          {matchedJoke?.setup ? `"${matchedJoke.setup.substring(0, 50)}..."` : 'Joke Interaction'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted">
                          <span className="text-cyan-400 font-bold uppercase">{h.category}</span>
                          <span>•</span>
                          <span className="uppercase font-bold">{h.language}</span>
                          {h.moodContext && (
                            <>
                              <span>•</span>
                              <span className="text-yellow-300 font-bold">Mood: {h.moodContext}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted text-sm font-medium">
              No recent history logged yet.
            </div>
          )}
        </GlassCard>
      )}

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="text-center p-5">
          <div className="text-3xl font-black text-yellow-400 mb-1">{stats.smileBreaksCompleted}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Daily Breaks</div>
        </GlassCard>
        <GlassCard className="text-center p-5">
          <div className="text-3xl font-black text-cyan-400 mb-1">{stats.jokesViewed}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Jokes Viewed</div>
        </GlassCard>
        <GlassCard className="text-center p-5">
          <div className="text-3xl font-black text-pink-400 mb-1">{stats.favoriteJokes.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Favorites Saved</div>
        </GlassCard>
        <GlassCard className="text-center p-5">
          <div className="text-3xl font-black text-purple-400 mb-1">{(stats.usedLanguages || ['en']).length}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Languages Used</div>
        </GlassCard>
      </div>
    </div>
  );
}
