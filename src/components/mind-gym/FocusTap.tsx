import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Target, Flame } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';

interface FocusTapProps {
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

export const FocusTap: React.FC<FocusTapProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [targetSpawnTime, setTargetSpawnTime] = useState<number>(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing' | 'finished'>('playing');
  const targetTimeoutRef = useRef<any>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const hitsRef = useRef(hits);
  hitsRef.current = hits;

  const missesRef = useRef(misses);
  missesRef.current = misses;

  const bestStreakRef = useRef(bestStreak);
  bestStreakRef.current = bestStreak;

  const reactionTimesRef = useRef(reactionTimes);
  reactionTimesRef.current = reactionTimes;

  const spawnTarget = useCallback(() => {
    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    
    setTargetPos({
      x: Math.floor(Math.random() * 74) + 13,
      y: Math.floor(Math.random() * 74) + 13
    });
    setTargetSpawnTime(Date.now());

    // Target lifetime decreases as hits increase
    const lifetime = Math.max(800, 2000 - Math.min(1100, hitsRef.current * 45));

    targetTimeoutRef.current = setTimeout(() => {
      setMisses(m => m + 1);
      setStreak(0);
      spawnTarget();
    }, lifetime);
  }, []);

  useEffect(() => {
    spawnTarget();
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
          setStatus('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    };
  }, [spawnTarget]);

  useEffect(() => {
    if (status === 'finished') {
      const h = hitsRef.current;
      const m = missesRef.current;
      const bStreak = bestStreakRef.current;
      const rTimes = reactionTimesRef.current;

      const totalClicks = h + m;
      const accuracy = Math.round((h / Math.max(1, totalClicks)) * 100);
      const avgReaction = rTimes.length > 0
        ? Math.round(rTimes.reduce((a, b) => a + b, 0) / rTimes.length)
        : 600;

      const speedBonus = Math.max(0, Math.round((1000 - avgReaction) / 2));
      const accuracyBonus = Math.round(accuracy * 3);
      const finalScore = Math.max(100, (h * 80) + (bStreak * 25) + speedBonus + accuracyBonus);
      
      let difficultyLevel: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master' = 'Beginner';
      if (h >= 26) difficultyLevel = 'Master';
      else if (h >= 20) difficultyLevel = 'Focused';
      else if (h >= 14) difficultyLevel = 'Explorer';
      else if (h >= 8) difficultyLevel = 'Learner';

      const xp = Math.min(85, Math.round(35 + (h * 1.5) + (accuracy > 85 ? 15 : 5)));

      onCompleteRef.current(finalScore, xp, {
        score: finalScore,
        xp,
        accuracy,
        timeTaken: 30,
        difficulty: difficultyLevel,
        correctAttempts: h,
        totalAttempts: totalClicks
      });
    }
  }, [status]);

  const handleHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== 'playing') return;

    const reaction = Date.now() - targetSpawnTime;
    setReactionTimes(prev => [...prev, reaction]);
    
    const reactionBonus = reaction < 400 ? 50 : reaction < 700 ? 25 : 10;
    setHits(h => h + 1);
    setStreak(s => {
      const next = s + 1;
      setBestStreak(b => Math.max(b, next));
      return next;
    });
    setScore(s => s + 100 + reactionBonus + (streak * 10));
    spawnTarget();
  };

  const handleMiss = () => {
    if (status !== 'playing') return;
    setMisses(m => m + 1);
    setStreak(0);
    setScore(s => Math.max(0, s - 30));
  };

  const currentAccuracy = (hits + misses) > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <div className="grid grid-cols-3 gap-3 w-full justify-center">
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Timer className="text-primary" size={16} />
          <span className="font-bold text-sm">{timeLeft}s</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Zap className="text-yellow-400" size={16} />
          <span className="font-bold text-sm">{score} pts</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Flame className="text-orange-500" size={16} />
          <span className="font-bold text-sm">{streak}x Streak</span>
        </GlassCard>
      </div>

      <div 
        onClick={handleMiss}
        className="w-full aspect-square bg-card border border-border rounded-3xl relative overflow-hidden cursor-crosshair select-none"
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <AnimatePresence mode="popLayout">
          {status === 'playing' && (
            <motion.button
              key={`${targetPos.x}-${targetPos.y}`}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleHit}
              className="absolute w-14 h-14 bg-gradient-to-tr from-primary to-cyan-300 rounded-full flex items-center justify-center shadow-glow-primary z-10 hover:scale-105 active:scale-95"
              style={{ 
                left: `${targetPos.x}%`, 
                top: `${targetPos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Target className="text-black" size={26} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 left-3 text-[11px] font-bold text-muted bg-card/80 px-2.5 py-1 rounded-xl border border-border">
          Accuracy: {currentAccuracy}% | Hits: {hits}
        </div>
      </div>
    </div>
  );
};
