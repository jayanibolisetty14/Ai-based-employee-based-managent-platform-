import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Search, Target } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { cn } from '@/lib/utils';

interface WordFocusProps {
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

const WORDS = [
  'CALM', 'PEACE', 'FOCUS', 'ZEN', 'MINDFUL', 'STRENGTH', 'JOY', 
  'SERENE', 'BALANCED', 'GENTLE', 'ENERGY', 'SILENCE', 'VITAL',
  'HARMONY', 'CLARITY', 'INSIGHT', 'PRESENCE', 'RESILIENT', 'COURAGE', 'BREATHE'
];

export const WordFocus: React.FC<WordFocusProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [gridWords, setGridWords] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'finished'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const correctCountRef = useRef(correctCount);
  correctCountRef.current = correctCount;

  const wrongCountRef = useRef(wrongCount);
  wrongCountRef.current = wrongCount;

  const streakRef = useRef(streak);
  streakRef.current = streak;

  const generateGrid = useCallback((currentCorrect: number) => {
    const target = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(target);
    
    const others = WORDS.filter(w => w !== target);
    const gridSize = currentCorrect >= 8 ? 12 : 9;
    const grid = [target];
    
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    for (let i = 0; i < gridSize - 1; i++) {
      grid.push(shuffledOthers[i % shuffledOthers.length]);
    }
    
    setGridWords(grid.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateGrid(0);
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setStatus('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [generateGrid]);

  useEffect(() => {
    if (status === 'finished') {
      const c = correctCountRef.current;
      const w = wrongCountRef.current;
      const s = streakRef.current;

      const totalAttempts = c + w;
      const accuracy = Math.round((c / Math.max(1, totalAttempts)) * 100);
      const finalScore = Math.max(100, (c * 140) + (s * 25));

      let diffName: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master' = 'Beginner';
      if (c >= 12) diffName = 'Master';
      else if (c >= 8) diffName = 'Focused';
      else if (c >= 5) diffName = 'Explorer';
      else if (c >= 2) diffName = 'Learner';

      const xp = Math.min(85, Math.round(35 + (c * 3.5) + (accuracy > 85 ? 15 : 5)));

      onCompleteRef.current(finalScore, xp, {
        score: finalScore,
        xp,
        accuracy,
        timeTaken: 45,
        difficulty: diffName,
        correctAttempts: c,
        totalAttempts
      });
    }
  }, [status]);

  const handleWordClick = (word: string) => {
    if (status !== 'playing' || feedback) return;

    if (word === targetWord) {
      setCorrectCount(c => {
        const next = c + 1;
        generateGrid(next);
        return next;
      });
      setStreak(s => s + 1);
      setScore(s => s + 120 + (streak * 15));
      setFeedback('correct');
    } else {
      setWrongCount(w => w + 1);
      setStreak(0);
      setScore(s => Math.max(0, s - 40));
      setFeedback('wrong');
      generateGrid(correctCount);
    }

    setTimeout(() => {
      setFeedback(null);
    }, 300);
  };

  const currentAccuracy = (correctCount + wrongCount) > 0 
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
    : 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto select-none">
      {/* Telemetry */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Timer className="text-primary" size={16} />
          <span className="font-bold text-sm">{timeLeft}s</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Search className="text-accent" size={16} />
          <span className="font-bold text-sm">{score} pts</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Target className="text-green-400" size={16} />
          <span className="font-bold text-sm">{currentAccuracy}%</span>
        </GlassCard>
      </div>

      {/* Target Word Prompt */}
      <div className="text-center w-full">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2">Find the matching word</p>
        <h3 className="text-3xl sm:text-4xl font-black text-primary tracking-tight shadow-glow-primary inline-block bg-primary/10 px-6 py-2 rounded-2xl border border-primary/30">
          {targetWord}
        </h3>
      </div>

      {/* Word Grid */}
      <div className={cn(
        "grid gap-2.5 w-full",
        gridWords.length > 9 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-3"
      )}>
        {gridWords.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => handleWordClick(word)}
            disabled={!!feedback}
            className="h-14 bg-card border border-border rounded-xl font-black text-xs uppercase tracking-wider hover:border-primary/40 hover:bg-primary/10 transition-all flex items-center justify-center p-2 text-center active:scale-95"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};
