import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, CheckCircle2, XCircle, Target } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';

interface QuickMathProps {
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

export const QuickMath: React.FC<QuickMathProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState({ text: '', answer: 0, options: [0, 0, 0, 0] });
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

  const generateQuestion = useCallback((currentCorrect: number) => {
    let a = 0;
    let b = 0;
    let ans = 0;
    let op = '+';

    if (currentCorrect < 4) {
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '+') {
        a = Math.floor(Math.random() * 15) + 2;
        b = Math.floor(Math.random() * 15) + 2;
        ans = a + b;
      } else {
        a = Math.floor(Math.random() * 20) + 10;
        b = Math.floor(Math.random() * a);
        ans = a - b;
      }
    } else if (currentCorrect < 9) {
      const ops = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '×') {
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * 9) + 2;
        ans = a * b;
      } else if (op === '+') {
        a = Math.floor(Math.random() * 40) + 10;
        b = Math.floor(Math.random() * 40) + 10;
        ans = a + b;
      } else {
        a = Math.floor(Math.random() * 60) + 20;
        b = Math.floor(Math.random() * 40) + 5;
        ans = a - b;
      }
    } else {
      const ops = ['+', '-', '×', '÷'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '÷') {
        b = Math.floor(Math.random() * 8) + 2;
        ans = Math.floor(Math.random() * 9) + 2;
        a = b * ans;
      } else if (op === '×') {
        a = Math.floor(Math.random() * 12) + 3;
        b = Math.floor(Math.random() * 12) + 3;
        ans = a * b;
      } else if (op === '+') {
        a = Math.floor(Math.random() * 70) + 25;
        b = Math.floor(Math.random() * 70) + 25;
        ans = a + b;
      } else {
        a = Math.floor(Math.random() * 90) + 30;
        b = Math.floor(Math.random() * 50) + 10;
        ans = a - b;
      }
    }

    const options = [ans];
    while (options.length < 4) {
      const offset = (Math.floor(Math.random() * 9) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = ans + offset;
      if (!options.includes(wrong) && wrong >= 0) {
        options.push(wrong);
      }
    }

    setQuestion({
      text: `${a} ${op} ${b}`,
      answer: ans,
      options: options.sort(() => Math.random() - 0.5)
    });
  }, []);

  useEffect(() => {
    generateQuestion(0);
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
  }, [generateQuestion]);

  useEffect(() => {
    if (status === 'finished') {
      const c = correctCountRef.current;
      const w = wrongCountRef.current;
      const s = streakRef.current;

      const totalAttempts = c + w;
      const accuracy = Math.round((c / Math.max(1, totalAttempts)) * 100);
      const finalScore = Math.max(100, (c * 120) + (s * 20));
      
      let diffName: 'Beginner' | 'Learner' | 'Explorer' | 'Focused' | 'Master' = 'Beginner';
      if (c >= 14) diffName = 'Master';
      else if (c >= 10) diffName = 'Focused';
      else if (c >= 6) diffName = 'Explorer';
      else if (c >= 3) diffName = 'Learner';

      const xp = Math.min(85, Math.round(35 + (c * 3) + (accuracy > 80 ? 15 : 5)));

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

  const handleAnswer = (val: number) => {
    if (status !== 'playing' || feedback) return;

    if (val === question.answer) {
      setCorrectCount(c => {
        const next = c + 1;
        generateQuestion(next);
        return next;
      });
      setStreak(s => s + 1);
      setScore(s => s + 100 + (streak * 15));
      setFeedback('correct');
    } else {
      setWrongCount(w => w + 1);
      setStreak(0);
      setScore(s => Math.max(0, s - 30));
      setFeedback('wrong');
      generateQuestion(correctCount);
    }

    setTimeout(() => {
      setFeedback(null);
    }, 350);
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
          <Zap className="text-yellow-400" size={16} />
          <span className="font-bold text-sm">{score} pts</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Target className="text-green-400" size={16} />
          <span className="font-bold text-sm">{currentAccuracy}%</span>
        </GlassCard>
      </div>

      {/* Arithmetic Problem Box */}
      <div className="text-center py-6 w-full bg-card rounded-3xl border border-border relative overflow-hidden">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.25em] mb-2">Solve against the clock</p>
        <h3 className="text-4xl sm:text-5xl font-black text-primary tracking-tight font-mono">
          {question.text} = ?
        </h3>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm"
            >
              {feedback === 'correct' ? (
                <div className="flex items-center gap-2 text-green-400 font-black">
                  <CheckCircle2 size={28} /> Correct! +100
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 font-black">
                  <XCircle size={28} /> Incorrect
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4 Option Buttons */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {question.options.map((opt, i) => (
          <Button
            key={`${opt}-${i}`}
            variant="outline"
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            className="h-16 rounded-2xl text-2xl font-black font-mono border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all active:scale-95"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};
