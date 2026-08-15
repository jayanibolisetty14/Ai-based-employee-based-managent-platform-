import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Timer, RefreshCcw, Trophy, Sparkles, Target } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { cn } from '@/lib/utils';

const SYMBOL_SETS = [
  '🧠', '🧘', '✨', '🌿', '💎', '🌙', '🌊', '🔥', '🌸', '⚡', '🕊️', '☀️'
];

interface MemoryMatchProps {
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

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ onComplete }) => {
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Explorer' | 'Master'>('Explorer');
  const [cards, setCards] = useState<{ id: number; content: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle');

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const pairCount = difficulty === 'Beginner' ? 6 : difficulty === 'Explorer' ? 8 : 10;

  const initGame = useCallback(() => {
    const selectedSymbols = [...SYMBOL_SETS].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const shuffled = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMistakes(0);
    setMatches(0);
    setTime(0);
    setStatus('playing');
  }, [pairCount]);

  useEffect(() => {
    if (status === 'idle') initGame();
  }, [status, initGame]);

  useEffect(() => {
    let timer: any;
    if (status === 'playing') {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleCardClick = (id: number) => {
    if (status !== 'playing' || flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].content === cards[second].content) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        const newMatches = matches + 1;
        setMatches(newMatches);
        setFlippedCards([]);
        
        if (newMatches === pairCount) {
          setStatus('finished');
          const totalAttempts = newMatches + mistakes;
          const accuracyPct = Math.round((newMatches / Math.max(1, totalAttempts)) * 100);
          const timeBonus = Math.max(0, 300 - time * 5);
          const accuracyBonus = Math.round(accuracyPct * 4);
          const diffMultiplier = difficulty === 'Master' ? 1.4 : difficulty === 'Explorer' ? 1.1 : 1.0;
          const finalScore = Math.round((500 + timeBonus + accuracyBonus) * diffMultiplier);
          const xp = Math.round((45 + (accuracyPct > 80 ? 20 : 10) + (time < 45 ? 15 : 5)) * (difficulty === 'Master' ? 1.3 : 1));
          
          const diffName = difficulty === 'Beginner' ? 'Beginner' : difficulty === 'Explorer' ? 'Explorer' : 'Master';

          onCompleteRef.current(finalScore, xp, {
            score: finalScore,
            xp,
            accuracy: accuracyPct,
            timeTaken: time,
            difficulty: diffName,
            correctAttempts: newMatches,
            totalAttempts: totalAttempts
          });
        }
      } else {
        setMistakes(m => m + 1);
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 750);
      }
    }
  };

  const currentAccuracy = moves > 0 ? Math.round((matches / Math.max(1, matches + mistakes)) * 100) : 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Difficulty Switcher */}
      <div className="flex items-center gap-2 bg-card/60 p-1.5 rounded-2xl border border-border">
        {(['Beginner', 'Explorer', 'Master'] as const).map((d) => (
          <button
            key={d}
            onClick={() => {
              if (difficulty !== d) {
                setDifficulty(d);
                setStatus('idle');
              }
            }}
            className={cn(
              "px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
              difficulty === d 
                ? "bg-primary text-black shadow-glow-primary" 
                : "text-muted hover:text-primary-text"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Timer className="text-primary" size={16} />
          <span className="font-bold text-sm">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <RefreshCcw className="text-accent" size={16} />
          <span className="font-bold text-sm">{moves} Moves</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Target className="text-green-400" size={16} />
          <span className="font-bold text-sm">{currentAccuracy}%</span>
        </GlassCard>
      </div>

      {/* Card Grid */}
      <div className={cn(
        "grid gap-2.5 sm:gap-3.5 w-full max-w-md",
        pairCount === 6 ? "grid-cols-3" : "grid-cols-4"
      )}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "aspect-square rounded-2xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 relative select-none",
              card.isFlipped || card.isMatched ? "rotate-y-180" : ""
            )}
          >
            <div className={cn(
              "absolute inset-0 rounded-2xl bg-card border border-border flex items-center justify-center transition-all",
              !card.isFlipped && !card.isMatched && "hover:bg-primary-text/10 hover:border-primary/40"
            )}>
              <Sparkles className="text-primary-text/20" size={20} />
            </div>
            <div className={cn(
              "absolute inset-0 rounded-2xl bg-primary/20 border-2 border-primary shadow-glow-primary flex items-center justify-center",
              card.isMatched && "bg-green-500/20 border-green-500 shadow-none"
            )}>
              {card.content}
            </div>
          </button>
        ))}
      </div>

      {status === 'finished' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="bg-green-500/20 text-green-400 p-4 rounded-2xl border border-green-500/30">
            <Trophy className="mx-auto mb-1 text-green-400" size={24} />
            <p className="font-bold text-sm">Perfect Memory Match!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
