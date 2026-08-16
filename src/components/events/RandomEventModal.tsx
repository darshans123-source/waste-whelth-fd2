import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, Zap, X } from 'lucide-react';
import { RandomEvent } from '../../types/game';
import { Button } from '../common/Button';

interface RandomEventModalProps {
  event: RandomEvent | null;
  onDismiss: () => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({ event, onDismiss }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!event) return;
    const calculateLeft = () => {
      const elapsed = Math.floor((Date.now() - event.startTime) / 1000);
      const remaining = Math.max(0, event.durationSeconds - elapsed);
      setSecondsLeft(remaining);
    };

    calculateLeft();
    const interval = setInterval(calculateLeft, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event || secondsLeft <= 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm w-full animate-slide-up select-none">
      <div className="glass-panel border-2 border-gold-500/50 rounded-3xl p-5 shadow-2xl gold-glow relative bg-slate-900/95">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30">
            {event.icon}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Live City Event
            </span>
            <h4 className="text-base font-black text-white">{event.title}</h4>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">{event.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Timer className="w-4 h-4" />
            <span>Time Left: {secondsLeft}s</span>
          </div>

          <Button size="sm" variant="gold" onClick={onDismiss}>
            Got It!
          </Button>
        </div>
      </div>
    </div>
  );
};
