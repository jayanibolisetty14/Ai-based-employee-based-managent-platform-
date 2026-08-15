import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Moon, 
  Activity, 
  BarChart, 
  Sparkles,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { BackButton } from '@/components/common/BackButton';
import { Button } from '@/components/common/Button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '@/lib/utils';

type Period = '7 Days' | '30 Days' | '90 Days' | 'All Time';

export default function Analytics() {
  const { userData } = useWellness();
  const { moodHistory } = userData;
  const [period, setPeriod] = useState<Period>('7 Days');
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);

  const periods: Period[] = ['7 Days', '30 Days', '90 Days', 'All Time'];

  const filteredHistory = useMemo(() => {
    if (period === 'All Time') return moodHistory;
    
    const now = new Date();
    const days = parseInt(period.split(' ')[0]);
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return moodHistory.filter(m => new Date(m.timestamp) >= cutoff);
  }, [moodHistory, period]);

  const moodChartData = useMemo(() => {
    return [...filteredHistory].reverse().map(m => ({
      timestamp: m.timestamp,
      label: new Date(m.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      shortLabel: new Date(m.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      }),
      moodValue: ['Great', 'Happy', 'Excited'].includes(m.mood) ? 5 : 
                 ['Good', 'Calm'].includes(m.mood) ? 4 : 
                 ['Okay', 'Tired'].includes(m.mood) ? 3 : 2,
      energy: m.energyLevel,
      stress: m.stressLevel,
      moodName: m.mood
    }));
  }, [filteredHistory]);

  const moodCounts = useMemo(() => {
    return filteredHistory.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredHistory]);

  const pieData = useMemo(() => {
    return Object.keys(moodCounts).map(name => ({
      name,
      value: moodCounts[name]
    })).sort((a, b) => b.value - a.value);
  }, [moodCounts]);

  const COLORS = ['#16D9FF', '#7A35FF', '#10B981', '#F59E0B', '#D83CFF', '#F43F5E', '#8B5CF6', '#06B6D4'];

  const averages = useMemo(() => {
    if (filteredHistory.length === 0) return { sleep: 0, energy: 0, stress: 0 };
    
    const totals = filteredHistory.reduce((acc, curr) => {
      acc.sleep += curr.sleepDuration;
      acc.energy += curr.energyLevel;
      acc.stress += curr.stressLevel;
      return acc;
    }, { sleep: 0, energy: 0, stress: 0 });

    return {
      sleep: (totals.sleep / filteredHistory.length).toFixed(1),
      energy: (totals.energy / filteredHistory.length).toFixed(1),
      stress: (totals.stress / filteredHistory.length).toFixed(1)
    };
  }, [filteredHistory]);

  if (moodHistory.length === 0) {
    return (
      <div className="space-y-6 pb-20 text-primary-text">
        <div>
          <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
        </div>
        <div className="h-[60vh] flex flex-col items-center justify-center text-center px-10">
          <div className="w-32 h-32 bg-card rounded-[48px] flex items-center justify-center mb-10 shadow-glow-primary">
            <BarChart className="text-muted" size={64} />
          </div>
          <h2 className="text-4xl font-black mb-4">No wellness <span className="neon-text italic">data yet.</span></h2>
          <p className="text-muted font-bold max-w-sm mb-10">
            Complete your first check-in to start seeing your emotional trends.
          </p>
          <Button size="lg" className="rounded-2xl px-10 h-16 shadow-glow-primary group" onClick={() => window.location.href = '/mood-checkin'}>
            Start Check-in <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 text-primary-text max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="mb-4">
            <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-tight">Wellness Analytics</h2>
          <p className="text-muted font-bold tracking-tight">Insights from your wellness check-ins.</p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsPeriodMenuOpen(!isPeriodMenuOpen)}
            className="h-12 px-6 bg-card border border-border/80 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all shadow-lg min-w-[140px] justify-between"
          >
            {period} <ChevronDown size={16} className={cn("transition-transform duration-300", isPeriodMenuOpen && "rotate-180")} />
          </button>
          
          {isPeriodMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0A1128] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
              {periods.map(p => (
                <button 
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setIsPeriodMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5",
                    period === p ? "text-cyan-400 bg-cyan-400/5" : "text-muted"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <GlassCard className="py-20 flex flex-col items-center justify-center text-center">
          <Activity className="text-muted/30 mb-6" size={48} />
          <h3 className="text-xl font-black mb-2">No data for this period</h3>
          <p className="text-muted font-bold max-w-xs">Try selecting a different time range or log more moods.</p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  <TrendingUp size={24} className="text-primary" /> Mood & Vitality
                </h3>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="shortLabel" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      minTickGap={30}
                    />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0D1330', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      labelStyle={{ color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}
                      itemStyle={{ fontWeight: 800 }}
                      labelFormatter={(label, payload) => payload[0]?.payload.label || label}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="moodValue" 
                      name="Mood"
                      stroke="#16D9FF" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#16D9FF', strokeWidth: 0 }}
                      activeDot={{ r: 8, stroke: 'rgba(22, 217, 255, 0.4)', strokeWidth: 10 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      name="Energy"
                      stroke="#7A35FF" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#7A35FF', strokeWidth: 0 }}
                      activeDot={{ r: 8, stroke: 'rgba(122, 53, 255, 0.4)', strokeWidth: 10 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="space-y-6">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Activity size={24} className="text-accent" /> Emotional Distribution
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={6}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0D1330', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '16px' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black leading-none">{filteredHistory.length}</span>
                    <span className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">Entries</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  {pieData.map((mood, index) => (
                    <div key={mood.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span className="text-sm font-bold text-muted group-hover:text-primary-text transition-colors">
                          {mood.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black">{mood.value}</span>
                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${(mood.value / filteredHistory.length) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Moon size={24} /></div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Avg Sleep</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tighter">{averages.sleep}</p>
                <span className="text-lg font-black text-muted italic">hours</span>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Zap size={24} /></div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Avg Energy</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tighter">{averages.energy}</p>
                <span className="text-lg font-black text-muted italic">/10</span>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-accent/10 rounded-2xl text-accent"><Sparkles size={24} /></div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Avg Stress</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tighter">{averages.stress}</p>
                <span className="text-lg font-black text-muted italic">/10</span>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
