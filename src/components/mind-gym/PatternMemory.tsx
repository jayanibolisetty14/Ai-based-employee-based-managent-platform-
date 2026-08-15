import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Target } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { cn } from '@/lib/utils';

interface PatternMemoryProps {
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

export const PatternMemory: React.FC<PatternMemoryProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'showing' | 'input' | 'failed' | 'success'>('idle');
  const [startTime] = useState<number>(Date.now());
  const [correctTilesCount, setCorrectTilesCount] = useState(0);
  const [totalTilesAttempted, setTotalTilesAttempted] = useState(0);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const showSequence = async (seq: number[]) => {
    setStatus('showing');
    setUserSequence([]);
    await new Promise(r => setTimeout(r, 400));
    
    for (let i = 0; i < seq.length; i++) {
      if (!isMountedRef.current) return;
      setHighlighted(seq[i]);
      await new Promise(r => setTimeout(r, 450));
      if (!isMountedRef.current) return;
      setHighlighted(null);
      await new Promise(r => setTimeout(r, 180));
    }
    
    if (isMountedRef.current) {
      setStatus('input');
    }
  };

  const startLevel = useCallback((l: number) => {
    setLevel(l);
    // Grid has 9 tiles (0-8), sequence length = l + 2
    const seqLength = l + 2;
    const newSeq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 9));
    }
    setSequence(newSeq);
    setUserSequence([]);
    showSequence(newSeq);
  }, []);

  useEffect(() => {
    if (status === 'idle') startLevel(1);
  }, [status, startLevel]);

  const handleTileClick = (id: number) => {
    if (status !== 'input') return;

    const currentStep = userSequence.length;
    const isCorrect = id === sequence[currentStep];

    setTotalTilesAttempted(t => t + 1);
    if (isCorrect) {
      setCorrectTilesCount(c => c + 1);
    }

    const nextUserSeq = [...userSequence, id];
    setUserSequence(nextUserSeq);

    if (!isCorrect) {
      setStatus('failed');
      const timeTaken = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      const accuracy = Math.round((correctTilesCount / Math.max(1, totalTilesAttempted + 1)) * 100);
      const score = Math.max(150, (level - 1) * 250 + (correctTilesCount * 30));
      const xp = Math.min(80, 30 + (level * 8));
      
      let diffName: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master' = 'Beginner';
      if (level >= 6) diffName = 'Master';
      else if (level >= 4) diffName = 'Focused';
      else if (level >= 3) diffName = 'Explorer';
      else if (level >= 2) diffName = 'Learner';

      setTimeout(() => {
        onCompleteRef.current(score, xp, {
          score,
          xp,
          accuracy,
          timeTaken,
          difficulty: diffName,
          correctAttempts: correctTilesCount,
          totalAttempts: totalTilesAttempted + 1
        });
      }, 700);
      return;
    }

    // Finished current sequence
    if (nextUserSeq.length === sequence.length) {
      if (level >= 7) {
        setStatus('success');
        const timeTaken = Math.max(20, Math.round((Date.now() - startTime) / 1000));
        const accuracy = 100;
        const score = 1800;
        const xp = 85;

        setTimeout(() => {
          onCompleteRef.current(score, xp, {
            score,
            xp,
            accuracy,
            timeTaken,
            difficulty: 'Master',
            correctAttempts: correctTilesCount + 1,
            totalAttempts: totalTilesAttempted + 1
          });
        }, 700);
      } else {
        setTimeout(() => {
          startLevel(level + 1);
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto select-none">
      {/* Telemetry */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <GlassCard className="p-3 flex items-center justify-center gap-2">
          <Brain className="text-primary" size={18} />
          <span className="font-bold text-sm">Sequence Level {level}</span>
        </GlassCard>
        <GlassCard className="p-3 flex items-center justify-center gap-2">
          <Target className="text-accent" size={18} />
          <span className="font-bold text-sm">Target: {sequence.length} Steps</span>
        </GlassCard>
      </div>

      {/* 3x3 Tile Grid */}
      <div className="grid grid-cols-3 gap-3.5 max-w-[280px] w-full aspect-square">
        {Array.from({ length: 9 }).map((_, i) => {
          const isHighlighted = highlighted === i;
          const isSelected = userSequence[userSequence.length - 1] === i;
          const isFailTile = status === 'failed' && isSelected;

          return (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              disabled={status !== 'input'}
              className={cn(
                "aspect-square rounded-2xl transition-all duration-150 relative overflow-hidden border",
                "bg-card border-border hover:border-primary/40 active:scale-95",
                isHighlighted && "bg-primary border-primary shadow-glow-primary scale-95",
                isFailTile && "bg-red-500 border-red-500"
              )}
            >
              {isHighlighted && (
                <motion.div 
                  layoutId="highlight"
                  className="absolute inset-0 bg-white/20"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Status text */}
      <div className="text-center h-8">
        <AnimatePresence mode="wait">
          {status === 'showing' && (
            <motion.p 
              key="showing"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-xs font-black uppercase tracking-widest text-primary animate-pulse"
            >
              Memorize Pattern Sequence...
            </motion.p>
          )}
          {status === 'input' && (
            <motion.p 
              key="input"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-xs font-black uppercase tracking-widest text-green-400"
            >
              Your Turn: Repeat Sequence ({userSequence.length}/{sequence.length})
            </motion.p>
          )}
          {status === 'failed' && (
            <motion.p 
              key="failed"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xs font-black uppercase tracking-widest text-red-400"
            >
              Sequence Break! Calculating results...
            </motion.p>
          )}
          {status === 'success' && (
            <motion.p 
              key="success"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xs font-black uppercase tracking-widest text-accent"
            >
              Master Pattern Completed!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
