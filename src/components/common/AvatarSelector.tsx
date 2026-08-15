import { useState, useMemo } from 'react';
import { AVATARS } from '@/data/avatars';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarImage } from './AvatarImage';

interface AvatarSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
}

export function AvatarSelector({ selectedId, onSelect, compact = false }: AvatarSelectorProps) {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filters = ['All', 'Women', 'Men', 'Calm', 'Energetic', 'Friendly', 'Focused'];

  const filteredAvatars = useMemo(() => {
    const q = search.toLowerCase().trim();
    return AVATARS.filter(a => {
      const matchSearch = !q || 
                          a.name.toLowerCase().includes(q) || 
                          a.description.toLowerCase().includes(q) ||
                          a.style.toLowerCase().includes(q) ||
                          (a.tags && a.tags.some(t => t.toLowerCase().includes(q)));
      
      let matchFilter = true;
      if (filter === 'Women') matchFilter = a.gender === 'female';
      else if (filter === 'Men') matchFilter = a.gender === 'male';
      else if (filter !== 'All') matchFilter = a.style === filter.toLowerCase();

      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const selectedAvatar = AVATARS.find(a => a.id === selectedId) || AVATARS[0];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Preview Panel - only show on desktop if not compact, or show always if requested */}
      {!compact && (
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-card border border-border rounded-3xl shrink-0">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50 p-2 shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300">
            <AvatarImage src={selectedAvatar.image} alt="Avatar Preview" className="w-full h-full object-cover rounded-full" />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-text w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#070B1F] shadow-lg">
              <Check size={20} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search avatars..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-card/90 border border-border/80 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl pl-10 pr-4 text-sm font-medium focus:outline-none transition-all text-primary-text placeholder:text-muted/70"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                  filter === f ? "bg-primary text-background shadow-glow-primary" : "bg-card border border-border text-muted hover:bg-primary-text/10 hover:text-primary-text"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className={cn("grid gap-3 sm:gap-4 overflow-y-auto pr-2 scrollbar-hide", compact ? "grid-cols-4 sm:grid-cols-5 h-48" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 h-[400px]")}>
          {filteredAvatars.map(avatar => {
            const isSelected = selectedId === avatar.id;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => onSelect(avatar.id)}
                className={cn(
                  "relative group flex flex-col items-center gap-2 p-2 rounded-2xl transition-all border",
                  isSelected ? "bg-primary/10 border-primary shadow-glow-primary" : "bg-card border-transparent hover:bg-primary-text/10"
                )}
              >
                <div className={cn(
                  "relative rounded-full transition-all duration-300 overflow-hidden",
                  compact ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20",
                  isSelected ? "p-1 bg-gradient-to-br from-primary to-accent scale-105" : "bg-primary-text/10 group-hover:scale-105"
                )}>
                  <div className="w-full h-full bg-background rounded-full overflow-hidden">
                    <AvatarImage src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                {isSelected && compact && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-text w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#070B1F]">
                    <Check size={10} />
                  </div>
                )}
              </button>
            );
          })}

          {filteredAvatars.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted text-sm font-bold">
              No avatars found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
