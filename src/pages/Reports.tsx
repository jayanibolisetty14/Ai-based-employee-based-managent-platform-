import React, { useState, useRef, useMemo } from 'react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { BackButton } from '@/components/common/BackButton';
import { 
  FileText, 
  Download, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  Zap, 
  Sparkles,
  Target,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ReportPeriod = 'this_week' | 'last_week' | 'last_30_days';

export default function Reports() {
  const { userData } = useWellness();
  const { moodHistory, activities, goals, sleep } = userData;
  
  const [period, setPeriod] = useState<ReportPeriod>('this_week');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Period Date Calculation
  const dateRange = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (period === 'this_week') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
    } else if (period === 'last_week') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1) - 7;
      start.setDate(diff);
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (period === 'last_30_days') {
      start.setDate(start.getDate() - 30);
    }
    return { start, end };
  }, [period]);

  const dateLabel = `${dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Filter Data
  const periodMoods = moodHistory.filter(m => {
    const d = new Date(m.timestamp);
    return d >= dateRange.start && d <= dateRange.end;
  });

  const periodSleep = sleep.logs.filter(s => {
    const d = new Date(s.timestamp);
    return d >= dateRange.start && d <= dateRange.end;
  });
  
  // Previous Period for trends
  const prevDateRange = useMemo(() => {
    const end = new Date(dateRange.start);
    end.setMilliseconds(-1);
    const start = new Date(end);
    const duration = dateRange.end.getTime() - dateRange.start.getTime();
    start.setTime(start.getTime() - duration);
    return { start, end };
  }, [dateRange]);

  const prevMoods = moodHistory.filter(m => {
    const d = new Date(m.timestamp);
    return d >= prevDateRange.start && d <= prevDateRange.end;
  });

  const periodActivities = activities.filter(a => a.completed && a.completedAt && new Date(a.completedAt) >= dateRange.start && new Date(a.completedAt) <= dateRange.end);
  const periodGoals = goals.filter(g => g.completed && g.completedAt && new Date(g.completedAt) >= dateRange.start && new Date(g.completedAt) <= dateRange.end);

  const moodValue = (mood: string) => {
    switch(mood) {
      case 'Great': return 5;
      case 'Good': case 'Excited': case 'Happy': return 4;
      case 'Calm': case 'Okay': return 3;
      case 'Tired': case 'Sad': case 'Lonely': return 2;
      case 'Anxious': case 'Frustrated': case 'Stressed': return 1;
      default: return 3;
    }
  };

  const calculateStats = (moods: typeof periodMoods, sleepLogs: typeof periodSleep) => {
    if (moods.length === 0 && sleepLogs.length === 0) return { avgMood: 0, avgSleep: 0, avgStress: 0, avgEnergy: 0 };
    const avgMood = moods.length > 0 ? moods.reduce((acc, m) => acc + moodValue(m.mood), 0) / moods.length : 0;
    
    // Calculate sleep from sleep logs or mood checkin sleepDuration
    let totalSleep = 0;
    let sleepCount = 0;
    if (sleepLogs.length > 0) {
      totalSleep = sleepLogs.reduce((acc, s) => acc + s.hours, 0);
      sleepCount = sleepLogs.length;
    } else if (moods.length > 0) {
      const moodsWithSleep = moods.filter(m => m.sleepDuration && m.sleepDuration > 0);
      if (moodsWithSleep.length > 0) {
        totalSleep = moodsWithSleep.reduce((acc, m) => acc + m.sleepDuration, 0);
        sleepCount = moodsWithSleep.length;
      }
    }
    const avgSleep = sleepCount > 0 ? totalSleep / sleepCount : 0;

    const avgStress = moods.length > 0 ? moods.reduce((acc, m) => acc + (m.stressLevel || 0), 0) / moods.length : 0;
    const avgEnergy = moods.length > 0 ? moods.reduce((acc, m) => acc + (m.energyLevel || 0), 0) / moods.length : 0;
    return { avgMood, avgSleep, avgStress, avgEnergy };
  };

  const currentStats = calculateStats(periodMoods, periodSleep);
  const prevSleep = sleep.logs.filter(s => {
    const d = new Date(s.timestamp);
    return d >= prevDateRange.start && d <= prevDateRange.end;
  });
  const prevStats = calculateStats(prevMoods, prevSleep);

  const getTrend = (current: number, prev: number, hasData: boolean) => {
    if (!hasData || prev === 0 || current === 0) return { value: 0, label: 'No prev data', direction: 'neutral' };
    const diff = ((current - prev) / prev) * 100;
    return {
      value: Math.abs(diff).toFixed(0),
      label: `${Math.abs(diff).toFixed(0)}%`,
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
    };
  };

  const hasMoodData = periodMoods.length > 0;
  const hasPrevMoodData = prevMoods.length > 0;
  const moodTrend = getTrend(currentStats.avgMood, prevStats.avgMood, hasMoodData && hasPrevMoodData);

  const hasSleepData = currentStats.avgSleep > 0;
  const hasPrevSleepData = prevStats.avgSleep > 0;
  const sleepTrend = getTrend(currentStats.avgSleep, prevStats.avgSleep, hasSleepData && hasPrevSleepData);

  // Dynamic Status Labels
  const getMoodStatus = () => {
    if (!hasMoodData) return 'Not enough data';
    if (periodMoods.length < 3) return 'Needs More Data';
    if (moodTrend.direction === 'up') return 'Improving';
    if (moodTrend.direction === 'down') return 'Fluctuating';
    return 'Stable';
  };

  const getCheckinStatus = () => {
    if (!hasMoodData) return 'Not enough data';
    if (periodMoods.length >= 5) return 'Consistent';
    if (periodMoods.length >= 2) return 'Getting Started';
    return 'Inactive';
  };

  const getSleepStatus = () => {
    if (!hasSleepData) return 'Not enough data';
    if (sleepTrend.direction === 'up') return 'Improving';
    if (sleepTrend.direction === 'down') return 'Variable';
    return 'Consistent';
  };

  const getGoalStatus = () => {
    if (periodGoals.length >= 3) return 'Excellent Progress';
    if (periodGoals.length > 0) return 'Good Progress';
    if (goals.length > 0) return 'Getting Started';
    return 'No Goals Completed';
  };

  const generateInsight = () => {
    const totalRecords = periodMoods.length + periodActivities.length + periodGoals.length;
    if (totalRecords === 0) {
      return "Start logging your wellness activities and mood check-ins to generate personalized insights.";
    }
    if (totalRecords < 3) {
      return "Keep checking in and recording your activities to build enough data for meaningful trends.";
    }

    let insight = "";
    if (hasMoodData) {
      if (moodTrend.direction === 'up' && moodTrend.value !== '0') {
        insight += `Your recent mood check-ins are trending upward (${moodTrend.label} higher than previous period). `;
      } else if (moodTrend.direction === 'down' && moodTrend.value !== '0') {
        insight += `Your recent mood entries have varied compared to last period. `;
      } else {
        insight += `Your mood has remained relatively steady across your recent entries. `;
      }
    }

    if (hasSleepData) {
      if (currentStats.avgSleep < 6) {
        insight += `Your recent sleep duration averages ${currentStats.avgSleep.toFixed(1)}h, which may influence your daily energy levels. `;
      } else {
        insight += `Your recent sleep records show a fairly consistent sleep duration averaging ${currentStats.avgSleep.toFixed(1)}h. `;
      }
    }

    if (periodActivities.length > 0) {
      insight += `You've completed ${periodActivities.length} wellness activities this period. Consistency in wellness practices helps build positive routines. `;
    }

    if (periodGoals.length > 0) {
      insight += `You have successfully met ${periodGoals.length} goal(s) during this timeframe.`;
    } else if (goals.length > 0) {
      insight += `You have active goals still in progress. Completing one small goal could help maintain momentum.`;
    }

    return insight.trim() || "Keep checking in and completing activities to unlock personalized wellness insights.";
  };

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#05091C',
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Wellness_Report_${dateRange.start.toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF');
    }
    setIsGenerating(false);
  };

  const handleShare = async () => {
    const text = `My Wellness Report (${dateLabel}):\nAvg Mood: ${hasMoodData ? `${currentStats.avgMood.toFixed(1)}/5` : 'No data'}\nCheck-ins: ${periodMoods.length}\nAvg Sleep: ${hasSleepData ? `${currentStats.avgSleep.toFixed(1)}h` : 'No data'}\nGoals Met: ${periodGoals.length}\nGenerated via Mood Mentor AI.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wellness Report',
          text: text,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Report summary copied to clipboard!');
    }
  };

  // Combine moods and activities for the log
  const logEntries = [
    ...periodMoods.map(m => ({
      id: m.id,
      date: new Date(m.timestamp),
      type: 'Check-in',
      title: 'Mood Check-in',
      details: `Mood: ${m.mood} | Energy: ${m.energyLevel}/10 | Stress: ${m.stressLevel}/10 | Sleep: ${m.sleepDuration}h`,
      xp: 0
    })),
    ...periodActivities.map(a => ({
      id: a.id,
      date: new Date(a.completedAt!),
      type: 'Activity',
      title: a.title,
      details: `Category: ${a.category}`,
      xp: a.xpReward
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const hasAnyData = periodMoods.length > 0 || periodActivities.length > 0 || periodGoals.length > 0 || periodSleep.length > 0;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto text-primary-text px-4 sm:px-6">
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Weekly Synthesis</h2>
          <p className="text-muted font-bold tracking-tight">A simple view of your recent wellness patterns and progress.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setPeriod('this_week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${period === 'this_week' ? 'bg-primary text-background' : 'text-muted hover:text-primary-text'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setPeriod('last_week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${period === 'last_week' ? 'bg-primary text-background' : 'text-muted hover:text-primary-text'}`}
            >
              Last Week
            </button>
            <button 
              onClick={() => setPeriod('last_30_days')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${period === 'last_30_days' ? 'bg-primary text-background' : 'text-muted hover:text-primary-text'}`}
            >
              Last 30 Days
            </button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} disabled={isGenerating || !hasAnyData}>
              <Download size={18} className="mr-2" /> {isGenerating ? 'Exporting...' : 'PDF'}
            </Button>
            <Button variant="primary" onClick={handleShare} disabled={!hasAnyData}>
              <Share2 size={18} className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>

      <div ref={reportRef} className="space-y-8 bg-[#05091C] p-2 rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <GlassCard className="lg:col-span-2 space-y-10 p-8 sm:p-10 border-white/10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-[28px] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                📈
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Wellness Summary</h3>
                <p className="text-cyan-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Calendar size={12} /> {dateLabel}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Avg Mood</p>
                <p className="text-3xl font-black">
                  {hasMoodData ? currentStats.avgMood.toFixed(1) : <span className="text-lg text-muted">No data yet</span>}
                  {hasMoodData && <span className="text-base text-muted/50">/5</span>}
                </p>
                <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${moodTrend.direction === 'up' ? 'text-emerald-400' : moodTrend.direction === 'down' ? 'text-amber-400' : 'text-muted'}`}>
                  {moodTrend.direction === 'up' ? <TrendingUp size={12} /> : moodTrend.direction === 'down' ? <TrendingDown size={12} /> : null}
                  {getMoodStatus()}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Check-ins</p>
                <p className="text-3xl font-black">{periodMoods.length}</p>
                <div className="flex items-center gap-1 text-cyan-400 text-[10px] font-bold mt-1">
                  <Zap size={12} /> {getCheckinStatus()}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Avg Sleep</p>
                <p className="text-3xl font-black">
                  {hasSleepData ? `${currentStats.avgSleep.toFixed(1)}h` : <span className="text-lg text-muted">No data yet</span>}
                </p>
                <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${sleepTrend.direction === 'up' ? 'text-emerald-400' : sleepTrend.direction === 'down' ? 'text-amber-400' : 'text-muted'}`}>
                  {sleepTrend.direction === 'up' ? <TrendingUp size={12} /> : sleepTrend.direction === 'down' ? <TrendingDown size={12} /> : null}
                  {getSleepStatus()}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Goals Met</p>
                <p className="text-3xl font-black">{periodGoals.length}</p>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold mt-1">
                  <Target size={12} /> {getGoalStatus()}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AI Insight Card */}
          <GlassCard className="bg-cyan-500/5 border-cyan-500/20 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-cyan-400" />
                <h3 className="text-xl font-black tracking-tight uppercase">Neural Insight</h3>
              </div>
              <p className="text-sm text-primary-text/90 font-medium leading-relaxed italic">
                "{generateInsight()}"
              </p>
            </div>
            <div className="pt-4 border-t border-cyan-500/10">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest">
                <CheckCircle2 size={14} /> Calculated from your local wellness data
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Activity Logs */}
        <GlassCard className="space-y-6 border-white/10">
          <h3 className="text-xl font-black tracking-tight">Activity Log</h3>
          <div className="space-y-3">
            {logEntries.length === 0 ? (
              <div className="p-8 text-center border border-white/5 rounded-2xl bg-white/5">
                <p className="text-sm font-bold text-muted">No activities or check-ins logged during this period.</p>
              </div>
            ) : (
              logEntries.map((entry, i) => (
                <div key={`${entry.id}-${i}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg shadow-sm border ${entry.type === 'Activity' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'}`}>
                      {entry.type === 'Activity' ? <Zap size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-black">{entry.title}</p>
                        <span className="text-[9px] px-2 py-0.5 bg-white/10 rounded-full font-bold text-muted">{entry.date.toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-muted/80">{entry.details}</p>
                    </div>
                  </div>
                  {entry.xp > 0 && (
                    <span className="text-[10px] font-black text-amber-400 uppercase shrink-0 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                      +{entry.xp} XP
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
