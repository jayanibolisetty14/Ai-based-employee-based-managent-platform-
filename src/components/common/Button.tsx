import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-background shadow-glow-primary hover:opacity-90',
    secondary: 'bg-secondary text-primary-text shadow-glow-secondary hover:opacity-90',
    accent: 'bg-accent text-primary-text shadow-glow-accent hover:opacity-90',
    outline: 'bg-transparent border-2 border-border text-primary-text hover:bg-card',
    ghost: 'bg-transparent text-muted hover:text-primary-text hover:bg-card'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };

  return (
    <button 
      className={cn(
        "glass-button flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};
