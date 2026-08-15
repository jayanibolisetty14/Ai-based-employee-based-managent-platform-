import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#05091C]/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-md bg-[#0A1128] border rounded-[32px] shadow-2xl overflow-hidden",
              variant === 'danger' ? "border-red-500/20" : "border-white/10"
            )}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mb-6",
                  variant === 'danger' ? "bg-red-500/10 text-red-400" : "bg-cyan-500/10 text-cyan-400"
                )}>
                  <AlertTriangle size={32} />
                </div>

                <h3 className="text-2xl font-black tracking-tight mb-3">
                  {title}
                </h3>
                
                <p className="text-muted font-bold leading-relaxed mb-8">
                  {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px]"
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    className={cn(
                      "flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg",
                      variant === 'danger' 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
                        : "bg-cyan-500 hover:bg-cyan-600 text-black shadow-cyan-500/20"
                    )}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
