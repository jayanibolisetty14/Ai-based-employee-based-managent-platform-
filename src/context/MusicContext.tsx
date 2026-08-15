import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song, MUSIC_CATALOG } from '../data/musicCatalog';
import { useWellness } from './WellnessContext';

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'completed' | 'error';

interface MusicContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  playerState: PlayerState;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  recentlyPlayed: Song[];
  errorMsg: string | null;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleFavorite: (songId: string) => void;
  addToQueue: (song: Song) => void;
  playNextInQueue: (song: Song) => void;
  retryPlayback: () => void;
  stopPlayback: () => void;
  closePlayer: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, updateMusicStats } = useWellness();

  const [songs, setSongs] = useState<Song[]>(() => {
    const favIds = userData.musicStats?.favorites || [];
    return MUSIC_CATALOG.map(s => ({ ...s, favorite: favIds.includes(s.id) }));
  });

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [queue, setQueue] = useState<Song[]>([]);
  
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    const recentIds = userData.musicStats?.recentlyPlayed || [];
    return recentIds.map(id => MUSIC_CATALOG.find(s => s.id === id)).filter(Boolean) as Song[];
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const queueRef = useRef<Song[]>([]);
  const selectedLanguageRef = useRef<string>('All');
  const currentSongRef = useRef<Song | null>(null);
  const songsRef = useRef<Song[]>([]);
  
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setPlayerState('completed');
      setIsPlaying(false);
      // Auto play next in queue or mood list
      if (queueRef.current.length > 0) {
        const next = queueRef.current[0];
        setQueue(q => q.slice(1));
        playSong(next);
      } else {
        // Play next matching song in current filter
        const list = songsRef.current.filter(s => selectedLanguageRef.current === 'All' || s.language === selectedLanguageRef.current);
        if (list.length > 0) {
          const currentIndex = currentSongRef.current ? list.findIndex(s => s.id === currentSongRef.current!.id) : -1;
          const nextIndex = (currentIndex + 1) % list.length;
          playSong(list[nextIndex]);
        }
      }
    };

    const handleError = () => {
      setPlayerState('error');
      setIsPlaying(false);
      const audio = audioRef.current;
      if (audio && audio.error && (audio.error.code === 3 || audio.error.code === 4)) {
        setErrorMsg("Audio unavailable. This track doesn't have a playable audio source yet.");
      } else {
        setErrorMsg('Unable to play this track right now. Try Again');
      }
    };

    const handleWaiting = () => {
      setPlayerState('buffering');
    };

    const handlePlaying = () => {
      setPlayerState('playing');
      setIsPlaying(true);
      setErrorMsg(null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save favorites
  useEffect(() => {
    const favIds = songs.filter(s => s.favorite).map(s => s.id);
    updateMusicStats({ favorites: favIds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]);

  // Save recently played
  useEffect(() => {
    const recentIds = recentlyPlayed.slice(0, 20).map(s => s.id);
    updateMusicStats({ recentlyPlayed: recentIds, lastPlayedDate: new Date().toISOString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlyPlayed]);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;
    
    // Stop previous track, reset to 0
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setCurrentSong(song);
    setPlayerState('loading');
    setErrorMsg(null);

    audioRef.current.src = song.audioUrl;
    audioRef.current.load();

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setPlayerState('playing');
      // Add to recently played (avoid duplicates at the top)
      setRecentlyPlayed(prev => [song, ...prev.filter(s => s.id !== song.id)]);
    }).catch((err) => {
      setPlayerState('error');
      setIsPlaying(false);
      if (err.name === 'NotSupportedError') {
        setErrorMsg("Audio unavailable. This track doesn't have a playable audio source yet.");
      } else {
        setErrorMsg('Unable to play this track right now. Try Again');
      }
    });
  };

  const retryPlayback = () => {
    if (currentSong) {
      playSong(currentSong);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayerState('paused');
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setPlayerState('playing');
        setErrorMsg(null);
      }).catch((err) => {
        setPlayerState('error');
        if (err.name === 'NotSupportedError') {
          setErrorMsg("Audio unavailable. This track doesn't have a playable audio source yet.");
        } else {
          setErrorMsg('Unable to play this track right now. Try Again');
        }
      });
    }
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleFavorite = (songId: string) => {
    setSongs(prev => prev.map(s => s.id === songId ? { ...s, favorite: !s.favorite } : s));
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const playNextInQueue = (song: Song) => {
    setQueue(prev => [song, ...prev]);
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(q => q.slice(1));
      playSong(next);
      return;
    }
    playNextDefault();
  };

  const previousSong = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    // Play previous from recently played or catalog
    if (recentlyPlayed.length > 1 && currentSong) {
      const currentIndex = recentlyPlayed.findIndex(s => s.id === currentSong.id);
      if (currentIndex !== -1 && currentIndex + 1 < recentlyPlayed.length) {
        playSong(recentlyPlayed[currentIndex + 1]);
        return;
      }
    }
    // Fallback to first song in catalog
    if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  const playNextDefault = () => {
    const list = songs.filter(s => selectedLanguage === 'All' || s.language === selectedLanguage);
    if (list.length === 0) return;
    const currentIndex = currentSong ? list.findIndex(s => s.id === currentSong.id) : -1;
    const nextIndex = (currentIndex + 1) % list.length;
    playSong(list[nextIndex]);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setPlayerState('idle');
    setCurrentSong(null);
    setCurrentTime(0);
    setErrorMsg(null);
  };

  const closePlayer = () => {
    stopPlayback();
  };

  return (
    <MusicContext.Provider value={{
      songs,
      currentSong,
      isPlaying,
      playerState,
      currentTime,
      duration,
      volume,
      queue,
      recentlyPlayed,
      errorMsg,
      playSong,
      togglePlayPause,
      nextSong,
      previousSong,
      seekTo,
      setVolume,
      toggleFavorite,
      addToQueue,
      playNextInQueue,
      retryPlayback,
      stopPlayback,
      closePlayer,
      selectedLanguage,
      setSelectedLanguage,
      selectedMood,
      setSelectedMood,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </MusicContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};
