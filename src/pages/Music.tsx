import { useState, useMemo, useEffect } from 'react';
import { useMusic } from '@/context/MusicContext';
import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { 
  Search, 
  Play, 
  Heart, 
  Headphones, 
  Clock, 
  Music as MusicIcon,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = ['All', 'English', 'తెలుగు', 'हिन्दी', 'தமிழ்'];

const MOODS = [
  { label: 'All Moods', emoji: '🌟', value: 'All' },
  { label: 'Happy', emoji: '😊', value: 'Happy' },
  { label: 'Calm', emoji: '😌', value: 'Calm' },
  { label: 'Relaxed', emoji: '💜', value: 'Relaxed' },
  { label: 'Focus', emoji: '🎯', value: 'Focus' },
  { label: 'Energetic', emoji: '⚡', value: 'Energetic' },
  { label: 'Sad', emoji: '😔', value: 'Sad' },
  { label: 'Stressed', emoji: '😰', value: 'Stressed' },
  { label: 'Sleep', emoji: '😴', value: 'Sleep' },
  { label: 'Meditation', emoji: '🧘', value: 'Meditation' }
];

export default function Music() {
  const { 
    songs, 
    currentSong, 
    isPlaying, 
    playSong, 
    toggleFavorite, 
    addToQueue,
    selectedLanguage,
    setSelectedLanguage,
    selectedMood,
    setSelectedMood,
    searchQuery,
    setSearchQuery,
    recentlyPlayed,
    groqSongs,
    loadGroqRecommendations
  } = useMusic();

  const { userData } = useWellness();
  const [activeTab, setActiveTab] = useState<'catalog' | 'favorites' | 'recent'>('catalog');

  // Helper to reset filters
  const resetFilters = () => {
    setSelectedLanguage('All');
    setSelectedMood('All');
    setSearchQuery('');
    setActiveTab('catalog');
  };

  const isFiltered = selectedLanguage !== 'All' || selectedMood !== 'All' || activeTab !== 'catalog' || searchQuery !== '';

  // Latest mood check-in
  const latestMood = userData.moodHistory[userData.moodHistory.length - 1]?.mood;

  // Recommended songs based on latest mood or default Calm
  // const recommendedSongs = useMemo(() => {
  //   let targetMood = 'Calm';
  //   if (latestMood === 'Stressed' || latestMood === 'Anxious' || latestMood === 'Frustrated') targetMood = 'Calm';
  //   else if (latestMood === 'Happy' || latestMood === 'Excited') targetMood = 'Happy';
  //   else if (latestMood === 'Tired') targetMood = 'Energetic';
  //   else if (latestMood === 'Sad') targetMood = 'Relaxed';
    
  //   return songs.filter(s => s.mood === targetMood).slice(0, 6);
  // }, [songs, latestMood]);
  const targetMood = useMemo(() => {
  if (latestMood === 'Stressed' || latestMood === 'Anxious' || latestMood === 'Frustrated') {
    return 'Calm';
  }

  if (latestMood === 'Happy' || latestMood === 'Excited') {
    return 'Happy';
  }

  if (latestMood === 'Tired') {
    return 'Energetic';
  }

  if (latestMood === 'Sad') {
    return 'Relaxed';
  }

  return 'Calm';
}, [latestMood]);

useEffect(() => {
  loadGroqRecommendations(targetMood);
}, [targetMood]);

const recommendedSongs = useMemo(() => {
  if (groqSongs.length > 0) {
    return groqSongs;
  }

  return songs.filter(s => s.mood === targetMood).slice(0, 6);
}, [groqSongs, songs, targetMood]);

  // Filtered song catalog
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesLang = selectedLanguage === 'All' || song.language === selectedLanguage;
      const matchesMood = selectedMood === 'All' || song.mood === selectedMood;
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            song.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            song.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            song.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ((song as any).category && (song as any).category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesLang && matchesMood && matchesSearch;
    });
  }, [songs, selectedLanguage, selectedMood, searchQuery]);

  const favorites = songs.filter(s => s.favorite);

  return (
    <div className="space-y-8 pb-32 text-primary-text">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        {isFiltered ? (
          <BackButton label="Back to All Music" onClick={resetFilters} />
        ) : (
          <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Headphones size={14} /> Music
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">MUSIC EXPERIENCE</h2>
          <p className="text-muted font-bold tracking-tight">Personalized soundscapes and calming music selected to match your mood and wellness goals.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search songs, artists, mood..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-card/90 border border-border/80 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl pl-12 pr-6 text-sm font-medium focus:outline-none transition-all text-primary-text placeholder:text-muted/70"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0", activeTab === 'catalog' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          Music Library
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0 flex items-center gap-2", activeTab === 'favorites' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          <Heart size={14} /> My Favorites ({favorites.length})
        </button>
        <button 
          onClick={() => setActiveTab('recent')}
          className={cn("px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all shrink-0 flex items-center gap-2", activeTab === 'recent' ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary-text")}
        >
          <Clock size={14} /> Recently Played ({recentlyPlayed.length})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-12">
          {/* Mood Recommendation Section */}
          <GlassCard className="p-8 border border-primary/30 relative overflow-hidden bg-gradient-to-r from-primary/15 via-accent/10 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">YOUR MUSIC FOR YOU</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                  {latestMood ? `Based on your mood: ${latestMood}` : 'Choose your mood to get personalized music'}
                </h3>
                <p className="text-xs text-muted font-medium mt-1">Music and soundscapes selected for your current mood and wellness needs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedSongs.map(song => {
                const isCurrent = currentSong?.id === song.id;
                const playingThis = isCurrent && isPlaying;
                return (
                  <div 
                    key={song.id}
                    onClick={() => playSong(song)}
                    className={cn(
                      "group flex items-center gap-4 p-3 rounded-2xl bg-card border transition-all cursor-pointer hover:border-primary/50",
                      isCurrent ? "border-primary bg-primary/10 shadow-glow-primary" : "border-border hover:bg-primary-text/10"
                    )}
                  >
                    {/* Cover Art primary interaction */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border">
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={18} className="text-primary-text ml-0.5" />
                      </div>
                      {playingThis && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <Volume2 size={20} className="text-primary animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary block truncate">{song.language} • {song.mood}</span>
                      <h4 className="font-bold text-xs sm:text-sm tracking-tight truncate text-primary-text">{song.title}</h4>
                      <p className="text-[10px] text-muted truncate">{song.artist}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Language Selection Filters (English, తెలుగు, हिन्दी, தமிழ்) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted">Select Language</h4>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={cn(
                    "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shrink-0 border",
                    selectedLanguage === lang ? "bg-primary text-background border-primary shadow-glow-primary" : "bg-card border-border text-muted hover:bg-primary-text/10 hover:text-primary-text"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Filters */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted">Select Mood & Vibe</h4>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMood(m.value)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 border flex items-center gap-2",
                    selectedMood === m.value ? "bg-accent/20 border-accent text-accent shadow-glow-accent" : "bg-card border-border text-muted hover:bg-primary-text/10 hover:text-primary-text"
                  )}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Songs Grid - NO track numbers */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight">
                {selectedLanguage} {selectedMood !== 'All' ? `• ${selectedMood}` : ''} ({filteredSongs.length} tracks)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSongs.map(song => {
                const isCurrent = currentSong?.id === song.id;
                const playingThis = isCurrent && isPlaying;
                return (
                  <GlassCard 
                    key={song.id} 
                    className={cn(
                      "p-5 flex flex-col justify-between group border transition-all relative overflow-hidden",
                      isCurrent ? "border-primary shadow-glow-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        {/* Cover Art Primary Interaction (Click to start at 00:00) */}
                        <div 
                          onClick={() => playSong(song)}
                          className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-lg border border-border group-hover:scale-105 transition-transform"
                        >
                          <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play size={24} className="text-primary-text ml-0.5" />
                          </div>
                          {playingThis && (
                            <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-primary">
                              <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Playing</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">{song.language}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent">{song.mood}</span>
                          </div>
                          <h4 
                            onClick={() => playSong(song)}
                            className="text-base font-black tracking-tight mb-1 truncate text-primary-text cursor-pointer hover:text-primary transition-colors"
                          >
                            {song.title}
                          </h4>
                          <p className="text-xs text-muted font-bold truncate mb-2">{song.artist}</p>
                          <p className="text-[10px] text-muted/70 truncate">{song.album}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(song.id);
                        }}
                        className={cn("p-2 rounded-xl transition-all cursor-pointer", song.favorite ? "text-accent bg-accent/25 shadow-glow-accent" : "text-muted hover:text-primary-text bg-card hover:bg-card/80")}
                        title={song.favorite ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Heart size={16} fill={song.favorite ? 'currentColor' : 'none'} />
                      </button>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(song);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-card hover:bg-primary-text/10 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary-text transition-colors"
                          title="Add to Queue"
                        >
                          + Queue
                        </button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playSong(song);
                          }}
                          className="h-9 px-4 rounded-xl bg-primary text-background font-black text-xs uppercase tracking-wider shadow-glow-primary hover:opacity-90"
                        >
                          {playingThis ? 'Pause' : 'Play'}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {filteredSongs.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <MusicIcon size={48} className="mx-auto text-muted animate-pulse" />
                <h4 className="text-lg font-bold">No music found</h4>
                <p className="text-xs text-muted">Try another song, artist, language, or mood.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black tracking-tight">My Favorites ({favorites.length})</h3>
          {favorites.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-4">
              <Heart size={48} className="mx-auto text-muted" />
              <h4 className="text-lg font-bold">No favorite tracks saved yet</h4>
              <p className="text-xs text-muted">Click the heart icon on any song card to save it here.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(song => (
                <GlassCard key={song.id} className="p-5 flex flex-col justify-between group border border-border relative">
                  <button 
                    onClick={() => toggleFavorite(song.id)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-accent bg-accent/25 hover:bg-accent/35 transition-all cursor-pointer"
                    title="Remove from Favorites"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                  <div className="flex items-center gap-4 mb-4 pr-8">
                    <img src={song.coverUrl} alt={song.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{song.language}</span>
                      <h4 className="font-bold text-sm text-primary-text truncate">{song.title}</h4>
                      <p className="text-xs text-muted truncate">{song.artist}</p>
                    </div>
                  </div>
                  <Button onClick={() => playSong(song)} className="w-full h-10 rounded-xl bg-primary text-background font-black text-xs uppercase tracking-wider">
                    Play Track
                  </Button>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black tracking-tight">Recently Played</h3>
          {recentlyPlayed.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-4">
              <Clock size={48} className="mx-auto text-muted" />
              <h4 className="text-lg font-bold">No playback history yet.</h4>
              <p className="text-xs text-muted">Start playing songs from the catalog to see your history here.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {recentlyPlayed.map((song, idx) => (
                <div key={`${song.id}-${idx}`} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-4">
                    <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold tracking-tight text-primary-text">{song.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                        {song.artist} • {song.language} • {song.mood}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => playSong(song)} className="h-9 px-5 rounded-xl bg-primary text-background font-black text-xs uppercase tracking-wider">
                    Play Again
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
