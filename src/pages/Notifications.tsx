import { useWellness } from '@/context/WellnessContext';
import { GlassCard } from '@/components/common/GlassCard';
import { Bell, CheckCircle2, Info, Trophy, Flame, Trash2, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { BackButton } from '@/components/common/BackButton';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const { userData, markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications } = useWellness();
  const { notifications } = userData;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'wellness':
        return <CheckCircle2 className="text-green-400" />;
      case 'achievement':
        return <Trophy className="text-primary" />;
      case 'streak':
        return <Flame className="text-orange-400" />;
      case 'reminder':
      case 'goal':
        return <Bell className="text-amber-400" />;
      default:
        return <Info className="text-secondary" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Notifications</h2>
          <p className="text-muted font-bold tracking-tight">Stay updated with your activity and progress.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {notifications.some(n => !n.read) && (
            <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
              <CheckCircle2 size={16} className="mr-2 text-primary" /> Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearNotifications}>
              <Trash2 size={16} className="mr-2 text-red-400" /> Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((notif) => (
          <GlassCard 
            key={notif.id} 
            className={cn(
              "p-6 relative group transition-all",
              !notif.read ? "bg-primary-text/10 border-primary/30" : "opacity-60"
            )}
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center shrink-0">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black tracking-tight text-lg">{notif.title}</h4>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-muted font-medium">{notif.message}</p>
              </div>

              <div className="flex gap-2">
                {!notif.read && (
                  <button 
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-2 bg-card hover:bg-primary-text/10 rounded-xl text-primary transition-all cursor-pointer"
                    title="Mark as read"
                    aria-label="Mark as read"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 bg-card hover:bg-red-500/10 hover:text-red-400 rounded-xl text-muted transition-all cursor-pointer"
                  title="Delete notification"
                  aria-label="Delete notification"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </GlassCard>
        )) : (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6">
              <Bell className="text-muted" size={48} />
            </div>
            <h3 className="text-xl font-black mb-2">Silence is golden</h3>
            <p className="text-sm text-muted font-bold max-w-xs">You're all caught up with your updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
