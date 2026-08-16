import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  maxWidth = 'max-w-lg',
}) => {
  const { playClick } = useSound();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full ${maxWidth} glass-panel border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative text-slate-100 animate-scale-up max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2.5 rounded-2xl bg-eco-500/20 text-eco-400 border border-eco-500/30">{icon}</div>}
            <h3 className="text-xl font-black tracking-wide text-white">{title}</h3>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
