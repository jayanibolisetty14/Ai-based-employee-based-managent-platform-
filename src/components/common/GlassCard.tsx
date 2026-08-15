import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glow?: 'primary' | 'secondary' | 'accent' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverable = false,
  glow = 'none',
  ...props 
}) => {
  const glowStyles = {
    primary: 'hover:shadow-glow-primary',
    secondary: 'hover:shadow-glow-secondary',
    accent: 'hover:shadow-glow-accent',
    none: ''
  };

  return (
    <div 
      className={cn(
        "glass-card p-6",
        hoverable && "hover:bg-primary-text/10 hover:-translate-y-1 cursor-default",
        glow !== 'none' && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
