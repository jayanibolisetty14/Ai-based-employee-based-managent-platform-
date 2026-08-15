import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { Input, TextArea } from '@/components/common/Input';
import { Book, Plus, Trash2, Edit2, Search, Filter, Download, Calendar, Flame, X, Sparkles } from 'lucide-react';
import { MoodLevel, JournalEntry } from '@/types';
import { cn } from '@/lib/utils';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

export default function Journal() {
  const { userData, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useWellness();
  const { journal } = userData;

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodLevel>('Okay');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');

  // Modal view states
  const [readingEntry, setReadingEntry] = useState<JournalEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auto-save Draft in localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('mood_mentor_journal_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.title || draft.content) {
          setTitle(draft.title || '');
          setContent(draft.content || '');
          setMood(draft.mood || 'Okay');
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (isAdding && !editingId) {
      const draftData = { title, content, mood };
      localStorage.setItem('mood_mentor_journal_draft', JSON.stringify(draftData));
    }
  });

  // Handle open create form
  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setMood('Okay');
    setValidationError(null);
    setIsAdding(true);
  };

  // Handle open edit form
  const handleOpenEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setValidationError(null);
    setIsAdding(true);
  };

  // Handle Save / Update entry with validation
  const handleSave = () => {
    if (!title.trim()) {
      setValidationError('Title is required.');
      return;
    }
    if (!content.trim()) {
      setValidationError('Reflection content is required.');
      return;
    }
    if (!mood) {
      setValidationError('A mood state must be selected.');
      return;
    }

    setValidationError(null);

    if (editingId) {
      updateJournalEntry(editingId, { title, content, mood });
    } else {
      addJournalEntry({ title, content, mood, tags: [] });
      localStorage.removeItem('mood_mentor_journal_draft');
    }

    setIsAdding(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setMood('Okay');
  };

  // Journal Streak calculation
  const journalStreak = useMemo(() => {
    if (!journal || journal.length === 0) return { current: 0, longest: 0 };
    const dates = Array.from(new Set(journal.map(j => new Date(j.date).toDateString())))
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0,0,0,0);

    // Check if user journaled today or yesterday to start current streak
    const hasToday = dates.some(d => d.getTime() === today.getTime());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const hasYesterday = dates.some(d => d.getTime() === yesterday.getTime());

    if (!hasToday && !hasYesterday && dates.length > 0) {
      current = 0;
    } else {
      const checkDate = new Date(hasToday ? today : yesterday);
      for (const d of dates) {
        if (d.getTime() === checkDate.getTime()) {
          current++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (d.getTime() < checkDate.getTime()) {
          break;
        }
      }
    }

    // Longest streak
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(dates[i - 1].getTime() - dates[i].getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > longest) longest = tempStreak;
    }

    return { current: Math.max(current, journal.length > 0 ? 1 : 0), longest: Math.max(longest, journal.length > 0 ? 1 : 0) };
  }, [journal]);

  // Mood Insights
  const moodInsights = useMemo(() => {
    if (!journal || journal.length === 0) return { mostFrequent: 'None', thisWeekCount: 0, distribution: {} };
    const counts: Record<string, number> = {};
    let thisWeekCount = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    journal.forEach(j => {
      counts[j.mood] = (counts[j.mood] || 0) + 1;
      const jDate = new Date(j.date);
      if (jDate >= oneWeekAgo) {
        thisWeekCount++;
      }
    });

    const mostFrequent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    return { mostFrequent, thisWeekCount, distribution: counts };
  }, [journal]);

  // Filtered entries
  const filteredJournal = useMemo(() => {
    return journal.filter(entry => {
      // Search query
      const matchesSearch = searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Mood filter
      const matchesMood = selectedMoodFilter === 'All' || entry.mood === selectedMoodFilter;

      // Date filter
      let matchesDate = true;
      const entryDate = new Date(entry.date);
      const now = new Date();
      if (selectedDateFilter === 'Today') {
        matchesDate = entryDate.toDateString() === now.toDateString();
      } else if (selectedDateFilter === 'This Week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = entryDate >= weekAgo;
      } else if (selectedDateFilter === 'This Month') {
        matchesDate = entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesMood && matchesDate;
    });
  }, [journal, searchQuery, selectedMoodFilter, selectedDateFilter]);

  // Export Journal Data
  const handleExportData = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalEntries: journal.length,
      entries: journal.map(e => ({
        id: e.id,
        title: e.title,
        mood: e.mood,
        content: e.content,
        date: e.date,
        time: e.time || new Date(e.date).toLocaleTimeString(),
        createdAt: e.createdAt || e.date,
        updatedAt: e.updatedAt || e.date
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellness-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-20 text-primary-text max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Navigation */}
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Journal</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {journal.length > 0 && (
            <Button 
              variant="outline" 
              className="h-16 px-6 rounded-3xl border-white/10 hover:bg-white/5 font-black text-xs uppercase tracking-wider flex items-center gap-2"
              onClick={handleExportData}
            >
              <Download size={18} /> Export Journal
            </Button>
          )}
          <Button size="lg" className="h-16 px-10 rounded-3xl shadow-glow-primary" onClick={isAdding ? () => setIsAdding(false) : handleOpenCreate}>
            {isAdding ? 'Cancel Entry' : <><Plus size={20} className="mr-2" /> New Thought</>}
          </Button>
        </div>
      </div>

      {/* Journal Streak & Insights Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <Flame size={28} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Journaling Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{journalStreak.current}</span>
              <span className="text-xs text-muted font-bold">Days (Best: {journalStreak.longest})</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Book size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Entries This Week</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{moodInsights.thisWeekCount}</span>
              <span className="text-xs text-muted font-bold">Thoughts Recorded</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Most Frequent State</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-400 truncate max-w-[180px]">{moodInsights.mostFrequent}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <GlassCard className="space-y-6 relative border-primary/30">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-black tracking-tight">
                {editingId ? 'Edit Journal Entry' : 'New Thought & Reflection'}
              </h3>
            </div>

            {validationError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                {validationError}
              </div>
            )}

            <Input 
              label="Title" 
              placeholder="Daily reflections..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Current State</label>
              <div className="flex flex-wrap gap-3">
                {(['Great', 'Good', 'Calm', 'Happy', 'Okay', 'Tired', 'Anxious', 'Stressed'] as MoodLevel[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                      mood === m 
                        ? "bg-primary text-background border-primary shadow-glow-primary" 
                        : "bg-card text-muted border-white/5 hover:bg-primary-text/10 hover:text-primary-text"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <TextArea 
              label="Your Reflection" 
              placeholder="Write freely here..." 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
            />

            <div className="flex gap-4 pt-2">
              <Button 
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-white/10 font-black text-xs uppercase tracking-wider"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setValidationError(null);
                }}
              >
                Cancel
              </Button>
              <Button size="lg" className="flex-1 h-14 rounded-2xl shadow-glow-primary font-black text-xs uppercase tracking-wider" onClick={handleSave}>
                {editingId ? 'Update Entry' : 'Secure Entry'}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Search and Filters Toolbar */}
      <GlassCard className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by title or reflection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-card border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-primary-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Mood Filter */}
            <div className="flex items-center gap-2 bg-card border border-white/10 rounded-2xl px-4 py-2">
              <Filter size={16} className="text-muted" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Mood:</span>
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-wider text-primary-text focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0A1128]">All Moods</option>
                {['Great', 'Good', 'Calm', 'Happy', 'Okay', 'Tired', 'Anxious', 'Stressed'].map(m => (
                  <option key={m} value={m} className="bg-[#0A1128]">{m}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-card border border-white/10 rounded-2xl px-4 py-2">
              <Calendar size={16} className="text-muted" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Date:</span>
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-wider text-primary-text focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0A1128]">All Time</option>
                <option value="Today" className="bg-[#0A1128]">Today</option>
                <option value="This Week" className="bg-[#0A1128]">This Week</option>
                <option value="This Month" className="bg-[#0A1128]">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Journal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJournal.length > 0 ? filteredJournal.map((entry) => (
          <GlassCard key={entry.id} hoverable className="flex flex-col h-full justify-between group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted mb-1 flex items-center gap-2">
                    {new Date(entry.date).toLocaleDateString()} {entry.time && `• ${entry.time}`}
                  </span>
                  <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{entry.title}</h3>
                </div>
                <div className="px-3 py-1 bg-card border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-primary shrink-0">
                  {entry.mood}
                </div>
              </div>
              
              <p className="text-sm text-muted font-medium line-clamp-4 leading-relaxed italic">
                "{entry.content}"
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-subtle">
              <div className="flex gap-4">
                <button 
                  onClick={() => handleOpenEdit(entry)}
                  className="text-muted hover:text-primary-text transition-colors p-1"
                  title="Edit entry"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => setDeletingId(entry.id)}
                  className="text-muted hover:text-red-400 transition-colors p-1"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <button 
                onClick={() => setReadingEntry(entry)}
                className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
              >
                Read Full
              </button>
            </div>
          </GlassCard>
        )) : (
          <div className="col-span-full h-[40vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6 border border-white/5">
              <Book className="text-muted" size={40} />
            </div>
            <h4 className="text-lg font-bold mb-2">No matching journal entries</h4>
            <p className="text-sm text-muted max-w-xs">Try adjusting your search or filters, or write down a new thought to clear your mental cache.</p>
          </div>
        )}
      </div>

      {/* Read Full Modal */}
      <AnimatePresence>
        {readingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            >
              <GlassCard className="space-y-6 relative border-white/10 bg-[#05091C]/95 p-6 sm:p-8 shadow-2xl">
                <button 
                  onClick={() => setReadingEntry(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-primary-text transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="space-y-2 pr-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {readingEntry.mood}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                      {new Date(readingEntry.date).toLocaleDateString()} {readingEntry.time && `• ${readingEntry.time}`}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">{readingEntry.title}</h3>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <p className="text-base text-primary-text font-medium leading-relaxed whitespace-pre-wrap italic">
                    "{readingEntry.content}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-black uppercase tracking-widest text-muted pt-2 border-t border-white/10">
                  <span>Created: {new Date(readingEntry.createdAt || readingEntry.date).toLocaleString()}</span>
                  {readingEntry.updatedAt && readingEntry.updatedAt !== readingEntry.createdAt && (
                    <span>Last Edited: {new Date(readingEntry.updatedAt).toLocaleString()}</span>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <Button 
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-white/10 font-black text-xs uppercase tracking-wider"
                    onClick={() => {
                      const entryToEdit = readingEntry;
                      setReadingEntry(null);
                      handleOpenEdit(entryToEdit);
                    }}
                  >
                    Edit Entry
                  </Button>
                  <Button 
                    className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-wider"
                    onClick={() => setReadingEntry(null)}
                  >
                    Close
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteJournalEntry(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Journal Entry"
        message="Are you sure you want to permanently delete this journal entry? This action cannot be undone."
        confirmLabel="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
