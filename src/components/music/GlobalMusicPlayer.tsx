import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  ListMusic, 
  Repeat, 
  Shuffle,
  AlertCircle,
  Loader2,
  Music as MusicIcon,
  ArrowLeft,
  X
} from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { cn } from '@/lib/utils';

export function GlobalMusicPlayer() {
  const navigate = useNavigate();
  const { 
    currentSong, 
    isPlaying, 
    playerState,
    currentTime, 
    duration, 
    volume, 
    queue,
    errorMsg,
    togglePlayPause, 
    nextSong, 
    previousSong, 
    seekTo, 
    setVolume, 
    toggleFavorite,
    retryPlayback,
    stopPlayback
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  if (!currentSong) return null;

  const handleBackClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-border px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Song Info & Cover + Back Button */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 md:w-1/4">
          <button
            type="button"
            onClick={handleBackClick}
            className="px-3 py-2 rounded-xl bg-card/80 hover:bg-card border border-border/80 hover:border-primary/50 text-primary-text shadow-sm hover:shadow-glow-primary transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 group focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            title="Back to previous page"
            aria-label="Back to previous page"
          >
            <ArrowLeft size={16} className="text-primary group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div 
            onClick={() => navigate('/music')}
            className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md shrink-0 border border-border cursor-pointer"
            title="Open Music Page"
          >
            <img 
              src={currentSong.coverUrl} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <MusicIcon size={18} className="text-primary-text" />
            </div>
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary animate-pulse" />
            )}
          </div>

          <div 
            onClick={() => navigate('/music')}
            className="min-w-0 flex-1 cursor-pointer group/info"
            title="Open Music Page"
          >
            <h4 className="font-black text-xs sm:text-sm tracking-tight truncate text-primary-text group-hover/info:text-primary transition-colors">{currentSong.title}</h4>
            <p className="text-[11px] text-muted font-bold truncate">{currentSong.artist}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-1.5 py-0.5 rounded bg-primary/20 text-[9px] font-black uppercase text-primary tracking-widest">{currentSong.language}</span>
              <span className="text-[10px] text-accent font-bold">• {currentSong.mood}</span>
            </div>
          </div>

          <button 
            onClick={() => toggleFavorite(currentSong.id)}
            className={cn("p-2 rounded-xl transition-all", currentSong.favorite ? "text-accent" : "text-muted hover:text-primary-text")}
          >
            <Heart size={18} fill={currentSong.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Center Controls & Progress */}
        <div className="flex flex-col items-center gap-2 w-full sm:w-2/4">
          <div className="flex items-center gap-6">
            <button className="text-muted hover:text-primary-text transition-colors hidden md:block" title="Shuffle">
              <Shuffle size={16} />
            </button>
            <button onClick={previousSong} className="text-primary-text hover:text-primary transition-colors" title="Previous">
              <SkipBack size={20} />
            </button>

            <button 
              onClick={togglePlayPause}
              disabled={playerState === 'loading'}
              className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center shadow-glow-primary hover:scale-105 transition-all disabled:opacity-50"
            >
              {playerState === 'loading' || playerState === 'buffering' ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="ml-0.5" />
              )}
            </button>

            <button onClick={nextSong} className="text-primary-text hover:text-primary transition-colors" title="Next">
              <SkipForward size={20} />
            </button>
            <button className="text-muted hover:text-primary-text transition-colors hidden md:block" title="Repeat">
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-[10px] font-bold text-muted w-8 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-2 bg-primary-text/10 rounded-full overflow-hidden group cursor-pointer">
              <input 
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-muted w-8">{formatTime(duration)}</span>
          </div>

          {/* Error State Banner inside player */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-2 text-[11px] text-accent font-bold animate-pulse w-full max-w-md text-center">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
              {!errorMsg.includes("doesn't have a playable audio source yet") && (
                <button onClick={retryPlayback} className="underline ml-1 hover:text-primary-text shrink-0">Try Again</button>
              )}
            </div>
          )}
        </div>

        {/* Right Volume, Queue & Close Button */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-1/4">
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleMute} className="text-muted hover:text-primary-text transition-colors" title={isMuted ? "Unmute" : "Mute"}>
              {volume === 0 || isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-20 accent-primary cursor-pointer h-1.5 bg-primary-text/10 rounded-full"
            />
          </div>

          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={cn("p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold", showQueue ? "bg-primary/20 border-primary text-primary" : "bg-card border-border text-muted hover:text-primary-text")}
            title="Playback Queue"
          >
            <ListMusic size={16} />
            <span className="hidden sm:inline">Queue ({queue.length})</span>
          </button>

          <button
            type="button"
            onClick={stopPlayback}
            className="p-2.5 rounded-xl bg-card hover:bg-destructive/20 border border-border hover:border-destructive/40 text-muted hover:text-destructive transition-all flex items-center justify-center shrink-0 cursor-pointer group"
            title="Close and dismiss music player"
            aria-label="Close music player"
          >
            <X size={16} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </div>

      {/* Queue Drawer */}
      {showQueue && (
        <div className="absolute bottom-20 right-4 w-80 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-3xl border border-border rounded-3xl p-4 shadow-2xl z-50 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h5 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
              <MusicIcon size={14} /> Playback Queue
            </h5>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted font-bold">{queue.length} songs upcoming</span>
              <button
                type="button"
                onClick={() => setShowQueue(false)}
                className="p-1 rounded-lg hover:bg-card text-muted hover:text-primary-text transition-colors"
                title="Close queue"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          {queue.length === 0 ? (
            <p className="text-xs text-muted text-center py-6">Queue is empty. Select songs to add them.</p>
          ) : (
            <div className="space-y-2">
              {queue.map((s, idx) => (
                <div key={`${s.id}-${idx}`} className="flex items-center gap-3 p-2 rounded-xl bg-card hover:bg-primary-text/10 transition-colors">
                  <img src={s.coverUrl} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs truncate text-primary-text">{s.title}</p>
                    <p className="text-[10px] text-muted truncate">{s.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
