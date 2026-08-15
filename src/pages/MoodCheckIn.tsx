import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Moon, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { useWellness } from '@/context/WellnessContext';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { TextArea } from '@/components/common/Input';
import { MoodLevel } from '@/types';
import { cn } from '@/lib/utils';

const moodOptions: { 
  level: MoodLevel; 
  emoji: string; 
  borderColor: string;
  activeBg: string;
  glow: string; 
  label: string 
}[] = [
  { 
    level: 'Great', 
    emoji: '🌟', 
    borderColor: 'border-cyan-400',
    activeBg: 'bg-cyan-400/10',
    glow: 'shadow-[0_0_40px_rgba(34,211,238,0.2)]', 
    label: 'Great' 
  },
  { 
    level: 'Good', 
    emoji: '😊', 
    borderColor: 'border-emerald-400',
    activeBg: 'bg-emerald-400/10',
    glow: 'shadow-[0_0_40px_rgba(52,211,153,0.2)]', 
    label: 'Good' 
  },
  { 
    level: 'Calm', 
    emoji: '😌', 
    borderColor: 'border-teal-400',
    activeBg: 'bg-teal-400/10',
    glow: 'shadow-[0_0_40px_rgba(45,212,191,0.2)]', 
    label: 'Calm' 
  },
  { 
    level: 'Happy', 
    emoji: '😄', 
    borderColor: 'border-amber-400',
    activeBg: 'bg-amber-400/10',
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.2)]', 
    label: 'Happy' 
  },
  { 
    level: 'Excited', 
    emoji: '🤩', 
    borderColor: 'border-orange-500',
    activeBg: 'bg-orange-500/10',
    glow: 'shadow-[0_0_40px_rgba(249,115,22,0.2)]', 
    label: 'Excited' 
  },
  { 
    level: 'Okay', 
    emoji: '😐', 
    borderColor: 'border-yellow-500',
    activeBg: 'bg-yellow-500/10',
    glow: 'shadow-[0_0_40px_rgba(234,179,8,0.2)]', 
    label: 'Okay' 
  },
  { 
    level: 'Tired', 
    emoji: '🥱', 
    borderColor: 'border-indigo-400',
    activeBg: 'bg-indigo-400/10',
    glow: 'shadow-[0_0_40px_rgba(129,140,248,0.2)]', 
    label: 'Tired' 
  },
  { 
    level: 'Sad', 
    emoji: '😔', 
    borderColor: 'border-blue-500',
    activeBg: 'bg-blue-500/10',
    glow: 'shadow-[0_0_40px_rgba(59,130,246,0.2)]', 
    label: 'Sad' 
  },
  { 
    level: 'Anxious', 
    emoji: '😰', 
    borderColor: 'border-purple-500',
    activeBg: 'bg-purple-500/10',
    glow: 'shadow-[0_0_40px_rgba(168,85,247,0.2)]', 
    label: 'Anxious' 
  },
  { 
    level: 'Frustrated', 
    emoji: '😠', 
    borderColor: 'border-red-500',
    activeBg: 'bg-red-500/10',
    glow: 'shadow-[0_0_40px_rgba(239,68,68,0.2)]', 
    label: 'Frustrated' 
  },
  { 
    level: 'Lonely', 
    emoji: '😞', 
    borderColor: 'border-violet-600',
    activeBg: 'bg-violet-600/10',
    glow: 'shadow-[0_0_40px_rgba(124,58,237,0.2)]', 
    label: 'Lonely' 
  },
  { 
    level: 'Stressed', 
    emoji: '😫', 
    borderColor: 'border-cyan-500',
    activeBg: 'bg-cyan-500/10',
    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.2)]', 
    label: 'Stressed' 
  }
];

const SECONDARY_EMOTIONS = [
  'Peaceful', 'Hopeful', 'Motivated', 'Confident',
  'Grateful', 'Focused', 'Overwhelmed', 'Restless',
  'Bored', 'Irritated', 'Worried', 'Drained'
];

export default function MoodCheckIn() {
  const navigate = useNavigate();
  const { addMoodCheckIn } = useWellness();
  
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleep, setSleep] = useState(8);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleSecondary = (emotion: string) => {
    if (selectedSecondary.includes(emotion)) {
      setSelectedSecondary(selectedSecondary.filter(e => e !== emotion));
    } else {
      if (selectedSecondary.length < 3) {
        setSelectedSecondary([...selectedSecondary, emotion]);
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    addMoodCheckIn({
      mood: selectedMood,
      energyLevel: energy,
      stressLevel: stress,
      sleepDuration: sleep,
      note: note,
      tags: selectedSecondary
    });
    
    setIsSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (isSubmitted) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="text-primary w-12 h-12" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black mb-4"
        >
          Inner Peace <span className="text-primary italic">Logged.</span>
        </motion.h2>
        <p className="text-muted font-bold">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-8 text-primary-text min-h-[80vh] flex flex-col">
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/80 animate-pulse">
          CHECK-IN • STEP {step} OF 3
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight pt-1">
          {step === 1 ? "How are you feeling today?" : step === 2 ? "The Vital Check" : "Final Touches"}
        </h2>
        <p className="text-sm sm:text-base text-muted font-bold tracking-tight max-w-lg mx-auto">
          {step === 1 
            ? "Choose the mood that best describes how you feel right now." 
            : step === 2 
            ? "Tune into your body and mind levels for a deeper analysis."
            : "Capture any extra details to complete your daily reflection."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* 12 Moods Grid: Desktop 4 columns, Tablet 3 columns, Mobile 2 columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-4">
              {moodOptions.map((option) => {
                const isSelected = selectedMood === option.level;
                return (
                  <button
                    key={option.level}
                    onClick={() => setSelectedMood(option.level)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-[32px] border transition-all duration-300 group overflow-hidden",
                      isSelected 
                        ? cn(option.activeBg, option.borderColor, option.glow, "border-2 scale-[1.02] shadow-cyan-500/20") 
                        : "bg-white/[0.04] border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-[#05091C] text-[12px] font-black shadow-lg animate-in zoom-in duration-300">
                        ✓
                      </div>
                    )}
                    <div className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-[36px] sm:text-[42px] mb-4 transition-transform duration-300 group-hover:scale-110",
                      isSelected ? "scale-110" : ""
                    )}>
                      {option.emoji}
                    </div>
                    <span className={cn(
                      "text-[12px] font-black uppercase tracking-[0.2em] transition-colors duration-300",
                      isSelected ? "text-cyan-400" : "text-muted group-hover:text-primary-text"
                    )}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center pt-10 mt-auto">
              <Button 
                size="xl" 
                className={cn(
                  "h-16 px-16 rounded-[24px] shadow-2xl transition-all duration-300 font-black uppercase tracking-widest",
                  !selectedMood 
                    ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                    : "bg-cyan-500 text-[#05091C] shadow-cyan-500/30 hover:bg-cyan-400 hover:scale-105"
                )}
                disabled={!selectedMood}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="ml-3" size={20} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="space-y-10 max-w-2xl mx-auto flex-1 flex flex-col justify-center w-full"
          >
            <div className="space-y-12 py-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-[0.2em] text-sm">Energy Level</h3>
                      <p className="text-[10px] font-bold text-muted uppercase">How active do you feel?</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-cyan-400">{energy}</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={energy} 
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-400 border border-white/5"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-[0.2em] text-sm">Stress Level</h3>
                      <p className="text-[10px] font-bold text-muted uppercase">Intensity of pressure</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-purple-400">{stress}</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={stress} 
                  onChange={(e) => setStress(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-400 border border-white/5"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Moon size={24} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-[0.2em] text-sm">Sleep Duration</h3>
                      <p className="text-[10px] font-bold text-muted uppercase">Hours of rest</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-indigo-400">{sleep}h</span>
                </div>
                <input 
                  type="range" min="1" max="14" value={sleep} 
                  onChange={(e) => setSleep(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-400 border border-white/5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-10">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <Button 
                size="xl" 
                className="h-16 px-12 rounded-[24px] bg-cyan-500 text-[#05091C] font-black uppercase tracking-widest hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="space-y-10 max-w-2xl mx-auto flex-1 flex flex-col justify-center w-full"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted mb-2">What else are you feeling?</h3>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">Select up to 3 secondary emotions</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {SECONDARY_EMOTIONS.map((emotion) => {
                    const isSelected = selectedSecondary.includes(emotion);
                    return (
                      <button
                        key={emotion}
                        onClick={() => toggleSecondary(emotion)}
                        className={cn(
                          "px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                          isSelected 
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/10 scale-105" 
                            : "bg-white/5 border-white/5 text-muted hover:border-white/20 hover:text-white"
                        )}
                      >
                        {emotion} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-white/5 my-8" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare size={16} className="text-cyan-400" />
                  <h3 className="font-black uppercase tracking-[0.15em] text-[11px] text-muted">Journal Note (Optional)</h3>
                </div>
                <TextArea 
                  placeholder="What is on your mind right now?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/10 rounded-2xl p-6 text-sm font-medium placeholder:text-muted/30 focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-10">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <Button 
                size="xl" 
                className="h-16 px-12 rounded-[24px] bg-cyan-500 text-[#05091C] font-black uppercase tracking-widest hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
                onClick={handleSubmit}
              >
                Complete Reflection <CheckCircle2 className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
