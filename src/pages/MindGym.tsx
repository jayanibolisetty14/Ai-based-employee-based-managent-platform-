import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Trophy, 
  Brain, 
  Sparkles,
  Zap,
  ChevronRight,
  Target,
  Clock,
  Star,
  Activity,
  X,
  Play,
  Flame as FlameIcon,
  AlertTriangle,
  Search,
  CheckCircle2,
  History,
  Award,
  Layers
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { useWellness } from '@/context/WellnessContext';
import { cn } from '@/lib/utils';
import { MindGymSession } from '@/types';

// Import Games
import { MemoryMatch } from '@/components/mind-gym/MemoryMatch';
import { FocusTap } from '@/components/mind-gym/FocusTap';
import { BreathingRhythm } from '@/components/mind-gym/BreathingRhythm';
import { PatternMemory } from '@/components/mind-gym/PatternMemory';
import { QuickMath } from '@/components/mind-gym/QuickMath';
import { WordFocus } from '@/components/mind-gym/WordFocus';
import { CalmColor } from '@/components/mind-gym/CalmColor';
import { EmotionPuzzle } from '@/components/mind-gym/EmotionPuzzle';

interface GameDefinition {
  id: string;
  title: string;
  category: 'Focus & Speed' | 'Memory & Logic' | 'Calm & Regulation' | 'Emotional EQ';
  domain: string;
  duration: string;
  description: string;
  benefit: string;
  icon: any;
  color: string;
  bg: string;
  component: React.ComponentType<any>;
}

const GAMES: GameDefinition[] = [
  { 
    id: 'memory-match', 
    title: 'Memory Match', 
    category: 'Memory & Logic',
    domain: 'Working Memory',
    duration: '1-2 min',
    description: 'Enhance focus and spatial recall by matching emotional and mindfulness symbols.', 
    benefit: 'Strengthens hippocampus neural pathways and working memory capacity.',
    icon: Brain, 
    color: 'text-primary', 
    bg: 'bg-primary/10', 
    component: MemoryMatch 
  },
  { 
    id: 'focus-tap', 
    title: 'Focus Tap', 
    category: 'Focus & Speed',
    domain: 'Reaction Speed',
    duration: '30 sec',
    description: 'Tap moving targets rapidly to sharpen your hand-eye coordination and alertness.', 
    benefit: 'Activates dopamine pathways and trains quick visual-motor responses.',
    icon: Target, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-400/10', 
    component: FocusTap 
  },
  { 
    id: 'breathing', 
    title: 'Breathing Rhythm', 
    category: 'Calm & Regulation',
    domain: 'Vagus Nerve Regulation',
    duration: '1-2 min',
    description: 'Follow guided rhythmic cycles to downregulate cortisol and settle your nervous system.', 
    benefit: 'Stimulates parasympathetic tone to induce rapid physiological calm.',
    icon: Sparkles, 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-400/10', 
    component: BreathingRhythm 
  },
  { 
    id: 'pattern-memory', 
    title: 'Pattern Memory', 
    category: 'Memory & Logic',
    domain: 'Spatial Sequence Recall',
    duration: '1-2 min',
    description: 'Memorize and reproduce progressively complex sequential tile illumination patterns.', 
    benefit: 'Builds sustained attentional stamina and short-term sequencing skills.',
    icon: Trophy, 
    color: 'text-accent', 
    bg: 'bg-accent/10', 
    component: PatternMemory 
  },
  { 
    id: 'quick-math', 
    title: 'Quick Math', 
    category: 'Memory & Logic',
    domain: 'Numerical Agility',
    duration: '45 sec',
    description: 'Solve fast arithmetic sprints against the clock to activate analytical processing.', 
    benefit: 'Fosters rapid cognitive switching and mental agility under timed focus.',
    icon: Zap, 
    color: 'text-orange-400', 
    bg: 'bg-orange-400/10', 
    component: QuickMath 
  },
  { 
    id: 'word-focus', 
    title: 'Word Focus', 
    category: 'Focus & Speed',
    domain: 'Visual Scanning',
    duration: '1 min',
    description: 'Identify mindfulness and resilience keywords hidden in a dynamic letter grid.', 
    benefit: 'Hones selective visual attention while reinforcing positive vocabulary.',
    icon: Gamepad2, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10', 
    component: WordFocus 
  },
  { 
    id: 'calm-color', 
    title: 'Calm Color', 
    category: 'Calm & Regulation',
    domain: 'Sensory Balance',
    duration: '1 min',
    description: 'Identify matching soothing hue gradients to calm visual overstimulation.', 
    benefit: 'Gently engages occipital cortex while easing mental clutter.',
    icon: Activity, 
    color: 'text-green-400', 
    bg: 'bg-green-400/10', 
    component: CalmColor 
  },
  { 
    id: 'emotion-puzzle', 
    title: 'Emotion Puzzle', 
    category: 'Emotional EQ',
    domain: 'Empathy & Scenarios',
    duration: '1 min',
    description: 'Identify core emotional nuances in realistic human communication scenarios.', 
    benefit: 'Improves affective empathy, perspective-taking, and emotional clarity.',
    icon: Star, 
    color: 'text-highlight', 
    bg: 'bg-highlight/10', 
    component: EmotionPuzzle 
  },
];

const LEVELS = [
  { level: 1, name: 'Beginner', minXp: 0, perk: 'Basic Cognitive Drills', color: 'from-blue-500/20 to-cyan-500/20' },
  { level: 2, name: 'Learner', minXp: 200, perk: '+5% XP Boost & Reaction Drills', color: 'from-cyan-500/20 to-emerald-500/20' },
  { level: 3, name: 'Explorer', minXp: 500, perk: 'Unlocked Deep Flow Puzzles', color: 'from-emerald-500/20 to-amber-500/20' },
  { level: 4, name: 'Focused', minXp: 1000, perk: 'Mastery Challenges & Multipliers', color: 'from-amber-500/20 to-purple-500/20' },
  { level: 5, name: 'Master', minXp: 2000, perk: 'Peak Cognitive Resilience Status', color: 'from-purple-500/20 to-pink-500/20' },
];

export default function MindGym() {
  const { userData, updateMindGymStats } = useWellness();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'games' | 'history'>('games');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'score' | 'popular' | 'alpha'>('recommended');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [gameResult, setGameResult] = useState<{ 
    score: number; 
    xp: number; 
    accuracy?: number; 
    dailyBonus?: boolean;
    difficulty?: string;
  } | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const stats = useMemo(() => userData?.mindGymStats || {
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
    history: []
  }, [userData?.mindGymStats]);

  const totalXP = stats.totalXP ?? 0;
  const bestScore = stats.bestScore ?? 0;
  const gamesCompleted = stats.gamesCompleted ?? 0;
  const currentStreak = stats.currentStreak ?? 0;
  const totalMinutes = stats.totalMinutes ?? 0;
  const historyList = useMemo(() => stats.history || [], [stats.history]);

  // Real accuracy calculation
  const accuracyDisplay = useMemo(() => {
    if (stats.totalAttempts && stats.totalAttempts > 0) {
      return `${Math.round(((stats.totalCorrectAttempts || 0) / stats.totalAttempts) * 100)}%`;
    }
    if (stats.focusAccuracy && stats.focusAccuracy > 0) {
      return `${Math.round(stats.focusAccuracy)}%`;
    }
    return gamesCompleted > 0 ? '100%' : '0%';
  }, [stats.totalAttempts, stats.totalCorrectAttempts, stats.focusAccuracy, gamesCompleted]);

  // Today's Daily Challenge tracking (Play any 2 games)
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyChallenge = useMemo(() => {
    return stats.dailyChallenge?.date === todayStr 
      ? stats.dailyChallenge 
      : { date: todayStr, completedGames: [], claimed: false };
  }, [stats.dailyChallenge, todayStr]);

  const dailyCompletedCount = Math.min(dailyChallenge.completedGames.length, 2);

  // Level Progression
  const currentLevel = useMemo(() => {
    return [...LEVELS].reverse().find(l => totalXP >= l.minXp) || LEVELS[0];
  }, [totalXP]);

  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNext = nextLevel 
    ? Math.min(100, Math.max(0, ((totalXP - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100))
    : 100;
  const xpNeededForNext = nextLevel ? Math.max(0, nextLevel.minXp - totalXP) : 0;

  // Dynamic Mood-Driven Recommendation
  const currentMood = userData?.moodHistory?.[0];
  const moodRecommendation = useMemo(() => {
    const moodName = currentMood?.mood || '';
    const stress = currentMood?.stressLevel || 0;

    if (stress >= 6 || ['Anxious', 'Stressed', 'Overwhelmed', 'Angry'].includes(moodName)) {
      return {
        gameId: 'breathing',
        badge: 'Stress Relief',
        reason: 'Your recent check-in shows elevated stress. Gentle respiratory cycles quickly calm autonomic reactivity.'
      };
    }
    if (['Sad', 'Low', 'Tired', 'Exhausted'].includes(moodName)) {
      return {
        gameId: 'focus-tap',
        badge: 'Energy Boost',
        reason: 'Feeling low energy? Fast tactile reaction taps stimulate dopamine release and heighten alertness.'
      };
    }
    if (['Happy', 'Energized', 'Focused', 'Excited'].includes(moodName)) {
      return {
        gameId: 'pattern-memory',
        badge: 'Peak Flow',
        reason: 'You are in a positive state! Challenge your working memory with complex spatial sequences.'
      };
    }
    // Default: Recommend unplayed daily challenge game or memory match
    const unplayedChallenge = GAMES.find(g => !dailyChallenge.completedGames.includes(g.id));
    return {
      gameId: unplayedChallenge ? unplayedChallenge.id : 'memory-match',
      badge: 'Daily Challenge',
      reason: 'Complete today\'s challenge to earn +50 bonus XP and keep your cognitive streak alive.'
    };
  }, [currentMood, dailyChallenge.completedGames]);

  const recommendedGameObj = useMemo(() => {
    return GAMES.find(g => g.id === moodRecommendation.gameId) || GAMES[0];
  }, [moodRecommendation.gameId]);

  // Categories list
  const categories = ['All', 'Focus & Speed', 'Memory & Logic', 'Calm & Regulation', 'Emotional EQ', 'Daily Goals'];

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      // Category filter
      if (selectedCategory === 'Daily Goals') {
        const isToday = dailyChallenge.completedGames.includes(game.id);
        if (!isToday && dailyChallenge.completedGames.length >= 2) return false;
      } else if (selectedCategory !== 'All' && game.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesCategory = game.category.toLowerCase().includes(q);
        const matchesDomain = game.domain.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesDomain && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recommended') {
        if (a.id === moodRecommendation.gameId) return -1;
        if (b.id === moodRecommendation.gameId) return 1;
        const aPlayedToday = dailyChallenge.completedGames.includes(a.id) ? 1 : 0;
        const bPlayedToday = dailyChallenge.completedGames.includes(b.id) ? 1 : 0;
        return aPlayedToday - bPlayedToday;
      }
      if (sortBy === 'score') {
        const scoreA = stats.bestScoresByGame?.[a.id] || 0;
        const scoreB = stats.bestScoresByGame?.[b.id] || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'popular') {
        const countA = (stats.history || []).filter(h => h.gameId === a.id).length;
        const countB = (stats.history || []).filter(h => h.gameId === b.id).length;
        return countB - countA;
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, moodRecommendation.gameId, dailyChallenge.completedGames, stats.bestScoresByGame, stats.history]);

  const handleGameComplete = (
    score: number, 
    xp: number, 
    details?: {
      score: number;
      xp: number;
      accuracy: number;
      timeTaken: number;
      difficulty: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master';
      correctAttempts?: number;
      totalAttempts?: number;
    }
  ) => {
    const game = GAMES.find(g => g.id === activeGame);
    const sessionTitle = game?.title || activeGame || 'Exercise';

    const previousBestForGame = (activeGame && stats.bestScoresByGame?.[activeGame]) || 0;
    const isNewPB = score > previousBestForGame && score > 0;
    setIsNewHighScore(isNewPB);

    const result = updateMindGymStats(
      { 
        gamesCompleted: gamesCompleted + 1
      }, 
      xp, 
      activeGame || undefined, 
      score,
      details ? {
        title: sessionTitle,
        accuracy: details.accuracy,
        difficulty: details.difficulty,
        timeTaken: details.timeTaken,
        correctAttempts: details.correctAttempts,
        totalAttempts: details.totalAttempts
      } : {
        title: sessionTitle,
        accuracy: 100,
        difficulty: currentLevel.name as any,
        timeTaken: 60
      }
    );

    setGameResult({ 
      score, 
      xp: result.totalXpAwarded || xp,
      accuracy: details?.accuracy,
      dailyBonus: result.dailyBonusClaimed,
      difficulty: details?.difficulty
    });
  };

  const handleExitRequest = () => {
    if (activeGame && !gameResult) {
      setShowExitConfirm(true);
    } else {
      closeGame();
    }
  };

  const closeGame = () => {
    setActiveGame(null);
    setGameResult(null);
    setShowExitConfirm(false);
    setIsNewHighScore(false);
  };

  return (
    <div className="space-y-8 pb-20 text-primary-text max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <Brain className="text-primary" size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">MIND GYM</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                  Interactive
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Level Rank Badge */}
        <div 
          onClick={() => setShowRoadmap(true)}
          className="cursor-pointer group flex items-center gap-4 bg-card/80 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-border hover:border-primary/50 transition-all hover:scale-[1.02]"
        >
          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <span className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Cognitive Tier</span>
              <Award size={12} className="text-primary" />
            </div>
            <p className="text-sm font-black text-primary-text group-hover:text-primary transition-colors">
              Level {currentLevel.level} • {currentLevel.name}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black border border-primary/30 group-hover:scale-105 transition-transform">
            {currentLevel.level}
          </div>
        </div>
      </section>

      {/* Dynamic Mood Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6 border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Sparkles size={24} className="animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Personalized For You
                  </span>
                  <span className="text-xs font-bold text-muted">
                    {currentMood?.mood ? `Current Mood: ${currentMood.mood}` : "Daily Cognitive Boost"}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black text-primary-text">
                  Recommended: <span className="text-cyan-400">{recommendedGameObj.title}</span> ({recommendedGameObj.domain})
                </h3>
                <p className="text-xs text-muted max-w-2xl mt-0.5">
                  {moodRecommendation.reason}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setActiveGame(recommendedGameObj.id)}
              className="bg-cyan-500 hover:bg-cyan-400 text-background font-black text-xs uppercase tracking-widest px-6 py-2.5 h-auto rounded-xl shrink-0 shadow-lg shadow-cyan-500/20"
            >
              <Play size={14} className="mr-1.5" fill="currentColor" />
              Start Recommended
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {[
          { label: 'Mind XP', value: Math.round(totalXP).toLocaleString(), icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Completed', value: gamesCompleted, icon: Trophy, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Streak', value: `${currentStreak}d`, icon: FlameIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Accuracy', value: accuracyDisplay, icon: Target, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Total Time', value: `${totalMinutes}m`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Best Score', value: bestScore.toLocaleString(), icon: Star, color: 'text-highlight', bg: 'bg-highlight/10' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4 flex flex-col items-center text-center hover:border-white/20 transition-all">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-2", stat.bg)}>
              <stat.icon className={stat.color} size={18} />
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="text-lg md:text-xl font-black">{stat.value}</p>
          </GlassCard>
        ))}
      </section>

      {/* Level Progress & Daily Challenge Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black flex items-center gap-2">
                <Activity className="text-primary" size={18} />
                Cognitive Tier Progress
              </h3>
              <button 
                onClick={() => setShowRoadmap(true)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Tier Roadmap</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="h-3.5 w-full bg-card rounded-full overflow-hidden mb-3 p-0.5 border border-border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted font-medium">
              <span>{Math.round(totalXP)} XP earned</span>
              <span>{nextLevel ? `${Math.round(xpNeededForNext)} XP to Level ${nextLevel.level} (${nextLevel.name})` : 'Max Level Master'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
            <span className="text-muted">
              Current Rank Perk: <strong className="text-primary-text">{currentLevel.perk}</strong>
            </span>
            <span className="font-bold text-primary">{Math.round(progressToNext)}% Complete</span>
          </div>
        </GlassCard>

        {/* Daily Challenge Card */}
        <GlassCard className="p-6 border-primary/30 bg-primary/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <Target className="text-primary" size={18} />
                Daily Challenge
              </h3>
              <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                {dailyCompletedCount}/2
              </span>
            </div>
            
            <p className="text-xs text-muted mb-3 font-medium">
              Complete 2 cognitive workouts today to boost mental endurance.
            </p>

            <div className="h-2 w-full bg-card rounded-full overflow-hidden mb-4 border border-border">
              <div 
                className="h-full bg-primary transition-all duration-500 rounded-full" 
                style={{ width: `${(dailyCompletedCount / 2) * 100}%` }} 
              />
            </div>

            {/* List of completed challenge games */}
            <div className="space-y-1.5">
              {dailyChallenge.completedGames.length === 0 ? (
                <p className="text-[11px] text-muted italic">No exercises completed yet today.</p>
              ) : (
                dailyChallenge.completedGames.map(gameId => {
                  const g = GAMES.find(x => x.id === gameId);
                  return (
                    <div key={gameId} className="flex items-center gap-2 text-xs font-bold text-green-400">
                      <CheckCircle2 size={13} />
                      <span>{g?.title || gameId}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-muted">Reward</span>
            <span className={cn(
              "text-xs font-black px-2 py-0.5 rounded-full",
              dailyChallenge.claimed ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
            )}>
              {dailyChallenge.claimed ? "✓ +50 XP Claimed" : "+50 XP Bonus"}
            </span>
          </div>
        </GlassCard>
      </section>

      {/* Main Content Area with View Switcher */}
      <section className="space-y-6">
        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab('games')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === 'games' 
                  ? "bg-primary text-background shadow-md shadow-primary/20" 
                  : "text-muted hover:text-primary-text"
              )}
            >
              <Gamepad2 size={15} />
              <span>Exercise Library ({GAMES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === 'history' 
                  ? "bg-primary text-background shadow-md shadow-primary/20" 
                  : "text-muted hover:text-primary-text"
              )}
            >
              <History size={15} />
              <span>Workout History ({historyList.length})</span>
            </button>
          </div>

          {/* Search & Sort for Games */}
          {activeTab === 'games' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-primary-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary-text"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-primary-text focus:outline-none focus:border-primary"
              >
                <option value="recommended">Smart Sort</option>
                <option value="score">Highest Score</option>
                <option value="popular">Most Played</option>
                <option value="alpha">A-Z Name</option>
              </select>
            </div>
          )}
        </div>

        {/* Category Filters (Games View) */}
        {activeTab === 'games' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const count = cat === 'All' 
                ? GAMES.length 
                : cat === 'Daily Goals' 
                  ? 2 
                  : GAMES.filter(g => g.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border",
                    selectedCategory === cat
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-card/60 border-border text-muted hover:text-primary-text hover:border-white/20"
                  )}
                >
                  <span>{cat}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    selectedCategory === cat ? "bg-primary text-background font-black" : "bg-white/10 text-muted"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Games Grid */}
        {activeTab === 'games' && (
          <div>
            {filteredGames.length === 0 ? (
              <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
                <Brain className="text-muted mb-3" size={36} />
                <h4 className="text-lg font-bold">No exercises found</h4>
                <p className="text-xs text-muted mt-1 max-w-sm">
                  Try adjusting your search query or switching to another category filter.
                </p>
                <Button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  variant="outline" 
                  size="sm" 
                  className="mt-4 text-xs font-bold"
                >
                  Clear Filters
                </Button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredGames.map((game, i) => {
                  const gamePB = stats.bestScoresByGame?.[game.id] || 0;
                  const timesPlayed = (stats.history || []).filter(h => h.gameId === game.id).length;
                  const isDailyCompleted = dailyChallenge.completedGames.includes(game.id);
                  const isRecommended = game.id === moodRecommendation.gameId;

                  return (
                    <motion.div
                      key={game.id}
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <GlassCard 
                        className={cn(
                          "p-6 cursor-pointer transition-all h-full flex flex-col group relative overflow-hidden",
                          isRecommended ? "border-cyan-500/50 hover:border-cyan-400" : "hover:border-primary/50"
                        )}
                        onClick={() => setActiveGame(game.id)}
                      >
                        {/* Recommendation or Daily Tag */}
                        {isRecommended && (
                          <div className="absolute top-0 right-0 bg-cyan-500 text-background text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-xl shadow-md">
                            Recommended
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", game.bg)}>
                            <game.icon className={game.color} size={28} />
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold text-muted bg-card px-2 py-0.5 rounded-md border border-border">
                              {game.duration}
                            </span>
                            {isDailyCompleted && (
                              <span className="text-[9px] font-black text-green-400 flex items-center gap-1 bg-green-500/10 px-1.5 py-0.5 rounded">
                                <CheckCircle2 size={10} /> Done Today
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                            {game.category} • {game.domain}
                          </span>
                          <h4 className="text-xl font-black mt-0.5 group-hover:text-primary transition-colors">
                            {game.title}
                          </h4>
                        </div>

                        <p className="text-xs text-muted font-medium mb-4 line-clamp-2">
                          {game.description}
                        </p>

                        {/* Live Game Stats */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60 mb-4 text-[11px]">
                          <div>
                            <span className="text-muted text-[10px] uppercase font-bold block">Best Score</span>
                            <span className="font-black text-primary-text flex items-center gap-1">
                              {gamePB > 0 ? (
                                <>
                                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                                  {gamePB.toLocaleString()}
                                </>
                              ) : (
                                <span className="text-muted">Unranked</span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted text-[10px] uppercase font-bold block">Sessions</span>
                            <span className="font-bold text-muted">
                              {timesPlayed > 0 ? `${timesPlayed} played` : 'New drill'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <Button 
                            variant="ghost" 
                            className="p-0 hover:bg-transparent h-auto text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                          >
                            <Play size={12} fill="currentColor" />
                            Start Training
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Workout History View */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {historyList.length === 0 ? (
              <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <History size={32} />
                </div>
                <h4 className="text-xl font-black mb-1">No Mind Gym Workouts Yet</h4>
                <p className="text-xs text-muted max-w-sm mb-6">
                  Complete your first cognitive game above to see your detailed training history, accuracy trends, and high scores here.
                </p>
                <Button onClick={() => setActiveTab('games')} className="text-xs font-black uppercase tracking-wider">
                  Browse Exercises
                </Button>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted px-1">
                  <span>Showing recent {historyList.length} completed sessions</span>
                  <span>Accuracy Average: <strong className="text-green-400">{accuracyDisplay}</strong></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {historyList.map((session: MindGymSession) => {
                    const gameObj = GAMES.find(g => g.id === session.gameId);
                    const formattedDate = new Date(session.date).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <GlassCard key={session.id} className="p-5 flex items-center justify-between hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", gameObj?.bg || 'bg-primary/10')}>
                            {gameObj ? <gameObj.icon className={gameObj.color} size={22} /> : <Brain className="text-primary" size={22} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black">{session.title}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-white/5 border border-white/10 text-muted">
                                {session.difficulty || 'Explorer'}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted mt-0.5">{formattedDate}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="font-bold text-primary">Score: {session.score}</span>
                              <span className="text-green-400 font-bold">Accuracy: {session.accuracy}%</span>
                              <span className="text-muted">{session.timeTaken}s duration</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
                            +{session.xpEarned} XP
                          </span>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Tier Roadmap Dialog */}
      <AnimatePresence>
        {showRoadmap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoadmap(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="w-full max-w-xl relative z-10"
            >
              <GlassCard className="p-6 md:p-8 border-primary/30 max-h-[85vh] overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <Layers className="text-primary" size={22} />
                      Cognitive Tier Roadmap
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Progress through tiers as you earn XP in Mind Gym workouts.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowRoadmap(false)}
                    className="text-muted hover:text-primary-text p-1.5 rounded-lg bg-card border border-border"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {LEVELS.map((tier) => {
                    const isUnlocked = totalXP >= tier.minXp;
                    const isCurrent = currentLevel.level === tier.level;

                    return (
                      <div 
                        key={tier.level}
                        className={cn(
                          "p-4 rounded-2xl border transition-all relative overflow-hidden",
                          isCurrent 
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                            : isUnlocked 
                              ? "bg-card border-border" 
                              : "bg-black/30 border-white/5 opacity-60"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                              isCurrent ? "bg-primary text-background" : isUnlocked ? "bg-white/10 text-primary-text" : "bg-white/5 text-muted"
                            )}>
                              {tier.level}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black">{tier.name}</h4>
                                {isCurrent && (
                                  <span className="text-[9px] font-black uppercase tracking-wider bg-primary text-background px-2 py-0.2 rounded-full">
                                    Current Rank
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted mt-0.5">{tier.perk}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-primary-text">{tier.minXp} XP</span>
                            <span className="text-[10px] text-muted block">Threshold</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-end">
                  <Button onClick={() => setShowRoadmap(false)} size="sm" className="text-xs font-bold">
                    Close Roadmap
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Active Game Modal Overlay */}
      <AnimatePresence>
        {activeGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleExitRequest}
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl relative z-10"
            >
              <GlassCard className="p-6 md:p-10 border-primary/20 max-h-[90vh] overflow-y-auto relative">
                {/* Modal Top Bar */}
                <div className="flex items-center justify-end mb-4">
                  <button 
                    onClick={handleExitRequest}
                    className="text-muted hover:text-primary-text transition-colors flex items-center gap-1.5 text-xs font-bold bg-card px-3 py-1.5 rounded-xl border border-border"
                  >
                    <X size={16} /> Exit Game
                  </button>
                </div>

                {!gameResult ? (
                  <>
                    <div className="flex flex-col items-center text-center mb-8">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", GAMES.find(g => g.id === activeGame)?.bg)}>
                        {(() => {
                          const g = GAMES.find(item => item.id === activeGame);
                          if (!g) return <Brain className="text-primary" size={32} />;
                          return <g.icon className={g.color} size={32} />;
                        })()}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-1">
                        {GAMES.find(g => g.id === activeGame)?.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted font-medium max-w-md">
                        {GAMES.find(g => g.id === activeGame)?.description}
                      </p>
                    </div>

                    <div className="py-6 border-y border-border-subtle mb-6">
                      {(() => {
                        const GameComponent = GAMES.find(g => g.id === activeGame)?.component;
                        return GameComponent ? <GameComponent onComplete={handleGameComplete} /> : null;
                      })()}
                    </div>
                    
                    <div className="flex justify-center">
                      <Button variant="ghost" onClick={handleExitRequest} className="text-muted text-xs font-bold">
                        Cancel & Exit
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    {isNewHighScore ? (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-black uppercase tracking-wider"
                      >
                        <Star size={14} className="fill-yellow-400" />
                        🎉 NEW PERSONAL BEST SCORE!
                      </motion.div>
                    ) : null}

                    <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                      <Trophy className="text-green-400" size={40} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-2 text-primary-text">Workout Complete!</h3>
                    <p className="text-xs md:text-sm text-muted font-bold mb-8">Your cognitive neuroplasticity is growing stronger.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
                      <div className="p-3.5 bg-card rounded-2xl border border-border">
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Score</p>
                        <p className="text-xl md:text-2xl font-black text-primary">{gameResult.score}</p>
                      </div>
                      <div className="p-3.5 bg-card rounded-2xl border border-border">
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">XP Earned</p>
                        <p className="text-xl md:text-2xl font-black text-accent">+{gameResult.xp}</p>
                      </div>
                      <div className="p-3.5 bg-card rounded-2xl border border-border col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Accuracy</p>
                        <p className="text-xl md:text-2xl font-black text-green-400">{gameResult.accuracy ?? 100}%</p>
                      </div>
                    </div>

                    {gameResult.dailyBonus && (
                      <div className="mb-6 p-3 bg-primary/10 border border-primary/30 rounded-2xl max-w-md mx-auto text-xs font-black text-primary uppercase tracking-widest flex items-center justify-center gap-2">
                        <Sparkles size={16} /> Daily Challenge Completed! (+50 Bonus XP)
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button size="lg" className="px-8 font-black text-xs uppercase tracking-wider" onClick={() => setGameResult(null)}>
                        Play Again
                      </Button>
                      <Button size="lg" variant="outline" className="px-8 font-black text-xs uppercase tracking-wider" onClick={closeGame}>
                        Back to Mind Gym
                      </Button>
                    </div>
                  </div>
                )}

                {/* Exit Game Confirmation Dialog */}
                {showExitConfirm && (
                  <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <AlertTriangle size={32} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-black text-primary-text mb-1">Exit this game?</h4>
                      <p className="text-xs text-muted max-w-xs mx-auto">Your score and XP for this current attempt won't be saved if you leave now.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full max-w-xs">
                      <Button
                        variant="outline"
                        onClick={() => setShowExitConfirm(false)}
                        className="flex-1 h-11 rounded-xl text-xs font-black uppercase tracking-widest"
                      >
                        Continue Game
                      </Button>
                      <Button
                        onClick={closeGame}
                        className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest"
                      >
                        Exit Game
                      </Button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
