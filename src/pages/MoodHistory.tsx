import { useState, useEffect } from 'react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { Calendar, Filter, Search, MoreVertical, MessageSquare, Moon, Zap, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MoodHistory() {
  const { userData, deleteMoodCheckIn } = useWellness();
  const { moodHistory } = userData;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Deletion Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
    };
    if (openMenuId || isFilterOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId, isFilterOpen]);

  const handleDeleteRequest = (id: string) => {
    setEntryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      try {
        deleteMoodCheckIn(entryToDelete);
        setEntryToDelete(null);
        setError(null);
      } catch (err) {
        console.error('Failed to delete check-in:', err);
        setError('Unable to delete this check-in. Please try again.');
      }
    }
  };

  const filteredHistory = moodHistory.filter(entry => {
    const matchesSearch = entry.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entry.mood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === 'All' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const moods = ['Great', 'Good', 'Calm', 'Happy', 'Excited', 'Okay', 'Tired', 'Sad', 'Anxious', 'Frustrated', 'Lonely', 'Stressed'];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Great': return 'text-primary bg-primary/10';
      case 'Good': return 'text-pink-400 bg-pink-400/10';
      case 'Calm': return 'text-teal-400 bg-teal-400/10';
      case 'Happy': return 'text-amber-400 bg-amber-400/10';
      case 'Excited': return 'text-orange-400 bg-orange-400/10';
      case 'Okay': return 'text-yellow-400 bg-yellow-400/10';
      case 'Tired': return 'text-indigo-400 bg-indigo-400/10';
      case 'Sad': return 'text-blue-400 bg-blue-400/10';
      case 'Anxious': return 'text-purple-400 bg-purple-400/10';
      case 'Frustrated': return 'text-red-400 bg-red-400/10';
      case 'Lonely': return 'text-violet-400 bg-violet-400/10';
      case 'Stressed': return 'text-accent bg-accent/10';
      default: return 'text-muted bg-card';
    }
  };

  return (
    <div className="space-y-6 pb-12 text-primary-text">
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Mood Timeline</h2>
          <p className="text-muted font-bold tracking-tight">Reflecting on your emotional journey.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search notes or moods..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 bg-card/90 border border-border/80 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl pl-12 pr-6 text-sm font-medium focus:outline-none transition-all text-primary-text placeholder:text-muted/70 w-64 md:w-80"
            />
          </div>
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterOpen(!isFilterOpen);
              }}
              className={cn(
                "h-14 px-6 bg-card border border-border rounded-2xl flex items-center gap-3 text-sm font-bold hover:bg-primary-text/10 transition-all",
                filterMood !== 'All' && "border-cyan-500/50 text-cyan-400"
              )}
            >
              <Filter size={18} /> {filterMood === 'All' ? 'Filters' : filterMood}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0A1128] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 max-h-[300px] overflow-y-auto scrollbar-hide">
                <button 
                  onClick={() => setFilterMood('All')}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all",
                    filterMood === 'All' ? "text-cyan-400 bg-cyan-400/5" : "text-muted"
                  )}
                >
                  All Moods
                </button>
                {moods.map(m => (
                  <button 
                    key={m}
                    onClick={() => setFilterMood(m)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all",
                      filterMood === m ? "text-cyan-400 bg-cyan-400/5" : "text-muted"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((entry, i) => (
            <GlassCard key={entry.id} className="relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                {/* Date Side */}
                <div className="md:w-32 flex flex-col items-center justify-center p-4 bg-card rounded-3xl border border-border-subtle">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-black">
                    {new Date(entry.timestamp).getDate()}
                  </span>
                  <span className="text-[10px] font-bold text-primary">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest", getMoodColor(entry.mood))}>
                      {entry.mood}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === entry.id ? null : entry.id);
                        }}
                        className="text-muted hover:text-primary-text transition-colors p-1"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openMenuId === entry.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#0A1128] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => {
                              handleDeleteRequest(entry.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
                          >
                            <Trash2 size={14} /> Delete Entry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {entry.note && (
                    <div className="flex gap-3 p-4 bg-card rounded-2xl italic text-sm text-primary-text/80 leading-relaxed">
                      <MessageSquare size={16} className="shrink-0 text-primary mt-1" />
                      "{entry.note}"
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Zap size={16} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted">Energy</p>
                          <p className="text-sm font-black">{entry.energyLevel}/10</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent"><Sparkles size={16} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted">Stress</p>
                          <p className="text-sm font-black">{entry.stressLevel}/10</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Moon size={16} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted">Sleep</p>
                          <p className="text-sm font-black">{entry.sleepDuration}h</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteRequest(entry.id)}
                      className="px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 self-start sm:self-center"
                    >
                      <Trash2 size={14} /> Delete Entry
                    </button>
                  </div>
                </div>
              </div>

              {/* Connector line for visual timeline */}
              {i < filteredHistory.length - 1 && (
                <div className="absolute left-[72px] bottom-[-40px] w-0.5 h-10 bg-primary-text/10 hidden md:block" />
              )}
            </GlassCard>
          ))
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border-subtle rounded-[40px]">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6">
              <Calendar className="text-muted" size={48} />
            </div>
            <h3 className="text-2xl font-black mb-3">No mood check-ins yet</h3>
            <p className="text-muted font-bold max-w-sm mb-8">
              Your mood timeline will appear here after your first check-in.
            </p>
            <Button size="lg" className="rounded-2xl px-10 h-16 shadow-glow-primary group" onClick={() => window.location.href = '/mood-checkin'}>
              Start Check-in <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete this check-in?"
        message="This will permanently remove this mood entry and update your wellness history."
        confirmLabel="Delete Entry"
        variant="danger"
      />

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-[110]">
          {error}
        </div>
      )}
    </div>
  );
}
