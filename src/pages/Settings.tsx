import { useState } from 'react';
import { useWellness } from '@/context/WellnessContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { 
  Sun, 
  Moon, 
  Bell, 
  Download, 
  Trash2, 
  User as UserIcon, 
  LogOut, 
  ArrowRight, 
  Check, 
  X,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { userData, updateNotificationPreferences, updateLanguage, resetData } = useWellness();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { profile, notificationPreferences } = userData;
  const currentName = user?.name || profile.name;
  const currentEmail = user?.email || profile.email;

  const prefs = notificationPreferences || {
    wellnessReminders: true,
    moodCheckinReminders: true,
    goalReminders: true,
    achievementNotifications: true,
    aiMentorInsights: true
  };

  const handleTogglePref = (key: keyof typeof prefs) => {
    updateNotificationPreferences({ [key]: !prefs[key] });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mood_mentor_wellness_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteData = () => {
    resetData();
    logout();
    navigate('/login', { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 text-primary-text">
      {/* Page Header */}
      <div className="space-y-4">
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 uppercase">Settings</h2>
          <p className="text-muted font-bold tracking-tight">Manage your preferences, notifications and account.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Appearance */}
        <GlassCard className="space-y-6">
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-1">
              <Sun size={20} className="text-primary" /> Appearance
            </h3>
            <p className="text-xs text-muted font-bold">Choose how Mood Mentor AI looks.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                "p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border cursor-pointer",
                theme === 'light' 
                  ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(6,182,212,0.25)] text-primary" 
                  : "bg-card border-border hover:bg-primary-text/5 text-muted hover:text-primary-text"
              )}
            >
              <Sun size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                "p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border cursor-pointer",
                theme === 'dark' 
                  ? "bg-secondary/20 border-secondary shadow-[0_0_20px_rgba(139,92,246,0.25)] text-secondary" 
                  : "bg-card border-border hover:bg-primary-text/5 text-muted hover:text-primary-text"
              )}
            >
              <Moon size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Dark Mode</span>
            </button>
          </div>
        </GlassCard>
        
        {/* 2. Language Preference */}
        <GlassCard className="space-y-6">
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-1">
              <Globe size={20} className="text-cyan-400" /> Language Preference
            </h3>
            <p className="text-xs text-muted font-bold">Choose your preferred language for recommendations and humor.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'ta', label: 'தமிழ்' },
              { code: 'kn', label: 'ಕನ್ನಡ' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => updateLanguage(lang.code as any)}
                className={cn(
                  "p-3 rounded-xl border font-bold text-sm transition-all",
                  userData.languagePreference === lang.code 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-card border-border hover:bg-primary-text/5 text-muted hover:text-primary-text"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* 3. Notifications */}
        <GlassCard className="space-y-6">
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-1">
              <Bell size={20} className="text-accent" /> Notifications
            </h3>
            <p className="text-xs text-muted font-bold">Control which notifications you receive.</p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'wellnessReminders', label: 'Wellness reminders', desc: 'Alerts for recommended daily wellness activities' },
              { key: 'moodCheckinReminders', label: 'Mood check-in reminders', desc: 'Daily prompt to log your current emotional state' },
              { key: 'goalReminders', label: 'Goal reminders', desc: 'Progress updates on active personal goals' },
              { key: 'achievementNotifications', label: 'Achievement notifications', desc: 'Alerts when unlocking new milestones' },
              { key: 'aiMentorInsights', label: 'AI Mentor insights', desc: 'Personalized wellbeing recommendations' },
            ].map(item => {
              const isEnabled = prefs[item.key as keyof typeof prefs];
              return (
                <div 
                  key={item.key} 
                  className="flex items-center justify-between p-4 bg-card/60 border border-border/80 rounded-2xl gap-4 hover:border-border transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-primary-text">{item.label}</p>
                    <p className="text-xs text-muted font-medium mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(item.key as keyof typeof prefs)}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors p-1 cursor-pointer shrink-0",
                      isEnabled ? "bg-primary" : "bg-card border border-border"
                    )}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform shadow-sm flex items-center justify-center text-[8px] font-black text-black",
                      isEnabled ? "translate-x-6" : "translate-x-0"
                    )}>
                      {isEnabled ? <Check size={10} className="text-primary stroke-[3]" /> : null}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* 3. Data & Privacy */}
        <GlassCard className="space-y-6">
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-1">
              <Download size={20} className="text-cyan-400" /> Data & Privacy
            </h3>
            <p className="text-xs text-muted font-bold">Your wellness data belongs to you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 justify-between rounded-2xl" onClick={handleExportJSON}>
              <span className="font-bold">Export My Data (JSON)</span>
              <Download size={16} />
            </Button>
          </div>
        </GlassCard>

        {/* 4. Account */}
        <GlassCard className="space-y-6">
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-1">
              <UserIcon size={20} className="text-purple-400" /> Account
            </h3>
            <p className="text-xs text-muted font-bold">Signed in as:</p>
          </div>

          <div className="p-4 bg-card/60 border border-border/80 rounded-2xl space-y-2">
            <p className="font-black text-lg text-primary-text">{currentName}</p>
            <p className="text-xs font-bold text-muted">{currentEmail}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-2xl justify-center font-bold"
              onClick={() => navigate('/profile')}
            >
              Go to Profile <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button 
              className="flex-1 h-12 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-2xl justify-center font-bold uppercase tracking-wider"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" /> Log Out
            </Button>
          </div>
        </GlassCard>

        {/* 5. Delete My Data */}
        <GlassCard className="border-red-500/20 bg-red-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight text-red-400 flex items-center gap-2">
                <Trash2 size={18} /> Delete My Data
              </h3>
              <p className="text-xs text-muted font-bold mt-1">
                This permanently deletes the wellness data associated with this account.
              </p>
            </div>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl px-4 py-2"
              onClick={() => setIsConfirmingDelete(true)}
            >
              Delete My Data
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Confirmation Modal for Delete Data */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsConfirmingDelete(false)} />
          <GlassCard className="w-full max-w-md relative z-10 space-y-6 border-red-500/40">
            <div className="flex items-center justify-between text-red-400">
              <div className="flex items-center gap-2">
                <ShieldAlert size={24} />
                <h3 className="text-xl font-black tracking-tight uppercase">Confirm Data Deletion</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="p-2 bg-card hover:bg-primary-text/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-muted font-bold leading-relaxed">
              Are you sure you want to delete all wellness data for <span className="text-primary-text">{currentEmail}</span>? 
              This will permanently erase your mood logs, streak history, achievements, and goals. This action cannot be undone.
            </p>

            <div className="flex gap-4 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wider" onClick={handleDeleteData}>
                Permanently Delete
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
