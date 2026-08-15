import React, { useState } from 'react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { Input } from '@/components/common/Input';
import { Target, Plus, CheckCircle2, Trophy, Clock, Zap, X, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Goal } from '@/types';

type GoalFilter = 'all' | 'today' | 'daily' | 'weekly' | 'completed';

export default function Goals() {
  const { userData, addGoal, updateGoal, deleteGoal, editGoal } = useWellness();
  const { goals } = userData;
  
  const [filter, setFilter] = useState<GoalFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Wellness',
    targetValue: 1,
    unit: 'times',
    frequency: 'Daily' as 'Daily' | 'Weekly',
    xpReward: 50
  });

  const handleCategoryChange = (category: string) => {
    let defaultUnit = 'times';
    let defaultTarget = 1;
    let defaultTitle = '';

    switch (category) {
      case 'Meditation':
        defaultUnit = 'minutes';
        defaultTarget = 10;
        defaultTitle = 'Meditate for 10 minutes';
        break;
      case 'Hydration':
        defaultUnit = 'glasses';
        defaultTarget = 8;
        defaultTitle = 'Drink 8 glasses of water';
        break;
      case 'Sleep':
        defaultUnit = 'hours';
        defaultTarget = 8;
        defaultTitle = 'Get 8 hours of sleep';
        break;
      case 'Mind Gym':
        defaultUnit = 'sessions';
        defaultTarget = 1;
        defaultTitle = 'Complete a Mind Gym workout';
        break;
      case 'Smile Break':
        defaultUnit = 'times';
        defaultTarget = 1;
        defaultTitle = 'Take a Smile Break';
        break;
      case 'Journal':
        defaultUnit = 'entries';
        defaultTarget = 1;
        defaultTitle = 'Write a journal reflection';
        break;
      case 'Mood Check-in':
        defaultUnit = 'check-ins';
        defaultTarget = 1;
        defaultTitle = 'Complete daily mood check-in';
        break;
      case 'Wellness Activity':
        defaultUnit = 'sessions';
        defaultTarget = 1;
        defaultTitle = 'Complete wellness activity';
        break;
      default:
        defaultUnit = 'times';
        defaultTarget = 1;
        defaultTitle = '';
    }

    setNewGoal(prev => ({
      ...prev,
      category,
      unit: defaultUnit,
      targetValue: defaultTarget,
      title: prev.title ? prev.title : defaultTitle
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setNewGoal({
      title: '',
      category: 'Wellness',
      targetValue: 1,
      unit: 'times',
      frequency: 'Daily',
      xpReward: 50
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      category: goal.category,
      targetValue: goal.targetValue,
      unit: goal.unit,
      frequency: goal.frequency || 'Daily',
      xpReward: goal.xpReward || 50
    });
    setIsModalOpen(true);
  };

  const handleSaveGoal = () => {
    if (!newGoal.title.trim()) return;

    if (editingGoal) {
      if (editGoal) {
        editGoal(editingGoal.id, {
          title: newGoal.title,
          category: newGoal.category,
          targetValue: newGoal.targetValue,
          unit: newGoal.unit,
          frequency: newGoal.frequency,
          xpReward: newGoal.xpReward
        });
      }
    } else {
      addGoal({
        title: newGoal.title,
        category: newGoal.category,
        targetValue: newGoal.targetValue,
        unit: newGoal.unit,
        frequency: newGoal.frequency,
        deadline: new Date().toISOString(),
        xpReward: newGoal.xpReward
      });
    }

    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const formatUnitLabel = (value: number, unit: string) => {
    if (value === 1) {
      if (unit === 'times') return '1 time';
      if (unit === 'minutes') return '1 minute';
      if (unit === 'glasses') return '1 glass';
      if (unit === 'sessions') return '1 session';
      if (unit === 'entries') return '1 entry';
      if (unit === 'check-ins') return '1 check-in';
      if (unit === 'hours') return '1 hour';
      if (unit === 'days') return '1 day';
    }
    return `${value} ${unit}`;
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'completed') return goal.completed;
    if (filter === 'daily') return goal.frequency === 'Daily';
    if (filter === 'weekly') return goal.frequency === 'Weekly';
    if (filter === 'today') return !goal.completed && (goal.frequency === 'Daily' || !goal.frequency);
    return true;
  });

  const completedCount = goals.filter(g => g.completed).length;
  const totalXPFromGoals = goals.filter(g => g.completed).reduce((acc, g) => acc + (g.xpReward || 50), 0);
  const successRate = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-20 text-primary-text max-w-6xl mx-auto px-4 sm:px-6">
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Mental Targets</h2>
        </div>
        
        <Button size="lg" className="h-14 px-8 rounded-2xl shadow-glow-primary" onClick={handleOpenCreateModal}>
          <Plus size={20} className="mr-2" /> Define New Goal
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {(['all', 'today', 'daily', 'weekly', 'completed'] as GoalFilter[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap",
              filter === tab ? "bg-primary text-background" : "bg-white/5 text-muted hover:text-primary-text"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({goals.filter(g => {
              if (tab === 'completed') return g.completed;
              if (tab === 'daily') return g.frequency === 'Daily';
              if (tab === 'weekly') return g.frequency === 'Weekly';
              if (tab === 'today') return !g.completed && (g.frequency === 'Daily' || !g.frequency);
              return true;
            }).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.length > 0 ? filteredGoals.map((goal) => {
          const percent = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
          return (
            <GlassCard key={goal.id} className="relative overflow-hidden group p-6 flex flex-col justify-between border-white/10">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-primary transition-all shadow-sm border",
                      goal.completed ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-primary/10 border-primary/20"
                    )}>
                      <Target size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">{goal.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                        {goal.category} • {goal.frequency || 'Daily'} • {formatUnitLabel(goal.targetValue, goal.unit)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEditModal(goal)}
                      className="p-2 text-muted hover:text-primary-text bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                      title="Edit Goal"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmationId(goal.id)}
                      className="p-2 text-muted hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-muted">Progress</span>
                    <span className="text-primary">{goal.currentValue} / {goal.targetValue} {goal.unit} ({percent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        goal.completed ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-primary shadow-glow-primary"
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-muted">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Due {goal.frequency === 'Weekly' ? 'This Week' : 'Today'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    +{goal.xpReward || 50} XP
                  </span>

                  {goal.completed ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                      <CheckCircle2 size={16} /> Goal Achieved ✓
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => updateGoal(goal.id, 1)} className="rounded-xl px-4 py-2 text-xs font-black">
                      Log Progress
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        }) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <Target className="text-muted" size={40} />
            </div>
            <h3 className="text-xl font-black mb-2">No goals found</h3>
            <p className="text-sm text-muted font-bold max-w-sm mb-6">
              Create your first wellness goal to start building healthy daily routines.
            </p>
            <Button size="lg" onClick={handleOpenCreateModal} className="rounded-2xl">Define New Goal</Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <GlassCard className="text-center space-y-2 border-white/10">
          <Trophy className="mx-auto text-primary mb-1" size={28} />
          <p className="text-3xl font-black">{completedCount}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Goals Achieved</p>
        </GlassCard>
        <GlassCard className="text-center space-y-2 border-white/10">
          <Target className="mx-auto text-cyan-400 mb-1" size={28} />
          <p className="text-3xl font-black">{goals.reduce((acc, g) => acc + g.currentValue, 0)}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Completions</p>
        </GlassCard>
        <GlassCard className="text-center space-y-2 border-white/10">
          <Zap className="mx-auto text-amber-400 mb-1" size={28} />
          <p className="text-3xl font-black">{totalXPFromGoals} XP</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">XP from Goals</p>
        </GlassCard>
        <GlassCard className="text-center space-y-2 border-white/10">
          <CheckCircle2 className="mx-auto text-emerald-400 mb-1" size={28} />
          <p className="text-3xl font-black">{successRate}%</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Success Rate</p>
        </GlassCard>
      </section>

      {/* Create / Edit Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative z-10 !p-6 sm:!p-8 overflow-hidden bg-[#05091C]/95 border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-2xl font-black tracking-tight">{editingGoal ? 'Edit Goal' : 'Define New Goal'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-muted hover:text-primary-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Category</label>
                <select 
                  className="w-full h-14 bg-card border border-white/10 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary text-white"
                  value={newGoal.category}
                  onChange={e => handleCategoryChange(e.target.value)}
                >
                  <option value="Wellness">Wellness</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Sleep">Sleep</option>
                  <option value="Mind Gym">Mind Gym</option>
                  <option value="Smile Break">Smile Break</option>
                  <option value="Journal">Journal</option>
                  <option value="Mood Check-in">Mood Check-in</option>
                  <option value="Wellness Activity">Wellness Activity</option>
                </select>
              </div>

              <Input 
                label="Goal Title" 
                placeholder="e.g. Drink Water" 
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              />
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Frequency</label>
                <select 
                  className="w-full h-14 bg-card border border-white/10 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary text-white"
                  value={newGoal.frequency}
                  onChange={e => setNewGoal({...newGoal, frequency: e.target.value as "Daily" | "Weekly"})}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <Button className="w-full h-14 rounded-2xl shadow-glow-primary mt-4 font-black" onClick={handleSaveGoal}>
                {editingGoal ? 'Save Changes' : 'Create Goal'}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative z-10 !p-6 sm:!p-8 bg-[#05091C]/95 border-white/10 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Delete this goal?</h3>
              <p className="text-sm text-muted font-bold leading-relaxed">
                This will remove the goal from your active goals. Your historical wellness activity and earned XP will remain.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl"
                onClick={() => setDeleteConfirmationId(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black"
                onClick={() => {
                  deleteGoal(deleteConfirmationId);
                  setDeleteConfirmationId(null);
                }}
              >
                Delete Goal
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
