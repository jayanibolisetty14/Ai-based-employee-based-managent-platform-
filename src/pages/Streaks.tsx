import React, { useState, useMemo } from 'react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { Flame, Calendar as CalendarIcon, Trophy, Info, ChevronLeft, ChevronRight, X, Smile, BatteryCharging, Activity, Moon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MoodCheckIn } from '@/types';

export default function Streaks() {
  const { userData } = useWellness();
  const { profile, moodHistory, activities, journal, hydration, sleep, smileBreakStats } = userData;
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayCheckIn, setSelectedDayCheckIn] = useState<{ date: Date; checkIn?: MoodCheckIn } | null>(null);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    const days = [];

    // Padding for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const d = new Date(year, month, i - startingDayOfWeek + 1);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    return days;
  }, [year, month]);

  // Find check-in for a specific date (latest if multiple)
  const getCheckInForDate = (date: Date) => {
    const dateStr = date.toDateString();
    const matches = moodHistory.filter(m => new Date(m.timestamp).toDateString() === dateStr);
    if (matches.length === 0) return undefined;
    // Return latest check-in of the day
    return matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Great':
      case 'Happy':
      case 'Excited':
      case 'Calm':
      case 'Excellent':
        return 'bg-emerald-500 text-white border-emerald-400';
      case 'Good':
        return 'bg-green-400 text-background border-green-300';
      case 'Okay':
        return 'bg-yellow-400 text-background border-yellow-300';
      case 'Tired':
      case 'Sad':
      case 'Lonely':
        return 'bg-blue-500 text-white border-blue-400';
      case 'Anxious':
      case 'Frustrated':
      case 'Stressed':
        return 'bg-orange-500 text-white border-orange-400';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'Great':
      case 'Happy':
      case 'Excited':
      case 'Calm':
      case 'Excellent':
        return '😊';
      case 'Good':
        return '💚';
      case 'Okay':
        return '😐';
      case 'Tired':
      case 'Sad':
      case 'Lonely':
        return '😔';
      case 'Anxious':
      case 'Frustrated':
      case 'Stressed':
        return '⚡';
      default:
        return '😊';
    }
  };

  // Month stats calculation from actual records
  const monthCheckIns = useMemo(() => {
    return moodHistory.filter(m => {
      const d = new Date(m.timestamp);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [moodHistory, year, month]);

  const monthStats = useMemo(() => {
    if (monthCheckIns.length === 0) return null;

    const counts: Record<string, number> = {};
    let excellentDaysCount = 0;
    let lowDaysCount = 0;
    let stressedDaysCount = 0;

    // Group check-ins by date string to determine latest mood per unique day in the month
    const daysMap = new Map<string, MoodCheckIn[]>();
    monthCheckIns.forEach(m => {
      const dStr = new Date(m.timestamp).toDateString();
      const existing = daysMap.get(dStr) || [];
      daysMap.set(dStr, [...existing, m]);
    });

    daysMap.forEach((checkIns) => {
      // sort latest first
      const sorted = [...checkIns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const latest = sorted[0];
      const mVal = latest.mood;
      counts[mVal] = (counts[mVal] || 0) + 1;

      if (['Great', 'Happy', 'Excited', 'Calm', 'Excellent'].includes(mVal)) {
        excellentDaysCount++;
      } else if (['Tired', 'Sad', 'Lonely'].includes(mVal)) {
        lowDaysCount++;
      } else if (['Anxious', 'Frustrated', 'Stressed'].includes(mVal)) {
        stressedDaysCount++;
      }
    });

    const mostLogged = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No data yet';

    return {
      totalCheckIns: monthCheckIns.length,
      mostLogged,
      excellentDaysCount,
      lowDaysCount,
      stressedDaysCount
    };
  }, [monthCheckIns]);

  // Check if a date has any qualifying wellness action
  const hasQualifyingActionForDate = (date: Date) => {
    const dStr = date.toDateString();
    const hasMood = moodHistory.some(m => new Date(m.timestamp).toDateString() === dStr);
    const hasActivity = activities.some(a => a.completed && a.completedAt && new Date(a.completedAt).toDateString() === dStr);
    const hasJournal = journal.some(j => new Date(j.date).toDateString() === dStr);
    const hasHydration = hydration.logs.some(h => new Date(h.timestamp).toDateString() === dStr);
    const hasSleep = sleep.logs.some(s => new Date(s.timestamp).toDateString() === dStr);
    const hasSmile = smileBreakStats.history?.some(sh => new Date(sh.timestamp).toDateString() === dStr);

    return hasMood || hasActivity || hasJournal || hasHydration || hasSleep || hasSmile;
  };

  // Consistency map days (past 35 days)
  const consistencyDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const isLogged = hasQualifyingActionForDate(d);
    return { date: d, isLogged };
  });

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto text-primary-text px-4 sm:px-6">
      {/* Top Navigation */}
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight">Wellness Journey</h2>
        <p className="text-muted font-bold tracking-tight max-w-xl mx-auto">
          Tracking your daily engagement and emotional history with Mood Mentor AI to build sustainable wellness habits.
        </p>
      </div>

      {/* Streak & Map Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="relative overflow-hidden flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <Flame className="text-orange-500 mb-6 animate-pulse" size={80} />
          <div className="space-y-1">
            <h3 className="text-5xl font-black">{profile.currentStreak}</h3>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Current Day Streak</p>
          </div>
          <div className="mt-10 p-4 bg-card rounded-2xl w-full flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <Trophy className="text-primary" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">All-Time Best</span>
            </div>
            <span className="text-lg font-black">{profile.bestStreak} Days</span>
          </div>
        </GlassCard>

        <GlassCard className="space-y-8">
          <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
            <CalendarIcon size={24} className="text-primary" /> Consistency Map
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-[8px] font-black text-muted text-center mb-1">{day}</div>
            ))}
            {consistencyDays.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square rounded-lg border flex items-center justify-center transition-all",
                  day.isLogged 
                    ? "bg-primary border-primary shadow-glow-primary" 
                    : "bg-card border-border-subtle"
                )}
                title={`${day.date.toDateString()}: ${day.isLogged ? 'Active' : 'No activity'}`}
              >
                {day.isLogged && <CheckCircle2 className="text-background" size={10} />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Activity Recorded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-card border border-border-subtle" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">No Activity</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* MOOD CALENDAR SECTION */}
      <GlassCard className="space-y-8 p-6 sm:p-8 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Smile className="text-cyan-400" size={28} /> Mood Calendar
            </h3>
            <p className="text-xs text-muted font-bold tracking-tight">Your daily emotional check-in history mapped across the month.</p>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/10 rounded-xl text-muted hover:text-primary-text transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-black uppercase tracking-wider px-2">{monthName}</span>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/10 rounded-xl text-muted hover:text-primary-text transition-colors"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Month Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          {monthStats ? (
            <>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted">Check-ins</p>
                <p className="text-xl font-black text-primary-text">{monthStats.totalCheckIns}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted">Top Mood</p>
                <p className="text-xl font-black text-cyan-400">{monthStats.mostLogged}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted">Excellent Days</p>
                <p className="text-xl font-black text-emerald-400">{monthStats.excellentDaysCount}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted">Low Days</p>
                <p className="text-xl font-black text-blue-400">{monthStats.lowDaysCount}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted">Stressed Days</p>
                <p className="text-xl font-black text-orange-400">{monthStats.stressedDaysCount}</p>
              </div>
            </>
          ) : (
            <div className="col-span-full py-2 text-center">
              <p className="text-xs font-bold text-muted">No mood check-ins for this month yet. Complete your first check-in to begin building your emotional history.</p>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="text-[10px] font-black uppercase tracking-widest text-muted py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, idx) => {
              const checkIn = getCheckInForDate(item.date);
              const isToday = item.date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayCheckIn({ date: item.date, checkIn })}
                  className={cn(
                    "aspect-square rounded-2xl p-2 flex flex-col justify-between items-center transition-all cursor-pointer border relative group",
                    !item.isCurrentMonth && "opacity-30",
                    checkIn ? getMoodColor(checkIn.mood) : "bg-card/60 hover:bg-card border-border-subtle text-primary-text",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                  )}
                  title={`${item.date.toDateString()}${checkIn ? `: ${checkIn.mood}` : ': No check-in'}`}
                >
                  <span className={cn("text-xs font-black", checkIn ? "text-inherit" : "text-muted")}>
                    {item.date.getDate()}
                  </span>
                  
                  <div className="text-base sm:text-lg">
                    {checkIn ? getMoodEmoji(checkIn.mood) : <span className="w-1.5 h-1.5 rounded-full bg-muted/30 block" />}
                  </div>

                  {checkIn && (
                    <span className="text-[8px] font-black uppercase tracking-tighter truncate max-w-full px-1 rounded bg-black/20 text-white">
                      {checkIn.mood}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm">😊</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">💚</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">😐</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Okay</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">😔</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Stressed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-card border border-border-subtle" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">No check-in</span>
          </div>
        </div>
      </GlassCard>

      {/* How Your Streak Works & Data Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="bg-primary/5 border-primary/20 space-y-4">
          <div className="flex gap-4">
            <Info className="text-primary shrink-0" size={24} />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-primary">How Your Streak Works</p>
              <p className="text-sm text-primary-text/80 font-medium leading-relaxed">
                Your streak grows when you complete qualifying wellness activities or mood check-ins on consecutive days. Missing a day ends the current streak, but your all-time best streak is securely preserved.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-cyan-500/5 border-cyan-500/20 space-y-4">
          <div className="flex gap-4">
            <CalendarIcon className="text-cyan-400 shrink-0" size={24} />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-400">Your Wellness Data</p>
              <p className="text-sm text-primary-text/80 font-medium leading-relaxed">
                Your mood check-ins automatically sync with your Dashboard, Reports, AI Mentor, and personalized recommendations in real time.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Day Detail Modal */}
      {selectedDayCheckIn && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md space-y-6 relative border-white/10 bg-[#05091C]/95 p-6 sm:p-8 shadow-2xl">
            <button 
              onClick={() => setSelectedDayCheckIn(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-primary-text transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                {selectedDayCheckIn.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="text-2xl font-black tracking-tight">Check-in Details</h3>
            </div>

            {selectedDayCheckIn.checkIn ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-4xl">{getMoodEmoji(selectedDayCheckIn.checkIn.mood)}</span>
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-widest">Logged Mood</p>
                    <p className="text-xl font-black text-primary-text">{selectedDayCheckIn.checkIn.mood}</p>
                    <p className="text-[10px] text-muted font-medium">
                      {new Date(selectedDayCheckIn.checkIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <Activity size={16} className="mx-auto mb-1 text-cyan-400" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted">Stress</p>
                    <p className="text-lg font-black">{selectedDayCheckIn.checkIn.stressLevel}/10</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <BatteryCharging size={16} className="mx-auto mb-1 text-emerald-400" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted">Energy</p>
                    <p className="text-lg font-black">{selectedDayCheckIn.checkIn.energyLevel}/10</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <Moon size={16} className="mx-auto mb-1 text-purple-400" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted">Sleep</p>
                    <p className="text-lg font-black">{selectedDayCheckIn.checkIn.sleepDuration}h</p>
                  </div>
                </div>

                {selectedDayCheckIn.checkIn.note && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted">Reflection Note</p>
                    <p className="text-sm font-medium text-primary-text italic">"{selectedDayCheckIn.checkIn.note}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-muted">
                  <CalendarIcon size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-primary-text">No mood check-in</p>
                  <p className="text-xs text-muted">No emotional check-in was recorded for this date.</p>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedDayCheckIn(null);
                    navigate('/mood-checkin');
                  }}
                  className="rounded-xl px-6 py-3 font-black text-xs uppercase tracking-wider"
                >
                  Log Your Mood
                </Button>
              </div>
            )}

            <button 
              onClick={() => setSelectedDayCheckIn(null)}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-primary-text font-black text-xs uppercase tracking-wider transition-colors"
            >
              Close
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
