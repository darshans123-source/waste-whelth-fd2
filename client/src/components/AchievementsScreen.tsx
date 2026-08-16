import React from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const { achievements } = useGame();

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gold-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Trophy Room</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Milestones & Achievements</h2>
          <p className="text-slate-300 text-sm">
            Unlock legendary badges as you transform your municipality into a zero-waste powerhouse.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-gold-500/30 text-right">
          <div className="text-xs text-slate-400 font-bold">Unlocked Badges</div>
          <div className="text-xl font-extrabold text-amber-400">{unlockedCount} / {achievements.length}</div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((a) => {
          const progressPercent = Math.min(100, Math.round((a.current / a.target) * 100));

          return (
            <div
              key={a.id}
              className={`glass-card p-6 rounded-3xl border flex items-start gap-4 transition-all ${
                a.unlocked
                  ? 'border-gold-500/50 bg-amber-950/20 shadow-lg shadow-gold-500/10'
                  : 'border-slate-800 bg-slate-900/40 grayscale opacity-75'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                {a.icon}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{a.title}</h3>
                  {a.unlocked ? (
                    <span className="flex items-center gap-1 text-xs font-extrabold text-eco-400">
                      <CheckCircle2 className="w-4 h-4" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-medium">{a.description}</p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Target Progress</span>
                    <span>{formatNumber(a.current)} / {formatNumber(a.target)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        a.unlocked ? 'bg-gradient-to-r from-amber-400 to-gold-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards info */}
                <div className="flex gap-2 text-xs font-bold text-slate-400 pt-1">
                  <span className="text-amber-300">+{formatCurrency(a.rewardMoney)}</span>
                  <span>•</span>
                  <span className="text-purple-300">+{a.rewardXP} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
