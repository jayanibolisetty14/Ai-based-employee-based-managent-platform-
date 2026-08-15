import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';

interface BreathingRhythmProps {
  onComplete: (
    score: number, 
    xp: number, 
    details?: {
      score: number;
      xp: number;
      accuracy: number;
      timeTaken: number;
      difficulty: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master';
      correctAttempts?: number;
      totalAttempts?: number;
    }
  ) => void;
}

const PHASES = [
  { label: 'Inhale', instruction: 'Breathe in slowly through your nose...', duration: 4, scale: 1.5, color: '#00D9FF' },
  { label: 'Hold', instruction: 'Gently hold your breath in stillness...', duration: 4, scale: 1.5, color: '#7C3AED' },
  { label: 'Exhale', instruction: 'Release all tension through your mouth...', duration: 4, scale: 1, color: '#FF4FA3' },
  { label: 'Rest', instruction: 'Relax and pause at ease...', duration: 4, scale: 1, color: '#00D9FF' },
];

export const BreathingRhythm: React.FC<BreathingRhythmProps> = ({ onComplete }) => {
  const [sessionTime, setSessionTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle');

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const sessionTimeRef = useRef(sessionTime);
  sessionTimeRef.current = sessionTime;

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const finishSession = useCallback(() => {
    setStatus('finished');
    const sTime = sessionTimeRef.current;
    const tLeft = timeLeftRef.current;
    const actualElapsed = sTime ? (sTime * 60) - tLeft : 60;
    const finalCycles = Math.max(1, Math.floor(actualElapsed / 16));
    const score = Math.round(500 + finalCycles * 75);
    const xp = sTime === 1 ? 35 : sTime === 3 ? 65 : 90;
    const diff: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master' = 
      sTime === 5 ? 'Master' : sTime === 3 ? 'Focused' : 'Learner';

    onCompleteRef.current(score, xp, {
      score,
      xp,
      accuracy: 100,
      timeTaken: Math.max(30, actualElapsed),
      difficulty: diff,
      correctAttempts: finalCycles,
      totalAttempts: finalCycles
    });
  }, []);

  useEffect(() => {
    let timer: any;
    if (status === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            finishSession();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft, finishSession]);

  useEffect(() => {
    if (status === 'playing' && sessionTime !== null) {
      const elapsed = (sessionTime * 60) - timeLeft;
      const currentPhaseIdx = Math.floor((elapsed % 16) / 4);
      setPhaseIndex(currentPhaseIdx);
      setPhaseSecondsLeft(4 - (elapsed % 4));
      
      if (elapsed > 0 && elapsed % 16 === 0) {
        setCycles(c => c + 1);
      }
    }
  }, [timeLeft, status, sessionTime]);

  const startSession = (mins: number) => {
    setSessionTime(mins);
    setTimeLeft(mins * 60);
    setPhaseIndex(0);
    setPhaseSecondsLeft(4);
    setCycles(0);
    setStatus('playing');
  };

  if (status === 'idle') {
    return (
      <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto text-center">
        <div>
          <h3 className="text-xl font-black mb-1">Choose Session Duration</h3>
          <p className="text-xs text-muted">Box breathing resets parasympathetic tone in minutes.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 3, 5].map(m => (
            <Button 
              key={m} 
              variant="outline" 
              className="h-28 flex flex-col gap-2 rounded-2xl border-primary/20 hover:border-primary transition-all hover:scale-105" 
              onClick={() => startSession(m)}
            >
              <span className="text-3xl font-black text-primary">{m}</span>
              <span className="text-xs uppercase font-black tracking-widest text-muted">Minutes</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Telemetry bar */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <GlassCard className="p-3 flex items-center justify-center gap-2">
          <Clock className="text-primary" size={18} />
          <span className="font-bold text-sm">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </GlassCard>
        <GlassCard className="p-3 flex items-center justify-center gap-2">
          <Sparkles className="text-accent" size={18} />
          <span className="font-bold text-sm">{cycles} Cycles Completed</span>
        </GlassCard>
      </div>

      {/* Breathing Guide Animation */}
      <div className="relative flex flex-col items-center justify-center w-64 h-64 select-none">
        <motion.div
          animate={{ 
            scale: currentPhase.scale,
            backgroundColor: currentPhase.color,
            boxShadow: `0 0 60px ${currentPhase.color}55`
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-36 h-36 rounded-full opacity-25 blur-xl absolute"
        />

        <motion.div
          animate={{ scale: currentPhase.scale }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 rounded-full border-2 border-primary/40 flex flex-col items-center justify-center bg-card/60 backdrop-blur-md relative z-10"
        >
          <span className="text-2xl font-black uppercase tracking-wider text-primary">
            {currentPhase.label}
          </span>
          <span className="text-xs font-bold text-muted mt-1">
            {phaseSecondsLeft}s
          </span>
        </motion.div>
      </div>

      {/* Instruction text */}
      <div className="text-center space-y-2">
        <p className="text-sm font-bold text-primary-text max-w-xs mx-auto">
          {currentPhase.instruction}
        </p>
      </div>

      {/* Early Complete button if user completed at least 1 cycle */}
      {cycles >= 1 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={finishSession}
          className="rounded-xl text-xs font-bold border-white/10 hover:bg-white/5"
        >
          <CheckCircle2 size={14} className="mr-1.5 text-green-400" /> Complete Mindful Session
        </Button>
      )}
    </div>
  );
};
