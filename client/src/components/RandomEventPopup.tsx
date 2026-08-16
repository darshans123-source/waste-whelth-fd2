import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, X } from 'lucide-react';

export const RandomEventPopup: React.FC = () => {
  const { activeEvent } = useGame();
  const [dismissed, setDismissed] = React.useState(false);

  if (!activeEvent || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-sm glass-panel p-4 rounded-2xl border border-amber-500/40 shadow-2xl animate-bounceSubtle flex items-start gap-3">
      <div className="text-3xl">{activeEvent.icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
            Active Environmental Event
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <h4 className="font-bold text-white text-sm">{activeEvent.title}</h4>
        <p className="text-xs text-slate-300">{activeEvent.description}</p>
      </div>
    </div>
  );
};
