import React from 'react';
import { Trophy, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Card } from '../common/Card';

export const AchievementsScreen: React.FC = () => {
  const { gameState } = useGame();

  if (!gameState) return null;

  const unlockedCount = gameState.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-2xl font-black text-white">Hall of Achievements</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Unlock legendary badges, milestone bonuses, and circular sustainability accolades.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
          {unlockedCount} / {gameState.achievements.length} Badges Unlocked
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameState.achievements.map((ach) => {
          const isUnlocked = ach.unlocked;

          return (
            <Card
              key={ach.id}
              className={`flex flex-col justify-between space-y-4 transition-all duration-300 ${
                isUnlocked
                  ? 'border-amber-500/40 gold-glow bg-slate-900/90'
                  : 'opacity-60 grayscale bg-slate-900/40 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-500 border border-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="font-black text-base text-white">{ach.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ach.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Milestone:</span>
                <span className="font-mono font-bold text-slate-200">
                  {ach.category === 'money'
                    ? `₹${ach.requirement.toLocaleString()}`
                    : ach.category === 'level'
                    ? `Level ${ach.requirement}`
                    : `${ach.requirement} pts/kg`}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
