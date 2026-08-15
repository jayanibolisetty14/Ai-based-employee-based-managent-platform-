import { useWellness } from '@/context/WellnessContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { Input } from '@/components/common/Input';
import { Shield, Camera, Award, Flame, Zap, X, Smile } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAvatarByEmojiOrId } from '@/data/avatars';
import { AvatarImage } from '@/components/common/AvatarImage';
import { AvatarSelector } from '@/components/common/AvatarSelector';
import { getUserRarity, getNextRarity, getRarityTheme } from '@/lib/progression';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { logout, user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const { userData, updateProfile } = useWellness();
  const { profile, achievements } = userData;
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [name, setName] = useState(profile.name);

  // Sync edit name state when profile updates
  useEffect(() => {
    setName(profile.name);
  }, [profile.name]);

  const unlockedCount = achievements.filter(a => a.progress >= 100 || !!a.unlockedAt).length;
  const avatarData = getAvatarByEmojiOrId(profile.avatar);

  const displayEmail = user?.email || profile.email;
  const memberSinceDate = profile.createdAt || user?.createdAt;

  const currentRarity = getUserRarity(profile.xp);
  const rarityTheme = getRarityTheme(currentRarity);
  const { nextRarity, xpNeeded, progressPercent } = getNextRarity(profile.xp);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 text-primary-text">
      {/* Top Navigation */}
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      {/* Profile Header */}
      <section className="relative h-[250px] rounded-[48px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute -bottom-10 left-10 flex items-end gap-8">
          <div className="relative group">
            <div className="w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-[40px] flex items-center justify-center text-7xl shadow-glow-primary border-8 border-background relative z-10 overflow-hidden p-1">
              <div className="w-full h-full bg-background rounded-[32px] overflow-hidden">
                <AvatarImage src={avatarData.image} alt={avatarData.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <button 
              onClick={() => setIsEditingAvatar(true)}
              className="absolute inset-0 bg-black/60 rounded-[40px] z-20 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer"
            >
              <Camera className="text-primary-text mb-2" size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-text">Change Avatar</span>
            </button>
          </div>
          <div className="mb-14 pb-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase">{profile.name}</h2>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">Wellness Level {profile.level}</p>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5", rarityTheme.bg, rarityTheme.color, rarityTheme.border)}>
                <Zap size={10} className="fill-current" /> {currentRarity}
              </span>
            </div>
            
            {/* Rarity Progress */}
            <div className="mt-4 max-w-xs space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className={rarityTheme.color}>{profile.xp} XP</span>
                {nextRarity ? (
                  <span className="text-muted">{xpNeeded} XP to {nextRarity}</span>
                ) : (
                  <span className="text-muted">Maximum Rarity</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden backdrop-blur-md">
                <div 
                  className={cn("h-full transition-all duration-1000", rarityTheme.color.replace('text-', 'bg-'))}
                  style={{ width: `${progressPercent}%`, boxShadow: `0 0 10px currentColor` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight uppercase">Bio Identity</h3>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email" value={displayEmail} disabled />
                <Button className="w-full" onClick={() => { 
                  if (name.trim()) {
                    updateProfile({ name: name.trim() }); 
                    updateUser({ name: name.trim() });
                  }
                  setIsEditing(false); 
                }}>Update Identity</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Name</p>
                  <p className="font-bold">{profile.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Email</p>
                  <p className="font-bold">{displayEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Account Status</p>
                  <p className="font-bold text-cyan-400">Wellness Member</p>
                </div>
                {memberSinceDate && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Member Since</p>
                    <p className="font-bold">
                      {new Date(memberSinceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-accent" size={20} />
                <h4 className="text-sm font-black uppercase tracking-widest">Account Security</h4>
              </div>
              <button 
                type="button"
                onClick={() => setIsConfirmingLogout(true)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                LOG OUT
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-8">
          <GlassCard className="space-y-6">
            <h3 className="text-xl font-black tracking-tight">Wellness Statistics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Award size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">Achievements</span>
                </div>
                <span className="font-black text-primary">{unlockedCount}</span>
              </div>
              <div className="p-4 bg-card rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-400/10 rounded-lg text-orange-400"><Flame size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">Current Streak</span>
                </div>
                <span className="font-black text-orange-400">{profile.currentStreak}D</span>
              </div>
              <div className="p-4 bg-card rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent"><Zap size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">Experience</span>
                </div>
                <span className="font-black text-accent">{profile.xp} XP</span>
              </div>
            
              <div className="p-4 bg-card rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400"><Smile size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest">Smile Breaks</span>
                </div>
                <span className="font-black text-yellow-400">{userData.smileBreakStats?.smileBreaksCompleted || 0}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {isEditingAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsEditingAvatar(false)} />
          <GlassCard className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 !p-0">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-2xl font-black tracking-tight">Select Your Avatar</h3>
              <button 
                onClick={() => setIsEditingAvatar(false)}
                className="p-2 bg-card hover:bg-primary-text/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <AvatarSelector 
                selectedId={avatarData.id}
                onSelect={(id) => {
                  updateProfile({ avatar: id });
                }}
              />
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <Button onClick={() => setIsEditingAvatar(false)}>
                Done
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {isConfirmingLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsConfirmingLogout(false)} />
          <GlassCard className="w-full max-w-md relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight uppercase">LOG OUT</h3>
              <button 
                type="button"
                onClick={() => setIsConfirmingLogout(false)}
                className="p-2 bg-card hover:bg-primary-text/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-muted font-bold leading-relaxed">
              Are you sure you want to log out? Your account data will remain safely stored under your email.
            </p>
            <div className="flex gap-4 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsConfirmingLogout(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wider" onClick={handleLogout}>
                LOG OUT
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
