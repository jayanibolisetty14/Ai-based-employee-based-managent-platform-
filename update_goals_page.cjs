const fs = require('fs');
const content = `import { useState } from 'react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Target, Plus, CheckCircle2, Trophy, Clock, Zap, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Goal } from '@/types';

export default function Goals() {
  const { userData, addGoal, updateGoal, deleteGoal } = useWellness();
  const { goals } = userData;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Wellness',
    targetValue: 1,
    unit: 'times',
    frequency: 'Daily' as 'Daily' | 'Weekly'
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    addGoal({
      ...newGoal,
      deadline: new Date().toISOString()
    });
    setIsModalOpen(false);
    setNewGoal({ title: '', category: 'Wellness', targetValue: 1, unit: 'times', frequency: 'Daily' });
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Mental Targets</h2>
          <p className="text-muted font-bold tracking-tight">Structured objectives for cognitive discipline.</p>
        </div>
        
        <Button size="lg" className="h-16 px-10 rounded-3xl" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" /> Define New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {goals.length > 0 ? goals.map((goal) => (
          <GlassCard key={goal.id} className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-primary transition-all",
                  goal.completed ? "bg-green-500/20 text-green-400" : "bg-primary/10"
                )}>
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{goal.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">{goal.category} • {goal.frequency} • {goal.unit}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => deleteGoal && deleteGoal(goal.id)}
                  className="p-2 text-muted hover:text-red-400 bg-card rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">XP Potential</span>
                  <span className="text-sm font-black text-accent">+50 XP</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span className="text-muted">Progress</span>
                <span className="text-primary">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
              </div>
              <div className="h-3 w-full bg-card rounded-full overflow-hidden border border-border-subtle">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    goal.completed ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "bg-primary shadow-glow-primary"
                  )}
                  style={{ width: \`\${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%\` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-subtle">
              <div className="flex items-center gap-3 text-muted">
                <Clock size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Due {goal.frequency === 'Daily' ? 'Today' : 'This Week'}</span>
              </div>
              
              {goal.completed ? (
                <div className="flex items-center gap-2 text-green-400 font-black text-[10px] uppercase tracking-widest">
                  <CheckCircle2 size={18} /> Goal Achieved
                </div>
              ) : (
                <Button size="sm" onClick={() => updateGoal(goal.id, 1)}>
                  Log Progress
                </Button>
              )}
            </div>
          </GlassCard>
        )) : (
          <div className="col-span-full h-[40vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-card rounded-[32px] flex items-center justify-center mb-6">
              <Target className="text-muted" size={48} />
            </div>
            <h3 className="text-xl font-black mb-2">No active objectives</h3>
            <p className="text-sm text-muted font-bold max-w-sm mb-8">
              Setting small, achievable goals is the foundation of mental resilience.
            </p>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>Create First Goal</Button>
          </div>
        )}
      </div>

      {/* Goal Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <GlassCard className="text-center space-y-2">
          <Trophy className="mx-auto text-primary mb-2" size={32} />
          <p className="text-3xl font-black">{goals.filter(g => g.completed).length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Completed Total</p>
        </GlassCard>
        <GlassCard className="text-center space-y-2">
          <Zap className="mx-auto text-accent mb-2" size={32} />
          <p className="text-3xl font-black">{goals.filter(g => g.completed).length * 50}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">XP from Goals</p>
        </GlassCard>
        <GlassCard className="text-center space-y-2">
          <CheckCircle2 className="mx-auto text-green-400 mb-2" size={32} />
          <p className="text-3xl font-black">
            {goals.length > 0 ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100) : 0}%
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Success Rate</p>
        </GlassCard>
      </section>

      {/* Modal for new goal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <GlassCard className="w-full max-w-md relative z-10 !p-0 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-2xl font-black tracking-tight">New Goal</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-card hover:bg-primary-text/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <Input 
                label="Goal Title" 
                placeholder="e.g. Drink Water" 
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Category</label>
                  <select 
                    className="w-full h-14 bg-card border border-border rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary/50 text-white"
                    value={newGoal.category}
                    onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    <option value="Wellness">Wellness</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Sleep">Sleep</option>
                    <option value="Mind Gym">Mind Gym</option>
                    <option value="Smile Break">Smile Break</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Frequency</label>
                  <select 
                    className="w-full h-14 bg-card border border-border rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary/50 text-white"
                    value={newGoal.frequency}
                    onChange={e => setNewGoal({...newGoal, frequency: e.target.value as "Daily" | "Weekly"})}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Target Value" 
                  type="number"
                  min="1"
                  value={newGoal.targetValue}
                  onChange={e => setNewGoal({...newGoal, targetValue: Number(e.target.value)})}
                />
                <Input 
                  label="Unit" 
                  placeholder="times, glasses, etc." 
                  value={newGoal.unit}
                  onChange={e => setNewGoal({...newGoal, unit: e.target.value})}
                />
              </div>

              <Button className="w-full h-14 rounded-2xl" onClick={handleAddGoal}>
                Create Goal
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/pages/Goals.tsx', content);
