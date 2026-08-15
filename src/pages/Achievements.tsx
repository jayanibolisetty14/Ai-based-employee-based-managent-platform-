import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { BackButton } from '@/components/common/BackButton';
import { 
  Lock, 
  Flame, 
  Zap, 
  Sparkles,
  Award,
  Trophy,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRarityTheme, getUserRarity } from '@/lib/progression';
import { Rarity } from '@/types';

export default function Achievements() {
  const { userData } = useWellness();
  const { achievements, profile } = userData;

  const currentRarity = getUserRarity(profile.xp);

  const guideCards = [
    { rarity: Rarity.COMMON, icon: Award, label: 'Common', desc: 'Basic milestones and foundational wellness steps.', color: 'text-slate-400', border: 'border-slate-400/20', bg: 'bg-slate-400/10', hover: 'hover:bg-slate-400/5', range: '0–99 XP' },
    { rarity: Rarity.RARE, icon: Zap, label: 'Rare', desc: 'Consistent participation and moderate habit progress.', color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/10', hover: 'hover:bg-cyan-400/5', range: '100–249 XP' },
    { rarity: Rarity.EPIC, icon: Sparkles, label: 'Epic', desc: 'Significant dedication and sustained wellness mastery.', color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/10', hover: 'hover:bg-purple-400/5', range: '250–499 XP' },
    { rarity: Rarity.LEGENDARY, icon: Flame, label: 'Legendary', desc: 'Exceptional consistency and ultimate life transformation.', color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-400/10', hover: 'hover:bg-amber-400/5', range: '500+ XP' }
  ];

  return (
    <div className="space-y-8 pb-20 text-primary-text">
      {/* Top Navigation */}
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Hall of Wellness</h2>
          <p className="text-muted font-bold tracking-tight">Milestones in your emotional evolution.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
          <Trophy className="text-amber-400" size={20} />
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Progress</p>
            <p className="text-sm font-black">{achievements.filter(a => !!a.unlockedAt).length} / {achievements.length} Unlocked</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((badge) => {
          const isUnlocked = !!badge.unlockedAt;
          const theme = getRarityTheme(badge.rarity);
          
          return (
            <GlassCard 
              key={badge.id} 
              className={cn(
                "relative overflow-hidden transition-all duration-500 group",
                isUnlocked ? cn("border-white/10", theme.glow) : "opacity-60 grayscale-[0.5]"
              )}
            >
              {/* Rarity Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center text-4xl transition-transform duration-500 group-hover:scale-110",
                  isUnlocked ? theme.bg : "bg-card border border-white/5"
                )}>
                  {isUnlocked ? badge.icon : <Lock className="text-muted/40" size={24} />}
                </div>
                
                <div className="text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    theme.bg, theme.color, theme.border
                  )}>
                    <Star size={10} className={cn("fill-current", theme.color)} />
                    {badge.rarity || 'Common'}
                  </div>
                  <div className="mt-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted block mb-1">{badge.category}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-black text-emerald-400 uppercase">Unlocked</span>
                    ) : (
                      <span className="text-[10px] font-black text-muted uppercase">{badge.progress}% Progress</span>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors">{badge.title}</h3>
              <p className="text-sm text-muted font-medium mb-6 leading-relaxed">
                {badge.description}
              </p>

              <div className="space-y-4">
                <div className="w-full h-1.5 bg-card rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      isUnlocked ? theme.color.replace('text-', 'bg-') : "bg-muted/20"
                    )}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <Zap size={12} className="text-amber-400" />
                    <span className="text-[10px] font-black text-white/60">+{badge.rewardXP || 50} XP</span>
                   </div>
                   {isUnlocked && (
                     <span className="text-[9px] font-bold text-muted">
                       {new Date(badge.unlockedAt!).toLocaleDateString()}
                     </span>
                   )}
                </div>
              </div>

              {isUnlocked && (
                <div className={cn(
                  "absolute -top-12 -right-12 w-24 h-24 blur-3xl rounded-full opacity-20",
                  theme.bg
                )} />
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Rarity Progression Guide */}
      <section className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Award className="text-cyan-400" size={24} />
          <h3 className="text-xl font-black tracking-tight">Rarity Progression Guide</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guideCards.map((card) => {
            const isActive = card.rarity === currentRarity;
            
            return (
              <div 
                key={card.rarity}
                className={cn(
                  "p-8 bg-card/40 rounded-3xl border text-center space-y-4 transition-colors relative",
                  card.border, card.hover,
                  isActive ? "shadow-glow-primary border-white/40 bg-white/5" : ""
                )}
              >
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-background text-[9px] font-black uppercase tracking-widest rounded-full">
                    Your Rarity
                  </div>
                )}
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border", card.bg, card.border, card.color)}>
                  <card.icon size={32} />
                </div>
                <div>
                  <p className={cn("text-xs font-black uppercase tracking-[0.2em] mb-1", card.color)}>{card.label}</p>
                  <p className="text-[10px] font-black text-white/50 uppercase mb-3">{card.range}</p>
                  <p className="text-[10px] font-bold text-muted leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
