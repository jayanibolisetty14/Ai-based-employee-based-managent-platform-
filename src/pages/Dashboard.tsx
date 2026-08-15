import { 
  Zap, 
  Flame, 
  Target, 
  ArrowUpRight, 
  Bell,
  PlusCircle,
  BarChart3,
  Download,
  Filter,
  ArrowRight,
  Brain,
  Music as MusicIcon,
  Play
} from 'lucide-react';
import { useWellness } from '@/context/WellnessContext';
import { useAuth } from '@/context/AuthContext';
import { useMusic } from '@/context/MusicContext';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { getAvatarByEmojiOrId } from '@/data/avatars';
import { AvatarImage } from '@/components/common/AvatarImage';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { getMentorSummary } from '@/lib/recommendationEngine';

import { getUserRarity, getRarityTheme } from '@/lib/progression';

export default function Dashboard() {
  const { userData } = useWellness();
  const { user } = useAuth();
  const { songs, playSong, currentSong, isPlaying } = useMusic();
  const navigate = useNavigate();
  const { profile, moodHistory, goals } = userData;

  const avatarData = getAvatarByEmojiOrId(profile.avatar);

  const [filterRange, setFilterRange] = useState<'today' | '7days' | '30days' | '90days'>('7days');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const displayName = user?.name || profile.name;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mood_mentor_wellness_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const now = new Date().getTime();
  const rangeDays = filterRange === 'today' ? 1 : filterRange === '7days' ? 7 : filterRange === '30days' ? 30 : 90;
  
  const filteredMoodHistory = moodHistory.filter(m => {
    const diff = now - new Date(m.timestamp).getTime();
    return diff <= rangeDays * 24 * 60 * 60 * 1000;
  });

  const filteredActivities = userData.activities.filter(a => {
    if (!a.completed || !a.completedAt) return false;
    const diff = now - new Date(a.completedAt).getTime();
    return diff <= rangeDays * 24 * 60 * 60 * 1000;
  });

  // Calculate Wellness Progress score based on actual data
  const wellnessScore = moodHistory.length > 0 ? Math.min(Math.round((filteredMoodHistory.length * 15) + (profile.currentStreak * 10) + (filteredActivities.length * 5)), 100) : 0;

  const chartData = filteredMoodHistory.slice(0, 7).reverse().map(m => ({
    name: new Date(m.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: ['Great', 'Happy', 'Excited', 'EXCELLENT', 'GOOD'].includes(m.mood) ? 90 : ['Good', 'Calm', 'OKAY'].includes(m.mood) ? 75 : ['Okay', 'Tired', 'LOW'].includes(m.mood) ? 50 : 25,
    stress: m.stressLevel * 10,
    energy: m.energyLevel * 10
  }));

  const currentRarity = getUserRarity(profile.xp);
  const rarityTheme = getRarityTheme(currentRarity);

  // Dynamic Song Recommendation based on latest user mood & stress
  const predictedSong = useMemo(() => {
    const latest = moodHistory[moodHistory.length - 1];
    const m = latest?.mood || 'Calm';
    const stress = latest?.stressLevel || 3;

    let targetMood = 'Calm';
    if (['Stressed', 'Anxious', 'Frustrated'].includes(m) || stress > 6) targetMood = 'Stressed';
    else if (['Happy', 'Excited', 'EXCELLENT', 'GREAT'].includes(m)) targetMood = 'Happy';
    else if (['Tired', 'LOW'].includes(m)) targetMood = 'Energetic';
    else if (m === 'Sad') targetMood = 'Relaxed';
    else targetMood = 'Meditation';

    const matches = songs.length > 0 ? songs.filter(s => s.mood === targetMood || s.mood === 'Calm') : [];
    if (matches.length > 0) {
      const idx = (moodHistory.length + new Date().getDate()) % matches.length;
      return matches[idx];
    }
    return songs[0] || null;
  }, [moodHistory, songs]);

  const stats = [
    { label: 'Wellness Progress', value: moodHistory.length > 0 ? `${wellnessScore}%` : 'No data yet', icon: Target, color: 'text-primary' },
    { label: 'Current Streak', value: profile.currentStreak > 0 ? `${profile.currentStreak} Days` : '0 Days', icon: Flame, color: 'text-orange-400' },
    { label: 'Wellness Rank', value: `${profile.xp} XP`, icon: Zap, color: rarityTheme.color, badge: currentRarity, badgeTheme: rarityTheme },
    { label: 'Weekly Sessions', value: filteredActivities.length, icon: Bell, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profile')} 
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50 p-1 shrink-0 transition-transform hover:scale-105 cursor-pointer group"
            title="View or Change Avatar in Profile"
          >
            <AvatarImage src={avatarData.image} alt={avatarData.name} className="w-full h-full object-cover rounded-full" />
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-text w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-background">
              ✓
            </div>
          </button>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
              {getGreeting()}, <span className="neon-text uppercase">{displayName}</span> 👋
            </h2>
            <p className="text-muted text-xs font-bold tracking-wide">
              Wellbeing Overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex items-center gap-2 p-2 bg-card border border-border rounded-2xl">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 px-4 rounded-xl"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} className="mr-2" /> 
              {filterRange === 'today' ? 'Today' : filterRange === '7days' ? '7 Days' : filterRange === '30days' ? '30 Days' : '90 Days'}
            </Button>
            
            {showFilterMenu && (
              <div className="absolute top-12 left-0 z-50 w-40 bg-card border border-border rounded-2xl shadow-2xl p-2 space-y-1 backdrop-blur-2xl">
                {(['today', '7days', '30days', '90days'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => {
                      setFilterRange(range);
                      setShowFilterMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors",
                      filterRange === range ? "bg-primary/20 text-primary" : "text-muted hover:text-primary-text hover:bg-white/5"
                    )}
                  >
                    {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
            )}

            <div className="w-px h-6 bg-primary-text/10" />
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl" onClick={handleExport}>
              <Download size={16} className="mr-2" /> Export
            </Button>
          </div>
          <Button size="lg" className="h-16 px-10 rounded-3xl" onClick={() => navigate('/mood-checkin')}>
            <PlusCircle className="mr-2" /> Log Your Mood
          </Button>
        </div>
      </section>

      {/* Quick Mood Check-in Card */}
      <GlassCard className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-8 sm:p-14">
        <div className="relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-center sm:text-left">
            How are you feeling today?
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 mb-12">
            {[
              { label: 'EXCELLENT', emoji: '😄', glow: 'shadow-[0_0_30px_rgba(22,217,255,0.25)] hover:shadow-[0_0_40px_rgba(22,217,255,0.4)]', bg: 'bg-[#16D9FF]/15 border-[#16D9FF]/30' },
              { label: 'GOOD', emoji: '💚', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.25)] hover:shadow-[0_0_40px_rgba(52,211,153,0.4)]', bg: 'bg-emerald-500/15 border-emerald-500/30' },
              { label: 'OKAY', emoji: '😐', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.25)] hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]', bg: 'bg-amber-500/15 border-amber-500/30' },
              { label: 'LOW', emoji: '😔', glow: 'shadow-[0_0_30px_rgba(216,60,255,0.25)] hover:shadow-[0_0_40px_rgba(216,60,255,0.4)]', bg: 'bg-purple-500/15 border-purple-500/30' },
              { label: 'STRESSED', emoji: '⚡', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.25)] hover:shadow-[0_0_40px_rgba(244,63,94,0.4)]', bg: 'bg-pink-500/15 border-pink-500/30' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate('/mood-checkin')}
                className={cn(
                  "flex flex-col items-center justify-center p-6 sm:p-7 rounded-[32px] bg-white/[0.04] border border-border transition-all duration-200 hover:-translate-y-1 group",
                  item.glow
                )}
              >
                <div className={cn(
                  "w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-[32px] sm:text-[36px] mb-4 transition-transform duration-200 group-hover:scale-110 border",
                  item.bg
                )}>
                  {item.emoji}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted group-hover:text-primary-text transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-center sm:justify-start">
            <Button 
              size="lg" 
              className="h-16 px-12 rounded-3xl shadow-glow-primary transition-all duration-200 hover:scale-[1.02]"
              onClick={() => navigate('/mood-checkin')}
            >
              Check in now <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} hoverable className="relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl bg-card", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">{stat.label}</p>
                <div className="flex flex-col items-start mt-0.5">
                  <p className="text-2xl font-black leading-none mb-1">{stat.value}</p>
                  {stat.badge && stat.badgeTheme && (
                    <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", stat.badgeTheme.bg, stat.badgeTheme.color, stat.badgeTheme.border)}>
                      {stat.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={20} className="text-muted" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <GlassCard className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight">Wellness Pulse</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Stress</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16D9FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16D9FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D83CFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D83CFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D1330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#16D9FF" fillOpacity={1} fill="url(#colorMood)" strokeWidth={3} />
                  <Area type="monotone" dataKey="stress" stroke="#D83CFF" fillOpacity={1} fill="url(#colorStress)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-border-subtle rounded-3xl">
                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="text-muted" size={40} />
                </div>
                <h4 className="text-xl font-black mb-2 tracking-tight">No mood check-ins yet</h4>
                <p className="text-sm text-muted max-w-xs mb-8 font-bold">Log your first mood to start building your wellbeing history.</p>
                <Button onClick={() => navigate('/mood-checkin')} className="px-10 rounded-2xl h-14">
                  Log First Mood
                </Button>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* AI Mentor Insight */}
          <GlassCard className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-xl text-primary"><Brain size={20} /></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Insight</p>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">Personalized Wellness Overview</h3>
              <p className="text-[11px] text-muted font-bold leading-relaxed mb-8 italic whitespace-pre-wrap">
                "{useMemo(() => getMentorSummary(userData), [userData])}"
              </p>
              <Button variant="primary" className="w-full h-14 rounded-2xl shadow-glow-primary" onClick={() => navigate('/ai-mentor')}>Explore AI Mentor</Button>
            </div>
          </GlassCard>

          {/* Predicted Sonic Therapy Recommendation */}
          <GlassCard className="bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent border-secondary/25 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-xl text-secondary"><MusicIcon size={20} /></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Sonic Therapy Prescription</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                AI Match
              </span>
            </div>

            {predictedSong ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 group">
                  <img src={predictedSong.coverUrl} alt={predictedSong.title} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-primary-text truncate">{predictedSong.title}</p>
                    <p className="text-xs text-muted font-bold truncate">{predictedSong.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary/20 text-primary">
                        {predictedSong.mood}
                      </span>
                      <span className="text-[9px] text-muted">{predictedSong.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 h-12 rounded-2xl shadow-glow-secondary font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    onClick={() => playSong(predictedSong)}
                  >
                    <Play size={16} /> {currentSong?.id === predictedSong.id && isPlaying ? 'Playing...' : 'Play Now'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-12 px-4 rounded-2xl font-black text-xs uppercase tracking-wider"
                    onClick={() => navigate('/music')}
                  >
                    Library
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted italic">Loading recommendations...</p>
              </div>
            )}
          </GlassCard>

          {/* Daily Wellness Goals */}
          <GlassCard className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight">Active Goals</h3>
              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-[10px] uppercase font-black tracking-widest" onClick={() => navigate('/goals')}>Edit</Button>
            </div>
            <div className="space-y-6">
              {goals.length > 0 ? goals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{goal.title}</span>
                    <span className="text-primary">{Math.round((goal.currentValue / goal.targetValue) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-card rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary shadow-glow-primary transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))}%` }}
                    />
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-sm text-muted italic">No active goals yet.</p>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => navigate('/goals')}>Create Goal</Button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
