import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/common/GlassCard';
import { BackButton } from '@/components/common/BackButton';
import { 
  Send, 
  Brain, 
  User, 
  Bot,
  ShieldCheck,
  ChevronRight,
  Mic,
  MessageSquare,
  Activity,
  Loader2,
  Wind,
  Music,
  BookOpen,
  Smile,
  Target,
  Zap,
  Moon,
  Droplets,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useWellness } from '@/context/WellnessContext';
import { useAuth } from '@/context/AuthContext';
import { getMentorSummary, getChatResponse, Recommendation } from '@/lib/recommendationEngine';

interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
  timestamp: string;
  action?: Recommendation;
}

type MicState = 'idle' | 'listening' | 'processing' | 'ready';

export default function AIMentor() {
  const navigate = useNavigate();
  const { userData } = useWellness();
  const { user } = useAuth();
  
  const userSessionKey = user?.email ? `mood_mentor_chat_${user.email.toLowerCase()}` : 'mood_mentor_chat_session';
  const initialSummary = useMemo(() => getMentorSummary(userData), [userData]);
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(userSessionKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [
      { 
        role: 'bot', 
        content: initialSummary, 
        timestamp: new Date().toISOString() 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [micState, setMicState] = useState<MicState>('idle');
  const [micError, setMicError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Sync initial message if user just started and userData changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'bot') {
        return [
          {
            role: 'bot',
            content: initialSummary,
            timestamp: prev[0].timestamp || new Date().toISOString()
          }
        ];
      }
      return prev;
    });
  }, [initialSummary]);

  // Persist messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(userSessionKey, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages, userSessionKey]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = userData?.languagePreference === 'te' ? 'te-IN' : 'en-US';

        recognition.onstart = () => {
          setMicState('listening');
          setMicError(null);
        };

        recognition.onresult = (event: any) => {
          setMicState('processing');
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInput(prev => {
              const trimmed = prev.trim();
              return trimmed ? `${trimmed} ${transcript}` : transcript;
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error', event.error);
          setMicState('idle');
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicError('Microphone permission denied. Please allow microphone access in your browser.');
          } else if (event.error === 'no-speech') {
            // Silently reset
          } else {
            setMicError(`Voice input: ${event.error}`);
          }
          setTimeout(() => setMicError(null), 4000);
        };

        recognition.onend = () => {
          setMicState('ready');
          setTimeout(() => {
            setMicState('idle');
          }, 600);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Could not initialize SpeechRecognition:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [userData?.languagePreference]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setMicError('Speech recognition is not supported in this browser. Please type your message.');
      setTimeout(() => setMicError(null), 3500);
      return;
    }

    if (micState === 'listening' || micState === 'processing') {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setMicState('idle');
    } else {
      try {
        setMicError(null);
        setMicState('listening');
        recognitionRef.current.start();
      } catch (e: any) {
        console.warn('Recognition start exception:', e);
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch {
              setMicState('idle');
            }
          }, 200);
        } catch {
          setMicState('idle');
        }
      }
    }
  };

  const handleSend = (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    if (micState === 'listening') {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setMicState('idle');
    }
    
    const userMsg: ChatMessage = { role: 'user', content: textToSend.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Response based on real data
    setTimeout(() => {
      const responseObj = getChatResponse(textToSend, userData);
      
      const botMsg: ChatMessage = { 
        role: 'bot', 
        content: responseObj.content, 
        timestamp: new Date().toISOString(),
        action: responseObj.action
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const getActionIcon = (action: any) => {
    if (typeof action?.icon === 'function') {
      return action.icon;
    }
    const path = String(action?.path || '').toLowerCase();
    const id = String(action?.id || '').toLowerCase();
    if (path.includes('music')) return Music;
    if (path.includes('breathing') || path.includes('breathe')) return Wind;
    if (path.includes('journal')) return BookOpen;
    if (path.includes('mind-gym') || path.includes('brain') || id.includes('mind-gym')) return Brain;
    if (path.includes('smile') || path.includes('joke')) return Smile;
    if (path.includes('goals') || path.includes('goal')) return Target;
    if (path.includes('achievements') || path.includes('ach')) return Zap;
    if (path.includes('sleep')) return Moon;
    if (path.includes('hydration') || path.includes('water')) return Droplets;
    if (path.includes('mood') || path.includes('checkin')) return Smile;
    return Sparkles;
  };

  const handleActionClick = (action: Recommendation) => {
    navigate(action.path);
  };

  // Data Calculations for Analysis Panel
  const latestMoodEntry = userData.moodHistory[0];
  const hasData = userData.moodHistory.length > 0;

  const today = new Date().toDateString();
  const hydrationLog = userData.hydration.logs.find(l => new Date(l.timestamp).toDateString() === today);
  const currentWater = hydrationLog ? hydrationLog.amount : 0;
  const waterGoal = userData.hydration.dailyGoal;

  return (
    <div className="min-h-screen pb-20 text-primary-text">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
          
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Private Wellness Session</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] border border-white/20">
                <Brain className="text-white" size={36} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#05091C] rounded-full flex items-center justify-center border-2 border-background">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-1 uppercase">AI Mentor</h1>
              <p className="text-muted font-bold tracking-tight flex items-center gap-2">
                Your personalized wellness companion
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 flex flex-col h-[650px] space-y-4">
            <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-primary/10 shadow-2xl relative">
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth scrollbar-hide"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 15, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={cn(
                        "flex gap-4",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border",
                        msg.role === 'bot' 
                          ? "bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-400 text-white" 
                          : "bg-white/5 border-white/10 text-primary-text"
                      )}>
                        {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
                      </div>

                      <div className="flex flex-col space-y-2.5 max-w-[85%] md:max-w-[75%]">
                        <div className={cn(
                          "p-4 md:p-5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap",
                          msg.role === 'bot' 
                            ? "bg-[#0A1128] border border-white/5 text-primary-text/90 rounded-tl-none" 
                            : "bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 rounded-tr-none"
                        )}>
                          {msg.content}
                        </div>
                        
                        {/* Bot Action Suggestion */}
                        {(msg as any).action && (() => {
                          const actionObj = (msg as any).action;
                          const ActionIcon = getActionIcon(actionObj);
                          return (
                            <motion.button
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={() => handleActionClick(actionObj)}
                              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", actionObj.bg || "bg-cyan-500/10", actionObj.color || "text-cyan-400")}>
                                  <ActionIcon size={16} />
                                </div>
                                <span className="text-xs font-bold text-primary-text">{actionObj.title}</span>
                              </div>
                              <ChevronRight size={14} className="text-muted group-hover:text-cyan-400 transition-all" />
                            </motion.button>
                          );
                        })()}

                        <span className={cn(
                          "text-[9px] font-bold text-muted uppercase tracking-widest",
                          msg.role === 'user' ? "text-right" : "text-left"
                        )}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      <Bot size={20} className="text-cyan-400 animate-pulse" />
                    </div>
                    <div className="flex gap-1.5 items-center p-5 bg-[#0A1128] border border-white/5 rounded-2xl rounded-tl-none">
                      <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 space-y-3">
                {/* Initial New User State Buttons */}
                {!hasData && messages.length === 1 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    <button 
                      onClick={() => navigate('/mood-checkin')}
                      className="px-4 py-2 bg-cyan-500 text-background rounded-full text-xs font-bold hover:bg-cyan-400 transition-all"
                    >
                      Check In Now
                    </button>
                    <button 
                      onClick={() => navigate('/wellness')}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:bg-white/10 transition-all"
                    >
                      Explore Wellness Hub
                    </button>
                  </div>
                )}

                {micError && (
                  <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-medium text-red-400">
                    {micError}
                  </div>
                )}

                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder={micState === 'listening' ? "Listening to your voice..." : micState === 'processing' ? "Processing speech..." : "Ask your mentor anything..."}
                        className={cn(
                          "w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 text-sm font-medium text-primary-text placeholder:text-muted/50 focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-xl",
                          micState === 'listening' && "border-red-500/50 bg-red-500/5 placeholder:text-red-400/70",
                          micState === 'processing' && "border-cyan-500/50 bg-cyan-500/5"
                        )}
                      />
                      <button 
                        type="button"
                        onClick={toggleListening}
                        title={micState === 'listening' ? "Stop listening" : "Speak to your mentor"}
                        className={cn(
                          "absolute right-4 top-1/2 -translate-y-1/2 p-2 transition-colors rounded-full",
                          micState === 'listening' ? "text-red-400 bg-red-400/20 animate-pulse ring-2 ring-red-400/40" : 
                          micState === 'processing' ? "text-cyan-400 bg-cyan-400/10 animate-spin" :
                          micState === 'ready' ? "text-emerald-400 bg-emerald-400/10" :
                          "text-muted hover:text-cyan-400"
                        )}
                      >
                        {micState === 'processing' ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Mic size={20} />
                        )}
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:grayscale disabled:opacity-30",
                        input.trim() 
                          ? "bg-cyan-500 text-background shadow-cyan-500/25 hover:bg-cyan-400" 
                          : "bg-white/10 text-muted border border-white/5"
                      )}
                    >
                      <Send size={22} className={cn(input.trim() ? "translate-x-0.5" : "")} />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 space-y-6 border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                <Activity size={14} /> Quick Analysis
              </h3>
              
              {hasData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 transition-colors group-hover:text-cyan-400">Current Mood</p>
                    <p className="text-lg font-black text-primary-text">{latestMoodEntry.mood}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 transition-colors group-hover:text-cyan-400">Water Goal</p>
                    <p className="text-lg font-black text-primary-text">{currentWater}/{waterGoal}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 transition-colors group-hover:text-cyan-400">Streak</p>
                    <p className="text-lg font-black text-primary-text">{userData.profile.currentStreak} Days</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 transition-colors group-hover:text-cyan-400">Level</p>
                    <p className="text-lg font-black text-primary-text">Lv {userData.profile.level}</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center space-y-3">
                  <MessageSquare size={32} className="mx-auto text-muted/30" />
                  <p className="text-xs font-bold text-muted">No analysis available yet</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
