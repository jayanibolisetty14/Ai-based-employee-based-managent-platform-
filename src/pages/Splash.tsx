import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Smile, Heart, Sparkles, Wind, Target } from 'lucide-react';
import meditatingGirl from '@/assets/images/wellness_mascot_1786552006167.jpg';
import { useAuth } from '@/context/AuthContext';

const OrbitIcon = ({ icon: Icon, position, glowColor, delay, label }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1.2, type: "spring", bounce: 0.4 }}
    className={`absolute ${position} z-20 flex flex-col items-center gap-1.5`}
  >
    <div className="relative group">
      <div className={`absolute inset-0 blur-xl opacity-60 transition-opacity duration-1000`} style={{ backgroundColor: glowColor }} />
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card backdrop-blur-md border border-border rounded-full flex items-center justify-center relative z-10 shadow-lg">
        <Icon size={18} style={{ color: glowColor }} className="sm:w-5 sm:h-5" />
      </div>
    </div>
    <span className="text-[10px] font-bold text-primary-text/80 shadow-black drop-shadow-md tracking-wide">{label}</span>
  </motion.div>
);

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsTransitioning(true);
          setTimeout(() => navigate(isAuthenticated ? '/dashboard' : '/login'), 1200);
          return 100;
        }
        return prev + 0.4;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [navigate, isAuthenticated]);

  return (
    <AnimatePresence>
      {!isTransitioning && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="w-screen h-screen min-h-screen bg-background flex flex-col items-center justify-between relative overflow-hidden font-sans select-none pb-8 sm:pb-12 pt-6 sm:pt-10 px-4"
        >
          {/* 4. BACKGROUND & 5. AURA & 12. PARTICLES */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            {/* Soft luminous circular aura behind the girl */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-magenta-500/10 to-transparent rounded-full blur-[80px]" />
            
            {/* Faint Concentric Rings (Mind, Breathing, Energy, Balance) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] border border-cyan-400/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] border border-purple-400/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[700px] sm:h-[700px] border border-pink-400/5 rounded-full" />
            
            {/* Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/40 blur-[1px]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#00D9FF', '#A855F7', '#FF4FA3'][Math.floor(Math.random() * 3)]
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            ))}
          </motion.div>

          {/* 7. LOGO (Top Center) */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="relative z-10 flex items-center gap-2"
          >
            <Brain className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-sm sm:text-base font-black tracking-[0.2em] text-primary-text uppercase">
              Mood Mentor <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI</span>
            </h2>
          </motion.div>

          {/* 2. MEDITATING GIRL & 6. WELLNESS ORBIT */}
          <div className="relative z-10 flex items-center justify-center w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] my-auto">
            
            {/* Wellness Orbit Ring */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="absolute inset-0 border border-border-subtle rounded-full animate-[spin_80s_linear_infinite]" 
            />

            {/* Orbit Icons: Mood, Meditation, Wellness, Mind, AI */}
            <OrbitIcon icon={Smile} glowColor="#00D9FF" position="-top-4 sm:-top-6" delay={1.4} label="Mood" />
            <OrbitIcon icon={Wind} glowColor="#A855F7" position="top-1/4 -right-8 sm:-right-12" delay={1.6} label="Meditation" />
            <OrbitIcon icon={Heart} glowColor="#FF4FA3" position="bottom-10 -right-4 sm:-right-6" delay={1.8} label="Wellness" />
            <OrbitIcon icon={Target} glowColor="#3B82F6" position="bottom-10 -left-4 sm:-left-6" delay={2.0} label="Mind" />
            <OrbitIcon icon={Sparkles} glowColor="#10B981" position="top-1/4 -left-8 sm:-left-12" delay={2.2} label="AI" />

            {/* Central Image - Meditating Girl */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
              className="relative z-10 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full overflow-hidden p-1 bg-gradient-to-br from-primary/30 to-accent/30 shadow-[0_0_60px_rgba(139,92,246,0.15)]"
            >
              <motion.div
                animate={{ scale: [1.0, 1.015, 1.0] }} // 11. Subtle breathing animation
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full rounded-full overflow-hidden bg-background"
              >
                <img 
                  src={meditatingGirl} 
                  alt="Meditating Wellness Character" 
                  className="w-full h-full object-cover scale-[1.15]"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(5,9,28,0.6)] pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

          {/* 8. MAIN TITLE & 10. LOADING AREA */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="relative z-10 w-full max-w-lg flex flex-col items-center text-center space-y-10 sm:space-y-12"
          >
            {/* Main Title & Tagline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-primary-text drop-shadow-lg leading-none">
                MOOD MENTOR <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-sm sm:text-base text-primary-text/70 font-medium tracking-wide leading-relaxed">
                Understand your mood.<br />
                Improve your wellbeing.
              </p>
            </div>

            {/* 13. Glass Element Loading Area */}
            <div className="w-full bg-card/50 border border-border backdrop-blur-2xl rounded-[24px] p-5 sm:p-6 shadow-2xl">
              <div className="flex justify-between items-end mb-3 px-1">
                <span className="text-[11px] sm:text-xs font-bold text-primary-text/70 tracking-widest uppercase">
                  Preparing your wellness space...
                </span>
                <span className="text-[11px] sm:text-xs font-black text-primary-text">{Math.round(progress)}%</span>
              </div>
              
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative border border-border-subtle">
                <motion.div 
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-10 bg-primary-text/30 blur-[2px]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

