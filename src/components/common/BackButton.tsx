import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  label?: string;
  fallbackPath?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'glass' | 'ghost' | 'outline';
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallbackPath = '/dashboard',
  onClick,
  className,
  variant = 'glass'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  };

  const variants = {
    glass: 'bg-card/80 hover:bg-card border border-border/80 hover:border-primary/50 text-primary-text shadow-sm hover:shadow-glow-primary',
    ghost: 'bg-transparent text-muted hover:text-primary-text hover:bg-card/50 border border-transparent',
    outline: 'bg-transparent border border-border text-primary-text hover:bg-card/60 hover:border-primary/40'
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer select-none group',
        variants[variant],
        className
      )}
    >
      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-primary shrink-0" />
      <span>{label}</span>
    </button>
  );
};
