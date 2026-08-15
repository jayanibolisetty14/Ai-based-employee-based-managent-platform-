import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">{label}</label>}
      <input
        className={cn(
          "w-full h-14 bg-card border border-border rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-primary-text/10 transition-all placeholder:text-muted/50",
          error && "border-red-500/50 focus:border-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-400 ml-1">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">{label}</label>}
      <textarea
        className={cn(
          "w-full bg-card border border-border rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-primary-text/10 transition-all placeholder:text-muted/50 min-h-[120px] resize-none",
          error && "border-red-500/50 focus:border-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-400 ml-1">{error}</p>}
    </div>
  );
};
