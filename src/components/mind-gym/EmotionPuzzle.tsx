import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle2, XCircle, Target } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';

interface EmotionPuzzleProps {
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

const ALL_SCENARIOS = [
  { text: "Your close teammate just got recognized for leading a major milestone you both worked on.", emotion: "Proud", options: ["Proud", "Resentful", "Apathetic", "Fearful"] },
  { text: "You have a high-stakes keynote presentation in 5 minutes and unexpected audio issues arise.", emotion: "Anxious", options: ["Anxious", "Confident", "Bored", "Elated"] },
  { text: "It is a peaceful weekend evening, and you have finally disconnected from all work notifications.", emotion: "Serene", options: ["Serene", "Lonely", "Frustrated", "Tense"] },
  { text: "A friend reaches out after months of silence, sharing a warm memory you had forgotten.", emotion: "Bittersweet", options: ["Bittersweet", "Angry", "Indifferent", "Confused"] },
  { text: "You notice someone in a group discussion being continuously talked over and left out.", emotion: "Empathetic", options: ["Empathetic", "Amused", "Spiteful", "Sleepy"] },
  { text: "You just finished a grueling mental challenge that pushed your limits, but you succeeded.", emotion: "Empowered", options: ["Empowered", "Helpless", "Defeated", "Anxious"] },
  { text: "A long-awaited project deadline got abruptly pushed back by management without explanation.", emotion: "Disillusioned", options: ["Disillusioned", "Joyful", "Ecstatic", "Carefree"] },
  { text: "You take a quiet walk at dawn and feel a sudden deep appreciation for being alive right now.", emotion: "Grateful", options: ["Grateful", "Numb", "Spiteful", "Hostile"] },
];

export const EmotionPuzzle: React.FC<EmotionPuzzleProps> = ({ onComplete }) => {
  const [scenarios, setScenarios] = useState<typeof ALL_SCENARIOS>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    // Shuffle 6 scenarios for every session
    const shuffled = [...ALL_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 6);
    setScenarios(shuffled);
  }, []);

  if (scenarios.length === 0) return null;

  const currentScenario = scenarios[scenarioIndex];

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const isCorrect = answer === currentScenario.emotion;
    let nextCorrect = correctCount;
    let nextWrong = wrongCount;

    if (isCorrect) {
      nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setFeedback('correct');
    } else {
      nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (scenarioIndex + 1 < scenarios.length) {
        setScenarioIndex(i => i + 1);
      } else {
        const timeTaken = Math.max(20, Math.round((Date.now() - startTime) / 1000));
        const totalAttempts = nextCorrect + nextWrong;
        const accuracy = Math.round((nextCorrect / Math.max(1, totalAttempts)) * 100);
        const finalScore = (nextCorrect * 200) + (accuracy * 2);
        const xp = Math.min(80, Math.round(35 + (nextCorrect * 6) + (accuracy > 80 ? 15 : 5)));

        onComplete(finalScore, xp, {
          score: finalScore,
          xp,
          accuracy,
          timeTaken,
          difficulty: 'Focused',
          correctAttempts: nextCorrect,
          totalAttempts
        });
      }
    }, 650);
  };

  const currentAccuracy = (correctCount + wrongCount) > 0
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
    : 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto select-none">
      {/* Telemetry Header */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Heart className="text-highlight" size={16} />
          <span className="font-bold text-sm">Scenario {scenarioIndex + 1} of {scenarios.length}</span>
        </GlassCard>
        <GlassCard className="p-2.5 flex items-center justify-center gap-2">
          <Target className="text-green-400" size={16} />
          <span className="font-bold text-sm">Accuracy: {currentAccuracy}%</span>
        </GlassCard>
      </div>

      {/* Scenario Text Card */}
      <GlassCard className="w-full min-h-[160px] flex items-center justify-center p-6 sm:p-8 relative overflow-hidden text-center italic leading-relaxed text-base sm:text-lg font-medium border-primary/20">
        <AnimatePresence mode="wait">
          <motion.p
            key={scenarioIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-primary-text"
          >
            "{currentScenario.text}"
          </motion.p>
        </AnimatePresence>
        
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex items-center justify-center z-20 bg-background/90 backdrop-blur-sm"
            >
              {feedback === 'correct' ? (
                <div className="text-center">
                  <CheckCircle2 className="text-green-400 mx-auto mb-1.5" size={40} />
                  <p className="text-green-400 font-black uppercase tracking-widest text-xs">Empathetic Match +200</p>
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="text-red-400 mx-auto mb-1.5" size={40} />
                  <p className="text-red-400 font-black uppercase tracking-widest text-xs">Expected: {currentScenario.emotion}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* 4 Emotion Choices */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {currentScenario.options.map((opt, i) => (
          <Button 
            key={`${opt}-${i}`} 
            variant="outline" 
            className="h-14 text-sm font-black tracking-wide border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all rounded-2xl active:scale-95"
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};
