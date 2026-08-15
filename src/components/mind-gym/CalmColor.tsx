import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, Sparkles, Timer, Target } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';

interface CalmColorProps {
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

const COLOR_FAMILIES = [
  { name: 'Sky Blue', hex: '#00D9FF' },
  { name: 'Lavender Glow', hex: '#7C3AED' },
  { name: 'Rose Petal', hex: '#FF4FA3' },
  { name: 'Seafoam Calm', hex: '#2DD4BF' },
  { name: 'Amber Sunset', hex: '#FB923C' },
  { name: 'Emerald Forest', hex: '#10B981' },
  { name: 'Indigo Night', hex: '#6366F1' },
  { name: 'Coral Dawn', hex: '#F43F5E' },
  { name: 'Golden Sun', hex: '#F59E0B' },
  { name: 'Mint Refresh', hex: '#34D399' }
];

export const CalmColor: React.FC<CalmColorProps> = ({ onComplete }) => {
  const [targetColor, setTargetColor] = useState(COLOR_FAMILIES[0]);
  const [options, setOptions] = useState<typeof COLOR_FAMILIES>([]);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState<'playing' | 'finished'>('playing');

  useEffect(() => {
    generateNewRound(0);
  }, []);

  useEffect(() => {
    let timer: any;
    if (status === 'playing') {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const generateNewRound = (round: number) => {
    const target = COLOR_FAMILIES[round % COLOR_FAMILIES.length];
    setTargetColor(target);

    // Pick distractors
    const otherColors = COLOR_FAMILIES.filter(c => c.hex !== target.hex);
    const shuffledOthers = [...otherColors].sort(() => Math.random() - 0.5).slice(0, 5);
    const roundOptions = [target, ...shuffledOthers].sort(() => Math.random() - 0.5);
    setOptions(roundOptions);
  };

  const handleSelect = (color: typeof COLOR_FAMILIES[0]) => {
    if (status !== 'playing') return;

    if (color.hex === targetColor.hex) {
      const nextCount = completedRounds + 1;
      setCompletedRounds(nextCount);
      
      if (nextCount >= 8) {
        setStatus('finished');
        const totalAttempts = nextCount + mistakes;
        const accuracy = Math.round((nextCount / Math.max(1, totalAttempts)) * 100);
        const timeBonus = Math.max(0, 250 - time * 6);
        const finalScore = Math.max(200, 600 + timeBonus + (accuracy * 3));
        const xp = Math.min(80, Math.round(35 + (accuracy > 85 ? 20 : 10) + (time < 30 ? 15 : 5)));

        onComplete(finalScore, xp, {
          score: finalScore,
          xp,
          accuracy,
          timeTaken: time,
          difficulty: 'Explorer',
          correctAttempts: nextCount,
          totalAttempts
        });
      } else {
        generateNewRound(nextCount);
      }
    } else {
      setMistakes(m => m + 1);
    }
  };

  const currentAccuracy = (completedRounds + mistakes) > 0
    ? Math.round((completedRounds / (completedRounds + mistakes)) * 100)
    : 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto select-none">
      {/* Telemetry */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Palette className="text-primary" size={16} />
          <span className="font-bold text-sm">Round {completedRounds + 1}/8</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Timer className="text-primary" size={16} />
          <span className="font-bold text-sm">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Target className="text-green-400" size={16} />
          <span className="font-bold text-sm">{currentAccuracy}%</span>
        </GlassCard>
      </div>

      {/* Target Color Display */}
      <div className="relative group flex flex-col items-center text-center">
        <motion.div
          key={targetColor.hex}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 rounded-[32px] shadow-2xl flex flex-col items-center justify-center border-4 border-white/20 relative"
          style={{ backgroundColor: targetColor.hex, boxShadow: `0 0 50px ${targetColor.hex}55` }}
        >
          <Sparkles className="text-white/60 mb-1" size={32} />
          <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-md px-2 py-0.5 rounded-md bg-black/20">
            {targetColor.name}
          </span>
        </motion.div>
      </div>

      {/* 6 Color Options */}
      <div className="grid grid-cols-3 gap-3.5 w-full">
        {options.map((color, i) => (
          <button
            key={`${color.hex}-${i}`}
            onClick={() => handleSelect(color)}
            className="h-20 rounded-2xl transition-all hover:scale-105 active:scale-95 border-2 border-white/10 hover:border-white/50 shadow-md flex items-center justify-center"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};
